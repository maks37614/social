import express, { type Request, type Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import argon2 from "argon2";
import nodemailer from "nodemailer";
import { createSocialPool } from "./database";
import { registerSocialRelations } from "./relations";

const pool = createSocialPool();
const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});
const origin = process.env.SOCIAL_APP_ORIGIN;
if (!origin || !/^https?:\/\/[^/]+$/.test(origin)) throw new Error("SOCIAL_APP_ORIGIN required");
const production = process.env.NODE_ENV === "production";
if (production && !origin.startsWith("https://")) throw new Error("HTTPS origin required in production");
const cookieName = "social_session";
const smtpUrl = process.env.SOCIAL_SMTP_URL;
const mailFrom = process.env.SOCIAL_MAIL_FROM;
if (!smtpUrl || !mailFrom) throw new Error("Social SMTP configuration required for verified registration");
const mailer = nodemailer.createTransport(smtpUrl);
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const cookies = (req: Request) => Object.fromEntries((req.headers.cookie ?? "").split(";").map(v => {
  const i = v.indexOf("=");
  return i < 0 ? ["", ""] : [v.slice(0, i).trim(), v.slice(i + 1).trim()];
}));
function cookie(res: Response, value: string, age: number) {
  res.cookie(cookieName, value, { httpOnly: true, secure: production, sameSite: "strict", path: "/", maxAge: age });
}
type User = { id: string; email: string; display_name: string; email_verified: boolean };
async function current(req: Request): Promise<User | null> {
  const token = cookies(req)[cookieName];
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const { rows } = await pool.query<User>(
    "SELECT u.id,u.email,u.display_name,u.email_verified FROM social_sessions s JOIN social_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now()",
    [hash(token)]
  );
  return rows[0] ?? null;
}
function wrap(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response) => { void fn(req, res).catch(error => {
    console.error("Social API request failed", error?.code ?? error?.name ?? "unknown");
    if (!res.headersSent) res.status(500).json({ error: "Server error" });
  }); };
}
function bad(res: Response, message: string, status = 400) { res.status(status).json({ error: message }); }
async function authenticated(req: Request, res: Response): Promise<User | null> {
  const user = await current(req);
  if (!user) bad(res, "Sign in required", 401);
  return user;
}
app.use("/api", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  if (req.get("origin") !== origin) return bad(res, "Invalid origin", 403);
  next();
});
const rate = new Map<string, { count: number; reset: number }>();
function limit(req: Request, res: Response, next: () => void) {
  const key = req.ip ?? "unknown";
  const now = Date.now(), prev = rate.get(key);
  const state = !prev || prev.reset < now ? { count: 0, reset: now + 60000 } : prev;
  state.count++;
  rate.set(key, state);
  if (state.count > 30) return bad(res, "Too many requests", 429);
  next();
}
app.post("/api/social/register", limit, wrap(async (req, res) => {
  const { email, password, displayName } = req.body ?? {};
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      typeof password !== "string" || password.length < 15 || password.length > 256 ||
      typeof displayName !== "string" || !displayName.trim() || displayName.length > 100)
    return bad(res, "Invalid registration data");
  const encoded = await argon2.hash(password, { type: argon2.argon2id });
  try {
    const { rows } = await pool.query<{id:string}>("INSERT INTO social_users(email,password_hash,display_name) VALUES($1,$2,$3) RETURNING id", [email.toLowerCase(), encoded, displayName.trim()]);
    const token = randomBytes(32).toString("hex");
    await pool.query("INSERT INTO social_verification_tokens(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '24 hours')", [hash(token), rows[0].id]);
    await mailer.sendMail({ from: mailFrom, to: email.toLowerCase(), subject: "Підтвердіть Social email",
      text: `Відкрийте посилання для підтвердження email: ${origin}/api/social/verify?token=${token}` });
    res.status(201).json({ success: true, emailVerificationRequired: true });
  } catch (e: any) {
    if (e.code === "23505") return bad(res, "Account already exists", 409);
    throw e;
  }
}));
app.get("/api/social/verify", wrap(async (req, res) => {
  const token = req.query.token;
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token)) return bad(res, "Invalid token");
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{user_id:string}>(
      "DELETE FROM social_verification_tokens WHERE token_hash=$1 AND expires_at>now() RETURNING user_id",
      [hash(token)]);
    if (!rows[0]) { await client.query("ROLLBACK"); return bad(res, "Expired or invalid token", 400); }
    await client.query("UPDATE social_users SET email_verified=true WHERE id=$1", [rows[0].user_id]);
    await client.query("COMMIT");
    res.type("text/plain").send("Email підтверджено. Можете увійти до Social.");
  } catch (e) { await client.query("ROLLBACK"); throw e; }
  finally { client.release(); }
}));
app.post("/api/social/password-reset/request", limit, wrap(async (req,res) => {
  const email = req.body?.email;
  if (typeof email !== "string" || email.length > 254) return bad(res,"Invalid email");
  const { rows } = await pool.query<{id:string}>("SELECT id FROM social_users WHERE email=$1 AND email_verified=true",[email.toLowerCase()]);
  if (rows[0]) {
    const token = randomBytes(32).toString("hex");
    await pool.query("DELETE FROM social_password_reset_tokens WHERE user_id=$1",[rows[0].id]);
    await pool.query("INSERT INTO social_password_reset_tokens(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '30 minutes')",[hash(token),rows[0].id]);
    await mailer.sendMail({from:mailFrom,to:email.toLowerCase(),subject:"Відновлення пароля Social",
      text:`Якщо ви запитували відновлення, відкрийте ${origin}/?resetToken=${token}. Посилання діє 30 хвилин.`});
  }
  res.json({success:true,message:"Якщо акаунт існує, лист надіслано."});
}));
app.post("/api/social/password-reset/confirm", limit, wrap(async (req,res) => {
  const token = req.body?.token, password = req.body?.password;
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/.test(token) ||
      typeof password !== "string" || password.length < 15 || password.length > 256)
    return bad(res,"Invalid reset data");
  const encoded = await argon2.hash(password,{type:argon2.argon2id});
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const {rows} = await client.query<{user_id:string}>(
      "DELETE FROM social_password_reset_tokens WHERE token_hash=$1 AND expires_at>now() RETURNING user_id",[hash(token)]);
    if (!rows[0]) {await client.query("ROLLBACK");return bad(res,"Expired or invalid reset token",400);}
    await client.query("UPDATE social_users SET password_hash=$2 WHERE id=$1",[rows[0].user_id,encoded]);
    await client.query("DELETE FROM social_sessions WHERE user_id=$1",[rows[0].user_id]);
    await client.query("DELETE FROM social_password_reset_tokens WHERE user_id=$1",[rows[0].user_id]);
    await client.query("COMMIT");
    res.json({success:true});
  } catch(e) {await client.query("ROLLBACK");throw e;}
  finally {client.release();}
}));
app.post("/api/social/login", limit, wrap(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") return bad(res, "Invalid credentials", 401);
  const { rows } = await pool.query<{ id: string; password_hash: string; email_verified: boolean }>(
    "SELECT id,password_hash,email_verified FROM social_users WHERE email=$1", [email.toLowerCase()]
  );
  if (!rows[0] || !(await argon2.verify(rows[0].password_hash, password))) return bad(res, "Invalid credentials", 401);
  if (!rows[0].email_verified) return bad(res, "Email verification required", 403);
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO social_sessions(token_hash,user_id,expires_at) VALUES($1,$2,now()+interval '7 days')", [hash(token), rows[0].id]);
  cookie(res, token, 7 * 86400000);
  res.json({ success: true });
}));
app.post("/api/social/logout", wrap(async (req, res) => {
  const token = cookies(req)[cookieName];
  if (token) await pool.query("DELETE FROM social_sessions WHERE token_hash=$1", [hash(token)]);
  cookie(res, "", 0);
  res.json({ success: true });
}));
app.get("/api/social/me", wrap(async (req, res) => {
  const user = await current(req);
  res.json({ user });
}));
app.get("/api/community/feed", wrap(async (req, res) => {
  const user = await authenticated(req, res);
  if (!user) return;
  const mode = req.query.mode === "friends" ? "friends" : "public";
  const before = req.query.before;
  if (before !== undefined && (typeof before !== "string" ||
      !/^\\d{4}-\\d{2}-\\d{2}T[^|]+\\|[0-9a-f-]{36}$/i.test(before)))
    return bad(res,"Invalid pagination cursor");
  const cursor = typeof before === "string" ? before.split("|") : null;
  if (cursor && (!Number.isFinite(Date.parse(cursor[0])) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cursor[1])))
    return bad(res,"Invalid pagination cursor");
  const { rows } = await pool.query(
    `SELECT p.id,p.body,p.created_at,p.author_id,p.audience,u.display_name
     FROM social_posts p JOIN social_users u ON u.id=p.author_id
     WHERE (p.author_id=$1 OR
       (p.audience='public' AND $2='public') OR
       (p.audience IN ('public','friends') AND $2='friends' AND EXISTS (
         SELECT 1 FROM social_friend_requests f WHERE f.status='accepted'
         AND ((f.sender_id=$1 AND f.recipient_id=p.author_id)
         OR (f.recipient_id=$1 AND f.sender_id=p.author_id))
       )))
       AND ($3::timestamptz IS NULL OR (p.created_at,p.id) < ($3::timestamptz,$4::uuid))
     ORDER BY p.created_at DESC,p.id DESC LIMIT 41`,
    [user.id,mode,cursor?.[0] ?? null,cursor?.[1] ?? null]
  );
  const page=rows.slice(0,40);
  const last=page.at(-1);
  res.json({ success:true, items:page.map(r => ({
    id:r.id,kind:"post",body:{text:r.body},ownerId:r.author_id,
    authorName:r.display_name,createdAt:r.created_at,audience:r.audience
  })),next:rows.length>40 && last ? new Date(last.created_at).toISOString()+"|"+last.id : null });
}));
app.post("/api/community/items", limit, wrap(async (req, res) => {
  const user = await authenticated(req, res);
  if (!user) return;
  const body = req.body?.body;
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 5000) return bad(res, "Post must contain 1–5000 characters");
  const audience = req.body?.audience ?? "public";
  if (!["public", "friends", "private"].includes(audience)) return bad(res, "Unsupported audience");
  const { rows } = await pool.query("INSERT INTO social_posts(author_id,body,audience) VALUES($1,$2,$3) RETURNING id", [user.id, text, audience]);
  res.status(201).json({ success:true, id:rows[0].id });
}));
app.post("/api/community/items/:id/reaction", limit, wrap(async (req, res) => {
  const user = await authenticated(req, res);
  if (!user) return;
  if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) return bad(res, "Invalid post id");
  const emoji = req.body?.emoji;
  if (!["👍","❤️","🔥","🤔","👏"].includes(emoji)) return bad(res, "Invalid reaction");
  const result = await pool.query(
    "INSERT INTO social_reactions(post_id,user_id,emoji) SELECT id,$2,$3 FROM social_posts WHERE id=$1 AND (audience='public' OR author_id=$2 OR (audience='friends' AND EXISTS (SELECT 1 FROM social_friend_requests f WHERE f.status='accepted' AND ((f.sender_id=$2 AND f.recipient_id=social_posts.author_id) OR (f.recipient_id=$2 AND f.sender_id=social_posts.author_id))))) ON CONFLICT(post_id,user_id) DO UPDATE SET emoji=EXCLUDED.emoji RETURNING post_id",
    [req.params.id,user.id,emoji]
  );
  if (!result.rowCount) return bad(res, "Post not found", 404);
  res.json({ success:true });
}));
app.get("/api/community/items/:id/comments", wrap(async (req,res) => {
  const user = await authenticated(req,res); if (!user) return;
  if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) return bad(res,"Invalid post id");
  const { rows } = await pool.query(
    `SELECT c.id,c.body,c.created_at AS "createdAt",c.author_id AS "authorId",
      u.display_name AS "authorName"
      FROM social_comments c JOIN social_users u ON u.id=c.author_id
      JOIN social_posts p ON p.id=c.post_id
      WHERE c.post_id=$1 AND (p.author_id=$2 OR p.audience='public'
        OR (p.audience='friends' AND EXISTS (
          SELECT 1 FROM social_friend_requests f WHERE f.status='accepted'
          AND ((f.sender_id=$2 AND f.recipient_id=p.author_id)
            OR (f.recipient_id=$2 AND f.sender_id=p.author_id)))))
      ORDER BY c.created_at ASC,c.id ASC LIMIT 100`,
    [req.params.id,user.id]);
  res.json({success:true,items:rows});
}));
app.post("/api/community/items/:id/comments", limit, wrap(async (req,res) => {
  const user = await authenticated(req,res); if (!user) return;
  if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) return bad(res,"Invalid post id");
  const body = typeof req.body?.body === "string" ? req.body.body.trim() : "";
  if (!body || body.length > 2000) return bad(res,"Comment must contain 1–2000 characters");
  const {rows} = await pool.query(
    `INSERT INTO social_comments(post_id,author_id,body)
     SELECT p.id,$2,$3 FROM social_posts p
     WHERE p.id=$1 AND (p.author_id=$2 OR p.audience='public'
       OR (p.audience='friends' AND EXISTS (
         SELECT 1 FROM social_friend_requests f WHERE f.status='accepted'
         AND ((f.sender_id=$2 AND f.recipient_id=p.author_id)
         OR (f.recipient_id=$2 AND f.sender_id=p.author_id)))))
     RETURNING id`,[req.params.id,user.id,body]);
  if (!rows[0]) return bad(res,"Post not found",404);
  res.status(201).json({success:true,id:rows[0].id});
}));
// Shared mutation guard for profile, friendship and private-message endpoints.
app.use("/api/social", (req,res,next) => {
  if (["GET","HEAD","OPTIONS"].includes(req.method)) return next();
  return limit(req,res,next);
});
registerSocialRelations(app, pool, authenticated);
app.get("/api/social/health", (_req, res) => res.json({ status:"ok" }));
async function start() {
  // Explicit opt-in: never migrate an unknown database automatically.
  if (process.env.SOCIAL_RUN_MIGRATIONS === "1") {
    const sql = await readFile(fileURLToPath(new URL("./schema.sql", import.meta.url)), "utf8");
    await pool.query(sql);
  }
  const port = Number(process.env.SOCIAL_PORT ?? 3100);
  app.listen(port, "127.0.0.1", () => console.log(`Social API listening on 127.0.0.1:${port}`));
}
void start().catch(e => { console.error("Social API startup failed", e.message); process.exitCode = 1; });
