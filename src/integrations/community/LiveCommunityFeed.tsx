import { useEffect, useState } from "react";
import { createCommunityPost, getCommunityFeed, reactToCommunityItem, type CommunityItem } from "./api";

export function LiveCommunityFeed() {
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    setLoading(true);
    try {
      const result = await getCommunityFeed();
      setItems(result.items);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Community unavailable");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void refresh(); }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await createCommunityPost({ body: { text: text.trim() }, audience: "public" });
      setText("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not publish");
    } finally { setBusy(false); }
  };
  return <section className="mx-auto max-w-3xl space-y-4 text-slate-100">
    <header><h2 className="text-xl font-bold">Community · живі дані</h2>
      <p className="text-sm text-slate-400">Окрема база Social. Демонстраційні пости тут не показуються.</p></header>
    <form onSubmit={submit} className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
      <label htmlFor="social-post">Новий публічний допис</label>
      <textarea id="social-post" maxLength={5000} value={text} onChange={e => setText(e.target.value)}
        className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3" rows={3}/>
      <button disabled={busy || !text.trim()} className="rounded-lg bg-emerald-500 px-4 py-2 text-slate-950 disabled:opacity-50">
        {busy ? "Публікація…" : "Опублікувати"}</button>
    </form>
    {error && <p role="alert" className="rounded-lg border border-amber-700 p-3 text-amber-300">{error}</p>}
    {loading ? <p role="status">Завантаження…</p> : items.length === 0 ? <p>Поки немає публікацій.</p> :
      items.map(item => <article key={item.id} className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-2">
        <p className="text-sm text-slate-400">{String(item.authorName ?? "Трейдер")} · {item.createdAt ? new Date(item.createdAt).toLocaleString("uk-UA") : ""}</p>
        <p className="whitespace-pre-wrap break-words">{String((item.body as {text?: string})?.text ?? "")}</p>
        <button className="text-emerald-300 text-sm" onClick={async () => {
          try { await reactToCommunityItem(item.id, "👍"); setError(""); }
          catch (e) { setError(e instanceof Error ? e.message : "Reaction failed"); }
        }}>👍 Підтримати</button>
      </article>)}
  </section>;
}
