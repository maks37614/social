import type { Express, Request, Response } from "express";
import type { Pool } from "pg";
type User = { id: string };
type Auth = (req: Request, res: Response) => Promise<User | null>;
const uuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const error = (res: Response, status: number, message: string) => res.status(status).json({ error: message });
const handler = (fn: (req: Request, res: Response) => Promise<void>) =>
  (req: Request, res: Response) => { void fn(req,res).catch((e) => {
    console.error("Social relations request failed", e?.code ?? "unknown");
    if (!res.headersSent) error(res, 500, "Server error");
  }); };
export function registerSocialRelations(app: Express, pool: Pool, auth: Auth) {
  async function friends(a: string, b: string) {
    const { rowCount } = await pool.query(
      `SELECT 1 FROM social_friend_requests
       WHERE status='accepted' AND ((sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1))`,
      [a,b]);
    return Boolean(rowCount);
  }
  app.get("/api/social/profiles/:id", handler(async (req,res) => {
    const viewer = await auth(req,res); if (!viewer) return;
    if (!uuid(req.params.id)) return void error(res,400,"Invalid user id");
    const { rows } = await pool.query(
      `SELECT u.id,u.display_name,p.bio,p.bio_audience,p.public_enabled
       FROM social_users u LEFT JOIN social_profiles p ON p.user_id=u.id WHERE u.id=$1`,[req.params.id]);
    const profile = rows[0]; if (!profile) return void error(res,404,"Profile not found");
    const self = viewer.id === profile.id;
    const friend = !self && await friends(viewer.id,profile.id);
    const visible = self || (profile.public_enabled && (profile.bio_audience === "public" ||
      (profile.bio_audience === "friends" && friend)));
    res.json({ userId:profile.id, displayName:profile.display_name,
      bio:visible ? profile.bio ?? "" : null,
      publicEnabled:profile.public_enabled === true, isFriend:friend, isSelf:self });
  }));
  app.put("/api/social/profile", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const { bio, bioAudience, publicEnabled } = req.body ?? {};
    if (typeof bio !== "string" || bio.length > 2000 ||
      !["private","friends","public"].includes(bioAudience) || typeof publicEnabled !== "boolean")
      return void error(res,400,"Invalid profile");
    await pool.query(
      `INSERT INTO social_profiles(user_id,bio,bio_audience,public_enabled) VALUES($1,$2,$3,$4)
       ON CONFLICT(user_id) DO UPDATE SET bio=EXCLUDED.bio,bio_audience=EXCLUDED.bio_audience,
       public_enabled=EXCLUDED.public_enabled,updated_at=now()`,
      [user.id,bio,bioAudience,publicEnabled]);
    res.json({ success:true });
  }));
  app.post("/api/social/friends/requests", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const recipient = req.body?.recipientId;
    if (!uuid(recipient) || recipient === user.id) return void error(res,400,"Invalid recipient");
    const existing = await pool.query(
      `SELECT sender_id,recipient_id,status FROM social_friend_requests
       WHERE (sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1)`,[user.id,recipient]);
    if (existing.rowCount) return void error(res,409,"Friendship or request already exists");
    try {
      const result = await pool.query(
        `INSERT INTO social_friend_requests(sender_id,recipient_id) SELECT $1,id FROM social_users WHERE id=$2
         ON CONFLICT DO NOTHING RETURNING sender_id`,[user.id,recipient]);
      if (!result.rowCount) return void error(res,404,"User not found or request exists");
      res.status(201).json({ success:true });
    } catch(e: any) { if (e.code==="23505") return void error(res,409,"Request exists"); throw e; }
  }));
  app.get("/api/social/friends/requests", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const { rows } = await pool.query(
      `SELECT r.sender_id AS "senderId",u.display_name AS "senderName",r.created_at AS "createdAt"
       FROM social_friend_requests r JOIN social_users u ON u.id=r.sender_id
       WHERE r.recipient_id=$1 AND r.status='pending' ORDER BY r.created_at DESC LIMIT 100`,[user.id]);
    res.json({ items:rows });
  }));
  app.post("/api/social/friends/requests/:senderId/respond", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    if (!uuid(req.params.senderId) || !["accepted","declined"].includes(req.body?.status))
      return void error(res,400,"Invalid response");
    const result = await pool.query(
      `UPDATE social_friend_requests SET status=$3,updated_at=now()
       WHERE sender_id=$1 AND recipient_id=$2 AND status='pending' RETURNING sender_id`,
      [req.params.senderId,user.id,req.body.status]);
    if (!result.rowCount) return void error(res,404,"Pending request not found");
    res.json({ success:true });
  }));
  app.get("/api/social/friends", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const { rows } = await pool.query(
      `SELECT u.id,u.display_name AS "displayName" FROM social_friend_requests r
       JOIN social_users u ON u.id=CASE WHEN r.sender_id=$1 THEN r.recipient_id ELSE r.sender_id END
       WHERE (r.sender_id=$1 OR r.recipient_id=$1) AND r.status='accepted'
       ORDER BY u.display_name LIMIT 200`,[user.id]);
    res.json({ items:rows });
  }));
  app.post("/api/social/messages", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const recipient = req.body?.recipientId, body = req.body?.body;
    if (!uuid(recipient) || recipient === user.id || typeof body !== "string" ||
        !body.trim() || body.trim().length > 4000) return void error(res,400,"Invalid message");
    if (!await friends(user.id,recipient)) return void error(res,403,"Messaging requires accepted friendship");
    const { rows } = await pool.query(
      `INSERT INTO social_messages(sender_id,recipient_id,body) VALUES($1,$2,$3)
       RETURNING id,created_at AS "createdAt"`,[user.id,recipient,body.trim()]);
    res.status(201).json({ success:true,...rows[0] });
  }));
  app.get("/api/social/messages/:peerId", handler(async (req,res) => {
    const user = await auth(req,res); if (!user) return;
    const peer = req.params.peerId;
    if (!uuid(peer)) return void error(res,400,"Invalid peer");
    if (!await friends(user.id,peer)) return void error(res,403,"Messaging requires accepted friendship");
    const { rows } = await pool.query(
      `SELECT id,sender_id AS "senderId",recipient_id AS "recipientId",body,
       created_at AS "createdAt" FROM social_messages
       WHERE (sender_id=$1 AND recipient_id=$2) OR (sender_id=$2 AND recipient_id=$1)
       ORDER BY created_at DESC,id DESC LIMIT 100`,[user.id,peer]);
    res.json({ items:rows.reverse() });
  }));
}
