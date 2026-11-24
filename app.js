'use strict';
/* RideLink prototype v2: plain JS, no build step. All data is fake and lives in S below. */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const naira = n => '₦' + Math.round(n).toLocaleString('en-NG');
const initials = n => String(n||'?').trim().split(/\s+/).map(w => w[0]).join('').slice(0,2).toUpperCase();
const r100 = n => Math.round(n/100)*100;
const to12 = t => { const [h,m] = t.split(':').map(Number); return ((h%12)||12)+':'+String(m).padStart(2,'0')+' '+(h>=12?'PM':'AM'); };

/* ---------- icons ---------- */
const ICON = {
  home:'<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
  trips:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
  find:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  post:'<path d="M12 5v14M5 12h14"/>',
  inbox:'<path d="M4 5h16v11h-5l-1.5 3h-3L9 16H4z"/>',
  requests:'<path d="M5 5h14v10H10l-5 4z"/>',
  profile:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-6 8-6s8 2 8 6"/>',
  car:'<path d="M5 16v-5l2-5h10l2 5v5M3 16h18M7 19v-3M17 19v-3"/><circle cx="8" cy="13" r=".7"/><circle cx="16" cy="13" r=".7"/>',
  shield:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  sos:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.4"/>',
  share:'<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>',
  star:'<path d="M12 3l2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8z"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  upload:'<path d="M12 16V5M7 9l5-5 5 5M5 19h14"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
  back:'<path d="M19 12H5M11 6l-6 6 6 6"/>',
  ac:'<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>',
  bag:'<path d="M6 8h12v11H6zM9 8V6a3 3 0 0 1 6 0v2"/>',
  nosmoke:'<path d="M3 15h13v3H3zM19 15v3M20 9c0-2-2-2-2-4"/><path d="M3 3l18 18"/>',
  women:'<circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6"/>',
  paw:'<path d="M8 15c0-2 1.5-3 4-3s4 1 4 3-2 4-4 4-4-2-4-4z"/><circle cx="6" cy="10" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/><circle cx="18" cy="10" r="1"/>',
  quiet:'<path d="M4 10v4h4l5 4V6l-5 4zM17 9l4 6M21 9l-4 6"/>',
  pin:'<path d="M12 21s6-5.5 6-10a6 6 0 0 0-12 0c0 4.5 6 10 6 10z"/><circle cx="12" cy="11" r="2"/>',
  tag:'<path d="M3 12l9-9h8v8l-9 9z"/><circle cx="16" cy="8" r="1.2"/>',
  wallet:'<path d="M4 7h15a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12"/><circle cx="16" cy="13" r="1.2"/>',
  id:'<rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-2 5.5-2 6 0M14 10h4M14 14h3"/>',
  camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  logout:'<path d="M10 4H5v16h5M15 8l4 4-4 4M19 12H9"/>',
  swap:'<path d="M5 8h13l-3-3M19 16H6l3 3"/>'
};
const ic = (k, sz=20) => `<svg class="i" viewBox="0 0 24 24" width="${sz}" height="${sz}" aria-hidden="true">${ICON[k]||''}</svg>`;

/* ---------- trip rules (swipeable cards) ---------- */
const RULES = [
  {k:'AC',ic:'ac',d:'Air conditioning on for the whole trip'},
  {k:'Luggage ok',ic:'bag',d:'One bag per seat fits in the boot'},
  {k:'No smoking',ic:'nosmoke',d:'No smoking or vaping in the car'},
  {k:'Women only',ic:'women',d:'Seats offered to women only'},
  {k:'No pets',ic:'paw',d:'Please leave pets at home'},
  {k:'Quiet ride',ic:'quiet',d:'Low music and minimal chat'},
  {k:'Set pickup points',ic:'pin',d:'Pickup only at the agreed spot'}
];
const FIXED_RULE = {k:'Fixed price',ic:'tag',d:'The price is set. No offers'};
const ruleBy = k => RULES.find(r => r.k===k) || {k,ic:'check',d:''};
const ruleCard = r => `<div class="rule"><span class="ico">${ic(r.ic,18)}</span><div><b>${esc(r.k)}</b><span class="d">${esc(r.d)}</span></div></div>`;

/* ---------- places + distance ---------- */
const CITIES = {
  lagos:{n:'Lagos',lon:3.38,lat:6.52}, ibadan:{n:'Ibadan',lon:3.90,lat:7.38}, ilorin:{n:'Ilorin',lon:4.55,lat:8.49},
  abuja:{n:'Abuja',lon:7.49,lat:9.06}, kaduna:{n:'Kaduna',lon:7.44,lat:10.52}, lokoja:{n:'Lokoja',lon:6.74,lat:7.80},
  kano:{n:'Kano',lon:8.52,lat:12.00}, jos:{n:'Jos',lon:8.89,lat:9.93}, enugu:{n:'Enugu',lon:7.50,lat:6.45},
  benin:{n:'Benin City',lon:5.63,lat:6.34}, ph:{n:'Port Harcourt',lon:7.01,lat:4.82}, minna:{n:'Minna',lon:6.55,lat:9.61}
};
const KM = (a,b) => { const A=CITIES[a],B=CITIES[b],d=Math.PI/180; const dl=(B.lat-A.lat)*d, dn=(B.lon-A.lon)*d;
  const x=Math.sin(dl/2)**2+Math.cos(A.lat*d)*Math.cos(B.lat*d)*Math.sin(dn/2)**2; return 2*6371*Math.asin(Math.sqrt(x))*1.25; };
const MINS = (a,b) => Math.round(KM(a,b)/75*60);
const dur = m => m<60 ? m+' min' : Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m';
const isWide = () => ($('#phone')||{clientWidth:390}).clientWidth >= 600;

/* ---------- state ---------- */
const S = {
  onbOn:true, mode:'passenger', view:'find', dev:'iphone',
  user:{name:'Ibrahim',roles:['passenger','driver'],driverVerified:true,veh:{make:'Toyota',model:'Camry',color:'Silver',plate:'ABJ 482 KD',seats:3},em:{name:'Aisha A.',phone:'0803 000 0000'}},
  onb:{step:'splash',only:null,roles:['passenger'],phone:'',name:'',em:{name:'',phone:''},nin:'',docs:{lic:false,papers:false,selfie:false},veh:{make:'',model:'',color:'',plate:'',seats:3},photo:false},
  from:'Abuja', to:'Kaduna', filters:[], selTrip:null, sel:null, offerId:null, sheet:null, plan:1, toast:null,
  ptab:'up', dtab:'up', track:null, lastBooking:null, nextId:100,
  trips:[
    {id:1,driver:'Musa Abdullahi',rating:4.9,count:128,fromC:'abuja',toC:'kaduna',from:'Abuja · Wuse 2',to:'Kaduna · Barnawa',when:'Tomorrow · 7:00 AM',seats:3,cap:3,price:6500,neg:true,boosted:true,car:'Toyota Camry, silver',rules:['AC','Luggage ok','No smoking']},
    {id:2,driver:'Amina Bello',rating:4.8,count:64,fromC:'abuja',toC:'kaduna',from:'Abuja · Gwarinpa',to:'Kaduna · Sabon Tasha',when:'Tomorrow · 8:30 AM',seats:2,cap:3,price:7000,neg:true,car:'Honda Accord, black',rules:['AC','Women only','Quiet ride']},
    {id:3,driver:'Tunde Okafor',rating:4.7,count:41,fromC:'abuja',toC:'lokoja',from:'Abuja · Lugbe',to:'Lokoja · Ganaja',when:'Today · 4:00 PM',seats:2,cap:3,price:5000,neg:true,car:'Toyota Corolla, white',rules:['AC','Luggage ok','Set pickup points']},
    {id:4,driver:'Seun Adeyemi',rating:4.9,count:210,fromC:'lagos',toC:'ibadan',from:'Lagos · Ikeja',to:'Ibadan · Challenge',when:'Today · 5:30 PM',seats:2,cap:3,price:4500,neg:true,car:'Lexus RX, grey',rules:['AC','No smoking','No pets']},
    {id:5,driver:'Ibrahim Lawal',rating:4.6,count:19,fromC:'abuja',toC:'kaduna',from:'Abuja · Kubwa',to:'Kaduna · Kawo',when:'Fri · 6:00 AM',seats:1,cap:3,price:6000,neg:false,car:'Toyota Avensis, blue',rules:['No smoking','Set pickup points']},
    {id:6,driver:'Hauwa Garba',rating:4.8,count:87,fromC:'kaduna',toC:'abuja',from:'Kaduna · Rigasa',to:'Abuja · Jabi',when:'Tomorrow · 3:00 PM',seats:3,cap:3,price:6500,neg:true,car:'Kia Cerato, red',rules:['AC','Luggage ok','Quiet ride']},
    {id:7,mine:true,driver:'You',rating:4.9,count:42,fromC:'abuja',toC:'kaduna',from:'Abuja · Wuse 2',to:'Kaduna · Barnawa',when:'Sat · 6:30 AM',seats:2,cap:3,price:6500,neg:true,floor:5500,boosted:false,car:'Toyota Camry, silver',rules:['AC','Luggage ok']},
    {id:8,past:true,driver:'Hauwa Garba',rating:4.8,count:87,fromC:'kaduna',toC:'abuja',from:'Kaduna · Rigasa',to:'Abuja · Jabi',when:'Fri 14 Nov · 3:00 PM',seats:0,cap:3,price:6500,neg:true,car:'Kia Cerato, red',rules:['AC']},
    {id:9,past:true,mine:true,driver:'You',rating:4.9,count:42,fromC:'abuja',toC:'jos',from:'Abuja · Wuse 2',to:'Jos · Terminus',when:'Sun 16 Nov · 8:00 AM',seats:0,cap:3,price:7500,neg:true,car:'Toyota Camry, silver',rules:['AC'],earned:22500,riders:3}
  ],
  offers:[],
  bookings:[],
  incoming:[
    {id:1,tripId:7,name:'Chinedu Okeke',amount:5300,status:'new'},
    {id:2,tripId:7,name:'Fatima Sani',amount:6500,status:'new'},
    {id:3,tripId:7,name:'Yusuf Danjuma',amount:6500,status:'accepted'}
  ],
  post:{fromC:'abuja',toC:'kaduna',fromA:'Wuse 2',toA:'Barnawa',day:'Tomorrow',time:'07:00',seats:3,price:6500,neg:true,floor:5500,rules:['AC','Luggage ok']},
  earn:{week:48500,bars:[['W',0],['T',6500],['F',9000],['S',0],['S',13000],['M',12000],['T',8000]]}
};
const trip = id => S.trips.find(t => t.id===id);
const offer = id => S.offers.find(o => o.id===id);
const myTrips = () => S.trips.filter(t => t.mine);
const newReqs = () => S.incoming.filter(i => i.status==='new' && trip(i.tripId) && !trip(i.tripId).past);
const unread = () => S.mode==='driver' ? newReqs().length : S.offers.filter(o => o.status==='countered' || o.status==='accepted').length;
const greet = () => { const h = new Date().getHours(); return h<12 ? 'Good morning' : h<17 ? 'Good afternoon' : 'Good evening'; };

/* ---------- map (stylised preview; swap mapSVG for Leaflet or Google Maps in the real app) ---------- */
function mapSVG(o){
  const W=360, H=isWide()?400:190, routes=o.routes||[];
  const keys=[...new Set(routes.flatMap(r=>[r.a,r.b]))]; if(!keys.length) keys.push('abuja','kaduna','lokoja');
  const lons=keys.map(k=>CITIES[k].lon), lats=keys.map(k=>CITIES[k].lat);
  const cLon=(Math.min(...lons)+Math.max(...lons))/2, cLat=(Math.min(...lats)+Math.max(...lats))/2, cx=Math.cos(cLat*Math.PI/180);
  const sx=Math.max((Math.max(...lons)-Math.min(...lons))*cx,1.1), sy=Math.max(Math.max(...lats)-Math.min(...lats),1.1);
  const pad=42, k=Math.min((W-2*pad)/sx,(H-2*pad)/sy);
  const P=key=>{const c=CITIES[key]; return [W/2+(c.lon-cLon)*cx*k, H/2-(c.lat-cLat)*k];};
  let g='', carG='';
  Object.keys(CITIES).forEach(key=>{ if(keys.includes(key))return; const [x,y]=P(key); if(x<16||x>W-40||y<14||y>H-10)return;
    g+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#b9c5c0"/><text x="${(x+6).toFixed(1)}" y="${(y+3).toFixed(1)}" class="ml">${CITIES[key].n}</text>`; });
  [...routes].sort((a,b)=>(a.sel?1:0)-(b.sel?1:0)).forEach(r=>{
    const [ax,ay]=P(r.a),[bx,by]=P(r.b), mx=(ax+bx)/2, my=(ay+by)/2, dx=bx-ax, dy=by-ay, len=Math.hypot(dx,dy)||1, off=len*.16;
    const qx=mx-dy/len*off, qy=my+dx/len*off;
    const d=`M${ax.toFixed(1)} ${ay.toFixed(1)}Q${qx.toFixed(1)} ${qy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`;
    const col=r.sel?'var(--brand)':r.boost?'var(--boost)':'#8fa59d';
    g+=`<g ${r.id?`onclick="pickTrip(${r.id})" style="cursor:pointer"`:''}><path d="${d}" fill="none" stroke="transparent" stroke-width="18"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${r.sel?8:6}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${r.sel?4:2.6}" stroke-linecap="round" ${r.sel?'':'stroke-dasharray="0.5 6"'}/></g>`;
    if(r.sel && o.car!=null){ const t=o.car;
      const x=(1-t)**2*ax+2*(1-t)*t*qx+t*t*bx, y=(1-t)**2*ay+2*(1-t)*t*qy+t*t*by;
      const tx=2*(1-t)*(qx-ax)+2*t*(bx-qx), ty=2*(1-t)*(qy-ay)+2*t*(by-qy), ang=Math.atan2(ty,tx)*180/Math.PI;
      carG=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(0)})"><rect x="-11" y="-6.5" width="22" height="13" rx="4.5" fill="var(--brand)" stroke="#fff" stroke-width="2"/><rect x="2" y="-4.2" width="5.5" height="8.4" rx="1.6" fill="#fff" opacity=".85"/></g>`; }
  });
  const selR=routes.find(r=>r.sel);
  keys.forEach(key=>{ const [x,y]=P(key), isOrigin=routes.some(r=>r.a===key), selected=selR&&(selR.a===key||selR.b===key);
    g+=`${selR&&selR.a===key?`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" class="pulse"/>`:''}<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${selected?6:5}" fill="${isOrigin?'#fff':'var(--brand)'}" stroke="var(--brand)" stroke-width="3"/><text x="${x.toFixed(1)}" y="${(y-11).toFixed(1)}" text-anchor="middle" class="ml b">${CITIES[key].n}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Route map">${g}${carG}</svg>`;
}
const mapBox = (inner, tag='Map preview') => `<div class="map"><div id="mapbox">${inner}</div><span class="maptag">${tag}</span></div>`;

/* ---------- navigation ---------- */
const HOME = {passenger:'find', driver:'dTrips'};
function go(v, extra){ if(S.view==='track' && v!=='track') stopTrack(); S.view=v; S.sheet=null; Object.assign(S, extra||{}); render(); $('#screen').scrollTop=0; }
function setMode(m){
  if(m===S.mode) return;
  if(m==='driver' && !S.user.driverVerified){ startOnb('driver'); return; }
  if(S.view==='track') stopTrack();
  S.mode=m; S.sheet=null; go(HOME[m]);
}
let tt; function toast(msg){ S.toast=msg; render(); clearTimeout(tt); tt=setTimeout(()=>{S.toast=null;render();},2600); }

/* ---------- onboarding / registration ---------- */
const seq = () => S.onb.only==='driver' ? ['driver','review','done'] : ['splash','role','phone','otp','profile',...(S.onb.roles.includes('driver')?['driver','review']:[]),'done'];
function startOnb(only){ S.onbOn=true; S.onb.only=only||null; S.onb.step=only==='driver'?'driver':'splash'; if(!only){ S.onb.roles=['passenger']; S.onb.phone=''; S.onb.name=''; S.onb.em={name:'',phone:''}; } render(); $('#screen').scrollTop=0; }
function nextStep(){ const q=seq(), i=q.indexOf(S.onb.step); S.onb.step=q[Math.min(i+1,q.length-1)]; render(); $('#screen').scrollTop=0; if(S.onb.step==='review') runReview(); }
function prevStep(){ const q=seq(), i=q.indexOf(S.onb.step); if(i>0){ S.onb.step=q[i-1]; render(); } else if(S.onb.only){ S.onbOn=false; render(); } }
function runReview(){ setTimeout(()=>{ if(S.onb.step!=='review')return; nextStep(); },2400); }
function skipOnb(){ S.onbOn=false; S.mode='passenger'; S.view='find'; render(); }
function finishOnb(){
  const o=S.onb;
  if(o.only){ S.user.driverVerified=true; if(!S.user.roles.includes('driver'))S.user.roles.push('driver'); S.user.veh={...o.veh}; S.mode='driver'; }
  else { S.user={name:o.name||'Ibrahim',roles:[...o.roles],driverVerified:o.roles.includes('driver'),veh:{...o.veh},em:{...o.em}}; S.mode=o.roles.includes('passenger')?'passenger':'driver'; }
  S.onbOn=false; S.view=HOME[S.mode]; render();
}
function toggleRole(r){ const a=S.onb.roles, i=a.indexOf(r); i>=0?a.splice(i,1):a.push(r); render(); }
function onOtp(i,el){
  el.value=el.value.replace(/\D/g,'').slice(-1);
  if(el.value && i<3) $('#o'+(i+1)).focus();
  const code=[0,1,2,3].map(n=>$('#o'+n).value).join('');
  if(code.length===4) checkOtp(code);
}
function otpKey(i,e){ if(e.key==='Backspace' && !e.target.value && i>0) $('#o'+(i-1)).focus(); }
function checkOtp(code){
  if(code==='1234'){ setTimeout(nextStep,250); }
  else { const w=$('.otp'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); toast('That code does not match. The demo code is 1234.'); }
}
function demoOtp(){ '1234'.split('').forEach((c,n)=>$('#o'+n).value=c); checkOtp('1234'); }
const driverReady = () => { const o=S.onb,v=o.veh; return o.nin.length===11 && o.docs.lic && o.docs.papers && o.docs.selfie && v.make.trim() && v.model.trim() && v.plate.trim(); };
function updDriverBtn(){ const b=$('#dsubmit'); if(b) b.disabled=!driverReady(); const n=$('#dcount'); if(n) n.textContent=driverDone()+' of 6 done'; }
const driverDone = () => { const o=S.onb,v=o.veh; return [o.nin.length===11,o.docs.lic,o.docs.papers,o.docs.selfie,!!(v.make.trim()&&v.model.trim()&&v.plate.trim()),true].filter(Boolean).length; };
function setDoc(k){ S.onb.docs[k]=!S.onb.docs[k]; render(); }

function vOnb(){
  const o=S.onb, q=seq(), i=q.indexOf(o.step), canBack=i>0||o.only;
  const bar = o.step==='splash'||o.step==='review'||o.step==='done' ? '' :
    `<div class="top"><button class="back" style="margin:0" onclick="prevStep()" aria-label="Back">${ic('back',18)}</button><div class="steps">${q.filter(s=>!['splash','review','done'].includes(s)).map((s,n)=>`<i class="${q.indexOf(s)<=i?'on':''}"></i>`).join('')}</div><button class="skip" onclick="skipOnb()">Skip</button></div>`;
  let b='';
  if(o.step==='splash') b=`<div class="splash"><div class="name" style="font-family:var(--display);font-size:16px">RideLink</div><h2>Share the road. Split the cost.</h2><p>Post a trip or join one. Agree the price.</p>${mapBox(mapSVG({routes:[{a:'abuja',b:'kaduna',sel:true}],car:.42}),'Abuja to Kaduna')}</div>
    <button class="btn" onclick="nextStep()">Get started</button><button class="skip" style="display:block;margin:12px auto 0" onclick="skipOnb()">Skip sign-up for the demo</button>`;
  if(o.step==='role') b=`<h2>How will you use RideLink?</h2><p class="sub">Pick one or both. You can switch any time from the top bar.</p>
    ${[['passenger','Passenger','Find a ride and negotiate a seat','profile'],['driver','Driver','Post trips and earn from empty seats','car']].map(([k,t,d,icn])=>`<button class="role" aria-pressed="${o.roles.includes(k)}" onclick="toggleRole('${k}')"><span class="ico">${ic(icn,20)}</span><div><div class="name">${t}</div><div class="meta">${d}</div></div></button>`).join('')}
    <button class="btn" style="margin-top:8px" ${o.roles.length?'':'disabled'} onclick="nextStep()">Continue</button>`;
  if(o.step==='phone') b=`<h2>Your phone number</h2><p class="sub">We send a code by SMS to confirm it is you.</p>
    <div class="field"><label for="ph">Mobile number</label><div class="phonefield"><span class="pre">+234</span><input class="input" id="ph" type="tel" inputmode="numeric" maxlength="11" placeholder="803 000 0000" value="${esc(o.phone)}" oninput="S.onb.phone=this.value.replace(/\\D/g,'');$('#phgo').disabled=S.onb.phone.length<10"></div></div>
    <button class="btn" id="phgo" ${o.phone.length>=10?'':'disabled'} onclick="nextStep()">Send code</button>`;
  if(o.step==='otp') b=`<h2>Enter the 4-digit code</h2><p class="sub">Sent to +234 ${esc(o.phone.replace(/^0/,'')||'803 000 0000')}</p>
    <div class="otp">${[0,1,2,3].map(n=>`<input id="o${n}" inputmode="numeric" maxlength="1" aria-label="Digit ${n+1}" oninput="onOtp(${n},this)" onkeydown="otpKey(${n},event)">`).join('')}</div>
    <button class="btn ghost" onclick="demoOtp()">Use demo code 1234</button>`;
  if(o.step==='profile') b=`<h2>What should we call you?</h2><p class="sub">Drivers and passengers see your name.</p>
    <div class="field"><label for="nm">Full name</label><input class="input" id="nm" value="${esc(o.name)}" placeholder="As on your ID" oninput="S.onb.name=this.value;$('#pgo').disabled=!this.value.trim()"></div>
    <button class="btn" id="pgo" ${o.name.trim()?'':'disabled'} onclick="nextStep()">Continue</button>`;
  if(o.step==='driver'){ const v=o.veh;
    b=`<div class="row between"><h2>Verify as a driver</h2><span class="chip" id="dcount">${driverDone()} of 6 done</span></div><p class="sub">Passengers only book verified drivers. This takes about two minutes.</p>
    <div class="field"><label for="nin">National Identification Number (NIN)</label><input class="input" id="nin" inputmode="numeric" maxlength="11" placeholder="11 digits" value="${esc(o.nin)}" oninput="S.onb.nin=this.value.replace(/\\D/g,'');updDriverBtn()"></div>
    ${[['lic','Driver’s licence','Photo of the front','id'],['papers','Vehicle papers','Registration and insurance','upload'],['selfie','Selfie check','Match your face to your ID','camera']].map(([k,t,d,icn])=>`<button class="upload ${o.docs[k]?'done':''}" onclick="setDoc('${k}')"><span class="ico">${ic(o.docs[k]?'check':icn,18)}</span><div><div class="name">${t}</div><div class="meta">${o.docs[k]?'Uploaded':d}</div></div></button>`).join('')}
    <h3>Your vehicle</h3><div class="two"><div class="field"><label for="vm">Make</label><input class="input" id="vm" value="${esc(v.make)}" placeholder="Toyota" oninput="S.onb.veh.make=this.value;updDriverBtn()"></div><div class="field"><label for="vo">Model</label><input class="input" id="vo" value="${esc(v.model)}" placeholder="Camry" oninput="S.onb.veh.model=this.value;updDriverBtn()"></div></div>
    <div class="two"><div class="field"><label for="vc">Colour</label><input class="input" id="vc" value="${esc(v.color)}" placeholder="Silver" oninput="S.onb.veh.color=this.value"></div><div class="field"><label for="vp">Plate number</label><input class="input" id="vp" value="${esc(v.plate)}" placeholder="ABJ 123 KD" oninput="S.onb.veh.plate=this.value;updDriverBtn()"></div></div>
    <div class="field"><span class="label">Passenger seats</span><div class="stepper"><button aria-label="Fewer seats" onclick="S.onb.veh.seats=Math.max(1,S.onb.veh.seats-1);render()">−</button><b>${v.seats}</b><button aria-label="More seats" onclick="S.onb.veh.seats=Math.min(6,S.onb.veh.seats+1);render()">+</button></div></div>
    <button class="btn" id="dsubmit" ${driverReady()?'':'disabled'} onclick="nextStep()">Submit for review</button><p class="hint center" style="margin-top:8px">Demo only. Nothing you type here is stored.</p>`; }
  if(o.step==='review') b=`<div class="center" style="padding-top:90px"><div class="spin"></div><h2>Reviewing your documents</h2><p class="sub">In the live app a person checks these. Here it takes a moment.</p></div>`;
  if(o.step==='done') b=`<div class="center" style="padding-top:70px"><div class="avatar lg" style="margin:0 auto 14px;background:var(--brand);color:#fff">${ic('check',28)}</div><h2>You’re all set${o.only?'':', '+esc((o.name||'').split(' ')[0]||'friend')}</h2>
    <p class="sub">${o.only||o.roles.includes('driver')?'You are a verified driver. ':''}${o.only?'Post your first trip from the middle button.':'Find a ride from the middle button.'}</p>
    ${o.only||o.roles.includes('driver')?`<span class="chip good">${ic('shield',12)} Driver verified</span>`:''}</div><button class="btn" style="margin-top:28px" onclick="finishOnb()">Continue</button>`;
  return `<div class="onbwrap">${bar}<div class="body">${b}</div></div>`;
}

/* ---------- shared bits ---------- */
function rail(items){ return `<div class="rail">${items}</div>`; }
function tripCard(t){
  return `<button class="card tap ${t.boosted?'promoted':''} ${S.selTrip===t.id?'sel':''}" onclick="go('detail',{sel:${t.id}})" aria-label="Trip from ${esc(t.from)} to ${esc(t.to)}">
    <div class="row between"><div class="row"><div class="avatar">${initials(t.driver)}</div><div><div class="name">${esc(t.driver)}</div><div class="meta">★ ${t.rating} · ${esc(t.when)}</div></div></div><div class="price">${naira(t.price)}</div></div>
    <div class="route"><div>${esc(t.from)}</div><div>${esc(t.to)}</div></div>
    <div class="chips"><span class="chip">${t.seats} seat${t.seats===1?'':'s'} left</span>${t.neg?'<span class="chip good">Negotiable</span>':''}${t.boosted?'<span class="chip promo">Promoted</span>':''}</div></button>`;
}
const FILT = {
  neg:{l:'Negotiable',fn:t=>t.neg}, today:{l:'Leaving today',fn:t=>t.when.startsWith('Today')}, cheap:{l:'Under ₦6,000',fn:t=>t.price<6000}
};
function findTrips(){
  const f=S.from.trim().toLowerCase(), d=S.to.trim().toLowerCase();
  return S.trips.filter(t=>!t.mine && !t.past && (!f||t.from.toLowerCase().includes(f)) && (!d||t.to.toLowerCase().includes(d)) && S.filters.every(k=>FILT[k].fn(t)))
    .sort((a,b)=>((b.id===S.selTrip)-(a.id===S.selTrip))||(!!b.boosted-!!a.boosted));
}
const tripList = () => { const l=findTrips(); return l.length ? l.map(tripCard).join('') : `<div class="empty"><b>No trips on this route yet</b>Try another route or clear a filter.</div>`; };
const findMap = () => mapSVG({routes:findTrips().map(t=>({a:t.fromC,b:t.toC,id:t.id,boost:t.boosted,sel:t.id===S.selTrip}))});
function updFind(){ const m=$('#mapbox'); if(m) m.innerHTML=findMap(); const l=$('#list'); if(l) l.innerHTML=tripList(); const c=$('#count'); if(c) c.textContent=findTrips().length+' trips'; }
function toggleFilter(k,el){ const i=S.filters.indexOf(k); i>=0?S.filters.splice(i,1):S.filters.push(k); el.setAttribute('aria-pressed',i<0); updFind(); }
function pickTrip(id){ if(S.selTrip===id){ go('detail',{sel:id}); return; } S.selTrip=id; if(S.view==='find') updFind(); else go('detail',{sel:id}); }

/* ---------- passenger views ---------- */
function bookingCard(b){
  const t=trip(b.tripId);
  const act = b.status==='upcoming'
    ? `<div class="btns"><button class="btn sm" onclick="startTrack(${t.id},'passenger',${b.id})">${ic('pin',14)} ${t.live?'Open live trip':'Track trip'}</button><button class="btn ghost sm" onclick="toast('Free cancellation until 2 hours before departure')">Cancel</button></div>`
    : (b.rated ? `<div class="meta" style="margin-top:6px">You rated this trip</div>` : `<div class="btns"><button class="btn sm" onclick="S.sheet={type:'rate',bid:${b.id},stars:0};render()">${ic('star',14)} Rate trip</button></div>`);
  return `<div class="card"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><span class="chip ${b.status==='upcoming'?'good':''}">${b.status==='upcoming'?(t.live?'On the way':'Confirmed'):'Completed'}</span></div>
    <div class="meta">${esc(t.when)} · ${esc(t.driver)} · ${naira(b.price)}</div>${b.status==='upcoming'?`<div class="meta">Pickup code <b>${b.code}</b></div>`:''}${act}</div>`;
}

function vFind(){
  return `<div class="split"><div class="mapcol">${mapBox(findMap())}</div><div class="col">
  <div class="two" style="gap:8px;margin-bottom:10px">
    <input class="input" id="qf" placeholder="From" value="${esc(S.from)}" oninput="S.from=this.value;S.selTrip=null;updFind()" aria-label="From">
    <input class="input" id="qt" placeholder="To" value="${esc(S.to)}" oninput="S.to=this.value;S.selTrip=null;updFind()" aria-label="To"></div>
  ${rail(Object.entries(FILT).map(([k,f])=>`<button class="chip" aria-pressed="${S.filters.includes(k)}" onclick="toggleFilter('${k}',this)">${f.l}</button>`).join(''))}
  <div id="list">${tripList()}</div></div></div>`;
}
function vDetail(){
  const t=trip(S.sel); if(!t) return vFind();
  const ex=S.offers.find(o=>o.tripId===t.id&&!['declined','paid'].includes(o.status));
  const rules=[...t.rules.map(ruleBy),...(t.neg?[]:[FIXED_RULE])]; let act;
  if(t.mine) act=`<button class="btn ghost" onclick="go('dTrips')">See requests</button>`;
  else if(ex){ const [lab,cls]=statusChip(ex);
    act=`<div class="card row between"><div><div class="name">Your offer ${naira(ex.amount)}</div><div class="meta">${ex.status==='countered'?'Driver countered '+naira(ex.counter):'Sent to the driver'}</div></div><span class="chip ${cls}">${lab}</span></div>
    <button class="btn" onclick="go('thread',{offerId:${ex.id}})">${ex.status==='countered'?'Reply to counter':ex.status==='accepted'?'Pay to confirm':'View offer'}</button>`; }
  else act=`<div class="btns" style="flex-direction:column"><button class="btn" ${t.seats?'':'disabled'} onclick="sendOffer(${t.id},${t.price})">Request a seat at ${naira(t.price)}</button>
    ${t.neg?`<button class="btn ghost" ${t.seats?'':'disabled'} onclick="S.sheet={type:'offer',tripId:${t.id}};render()">Make an offer</button>`:''}</div>`;
  return `<button class="back" onclick="go('${S.mode==='driver'?'dTrips':'find'}')">${ic('back',16)} Back</button>
  <div class="split"><div class="mapcol">${mapBox(mapSVG({routes:[{a:t.fromC,b:t.toC,sel:true}]}),Math.round(KM(t.fromC,t.toC))+' km')}</div><div class="col">
  <div class="card ${t.boosted?'promoted':''}"><div class="row between"><div class="row"><div class="avatar">${initials(t.driver)}</div><div><div class="name">${esc(t.driver)}</div><div class="meta">★ ${t.rating} · ${esc(t.car)}</div></div></div><div class="price">${naira(t.price)}<small> /seat</small></div></div>
    <div class="route"><div>${esc(t.from)}<small>${esc(t.when)}</small></div><div>${esc(t.to)}</div></div>
    <div class="chips"><span class="chip ${t.seats?'good':'bad'}">${t.seats} seat${t.seats===1?'':'s'} left</span>${t.neg?'<span class="chip">Negotiable</span>':'<span class="chip">Fixed price</span>'}</div></div>
  <h3>Trip rules <span class="swipe">Swipe ${ic('arrow',12)}</span></h3>${rail(rules.map(ruleCard).join(''))}
  ${act}</div></div>`;
}
function sendOffer(tripId, amount, existingId){
  const t=trip(tripId); let o;
  if(existingId){ o=offer(existingId); o.round++; o.amount=amount; o.status='pending'; o.msgs.push({w:'me',t:'Offered '+naira(amount)}); }
  else { o={id:S.nextId++,tripId,amount,round:1,status:'pending',msgs:[{w:'me',t:(amount>=t.price?'Requested a seat at ':'Offered ')+naira(amount)}]}; S.offers.unshift(o); }
  S.sheet=null; go('thread',{offerId:o.id}); setTimeout(()=>reply(o.id),2200);
}
function reply(id){
  const o=offer(id); if(!o||o.status!=='pending')return; const t=trip(o.tripId);
  if(o.amount>=t.price*0.92){ o.status='accepted'; o.final=o.amount; o.msgs.push({w:'them',t:'Accepted at '+naira(o.amount)}); }
  else { const c=Math.min(t.price-100,Math.max(r100((o.amount+t.price)/2),o.amount+100)); o.counter=c; o.status='countered'; o.msgs.push({w:'them',t:(o.round>=3?'Final counter at ':'Countered at ')+naira(c)}); }
  toast(t.driver.split(' ')[0]+' replied to your request');
}
function acceptCounter(id){ const o=offer(id); o.final=o.counter; o.status='accepted'; o.msgs.push({w:'me',t:'Accepted '+naira(o.counter)}); render(); }
function declineOffer(id){ const o=offer(id); o.status='declined'; o.msgs.push({w:'me',t:'Declined'}); go('trips'); }
function pay(id){ const o=offer(id), t=trip(o.tripId); o.status='paid'; t.seats=Math.max(0,t.seats-1);
  const b={id:S.nextId++,tripId:t.id,price:o.final,status:'upcoming',code:String(1000+Math.floor(Math.random()*9000))}; S.bookings.unshift(b); S.lastBooking=b.id; go('confirmed',{offerId:id}); }
const statusChip = o => ({pending:['Waiting for driver',''],countered:['Driver countered','promo'],accepted:['Accepted · pay to confirm','good'],paid:['Seat confirmed','good'],declined:['Closed','bad']}[o.status]);
function vThread(){
  const o=offer(S.offerId); if(!o) return vTrips(); const t=trip(o.tripId), [lab,cls]=statusChip(o); let act='';
  if(o.status==='pending') act=`<div class="note">Waiting for ${esc(t.driver.split(' ')[0])} to respond…</div>`;
  if(o.status==='countered') act=`<div class="btns"><button class="btn" onclick="acceptCounter(${o.id})">Accept ${naira(o.counter)}</button>${o.round<3?`<button class="btn ghost" onclick="S.sheet={type:'offer',tripId:${t.id},again:${o.id}};render()">Counter</button>`:''}</div>
    <div class="btns"><button class="btn bad" onclick="declineOffer(${o.id})">Decline</button></div><p class="hint" style="margin-top:8px">Round ${o.round} of 3${o.round>=3?'. This is the driver’s final price.':'.'}</p>`;
  if(o.status==='accepted') act=`<button class="btn" onclick="pay(${o.id})">Pay ${naira(o.final)} to confirm</button><p class="hint" style="margin-top:8px">Held securely and released to the driver after the trip. Free cancellation until 2 hours before departure.</p>`;
  return `<button class="back" onclick="go('trips')">${ic('back',16)} Inbox</button>
  <div class="card"><div class="row between"><div class="name">${esc(t.driver)}</div><span class="chip ${cls}">${lab}</span></div><div class="meta" style="margin-top:4px">${esc(t.from)} → ${esc(t.to)}</div><div class="meta">${esc(t.when)} · Listed ${naira(t.price)}</div></div>
  <div style="margin-top:14px">${o.msgs.map(m=>`<div class="bubble ${m.w}">${esc(m.t)}</div>`).join('')}</div>${act}`;
}
function vConfirmed(){
  const o=offer(S.offerId), t=trip(o.tripId), b=S.bookings.find(x=>x.id===S.lastBooking)||S.bookings[0];
  return `<div class="empty" style="padding-bottom:0"><span class="chip good">Seat confirmed</span><h2 style="margin-top:10px">You’re on the trip</h2></div>
  <div class="card"><div class="route"><div>${esc(t.from)}<small>${esc(t.when)}</small></div><div>${esc(t.to)}</div></div><div class="row between"><span class="meta">${esc(t.driver)} · ${esc(t.car)}</span><b>${naira(o.final)}</b></div></div>
  <div class="label" style="text-align:center">Show this code to the driver at pickup</div><div class="code">${b.code.split('').join(' ')}</div>
  <div class="btns"><button class="btn ghost" onclick="go('trips')">My trips</button><button class="btn" onclick="startTrack(${t.id},'passenger',${b.id})">Track trip</button></div>`;
}
function vTrips(){
  const act=S.ptab==='up', offers=S.offers.filter(o=>!['paid','declined'].includes(o.status));
  const ups=S.bookings.filter(b=>b.status==='upcoming'), past=S.bookings.filter(b=>b.status==='completed');
  const offerCard=o=>{ const t=trip(o.tripId), [lab,cls]=statusChip(o);
    return `<button class="card tap" onclick="go('thread',{offerId:${o.id}})"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><span class="chip ${cls}">${lab}</span></div>
      <div class="meta">${esc(t.driver)} · ${esc(t.when)}</div><div class="meta">Your offer ${naira(o.amount)}${o.status==='countered'?' · Driver countered '+naira(o.counter):''}</div></button>`; };
  const empty=`<div class="empty"><b>Nothing here yet</b>Find a ride and request a seat.</div><button class="btn" onclick="go('find')">Find a ride</button>`;
  const body=act ? ((offers.length||ups.length) ? `${offers.length?`<h3>Offers</h3>${offers.map(offerCard).join('')}`:''}${ups.length?`<h3>Upcoming</h3>${ups.map(bookingCard).join('')}`:''}` : empty) : (past.length?past.map(bookingCard).join(''):empty);
  return `<h2>My trips</h2><div class="tabs2" role="tablist" style="margin-top:8px"><button role="tab" aria-selected="${act}" onclick="S.ptab='up';render()">Active</button><button role="tab" aria-selected="${!act}" onclick="S.ptab='past';render()">Past</button></div>${body}`;
}
/* ---------- tracking (both modes) ---------- */
function startTrack(tripId, role, bid){ stopTrack(); const tr=trip(tripId); tr.live=true; S.track={tripId,role,bid,t:tr.prog||0,arrived:false,picked:[],timer:null}; go('track'); S.track.timer=setInterval(tick,300); }
function stopTrack(){ if(S.track&&S.track.timer){ clearInterval(S.track.timer); S.track.timer=null; } }
const etaText = () => { const T=S.track,t=trip(T.tripId); const m=Math.round((1-T.t)*MINS(t.fromC,t.toC)); return T.arrived?'Arrived':(m<=1?'Arriving now':dur(m)+' left'); };
function tick(){ const T=S.track; if(!T||S.view!=='track'){ stopTrack(); return; } T.t=Math.min(1,T.t+0.012); trip(T.tripId).prog=T.t;
  const m=$('#mapbox'); if(m) m.innerHTML=trackMap(); const e=$('#eta'); if(e) e.textContent=etaText(); const b=$('#prog'); if(b) b.style.width=(T.t*100)+'%';
  if(T.t>=1){ stopTrack(); arrive(); } }
function arrive(){ const T=S.track; T.t=1; T.arrived=true; const t=trip(T.tripId); t.live=false; t.prog=0;
  if(T.role==='passenger'){ const b=S.bookings.find(x=>x.id===T.bid); if(b) b.status='completed'; S.sheet={type:'rate',bid:T.bid,stars:0}; }
  else { t.past=true; t.earned=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted').reduce((s,i)=>s+i.amount,0); t.riders=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted').length; S.earn.week+=t.earned; toast('Trip complete. '+naira(t.earned)+' is on its way to you.'); }
  render(); }
const trackMap = () => { const T=S.track,t=trip(T.tripId); return mapSVG({routes:[{a:t.fromC,b:t.toC,sel:true}],car:T.t}); };
function vTrack(){
  const T=S.track; if(!T) return vTrips(); const t=trip(T.tripId), drv=T.role==='driver';
  const riders=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted');
  return `<button class="back" onclick="go('${drv?'dTrips':'trips'}')">${ic('back',16)} ${drv?'My trips':'Trips'}</button>
  <div class="split"><div class="mapcol">${mapBox(trackMap(),T.arrived?'Trip finished':'Live')}</div><div class="col">
  <div class="card"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><span class="chip ${T.arrived?'':'good'}" id="eta">${etaText()}</span></div>
    <div class="prog"><i id="prog" style="width:${T.t*100}%"></i></div>
    <div class="meta">${drv?esc(S.user.veh.make+' '+S.user.veh.model+' · '+S.user.veh.plate):esc(t.driver)+' · '+esc(t.car)}</div></div>
  ${drv?`<h3>Passengers (${riders.length})</h3>${riders.map(r=>`<div class="card row between"><div class="row"><div class="avatar">${initials(r.name)}</div><div class="name">${esc(r.name)}</div></div><button class="chip" aria-pressed="${T.picked.includes(r.id)}" onclick="togglePick(${r.id},this)">${T.picked.includes(r.id)?'Picked up':'Mark picked up'}</button></div>`).join('')||'<div class="note">No passengers booked.</div>'}
    <button class="btn" ${T.arrived?'disabled':''} onclick="stopTrack();arrive()">End trip</button>`
  :`<div class="label" style="text-align:center">Pickup code</div><div class="code">${(S.bookings.find(b=>b.id===T.bid)||{code:'0000'}).code.split('').join(' ')}</div>
    <div class="btns"><button class="btn ghost" onclick="toast('Demo: a live link would be copied to your clipboard')">${ic('share',16)} Share trip</button><button class="btn bad" onclick="S.sheet={type:'sos'};render()">${ic('sos',16)} SOS</button></div>
    <div class="btns"><button class="btn ghost" onclick="toast('Demo: chat opens here')">${ic('chat',16)} Message driver</button>${T.arrived?'':'<button class="btn ghost" onclick="stopTrack();arrive()">Skip to arrival</button>'}</div>`}
  </div></div>`;
}
function togglePick(id,el){ const p=S.track.picked, i=p.indexOf(id); i>=0?p.splice(i,1):p.push(id); el.setAttribute('aria-pressed',i<0); el.textContent=i<0?'Picked up':'Mark picked up'; }

/* ---------- driver views ---------- */

function incomingCard(i){
  const t=trip(i.tripId); if(!t) return ''; const below=i.amount<t.price; let right='', act='';
  if(i.status==='new'){ right=`<b>${naira(i.amount)}</b>`; const low=t.neg&&t.floor&&i.amount<t.floor;
    act=`<div class="btns"><button class="btn sm" onclick="incomingAct(${i.id},'accept')">Accept</button>${t.neg?`<button class="btn ghost sm" onclick="S.sheet={type:'counter',inc:${i.id}};render()">Counter</button>`:''}<button class="btn bad sm" onclick="incomingAct(${i.id},'decline')">Decline</button></div>${low?`<p class="hint" style="margin-top:6px">Below your lowest price of ${naira(t.floor)}.</p>`:''}`; }
  if(i.status==='accepted') right=`<span class="chip good">Seat filled · ${naira(i.amount)}</span>`;
  if(i.status==='countered') right=`<span class="chip promo">Countered ${naira(i.counter)}</span>`;
  if(i.status==='declined') right=`<span class="chip bad">Declined</span>`;
  return `<div class="card"><div class="row between"><div class="row"><div class="avatar">${initials(i.name)}</div><div><div class="name">${esc(i.name)}</div><div class="meta">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])} · ${below?Math.round((1-i.amount/t.price)*100)+'% below your price':'Full price'}</div></div></div>${right}</div>${act}</div>`;
}
function incomingAct(id,a){ const i=S.incoming.find(x=>x.id===id), t=trip(i.tripId);
  if(a==='accept'){ if(t.seats<1){ toast('No seats left on this trip'); return; } i.status='accepted'; t.seats--; toast(i.name.split(' ')[0]+' is confirmed for this trip'); }
  else i.status='declined'; render(); }

function vDTrips(){
  const up=S.dtab==='up', list=myTrips().filter(t=>up?!t.past:t.past).sort((a,b)=>!!b.live-!!a.live);
  const reqs=S.incoming.filter(i=>(i.status==='new'||i.status==='countered')&&trip(i.tripId)&&!trip(i.tripId).past);
  const card=t=>up?`<div class="card ${t.boosted?'promoted':''}"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div>${t.live?'<span class="chip good">On the way</span>':t.boosted?'<span class="chip promo">Promoted</span>':`<b class="price">${naira(t.price)}</b>`}</div>
      <div class="meta">${esc(t.when)} · ${t.cap-t.seats} of ${t.cap} seats filled</div><div class="prog"><i style="width:${(t.cap-t.seats)/t.cap*100}%"></i></div>
      <div class="btns"><button class="btn sm" onclick="startTrack(${t.id},'driver')">${t.live?'Open live trip':'Start trip'}</button>${t.boosted||t.live?'':`<button class="btn boost sm" onclick="S.sheet={type:'boost',tripId:${t.id}};render()">Boost</button>`}</div></div>`
    :`<div class="card"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><span class="chip good">${naira(t.earned||0)}</span></div><div class="meta">${esc(t.when)} · ${t.riders||0} passengers</div></div>`;
  return `<h2>My trips</h2><div class="tabs2" role="tablist" style="margin-top:8px"><button role="tab" aria-selected="${up}" onclick="S.dtab='up';render()">Active</button><button role="tab" aria-selected="${!up}" onclick="S.dtab='past';render()">Past</button></div>
  ${up?`<div class="hero"><div class="meta">Earned in the last 7 days</div><div class="big">${naira(S.earn.week)}</div></div>`:''}
  ${up&&reqs.length?`<h3>Requests (${reqs.length})</h3>${reqs.map(incomingCard).join('')}`:''}
  ${list.length?`${up?'<h3>Your trips</h3>':''}${list.map(card).join('')}`:`<div class="empty"><b>${up?'No upcoming trips':'No past trips yet'}</b>${up?'Post a trip from the middle button.':'Finished trips show up here.'}</div>`}`;
}
/* post a trip */
const distText = () => S.post.fromC===S.post.toC ? 'Pick two different cities' : '≈ '+Math.round(KM(S.post.fromC,S.post.toC))+' km · about '+dur(MINS(S.post.fromC,S.post.toC));
const postMap = () => mapSVG({routes:S.post.fromC===S.post.toC?[]:[{a:S.post.fromC,b:S.post.toC,sel:true}]});
function updPost(){ const m=$('#mapbox'); if(m) m.innerHTML=postMap(); const d=$('#dist'); if(d) d.textContent=distText(); }
function toggleRule(i,el){ const k=RULES[i].k, a=S.post.rules, j=a.indexOf(k); j>=0?a.splice(j,1):a.push(k); el.setAttribute('aria-pressed',j<0); }
function vPost(){
  const p=S.post, opts=sel=>Object.entries(CITIES).map(([k,c])=>`<option value="${k}" ${k===sel?'selected':''}>${c.n}</option>`).join('');
  return `<div class="split"><div class="mapcol">${mapBox(postMap(),'Route preview')}</div><div class="col">
  <h2>Post a trip</h2><p class="sub" id="dist">${distText()}</p>
  <div class="two"><div class="field"><label for="pfc">From</label><select class="input" id="pfc" onchange="S.post.fromC=this.value;updPost()">${opts(p.fromC)}</select></div>
  <div class="field"><label for="ptc">To</label><select class="input" id="ptc" onchange="S.post.toC=this.value;updPost()">${opts(p.toC)}</select></div></div>
  <div class="two"><div class="field"><label for="pd">Day</label><select class="input" id="pd" onchange="S.post.day=this.value">${['Today','Tomorrow','Fri','Sat','Sun'].map(d=>`<option ${d===p.day?'selected':''}>${d}</option>`).join('')}</select></div>
  <div class="field"><label for="ptm">Time</label><input class="input" id="ptm" type="time" value="${p.time}" onchange="S.post.time=this.value"></div></div>
  <div class="two"><div class="field"><span class="label">Seats</span><div class="stepper"><button aria-label="Fewer seats" onclick="S.post.seats=Math.max(1,S.post.seats-1);render()">−</button><b>${p.seats}</b><button aria-label="More seats" onclick="S.post.seats=Math.min(S.user.veh.seats||4,S.post.seats+1);render()">+</button></div></div>
  <div class="field"><label for="pp">Price per seat (₦)</label><input class="input" id="pp" type="number" inputmode="numeric" value="${p.price}" oninput="S.post.price=+this.value"></div></div>
  <div class="toggle"><div><div class="name">Allow offers</div><div class="hint">Passengers can negotiate your price.</div></div><button class="switch" aria-pressed="${p.neg}" aria-label="Allow offers" onclick="S.post.neg=!S.post.neg;render()"></button></div>
  ${p.neg?`<div class="field"><label for="pfl">Lowest price you accept (₦)</label><input class="input" id="pfl" type="number" inputmode="numeric" value="${p.floor}" oninput="S.post.floor=+this.value"></div>`:''}
  <h3>Trip rules <span class="swipe">Swipe ${ic('arrow',12)}</span></h3>
  ${rail(RULES.map((r,i)=>`<button class="rule" aria-pressed="${p.rules.includes(r.k)}" onclick="toggleRule(${i},this)"><span class="ico">${ic(r.ic,18)}</span><div><b>${esc(r.k)}</b><span class="d">${esc(r.d)}</span></div></button>`).join(''))}
  <button class="btn" onclick="publish()">Publish trip</button></div></div>`;
}
function publish(){
  const p=S.post; if(p.fromC===p.toC){ toast('Pick two different cities'); return; } if(!(p.price>0)){ toast('Add a price per seat'); return; }
  const t={id:S.nextId++,mine:true,driver:'You',rating:4.9,count:42,fromC:p.fromC,toC:p.toC,from:CITIES[p.fromC].n,to:CITIES[p.toC].n,
    when:p.day+' · '+to12(p.time),seats:p.seats,cap:p.seats,price:p.price,neg:p.neg,floor:p.floor,boosted:false,car:S.user.veh.make+' '+S.user.veh.model+', '+(S.user.veh.color||'').toLowerCase(),rules:p.rules.length?[...p.rules]:[]};
  S.trips.push(t); S.dtab='up'; go('dTrips'); toast('Trip published. Passengers can request seats now.');
}

/* ---------- profile ---------- */
function vProfile(){
  const u=S.user, d=S.mode==='driver', other=d?'passenger':'driver';
  return `<div class="card center" style="padding:16px"><div class="avatar lg" style="margin:0 auto 8px">${esc(initials(u.name))}</div><div class="name" style="font-size:16px">${esc(u.name||'Your name')}</div><div class="meta">★ 4.9${u.driverVerified?' · Verified driver':''}</div></div>
  <div class="card">
  ${d?`<div class="listrow"><span class="ico">${ic('car',16)}</span><div class="grow"><div class="name">${esc(u.veh.make+' '+u.veh.model)}</div><div class="meta">${esc(u.veh.plate)}</div></div></div>`
     :`<button class="listrow" onclick="toast('Demo: you would add a contact here')"><span class="ico">${ic('shield',16)}</span><div class="grow"><div class="name">Emergency contact</div><div class="meta">${u.em&&u.em.name?esc(u.em.name):'Add a contact for SOS and Share trip'}</div></div></button>`}
  <button class="listrow" onclick="setMode('${other}')"><span class="ico">${ic('swap',16)}</span><div class="grow"><div class="name">Switch to ${other} mode</div><div class="meta">${other==='driver'&&!u.driverVerified?'Verify your licence and vehicle first':'Same account, different view'}</div></div></button>
  <button class="listrow" onclick="startOnb()"><span class="ico">${ic('logout',16)}</span><div class="grow"><div class="name">Sign out</div></div></button></div>`;
}
/* ---------- sheets ---------- */
function sheetHTML(){
  const s=S.sheet; if(!s) return '';
  if(s.type==='offer'){ const t=trip(s.tripId), o=s.again?offer(s.again):null, start=o?o.counter:r100(t.price*0.85);
    return `<div class="sheet" role="dialog" aria-label="Make an offer"><h2>${o?'Counter the driver':'Make an offer'}</h2><p class="sub">Listed price ${naira(t.price)} per seat. The driver can accept, counter or decline.</p>
      <div class="field"><label for="oa">Your price (₦)</label><input class="input" id="oa" type="number" inputmode="numeric" value="${start}"></div>
      ${rail([5,10,15,20].map(p=>`<button class="chip" onclick="$('#oa').value=${r100(t.price*(1-p/100))}">−${p}%</button>`).join(''))}
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Cancel</button><button class="btn" onclick="submitOffer(${t.id},${s.again||0})">Send offer</button></div></div>`; }
  if(s.type==='counter'){ const i=S.incoming.find(x=>x.id===s.inc), t=trip(i.tripId);
    return `<div class="sheet" role="dialog" aria-label="Counter offer"><h2>Counter ${esc(i.name.split(' ')[0])}</h2><p class="sub">They offered ${naira(i.amount)}. Your listed price is ${naira(t.price)}.</p>
      <div class="field"><label for="oa">Your counter (₦)</label><input class="input" id="oa" type="number" inputmode="numeric" value="${r100((i.amount+t.price)/2)}"></div>
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Cancel</button><button class="btn" onclick="submitCounter(${i.id})">Send counter</button></div></div>`; }
  if(s.type==='boost'){ const plans=[['3 hours',1000],['12 hours',2500],['24 hours',4000]];
    return `<div class="sheet" role="dialog" aria-label="Boost your trip"><h2>Boost your trip</h2><p class="sub">Your trip moves to the top of search for people on your route, marked Promoted.</p>
      ${plans.map((p,i)=>`<button class="plan" aria-pressed="${S.plan===i}" onclick="S.plan=${i};render()"><span><b>${p[0]}</b><br><span class="hint">Top of results on your route</span></span><span class="price">${naira(p[1])}</span></button>`).join('')}
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Not now</button><button class="btn boost" onclick="buyBoost(${s.tripId})">Pay ${naira(plans[S.plan][1])}</button></div><p class="hint" style="margin-top:10px">Prototype only. No payment is taken.</p></div>`; }
  if(s.type==='rate'){ const b=S.bookings.find(x=>x.id===s.bid), t=b&&trip(b.tripId);
    return `<div class="sheet" role="dialog" aria-label="Rate your trip"><div class="center"><h2>How was your trip?</h2><p class="sub">${t?'With '+esc(t.driver):''}</p>
      <div class="stars">${[1,2,3,4,5].map(n=>`<button class="${n<=s.stars?'on':''}" aria-label="${n} star${n>1?'s':''}" onclick="S.sheet.stars=${n};render()">${ic('star',32)}</button>`).join('')}</div></div>
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Later</button><button class="btn" ${s.stars?'':'disabled'} onclick="submitRate(${s.bid})">Submit rating</button></div></div>`; }
  if(s.type==='sos') return `<div class="sheet" role="dialog" aria-label="Emergency"><h2>Emergency help</h2><p class="sub">Demo only. In the live app these actions work.</p>
      <div class="btns" style="flex-direction:column"><button class="btn bad" onclick="S.sheet=null;toast('Demo: this would call 112')">Call 112</button><button class="btn ghost" onclick="S.sheet=null;toast('Demo: your emergency contact would be alerted')">Alert my emergency contact</button><button class="btn ghost" onclick="S.sheet=null;toast('Demo: live location would be shared')">Share live location</button><button class="btn ghost" onclick="S.sheet=null;render()">Close</button></div></div>`;
  return '';
}
function submitOffer(tripId, again){ const v=+$('#oa').value, t=trip(tripId); if(!(v>0)){ toast('Enter an amount'); return; } if(v>t.price){ toast('Offer is above the listed price. Use the listed price instead.'); return; } sendOffer(tripId,v,again||undefined); }
function submitCounter(id){ const v=+$('#oa').value, i=S.incoming.find(x=>x.id===id), t=trip(i.tripId); if(!(v>0)){ toast('Enter an amount'); return; }
  i.status='countered'; i.counter=v; S.sheet=null; render();
  setTimeout(()=>{ if(i.status==='countered'){ i.status='accepted'; i.amount=v; if(t.seats>0) t.seats--; toast(i.name.split(' ')[0]+' accepted '+naira(v)); } },2200); }
function buyBoost(id){ const t=trip(id), plans=['3 hours','12 hours','24 hours']; t.boosted=true; t.boost=plans[S.plan]; S.sheet=null; render(); toast('Boost is live. You are first in search.'); }
function submitRate(bid){ const b=S.bookings.find(x=>x.id===bid); if(b) b.rated=true; S.sheet=null; render(); toast('Thanks. Your rating helps other riders.'); }

/* ---------- shell: header, tabs, render ---------- */
function renderHeader(){
  $('#hdr').innerHTML=`<div class="logo"><i></i><h1>RideLink</h1></div>
  <div class="seg" role="tablist" aria-label="Mode" data-m="${S.mode}"><span class="thumb"></span>
    <button role="tab" aria-selected="${S.mode==='passenger'}" onclick="setMode('passenger')">${ic('profile',14)}<span class="l1">Passenger</span><span class="l2">Ride</span></button>
    <button role="tab" aria-selected="${S.mode==='driver'}" onclick="setMode('driver')">${ic('car',14)}<span class="l1">Driver</span><span class="l2">Drive</span></button></div>
  <button class="me" onclick="go('profile')" aria-label="Profile">${esc(initials(S.user.name))}</button>`;
}
const TABS = {
  passenger:[['trips','Trips','trips'],['find','Find a ride','find'],['profile','Profile','profile']],
  driver:[['dTrips','Trips','trips'],['post','Post a trip','post'],['profile','Profile','profile']]
};
function renderTabs(){
  const sub={detail:'find',thread:'trips',confirmed:'trips',track:S.mode==='driver'?'dTrips':'trips'}, cur=sub[S.view]||S.view, n=unread();
  $('#tabs').innerHTML=TABS[S.mode].map(([k,l,icn],idx)=> idx===1
    ? `<button class="fab" onclick="go('${k}')" ${cur===k?'aria-current="page"':''}><span class="disc">${ic(icn,24)}</span>${l}</button>`
    : `<button class="t" ${cur===k?'aria-current="page"':''} onclick="go('${k}')">${ic(icn,21)}${l}${idx===0&&n&&cur!==k?'<span class="dot" aria-label="New activity"></span>':''}</button>`).join('');
}
const VIEWS = {find:vFind,detail:vDetail,thread:vThread,confirmed:vConfirmed,trips:vTrips,track:vTrack,profile:vProfile,post:vPost,dTrips:vDTrips};
function render(){
  const ph=$('#phone'); ph.dataset.mode=S.mode; ph.classList.toggle('onb',S.onbOn);
  const sc=$('#screen'), top=sc.scrollTop;
  sc.innerHTML=S.onbOn?vOnb():(VIEWS[S.view]||vFind)(); sc.scrollTop=top;
  if(!S.onbOn){ renderHeader(); renderTabs(); }
  ph.querySelectorAll('.backdrop,.toast').forEach(e=>e.remove());
  if(S.sheet&&!S.onbOn){ const b=document.createElement('div'); b.className='backdrop'; b.innerHTML=sheetHTML(); b.addEventListener('click',e=>{ if(e.target===b){ S.sheet=null; render(); } }); ph.appendChild(b); }
  if(S.toast){ const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=S.toast; ph.appendChild(t); }
}

/* ---------- device preview (iPhone, folded, unfolded) ---------- */
const DEVICES = {iphone:{n:'iPhone',w:390,h:844},cover:{n:'Fold · folded',w:280,h:653},open:{n:'Fold · open',w:700,h:760}};
function renderDevbar(){ $('#devbar').innerHTML=Object.entries(DEVICES).map(([k,d])=>`<button aria-pressed="${S.dev===k}" onclick="setDevice('${k}')">${d.n}</button>`).join(''); }
function setDevice(k){ S.dev=k; const d=DEVICES[k], p=$('#phone'); p.className='phone dev-'+k+(S.onbOn?' onb':''); p.style.width=d.w+'px'; p.style.height=d.h+'px'; renderDevbar(); fit(); render(); }
function fit(){
  const bare=innerWidth<=520||matchMedia('(pointer:coarse)').matches; document.body.classList.toggle('bare',bare);
  const d=DEVICES[S.dev], p=$('#phone');
  p.style.transform=bare?'':'scale('+Math.min(1,(innerHeight-96)/d.h,(innerWidth-48)/d.w)+')';
}
addEventListener('resize',fit);
let lastBand=''; new ResizeObserver(()=>{ const w=$('#phone').clientWidth, band=(w>=600)+'|'+(w<=340); if(band!==lastBand){ lastBand=band; render(); } }).observe($('#phone'));

/* mouse drag for swipeable rails (touch swipes natively) */
let drag=null, dragUntil=0;
document.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse')return; const r=e.target.closest('.rail'); if(r) drag={r,x:e.clientX,sl:r.scrollLeft,moved:false}; });
document.addEventListener('pointermove',e=>{ if(!drag)return; const dx=e.clientX-drag.x; if(Math.abs(dx)>5){ drag.moved=true; drag.r.classList.add('drag'); } if(drag.moved) drag.r.scrollLeft=drag.sl-dx; });
addEventListener('pointerup',()=>{ if(drag){ drag.r.classList.remove('drag'); if(drag.moved) dragUntil=Date.now()+60; drag=null; } });
document.addEventListener('click',e=>{ if(Date.now()<dragUntil){ e.stopPropagation(); e.preventDefault(); } },true);

setDevice('iphone');
