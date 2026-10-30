
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=(n,c=false)=>{if(n==null||isNaN(n))return '—';const neg=n<0;const v=Math.abs(n);const s=v.toLocaleString('en-CA',{minimumFractionDigits:c?2:0,maximumFractionDigits:c?2:0});return (neg?'−':'')+'$'+s};
const fmtc=n=>fmt(n,true);
const pct=n=>(isFinite(n)?Math.round(n*100):0)+'%';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const uid=()=>Math.random().toString(36).slice(2,10);
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


const pad=n=>String(n).padStart(2,'0');
const ds=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const pd=s=>{const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d,12)};
const addDays=(s,n)=>{const d=pd(s);d.setDate(d.getDate()+n);return ds(d)};
const diffDays=(a,b)=>Math.round((pd(b)-pd(a))/864e5);
const dim=(y,m)=>new Date(y,m,0).getDate(); // m 1-12
const today=()=>ds(new Date());
const nice=(s,o={})=>{const d=pd(s);return (o.dow?DOW[d.getDay()]+', ':'')+MONTHS[d.getMonth()]+' '+d.getDate()+(o.y?', '+d.getFullYear():'')};
const ym=s=>s.slice(0,7);
const ymLabel=k=>{const[y,m]=k.split('-');return MONTHS[+m-1]+' '+y};


const I={
 today:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
 flow:'<path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/>',
 budget:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
 spend:'<path d="M12 3v18M3 12h18" opacity=".0"/><circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l6 6"/>',
 bills:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
 family:'<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M3 19c.5-3.5 2.8-5.5 5.5-5.5s5 2 5.5 5.5M14 14.5c2.6-.6 5.6.8 6.5 4.5"/>',
 plan:'<path d="M3 20l6-16 4 10 3-5 5 11z"/>',
 goals:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
 tx:'<path d="M4 6h16M4 12h16M4 18h10"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 up:'<path d="M12 19V5M5 12l7-7 7 7"/>', down:'<path d="M12 5v14M19 12l-7 7-7-7"/>',
 alert:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17.5v.01"/>',
 cup:'<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/>',
 cart:'<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.5 12.5h12L22 7H6"/>',
 fuel:'<path d="M4 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h13M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V8l-3-3"/><path d="M7 7h5"/>',
 car:'<path d="M5 17h14v-5l-2-5H7l-2 5z"/><circle cx="8" cy="17" r="2"/><circle cx="16" cy="17" r="2"/>',
 heart:'<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
 bag:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 11v3M5.5 12.5h3M15 12h.01M18 13.5h.01"/>',
 plane:'<path d="M2 15l20-7-5 12-4-5z"/><path d="M13 15l-2 5"/>',
 food:'<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v8M7 3v6M17 21V3c-2 0-3.5 2-3.5 6v4H17"/>',
 bike:'<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9 8 5H6"/>',
 cash:'<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
 home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/>',
 shield:'<path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"/>',
 bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
 wifi:'<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>',
 phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
 card:'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M6 15h4"/>',
 bank:'<path d="M3 10 12 4l9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18"/>',
 sub:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/>',
 biz:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
 lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 check:'<path d="M5 12.5 10 17l9-10"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
};
const icon=(n,cls='')=>`<svg class="${cls}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[n]||I.spark}</svg>`;
const ENV_ICON={groceries:'cart',fuel:'fuel',health:'heart',car:'car',coffee:'cup',fastfood:'food',delivery:'bike',dineout:'food',shopping:'bag',fun:'game',rides:'car',cash:'cash',travel:'plane'};
const GROUP={need:{n:'Needs',c:'var(--need)'},want:{n:'Wants',c:'var(--want)'},debt:{n:'Debt',c:'var(--debt)'},business:{n:'Business',c:'var(--biz)'},fee:{n:'Bank fees',c:'var(--fee)'},income:{n:'Income',c:'var(--green)'},save:{n:'Savings',c:'var(--save)'}};
const REC_ICON={rent:'home',ins:'shield',ama:'car',energy:'bolt',shaw:'wifi',phone:'phone',phone2:'phone',bankfee:'bank',visafee:'card',snap:'card',affirm:'card',loc:'card',apple:'sub',claude:'sub',psn:'game',gws:'biz',siteground:'biz',gads:'biz',netflix:'sub',crave:'sub',pay1:'cash',pay2:'cash',gst:'cash'};
const CAT_COLORS=['#e8c27c','#6aa8ff','#3fd69a','#9d8cff','#ff86b7','#40c9c9','#ffb84d','#ff8a7a','#b3e66b','#8a93a6','#d98cff','#5fd0ff','#ffd36a','#7fa1c9'];


const b64d=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const b64e=u=>btoa(String.fromCharCode(...new Uint8Array(u)));
const norm=p=>p.toUpperCase().replace(/[^A-Z0-9]/g,'');
let VAULT=null,KEY=null,BASE=null,S=null;
async function deriveKey(pass,salt,iter){
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(norm(pass)),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:iter,hash:'SHA-256'},base,{name:'AES-GCM',length:256},true,['encrypt','decrypt']);
}
async function decryptVault(key){
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(VAULT.iv)},key,b64d(VAULT.ct));
  if(!VAULT.gz) return JSON.parse(new TextDecoder().decode(pt));
  return JSON.parse(await new Response(new Blob([pt]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
}
async function encLocal(obj){
  const iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},KEY,new TextEncoder().encode(JSON.stringify(obj)));
  return JSON.stringify({iv:b64e(iv),ct:b64e(ct)});
}
async function decLocal(str){
  const o=JSON.parse(str);
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64d(o.iv)},KEY,b64d(o.ct));
  return JSON.parse(new TextDecoder().decode(pt));
}
const LS={get:k=>{try{return localStorage.getItem(k)}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},del:k=>{try{localStorage.removeItem(k)}catch(e){}}};
let saveT=null;
function save(o={}){if(!o.remote)S._t=Math.max(Date.now(),(S._t||0)+1);clearTimeout(saveT);saveT=setTimeout(async()=>{const e=await encLocal(S);LS.set('nest.state',e);if(!o.remote&&typeof cloudPush==='function')cloudPush(e)},250)}


function freshState(base){
  return {
    v:1, settings:{...base.settings},
    balance:{chq:base.statements.chq_last.balance,visa:base.statements.visa_last.balance,asOf:today(),assumed:true},
    recurring:JSON.parse(JSON.stringify(base.recurring)),
    budgets:JSON.parse(JSON.stringify(base.budgets)),
    goals:JSON.parse(JSON.stringify(base.goals)),
    setup:JSON.parse(JSON.stringify(base.setup)),
    debts:JSON.parse(JSON.stringify(base.debts)),
    logs:[], trips:[], dismissed:{}
  };
}
async function boot(key){
  KEY=key;
  BASE=await decryptVault(key);
  const raw=LS.get('nest.state');
  S=null;
  if(raw){try{S=await decLocal(raw)}catch(e){S=null}}
  if(!S) S=freshState(BASE);
  // forward-compat: add any new recurring items from base
  for(const r of BASE.recurring) if(!S.recurring.find(x=>x.id===r.id)) S.recurring.push(JSON.parse(JSON.stringify(r)));
  S.settings={...BASE.settings,...S.settings};
  onBoot();
  if(typeof cloudStart==='function')cloudStart();
}


const mode=(date)=>{const s=S.settings;if(s.planMode==='solo')return 'solo';if(s.planMode==='couple')return 'couple';return (s.wifeArrival&&date>=s.wifeArrival)?'couple':'solo'};
const isCoupleDate=d=>mode(d)==='couple';
function recActive(r,date){ if(!r.active) return false; if(r.couple && !isCoupleDate(date)) return false; if(r.end && date>r.end) return false; return true; }
function occurrences(r,from,to){ // inclusive from..to
  const out=[]; let d=pd(from); d.setDate(1);
  const end=pd(to);
  while(d<=end){
    const y=d.getFullYear(),m=d.getMonth()+1;
    let ok=r.freq==='monthly'||(r.freq==='quarterly'||r.freq==='yearly')&&(r.months||[]).includes(m);
    if(ok){const day=Math.min(r.day,dim(y,m));const s=`${y}-${pad(m)}-${pad(day)}`;if(s>=from&&s<=to&&recActive(r,s))out.push(s)}
    d.setMonth(d.getMonth()+1);
  }
  return out;
}
function payAmount(r,date){ let a=r.amount; if(r.kind==='income'&&r.id.startsWith('pay')&&S.settings.spouseCredit&&isCoupleDate(date)) a+=(+S.settings.spouseCreditAmt||0)/2; return a; }
function events(from,to){ // scheduled events between dates inclusive
  const ev=[];
  for(const r of S.recurring){ for(const d of occurrences(r,from,to)){
    const inc=r.kind==='income'; ev.push({date:d,name:r.name,amount:inc?payAmount(r,d):-r.amount,r,kind:r.kind,group:r.group});
    if(inc&&r.id.startsWith('pay')&&+S.settings.savingsMonthly>0) ev.push({date:d,name:'Move to savings',amount:-(+S.settings.savingsMonthly)/2,kind:'save',group:'save',save:true});
  }}
  for(const l of S.logs) if(l.date>from&&l.date<=to&&l.future) ev.push({date:l.date,name:l.note||'Planned',amount:l.amount,kind:'planned',group:'want',log:l});
  return ev.sort((a,b)=>a.date.localeCompare(b.date)||b.amount-a.amount);
}
function budgetsFor(m){return S.budgets.map(b=>({...b,amt:+(m==='couple'?b.couple:b.solo)||0}))}
function varMonthly(m){return budgetsFor(m).reduce((s,b)=>s+b.amt,0)}
function monthlyEq(r){return r.freq==='monthly'?r.amount:r.freq==='quarterly'?r.amount/3:r.amount/12}
function fixedMonthly(m,filter=()=>true){ // monthly equivalent of active outflows in a mode
  return S.recurring.filter(r=>r.kind!=='income'&&r.active&&(!r.couple||m==='couple')&&filter(r)).reduce((s,r)=>s+monthlyEq(r),0);
}
function incomeMonthly(m){
  let s=S.recurring.filter(r=>r.kind==='income'&&r.active).reduce((a,r)=>a+monthlyEq(r),0);
  if(m==='couple'&&S.settings.spouseCredit) s+=+S.settings.spouseCreditAmt||0;
  return s;
}
function plan(m){
  const inc=incomeMonthly(m), fixed=fixedMonthly(m), vari=varMonthly(m), sav=+S.settings.savingsMonthly||0;
  const groups={}; for(const r of S.recurring) if(r.kind!=='income'&&r.active&&(!r.couple||m==='couple')) groups[r.group]=(groups[r.group]||0)+monthlyEq(r);
  for(const b of budgetsFor(m)) groups[b.group]=(groups[b.group]||0)+b.amt;
  return {inc,fixed,vari,sav,margin:inc-fixed-vari-sav,groups};
}
function loggedSince(after){const bt=S.balance.ts||0;return S.logs.filter(l=>!l.future&&(l.date>after||(l.date===after&&(l.ts||0)>bt))).reduce((s,l)=>s+l.amount,0)}
function netNow(){
  const b=S.balance, t=today();
  let n=b.chq-b.visa+loggedSince(b.asOf);
  if(b.asOf<t) for(const e of events(addDays(b.asOf,1),t)) if(!e.log) n+=e.amount;
  return n;
}
function nextPay(after){ const ev=events(addDays(after,1),addDays(after,45)).filter(e=>e.kind==='income'&&e.r.id.startsWith('pay')); return ev[0]; }
function dailyBurn(date){ const d=pd(date); return varMonthly(mode(date))/dim(d.getFullYear(),d.getMonth()+1); }
function forecast(days=90){
  const t=today(); let bal=netNow(); const pts=[{date:t,y:bal}]; const evs=events(addDays(t,1),addDays(t,days));
  // reduce today's burn by what was already logged this month vs budget pace
  for(let i=1;i<=days;i++){
    const d=addDays(t,i); bal-=dailyBurn(d);
    for(const e of evs) if(e.date===d) bal+=e.amount;
    pts.push({date:d,y:bal});
  }
  return {pts,evs};
}
function safeToSpend(){
  const t=today(), np=nextPay(t); const days=np?Math.max(1,diffDays(t,np.date)):14;
  const bills=events(addDays(t,1),np?addDays(np.date,-1):addDays(t,14)).filter(e=>e.amount<0).reduce((s,e)=>s-e.amount,0);
  const net=netNow(), buf=+S.settings.buffer||0;
  const total=net-bills-buf;
  const f=forecast(35); const min=Math.min(...f.pts.map(p=>p.y)); const minPt=f.pts.find(p=>p.y===min);
  const firstRed=f.pts.find(p=>p.y<buf);
  let status='green',label='On track';
  if(total<0||min<0){status='red';label='Red zone'} else if(total/days<20||firstRed){status='amber';label='Careful'}
  return {np,days,bills,net,buf,total,perDay:total/days,perWeek:total/days*7,min,minPt,firstRed,status,label};
}
function monthSpend(key){ // logged spending this month per budget id
  const o={}; for(const l of S.logs) if(!l.future&&ym(l.date)===key&&l.amount<0) o[l.cat]=(o[l.cat]||0)-l.amount; return o;
}
function allowance(){
  const t=today(), d=pd(t), m=mode(t), total=dim(d.getFullYear(),d.getMonth()+1), left=total-d.getDate()+1;
  const spent=monthSpend(ym(t));
  const wants=budgetsFor(m).filter(b=>b.group==='want'&&!b.sinking);
  const budget=wants.reduce((s,b)=>s+b.amt,0), used=wants.reduce((s,b)=>s+(spent[b.id]||0),0);
  const rem=Math.max(0,budget-used); const s=safeToSpend(); const cash=Math.max(0,s.total);
  const perDay=Math.min(rem/left,cash/s.days), capped=rem/left>cash/s.days;
  return {budget,used,rem,perDay,perWeek:Math.min(rem,perDay*7,cash),left,capped};
}


let H=null;
function hist(){
  if(H) return H;
  const tx=BASE.tx.map(t=>({date:t[0],acct:t[1]?'Visa':'Chequing',amount:t[2],merchant:t[3],cat:t[4],group:t[5],travel:t[6]}));
  const months=BASE.statements.chq_months; const inM=t=>months.includes(ym(t.date));
  const spend=tx.filter(t=>inM(t)&&!['income','transfer'].includes(t.group));
  const byMonth={}, byCat={}, byMerch={}, byGroup={};
  for(const t of spend){
    const k=ym(t.date); byMonth[k]=byMonth[k]||{need:0,want:0,debt:0,business:0,fee:0}; byMonth[k][t.group]=(byMonth[k][t.group]||0)-t.amount;
    byCat[t.cat]=(byCat[t.cat]||0)-t.amount; byGroup[t.group]=(byGroup[t.group]||0)-t.amount;
    const m=byMerch[t.merchant]=byMerch[t.merchant]||{n:0,s:0,cat:t.cat}; m.n+=t.amount<0?1:0; m.s-=t.amount;
  }
  const income={}; for(const t of tx) if(inM(t)&&t.group==='income'){const k=ym(t.date);income[k]=(income[k]||0)+t.amount}
  const salary={}; for(const t of tx) if(inM(t)&&t.cat==='Salary'){const k=ym(t.date);salary[k]=(salary[k]||0)+t.amount}
  const N=months.length;
  const eatOut=['Coffee & cafés','Fast food','Food delivery','Restaurants','Convenience store'].reduce((s,c)=>s+(byCat[c]||0),0);
  H={tx,months,spend,byMonth,byCat,byMerch,byGroup,income,salary,N,eatOut};
  return H;
}



Object.assign(I,{chev:'<path d="M6 9l6 6 6-6"/>',right:'<path d="M9 6l6 6-6 6"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',back:'<path d="M15 6l-6 6 6 6"/>',del:'<path d="M21 5H9l-6 7 6 7h12z"/><path d="M17 9l-6 6M11 9l6 6"/>',insights:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',x:'<path d="M6 6l12 12M18 6 6 18"/>',cloud:'<path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1-1 8z"/>'});

const SECTIONS=[
 {id:'home',n:'Home',i:'home',sub:()=>nice(today(),{dow:1,y:1})},
 {id:'plan',n:'Plan',i:'budget',segs:[['budget','Budget'],['bills','Bills'],['flow','Cash flow']],sub:()=>'Budget, bills and what is coming'},
 {id:'insights',n:'Insights',i:'insights',segs:[['overview','Overview'],['habits','Habits'],['tx','Transactions']],sub:()=>`Your statements · ${ymLabel(BASE.statements.chq_months[0])} – ${ymLabel(BASE.statements.chq_months.at(-1))}`},
 {id:'life',n:'Life',i:'family',segs:[['family','Family'],['goals','Goals'],['debt','Debt'],['trips','Dining & trips']],sub:()=>'Your wife, savings goals, debt and trips'},
 {id:'settings',n:'Settings',i:'gear',sub:()=>'Income, safety buffer and privacy'}];
let CUR='home', SEG={plan:'budget',insights:'overview',life:'family'}, AFTER=null, LASTW=innerWidth;
const sec=id=>SECTIONS.find(s=>s.id===id);

function onBoot(){
  buildNav();
  const h=(location.hash.slice(1)||'home').split('/');
  if(sec(h[0])){CUR=h[0];if(h[1]&&SEG[h[0]]!==undefined)SEG[h[0]]=h[1]}
  render({anim:true});
  hideSplash();$('#lock').classList.add('hidden');
  const app=$('#app');app.classList.remove('hidden');app.classList.add('reveal');document.body.classList.remove('locked');
  if(S.balance.assumed) setTimeout(()=>sheetBalance(true),900);
}
function hideSplash(){const s=$('#splash');s.classList.add('out');setTimeout(()=>s.classList.add('hidden'),700)}

function buildNav(){
  $('#nav').innerHTML=SECTIONS.map(s=>`<button data-go="${s.id}">${icon(s.i)}<span>${s.n}</span>${s.id==='home'?'<span class="dot hidden" id="rzdot"></span>':''}</button>`).join('');
  const m=['home','plan',null,'insights','life'];
  $('#mnav').innerHTML=m.map(id=>id?`<button data-go="${id}">${icon(sec(id).i)}<span>${sec(id).n}</span></button>`:`<button class="plus btn gold" data-act="add" aria-label="Log expense">${icon('plus')}</button>`).join('');
  $$('[data-act=settings]').forEach(b=>b.innerHTML=icon('gear'));
  $$('.mhead [data-act=balance]').forEach(b=>b.innerHTML=icon('refresh'));
  $('.fab').innerHTML=icon('plus');
}
document.addEventListener('click',e=>{
  const g=e.target.closest('[data-go]');if(g){go(g.dataset.go,g.dataset.seg);return}
  const a=e.target.closest('[data-act]');if(!a)return;
  ({add:()=>sheetAdd(),balance:()=>sheetBalance(),settings:()=>go('settings')})[a.dataset.act]?.();
});
function go(id,seg){
  closeSheet(true);
  if(seg)SEG[id]=seg;
  const changed=id!==CUR||!!seg;CUR=id;
  try{history.replaceState(null,'','#'+id+(SEG[id]?'/'+SEG[id]:''))}catch(e){}
  render({anim:changed,top:true});
}
function setSeg(id){SEG[CUR]=id;try{history.replaceState(null,'','#'+CUR+'/'+id)}catch(e){};render({anim:true,top:false})}

function render(o={}){
  const y=window.scrollY;
  const s=sec(CUR);
  $$('#nav [data-go],#mnav [data-go]').forEach(b=>b.classList.toggle('on',b.dataset.go===CUR));
  const title=CUR==='home'?greet():s.n;
  $('#t1').textContent=title;$('#t2').textContent=CUR==='home'?'Today':s.n;
  $('#s1').textContent=$('#s2').textContent=s.sub();
  AFTER=null;
  let html='';
  if(s.segs) html+=`<div class="segs">${s.segs.map(([k,n])=>`<button class="${SEG[CUR]===k?'on':''}" onclick="setSeg('${k}')">${n}</button>`).join('')}</div>`;
  const V={home:vHome,plan:{budget:vBudget,bills:vBills,flow:vFlow},insights:{overview:vOverview,habits:vHabits,tx:vTx},life:{family:vFamily,goals:vGoals,debt:vDebt,trips:vTrips},settings:vSettings}[CUR];
  html+=`<div class="${o.anim?'enter':''}" id="vbody">${(typeof V==='function'?V:V[SEG[CUR]])()}</div>`;
  $('#view').innerHTML=html;
  AFTER&&AFTER();
  if(o.anim) countUp();
  window.scrollTo(0,o.top?0:y);
  const st=safeToSpend();$('#rzdot')?.classList.toggle('hidden',st.status!=='red');
  $('#sidecard').innerHTML=`<div class="l">Net cash now</div><div class="v num">${fmt(st.net)}</div><div class="between"><span class="dim">Status</span>${pill(st)}</div><div class="between" style="margin-top:8px"><span class="dim">Plan</span><b>${mode(today())==='couple'?'Couple':'Solo'}</b></div>`;
}
function greet(){const h=new Date().getHours();return (h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', '+(S.settings.name||'')}
function countUp(){$$('[data-count]').forEach(el=>{const to=+el.dataset.count,pre=el.dataset.pre||'',suf=el.dataset.suf||'';const t0=performance.now(),d=900;
  const step=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3);el.textContent=pre+fmt(to*e).replace('$','')+suf;if(k<1)requestAnimationFrame(step);else el.textContent=pre+fmt(to).replace('$','')+suf};requestAnimationFrame(step)})}
window.addEventListener('resize',()=>{clearTimeout(window._rs);window._rs=setTimeout(()=>{if(S&&Math.abs(innerWidth-LASTW)>40){LASTW=innerWidth;render()}},180)});

const pill=s=>`<span class="chip ${{green:'c-green',amber:'c-amber',red:'c-red'}[s.status]}"><i></i>${s.label}</span>`;
const bar=(v,max,color='var(--gold)',mark)=>`<div class="bar"><i style="width:${clamp(v/(max||1)*100,0,100)}%;background:${color}"></i>${mark!=null?`<span class="mk" style="left:${clamp(mark/(max||1)*100,0,100)}%"></span>`:''}</div>`;
const card=(title,ic,body,right='',cls='')=>`<div class="card ${cls}"><div class="ch">${icon(ic)}<h3>${title}</h3>${right?`<span class="r">${right}</span>`:''}</div>${body}</div>`;
const stat=(l,v,s='',cls='')=>`<div class="card stat"><div class="l">${l}</div><div class="v num ${cls}">${v}</div>${s?`<div class="s">${s}</div>`:''}</div>`;
const tint=(c,a=14)=>`background:color-mix(in srgb,${c} ${a}%,transparent);color:${c}`;
const range=(v,min,max)=>`--p:${clamp((v-min)/(max-min)*100,0,100)}%`;
window.rangeFill=el=>el.style.setProperty('--p',((el.value-el.min)/(el.max-el.min)*100)+'%');

function lineChart(el,pts,o={}){
  if(!el)return;const W=el.clientWidth||600,Hh=o.h||220,P={l:o.mini?6:48,r:o.mini?6:10,t:12,b:o.mini?8:26};
  const ys=pts.map(p=>p.y).concat([o.buffer??0,0]);let mn=Math.min(...ys),mx=Math.max(...ys);const pd0=(mx-mn)*.12||100;mn-=pd0;mx+=pd0;
  const raw=(mx-mn)/4,mag=Math.pow(10,Math.floor(Math.log10(raw))),st=[1,2,2.5,5,10].map(k=>k*mag).find(k=>k>=raw);mn=Math.floor(mn/st)*st;mx=Math.ceil(mx/st)*st;
  const x=i=>P.l+i*(W-P.l-P.r)/(pts.length-1),y=v=>P.t+(mx-v)*(Hh-P.t-P.b)/(mx-mn);
  const line=pts.map((p,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(p.y).toFixed(1)).join(' ');
  const area=line+` L${x(pts.length-1)} ${Hh-P.b} L${x(0)} ${Hh-P.b} Z`;
  let grid='';if(!o.mini)for(let v=mn;v<=mx+1e-6;v+=st)grid+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.05)"/><text x="${P.l-8}" y="${y(v)+4}" fill="#6b7486" font-size="10.5" text-anchor="end">${fmt(v)}</text>`;
  let xl='';if(!o.mini){const n=W<500?4:6,step=Math.ceil(pts.length/n);pts.forEach((p,i)=>{if(i%step===0)xl+=`<text x="${x(i)}" y="${Hh-6}" fill="#6b7486" font-size="10.5" text-anchor="${i===0?'start':'middle'}">${nice(p.date)}</text>`})}
  const id='g'+uid(),buf=o.buffer;
  const marks=(o.marks||[]).map(m=>{const i=pts.findIndex(p=>p.date===m.date);return i<0?'':`<circle cx="${x(i)}" cy="${y(pts[i].y)}" r="${o.mini?3:4}" fill="${m.c}" stroke="#0d0f15" stroke-width="2"/>`}).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" height="${Hh}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e9c784" stop-opacity=".3"/><stop offset="1" stop-color="#e9c784" stop-opacity="0"/></linearGradient><clipPath id="c${id}"><rect x="0" y="${y(buf??-1e9)}" width="${W}" height="${Hh}"/></clipPath></defs>${grid}
   ${buf!=null?`<rect x="${P.l}" y="${y(buf)}" width="${W-P.l-P.r}" height="${Math.max(0,Hh-P.b-y(buf))}" fill="rgba(255,107,107,.06)"/><line x1="${P.l}" x2="${W-P.r}" y1="${y(buf)}" y2="${y(buf)}" stroke="#ff6b6b" stroke-dasharray="4 5" stroke-opacity=".6"/>`:''}
   <path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="#e9c784" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>${buf!=null?`<path d="${line}" fill="none" stroke="#ff6b6b" stroke-width="2.6" clip-path="url(#c${id})"/>`:''}
   ${marks}${xl}<line class="hx" y1="${P.t}" y2="${Hh-P.b}" stroke="rgba(255,255,255,.3)" opacity="0"/><circle class="hc" r="5.5" fill="#e9c784" stroke="#0d0f15" stroke-width="2.5" opacity="0"/></svg><div class="ctip"></div>`;
  if(o.mini)return;
  const svg=el.querySelector('svg'),hx=svg.querySelector('.hx'),hc=svg.querySelector('.hc'),tp=el.querySelector('.ctip');
  const mv=e=>{const r=svg.getBoundingClientRect();const px=(e.clientX-r.left)*W/r.width;const i=clamp(Math.round((px-P.l)/((W-P.l-P.r)/(pts.length-1))),0,pts.length-1),p=pts[i];
    hx.setAttribute('x1',x(i));hx.setAttribute('x2',x(i));hx.setAttribute('opacity',1);hc.setAttribute('cx',x(i));hc.setAttribute('cy',y(p.y));hc.setAttribute('opacity',1);
    tp.innerHTML=`<b>${nice(p.date,{dow:1})}</b><br><span class="${buf!=null&&p.y<buf?'neg':''}">${fmtc(p.y)}</span>${o.extra?o.extra(p):''}`;tp.style.opacity=1;
    const tw=tp.offsetWidth,cx=x(i)*r.width/W;tp.style.left=clamp(cx-tw/2,0,r.width-tw)+'px';tp.style.top='-8px';tp.style.transform='translateY(-100%)'};
  const off=()=>{tp.style.opacity=0;hx.setAttribute('opacity',0);hc.setAttribute('opacity',0)};
  svg.addEventListener('pointermove',mv);svg.addEventListener('pointerdown',mv);svg.addEventListener('pointerleave',off);svg.addEventListener('pointercancel',off);
}
function stackChart(el,labels,series,o={}){
  if(!el)return;const W=el.clientWidth||600,Hh=o.h||230,P={l:46,r:6,t:10,b:26};
  const tot=labels.map((_,i)=>series.reduce((s,se)=>s+Math.max(0,se.values[i]||0),0));const mx=Math.max(...tot,...(o.lines||[]).flatMap(l=>l.values))*1.1||1;
  const bw=(W-P.l-P.r)/labels.length,y=v=>P.t+(mx-v)*(Hh-P.t-P.b)/mx;
  let g='';for(let i=0;i<=4;i++){const v=mx*i/4;g+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.05)"/><text x="${P.l-8}" y="${y(v)+4}" fill="#6b7486" font-size="10.5" text-anchor="end">${v>=1000?'$'+(v/1000).toFixed(1)+'k':fmt(v)}</text>`}
  let bars='';labels.forEach((lb,i)=>{let acc=0;const x0=P.l+i*bw+bw*.18,w=bw*.64;
    series.forEach((se,j)=>{const v=Math.max(0,se.values[i]||0);if(!v)return;const y1=y(acc+v),y0=y(acc);bars+=`<rect x="${x0}" y="${y1}" width="${w}" height="${Math.max(0,y0-y1-1.5)}" rx="3" fill="${se.color}"/>`;acc+=v});
    bars+=`<text x="${x0+w/2}" y="${Hh-7}" fill="#6b7486" font-size="10.5" text-anchor="middle">${lb}</text><rect class="hit" data-i="${i}" x="${P.l+i*bw}" y="0" width="${bw}" height="${Hh}" fill="transparent"/>`});
  const lines=(o.lines||[]).map(L=>`<path d="${L.values.map((v,i)=>(i?'L':'M')+(P.l+i*bw+bw/2)+' '+y(v)).join(' ')}" fill="none" stroke="${L.color}" stroke-width="2.2"/>`+L.values.map((v,i)=>`<circle cx="${P.l+i*bw+bw/2}" cy="${y(v)}" r="3.5" fill="${L.color}" stroke="#0d0f15" stroke-width="1.5"/>`).join('')).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" height="${Hh}">${g}${bars}${lines}</svg><div class="ctip"></div>`;
  const tp=el.querySelector('.ctip'),svg=el.querySelector('svg');
  el.querySelectorAll('.hit').forEach(r=>{const show=e=>{const i=+r.dataset.i,rc=svg.getBoundingClientRect();tp.innerHTML=`<b>${labels[i]}</b><br>`+series.filter(se=>se.values[i]).map(se=>`<span style="color:${se.color}">●</span> ${se.name} ${fmt(se.values[i])}`).join('<br>')+`<br><b>Spent ${fmt(tot[i])}</b>`+(o.lines||[]).map(L=>`<br><span style="color:${L.color}">●</span> ${L.name} ${fmt(L.values[i])}`).join('');tp.style.opacity=1;const tw=tp.offsetWidth,cx=(P.l+i*bw+bw/2)*rc.width/W;tp.style.left=clamp(cx-tw/2,0,rc.width-tw)+'px';tp.style.top='-8px';tp.style.transform='translateY(-100%)'};
    r.addEventListener('pointermove',show);r.addEventListener('pointerdown',show);r.addEventListener('pointerleave',()=>tp.style.opacity=0)});
}
function donut(parts,center,sub,size=200){
  const R=84,r=62,tot=parts.reduce((s,p)=>s+p.value,0)||1;let a=-Math.PI/2,paths='';
  parts.forEach(p=>{const da=p.value/tot*Math.PI*2;if(da<=.001)return;const a2=a+da,lg=da>Math.PI?1:0,g=.015;
    const Q=(rad,an)=>[100+rad*Math.cos(an),100+rad*Math.sin(an)];const[a1x,a1y]=Q(R,a+g),[a2x,a2y]=Q(R,a2-g),[b1x,b1y]=Q(r,a2-g),[b2x,b2y]=Q(r,a+g);
    paths+=`<path d="M${a1x} ${a1y}A${R} ${R} 0 ${lg} 1 ${a2x} ${a2y}L${b1x} ${b1y}A${r} ${r} 0 ${lg} 0 ${b2x} ${b2y}Z" fill="${p.color}"><title>${esc(p.name)} ${fmt(p.value)}</title></path>`;a=a2});
  return `<svg viewBox="0 0 200 200" style="width:100%;max-width:${size}px;display:block;margin:auto">${paths}<text x="100" y="100" text-anchor="middle" fill="#f2f4f8" font-family="Instrument Serif" font-size="32">${center}</text><text x="100" y="121" text-anchor="middle" fill="#6b7486" font-size="11">${sub||''}</text></svg>`;
}
function ringSvg(frac,color,size=168,stroke=10){const R=(100-stroke)/2-2,C=2*Math.PI*R;return `<svg viewBox="0 0 100 100" style="transform:rotate(-90deg)"><circle cx="50" cy="50" r="${R}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="${stroke*.6}"/><circle class="arc" cx="50" cy="50" r="${R}" fill="none" stroke-linecap="round" stroke="${color}" stroke-width="${stroke*.6}" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-clamp(frac,0,1))}"/></svg>`}
const legend=items=>`<div class="legend">${items.map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join('')}</div>`;

function evRow(e,showDate=true){
  const inc=e.amount>0,ic=e.save?'shield':(e.r?REC_ICON[e.r.id]:'')||(inc?'cash':'card');
  const col=e.save?'var(--save)':inc?'var(--green)':(GROUP[e.group]?.c||'var(--tx2)');
  return `<div class="li"><div class="ic" style="${tint(col)}">${icon(ic)}</div><div class="t"><b>${esc(e.name.split(' — ')[0])}</b><span>${showDate?nice(e.date,{dow:1})+' · ':''}${e.save?'To savings':e.r?(e.r.acct==='visa'?'Visa':'Chequing')+(e.r.variable?' · varies':''):'Planned'}</span></div><div class="a num ${inc?'pos':''}">${inc?'+':''}${fmtc(e.amount)}</div></div>`;
}

function vHome(){
  const s=safeToSpend(),al=allowance(),t=today(),f=forecast(35);
  const prevPay=events(addDays(t,-20),t).filter(e=>e.kind==='income'&&e.r.id.startsWith('pay')).at(-1);
  const cyc=s.np&&prevPay?diffDays(prevPay.date,s.np.date):15,frac=1-s.days/cyc;
  const col={green:'var(--green)',amber:'var(--amber)',red:'var(--red)'}[s.status];
  const up=events(addDays(t,1),addDays(t,10)).slice(0,5);
  AFTER=()=>lineChart($('#mf'),f.pts,{buffer:s.buf,h:120,mini:true,marks:f.evs.filter(e=>e.kind==='income'&&e.r?.id.startsWith('pay')).map(e=>({date:e.date,c:'#45d6a0'}))});
  const alert=s.status==='red'?`<div class="alert">${icon('alert')}<div><b>You're in the red zone</b><p>${s.total<0?`After bills due before payday and your ${fmt(s.buf)} buffer, you're ${fmt(-s.total)} short. Essentials only until ${nice(s.np?.date||t)}.`:`Your balance is projected to dip to ${fmt(s.min)} on ${nice(s.minPt.date)}. Hold off on wants.`}</p></div></div>`:'';
  const setb=S.balance.assumed?`<div class="alert ag" data-act="balance">${icon('refresh')}<div><b>Add today's balances</b><p>Nest is using your last statements (Aug 31 / Oct 25). Tap to enter what your bank app shows now.</p></div></div>`:'';
  const ins=insights();
  const logs=S.logs.filter(l=>!l.future).slice(-4).reverse();
  return `${alert}${setb}
  <div class="card hero ${s.status}">
    <div class="hero-in">
      <div class="ring">${ringSvg(frac,col)}<div class="rc"><div class="rv num">${s.days}</div><div class="rl">day${s.days>1?'s':''} to payday</div><div class="show-m" style="margin-top:10px">${pill(s)}</div></div></div>
      <div class="hero-txt"><div class="between"><span class="eyebrow">Safe to spend today</span><span class="hide-m">${pill(s)}</span></div>
        <div class="big num"><span data-count="${Math.max(0,s.perDay)}" data-pre="$">${fmt(Math.max(0,s.perDay))}</span><small>/day</small></div>
        <div class="muted" style="font-size:14px">${s.total>0?`${fmt(s.total)} free until ${s.np?nice(s.np.date,{dow:1}):'payday'}`:'Nothing free until payday. Stick to essentials.'}</div></div>
    </div>
    <div class="trio"><div><div class="l">This week</div><div class="v num">${fmt(Math.max(0,Math.min(s.total,s.perDay*7)))}</div></div><div><div class="l">Bills due</div><div class="v num">${fmt(s.bills)}</div></div><div><div class="l">Net cash</div><div class="v num">${fmt(s.net)}</div></div></div>
  </div>
  <div class="sp"></div>
  <div class="grid gh">
    ${card('Fun money this month','spark',`<div class="grid" style="grid-template-columns:repeat(3,minmax(0,1fr));gap:10px">${[['Today',al.perDay],['This week',al.perWeek],['Month left',al.rem]].map(([l,v])=>`<div class="stat"><div class="l">${l}</div><div class="v num">${fmt(v)}</div></div>`).join('')}</div><div class="sp"></div>${bar(al.used,al.budget,al.used>al.budget?'var(--red)':'var(--gold)')}<div class="between note" style="margin-top:9px"><span>${fmt(al.used)} of ${fmt(al.budget)} used</span><span>${al.left} days left</span></div>${al.capped?`<div class="note warn" style="margin-top:6px">Held back by cash until payday, not by budget.</div>`:''}`,ymLabel(ym(t)))}
    <div class="card tap" data-go="plan" data-seg="flow"><div class="ch">${icon('flow')}<h3>Next 5 weeks</h3><span class="r">Cash flow ${icon('right')}</span></div><div class="chart" id="mf"></div><div class="note" style="margin-top:10px">${s.firstRed?`<span class="neg">Dips below your ${fmt(s.buf)} buffer on ${nice(s.firstRed.date)}.</span> `:'<span class="pos">Stays above your buffer.</span> '}Low point ${fmt(s.min)} on ${nice(s.minPt.date)}.</div></div>
  </div>
  <div class="sp"></div>
  ${card('Coming up','calendar',`<div class="list">${up.length?up.map(e=>evRow(e)).join(''):'<div class="empty">Nothing in the next 10 days</div>'}</div><button class="more" data-go="plan" data-seg="flow">Full cash flow ${icon('right')}</button>`,'next 10 days')}
  <div class="sp"></div>
  ${card('What your statements say','spark',`<div class="hscroll">${ins.slice(0,5).map(insCard).join('')}</div>`,`<button class="goldt" data-go="insights" data-seg="habits" style="font-size:12.5px;font-weight:600">See all</button>`)}
  ${logs.length?`<div class="sp"></div>${card('Your recent logs','tx',`<div class="list">${logs.map(logRow).join('')}</div>`,`${S.logs.length} total`)}`:''}`;
}
function logRow(l){const b=S.budgets.find(x=>x.id===l.cat),inc=l.amount>0;return `<button class="li" onclick="sheetLog('${l.id}')"><div class="ic" style="${tint(inc?'var(--green)':'var(--gold)')}">${icon(inc?'cash':ENV_ICON[l.cat]||'card')}</div><div class="t"><b>${esc(l.note||b?.name||'Expense')}</b><span>${nice(l.date,{dow:1})} · ${esc(b?.name||(inc?'Income':'Other'))}</span></div><div class="a num ${inc?'pos':''}">${inc?'+':''}${fmtc(l.amount)}</div></button>`}
function insights(){
  const h=hist(),N=h.N,inc=Object.values(h.salary).reduce((a,b)=>a+b,0)/N,tims=h.byMerch['Tim Hortons']||{n:0,s:0},eat=h.eatOut/N,del=(h.byCat['Food delivery']||0)/N;
  const bE=S.budgets.filter(b=>['coffee','fastfood','delivery','dineout'].includes(b.id)).reduce((s,b)=>s+(+b.solo),0),fees=h.byCat['Bank fees & interest']||0;
  const trip=-h.spend.filter(t=>t.travel&&ym(t.date)==='2026-05').reduce((s,t)=>s+t.amount,0);
  return [
   {i:'food',c:'var(--red)',t:`${fmt(eat)}/mo eating out`,p:`That's ${pct(eat/inc)} of your pay. Your plan caps it at ${fmt(bE)}, which frees about ${fmt((eat-bE)*12)} a year.`},
   {i:'cup',c:'var(--amber)',t:`${tims.n} Tim Hortons visits`,p:`${fmt(tims.s)} in ${N} months, about ${Math.round(tims.n/N/4.3)}× a week. Coffee at home on weekdays saves around ${fmt(tims.s/N*.6*12)} a year.`},
   {i:'bike',c:'var(--amber)',t:`${fmt(del)}/mo on delivery`,p:'Uber Eats, DoorDash and Glovo. Picking up the same food yourself is usually 30–40% cheaper.'},
   {i:'card',c:'var(--debt)',t:'Credit covered the May trip',p:`The trip cost ${fmt(trip)} and $3,000 came from a credit account. A travel fund replaces that.`},
   {i:'bank',c:'var(--fee)',t:`${fmt(fees)} in bank fees`,p:`Over ${N} months. The $16.95/mo fee is waived at a $4,000 balance, or a no-fee account removes it (${fmt(16.95*12)}/yr).`},
   {i:'shield',c:'var(--green)',t:'Insurance dropped $50/mo',p:'AMA went from $246.75 to $196.27 in August. Send that $604/yr to your emergency fund.'},
   {i:'cash',c:'var(--blue)',t:`Pay averages ${fmt(inc)}/mo`,p:`Months ranged ${fmt(Math.min(...Object.values(h.salary)))}–${fmt(Math.max(...Object.values(h.salary)))}. A short pay month is your biggest red-zone risk.`}];
}
const insCard=x=>`<div class="ins"><div class="ic" style="${tint(x.c,15)}">${icon(x.i)}</div><b>${x.t}</b><p>${x.p}</p></div>`;

let BMODE=null;
function vBudget(){
  const t=today(),m=BMODE||mode(t),p=plan(m),spent=monthSpend(ym(t)),h=hist(),d=pd(t),pace=d.getDate()/dim(d.getFullYear(),d.getMonth()+1),bs=budgetsFor(m);
  const env=g=>bs.filter(b=>b.group===g).map(b=>{const sp=spent[b.id]||0,over=sp>b.amt,ha=b.cats.reduce((s,c)=>s+(h.byCat[c]||0),0)/h.N;
    return `<button class="env" onclick="sheetEnv('${b.id}')"><div class="top"><div class="ic" style="${tint(GROUP[g].c)}">${icon(ENV_ICON[b.id])}</div><div style="min-width:0"><div class="nm">${esc(b.name)}</div><div class="meta">${ha>b.amt*1.1?`<span class="warn">usually ${fmt(ha)}</span>`:`usually ${fmt(ha)}`}</div></div><div class="amt"><b class="${over?'neg':''}">${fmt(sp)}</b> <span class="dim">/ ${fmt(b.amt)}</span></div></div>${bar(sp,b.amt,over?'var(--red)':sp>b.amt*pace*1.15?'var(--amber)':GROUP[g].c,b.amt*pace)}</button>`}).join('');
  const tot=p.inc||1,rows=[['Needs',(p.groups.need||0),.5,'var(--need)'],['Wants',(p.groups.want||0)+(p.groups.business||0),.3,'var(--want)'],['Debt, fees & savings',(p.groups.debt||0)+(p.groups.fee||0)+p.sav+Math.max(0,p.margin),.2,'var(--save)']];
  const parts=[['Needs',p.groups.need,'#71a9ff'],['Wants',p.groups.want,'#e9c784'],['Business',p.groups.business,'#a493ff'],['Debt',p.groups.debt,'#ff8f7f'],['Fees',p.groups.fee,'#8a93a6'],['Savings',p.sav,'#45d6a0'],['Room',Math.max(0,p.margin),'#2a303c']].map(([n,v,c])=>({name:n,value:v||0,color:c}));
  return `<div class="between" style="margin-bottom:16px;flex-wrap:wrap;gap:10px"><div class="mini-seg"><button class="${m==='solo'?'on':''}" onclick="BMODE='solo';render()">Just me</button><button class="${m==='couple'?'on':''}" onclick="BMODE='couple';render()">With my wife</button></div><span class="note">${ymLabel(ym(t))} · tap any envelope to edit</span></div>
  <div class="grid gh">
   <div class="card"><div class="ch">${icon('budget')}<h3>Monthly plan</h3><span class="r">${m==='couple'?'couple':'solo'}</span></div>
    <div class="grid g2" style="align-items:center;gap:20px">${donut(parts,fmt(p.inc),'take-home',190)}
    <div>${[['Take-home',p.inc,'pos'],['Bills & debts',-p.fixed,''],['Everyday',-p.vari,''],['Savings',-p.sav,'']].map(([n,v,c])=>`<div class="kv"><span class="muted">${n}</span><b class="num ${c}">${fmt(v)}</b></div>`).join('')}<div class="kv"><b>Room left</b><b class="num ${p.margin<0?'neg':'goldt'}" style="font-size:19px">${fmt(p.margin)}</b></div></div></div>
    <div class="sp"></div><label class="f" style="margin:0"><span class="between"><span>Savings each month</span><b class="goldt num" id="savlbl">${fmt(p.sav)}</b></span><input type="range" min="0" max="1200" step="25" value="${p.sav}" style="${range(p.sav,0,1200)}" oninput="rangeFill(this);$('#savlbl').textContent=fmt(+this.value)" onchange="S.settings.savingsMonthly=+this.value;save();render()"></label>
   </div>
   <div class="card"><div class="ch">${icon('spark')}<h3>Health check</h3><span class="r">50 / 30 / 20</span></div>
    ${p.margin<0?`<div class="alert" style="margin-bottom:14px">${icon('alert')}<div><b>Overspends by ${fmt(-p.margin)}/mo</b><p>Trim an envelope or a bill until room is $0 or more.</p></div></div>`:`<div class="alert green" style="margin-bottom:14px">${icon('check')}<div><b>Balanced</b><p>${fmt(p.margin)} unassigned. Leave it as a cushion or add it to savings.</p></div></div>`}
    ${rows.map(([n,v,tg,c])=>`<div style="margin-bottom:15px"><div class="between" style="margin-bottom:7px;font-size:13.5px"><span>${n}</span><span class="num"><b>${pct(v/tot)}</b> <span class="dim">· aim ${pct(tg)}</span></span></div>${bar(v,tot,c,tot*tg)}</div>`).join('')}
    <div class="note">Rent alone is ${pct(1195/tot)} of pay, so needs run high on one income. That's why wants have to stay lean.</div></div>
  </div><div class="sp"></div>
  <div class="grid g2">${card('Needs','home',env('need'),fmt(bs.filter(b=>b.group==='need').reduce((s,b)=>s+b.amt,0))+'/mo')}${card('Wants','spark',env('want'),fmt(bs.filter(b=>b.group==='want').reduce((s,b)=>s+b.amt,0))+'/mo')}</div>`;
}
function sheetEnv(id){
  const b=S.budgets.find(x=>x.id===id),h=hist(),ha=b.cats.reduce((s,c)=>s+(h.byCat[c]||0),0)/h.N,sp=monthSpend(ym(today()))[id]||0;
  const logs=S.logs.filter(l=>l.cat===id).slice(-5).reverse();
  const step=(k)=>`<div class="row"><button class="icon-btn" onclick="stepEnv('${id}','${k}',-10)">−</button><input class="in num" style="text-align:center" id="e_${k}" type="number" inputmode="decimal" value="${b[k]}"><button class="icon-btn" onclick="stepEnv('${id}','${k}',10)">+</button></div>`;
  openSheet(`<h2>${esc(b.name)}</h2><div class="sub">You usually spend ${fmt(ha)}/mo here. This month so far: ${fmt(sp)}.</div>
   <label class="f"><span>Just me (monthly)</span>${step('solo')}</label><label class="f"><span>With my wife (monthly)</span>${step('couple')}</label>
   ${logs.length?`<div class="dh">Recent logs</div><div class="list">${logs.map(logRow).join('')}</div>`:''}
   <button class="btn gold block" onclick="saveEnv('${id}')">Save</button>`);
}
window.stepEnv=(id,k,d)=>{const el=$('#e_'+k);el.value=Math.max(0,(+el.value||0)+d)};
window.saveEnv=id=>{const b=S.budgets.find(x=>x.id===id);b.solo=Math.max(0,+$('#e_solo').value||0);b.couple=Math.max(0,+$('#e_couple').value||0);save();closeSheet();render();toast('Envelope updated')};

function vBills(){
  const t=today(),p=plan(mode(t)),items=S.recurring.filter(r=>r.kind!=='income'),pc=plan('couple'),ps=plan('solo');
  const groups=[['need','Essential bills'],['debt','Debt payments'],['fee','Bank fees'],['want','Subscriptions'],['business','Web business tools']];
  const next=r=>occurrences({...r,active:true,couple:false},t,addDays(t,400))[0];
  const row=r=>{const n=next(r),col=GROUP[r.group].c;return `<button class="li" onclick="sheetRec('${r.id}')" style="${r.active?'':'opacity:.45'}"><div class="ic" style="${tint(col)}">${icon(REC_ICON[r.id]||'card')}</div><div class="t"><b>${esc(r.name.split(' — ')[0])}${r.couple?' <span class="tag c-violet">wife</span>':''}</b><span>${r.active?(n?'Next '+nice(n):''):'Paused'}${r.variable?' · varies':''} · ${r.acct==='visa'?'Visa':'Chequing'}</span></div><div class="a num">${fmtc(r.amount)}<small>${r.freq==='monthly'?'monthly':r.freq}</small></div></button>`};
  const subs=items.filter(r=>(r.group==='want'||r.group==='business')&&r.active).reduce((s,r)=>s+monthlyEq(r),0);
  return `<div class="grid g4">${stat('Fixed each month',fmt(p.fixed),pct(p.fixed/p.inc)+' of pay')}${stat('Subscriptions',fmt(subs),fmt(subs*12)+' a year')}${stat('Room now',fmt(Math.max(0,ps.margin)),'for anything new',ps.margin<0?'neg':'pos')}${stat('Room with wife',fmt(pc.margin),pc.margin<0?'cut first':'per month',pc.margin<0?'neg':'pos')}</div>
  <div class="sp"></div>
  <div class="grid gh"><div class="card"><div class="ch">${icon('bills')}<h3>Everything that repeats</h3><span class="r"><button class="btn gold sm" onclick="sheetRec()">${icon('plus')} Add</button></span></div>
    ${groups.map(([g,n])=>{const L=items.filter(r=>r.group===g);if(!L.length)return'';return `<div class="dh"><span>${n}</span><span>${fmt(L.filter(r=>r.active).reduce((s,r)=>s+monthlyEq(r),0))}/mo</span></div><div class="list">${L.map(row).join('')}</div>`}).join('')}
    <div class="dh"><span>Income</span></div><div class="list">${S.recurring.filter(r=>r.kind==='income').map(r=>`<button class="li" onclick="sheetRec('${r.id}')"><div class="ic" style="${tint('var(--green)')}">${icon('cash')}</div><div class="t"><b>${esc(r.name.split(' — ')[0])}</b><span>${r.freq==='monthly'?'Around day '+r.day:'Quarterly'}</span></div><div class="a num pos">+${fmtc(r.amount)}</div></button>`).join('')}</div></div>
   <div><div class="card"><div class="ch">${icon('spark')}<h3>Can I afford a new subscription?</h3></div><label class="f"><span>Monthly price</span><input class="in num" id="newsub" type="number" inputmode="decimal" value="15" oninput="subCheck()"></label><div id="subres">${subRes(15)}</div></div>
    <div class="sp"></div><div class="card"><details class="fold"><summary>${icon('alert','warn')}<h3 style="font-size:14px">Worth reviewing</h3>${icon('chev','chev')}</summary><div class="list">
     ${[['Web business tools',fixedMonthly('solo',r=>r.group==='business'),'Keep only if the business earns more than this.'],['PlayStation Plus',27.99,'Pause in months you play free games.'],['Claude Pro',29.40,'Keep if it\'s for work. It may be expensable.'],['Snap + Affirm',146.34,'When they end, send $146/mo to savings.'],['Bank fee',16.95,'Waived at $4,000 balance, or switch to no-fee.']].map(([n,a,d])=>`<div class="li"><div class="t"><b>${n}</b><span style="white-space:normal">${d}</span></div><div class="a num">${fmt(a)}<small>/mo</small></div></div>`).join('')}</div></details></div></div></div>`;
}
const subRes=v=>{const a=plan('solo').margin,b=plan('couple').margin;const ok=(m,n)=>`<div class="kv"><span>${n}</span><b class="${m-v>=0?'pos':'neg'}">${m-v>=0?'Yes':'Not yet'} · ${fmt(m-v)} left</b></div>`;return ok(a,'Right now')+ok(b,'Once she arrives')+`<div class="note" style="margin-top:6px">${fmt(v*12)} a year.</div>`};
window.subCheck=()=>{$('#subres').innerHTML=subRes(+$('#newsub').value||0)};

let FD=60,FV='list',CALM=null,FLN=10;
function vFlow(){
  const s=safeToSpend(),f=forecast(FD),t=today(),groups={};for(const e of f.evs)(groups[e.date]=groups[e.date]||[]).push(e);
  const inS=f.evs.filter(e=>e.amount>0).reduce((a,e)=>a+e.amount,0),outS=-f.evs.filter(e=>e.amount<0).reduce((a,e)=>a+e.amount,0),burn=f.pts.slice(1).reduce((a,p)=>a+dailyBurn(p.date),0),end=f.pts.at(-1);
  AFTER=()=>lineChart($('#fc'),f.pts,{buffer:s.buf,h:innerWidth<820?200:260,marks:f.evs.filter(e=>e.kind==='income').map(e=>({date:e.date,c:'#45d6a0'})),extra:p=>{const g=groups[p.date];return g?'<br>'+g.slice(0,4).map(e=>`${e.amount>0?'+':''}${fmt(e.amount)} ${esc(e.name.split(' — ')[0])}`).join('<br>'):''}});
  const days=Object.keys(groups).sort();
  const list=days.slice(0,FLN).map(d=>{const bal=f.pts.find(p=>p.date===d)?.y;return `<div class="dh"><span>${nice(d,{dow:1})}</span><span class="${bal<s.buf?'neg':''}">≈ ${fmt(bal)}</span></div>`+groups[d].map(e=>evRow(e,false)).join('')}).join('');
  return `<div class="between" style="margin-bottom:16px;flex-wrap:wrap;gap:10px"><div class="mini-seg">${[30,60,90].map(d=>`<button class="${FD===d?'on':''}" onclick="FD=${d};render()">${d} days</button>`).join('')}</div><div class="mini-seg"><button class="${FV==='list'?'on':''}" onclick="FV='list';render()">List</button><button class="${FV==='cal'?'on':''}" onclick="FV='cal';render()">Calendar</button></div></div>
  <div class="grid g4">${stat('Coming in',fmt(inS),'pay & credits','pos')}${stat('Bills & savings',fmt(outS),'scheduled')}${stat('Everyday',fmt(burn),'from envelopes')}${stat('Ending balance',fmt(end.y),nice(end.date),end.y<s.buf?'neg':'')}</div>
  <div class="sp"></div>
  ${card('Projected balance','flow',`<div class="chart" id="fc"></div>${legend([['Balance','var(--gold)'],['Below '+fmt(s.buf)+' buffer','var(--red)'],['Payday','var(--green)']])}`,'touch the chart')}
  <div class="sp"></div>
  ${FV==='cal'?calView(f,s):card('Every money in & out','bills',`<div class="list">${list||'<div class="empty">Nothing scheduled</div>'}</div>${days.length>FLN?`<button class="more" onclick="FLN+=12;render()">Show more ${icon('chev')}</button>`:''}`)}`;
}
function calView(f,s){
  const t=today();if(!CALM)CALM=ym(t);const[y,m]=CALM.split('-').map(Number),first=new Date(y,m-1,1,12),start=addDays(ds(first),-first.getDay()),evs=events(start,addDays(start,41));
  const mob=innerWidth<820;let cells='';
  for(let i=0;i<42;i++){const d=addDays(start,i),es=evs.filter(e=>e.date===d&&!e.save),p=f.pts.find(p=>p.date===d);
    cells+=`<div class="d ${ym(d)!==CALM?'o':''} ${d===t?'t':''} ${p&&p.y<s.buf?'rz':''}"><div class="n">${pd(d).getDate()}</div>${mob?`<div class="dots">${es.map(e=>`<i style="background:${e.amount>0?'var(--green)':'var(--tx3)'}"></i>`).join('')}</div>`:es.slice(0,3).map(e=>`<div class="ev ${e.amount>0?'in':'out'}">${e.amount>0?'+':''}${fmt(e.amount)} ${esc(e.name.split(' — ')[0].split(' (')[0])}</div>`).join('')+(es.length>3?`<div class="dim">+${es.length-3}</div>`:'')}</div>`}
  const nav=k=>{const d=new Date(y,m-1+k,1);return `${d.getFullYear()}-${pad(d.getMonth()+1)}`};
  return `<div class="card"><div class="between" style="margin-bottom:14px"><button class="icon-btn" onclick="CALM='${nav(-1)}';render()">${icon('back')}</button><b class="serif" style="font-size:24px">${ymLabel(CALM)}</b><button class="icon-btn" onclick="CALM='${nav(1)}';render()">${icon('right')}</button></div><div class="cal">${DOW.map(d=>`<div class="h">${d[0]}</div>`).join('')}${cells}</div>${legend([['Money in','var(--green)'],['Bill','var(--tx3)'],['Below buffer','var(--red)']])}</div>`;
}

function vOverview(){
  const h=hist(),N=h.N,months=h.months,L=months.map(k=>MONTHS[+k.slice(5)-1]);
  const avgSpend=Object.values(h.byGroup).reduce((a,b)=>a+b,0)/N,avgInc=Object.values(h.income).reduce((a,b)=>a+b,0)/N,avgSal=Object.values(h.salary).reduce((a,b)=>a+b,0)/N,left=avgInc-avgSpend-6951.84/N;
  const cats=window._cats=Object.entries(h.byCat).sort((a,b)=>b[1]-a[1]),maxC=cats[0][1]/N,trip=-h.spend.filter(t=>t.travel&&ym(t.date)==='2026-05').reduce((s,t)=>s+t.amount,0);
  const GC={need:'#71a9ff',want:'#e9c784',debt:'#ff8f7f',business:'#a493ff',fee:'#8a93a6'};
  AFTER=()=>stackChart($('#sc'),L,Object.keys(GC).map(g=>({name:GROUP[g].n,color:GC[g],values:months.map(k=>h.byMonth[k]?.[g]||0)})),{h:innerWidth<820?210:250,lines:[{name:'Take-home',color:'#45d6a0',values:months.map(k=>h.salary[k]||0)}]});
  return `<div class="grid g4">${stat('Avg take-home',fmt(avgSal),'per month','pos')}${stat('Avg spending',fmt(avgSpend),'per month')}${stat('Eating out',fmt(h.eatOut/N),pct(h.eatOut/N/avgSal)+' of pay','neg')}${stat('Left over',fmt(left),'per month, before tax refund',left<0?'neg':'pos')}</div>
  <div class="sp"></div>
  <div class="grid gh">${card('Spending vs. pay','insights',`<div class="chart" id="sc"></div>${legend(Object.keys(GC).map(g=>[GROUP[g].n,GC[g]]).concat([['Take-home','#45d6a0']]))}<div class="note" style="margin-top:10px">May's spike is the Morocco & Türkiye trip (${fmt(trip)}). Most other months spent about everything that came in.</div>`,'tap a month')}
   ${card('Where it goes','budget',`${donut(Object.entries(h.byGroup).map(([g,v])=>({name:GROUP[g].n,value:v,color:GC[g]})),fmt(avgSpend),'per month',180)}<div class="sp"></div>${Object.entries(h.byGroup).sort((a,b)=>b[1]-a[1]).map(([g,v])=>`<div class="kv"><span><span style="color:${GC[g]}">●</span> ${GROUP[g].n}</span><b class="num">${fmt(v/N)}<span class="dim" style="font-weight:400">/mo</span></b></div>`).join('')}`)}</div>
  <div class="sp"></div>
  ${card('By category','tx',`<div id="catlist">${catRows(cats.slice(0,8),maxC,N)}</div>${cats.length>8?`<button class="more" onclick="this.remove();$('#catlist').innerHTML=catRows(window._cats,${maxC},${N})">Show all ${cats.length} ${icon('chev')}</button>`:''}`,'monthly average')}`;
}
const CATC=['#e9c784','#71a9ff','#45d6a0','#a493ff','#ff8fb8','#4fd1d1','#ffb44d','#ff8f7f','#b6e36f','#8a93a6','#d98cff','#62cfff','#ffd36a','#7fa1c9'];
window.catRows=(cats,maxC,N)=>cats.map(([c,v],i)=>`<div style="padding:9px 0"><div class="between" style="margin-bottom:6px;font-size:14px"><span>${esc(c)}</span><b class="num">${fmt(v/N)}</b></div>${bar(v/N,maxC,CATC[i%CATC.length])}</div>`).join('');

function vHabits(){
  const h=hist(),N=h.N,visits=['Tim Hortons',"McDonald's","Mac's Convenience",'Uber Eats','Milly Oak Café','A&W','Starbucks','Glovo'].map(n=>[n,h.byMerch[n]||{n:0,s:0}]);
  const merch=Object.entries(h.byMerch).filter(([k,v])=>v.s>0).sort((a,b)=>b[1].s-a[1].s).slice(0,10);
  return `${card('The small stuff that adds up','cup',`<div class="grid g4" style="gap:10px">${visits.map(([n,v])=>`<div class="ins" style="gap:4px"><span class="note">${esc(n)}</span><span class="serif" style="font-size:34px;line-height:1.1">${v.n}<span class="dim" style="font-size:14px;font-family:var(--sans)"> visits</span></span><span class="note">${fmt(v.s)} · ${(v.n/N/4.33).toFixed(1)}×/week</span></div>`).join('')}</div>`,N+' months')}
  <div class="sp"></div>${card('Every insight','spark',`<div class="grid g2" style="gap:10px">${insights().map(insCard).join('')}</div>`)}
  <div class="sp"></div>${card('Top places','cart',`<div class="list">${merch.map(([n,v])=>`<div class="li"><div class="ic" style="${tint('var(--tx2)',8)}">${esc(n.slice(0,1))}</div><div class="t"><b>${esc(n)}</b><span>${v.n} purchase${v.n!==1?'s':''} · ${esc(v.cat)}</span></div><div class="a num">${fmt(v.s)}<small>${fmt(v.s/N)}/mo</small></div></div>`).join('')}</div>`,'by total spent')}`;
}

let TXQ='',TXC='',TXN=60;
function txAll(){const h=hist();return S.logs.map(l=>({date:l.date,acct:'Logged',amount:l.amount,merchant:l.note||S.budgets.find(b=>b.id===l.cat)?.name||'Expense',cat:S.budgets.find(b=>b.id===l.cat)?.name||(l.amount>0?'Income':'Other'),group:l.amount>0?'income':'want',log:l})).concat(h.tx).sort((a,b)=>b.date.localeCompare(a.date))}
function vTx(){
  const all=txAll(),cats=[...new Set(all.map(t=>t.cat))].sort();
  AFTER=()=>txList();
  return `<div class="card"><div class="grid" style="grid-template-columns:minmax(0,1fr) minmax(0,.7fr);gap:10px;margin-bottom:6px"><input class="in" id="txq" type="search" placeholder="Search…" value="${esc(TXQ)}" oninput="TXQ=this.value;TXN=60;txList()"><select class="in" onchange="TXC=this.value;TXN=60;txList()"><option value="">All categories</option>${cats.map(c=>`<option ${c===TXC?'selected':''}>${esc(c)}</option>`).join('')}</select></div><div id="txl"></div></div>`;
}
window.txList=()=>{
  let all=txAll();if(TXQ)all=all.filter(t=>(t.merchant+' '+t.cat).toLowerCase().includes(TXQ.toLowerCase()));if(TXC)all=all.filter(t=>t.cat===TXC);
  const out=-all.filter(t=>t.amount<0&&t.group!=='transfer').reduce((s,t)=>s+t.amount,0);
  let html=`<div class="note" style="padding:6px 0 4px">${all.length} transactions · ${fmt(out)} spent · transfers between your accounts are greyed out</div>`,cur='';
  for(const t of all.slice(0,TXN)){const k=ym(t.date);if(k!==cur){cur=k;const mo=all.filter(x=>ym(x.date)===k&&x.amount<0&&x.group!=='transfer').reduce((s,x)=>s-x.amount,0);html+=`<div class="dh"><span>${ymLabel(k)}</span><span>${fmt(mo)} out</span></div>`}
    const col=GROUP[t.group]?.c||'var(--tx3)';html+=`<${t.log?`button onclick="sheetLog('${t.log.id}')"`:'div'} class="li" style="${t.group==='transfer'?'opacity:.45':''}"><div class="ic" style="${tint(col,12)}">${esc((t.merchant||'?').slice(0,1))}</div><div class="t"><b>${esc(t.merchant)}</b><span>${nice(t.date)} · ${esc(t.cat)} · ${t.acct}</span></div><div class="a num ${t.amount>0?'pos':''}">${t.amount>0?'+':''}${fmtc(t.amount)}</div></${t.log?'button':'div'}>`}
  if(all.length>TXN)html+=`<button class="more" onclick="TXN+=120;txList()">Show more ${icon('chev')}</button>`;
  if(!all.length)html+='<div class="empty">No matches</div>';
  $('#txl').innerHTML=html;
};

function vFamily(){
  const st=S.settings,ps=plan('solo'),pc=plan('couple'),bs=budgetsFor('solo'),bc=budgetsFor('couple');
  const setupT=S.setup.reduce((s,x)=>s+(+x.amount||0),0),goal=S.goals.find(g=>g.id==='setup');
  const monthsTo=st.wifeArrival?Math.max(0,diffDays(today(),st.wifeArrival)/30.4):null,perM=monthsTo!=null?Math.max(0,(setupT-(goal?.saved||0))/Math.max(monthsTo,.5)):null;
  const din=bc.filter(b=>['dineout','coffee','fastfood','delivery'].includes(b.id)).reduce((s,b)=>s+b.amt,0),trv=bc.find(b=>b.id==='travel').amt+bc.find(b=>b.id==='fuel').amt;
  const lv=[['Claim spouse amount on your TD1',st.spouseCredit?0:(+st.spouseCreditAmt||0)],['Affirm ends',S.recurring.find(r=>r.id==='affirm')?.active?88.64:0],['Snap Finance ends',S.recurring.find(r=>r.id==='snap')?.active?57.70:0],['Pause PlayStation Plus',S.recurring.find(r=>r.id==='psn')?.active?27.99:0],['Drop Google Ads',S.recurring.find(r=>r.id==='gads')?.active?40:0]].filter(x=>x[1]>0);
  const cmp=(n,a,b)=>`<div class="kv"><span class="muted" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${n}</span><span class="num" style="white-space:nowrap"><span class="dim">${fmt(a)} →</span> <b>${fmt(b)}</b></span></div>`;
  return `<div class="grid gh">
   <div class="card hero ${pc.margin<0?'red':''}"><div class="between"><span class="eyebrow">When ${esc(st.partner||'your wife')} arrives</span>${pc.margin<0?'<span class="chip c-red"><i></i>Tight</span>':'<span class="chip c-green"><i></i>It works</span>'}</div>
    <div class="big num" style="font-size:60px;margin:14px 0 6px">${fmt(pc.margin)}<small style="font-size:20px;color:var(--tx2)"> /mo room</small></div>
    <div class="muted" style="font-size:14px">${fmt(pc.inc)} take-home for two, after bills, everyday envelopes and ${fmt(pc.sav)} savings.</div>
    ${pc.margin<0&&lv.length?`<div class="sp"></div><div class="eyebrow" style="margin-bottom:4px">How to close the gap</div>${lv.map(([n,v])=>`<div class="kv"><span class="muted">${n}</span><b class="pos num">+${fmt(v)}</b></div>`).join('')}`:''}
    <div class="trio"><div><div class="l">Dining out</div><div class="v num">${fmt(din)}</div></div><div><div class="l">Gas + trips</div><div class="v num">${fmt(trv)}</div></div><div><div class="l">Groceries</div><div class="v num">${fmt(bc.find(b=>b.id==='groceries').amt)}</div></div></div></div>
   <div class="card"><div class="ch">${icon('family')}<h3>Her arrival</h3></div>
    <label class="f"><span>Her name (optional)</span><input class="in" value="${esc(st.partner)}" onchange="S.settings.partner=this.value;save();render()" placeholder="Name"></label>
    <label class="f"><span>Arrival date (forecast switches to the couple plan)</span><input class="in" type="date" value="${st.wifeArrival}" onchange="S.settings.wifeArrival=this.value;save();render();toast('Forecast updated')"></label>
    <div class="between" style="padding:6px 0 14px"><div style="min-width:0"><b style="font-size:14px">Spouse amount on TD1</b><div class="note">Less tax off each cheque. Estimate +${fmt(+st.spouseCreditAmt||0)}/mo, so confirm with payroll.</div></div><label class="switch"><input type="checkbox" ${st.spouseCredit?'checked':''} onchange="S.settings.spouseCredit=this.checked;save();render()"><i></i></label></div>
    <div class="mini-seg" style="width:100%;display:grid;grid-template-columns:repeat(3,1fr)">${[['auto','By date'],['solo','Solo'],['couple','Couple']].map(([k,n])=>`<button class="${st.planMode===k?'on':''}" onclick="S.settings.planMode='${k}';save();render()">${n}</button>`).join('')}</div></div>
  </div><div class="sp"></div>
  <div class="grid g2">
   <div class="card"><details class="fold"><summary>${icon('budget','goldt')}<h3 style="font-size:14px">Solo → couple, line by line</h3>${icon('chev','chev')}</summary>${cmp('Take-home',ps.inc,pc.inc)}${cmp('Bills & debts',ps.fixed,pc.fixed)}${bs.map((b,i)=>cmp(b.name,b.amt,bc[i].amt)).join('')}${cmp('Savings',ps.sav,pc.sav)}<div class="kv"><b>Room left</b><span class="num"><span class="dim">${fmt(ps.margin)} →</span> <b class="${pc.margin<0?'neg':'goldt'}">${fmt(pc.margin)}</b></span></div><button class="more" onclick="BMODE='couple';go('plan','budget')">Edit couple envelopes ${icon('right')}</button></details></div>
   <div class="card"><div class="ch">${icon('home')}<h3>One-time setup costs</h3><span class="r">${fmt(setupT)}</span></div><div class="list">${S.setup.map((x,i)=>`<button class="li" onclick="sheetSetup(${i})"><div class="t"><b>${esc(x.name)}</b></div><div class="a num">${fmt(x.amount)}</div>${icon('right','chev')}</button>`).join('')}</div><button class="more" onclick="sheetSetup(-1)">${icon('plus')} Add item</button>
    <div class="note" style="margin-top:12px">${perM!=null?`Set aside <b class="goldt">${fmt(perM)}/mo</b> to be ready by ${nice(st.wifeArrival,{y:1})}.`:'Add her arrival date to see how much to set aside each month.'}</div></div>
  </div><div class="sp"></div>
  <div class="card"><details class="fold"><summary>${icon('check','goldt')}<h3 style="font-size:14px">Checklist for her first months</h3>${icon('chev','chev')}</summary><div class="grid g3" style="gap:10px">
   ${[['Alberta Health Care','Register her soon after she lands so coverage starts with no gap.'],['SIN & bank account','Get her SIN at Service Canada, then a bank account to start her credit history.'],['Update TD1 / TD1AB','Tell payroll you support a spouse, so less tax comes off each cheque.'],['File taxes together','Even with no income she should file. It unlocks a bigger GST credit.'],['Car insurance','Add her to your AMA policy before she drives.'],['Phone line','An add-a-line plan is usually cheapest. Budgeted at $45/mo.']].map(([a,b])=>`<div class="ins"><b>${a}</b><p>${b}</p></div>`).join('')}</div></details></div>`;
}
window.sheetSetup=i=>{const x=i>=0?S.setup[i]:{name:'',amount:0};openSheet(`<h2>${i>=0?'Edit item':'New item'}</h2><div class="sub">One-time cost for her arrival.</div><label class="f"><span>What</span><input class="in" id="su_n" value="${esc(x.name)}"></label><label class="f"><span>Amount</span><input class="in num" id="su_a" type="number" inputmode="decimal" value="${x.amount||''}"></label><button class="btn gold block" onclick="saveSetup(${i})">Save</button>${i>=0?`<button class="btn ghost block" style="color:var(--red);margin-top:10px" onclick="S.setup.splice(${i},1);save();closeSheet();render()">Delete</button>`:''}`)};
window.saveSetup=i=>{const x={name:$('#su_n').value||'Item',amount:+$('#su_a').value||0};if(i>=0)S.setup[i]=x;else S.setup.push(x);save();closeSheet();render()};

function vGoals(){
  const sav=+S.settings.savingsMonthly||0,shareT=S.goals.reduce((s,g)=>s+(+g.share||0),0)||1;
  return `<div class="grid g4">${stat('Saving monthly',fmt(sav),fmt(sav/2)+' each payday','pos')}${stat('Saved so far',fmt(S.goals.reduce((s,g)=>s+(+g.saved||0),0)),S.goals.length+' goals')}</div><div class="sp"></div>
  <div class="grid g3">${S.goals.map((g,i)=>{const per=sav*(+g.share||0)/shareT,left=Math.max(0,g.target-g.saved),eta=per>0?Math.ceil(left/per):null,d=new Date();d.setMonth(d.getMonth()+(eta||0));
   return `<button class="card tap" style="text-align:left" onclick="sheetGoal(${i})"><div class="row" style="gap:16px"><div class="gring">${ringSvg(g.saved/g.target,'var(--green)',76,12)}<div class="rc"><b style="font-size:15px">${pct(g.saved/g.target)}</b></div></div><div style="min-width:0"><div style="font-weight:600;font-size:15px">${esc(g.name)}</div><div class="serif num" style="font-size:26px;line-height:1.2">${fmt(g.saved)} <span class="dim" style="font-size:15px;font-family:var(--sans)">of ${fmt(g.target)}</span></div></div></div>
   <div class="note" style="margin-top:12px">${left<=0?'<span class="pos">Done</span>':eta?`${fmt(per)}/mo · reached ~${MONTHS[d.getMonth()]} ${d.getFullYear()}`:'Give it a share of savings'}</div><div class="note">${esc(g.note||'')}</div></button>`}).join('')}
   <button class="card tap" style="display:grid;place-items:center;min-height:150px;color:var(--gold);font-weight:600" onclick="sheetGoal(-1)">${icon('plus')} New goal</button></div>
  <div class="sp"></div><div class="alert ag" style="cursor:default">${icon('spark')}<div><b>Make it automatic</b><p>Set up a transfer of ${fmt(sav/2)} to a savings account (or TFSA) on the 6th and 20th, the days pay lands.</p></div></div>`;
}
window.sheetGoal=i=>{const g=i>=0?S.goals[i]:{name:'',target:1000,saved:0,share:10};openSheet(`<h2>${i>=0?esc(g.name):'New goal'}</h2><div class="sub">Share = the % of your monthly savings that goes here.</div>
  <label class="f"><span>Name</span><input class="in" id="g_n" value="${esc(g.name)}"></label><div class="grid g2" style="gap:10px;grid-template-columns:1fr 1fr"><label class="f"><span>Saved</span><input class="in num" id="g_s" type="number" inputmode="decimal" value="${g.saved}"></label><label class="f"><span>Target</span><input class="in num" id="g_t" type="number" inputmode="decimal" value="${g.target}"></label></div>
  <label class="f"><span class="between"><span>Share of savings</span><b class="goldt" id="g_sl">${g.share}%</b></span><input type="range" id="g_sh" min="0" max="100" step="5" value="${g.share}" style="${range(g.share,0,100)}" oninput="rangeFill(this);$('#g_sl').textContent=this.value+'%'"></label>
  <button class="btn gold block" onclick="saveGoal(${i})">Save</button>${i>=0?`<button class="btn ghost block" style="color:var(--red);margin-top:10px" onclick="S.goals.splice(${i},1);save();closeSheet();render()">Delete goal</button>`:''}`)};
window.saveGoal=i=>{const g=i>=0?S.goals[i]:{id:uid(),icon:'goals',note:''};g.name=$('#g_n').value||'Goal';g.saved=+$('#g_s').value||0;g.target=+$('#g_t').value||1;g.share=+$('#g_sh').value;if(i<0)S.goals.push(g);save();closeSheet();render();toast('Goal saved')};

function vDebt(){
  const dsum=S.debts.reduce((s,d)=>s+(d.balance||0),0),pay=S.debts.reduce((s,d)=>s+(+d.min||0),0);
  return `<div class="grid g4">${stat('Known balances',fmt(dsum),'tap a debt to add yours','neg')}${stat('Monthly payments',fmt(pay),'minimums')}</div><div class="sp"></div>
  <div class="grid g2">${S.debts.map((d,i)=>`<button class="card tap" style="text-align:left" onclick="sheetDebt(${i})"><div class="row"><div class="ic" style="${tint('var(--debt)')}">${icon('card')}</div><div style="min-width:0;flex:1"><div style="font-weight:600">${esc(d.name)}</div><div class="note">${d.apr?d.apr+'% APR · ':''}${fmt(d.min)}/mo</div></div><div class="serif num" style="font-size:26px">${d.balance!=null?fmt(d.balance):'<span class="dim" style="font-size:15px;font-family:var(--sans)">add balance</span>'}</div></div>
   ${d.balance&&d.min?`<div class="note" style="margin-top:10px">Paid off in ~${Math.ceil(d.balance/Math.max(d.min,1))} months at this rate${d.apr?` · ≈ ${fmt(d.balance*d.apr/100/12)}/mo interest`:''}</div>`:''}<div class="note" style="margin-top:6px">${esc(d.note||'')}</div></button>`).join('')}</div>
  <div class="sp"></div><div class="card"><div class="ch">${icon('shield')}<h3>Order of attack</h3></div><div class="list">${[['Pay the Visa in full every month','At 20.99% APR, carrying a balance is the most expensive habit.'],['No more cash advances','Interest starts on day one, plus a $5 fee each time.'],['Roll finished payments into savings','When Affirm and Snap end, keep "paying" $146/mo to your emergency fund.']].map(([a,b],i)=>`<div class="li"><div class="ic" style="${tint('var(--gold)')}">${i+1}</div><div class="t"><b style="white-space:normal">${a}</b><span style="white-space:normal">${b}</span></div></div>`).join('')}</div></div>`;
}
window.sheetDebt=i=>{const d=S.debts[i];openSheet(`<h2>${esc(d.name)}</h2><div class="sub">${esc(d.note||'')}</div><label class="f"><span>Balance owed</span><input class="in num" id="d_b" type="number" inputmode="decimal" placeholder="Check your account" value="${d.balance??''}"></label><div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><label class="f"><span>APR %</span><input class="in num" id="d_a" type="number" inputmode="decimal" value="${d.apr??''}"></label><label class="f"><span>Monthly payment</span><input class="in num" id="d_m" type="number" inputmode="decimal" value="${d.min??''}"></label></div><button class="btn gold block" onclick="saveDebt(${i})">Save</button>`)};
window.saveDebt=i=>{const d=S.debts[i],v=id=>$(id).value;d.balance=v('#d_b')===''?null:+v('#d_b');d.apr=v('#d_a')===''?null:+v('#d_a');d.min=+v('#d_m')||0;save();closeSheet();render();toast('Saved')};

let DIN={n:4,avg:45},TRIP={name:'Banff weekend',km:340,l100:9,price:1.35,nights:2,hotel:160,food:90,act:80,days:3};
function vTrips(){
  const m=mode(today()),bs=budgetsFor(m),dine=bs.filter(b=>['dineout','coffee','fastfood','delivery'].includes(b.id)),dineT=dine.reduce((s,b)=>s+b.amt,0),h=hist();
  AFTER=()=>{updDining();updTrip()};
  const fld=(k,l,st='1')=>`<label class="f"><span>${l}</span><input class="in num" type="number" inputmode="decimal" step="${st}" value="${TRIP[k]}" oninput="TRIP.${k}=+this.value;updTrip()"></label>`;
  return `<div class="grid g2">
   <div class="card"><div class="ch">${icon('food')}<h3>Dining out</h3><span class="r">${m==='couple'?'for two':'just you'}</span></div>
    <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:10px">${dine.map(b=>`<div class="ins" style="gap:2px;padding:14px"><span class="note">${esc(b.name)}</span><span class="serif num" style="font-size:28px">${fmt(b.amt)}</span><span class="note">${fmt(b.amt/4.33)} a week</span></div>`).join('')}</div>
    <div class="note" style="margin:12px 0 18px">${fmt(dineT)}/mo all-in (${fmt(dineT/4.33)}/week). You used to spend <span class="neg">${fmt(h.eatOut/h.N)}</span>.</div>
    <div class="eyebrow" style="margin-bottom:10px">Plan this month's dinners</div>
    <label class="f"><span class="between"><span>Sit-down dinners</span><b id="dn">${DIN.n}</b></span><input type="range" min="0" max="12" value="${DIN.n}" style="${range(DIN.n,0,12)}" oninput="rangeFill(this);DIN.n=+this.value;updDining()"></label>
    <label class="f"><span class="between"><span>Average bill incl. tip</span><b id="da">${fmt(DIN.avg)}</b></span><input type="range" min="15" max="150" step="5" value="${DIN.avg}" style="${range(DIN.avg,15,150)}" oninput="rangeFill(this);DIN.avg=+this.value;updDining()"></label>
    <div id="dres"></div></div>
   <div class="card"><div class="ch">${icon('plane')}<h3>Trip planner</h3></div>
    <label class="f"><span>Trip</span><input class="in" value="${esc(TRIP.name)}" oninput="TRIP.name=this.value"></label>
    <div class="grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:0 10px">${fld('km','Round trip km')}${fld('price','Gas $/L','.01')}${fld('l100','Car L/100km','.1')}${fld('nights','Hotel nights')}${fld('hotel','Hotel $/night')}${fld('days','Days')}${fld('food','Food $/day')}${fld('act','Activities $')}</div>
    <div id="tres"></div></div></div>`;
}
window.updDining=()=>{const bs=budgetsFor(mode(today())),env=bs.find(b=>b.id==='dineout').amt,c=DIN.n*DIN.avg;$('#dn').textContent=DIN.n;$('#da').textContent=fmt(DIN.avg);
  $('#dres').innerHTML=`<div class="kv"><span class="muted">Cost</span><b class="num">${fmt(c)}</b></div><div class="kv"><span class="muted">Restaurant envelope</span><b class="num">${fmt(env)}</b></div><div class="alert ${c<=env?'green':''}" style="margin:12px 0 0">${icon(c<=env?'check':'alert')}<div><b>${c<=env?'Fits. Enjoy it':'Over by '+fmt(c-env)}</b><p>${c<=env?fmt(env-c)+' left for the rest of the month.':'Skip a few coffees or deliveries to cover it.'}</p></div></div>`};
window.updTrip=()=>{const T=TRIP,m=mode(today()),bs=budgetsFor(m),tf=bs.find(b=>b.id==='travel').amt,tg=S.goals.find(g=>g.id==='trips'),gas=T.km*T.l100/100*T.price,ho=T.nights*T.hotel,fo=T.days*T.food,tot=gas+ho+fo+(+T.act||0),have=tg?.saved||0,mo=Math.max(0,(tot-have)/Math.max(1,tf+(+S.settings.savingsMonthly||0)*(tg?.share||0)/100));
  $('#tres').innerHTML=[['Gas',gas],['Hotel',ho],['Food',fo],['Activities',+T.act||0]].map(([n,v])=>`<div class="kv"><span class="muted">${n}</span><b class="num">${fmtc(v)}</b></div>`).join('')+`<div class="kv"><b>Total</b><b class="num goldt serif" style="font-size:28px;font-weight:400">${fmt(tot)}</b></div><div class="alert ${have>=tot?'green':'ag'}" style="margin:12px 0 0;cursor:default">${icon(have>=tot?'check':'plane')}<div><b>${have>=tot?'Already paid for':'Ready in '+(mo<1?'under a month':Math.ceil(mo)+' month'+(Math.ceil(mo)>1?'s':''))}</b><p>${have>=tot?'Your trips fund covers it. No credit needed.':`Trips fund has ${fmt(have)}. Book once it's covered, not on credit.`}</p></div></div><button class="btn ghost block" onclick="S.trips.push({...TRIP,total:${Math.round(tot)}});save();toast('Trip saved')">Save this trip</button>`+(S.trips.length?`<div class="dh" style="padding-top:18px"><span>Saved trips</span></div>`+S.trips.map((x,i)=>`<div class="li"><div class="t"><b>${esc(x.name)}</b><span>${x.km} km · ${x.nights} night(s)</span></div><div class="a num">${fmt(x.total)}</div><button class="icon-btn" style="width:34px;height:34px" onclick="S.trips.splice(${i},1);save();updTrip()">${icon('x')}</button></div>`).join(''):'')};

function vSettings(){
  const st=S.settings,pays=S.recurring.filter(r=>r.id.startsWith('pay'));
  return `<div class="grid g2"><div class="card"><div class="ch">${icon('cash')}<h3>Income & safety</h3></div>
   <label class="f"><span>Your name</span><input class="in" value="${esc(st.name)}" onchange="S.settings.name=this.value;save();render()"></label>
   ${pays.map(r=>`<div class="grid" style="grid-template-columns:1.4fr 1fr;gap:10px"><label class="f"><span>${r.id==='pay1'?'1st':'2nd'} paycheque</span><input class="in num" type="number" inputmode="decimal" value="${r.amount}" onchange="S.recurring.find(x=>x.id==='${r.id}').amount=+this.value;save();render()"></label><label class="f"><span>Day of month</span><input class="in num" type="number" inputmode="numeric" min="1" max="31" value="${r.day}" onchange="S.recurring.find(x=>x.id==='${r.id}').day=+this.value;save();render()"></label></div>`).join('')}
   <div class="note" style="margin:-4px 0 14px">Your 16 pays (Jan–Aug) averaged $1,786, landing around the 4th–8th and the 19th–22nd.</div>
   <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><label class="f"><span>Safety buffer</span><input class="in num" type="number" inputmode="decimal" value="${st.buffer}" onchange="S.settings.buffer=+this.value;save();render()"></label><label class="f"><span>Monthly savings</span><input class="in num" type="number" inputmode="decimal" value="${st.savingsMonthly}" onchange="S.settings.savingsMonthly=+this.value;save();render()"></label></div></div>
   <div class="card"><div class="ch">${icon('cloud')}<h3>Cloud sync</h3></div><div id="cloudbox">${cloudCard()}</div></div>
   <div class="card"><div class="ch">${icon('lock')}<h3>Privacy & data</h3></div>
   <div class="note" style="margin-bottom:16px">Your statement data is published only as an encrypted vault that your passphrase unlocks. Logs and edits are encrypted on this device before anything is saved or synced.</div>
   <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" onclick="exportData()">Export backup</button><label class="btn ghost">Import backup<input type="file" accept=".json" class="hidden" onchange="importData(this.files[0])"></label><button class="btn ghost" onclick="location.reload()">${icon('lock')} Lock</button><button class="btn ghost" onclick="LS.del('nest.key');toast('Passphrase needed next time')">Forget device</button></div>
   <button class="btn ghost block" style="color:var(--red)" onclick="if(confirm('Erase all your logs and edits on this device?')){S=freshState(BASE);save();render();toast('Reset')}">Reset local edits</button>
   <div class="note" style="margin-top:16px">Scotiabank chequing Jan–Aug 2026 · Momentum Visa Dec 26, 2025 – Oct 25, 2026 · ${BASE.tx.length} transactions, reconciled to the cent.</div></div></div>`;
}
window.exportData=async()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([await encLocal(S)],{type:'application/json'}));a.download=`nest-backup-${today()}.json`;a.click();toast('Encrypted backup downloaded')};
window.importData=async f=>{try{S=await decLocal(await f.text());save();render();toast('Backup restored')}catch(e){toast('Could not open that backup')}};

let SHEETY=0;
function openSheet(html){closeSheet(true);SHEETY=window.scrollY;const d=document.createElement('div');d.className='scrim';d.id='scrim';d.innerHTML=`<div class="sheet" role="dialog"><div class="grab"></div>${html}</div>`;
  d.addEventListener('click',e=>{if(e.target===d)closeSheet()});document.body.appendChild(d);document.body.style.overflow='hidden';
  const sh=d.querySelector('.sheet');let y0=null,dy=0;sh.addEventListener('touchstart',e=>{if(sh.scrollTop<=0)y0=e.touches[0].clientY},{passive:true});
  sh.addEventListener('touchmove',e=>{if(y0==null)return;dy=Math.max(0,e.touches[0].clientY-y0);if(dy>0)sh.style.transform=`translateY(${dy}px)`},{passive:true});
  sh.addEventListener('touchend',()=>{if(dy>110)closeSheet();else sh.style.transform='';y0=null;dy=0});}
function closeSheet(now){const d=$('#scrim');if(!d)return;document.body.style.overflow='';if(now){d.remove();return}d.classList.add('closing');setTimeout(()=>d.remove(),220)}
window.closeSheet=closeSheet;

let ADD={cat:'coffee',inc:false,v:'',date:null};
function sheetAdd(){
  ADD.v='';ADD.date=today();
  openSheet(`<div class="between"><div class="mini-seg"><button id="m_e" class="${!ADD.inc?'on':''}" onclick="ADD.inc=false;sheetAdd()">Expense</button><button class="${ADD.inc?'on':''}" onclick="ADD.inc=true;sheetAdd()">Income</button></div><button class="icon-btn" onclick="closeSheet()">${icon('x')}</button></div>
   <div class="amount zero num" id="amtv"><span class="cur">$</span>0</div>
   ${ADD.inc?'':`<div class="chips">${S.budgets.map(b=>`<button class="chipb ${ADD.cat===b.id?'on':''}" data-c="${b.id}" onclick="pickCat(this)">${icon(ENV_ICON[b.id])}${esc(b.name.split(' (')[0].replace(' & convenience','').replace(' & household',''))}</button>`).join('')}<button class="chipb ${ADD.cat==='other'?'on':''}" data-c="other" onclick="pickCat(this)">Other</button></div>`}
   <div class="grid" style="grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:12px"><input class="in" id="note" placeholder="${ADD.inc?'What was it?':'Where? (optional)'}" enterkeyhint="done"><div class="mini-seg" style="height:50px;align-items:center">${[[today(),'Today'],[addDays(today(),-1),'Yday']].map(([d,n])=>`<button class="${ADD.date===d?'on':''}" style="height:42px" onclick="ADD.date='${d}';$$('.mini-seg [data-d]').forEach(b=>b.classList.toggle('on',b.dataset.d==='${d}'))" data-d="${d}">${n}</button>`).join('')}</div></div>
   <div class="pad">${['1','2','3','4','5','6','7','8','9','.','0','del'].map(k=>`<button onclick="padKey('${k}')">${k==='del'?icon('del'):k}</button>`).join('')}</div>
   <button class="btn gold block" onclick="doAdd()">Save</button>`);
}
window.pickCat=el=>{ADD.cat=el.dataset.c;$$('.chipb').forEach(c=>c.classList.toggle('on',c===el))};
window.padKey=k=>{let v=ADD.v;if(k==='del')v=v.slice(0,-1);else if(k==='.'){if(!v.includes('.'))v=(v||'0')+'.'}else{if(/\.\d\d$/.test(v)||v.replace('.','').length>=7)return;v=v==='0'?k:v+k}
  ADD.v=v;const el=$('#amtv');el.classList.toggle('zero',!v);el.innerHTML=`<span class="cur">$</span>${v||'0'}`;if(navigator.vibrate)navigator.vibrate(6)};
window.doAdd=()=>{const a=+ADD.v;if(!a){toast('Enter an amount');$('#amtv').animate([{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'none'}],{duration:250});return}
  const d=ADD.date||today();S.logs.push({id:uid(),date:d,amount:ADD.inc?a:-a,cat:ADD.inc?'income':ADD.cat,note:$('#note').value.trim(),future:false,ts:Date.now()});
  save();closeSheet();render();const s=safeToSpend();toast(`Saved · ${fmt(Math.max(0,s.perDay))}/day safe to spend`)};
window.sheetLog=id=>{const l=S.logs.find(x=>x.id===id);if(!l)return;const b=S.budgets.find(x=>x.id===l.cat);openSheet(`<h2>${fmtc(Math.abs(l.amount))}</h2><div class="sub">${esc(l.note||b?.name||'Logged')} · ${nice(l.date,{dow:1,y:1})} · ${esc(b?.name||(l.amount>0?'Income':'Other'))}</div><button class="btn ghost block" style="color:var(--red)" onclick="S.logs=S.logs.filter(x=>x.id!=='${id}');save();closeSheet();render();toast('Deleted')">Delete this entry</button>`)};
function sheetBalance(first){
  const b=S.balance;
  openSheet(`<h2>${first?'Let’s get exact':'Update balances'}</h2><div class="sub">${first?'Open your Scotiabank app and enter what it shows right now. Everything else is worked out from your statements.':'Doing this once or twice a week keeps safe-to-spend accurate.'}</div>
   <label class="f"><span>Chequing balance</span><input class="in num" id="bchq" type="number" inputmode="decimal" step=".01" value="${b.assumed?'':b.chq}" placeholder="${BASE.statements.chq_last.balance}"></label>
   <label class="f"><span>Visa balance owed</span><input class="in num" id="bvisa" type="number" inputmode="decimal" step=".01" value="${b.assumed?'':b.visa}" placeholder="${BASE.statements.visa_last.balance}"></label>
   <button class="btn gold block" onclick="doBal()">Save balances</button>${first?'<button class="btn ghost block" style="margin-top:10px" onclick="closeSheet()">Later</button>':''}`);
}
window.doBal=()=>{const c=$('#bchq').value,v=$('#bvisa').value;if(c===''){toast('Enter your chequing balance');return}
  S.balance={chq:+c,visa:v===''?S.balance.visa:+v,asOf:today(),assumed:false,ts:Date.now()};save();closeSheet();render({anim:true});toast('Balances updated')};
window.sheetRec=id=>{
  const r=id?S.recurring.find(x=>x.id===id):{id:'u'+uid(),name:'',amount:0,day:1,kind:'sub',group:'want',acct:'chq',freq:'monthly',active:true};window._rec=r;const inc=r.kind==='income';
  openSheet(`<h2>${id?esc(r.name.split(' — ')[0]):'New bill'}</h2><div class="sub">${r.note?esc(r.note):'Appears in your cash flow on its day.'}</div>
   <label class="f"><span>Name</span><input class="in" id="rn" value="${esc(r.name)}"></label>
   <div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><label class="f"><span>Amount</span><input class="in num" id="ra" type="number" inputmode="decimal" step=".01" value="${r.amount}"></label><label class="f"><span>Day of month</span><input class="in num" id="rd" type="number" inputmode="numeric" min="1" max="31" value="${r.day}"></label></div>
   ${inc?'':`<div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><label class="f"><span>Type</span><select class="in" id="rg">${[['need','Essential'],['want','Subscription'],['debt','Debt'],['business','Business'],['fee','Bank fee']].map(([v,n])=>`<option value="${v}" ${r.group===v?'selected':''}>${n}</option>`).join('')}</select></label><label class="f"><span>Paid from</span><select class="in" id="rc"><option value="chq" ${r.acct==='chq'?'selected':''}>Chequing</option><option value="visa" ${r.acct==='visa'?'selected':''}>Visa</option></select></label></div>
   <div class="kv"><span>Active</span><label class="switch"><input type="checkbox" id="rac" ${r.active?'checked':''}><i></i></label></div><div class="kv"><span>Only once my wife arrives</span><label class="switch"><input type="checkbox" id="rcp" ${r.couple?'checked':''}><i></i></label></div>`}
   <button class="btn gold block" onclick="doRec(${id?1:0})">Save</button>${id&&!inc?`<button class="btn ghost block" style="color:var(--red);margin-top:10px" onclick="S.recurring=S.recurring.filter(x=>x.id!=='${id}');save();closeSheet();render()">Delete</button>`:''}`);
};
window.doRec=ex=>{const r=window._rec;r.name=$('#rn').value||'Untitled';r.amount=+$('#ra').value||0;r.day=clamp(+$('#rd').value||1,1,31);
  if(r.kind!=='income'){r.group=$('#rg').value;r.kind=r.group==='debt'?'debt':r.group==='need'||r.group==='fee'?'bill':'sub';r.acct=$('#rc').value;r.couple=$('#rcp').checked;r.active=$('#rac').checked}
  if(!ex)S.recurring.push(r);save();closeSheet();render();toast('Saved')};
function toast(m){$('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
window.toast=toast;window.go=go;window.render=render;window.save=save;window.fmt=fmt;window.$=$;window.$$=$$;

(async function init(){
  const t0=performance.now(),minSplash=1600;
  try{VAULT=await (await fetch('vault.json',{cache:'no-cache'})).json()}catch(e){$('#spmsg').textContent='Could not load. Check your connection.';return}
  const wait=()=>new Promise(r=>setTimeout(r,Math.max(0,minSplash-(performance.now()-t0))));
  const saved=LS.get('nest.key');
  if(saved){try{const raw=JSON.parse(saved);if(raw.salt===VAULT.salt){$('#spmsg').textContent='Opening your vault';const k=await crypto.subtle.importKey('raw',b64d(raw.k),{name:'AES-GCM'},true,['encrypt','decrypt']);await wait();await boot(k);return}}catch(e){LS.del('nest.key')}}
  await wait();hideSplash();$('#lock').classList.remove('hidden');
  if(matchMedia('(hover:hover)').matches)$('#pass').focus();
})();
$('#lockform').addEventListener('submit',async e=>{
  e.preventDefault();const p=$('#pass').value;if(!p)return;$('#pass').blur();
  const sp=$('#splash');sp.classList.remove('hidden','out');$('#spmsg').textContent='Decrypting your vault';
  try{const k=await deriveKey(p,b64d(VAULT.salt),VAULT.iter);await decryptVault(k);
    if($('#remember').checked)LS.set('nest.key',JSON.stringify({salt:VAULT.salt,k:b64e(await crypto.subtle.exportKey('raw',k))}));
    await new Promise(r=>setTimeout(r,500));await boot(k);
  }catch(err){hideSplash();$('#lockerr').textContent='That passphrase didn’t work. Try again.';const i=$('#pass');i.classList.remove('shake');void i.offsetWidth;i.classList.add('shake')}
});
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

/* ---------- Cloud sync: Firebase (Google sign-in + Firestore), ciphertext only ---------- */
const FB_CFG={apiKey:"AIzaSyAHPbr8HPUim5JSZReiPRr5nKHgL_T-OlA",authDomain:"nest-household-f73fa.firebaseapp.com",projectId:"nest-household-f73fa",storageBucket:"nest-household-f73fa.firebasestorage.app",messagingSenderId:"530627324315",appId:"1:530627324315:web:8208e8876855ea84c4993e"};
const FB_V='10.12.2',FB_URL=m=>`https://www.gstatic.com/firebasejs/${FB_V}/firebase-${m}.js`;
const CL={fb:null,user:null,status:'off',msg:'',last:0,unsub:null,pushT:null,pending:null};
async function fbLoad(){
  if(CL.fb) return CL.fb;
  const [app,auth,fs]=await Promise.all([import(FB_URL('app')),import(FB_URL('auth')),import(FB_URL('firestore'))]);
  const a=app.initializeApp(FB_CFG),au=auth.getAuth(a),db=fs.getFirestore(a);
  CL.fb={auth,fs,au,db,ref:fs.doc(db,'households','main')};
  auth.onAuthStateChanged(au,u=>{CL.user=u;if(u)cloudListen();else{CL.unsub?.();CL.unsub=null;cloudSet(LS.get('nest.sync')?'signedout':'off')}});
  return CL.fb;
}
function cloudSet(st,msg=''){CL.status=st;CL.msg=msg;const b=document.getElementById('cloudbox');if(b)b.innerHTML=cloudCard();const d=document.getElementById('clouddot');if(d)d.dataset.s=st}
function cloudStart(){if(LS.get('nest.sync'))fbLoad().catch(e=>cloudSet('error','Could not reach the sync service. Your data is safe on this device.'))}
window.cloudConnect=async()=>{
  try{cloudSet('busy','Opening Google sign-in…');const {auth,au}=await fbLoad();LS.set('nest.sync','1');
    const p=new auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
    try{await auth.signInWithPopup(au,p)}catch(e){if(/popup-blocked|operation-not-supported/.test(e.code||''))return auth.signInWithRedirect(au,p);throw e}
  }catch(e){cloudSet(CL.user?'on':'signedout',/popup-closed|cancelled/.test(e.code||'')?'':'Sign-in did not complete.')}
};
window.cloudDisconnect=async()=>{LS.del('nest.sync');CL.unsub?.();CL.unsub=null;try{if(CL.fb)await CL.fb.auth.signOut(CL.fb.au)}catch(e){}CL.user=null;cloudSet('off');toast('Sync turned off on this device')};
function cloudListen(){
  const {fs,ref}=CL.fb;CL.unsub?.();cloudSet('busy','Syncing…');
  CL.unsub=fs.onSnapshot(ref,async snap=>{
    if(snap.metadata.hasPendingWrites) return;
    if(!snap.exists()){cloudPushNow(await encLocal(S));return}
    const d=snap.data();let R;
    try{R=await decLocal(JSON.stringify({iv:d.iv,ct:d.ct}))}catch(e){cloudSet('error','The cloud copy uses a different passphrase, so nothing was changed.');return}
    const rt=R._t||0,lt=S._t||0;
    if(rt>lt){S=R;save({remote:true});render();toast('Synced from your other device')}
    else if(lt>rt){cloudPushNow(await encLocal(S));return}
    CL.last=Date.now();cloudSet('on');
  },e=>{
    if(e.code==='permission-denied'){cloudSet('denied',`${CL.user?.email||'This account'} is not allowed to open this household.`);try{CL.fb.auth.signOut(CL.fb.au)}catch(_){}}
    else cloudSet('error','Sync paused. It will retry when you are back online.');
  });
}
function cloudPush(enc){if(!CL.user||!CL.fb)return;CL.pending=enc;clearTimeout(CL.pushT);CL.pushT=setTimeout(()=>cloudPushNow(CL.pending),1200)}
async function cloudPushNow(enc){
  if(!CL.user||!CL.fb)return;const {fs,ref}=CL.fb,o=JSON.parse(enc);
  try{cloudSet('busy','Saving…');await fs.setDoc(ref,{v:1,iv:o.iv,ct:o.ct,updated:fs.serverTimestamp(),by:CL.user.uid});CL.last=Date.now();cloudSet('on')}
  catch(e){cloudSet(e.code==='permission-denied'?'denied':'error',e.code==='permission-denied'?'This account is not allowed to save here.':'Could not save to the cloud. Changes are kept on this device and will sync later.')}
}
window.cloudSyncNow=async()=>{if(CL.user)cloudPushNow(await encLocal(S))};
function cloudCard(){
  const st=CL.status,u=CL.user,t=CL.last?new Date(CL.last).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}):'';
  const head={off:'Off · this device only',signedout:'Signed out',busy:CL.msg||'Working…',on:'Synced'+(t?' · '+t:''),error:'Needs attention',denied:'Access denied'}[st]||st;
  const col={on:'var(--green)',busy:'var(--gold)',error:'var(--red)',denied:'var(--red)'}[st]||'var(--tx3)';
  return `<div class="between" style="margin-bottom:10px"><b style="font-size:14px"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${col};margin-right:8px;vertical-align:1px"></span>${esc(head)}</b></div>
  ${u?`<div class="note" style="margin-bottom:12px">Signed in as <b>${esc(u.email)}</b></div>`:''}
  ${CL.msg&&st!=='busy'?`<div class="note" style="margin-bottom:12px;color:${col}">${esc(CL.msg)}</div>`:''}
  <div class="note" style="margin-bottom:16px">Keeps your logs, balances and edits the same on your phone and computer. Everything is encrypted with your passphrase before it leaves this device, so the database only ever holds unreadable ciphertext, and only your Google account is allowed to open it.</div>
  ${u?`<div class="grid" style="grid-template-columns:1fr 1fr;gap:10px"><button class="btn ghost" onclick="cloudSyncNow()">${icon('refresh')} Sync now</button><button class="btn ghost" onclick="cloudDisconnect()">Turn off</button></div>`
     :`<button class="btn gold block" onclick="cloudConnect()">Connect with Google</button>`}`;
}
