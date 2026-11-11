import { useEffect, useState, type FormEvent, type ReactNode } from "react";

type Identity = { id: string; email: string; display_name: string };
async function request(path: string, body?: object) {
  const response = await fetch("/api/social/" + path, {
    method: body ? "POST" : "GET",
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
export function SocialIdentityGate({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    try { setUser((await request("me")).user); }
    catch (e) { setMessage(e instanceof Error ? e.message : "API unavailable"); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage("");
    try {
      await request(mode, mode === "register" ? { email, password, displayName } : { email, password });
      setPassword("");
      if (mode === "register") {
        setMessage("Перевірте email для підтвердження акаунта.");
        setMode("login");
      } else await refresh();
    } catch (e) { setMessage(e instanceof Error ? e.message : "Помилка входу"); }
    finally { setBusy(false); }
  };
  if (loading) return <p role="status">Перевірка сесії Social…</p>;
  if (user) return <div className="space-y-4">
    <div className="flex justify-between items-center text-sm text-slate-300">
      <span>Ви увійшли як {user.display_name}</span>
      <button onClick={async () => { try { await request("logout", {}); setUser(null); } catch (e) { setMessage(String(e)); } }} className="underline">Вийти</button>
    </div>
    {children}
  </div>;
  return <section className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-5 space-y-4 text-slate-100">
    <h2 className="text-xl font-bold">{mode === "login" ? "Увійти до Social" : "Створити акаунт Social"}</h2>
    <p className="text-sm text-slate-400">Окремий акаунт, незалежний від h00k.</p>
    <form onSubmit={submit} className="space-y-3">
      {mode === "register" && <label className="block">Ім’я<input required maxLength={100} value={displayName} onChange={e => setDisplayName(e.target.value)} className="block w-full bg-slate-950 rounded-lg p-2"/></label>}
      <label className="block">Email<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full bg-slate-950 rounded-lg p-2"/></label>
      <label className="block">Пароль<input required type="password" minLength={15} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} className="block w-full bg-slate-950 rounded-lg p-2"/></label>
      <button disabled={busy} className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-950">{busy ? "Зачекайте…" : mode === "login" ? "Увійти" : "Зареєструватися"}</button>
    </form>
    {message && <p role="status">{message}</p>}
    <button className="text-sm underline" onClick={() => { setMode(mode === "login" ? "register" : "login"); setMessage(""); }}>
      {mode === "login" ? "Створити новий акаунт" : "У мене вже є акаунт"}
    </button>
  </section>;
}
