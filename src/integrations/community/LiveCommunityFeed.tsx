import { useEffect, useState } from "react";
import { createCommunityPost, getCommunityFeed, reactToCommunityItem, type CommunityItem } from "./api";

type Comment = {id:string;body:string;authorName:string;createdAt:string};
function PostComments({postId}:{postId:string}) {
  const [open,setOpen]=useState(false);
  const [comments,setComments]=useState<Comment[]>([]);
  const [draft,setDraft]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const load=async()=>{
    try {
      const r=await fetch("/api/community/items/"+encodeURIComponent(postId)+"/comments",{credentials:"same-origin",cache:"no-store"});
      const data=await r.json();if(!r.ok)throw new Error(data.error??"Cannot load comments");
      setComments(data.items);setError("");
    }catch(e){setError(e instanceof Error?e.message:"Помилка коментарів");}
  };
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();if(!draft.trim()||busy)return;setBusy(true);
    try {
      const r=await fetch("/api/community/items/"+encodeURIComponent(postId)+"/comments",{
        method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({body:draft.trim()})});
      const data=await r.json();if(!r.ok)throw new Error(data.error??"Cannot publish comment");
      setDraft("");await load();
    }catch(e){setError(e instanceof Error?e.message:"Помилка публікації");}
    finally{setBusy(false);}
  };
  return <div className="space-y-2">
    <button className="text-sm text-emerald-300" aria-expanded={open} onClick={()=>{
      if(!open)void load();setOpen(!open);
    }}>{open?"Сховати коментарі":"Коментарі"}</button>
    {open&&<div className="space-y-2">
      {comments.map(c=><div key={c.id} className="rounded-lg bg-slate-950 p-2">
        <p className="text-xs text-slate-400">{c.authorName} · {new Date(c.createdAt).toLocaleString("uk-UA")}</p>
        <p className="whitespace-pre-wrap break-words">{c.body}</p>
      </div>)}
      <form onSubmit={submit} className="flex gap-2">
        <input aria-label="Новий коментар" maxLength={2000} value={draft}
          onChange={e=>setDraft(e.target.value)} className="min-w-0 flex-1 rounded-lg bg-slate-950 p-2"/>
        <button disabled={busy||!draft.trim()} className="text-emerald-300">Написати</button>
      </form>
      {error&&<p role="alert" className="text-amber-300">{error}</p>}
    </div>}
  </div>;
}
export function LiveCommunityFeed() {
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [mode, setMode] = useState<"public"|"friends">("public");
  const [audience, setAudience] = useState<"public"|"friends"|"private">("public");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    setLoading(true);
    try {
      const result = await getCommunityFeed(mode);
      setItems(result.items);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Community unavailable");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void refresh(); }, [mode]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || busy) return;
    setBusy(true);
    try {
      await createCommunityPost({ body: { text: text.trim() }, audience });
      setText("");
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not publish");
    } finally { setBusy(false); }
  };
  return <section className="mx-auto max-w-3xl space-y-4 text-slate-100">
    <header><h2 className="text-xl font-bold">Community · живі дані</h2>
      <p className="text-sm text-slate-400">Окрема база Social. Демонстраційні пости тут не показуються.</p></header>
    <div className="flex gap-2" role="group" aria-label="Режим стрічки">
      <button aria-pressed={mode==="public"} onClick={()=>setMode("public")} className="rounded-lg border border-slate-700 px-3 py-2">Публічна</button>
      <button aria-pressed={mode==="friends"} onClick={()=>setMode("friends")} className="rounded-lg border border-slate-700 px-3 py-2">Друзі</button>
    </div>
    <form onSubmit={submit} className="rounded-2xl border border-slate-700 bg-slate-900 p-4 space-y-3">
      <label htmlFor="social-post">Новий допис</label>
      <textarea id="social-post" maxLength={5000} value={text} onChange={e => setText(e.target.value)}
        className="w-full rounded-lg bg-slate-950 border border-slate-700 p-3" rows={3}/>
      <label className="block">Кому видно допис
        <select value={audience} onChange={e=>setAudience(e.target.value as typeof audience)}
          className="ml-2 rounded-lg bg-slate-950 border border-slate-700 p-2">
          <option value="public">Усім</option><option value="friends">Друзям</option><option value="private">Тільки мені</option>
        </select>
      </label>
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
        <PostComments postId={item.id}/>
      </article>)}
  </section>;
}
