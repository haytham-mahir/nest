
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
function save(){clearTimeout(saveT);saveT=setTimeout(async()=>{LS.set('nest.state',await encLocal(S))},250)}


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
  $('#lock').classList.add('hidden'); $('#app').classList.remove('hidden');
  buildNav(); route(location.hash.slice(1)||'today');
  if(S.balance.assumed) setTimeout(()=>sheetBalance(true),500);
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


const tip=$('#tip');
function showTip(e,html){tip.innerHTML=html;tip.style.opacity=1;tip.style.left=e.clientX+'px';tip.style.top=e.clientY+'px';tip.style.position='fixed'}
function hideTip(){tip.style.opacity=0}
function lineChart(el,pts,o={}){
  const W=el.clientWidth||600,Hh=o.h||220,P={l:52,r:12,t:12,b:26};
  const ys=pts.map(p=>p.y).concat([o.buffer||0,0]);let mn=Math.min(...ys),mx=Math.max(...ys);const pad=(mx-mn)*.12||100;mn-=pad;mx+=pad;
  const raw=(mx-mn)/5,mag=Math.pow(10,Math.floor(Math.log10(raw))),st=[1,2,2.5,5,10].map(k=>k*mag).find(k=>k>=raw);mn=Math.floor(mn/st)*st;mx=Math.ceil(mx/st)*st;
  const x=i=>P.l+i*(W-P.l-P.r)/(pts.length-1), y=v=>P.t+(mx-v)*(Hh-P.t-P.b)/(mx-mn);
  const line=pts.map((p,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(p.y).toFixed(1)).join(' ');
  const area=line+` L${x(pts.length-1)} ${Hh-P.b} L${x(0)} ${Hh-P.b} Z`;
  const ticks=Math.round((mx-mn)/st),grid=[];for(let i=0;i<=ticks;i++){const v=mn+st*i;grid.push(`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.05)"/><text x="${P.l-8}" y="${y(v)+4}" fill="#6f788b" font-size="10.5" text-anchor="end">${fmt(v)}</text>`)}
  const xl=[];const step=Math.ceil(pts.length/7);pts.forEach((p,i)=>{if(i%step===0)xl.push(`<text x="${x(i)}" y="${Hh-6}" fill="#6f788b" font-size="10.5" text-anchor="middle">${nice(p.date)}</text>`)});
  const id='g'+uid(), buf=o.buffer;
  const redClip=buf!=null?`<clipPath id="c${id}"><rect x="${P.l}" y="${y(buf)}" width="${W}" height="${Hh}"/></clipPath>`:'';
  const marks=(o.marks||[]).map(m=>{const i=pts.findIndex(p=>p.date===m.date);if(i<0)return'';return `<circle cx="${x(i)}" cy="${y(pts[i].y)}" r="3.5" fill="${m.c}" stroke="#0a0c11" stroke-width="2"/>`}).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" height="${Hh}"><defs><linearGradient id="${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e8c27c" stop-opacity=".28"/><stop offset="1" stop-color="#e8c27c" stop-opacity="0"/></linearGradient>${redClip}</defs>
   ${grid.join('')}${buf!=null?`<rect x="${P.l}" y="${y(buf)}" width="${W-P.l-P.r}" height="${Math.max(0,Hh-P.b-y(buf))}" fill="rgba(255,106,106,.06)"/><line x1="${P.l}" x2="${W-P.r}" y1="${y(buf)}" y2="${y(buf)}" stroke="#ff6a6a" stroke-dasharray="4 5" stroke-opacity=".7"/><text x="${W-P.r}" y="${y(buf)-6}" fill="#ff6a6a" font-size="10.5" text-anchor="end">Red zone below ${fmt(buf)}</text>`:''}
   <line x1="${P.l}" x2="${W-P.r}" y1="${y(0)}" y2="${y(0)}" stroke="rgba(255,255,255,.18)"/>
   <path d="${area}" fill="url(#${id})"/><path d="${line}" fill="none" stroke="#e8c27c" stroke-width="2.2" stroke-linejoin="round"/>
   ${buf!=null?`<path d="${line}" fill="none" stroke="#ff6a6a" stroke-width="2.4" clip-path="url(#c${id})"/>`:''}
   ${marks}${xl.join('')}<line class="hx" x1="0" x2="0" y1="${P.t}" y2="${Hh-P.b}" stroke="rgba(255,255,255,.25)" opacity="0"/><circle class="hc" r="5" fill="#e8c27c" stroke="#0a0c11" stroke-width="2" opacity="0"/></svg>`;
  const svg=el.querySelector('svg'),hx=svg.querySelector('.hx'),hc=svg.querySelector('.hc');
  const mv=e=>{const r=svg.getBoundingClientRect();const px=(e.clientX-r.left)*W/r.width;const i=clamp(Math.round((px-P.l)/((W-P.l-P.r)/(pts.length-1))),0,pts.length-1);const p=pts[i];
    hx.setAttribute('x1',x(i));hx.setAttribute('x2',x(i));hx.setAttribute('opacity',1);hc.setAttribute('cx',x(i));hc.setAttribute('cy',y(p.y));hc.setAttribute('opacity',1);
    showTip(e,`<b>${nice(p.date,{dow:1})}</b><br><span class="${p.y<(buf??-1e9)?'neg':''}">${fmtc(p.y)}</span>${o.extra?o.extra(p):''}`)};
  svg.addEventListener('pointermove',mv);svg.addEventListener('pointerleave',()=>{hideTip();hx.setAttribute('opacity',0);hc.setAttribute('opacity',0)});
}
function stackChart(el,labels,series,o={}){
  const W=el.clientWidth||600,Hh=o.h||230,P={l:50,r:8,t:10,b:26};
  const tot=labels.map((_,i)=>series.reduce((s,se)=>s+Math.max(0,se.values[i]||0),0));const mx=Math.max(...tot,o.line||0)*1.1||1;
  const bw=(W-P.l-P.r)/labels.length, y=v=>P.t+(mx-v)*(Hh-P.t-P.b)/mx;
  let g='';for(let i=0;i<=4;i++){const v=mx*i/4;g+=`<line x1="${P.l}" x2="${W-P.r}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.05)"/><text x="${P.l-8}" y="${y(v)+4}" fill="#6f788b" font-size="10.5" text-anchor="end">${fmt(Math.round(v/100)*100)}</text>`}
  let bars='';labels.forEach((lb,i)=>{let acc=0;const x0=P.l+i*bw+bw*.2,w=bw*.6;
    series.forEach((se,j)=>{const v=Math.max(0,se.values[i]||0);if(!v)return;const y1=y(acc+v),y0=y(acc);bars+=`<rect data-i="${i}" x="${x0}" y="${y1}" width="${w}" height="${Math.max(0,y0-y1-1)}" rx="${j===series.length-1?4:2}" fill="${se.color}"/>`;acc+=v});
    bars+=`<text x="${x0+w/2}" y="${Hh-7}" fill="#6f788b" font-size="10.5" text-anchor="middle">${lb}</text><rect class="hit" data-i="${i}" x="${P.l+i*bw}" y="${P.t}" width="${bw}" height="${Hh-P.t-P.b}" fill="transparent"/>`});
  const ln=o.line?`<line x1="${P.l}" x2="${W-P.r}" y1="${y(o.line)}" y2="${y(o.line)}" stroke="#3fd69a" stroke-dasharray="4 4"/><text x="${W-P.r}" y="${y(o.line)-6}" fill="#3fd69a" font-size="10.5" text-anchor="end">${o.lineLabel||''}</text>`:'';
  const lines=(o.lines||[]).map(L=>`<path d="${L.values.map((v,i)=>(i?'L':'M')+(P.l+i*bw+bw/2)+' '+y(v)).join(' ')}" fill="none" stroke="${L.color}" stroke-width="2"/>`+L.values.map((v,i)=>`<circle cx="${P.l+i*bw+bw/2}" cy="${y(v)}" r="3" fill="${L.color}"/>`).join('')).join('');
  el.innerHTML=`<svg viewBox="0 0 ${W} ${Hh}" height="${Hh}">${g}${bars}${ln}${lines}</svg>`;
  el.querySelectorAll('.hit').forEach(r=>{r.addEventListener('pointermove',e=>{const i=+r.dataset.i;showTip(e,`<b>${labels[i]}</b><br>`+series.map(se=>`<span style="color:${se.color}">●</span> ${se.name}: ${fmt(se.values[i]||0)}`).join('<br>')+`<br><b>Total ${fmt(tot[i])}</b>`+(o.lines||[]).map(L=>`<br><span style="color:${L.color}">●</span> ${L.name}: ${fmt(L.values[i])}`).join(''))});r.addEventListener('pointerleave',hideTip)});
}
function donut(el,parts,center,sub){
  const S2=200,R=80,r=58,tot=parts.reduce((s,p)=>s+p.value,0)||1;let a=-Math.PI/2,paths='';
  parts.forEach(p=>{const da=p.value/tot*Math.PI*2;if(da<=0)return;const a2=a+da,lg=da>Math.PI?1:0,g=.012;
    const P=(rad,an)=>[100+rad*Math.cos(an),100+rad*Math.sin(an)];const[a1x,a1y]=P(R,a+g),[a2x,a2y]=P(R,a2-g),[b1x,b1y]=P(r,a2-g),[b2x,b2y]=P(r,a+g);
    paths+=`<path d="M${a1x} ${a1y}A${R} ${R} 0 ${lg} 1 ${a2x} ${a2y}L${b1x} ${b1y}A${r} ${r} 0 ${lg} 0 ${b2x} ${b2y}Z" fill="${p.color}" data-n="${esc(p.name)}" data-v="${p.value}"/>`;a=a2});
  el.innerHTML=`<svg viewBox="0 0 ${S2} ${S2}" style="max-width:220px;margin:auto">${paths}<text x="100" y="98" text-anchor="middle" fill="#eef1f6" font-family="Instrument Serif" font-size="30">${center}</text><text x="100" y="118" text-anchor="middle" fill="#6f788b" font-size="11">${sub||''}</text></svg>`;
  el.querySelectorAll('path').forEach(p=>{p.addEventListener('pointermove',e=>showTip(e,`<b>${p.dataset.n}</b><br>${fmt(+p.dataset.v)} · ${pct(+p.dataset.v/tot)}`));p.addEventListener('pointerleave',hideTip)});
}
const bar=(v,max,color='var(--gold)',mark)=>`<div class="bar"><i style="width:${clamp(v/(max||1)*100,0,100)}%;background:${color}"></i>${mark!=null?`<span class="mark" style="left:${clamp(mark/(max||1)*100,0,100)}%"></span>`:''}</div>`;


const VIEWS=[
 {id:'today',n:'Today',i:'today',sec:'Overview'},{id:'flow',n:'Cash flow',i:'flow'},{id:'budget',n:'Budget',i:'budget'},{id:'spending',n:'Spending',i:'spend'},
 {id:'bills',n:'Bills & subscriptions',i:'bills',sec:'Plan'},{id:'family',n:'Family plan',i:'family'},{id:'planner',n:'Dining & travel',i:'plan'},{id:'goals',n:'Goals & debt',i:'goals'},
 {id:'tx',n:'Transactions',i:'tx',sec:'Records'},{id:'settings',n:'Settings',i:'settings'}];
let CUR='today';
function buildNav(){
  $('#nav').innerHTML=VIEWS.map(v=>(v.sec?`<div class="sec">${v.sec}</div>`:'')+`<button data-v="${v.id}">${icon(v.i)}<span>${v.n}</span>${v.id==='today'?'<span class="badge hidden" id="rzbadge">!</span>':''}</button>`).join('');
  const mob=['today','flow','budget','spending'];
  $('#mnav').innerHTML=mob.slice(0,2).map(id=>{const v=VIEWS.find(x=>x.id===id);return `<button data-v="${id}">${icon(v.i)}${v.n.split(' ')[0]}</button>`}).join('')+`<button class="plus" data-act="add">${icon('plus')}</button>`+mob.slice(2).map(id=>{const v=VIEWS.find(x=>x.id===id);return `<button data-v="${id}">${icon(v.i)}${v.n}</button>`}).join('')+`<button data-act="more">${icon('more')}More</button>`;
}
document.addEventListener('click',e=>{
  const v=e.target.closest('[data-v]');if(v){route(v.dataset.v);closeSheet();return}
  const a=e.target.closest('[data-act]');if(!a)return;
  const act=a.dataset.act;
  if(act==='add')sheetAdd(); else if(act==='balance')sheetBalance(); else if(act==='more')sheetMore();
});
window.addEventListener('hashchange',()=>{const h=location.hash.slice(1);if(h&&h!==CUR&&S)route(h)});
function route(id){
  if(!VIEWS.find(v=>v.id===id))id='today';CUR=id;if(location.hash.slice(1)!==id)history_replace(id);
  $$('#nav button,#mnav button').forEach(b=>b.classList.toggle('on',b.dataset.v===id));
  const v=VIEWS.find(x=>x.id===id);
  const subs={today:nice(today(),{dow:1,y:1}),flow:'Projected inflows, outflows and balance',budget:'Monthly envelopes — what each category gets',spending:`Where your money went · ${ymLabel(BASE.statements.chq_months[0])} – ${ymLabel(BASE.statements.chq_months.at(-1))}`,bills:'Every fixed cost, and room for more',family:'Planning for two on one income',planner:'Dine-outs and trips, priced before you go',goals:'Savings goals and what you owe',tx:'Every transaction from your statements + your logs',settings:'Income, safety buffer, data & privacy'};
  $('#title').textContent=id==='today'?greet():v.n; $('#subtitle').textContent=subs[id]; $('#mtitle').textContent=id==='today'?'Today':v.n.split(' &')[0]; $('#msub').textContent=subs[id];
  render(); window.scrollTo({top:0});
}
function history_replace(id){try{history.replaceState(null,'','#'+id)}catch(e){location.hash=id}}
function greet(){const h=new Date().getHours();return (h<12?'Good morning':h<18?'Good afternoon':'Good evening')+', '+(S.settings.name||'')}
function render(){
  const fn={today:vToday,flow:vFlow,budget:vBudget,spending:vSpending,bills:vBills,family:vFamily,planner:vPlanner,goals:vGoals,tx:vTx,settings:vSettings}[CUR];
  $('#view').innerHTML='<div class="view">'+fn()+'</div>'; const after=AFTER[CUR];after&&after();
  const s=safeToSpend();$('#rzbadge')?.classList.toggle('hidden',s.status!=='red');
  $('#sidefoot').innerHTML=`<div class="between"><span>Net cash now</span><b class="num">${fmt(s.net)}</b></div><div class="between" style="margin-top:6px"><span>Plan</span><b>${mode(today())==='couple'?'Couple':'Solo'}</b></div><div class="dim" style="margin-top:8px">Balance updated ${S.balance.assumed?'— not yet':nice(S.balance.asOf)}</div>`;
}
const AFTER={};


function statusPill(s){const c={green:'p-green',amber:'p-amber',red:'p-red'}[s.status];return `<span class="pill ${c}"><span class="dot"></span>${s.label}</span>`}
function evRow(e,showDate=true){
  const inc=e.amount>0, ic=e.save?'shield':(e.r?REC_ICON[e.r.id]:'')||(inc?'cash':'card');
  const col=e.save?'var(--save)':inc?'var(--green)':(GROUP[e.group]?.c||'var(--tx2)');
  return `<div class="li"><div class="ic" style="background:color-mix(in srgb,${col} 14%,transparent);color:${col}">${icon(ic)}</div><div class="t"><b>${esc(e.name)}</b><span>${showDate?nice(e.date,{dow:1})+' · ':''}${e.save?'Savings':e.r?(e.r.acct==='visa'?'Visa':'Chequing')+(e.r.variable?' · varies':''):'Planned'}</span></div><div class="a num ${inc?'pos':''}">${inc?'+':''}${fmtc(e.amount)}</div></div>`;
}
function vToday(){
  const s=safeToSpend(), al=allowance(), t=today(), f=forecast(45), m=mode(t), p=plan(m);
  const up=events(addDays(t,1),addDays(t,10));
  const ins=insights().slice(0,3);
  AFTER.today=()=>lineChart($('#fc'),f.pts,{buffer:s.buf,h:innerWidth>860?330:210,marks:f.evs.filter(e=>e.kind==='income'&&e.r?.id.startsWith('pay')).map(e=>({date:e.date,c:'#3fd69a'}))});
  const rz=s.status==='red'?`<div class="hl red" style="margin-bottom:16px"><div class="row">${icon('alert','warn')}<b class="neg">You're in the red zone.</b></div><div class="note" style="margin-top:6px;color:var(--tx2)">${s.total<0?`After bills due before ${nice(s.np?.date||t)} and your ${fmt(s.buf)} buffer, you're short ${fmt(-s.total)}. Pause all wants until payday.`:`Your balance is projected to dip to ${fmt(s.min)} on ${nice(s.minPt.date)}. Hold off on non-essentials.`}</div></div>`:'';
  const assumed=S.balance.assumed?`<div class="hl" style="margin-bottom:16px;cursor:pointer" data-act="balance"><div class="row">${icon('alert','goldt')}<b>Set today's balance to make this exact</b></div><div class="note" style="margin-top:6px">Right now Nest is using your last statement balances (chequing ${fmtc(BASE.statements.chq_last.balance)} on Aug 31, Visa ${fmtc(BASE.statements.visa_last.balance)} on Oct 25). Tap to enter what your Scotiabank app shows today.</div></div>`:'';
  return `${rz}${assumed}
  <div class="grid g-hero">
    <div class="card hero ${s.status}">
      <div class="between"><span class="muted">Safe to spend today</span>${statusPill(s)}</div>
      <div class="big num">${fmt(Math.max(0,s.perDay))}<small>/day</small></div>
      <div class="muted">${s.total>0?`${fmt(s.total)} free until payday${s.np?` on <b style="color:var(--tx)">${nice(s.np.date,{dow:1})}</b>`:''} · ${s.days} day${s.days>1?'s':''}`:'Nothing free until payday: stick to essentials'}</div>
      <div class="meta">
        <div><div class="l">This week</div><div class="v num">${fmt(Math.max(0,Math.min(s.total,s.perDay*7)))}</div></div>
        <div><div class="l">Bills before payday</div><div class="v num">${fmt(s.bills)}</div></div>
        <div><div class="l">Safety buffer</div><div class="v num">${fmt(s.buf)}</div></div>
        <div><div class="l">Net cash now</div><div class="v num">${fmt(s.net)}</div></div>
      </div>
    </div>
    <div class="card">
      <h3>${icon('spark','goldt')} Your fun-money allowance <span class="r">${ymLabel(ym(t))}</span></h3>
      <div class="grid" style="gap:10px;grid-template-columns:repeat(3,1fr)">
        <div class="kpi"><div class="l">Daily</div><div class="v num">${fmt(al.perDay)}</div></div>
        <div class="kpi"><div class="l">Weekly</div><div class="v num">${fmt(al.perWeek)}</div></div>
        <div class="kpi"><div class="l">Month left</div><div class="v num">${fmt(al.rem)}</div></div>
      </div>
      <div class="sp"></div>${bar(al.used,al.budget,al.used>al.budget?'var(--red)':'var(--gold)')}
      <div class="between note" style="margin-top:8px"><span>${fmt(al.used)} of ${fmt(al.budget)} wants budget used</span><span>${al.left} days left</span></div>${al.capped?`<div class="note warn" style="margin-top:6px">Limited by cash until payday, not by your budget.</div>`:''}
      <div class="sp"></div>
      <div class="kv"><span class="muted">Monthly take-home (plan)</span><b class="num">${fmt(p.inc)}</b></div>
      <div class="kv"><span class="muted">Fixed bills & debts</span><b class="num">${fmt(p.fixed)}</b></div>
      <div class="kv"><span class="muted">Everyday budgets</span><b class="num">${fmt(p.vari)}</b></div>
      <div class="kv"><span class="muted">Savings</span><b class="num pos">${fmt(p.sav)}</b></div>
      <div class="kv"><span class="muted">Unassigned room</span><b class="num ${p.margin<0?'neg':'goldt'}">${fmt(p.margin)}</b></div>
    </div>
  </div>
  <div class="sp"></div>
  <div class="grid g2">
    <div class="card"><h3>${icon('flow','goldt')} Next 45 days <span class="r">green dots = paydays</span></h3><div class="chart" id="fc"></div>
      <div class="note" style="margin-top:8px">${s.firstRed?`<span class="neg">Dips below your ${fmt(s.buf)} buffer on ${nice(s.firstRed.date)}.</span> `:'<span class="pos">Stays above your buffer for the next 5 weeks.</span> '}Lowest point ${fmt(s.min)} on ${nice(s.minPt.date)}.</div></div>
    <div class="card"><h3>${icon('bills','goldt')} Coming up · 10 days <button class="btn btn-ghost btn-sm" style="margin-left:auto" data-v="flow">Full calendar</button></h3>
      <div class="list">${up.length?up.map(e=>evRow(e)).join(''):'<div class="empty">Nothing scheduled</div>'}</div></div>
  </div>
  <div class="sp"></div>
  <div class="card"><h3>${icon('spark','goldt')} What your statements say <button class="btn btn-ghost btn-sm" style="margin-left:auto" data-v="spending">See all</button></h3><div class="grid g3">${ins.map(insCard).join('')}</div></div>
  ${recentLogs()}`;
}
function recentLogs(){
  const L=S.logs.filter(l=>!l.future).slice(-6).reverse();
  return `<div class="sp"></div><div class="card"><h3>${icon('tx','goldt')} Your recent logs <span class="r">${S.logs.length} logged</span></h3>${L.length?`<div class="list">${L.map(logRow).join('')}</div>`:`<div class="empty">Log each purchase with the <b>+</b> button. Your daily safe-to-spend and envelopes update instantly.</div>`}</div>`;
}
function logRow(l){const b=S.budgets.find(x=>x.id===l.cat);const inc=l.amount>0;return `<div class="li"><div class="ic" style="background:var(--s3);color:${inc?'var(--green)':'var(--gold)'}">${icon(inc?'cash':ENV_ICON[l.cat]||'card')}</div><div class="t"><b>${esc(l.note||b?.name||'Expense')}</b><span>${nice(l.date,{dow:1})} · ${esc(b?.name||(inc?'Income':'Other'))}</span></div><div class="a num ${inc?'pos':''}">${inc?'+':''}${fmtc(l.amount)}</div><button class="btn btn-sm" title="Delete" onclick="delLog('${l.id}')">${icon('trash')}</button></div>`}
window.delLog=id=>{S.logs=S.logs.filter(l=>l.id!==id);save();render();toast('Removed')};

function insights(){
  const h=hist(), N=h.N, inc=Object.values(h.salary).reduce((a,b)=>a+b,0)/N;
  const tims=h.byMerch['Tim Hortons']||{n:0,s:0}, eat=h.eatOut/N;
  const del=(h.byCat['Food delivery']||0)/N;
  const bE=S.budgets.filter(b=>['coffee','fastfood','delivery','dineout'].includes(b.id)).reduce((s,b)=>s+(+b.solo),0);
  const fees=(h.byCat['Bank fees & interest']||0);
  return [
    {i:'food',c:'var(--red)',t:`${fmt(eat)}/mo on eating out`,p:`Coffee, fast food, delivery, restaurants and convenience stores add up to ${pct(eat/inc)} of take-home pay. Your plan caps it at ${fmt(bE)}, which frees about ${fmt((eat-bE)*12)} a year.`},
    {i:'cup',c:'var(--amber)',t:`${tims.n} Tim Hortons visits`,p:`${fmt(tims.s)} in ${N} months: about ${Math.round(tims.n/N/4.3)} visits a week at ${fmtc(tims.s/tims.n)} each. A home coffee routine on weekdays saves around ${fmt(tims.s/N*0.6*12)} a year.`},
    {i:'bike',c:'var(--amber)',t:`${fmt(del)}/mo on delivery`,p:`Uber Eats, DoorDash and Glovo. Delivery usually costs 30–40% more than picking up the same food yourself.`},
    {i:'card',c:'var(--debt)',t:'Credit is covering gaps',p:`Your May trip cost ${fmt(-(h.spend.filter(t=>t.travel&&ym(t.date)==='2026-05').reduce((s,t)=>s+t.amount,0)))} and was funded by $3,000 pulled from a credit account. Visa cash advances also added ${fmt(14.44+10)} in fees and interest. A travel fund replaces this.`},
    {i:'bank',c:'var(--fee)',t:`${fmt(fees)} in bank fees & interest`,p:`Over ${N} months. The $16.95/mo Preferred Package fee is waived with a $4,000 minimum balance; a no-fee chequing account removes it entirely (${fmt(16.95*12)}/yr).`},
    {i:'shield',c:'var(--green)',t:'Car insurance dropped $50/mo',p:'AMA went from $246.75 to $196.27 in August. That $604/year is a good starting point for your emergency fund.'},
    {i:'cash',c:'var(--blue)',t:`Take-home averages ${fmt(inc)}/mo`,p:`Pay varied from ${fmt(Math.min(...Object.values(h.salary)))} to ${fmt(Math.max(...Object.values(h.salary)))} a month. The plan uses ${fmt(incomeMonthly('solo'))}, so a short month is the main red-zone risk.`},
  ];
}
const insCard=x=>`<div class="ins"><div class="ic" style="background:color-mix(in srgb,${x.c} 15%,transparent);color:${x.c}">${icon(x.i)}</div><div><b>${x.t}</b><p>${x.p}</p></div></div>`;

let FLOWDAYS=60, FLOWMODE='list', CALM=null;
function vFlow(){
  const s=safeToSpend(), f=forecast(FLOWDAYS), t=today();
  const groups={};for(const e of f.evs)(groups[e.date]=groups[e.date]||[]).push(e);
  const inSum=f.evs.filter(e=>e.amount>0).reduce((a,e)=>a+e.amount,0), outSum=-f.evs.filter(e=>e.amount<0).reduce((a,e)=>a+e.amount,0);
  const burn=f.pts.slice(1).reduce((a,p)=>a+dailyBurn(p.date),0);
  AFTER.flow=()=>{lineChart($('#fc2'),f.pts,{buffer:s.buf,h:260,marks:f.evs.filter(e=>e.kind==='income').map(e=>({date:e.date,c:'#3fd69a'})),extra:p=>{const g=groups[p.date];return g?'<br>'+g.map(e=>`${e.amount>0?'+':''}${fmt(e.amount)} ${esc(e.name)}`).join('<br>'):''}});};
  const list=Object.keys(groups).sort().map(d=>{const bal=f.pts.find(p=>p.date===d)?.y;return `<div class="dayhead"><span>${nice(d,{dow:1})}</span><span class="${bal<s.buf?'neg':''}">Balance ≈ ${fmt(bal)}</span></div>`+groups[d].map(e=>evRow(e,false)).join('')}).join('');
  return `<div class="between" style="margin-bottom:14px;flex-wrap:wrap"><div class="seg">${[30,60,90].map(d=>`<button class="${FLOWDAYS===d?'on':''}" onclick="FLOWDAYS=${d};render()">${d} days</button>`).join('')}</div><div class="seg"><button class="${FLOWMODE==='list'?'on':''}" onclick="FLOWMODE='list';render()">Timeline</button><button class="${FLOWMODE==='cal'?'on':''}" onclick="FLOWMODE='cal';render()">Calendar</button></div></div>
  <div class="grid g4">
    <div class="card kpi"><div class="l">${icon('down','pos')} Money in</div><div class="v num pos">${fmt(inSum)}</div><div class="s">Paychecks & credits, next ${FLOWDAYS} days</div></div>
    <div class="card kpi"><div class="l">${icon('up','neg')} Scheduled out</div><div class="v num">${fmt(outSum)}</div><div class="s">Bills, debts, subs & savings</div></div>
    <div class="card kpi"><div class="l">${icon('cart')} Everyday spending</div><div class="v num">${fmt(burn)}</div><div class="s">From your budget envelopes</div></div>
    <div class="card kpi"><div class="l">${icon('flow')} Projected end</div><div class="v num ${f.pts.at(-1).y<s.buf?'neg':''}">${fmt(f.pts.at(-1).y)}</div><div class="s">on ${nice(f.pts.at(-1).date)}</div></div>
  </div><div class="sp"></div>
  <div class="card"><h3>${icon('flow','goldt')} Projected balance <span class="r">Net of Visa · hover for details</span></h3><div class="chart" id="fc2"></div>
  <div class="legend"><span><i style="background:var(--gold)"></i>Projected balance</span><span><i style="background:var(--red)"></i>Red zone (below ${fmt(s.buf)} buffer)</span><span><i style="background:var(--green)"></i>Payday</span></div></div>
  <div class="sp"></div>
  ${FLOWMODE==='cal'?calView(f,s):`<div class="card"><h3>${icon('bills','goldt')} Every inflow & outflow</h3><div class="list">${list||'<div class="empty">Nothing scheduled</div>'}</div></div>`}`;
}
function calView(f,s){
  const t=today(); if(!CALM)CALM=ym(t); const [y,m]=CALM.split('-').map(Number);
  const first=new Date(y,m-1,1,12), start=addDays(ds(first),-first.getDay());
  const evs=events(addDays(start,0),addDays(start,41));
  let cells='';for(let i=0;i<42;i++){const d=addDays(start,i);const es=evs.filter(e=>e.date===d&&!e.save);const p=f.pts.find(p=>p.date===d);
    cells+=`<div class="d ${ym(d)!==CALM?'o':''} ${d===t?'t':''} ${p&&p.y<s.buf?'rz':''}"><div class="n"><span>${pd(d).getDate()}</span>${p?`<span class="dim hide-m">${fmt(p.y)}</span>`:''}</div>${es.map(e=>`<div class="ev ${e.amount>0?'in':'out'}" title="${esc(e.name)} ${fmt(e.amount)}">${e.amount>0?'+':''}${fmt(e.amount)} <span class="hide-m">${esc(e.name.split(' — ')[0].split(' (')[0])}</span></div>`).join('')}</div>`}
  const nav=k=>{const d=new Date(y,m-1+k,1);return `${d.getFullYear()}-${pad(d.getMonth()+1)}`};
  return `<div class="card"><div class="between" style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="CALM='${nav(-1)}';render()">‹</button><b class="serif" style="font-size:22px">${ymLabel(CALM)}</b><button class="btn btn-ghost btn-sm" onclick="CALM='${nav(1)}';render()">›</button></div>
  <div class="cal">${DOW.map(d=>`<div class="h">${d[0]}<span class="hide-m">${d.slice(1)}</span></div>`).join('')}${cells}</div><div class="note" style="margin-top:10px">Red-tinted days are when your projected balance sits below your buffer.</div></div>`;
}

let BMODE=null;
function vBudget(){
  const t=today(); const m=BMODE||mode(t); const p=plan(m); const spent=monthSpend(ym(t)); const h=hist();
  const d=pd(t), pace=d.getDate()/dim(d.getFullYear(),d.getMonth()+1);
  const bs=budgetsFor(m);
  const env=g=>bs.filter(b=>b.group===g).map(b=>{const sp=spent[b.id]||0,over=sp>b.amt;const histAvg=b.cats.reduce((s,c)=>s+(h.byCat[c]||0),0)/h.N;
    return `<div class="env"><div class="top2"><div class="ic" style="background:var(--s3);color:${GROUP[g].c}">${icon(ENV_ICON[b.id])}</div><div><div class="nm">${esc(b.name)}</div><div class="note">Past avg ${fmt(histAvg)}/mo${b.sinking?' · sinking fund':''}</div></div>
    <div class="amt"><div class="num"><b class="${over?'neg':''}">${fmt(sp)}</b> <span class="dim">of</span> <input class="inl num" type="number" min="0" step="5" value="${b.amt}" onchange="setBudget('${b.id}','${m}',this.value)"></div></div></div>
    ${bar(sp,b.amt,over?'var(--red)':sp>b.amt*pace*1.15?'var(--amber)':GROUP[g].c,b.amt*pace)}
    <div class="foot2"><span>${over?`<span class="neg">${fmt(sp-b.amt)} over</span>`:`${fmt(b.amt-sp)} left`}</span><span>${histAvg>b.amt*1.1?`<span class="warn">Cut ${fmt(histAvg-b.amt)} vs. your usual</span>`:histAvg<b.amt*.9?'<span class="pos">Under your usual</span>':'In line with history'}</span></div></div>`}).join('');
  const tot=p.inc||1, rows=[['Needs (bills + essentials)',(p.groups.need||0),.5,'var(--need)'],['Wants & lifestyle',(p.groups.want||0)+(p.groups.business||0),.3,'var(--want)'],['Debt, fees & savings',(p.groups.debt||0)+(p.groups.fee||0)+p.sav+Math.max(0,p.margin),.2,'var(--save)']];
  AFTER.budget=()=>donut($('#bd'),[{name:'Needs',value:p.groups.need||0,color:'#6aa8ff'},{name:'Wants',value:p.groups.want||0,color:'#e8c27c'},{name:'Business tools',value:p.groups.business||0,color:'#9d8cff'},{name:'Debt',value:p.groups.debt||0,color:'#ff8a7a'},{name:'Bank fees',value:p.groups.fee||0,color:'#8a93a6'},{name:'Savings',value:p.sav,color:'#3fd69a'},{name:'Unassigned',value:Math.max(0,p.margin),color:'#2a3140'}],fmt(p.inc),'monthly take-home');
  return `<div class="between" style="margin-bottom:14px;flex-wrap:wrap;gap:10px"><div class="seg"><button class="${m==='solo'?'on':''}" onclick="BMODE='solo';render()">Solo plan</button><button class="${m==='couple'?'on':''}" onclick="BMODE='couple';render()">Couple plan</button></div><span class="note">Editing the <b>${m}</b> plan · logged spending for ${ymLabel(ym(t))} · the white tick shows where you should be today</span></div>
  <div class="grid g-hero">
    <div class="card"><h3>${icon('budget','goldt')} The plan <span class="r">${m==='couple'?'with your wife':'just you'}</span></h3>
      <div class="grid g2" style="align-items:center"><div class="chart" id="bd"></div>
      <div>${[['Take-home',p.inc,'pos'],['Fixed bills & debts',-p.fixed,''],['Everyday envelopes',-p.vari,''],['Savings',-p.sav,'']].map(([n,v,c])=>`<div class="kv"><span class="muted">${n}</span><b class="num ${c}">${fmt(v)}</b></div>`).join('')}
      <div class="kv"><span><b>Room left</b></span><b class="num ${p.margin<0?'neg':'goldt'}" style="font-size:18px">${fmt(p.margin)}</b></div>
      <label class="f" style="margin-top:14px"><span>Monthly savings: <b class="goldt">${fmt(p.sav)}</b> (${pct(p.sav/tot)} of pay)</span><input type="range" min="0" max="1200" step="25" value="${p.sav}" oninput="this.previousElementSibling.querySelector('b').textContent=fmt(+this.value)" onchange="S.settings.savingsMonthly=+this.value;save();render()"></label></div></div>
      ${p.margin<0?`<div class="hl red" style="margin-top:6px"><b class="neg">This plan overspends by ${fmt(-p.margin)}/mo.</b> <span class="muted">Trim envelopes or subscriptions until room is $0 or better.</span></div>`:`<div class="hl green" style="margin-top:6px"><b class="pos">Balanced.</b> <span class="muted">${fmt(p.margin)} unassigned. Leave it as a cushion or add it to savings.</span></div>`}
    </div>
    <div class="card"><h3>${icon('spark','goldt')} 50 / 30 / 20 check</h3>
      ${rows.map(([n,v,tg,c])=>`<div style="margin-bottom:16px"><div class="between" style="margin-bottom:7px"><span>${n}</span><span class="num"><b>${pct(v/tot)}</b> <span class="dim">target ${pct(tg)}</span></span></div>${bar(v,tot,c,tot*tg)}</div>`).join('')}
      <div class="note">Rent alone is ${pct(1195/tot)} of take-home, so needs run above 50%. That's normal on one income, and it's why wants have to stay tight.</div>
    </div>
  </div><div class="sp"></div>
  <div class="grid g2"><div class="card"><h3>${icon('home')} Needs</h3>${env('need')}</div><div class="card"><h3>${icon('spark')} Wants</h3>${env('want')}</div></div>`;
}
window.setBudget=(id,m,v)=>{const b=S.budgets.find(x=>x.id===id);b[m]=Math.max(0,+v||0);save();render();toast('Budget updated')};

function vSpending(){
  const h=hist(), N=h.N, months=h.months, L=months.map(k=>MONTHS[+k.slice(5)-1]);
  const cats=Object.entries(h.byCat).sort((a,b)=>b[1]-a[1]);
  const merch=Object.entries(h.byMerch).filter(([k,v])=>v.s>0).sort((a,b)=>b[1].s-a[1].s).slice(0,14);
  const avgSpend=Object.values(h.byGroup).reduce((a,b)=>a+b,0)/N, avgInc=Object.values(h.income).reduce((a,b)=>a+b,0)/N, avgSal=Object.values(h.salary).reduce((a,b)=>a+b,0)/N;
  const visits=['Tim Hortons',"McDonald's","Mac's Convenience",'Uber Eats','Milly Oak Café','A&W','Starbucks','Glovo'].map(n=>[n,h.byMerch[n]||{n:0,s:0}]);
  const trip=h.spend.filter(t=>t.travel&&ym(t.date)==='2026-05');const tripT=-trip.reduce((s,t)=>s+t.amount,0);
  AFTER.spending=()=>{
    stackChart($('#sc'),L,[{name:'Needs',color:'#6aa8ff',values:months.map(k=>h.byMonth[k]?.need||0)},{name:'Wants',color:'#e8c27c',values:months.map(k=>h.byMonth[k]?.want||0)},{name:'Debt',color:'#ff8a7a',values:months.map(k=>h.byMonth[k]?.debt||0)},{name:'Business',color:'#9d8cff',values:months.map(k=>h.byMonth[k]?.business||0)},{name:'Fees',color:'#8a93a6',values:months.map(k=>h.byMonth[k]?.fee||0)}],{h:250,lines:[{name:'Take-home pay',color:'#3fd69a',values:months.map(k=>h.salary[k]||0)}]});
    donut($('#sd'),Object.entries(h.byGroup).map(([g,v])=>({name:GROUP[g]?.n||g,value:v,color:{need:'#6aa8ff',want:'#e8c27c',debt:'#ff8a7a',business:'#9d8cff',fee:'#8a93a6'}[g]})),fmt(avgSpend),'avg spent / month');
  };
  const maxC=cats[0][1]/N;
  return `<div class="grid g4">
    <div class="card kpi"><div class="l">Avg take-home pay</div><div class="v num pos">${fmt(avgSal)}</div><div class="s">per month, ${N} months</div></div>
    <div class="card kpi"><div class="l">Avg spending</div><div class="v num">${fmt(avgSpend)}</div><div class="s">excl. transfers & card payments</div></div>
    <div class="card kpi"><div class="l">Eating outside home</div><div class="v num neg">${fmt(h.eatOut/N)}</div><div class="s">per month · ${pct(h.eatOut/N/avgSal)} of pay</div></div>
    <div class="card kpi"><div class="l">Left over without the tax refund</div><div class="v num ${avgInc-avgSpend-6951.84/N<0?'neg':'pos'}">${fmt(avgInc-avgSpend-6951.84/N)}</div><div class="s">per month · ${fmt(avgInc-avgSpend)} with the $6,952 refund</div></div>
  </div><div class="sp"></div>
  <div class="grid g-hero"><div class="card"><h3>${icon('spend','goldt')} Monthly spending vs. pay <span class="r">hover a month</span></h3><div class="chart" id="sc"></div>
    <div class="legend"><span><i style="background:#6aa8ff"></i>Needs</span><span><i style="background:#e8c27c"></i>Wants</span><span><i style="background:#ff8a7a"></i>Debt</span><span><i style="background:#9d8cff"></i>Business</span><span><i style="background:#8a93a6"></i>Fees</span><span><i style="background:#3fd69a"></i>Take-home pay</span></div>
    <div class="note" style="margin-top:8px">May spiked from the Morocco & Türkiye trip (${fmt(tripT)}), funded with $3,000 of credit. Spending matched or beat pay in most other months, so nothing was left to save.</div></div>
    <div class="card"><h3>${icon('budget','goldt')} Needs vs. wants</h3><div class="chart" id="sd"></div><div class="sp"></div>${Object.entries(h.byGroup).sort((a,b)=>b[1]-a[1]).map(([g,v])=>`<div class="kv"><span><span style="color:${GROUP[g].c}">●</span> ${GROUP[g].n}</span><b class="num">${fmt(v/N)}<span class="dim">/mo</span></b></div>`).join('')}</div></div>
  <div class="sp"></div>
  <div class="grid g2">
    <div class="card"><h3>${icon('tx','goldt')} By category <span class="r">monthly average</span></h3>${cats.map(([c,v],i)=>`<div style="margin-bottom:12px"><div class="between" style="margin-bottom:5px"><span>${esc(c)}</span><b class="num">${fmt(v/N)}</b></div>${bar(v/N,maxC,CAT_COLORS[i%CAT_COLORS.length])}</div>`).join('')}</div>
    <div class="card"><h3>${icon('cart','goldt')} Top merchants <span class="r">${N} months</span></h3><div class="list">${merch.map(([n,v])=>`<div class="li"><div class="ic" style="background:var(--s3);color:var(--tx2)">${esc(n.slice(0,1))}</div><div class="t"><b>${esc(n)}</b><span>${v.n} purchase${v.n!==1?'s':''} · ${esc(v.cat)}</span></div><div class="a num">${fmt(v.s)}<small>${fmt(v.s/N)}/mo</small></div></div>`).join('')}</div></div>
  </div><div class="sp"></div>
  <div class="card"><h3>${icon('cup','goldt')} Habit tracker <span class="r">the small stuff that adds up</span></h3><div class="grid g4">${visits.map(([n,v])=>`<div class="ins" style="display:block"><b>${esc(n)}</b><div class="serif" style="font-size:30px;margin:4px 0">${v.n}<span class="dim" style="font-size:15px;font-family:var(--sans)"> visits</span></div><p>${fmt(v.s)} total · ${(v.n/N/4.33).toFixed(1)}×/week · ${fmt(v.s/N*12)}/yr pace</p></div>`).join('')}</div></div>
  <div class="sp"></div>
  <div class="card"><h3>${icon('spark','goldt')} All insights</h3><div class="grid g2">${insights().map(insCard).join('')}</div></div>`;
}

function vBills(){
  const t=today(), m=mode(t), p=plan(m);
  const items=S.recurring.filter(r=>r.kind!=='income');
  const groupsOrder=[['need','Essential bills'],['debt','Debt payments'],['fee','Bank fees'],['want','Subscriptions'],['business','Web business tools']];
  const next=r=>{const o=occurrences({...r,active:true,couple:false},addDays(t,0),addDays(t,400));return o[0]};
  const row=r=>{const n=next(r);const col=GROUP[r.group].c;return `<div class="li" style="${r.active?'':'opacity:.5'}"><div class="ic" style="background:color-mix(in srgb,${col} 14%,transparent);color:${col}">${icon(REC_ICON[r.id]||'card')}</div>
    <div class="t"><b>${esc(r.name)} ${r.couple?'<span class="tag p-violet">with wife</span>':''}${r.variable?' <span class="tag p-gray">varies</span>':''}</b><span>${r.freq==='monthly'?`Day ${r.day} monthly`:r.freq==='yearly'?`Yearly · ${MONTHS[r.months[0]-1]} ${r.day}`:'Quarterly'} · ${r.acct==='visa'?'Visa':'Chequing'}${n&&r.active?' · next '+nice(n):''}${r.note?' · '+esc(r.note):''}</span></div>
    <div class="a num">${fmtc(r.amount)}<small>${fmt(monthlyEq(r)*12)}/yr</small></div>
    <label class="switch" title="Active"><input type="checkbox" ${r.active?'checked':''} onchange="toggleRec('${r.id}',this.checked)"><i></i></label>
    <button class="btn btn-sm" onclick="sheetRec('${r.id}')">${icon('edit')}</button></div>`};
  const subs=items.filter(r=>r.group==='want'||r.group==='business'), subsAct=subs.filter(r=>r.active).reduce((s,r)=>s+monthlyEq(r),0);
  const pc=plan('couple');
  return `<div class="grid g4">
    <div class="card kpi"><div class="l">Fixed costs / month</div><div class="v num">${fmt(p.fixed)}</div><div class="s">${pct(p.fixed/p.inc)} of take-home</div></div>
    <div class="card kpi"><div class="l">Subscriptions & tools</div><div class="v num">${fmt(subsAct)}</div><div class="s">${fmt(subsAct*12)} a year</div></div>
    <div class="card kpi"><div class="l">Room for new subs (solo)</div><div class="v num ${plan('solo').margin<0?'neg':'pos'}">${fmt(Math.max(0,plan('solo').margin))}</div><div class="s">per month without touching savings</div></div>
    <div class="card kpi"><div class="l">Room once she arrives</div><div class="v num ${pc.margin<0?'neg':'pos'}">${fmt(pc.margin)}</div><div class="s">${pc.margin<0?'cut something first':'per month on the couple plan'}</div></div>
  </div><div class="sp"></div>
  <div class="grid g-hero"><div class="card"><div class="between" style="margin-bottom:6px"><h3 style="margin:0">${icon('bills','goldt')} Everything that repeats</h3><button class="btn btn-gold btn-sm" onclick="sheetRec()">+ Add bill or subscription</button></div>
    ${groupsOrder.map(([g,n])=>{const L=items.filter(r=>r.group===g);if(!L.length)return'';const tot=L.filter(r=>r.active).reduce((s,r)=>s+monthlyEq(r),0);return `<div class="dayhead"><span>${n}</span><span>${fmt(tot)}/mo</span></div><div class="list">${L.map(row).join('')}</div>`}).join('')}
    <div class="dayhead"><span>Income</span></div><div class="list">${S.recurring.filter(r=>r.kind==='income').map(r=>`<div class="li"><div class="ic" style="background:rgba(63,214,154,.14);color:var(--green)">${icon('cash')}</div><div class="t"><b>${esc(r.name)}</b><span>${r.freq==='monthly'?'Day '+r.day:'Quarterly'}${r.note?' · '+esc(r.note):''}</span></div><div class="a num pos">+${fmtc(r.amount)}</div><button class="btn btn-sm" onclick="sheetRec('${r.id}')">${icon('edit')}</button></div>`).join('')}</div>
  </div>
  <div><div class="card"><h3>${icon('spark','goldt')} Can I afford a new subscription?</h3>
    <label class="f"><span>Monthly price</span><input class="in num" id="newsub" type="number" value="15" oninput="subCheck()"></label><div id="subres"></div></div>
    <div class="sp"></div><div class="card"><h3>${icon('alert','warn')} Review these</h3><div class="list">
      ${[['Google Ads + SiteGround + Workspace',fixedMonthly('solo',r=>r.group==='business'),'≈ $110/mo for web business tools. Keep them only if the business earns more than that each month.'],['PlayStation Plus',27.99,'$336/yr. Pause it in months you mostly play free games.'],['Claude Pro',29.40,'Keep if it\'s for work; it may be a deductible or expensable cost.'],['Snap Finance + Affirm',146.34,'Once these finish, put the $146/mo straight into savings.'],['Scotiabank fee',16.95,'Waived at a $4,000 minimum balance, or switch to a no-fee account.']].map(([n,a,d])=>`<div class="li"><div class="t"><b>${n}</b><span>${d}</span></div><div class="a num">${fmt(a)}<small>/mo</small></div></div>`).join('')}
    </div></div></div></div>`;
}
AFTER.bills=()=>subCheck();
window.subCheck=()=>{const v=+($('#newsub')?.value||0);const a=plan('solo').margin,b=plan('couple').margin;const el=$('#subres');if(!el)return;
  const ok=(m,n)=>`<div class="kv"><span>${n}</span><b class="${m-v>=0?'pos':'neg'}">${m-v>=0?'Yes':'No'} · ${fmt(m-v)} left</b></div>`;
  el.innerHTML=ok(a,'Solo plan')+ok(b,'Couple plan')+`<div class="note" style="margin-top:8px">${fmt(v*12)} a year. ${v>0&&b-v<0?'Once your wife arrives this would need to replace something else.':''}</div>`};
window.toggleRec=(id,on)=>{S.recurring.find(r=>r.id===id).active=on;save();render()};

function vFamily(){
  const st=S.settings, ps=plan('solo'), pc=plan('couple'), bs=budgetsFor('solo'), bc=budgetsFor('couple');
  const extraRec=S.recurring.filter(r=>r.couple&&r.active);
  const setupT=S.setup.reduce((s,x)=>s+(+x.amount||0),0);
  const goal=S.goals.find(g=>g.id==='setup');
  const monthsTo=st.wifeArrival?Math.max(0,diffDays(today(),st.wifeArrival)/30.4):null;
  const perMonthNeeded=monthsTo?Math.max(0,(setupT-(goal?.saved||0))/Math.max(monthsTo,.5)):null;
  const din=bc.filter(b=>['dineout','coffee','fastfood','delivery'].includes(b.id)).reduce((s,b)=>s+b.amt,0), trv=bc.find(b=>b.id==='travel').amt+bc.find(b=>b.id==='fuel').amt;
  const cmp=(n,a,b)=>`<tr><td>${n}</td><td class="r num">${fmt(a)}</td><td class="r num">${fmt(b)}</td><td class="r num ${b-a>0?'warn':b-a<0?'pos':'dim'}">${b-a>0?'+':''}${fmt(b-a)}</td></tr>`;
  return `<div class="grid g-hero">
   <div class="card hero ${pc.margin<0?'red':''}"><div class="between"><span class="muted">When ${esc(st.partner||'your wife')} joins you</span>${pc.margin<0?'<span class="pill p-red"><span class="dot"></span>Over budget</span>':'<span class="pill p-green"><span class="dot"></span>It works</span>'}</div>
     <div class="big num">${fmt(pc.margin)}<small>/mo room</small></div>
     <div class="muted">On ${fmt(pc.inc)} take-home for two, after ${fmt(pc.fixed)} fixed costs, ${fmt(pc.vari)} everyday envelopes and ${fmt(pc.sav)} savings.</div>
     ${(()=>{const lv=[['Claim the spouse amount on your TD1 / TD1AB',st.spouseCredit?0:(+st.spouseCreditAmt||0)],['Affirm installments end',S.recurring.find(r=>r.id==='affirm')?.active?88.64:0],['Snap Finance lease ends',S.recurring.find(r=>r.id==='snap')?.active?57.70:0],['Pause PlayStation Plus',S.recurring.find(r=>r.id==='psn')?.active?27.99:0],['Cut Google Ads unless it brings clients',S.recurring.find(r=>r.id==='gads')?.active?40:0]].filter(x=>x[1]>0);
       return pc.margin<0&&lv.length?`<div class="hl" style="margin-top:16px"><b>How to close the ${fmt(-pc.margin)} gap</b>${lv.map(([n,v])=>`<div class="kv"><span class="muted">${n}</span><b class="pos num">+${fmt(v)}</b></div>`).join('')}<div class="note" style="margin-top:6px">The first lever alone gets you to ${fmt(pc.margin+(lv[0]?.[1]||0))}/mo.</div></div>`:''})()}
     <div class="meta"><div><div class="l">Dining out (both)</div><div class="v num">${fmt(din)}</div></div><div><div class="l">Gas + trips</div><div class="v num">${fmt(trv)}</div></div><div><div class="l">Groceries</div><div class="v num">${fmt(bc.find(b=>b.id==='groceries').amt)}</div></div><div><div class="l">Extra vs. solo</div><div class="v num">${fmt(pc.fixed+pc.vari-ps.fixed-ps.vari)}</div></div></div></div>
   <div class="card"><h3>${icon('family','goldt')} Arrival settings</h3>
     <label class="f"><span>Her name (optional)</span><input class="in" value="${esc(st.partner)}" onchange="S.settings.partner=this.value;save();render()" placeholder="e.g. Salma"></label>
     <label class="f"><span>Expected arrival date. The forecast switches to the couple plan from this day.</span><input class="in" type="date" value="${st.wifeArrival}" onchange="S.settings.wifeArrival=this.value;save();render();toast('Forecast updated')"></label>
     <div class="between" style="padding:10px 0"><div><b>Claim the spouse amount on your TD1</b><div class="note">With a non-working spouse you can update your federal TD1 and Alberta TD1AB with your employer so less tax comes off each paycheck. Rough estimate: +$${st.spouseCreditAmt}/mo. Confirm on the CRA forms.</div></div><label class="switch"><input type="checkbox" ${st.spouseCredit?'checked':''} onchange="S.settings.spouseCredit=this.checked;save();render()"><i></i></label></div>
     <label class="f"><span>Estimated extra take-home from spouse credit ($/mo)</span><input class="in num" type="number" value="${st.spouseCreditAmt}" onchange="S.settings.spouseCreditAmt=+this.value;save();render()"></label>
     <div class="seg" style="margin-top:4px"><button class="${st.planMode==='auto'?'on':''}" onclick="S.settings.planMode='auto';save();render()">Auto by date</button><button class="${st.planMode==='solo'?'on':''}" onclick="S.settings.planMode='solo';save();render()">Force solo</button><button class="${st.planMode==='couple'?'on':''}" onclick="S.settings.planMode='couple';save();render()">Force couple</button></div>
   </div></div>
  <div class="sp"></div>
  <div class="grid g2">
   <div class="card"><h3>${icon('budget','goldt')} Solo vs. couple, month by month <button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="BMODE='couple';route('budget')">Edit couple budget</button></h3><div class="scrollx"><table><thead><tr><th>Line</th><th class="r">Solo</th><th class="r">Couple</th><th class="r">Change</th></tr></thead><tbody>
     ${cmp('Take-home pay',ps.inc,pc.inc)}${cmp('Fixed bills & debts',ps.fixed,pc.fixed)}${bs.map((b,i)=>cmp(b.name,b.amt,bc[i].amt)).join('')}${cmp('Savings',ps.sav,pc.sav)}</tbody>
     <tfoot><tr><td>Room left</td><td class="r num ${ps.margin<0?'neg':'goldt'}">${fmt(ps.margin)}</td><td class="r num ${pc.margin<0?'neg':'goldt'}">${fmt(pc.margin)}</td><td></td></tr></tfoot></table></div>
     ${extraRec.length?`<div class="note" style="margin-top:10px">Added only in the couple plan: ${extraRec.map(r=>esc(r.name)+' '+fmt(r.amount)).join(', ')}.</div>`:''}</div>
   <div class="card"><h3>${icon('home','goldt')} One-time setup costs <span class="r">${fmt(setupT)}</span></h3><div class="list">${S.setup.map((x,i)=>`<div class="li"><div class="t"><input class="in" style="padding:8px 10px" value="${esc(x.name)}" onchange="S.setup[${i}].name=this.value;save()"></div><input class="in num" style="width:100px;padding:8px 10px;text-align:right" type="number" value="${x.amount}" onchange="S.setup[${i}].amount=+this.value;save();render()"><button class="btn btn-sm" onclick="S.setup.splice(${i},1);save();render()">${icon('trash')}</button></div>`).join('')}</div>
     <button class="btn btn-ghost btn-sm" style="margin-top:10px" onclick="S.setup.push({name:'New item',amount:0});save();render()">+ Add item</button>
     <div class="hl" style="margin-top:14px">${goal?`Setup fund saved: <b>${fmt(goal.saved)}</b> of ${fmt(setupT)}. `:''}${perMonthNeeded!=null?`Put aside <b class="goldt">${fmt(perMonthNeeded)}/mo</b> to have it all ready by ${nice(st.wifeArrival,{y:1})}.`:'Set her arrival date to see how much to set aside each month.'}</div></div>
  </div><div class="sp"></div>
  <div class="card"><h3>${icon('spark','goldt')} Checklist for her first months</h3><div class="grid g3">
   ${[['Alberta Health Care (AHCIP)','Register her right after she lands so health coverage starts without a gap. Bring her immigration documents and proof of address.'],['SIN & bank account','Get her a Social Insurance Number at Service Canada, then add her to a Scotiabank account or open her own. Building her Canadian credit history early helps you both later.'],['Update your TD1 / TD1AB','Tell Edge Marketing payroll that you now support a spouse. Less tax is withheld from every paycheck.'],['File taxes together','Even with no income she should file a return. It unlocks a bigger GST/HST credit and the Alberta benefits you qualify for as a couple.'],['Car insurance','Add her as a driver on your AMA policy before she drives, and ask whether bundling saves anything.'],['Phone line','An add-a-line on Virgin Plus is usually cheaper than a separate plan. Budgeted at $45/mo.']].map(([a,b])=>`<div class="ins"><div class="ic" style="background:rgba(232,194,124,.12);color:var(--gold)">${icon('check')}</div><div><b>${a}</b><p>${b}</p></div></div>`).join('')}
  </div></div>`;
}

let DIN={n:4,avg:45}, TRIP={name:'Banff weekend',km:340,l100:S0('carL100',9),price:S0('fuelPrice',1.35),nights:2,hotel:160,food:90,act:80,days:3};
function S0(k,d){return d}
function vPlanner(){
  const m=mode(today()), bs=budgetsFor(m); const dine=bs.filter(b=>['dineout','coffee','fastfood','delivery'].includes(b.id)), dineT=dine.reduce((s,b)=>s+b.amt,0);
  const tf=bs.find(b=>b.id==='travel').amt, fuelB=bs.find(b=>b.id==='fuel').amt;
  const tg=S.goals.find(g=>g.id==='trips');
  const T=TRIP, gas=T.km*T.l100/100*T.price, hotel=T.nights*T.hotel, food=T.days*T.food, tot=gas+hotel+food+(+T.act);
  const have=(tg?.saved||0), months=Math.max(0,(tot-have)/Math.max(1,tf+(+S.settings.savingsMonthly||0)*(tg?.share||0)/100));
  const din=DIN.n*DIN.avg;
  return `<div class="grid g2">
   <div class="card"><h3>${icon('food','goldt')} Dining-out planner <span class="r">${m} plan</span></h3>
     <div class="grid g2" style="gap:10px;margin-bottom:12px">${dine.map(b=>`<div class="ins" style="display:block;padding:12px"><div class="note">${esc(b.name)}</div><div class="serif" style="font-size:26px">${fmt(b.amt)}<span class="dim" style="font-size:13px;font-family:var(--sans)">/mo</span></div><div class="note">${fmt(b.amt/4.33)}/week</div></div>`).join('')}</div>
     <div class="hl"><b>${fmt(dineT)}/month</b> for all food & drink out, which is <b>${fmt(dineT/4.33)}/week</b>. Your past average was <span class="neg">${fmt(hist().eatOut/hist().N)}</span>.</div>
     <div class="sp"></div><h4>Will this month's plan fit?</h4>
     <label class="f"><span>Sit-down dinners out this month: <b>${DIN.n}</b></span><input type="range" min="0" max="12" value="${DIN.n}" oninput="DIN.n=+this.value;render()"></label>
     <label class="f"><span>Average bill for ${m==='couple'?'two':'one'} incl. tip: <b>${fmt(DIN.avg)}</b></span><input type="range" min="15" max="150" step="5" value="${DIN.avg}" oninput="DIN.avg=+this.value;render()"></label>
     <div class="kv"><span>Cost</span><b class="num">${fmt(din)}</b></div><div class="kv"><span>Restaurant envelope</span><b class="num">${fmt(bs.find(b=>b.id==='dineout').amt)}</b></div>
     <div class="kv"><span>Verdict</span><b class="${din<=bs.find(b=>b.id==='dineout').amt?'pos':'neg'}">${din<=bs.find(b=>b.id==='dineout').amt?'Fits. Enjoy it':'Over by '+fmt(din-bs.find(b=>b.id==='dineout').amt)+'. Cut coffee or delivery to cover it'}</b></div>
   </div>
   <div class="card"><h3>${icon('plane','goldt')} Trip planner</h3>
     <div class="grid g2" style="gap:0 12px">
      <label class="f"><span>Trip</span><input class="in" value="${esc(T.name)}" onchange="TRIP.name=this.value;render()"></label>
      <label class="f"><span>Round-trip km</span><input class="in num" type="number" value="${T.km}" onchange="TRIP.km=+this.value;render()"></label>
      <label class="f"><span>Car L/100km</span><input class="in num" type="number" step=".1" value="${T.l100}" onchange="TRIP.l100=+this.value;render()"></label>
      <label class="f"><span>Gas $/L</span><input class="in num" type="number" step=".01" value="${T.price}" onchange="TRIP.price=+this.value;render()"></label>
      <label class="f"><span>Hotel nights</span><input class="in num" type="number" value="${T.nights}" onchange="TRIP.nights=+this.value;render()"></label>
      <label class="f"><span>Hotel $/night (with tax)</span><input class="in num" type="number" value="${T.hotel}" onchange="TRIP.hotel=+this.value;render()"></label>
      <label class="f"><span>Days</span><input class="in num" type="number" value="${T.days}" onchange="TRIP.days=+this.value;render()"></label>
      <label class="f"><span>Food $/day (${m==='couple'?'both':'you'})</span><input class="in num" type="number" value="${T.food}" onchange="TRIP.food=+this.value;render()"></label>
      <label class="f"><span>Activities, parking, park pass</span><input class="in num" type="number" value="${T.act}" onchange="TRIP.act=+this.value;render()"></label>
     </div>
     ${[['Gas',gas],['Hotel',hotel],['Food',food],['Activities',+T.act]].map(([n,v])=>`<div class="kv"><span class="muted">${n}</span><b class="num">${fmtc(v)}</b></div>`).join('')}
     <div class="kv"><span><b>Trip total</b></span><b class="num goldt" style="font-size:20px">${fmt(tot)}</b></div>
     <div class="hl ${have>=tot?'green':''}" style="margin-top:12px">${have>=tot?`<b class="pos">Paid for.</b> Your trips fund (${fmt(have)}) covers it with no credit needed.`:`Trips fund has ${fmt(have)}. At ${fmt(tf)}/mo plus your savings share, it's covered in <b class="goldt">${months<1?'under a month':Math.ceil(months)+' month'+(Math.ceil(months)>1?'s':'')}</b>. Book after that, not on credit.`}</div>
     <button class="btn btn-ghost btn-sm" style="margin-top:12px" onclick="saveTrip(${Math.round(tot)})">Save this trip</button>
     ${S.trips.length?`<div class="dayhead"><span>Saved trips</span></div><div class="list">${S.trips.map((x,i)=>`<div class="li"><div class="ic" style="background:var(--s3);color:var(--gold)">${icon('plane')}</div><div class="t"><b>${esc(x.name)}</b><span>${x.km} km · ${x.nights} night(s)</span></div><div class="a num">${fmt(x.total)}</div><button class="btn btn-sm" onclick="S.trips.splice(${i},1);save();render()">${icon('trash')}</button></div>`).join('')}</div>`:''}
   </div></div>
   <div class="sp"></div><div class="card"><div class="note">Everyday gas has its own envelope (${fmt(fuelB)}/mo). Trips come from the travel fund (${fmt(tf)}/mo) and your "Trips & getaways" goal, never from the credit card.</div></div>`;
}
window.saveTrip=t=>{S.trips.push({...TRIP,total:t});save();render();toast('Trip saved')};

function vGoals(){
  const sav=+S.settings.savingsMonthly||0; const shareT=S.goals.reduce((s,g)=>s+(+g.share||0),0)||1;
  const dsum=S.debts.reduce((s,d)=>s+(d.balance||0),0);
  return `<div class="grid g4">
   <div class="card kpi"><div class="l">Saving each month</div><div class="v num pos">${fmt(sav)}</div><div class="s">${fmt(sav/2)} each payday</div></div>
   <div class="card kpi"><div class="l">Saved so far</div><div class="v num">${fmt(S.goals.reduce((s,g)=>s+(+g.saved||0),0))}</div><div class="s">across ${S.goals.length} goals</div></div>
   <div class="card kpi"><div class="l">Known debt</div><div class="v num neg">${fmt(dsum)}</div><div class="s">+ balances you haven't entered yet</div></div>
   <div class="card kpi"><div class="l">Debt payments / mo</div><div class="v num">${fmt(S.debts.reduce((s,d)=>s+(+d.min||0),0))}</div><div class="s">Snap, Affirm, LOC, Visa minimum</div></div>
  </div><div class="sp"></div>
  <div class="grid g2"><div class="card"><div class="between" style="margin-bottom:6px"><h3 style="margin:0">${icon('goals','goldt')} Savings goals</h3><button class="btn btn-ghost btn-sm" onclick="S.goals.push({id:uid(),name:'New goal',target:1000,saved:0,share:0,icon:'spark'});save();render()">+ Goal</button></div>
   ${S.goals.map((g,i)=>{const per=sav*(+g.share||0)/shareT, left=Math.max(0,g.target-g.saved), eta=per>0?Math.ceil(left/per):null;const d=new Date();d.setMonth(d.getMonth()+(eta||0));
   return `<div class="env"><div class="top2"><div class="ic" style="background:rgba(63,214,154,.12);color:var(--green)">${icon(g.icon||'goals')}</div><div style="flex:1;min-width:0"><input class="in" style="padding:6px 9px;font-weight:600" value="${esc(g.name)}" onchange="S.goals[${i}].name=this.value;save()"><div class="note" style="margin-top:4px">${esc(g.note||'')}</div></div><button class="btn btn-sm" onclick="S.goals.splice(${i},1);save();render()">${icon('trash')}</button></div>
   ${bar(g.saved,g.target,'var(--green)')}
   <div class="grid g3" style="gap:8px;margin-top:10px"><label class="f" style="margin:0"><span>Saved</span><input class="in num" type="number" value="${g.saved}" onchange="S.goals[${i}].saved=+this.value;save();render()"></label><label class="f" style="margin:0"><span>Target</span><input class="in num" type="number" value="${g.target}" onchange="S.goals[${i}].target=+this.value;save();render()"></label><label class="f" style="margin:0"><span>% of savings</span><input class="in num" type="number" value="${g.share}" onchange="S.goals[${i}].share=+this.value;save();render()"></label></div>
   <div class="foot2"><span>${pct(g.saved/g.target)} · ${fmt(per)}/mo</span><span>${left<=0?'<span class="pos">Done 🎉</span>':eta?`Reached ~${MONTHS[d.getMonth()]} ${d.getFullYear()}`:'Give it a share of savings'}</span></div></div>`}).join('')}
   <div class="note" style="margin-top:8px">Tip: open a Scotiabank savings account (or a TFSA) and set an automatic transfer of ${fmt(sav/2)} on the 6th and 20th, the day pay lands. Money you don't see, you don't spend.</div></div>
   <div class="card"><h3>${icon('card','goldt')} Debt & credit</h3>${S.debts.map((d,i)=>`<div class="env"><div class="top2"><div class="ic" style="background:rgba(255,138,122,.12);color:var(--debt)">${icon('card')}</div><div style="flex:1"><div class="nm">${esc(d.name)}</div><div class="note">${esc(d.note||'')}</div></div></div>
     <div class="grid g3" style="gap:8px"><label class="f" style="margin:0"><span>Balance owed</span><input class="in num" type="number" placeholder="unknown" value="${d.balance??''}" onchange="S.debts[${i}].balance=this.value===''?null:+this.value;save();render()"></label><label class="f" style="margin:0"><span>APR %</span><input class="in num" type="number" placeholder="?" value="${d.apr??''}" onchange="S.debts[${i}].apr=this.value===''?null:+this.value;save();render()"></label><label class="f" style="margin:0"><span>Monthly</span><input class="in num" type="number" value="${d.min??''}" onchange="S.debts[${i}].min=+this.value;save();render()"></label></div>
     ${d.balance&&d.min?`<div class="foot2"><span>Paid off in ~${Math.ceil(d.balance/Math.max(d.min,1))} months at this rate</span><span>${d.apr?`≈ ${fmt(d.balance*d.apr/100/12)}/mo interest`:''}</span></div>`:''}</div>`).join('')}
     <div class="hl" style="margin-top:12px"><b>Order of attack:</b> <span class="muted">1) Always pay the Visa in full by the due date (20.99% APR). 2) Never take cash advances: they charge interest from day one plus a $5 fee. 3) When Affirm and Snap end, keep "paying" that $146 into your emergency fund.</span></div></div>
  </div>`;
}

let TXQ='',TXC='',TXM='',TXN=80;
function vTx(){
  const h=hist();
  const logs=S.logs.map(l=>({date:l.date,acct:'Logged',amount:l.amount,merchant:l.note||S.budgets.find(b=>b.id===l.cat)?.name||'Expense',cat:S.budgets.find(b=>b.id===l.cat)?.name||(l.amount>0?'Income':'Other'),group:l.amount>0?'income':'want',log:l}));
  let all=logs.concat(h.tx).sort((a,b)=>b.date.localeCompare(a.date));
  const cats=[...new Set(all.map(t=>t.cat))].sort(); const months=[...new Set(all.map(t=>ym(t.date)))].sort().reverse();
  if(TXQ) all=all.filter(t=>(t.merchant+' '+t.cat).toLowerCase().includes(TXQ.toLowerCase()));
  if(TXC) all=all.filter(t=>t.cat===TXC); if(TXM) all=all.filter(t=>ym(t.date)===TXM);
  const sumOut=-all.filter(t=>t.amount<0&&t.group!=='transfer').reduce((s,t)=>s+t.amount,0), sumIn=all.filter(t=>t.amount>0&&t.group!=='transfer').reduce((s,t)=>s+t.amount,0);
  return `<div class="card"><div class="grid g4" style="gap:10px;margin-bottom:14px">
    <input class="in" placeholder="Search merchant or category…" value="${esc(TXQ)}" oninput="TXQ=this.value;TXN=80;clearTimeout(window._q);window._q=setTimeout(()=>{render();const i=$('#view input');i.focus();i.setSelectionRange(i.value.length,i.value.length)},250)">
    <select class="in" onchange="TXC=this.value;render()"><option value="">All categories</option>${cats.map(c=>`<option ${c===TXC?'selected':''}>${esc(c)}</option>`).join('')}</select>
    <select class="in" onchange="TXM=this.value;render()"><option value="">All months</option>${months.map(k=>`<option value="${k}" ${k===TXM?'selected':''}>${ymLabel(k)}</option>`).join('')}</select>
    <div class="row" style="justify-content:flex-end;gap:16px"><span class="num">In <b class="pos">${fmt(sumIn)}</b></span><span class="num">Out <b>${fmt(sumOut)}</b></span></div></div>
  <div class="note" style="margin-bottom:8px">${all.length} transactions. Transfers between your own accounts are shown but not counted in totals.</div>
  <div class="list">${all.slice(0,TXN).map(t=>{const col=GROUP[t.group]?.c||'var(--tx3)';return `<div class="li"><div class="ic" style="background:color-mix(in srgb,${col} 13%,transparent);color:${col}">${esc((t.merchant||'?').slice(0,1))}</div><div class="t"><b>${esc(t.merchant)}</b><span>${nice(t.date,{y:1})} · ${esc(t.cat)} · ${t.acct}</span></div><div class="a num ${t.amount>0?'pos':''} ${t.group==='transfer'?'dim':''}">${t.amount>0?'+':''}${fmtc(t.amount)}</div>${t.log?`<button class="btn btn-sm" onclick="delLog('${t.log.id}')">${icon('trash')}</button>`:''}</div>`}).join('')}</div>
  ${all.length>TXN?`<button class="btn btn-ghost btn-block" onclick="TXN+=150;render()">Show more</button>`:''}</div>`;
}

function vSettings(){
  const st=S.settings, pays=S.recurring.filter(r=>r.id.startsWith('pay'));
  return `<div class="grid g2"><div class="card"><h3>${icon('cash','goldt')} Income & safety</h3>
   <label class="f"><span>Your name</span><input class="in" value="${esc(st.name)}" onchange="S.settings.name=this.value;save();render()"></label>
   ${pays.map(r=>`<div class="grid g2" style="gap:10px"><label class="f"><span>${esc(r.name)}: amount</span><input class="in num" type="number" value="${r.amount}" onchange="S.recurring.find(x=>x.id==='${r.id}').amount=+this.value;save();render()"></label><label class="f"><span>Day of month</span><input class="in num" type="number" min="1" max="31" value="${r.day}" onchange="S.recurring.find(x=>x.id==='${r.id}').day=+this.value;save();render()"></label></div>`).join('')}
   <div class="note" style="margin:-4px 0 12px">Your 16 paychecks Jan–Aug averaged $1,786 and landed around the 4th–8th and 19th–22nd. Set these a little low to stay safe.</div>
   <label class="f"><span>Safety buffer (your red-zone line)</span><input class="in num" type="number" value="${st.buffer}" onchange="S.settings.buffer=+this.value;save();render()"></label>
   <label class="f"><span>Monthly savings</span><input class="in num" type="number" value="${st.savingsMonthly}" onchange="S.settings.savingsMonthly=+this.value;save();render()"></label>
   </div>
   <div class="card"><h3>${icon('lock','goldt')} Privacy & data</h3>
   <div class="note" style="margin-bottom:12px;line-height:1.6">Your statement data is stored in this site only as an <b>AES-256 encrypted vault</b>, and only your passphrase opens it. Your logs and edits stay <b>on this device</b>, encrypted with the same key. Nothing is uploaded anywhere. To move your edits to your phone, export a backup here and import it there.</div>
   <div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn btn-ghost" onclick="exportData()">Export encrypted backup</button><label class="btn btn-ghost">Import backup<input type="file" accept=".json" class="hidden" onchange="importData(this.files[0])"></label></div>
   <div class="sp"></div><div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn btn-ghost" onclick="lockNow()">${icon('lock')} Lock now</button><button class="btn btn-ghost" onclick="forget()">Forget this device</button><button class="btn btn-ghost" style="color:var(--red)" onclick="if(confirmBox('Reset all your logs and edits on this device?'))resetLocal()">Reset local edits</button></div>
   <div class="sp"></div><div class="note">Data from Scotiabank statements: chequing Jan–Aug 2026 · Momentum Visa Dec 26, 2025 – Oct 25, 2026 · ${BASE.tx.length} transactions, reconciled to the cent. Two duplicate statements (May chequing, Jul Visa) were counted once.</div></div></div>`;
}
window.confirmBox=m=>window.confirm(m);
window.exportData=async()=>{const blob=new Blob([await encLocal(S)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`nest-backup-${today()}.json`;a.click();toast('Backup downloaded (encrypted)')};
window.importData=async f=>{try{S=await decLocal(await f.text());save();render();toast('Backup restored')}catch(e){toast('Could not open that backup')}};
window.lockNow=()=>{location.reload()};
window.forget=()=>{LS.del('nest.key');toast('This device will ask for the passphrase next time')};
window.resetLocal=()=>{S=freshState(BASE);save();render();toast('Reset')};


function openSheet(html){closeSheet();const d=document.createElement('div');d.className='scrim';d.id='scrim';d.innerHTML=`<div class="sheet">${html}</div>`;d.addEventListener('click',e=>{if(e.target===d)closeSheet()});document.body.appendChild(d);setTimeout(()=>d.querySelector('[autofocus]')?.focus(),60)}
function closeSheet(){$('#scrim')?.remove()}
window.closeSheet=closeSheet;
let ADD={cat:'coffee',inc:false};
function sheetAdd(){
  const bs=S.budgets;
  openSheet(`<h3>Log ${ADD.inc?'income':'an expense'}</h3><div class="sub">Updates your safe-to-spend and envelopes instantly.</div>
   <div class="seg" style="margin-bottom:14px"><button class="${!ADD.inc?'on':''}" onclick="ADD.inc=false;sheetAdd()">Expense</button><button class="${ADD.inc?'on':''}" onclick="ADD.inc=true;sheetAdd()">Income</button></div>
   <input class="amtin num" id="amt" type="number" inputmode="decimal" placeholder="$0" autofocus>
   ${ADD.inc?'':`<div class="chips">${bs.map(b=>`<button class="chip ${ADD.cat===b.id?'on':''}" onclick="ADD.cat='${b.id}';$$('.chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">${esc(b.name.split(' (')[0])}</button>`).join('')}<button class="chip ${ADD.cat==='other'?'on':''}" onclick="ADD.cat='other';$$('.chip').forEach(c=>c.classList.remove('on'));this.classList.add('on')">Other</button></div>`}
   <label class="f"><span>Note</span><input class="in" id="note" placeholder="${ADD.inc?'e.g. Side project payment':'e.g. Tim Hortons'}"></label>
   <label class="f"><span>Date</span><input class="in" id="ldate" type="date" value="${today()}"></label>
   <button class="btn btn-gold btn-block" onclick="doAdd()">Save</button>`);
  $('#amt').addEventListener('keydown',e=>{if(e.key==='Enter')doAdd()});
}
window.sheetAdd=sheetAdd;
window.doAdd=()=>{const a=+$('#amt').value;if(!a){toast('Enter an amount');return}
  const d=$('#ldate').value||today(); S.logs.push({id:uid(),date:d,amount:ADD.inc?Math.abs(a):-Math.abs(a),cat:ADD.inc?'income':ADD.cat,note:$('#note').value.trim(),future:d>today(),ts:Date.now()});
  save();closeSheet();render();const s=safeToSpend();toast(`Logged · ${fmt(Math.max(0,s.perDay))}/day safe until payday`)};
function sheetBalance(first){
  const b=S.balance;
  openSheet(`<h3>${first?'Welcome to Nest':'Update balances'}</h3><div class="sub">${first?'Start by entering what your Scotiabank app shows right now. Everything else is calculated from your statements.':'Do this once or twice a week. It keeps safe-to-spend accurate.'}</div>
   <label class="f"><span>Chequing balance today</span><input class="in num" id="bchq" type="number" step=".01" value="${b.assumed?'':b.chq}" placeholder="last statement: ${BASE.statements.chq_last.balance}" autofocus></label>
   <label class="f"><span>Visa balance owed today</span><input class="in num" id="bvisa" type="number" step=".01" value="${b.assumed?'':b.visa}" placeholder="last statement: ${BASE.statements.visa_last.balance}"></label>
   <button class="btn btn-gold btn-block" onclick="doBal()">Save balances</button>${first?'<button class="btn btn-ghost btn-block" onclick="closeSheet()">Later</button>':''}`);
}
window.doBal=()=>{const c=$('#bchq').value,v=$('#bvisa').value;if(c===''){toast('Enter your chequing balance');return}
  S.balance={chq:+c,visa:v===''?S.balance.visa:+v,asOf:today(),assumed:false,ts:Date.now()};
  S.logs.forEach(l=>{if(!l.future&&l.date<=today())l.reconciled=true});save();closeSheet();render();toast('Balances updated')};
function sheetMore(){
  openSheet(`<h3>More</h3><div class="list">${VIEWS.filter(v=>!['today','flow','budget','spending'].includes(v.id)).map(v=>`<button class="li" style="width:100%;text-align:left" data-v="${v.id}"><div class="ic" style="background:var(--s3);color:var(--gold)">${icon(v.i)}</div><div class="t"><b>${v.n}</b></div></button>`).join('')}</div>`);
}
window.sheetRec=id=>{
  const r=id?S.recurring.find(x=>x.id===id):{id:'u'+uid(),name:'',amount:0,day:1,kind:'sub',group:'want',acct:'chq',freq:'monthly',active:true};
  window._rec=r;
  openSheet(`<h3>${id?'Edit':'New'} ${r.kind==='income'?'income':'bill'}</h3><div class="sub">Shows up in your cash flow on the day it's due.</div>
   <label class="f"><span>Name</span><input class="in" id="rn" value="${esc(r.name)}" autofocus></label>
   <div class="grid g2" style="gap:10px"><label class="f"><span>Amount</span><input class="in num" id="ra" type="number" step=".01" value="${r.amount}"></label><label class="f"><span>Day of month</span><input class="in num" id="rd" type="number" min="1" max="31" value="${r.day}"></label></div>
   ${r.kind==='income'?'':`<div class="grid g2" style="gap:10px"><label class="f"><span>Type</span><select class="in" id="rg">${[['need','Essential bill'],['want','Subscription / want'],['debt','Debt payment'],['business','Business tool'],['fee','Bank fee']].map(([v,n])=>`<option value="${v}" ${r.group===v?'selected':''}>${n}</option>`).join('')}</select></label>
   <label class="f"><span>Paid from</span><select class="in" id="rc"><option value="chq" ${r.acct==='chq'?'selected':''}>Chequing</option><option value="visa" ${r.acct==='visa'?'selected':''}>Visa</option></select></label></div>
   <label class="row" style="margin-bottom:14px"><label class="switch"><input type="checkbox" id="rcp" ${r.couple?'checked':''}><i></i></label><span>Only once my wife arrives</span></label>`}
   <button class="btn btn-gold btn-block" onclick="doRec(${id?1:0})">Save</button>${id&&r.kind!=='income'?`<button class="btn btn-ghost btn-block" style="color:var(--red)" onclick="S.recurring=S.recurring.filter(x=>x.id!=='${id}');save();closeSheet();render()">Delete</button>`:''}`);
};
window.doRec=ex=>{const r=window._rec;r.name=$('#rn').value||'Untitled';r.amount=+$('#ra').value||0;r.day=clamp(+$('#rd').value||1,1,31);
  if(r.kind!=='income'){r.group=$('#rg').value;r.kind=r.group==='debt'?'debt':r.group==='need'||r.group==='fee'?'bill':'sub';r.acct=$('#rc').value;r.couple=$('#rcp').checked}
  if(!ex)S.recurring.push(r);save();closeSheet();render();toast('Saved')};
function toast(m){$('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2600)}
window.toast=toast; window.route=route; window.render=render; window.save=save; window.fmt=fmt; window.uid=uid; window.$=$; window.$$=$$;
window.addEventListener('resize',()=>{clearTimeout(window._rs);window._rs=setTimeout(()=>{if(S)render()},200)});


(async function init(){
  try{VAULT=await (await fetch('vault.json',{cache:'no-cache'})).json()}catch(e){$('#lockerr').textContent='Could not load the vault. Check your connection.';return}
  const saved=LS.get('nest.key');
  if(saved){try{const raw=JSON.parse(saved);if(raw.salt===VAULT.salt){const k=await crypto.subtle.importKey('raw',b64d(raw.k),{name:'AES-GCM'},true,['encrypt','decrypt']);await boot(k);return}}catch(e){LS.del('nest.key')}}
  $('#pass').focus();
})();
$('#lockform').addEventListener('submit',async e=>{
  e.preventDefault();const p=$('#pass').value;if(!p)return;const btn=$('#unlockbtn');btn.textContent='Unlocking…';btn.disabled=true;$('#lockerr').textContent='';
  try{const k=await deriveKey(p,b64d(VAULT.salt),VAULT.iter);await decryptVault(k);
    if($('#remember').checked){LS.set('nest.key',JSON.stringify({salt:VAULT.salt,k:b64e(await crypto.subtle.exportKey('raw',k))}))}
    await boot(k);
  }catch(err){$('#lockerr').textContent='That passphrase didn’t work. Check it and try again.';btn.textContent='Unlock';btn.disabled=false}
});
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
