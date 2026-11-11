import { useEffect, useState, type FormEvent } from "react";

type Profile = { userId:string; displayName:string; bio:string|null; publicEnabled:boolean; bioAudience?:"private"|"friends"|"public"; isSelf:boolean };
async function call<T>(path:string, method="GET", body?:object):Promise<T> {
  const r=await fetch("/api/social/"+path,{method,credentials:"same-origin",cache:"no-store",
    headers:body?{"Content-Type":"application/json"}:undefined,body:body?JSON.stringify(body):undefined});
  const data=await r.json();
  if(!r.ok)throw new Error(data.error??"Request failed");
  return data;
}
export function SocialProfileSettings({userId}:{userId:string}) {
  const [bio,setBio]=useState("");
  const [audience,setAudience]=useState<"private"|"friends"|"public">("private");
  const [publicEnabled,setPublicEnabled]=useState(false);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  useEffect(()=>{let cancelled=false;void call<Profile>("profiles/"+encodeURIComponent(userId)).then(p=>{
    if(cancelled)return;setBio(p.bio??"");setPublicEnabled(p.publicEnabled);setAudience(p.bioAudience??"private");
  }).catch(e=>{if(!cancelled)setMessage(e.message);});return()=>{cancelled=true};},[userId]);
  const save=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setMessage("");
    try{await call("profile","PUT",{bio,bioAudience:audience,publicEnabled});setMessage("Профіль збережено");}
    catch(e){setMessage(e instanceof Error?e.message:"Помилка");}
    finally{setBusy(false);}
  };
  return <section className="rounded-xl border border-slate-700 bg-slate-900 p-4 text-slate-100 space-y-3">
    <h3 className="font-semibold">Налаштування профілю Social</h3>
    <p className="text-xs text-slate-400">ID для заявки в друзі: <code className="select-all">{userId}</code></p>
    <form onSubmit={save} className="space-y-3">
      <label className="block">Про себе
        <textarea value={bio} maxLength={2000} onChange={e=>setBio(e.target.value)} rows={3}
          className="block w-full rounded-lg bg-slate-950 border border-slate-700 p-2"/>
      </label>
      <label className="flex gap-2 items-center">
        <input type="checkbox" checked={publicEnabled} onChange={e=>setPublicEnabled(e.target.checked)}/>
        Дозволити перегляд профілю іншими
      </label>
      <label className="block">Хто бачить опис
        <select value={audience} onChange={e=>setAudience(e.target.value as typeof audience)}
          className="block w-full rounded-lg bg-slate-950 border border-slate-700 p-2">
          <option value="private">Тільки я</option><option value="friends">Друзі</option><option value="public">Усі користувачі</option>
        </select>
      </label>
      <button disabled={busy} className="rounded-lg bg-emerald-500 px-3 py-2 text-slate-950">Зберегти</button>
    </form>
    {message&&<p role="status">{message}</p>}
  </section>;
}
