import { useEffect, useState } from "react";

type Friend = { id:string; displayName:string };
type Request = { senderId:string; senderName:string };
type Message = { id:string; senderId:string; body:string; createdAt:string };
async function api<T>(path:string, method="GET", body?:object):Promise<T> {
  const response = await fetch("/api/social/"+path,{method,credentials:"same-origin",
    headers:body?{"Content-Type":"application/json"}:undefined,
    body:body?JSON.stringify(body):undefined,cache:"no-store"});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  return data;
}
export function SocialConnections() {
  const [friends,setFriends]=useState<Friend[]>([]);
  const [requests,setRequests]=useState<Request[]>([]);
  const [peer,setPeer]=useState("");
  const [messages,setMessages]=useState<Message[]>([]);
  const [recipient,setRecipient]=useState("");
  const [search,setSearch]=useState("");
  const [results,setResults]=useState<Friend[]>([]);
  const [draft,setDraft]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const refresh=async()=>{
    try {
      const [f,r]=await Promise.all([api<{items:Friend[]}>("friends"),api<{items:Request[]}>("friends/requests")]);
      setFriends(f.items);setRequests(r.items);setError("");
    }catch(e){setError(e instanceof Error?e.message:"Network error");}
  };
  const load=async(id:string)=>{
    setPeer(id);
    try{setMessages((await api<{items:Message[]}>(`messages/${encodeURIComponent(id)}`)).items);setError("");}
    catch(e){setError(e instanceof Error?e.message:"Could not load messages");}
  };
  useEffect(()=>{void refresh();},[]);
  const action=async(fn:()=>Promise<unknown>)=>{
    setBusy(true);setError("");
    try{await fn();await refresh();}
    catch(e){setError(e instanceof Error?e.message:"Action failed");}
    finally{setBusy(false);}
  };
  return <section className="mx-auto max-w-3xl space-y-4 text-slate-100">
    <h2 className="text-xl font-bold">Друзі та повідомлення</h2>
    {error&&<p role="alert" className="text-amber-300">{error}</p>}
    <form className="space-y-2" onSubmit={e=>{e.preventDefault();void (async()=>{
      try {
        const r=await api<{items:Friend[]}>("users/search?q="+encodeURIComponent(search.trim()));
        setResults(r.items);setError("");
      }catch(e){setError(e instanceof Error?e.message:"Помилка пошуку");}
    })();}}>
      <label className="block text-sm">Знайти користувачів, які відкрили профіль</label>
      <div className="flex gap-2">
        <input value={search} minLength={2} maxLength={60} onChange={e=>setSearch(e.target.value)}
          placeholder="Ім’я користувача" className="min-w-0 flex-1 rounded-lg bg-slate-950 p-2"/>
        <button className="rounded-lg border border-slate-600 px-3">Знайти</button>
      </div>
      {results.map(u=><div key={u.id} className="flex items-center gap-2 rounded-lg border border-slate-700 p-2">
        <span className="flex-1">{u.displayName}</span>
        <button type="button" disabled={busy} onClick={()=>void action(()=>api("friends/requests","POST",{recipientId:u.id}))}
          className="text-emerald-300">Додати</button>
      </div>)}
    </form>
    <form className="flex flex-wrap gap-2" onSubmit={e=>{e.preventDefault();void action(async()=>{
      await api("friends/requests","POST",{recipientId:recipient.trim()});setRecipient("");
    });}}>
      <input aria-label="ID користувача" placeholder="UUID користувача" value={recipient} onChange={e=>setRecipient(e.target.value)}
        className="min-w-0 flex-1 rounded-lg bg-slate-950 p-2" required/>
      <button disabled={busy} className="rounded-lg bg-emerald-500 px-3 text-slate-950">Додати в друзі</button>
    </form>
    {requests.length>0&&<div className="space-y-2">
      <h3 className="font-semibold">Вхідні заявки</h3>
      {requests.map(r=><div key={r.senderId} className="flex items-center gap-3 rounded-lg border border-slate-700 p-3">
        <span className="flex-1">{r.senderName}</span>
        <button disabled={busy} onClick={()=>void action(()=>api(`friends/requests/${r.senderId}/respond`,"POST",{status:"accepted"}))}>Прийняти</button>
        <button disabled={busy} onClick={()=>void action(()=>api(`friends/requests/${r.senderId}/respond`,"POST",{status:"declined"}))}>Відхилити</button>
      </div>)}
    </div>}
    <div className="space-y-2"><h3 className="font-semibold">Мої друзі</h3>
      {friends.length===0?<p className="text-slate-400">Поки немає друзів.</p>:
      friends.map(f=><button key={f.id} onClick={()=>void load(f.id)}
        className={"block w-full rounded-lg border p-3 text-left "+(peer===f.id?"border-emerald-500":"border-slate-700")}>
        {f.displayName}</button>)}
    </div>
    {peer&&<div className="space-y-3 rounded-xl border border-slate-700 p-4">
      <h3 className="font-semibold">Приватна розмова</h3>
      <div className="max-h-96 overflow-auto space-y-2" aria-live="polite">
        {messages.map(m=><div key={m.id} className="rounded-lg bg-slate-800 p-3">
          <p className="whitespace-pre-wrap break-words">{m.body}</p>
          <time className="text-xs text-slate-400">{new Date(m.createdAt).toLocaleString("uk-UA")}</time>
        </div>)}
      </div>
      <form onSubmit={e=>{e.preventDefault();void action(async()=>{
        await api("messages","POST",{recipientId:peer,body:draft});setDraft("");await load(peer);
      });}} className="flex gap-2">
        <input aria-label="Текст повідомлення" maxLength={4000} value={draft} onChange={e=>setDraft(e.target.value)}
          className="min-w-0 flex-1 rounded-lg bg-slate-950 p-2" required/>
        <button disabled={busy||!draft.trim()} className="rounded-lg bg-emerald-500 px-3 text-slate-950">Надіслати</button>
      </form>
    </div>}
  </section>;
}
