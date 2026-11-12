import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import assert from "node:assert/strict";
import { setTimeout as sleep } from "node:timers/promises";
import pg from "pg";
import argon2 from "argon2";

const origin = "http://127.0.0.1:3000";
const base = "http://127.0.0.1:3100";
const pool = new pg.Pool({connectionString:process.env.SOCIAL_DATABASE_URL});
const server = spawn("node",["--import","tsx","server/social/index.ts"],{
  env:{...process.env,SOCIAL_APP_ORIGIN:origin,SOCIAL_SMTP_URL:"smtp://127.0.0.1:2525",
    SOCIAL_MAIL_FROM:"social-ci@example.invalid",SOCIAL_PORT:"3100",SOCIAL_RUN_MIGRATIONS:"0"},
  stdio:["ignore","pipe","pipe"]
});
let output="";server.stdout.on("data",d=>{output+=String(d)});server.stderr.on("data",d=>{output+=String(d)});
const created=[];
async function api(path,method="GET",body,cookie) {
  const r=await fetch(base+path,{method,headers:{...(method!=="GET"?{Origin:origin}:{}),
    ...(body?{"Content-Type":"application/json"}:{}),...(cookie?{Cookie:cookie}:{})},
    body:body?JSON.stringify(body):undefined,redirect:"manual"});
  const data=await r.json().catch(()=>({}));
  return {status:r.status,data,cookie:r.headers.get("set-cookie")?.split(";")[0]};
}
async function createUser(name) {
  const id=randomUUID(),email=`ci-${id}@example.invalid`;
  const hash=await argon2.hash("testing-password-123456789",{type:argon2.argon2id});
  await pool.query("INSERT INTO social_users(id,email,password_hash,display_name,email_verified) VALUES($1,$2,$3,$4,true)",[id,email,hash,name]);
  created.push(id);
  const r=await api("/api/social/login","POST",{email,password:"testing-password-123456789"});
  assert.equal(r.status,200,"Login must succeed");
  assert.ok(r.cookie?.startsWith("social_session="));
  return {id,cookie:r.cookie};
}
async function main(){
  for(let i=0;i<100;i++){
    if(server.exitCode!==null)throw new Error("Server exited early: "+output);
    try{const r=await fetch(base+"/api/social/health");if(r.ok)break;}catch{}
    await sleep(150);
    if(i===99)throw new Error("Server startup timeout: "+output);
  }
  const a=await createUser("CI Alice"),b=await createUser("CI Bob"),c=await createUser("CI Carol");
  const rawDenied=await fetch(base+"/api/community/items",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({body:{text:"forbidden"}})});
  const denied={status:rawDenied.status};
  assert.equal(denied.status,403,"Missing origin must fail");
  const privatePost=await api("/api/community/items","POST",{body:{text:"private data"},audience:"private"},a.cookie);
  assert.equal(privatePost.status,201);
  const friendsPost=await api("/api/community/items","POST",{body:{text:"friends data"},audience:"friends"},a.cookie);
  assert.equal(friendsPost.status,201);
  const publicPost=await api("/api/community/items","POST",{body:{text:"public data"},audience:"public"},a.cookie);
  assert.equal(publicPost.status,201);
  const invalidCursor=await api("/api/community/feed?before=not-a-cursor","GET",undefined,a.cookie);
  assert.equal(invalidCursor.status,400);
  assert.equal((await api("/api/community/feed?before=2026-99-99T99:99:99.999Z%7C"+a.id,"GET",undefined,a.cookie)).status,400);
  assert.equal((await api("/api/social/users/search?q=CI","GET",undefined,c.cookie)).data.items.length,0,
    "Directory must exclude users who did not opt in");
  const bobFeed=await api("/api/community/feed?mode=friends","GET",undefined,b.cookie);
  assert.equal(bobFeed.status,200);
  assert.ok(!bobFeed.data.items.some(p=>p.id===friendsPost.data.id));
  assert.ok(!bobFeed.data.items.some(p=>p.id===privatePost.data.id));
  assert.equal((await api(`/api/community/items/${friendsPost.data.id}/comments`,"POST",{body:"blocked"},b.cookie)).status,404);
  assert.equal((await api("/api/social/messages","POST",{recipientId:a.id,body:"blocked"},b.cookie)).status,403);
  assert.equal((await api("/api/social/friends/requests","POST",{recipientId:c.id},a.cookie)).status,201);
  assert.ok((await api("/api/social/friends/requests/outgoing","GET",undefined,a.cookie)).data.items.some(r=>r.recipientId===c.id));
  assert.equal((await api("/api/social/friends/requests/"+c.id,"DELETE",undefined,a.cookie)).status,200);
  assert.equal((await api("/api/social/friends/requests/"+c.id,"DELETE",undefined,a.cookie)).status,404);
  assert.ok(!(await api("/api/social/friends/requests","GET",undefined,c.cookie)).data.items.some(r=>r.senderId===a.id));
  assert.equal((await api("/api/social/friends/requests","POST",{recipientId:b.id},a.cookie)).status,201);
  assert.equal((await api(`/api/social/friends/requests/${a.id}/respond`,"POST",{status:"accepted"},b.cookie)).status,200);
  const bobFriends=await api("/api/community/feed?mode=friends","GET",undefined,b.cookie);
  assert.ok(bobFriends.data.items.some(p=>p.id===friendsPost.data.id));
  assert.ok(!bobFriends.data.items.some(p=>p.id===privatePost.data.id));
  const firstPage=await api("/api/community/feed?mode=friends","GET",undefined,a.cookie);
  assert.equal(firstPage.status,200);
  assert.equal(firstPage.data.next,null,"Small feed must not have another page");
  assert.equal((await api(`/api/community/items/${friendsPost.data.id}/comments`,"POST",{body:"allowed"},b.cookie)).status,201);
  assert.equal((await api(`/api/community/items/${friendsPost.data.id}/comments`,"GET",undefined,c.cookie)).data.items.length,0);
  assert.equal((await api("/api/social/messages","POST",{recipientId:a.id,body:"hello"},b.cookie)).status,201);
  const conversation=await api(`/api/social/messages/${b.id}`,"GET",undefined,a.cookie);
  assert.equal(conversation.data.items.length,1);
  assert.equal((await api(`/api/social/messages/${b.id}`,"GET",undefined,c.cookie)).status,403);
  assert.equal((await api("/api/social/profile","PUT",{bio:"secret",bioAudience:"friends",publicEnabled:true},a.cookie)).status,200);
  const directory=await api("/api/social/users/search?q=CI%20Alice","GET",undefined,c.cookie);
  assert.equal(directory.status,200);
  assert.ok(directory.data.items.some(u=>u.id===a.id),"Opted-in user must be discoverable");
  assert.equal((await api(`/api/social/profiles/${a.id}`,"GET",undefined,b.cookie)).data.bio,"secret");
  assert.equal((await api(`/api/social/profiles/${a.id}`,"GET",undefined,c.cookie)).data.bio,null);
  assert.equal((await api("/api/social/friends/"+b.id,"DELETE",undefined,a.cookie)).status,200);
  assert.equal((await api("/api/social/messages","POST",{recipientId:a.id,body:"after removal"},b.cookie)).status,403);
  assert.equal((await api("/api/social/messages/"+b.id,"GET",undefined,a.cookie)).status,403);
  assert.ok(!(await api("/api/community/feed?mode=friends","GET",undefined,b.cookie)).data.items.some(p=>p.id===friendsPost.data.id));
  assert.equal((await api("/api/community/items/"+friendsPost.data.id+"/comments","POST",{body:"after removal"},b.cookie)).status,404);
  console.log("PASS: login, CSRF origin, audiences, friendship, revocation, comments, messages, profiles");
}
try {await main();} catch(e){console.error(e);process.exitCode=1;}
finally{
  server.kill("SIGTERM");
  for(const id of created)await pool.query("DELETE FROM social_users WHERE id=$1",[id]).catch(console.error);
  await pool.end();
}
