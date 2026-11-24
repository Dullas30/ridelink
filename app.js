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
  swap:'<path d="M5 8h13l-3-3M19 16H6l3 3"/>',
  filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.9 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  chev:'<path d="M9 6l6 6-6 6"/>',
  locate:'<circle cx="12" cy="12" r="3.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/><circle cx="12" cy="12" r="7.5"/>',
  bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.4"/>',
  doc:'<path d="M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6"/>',
  card:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h4"/>',
  edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  phone:'<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'
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
/* Abuja districts (we launch in Abuja first) */
const AREAS = {'Kubwa':[9.155,7.322],'Gwarinpa':[9.105,7.405],'Wuse 2':[9.079,7.474],'Wuse':[9.064,7.466],'Central Business District':[9.054,7.489],'Maitama':[9.088,7.497],'Garki':[9.033,7.489],
  'Lugbe':[8.977,7.360],'Nyanya':[9.010,7.570],'Jabi':[9.072,7.428],'Asokoro':[9.042,7.520],'Lokogoma':[8.990,7.450],'Life Camp':[9.080,7.392],'Utako':[9.071,7.441],'Area 1':[9.034,7.470],'Karu':[9.010,7.590],'Dutse':[9.140,7.400],'Apo':[8.985,7.497],'Berger':[9.060,7.448],'Banex':[9.083,7.468],'Airport':[9.007,7.263]};
const areaLL = name => { const k=Object.keys(AREAS).find(a=>String(name||'').toLowerCase().includes(a.toLowerCase())); return k?{lat:AREAS[k][0],lng:AREAS[k][1]}:null; };
const hav = (A,B) => { const d=Math.PI/180, x=(B.lat-A.lat)*d, y=(B.lng-A.lng)*d, h=Math.sin(x/2)**2+Math.cos(A.lat*d)*Math.cos(B.lat*d)*Math.sin(y/2)**2; return 12742*Math.asin(Math.sqrt(h)); };
const endLL = (side,c,area) => areaLL(area)||(c&&CITIES[c]?{lat:CITIES[c].lat,lng:CITIES[c].lon}:null);
const routeKm = (c1,a1,c2,a2) => { if(c1!==c2) return KM(c1,c2); const A=endLL(0,c1,a1),B=endLL(1,c2,a2); return A&&B?Math.max(1,hav(A,B)*1.35):8; };
const routeMins = (c1,a1,c2,a2) => { const k=routeKm(c1,a1,c2,a2); return Math.round(c1===c2?k/35*60+5:k/75*60); };
const tKm = t => routeKm(t.fromC,t.from.split(' · ')[1],t.toC,t.to.split(' · ')[1]);
const tMins = t => routeMins(t.fromC,t.from.split(' · ')[1],t.toC,t.to.split(' · ')[1]);
const dur = m => m<60 ? m+' min' : Math.floor(m/60)+'h '+String(m%60).padStart(2,'0')+'m';
const isWide = () => ($('#phone')||{clientWidth:390}).clientWidth >= 600;

/* ---------- state ---------- */
const S = {
  onbOn:true, mode:'passenger', view:'find', dev:'iphone',
  user:{name:'Ibrahim Abdulrahman',phone:'0803 123 4567',email:'',photo:null,since:'Mar 2025',roles:['passenger','driver'],driverVerified:true,
    veh:{make:'Toyota',model:'Camry',color:'Silver',plate:'ABJ 482 KD',seats:3},em:{name:'Aisha A.',phone:'0803 000 0000'},
    notif:true,autoShare:true,places:{home:'Wuse 2, Abuja',work:'Central Business District, Abuja'},
    pStats:{trips:23,rating:4.9,saved:18400},dStats:{trips:42,rating:4.9,accept:96},bank:'GTBank · •••• 4821',offersOn:true},
  onb:{step:'splash',only:null,roles:['passenger'],phone:'',name:'',nin:'',licNo:'',skipped:false,docs:{lic:null,selfie:null,carFront:null,carBack:null,carIn:null,papers:null},veh:{make:'',model:'',color:'',plate:'',seats:3}},
  from:'Abuja', to:'', fromTxt:'', toTxt:'', fromPl:null, toPl:null, fromTyped:false, loc:null, filters:[], maxPrice:0, sort:'best', selTrip:null, reqId:null, sel:null, offerId:null, sheet:null, plan:1, toast:null,
  ptab:'up', dtab:'up', track:null, lastBooking:null, nextId:100,
  trips:[
    {id:21,driver:'Chidi Nwosu',rating:4.9,count:156,fromC:'abuja',toC:'abuja',from:'Abuja · Kubwa',to:'Abuja · Central Business District',when:'Today · 7:15 AM',seats:3,cap:4,price:1500,neg:true,boosted:true,car:'Toyota Corolla, white',rules:['AC','Quiet ride','Set pickup points']},
    {id:22,driver:'Zainab Yusuf',rating:4.8,count:73,fromC:'abuja',toC:'abuja',from:'Abuja · Gwarinpa',to:'Abuja · Wuse 2',when:'Today · 7:45 AM',seats:2,cap:3,price:1200,neg:true,car:'Honda Civic, grey',rules:['AC','Women only']},
    {id:23,driver:'Emeka Obi',rating:4.7,count:58,fromC:'abuja',toC:'abuja',from:'Abuja · Lugbe',to:'Abuja · Maitama',when:'Today · 8:00 AM',seats:3,cap:4,price:1800,neg:true,car:'Toyota Camry, black',rules:['AC','Luggage ok']},
    {id:24,driver:'Aliyu Sani',rating:4.9,count:201,fromC:'abuja',toC:'abuja',from:'Abuja · Nyanya',to:'Abuja · Garki',when:'Today · 6:50 AM',seats:2,cap:4,price:1000,neg:false,car:'Kia Rio, red',rules:['No smoking']},
    {id:25,driver:'Grace Adamu',rating:4.8,count:94,fromC:'abuja',toC:'abuja',from:'Abuja · Jabi',to:'Abuja · Asokoro',when:'Today · 5:30 PM',seats:3,cap:3,price:1300,neg:true,car:'Hyundai Elantra, blue',rules:['AC','Quiet ride']},
    {id:26,driver:'Musa Bello',rating:4.6,count:37,fromC:'abuja',toC:'abuja',from:'Abuja · Lokogoma',to:'Abuja · Utako',when:'Tomorrow · 7:30 AM',seats:2,cap:3,price:1100,neg:true,car:'Toyota Corolla, silver',rules:['AC','Luggage ok']},
    {id:1,driver:'Musa Abdullahi',rating:4.9,count:128,fromC:'abuja',toC:'kaduna',from:'Abuja · Wuse 2',to:'Kaduna · Barnawa',when:'Tomorrow · 7:00 AM',seats:3,cap:3,price:6500,neg:true,boosted:true,car:'Toyota Camry, silver',rules:['AC','Luggage ok','No smoking']},
    {id:2,driver:'Amina Bello',rating:4.8,count:64,fromC:'abuja',toC:'kaduna',from:'Abuja · Gwarinpa',to:'Kaduna · Sabon Tasha',when:'Tomorrow · 8:30 AM',seats:2,cap:3,price:7000,neg:true,car:'Honda Accord, black',rules:['AC','Women only','Quiet ride']},
    {id:3,driver:'Tunde Okafor',rating:4.7,count:41,fromC:'abuja',toC:'lokoja',from:'Abuja · Lugbe',to:'Lokoja · Ganaja',when:'Today · 4:00 PM',seats:2,cap:3,price:5000,neg:true,car:'Toyota Corolla, white',rules:['AC','Luggage ok','Set pickup points']},
    {id:4,driver:'Seun Adeyemi',rating:4.9,count:210,fromC:'lagos',toC:'ibadan',from:'Lagos · Ikeja',to:'Ibadan · Challenge',when:'Today · 5:30 PM',seats:2,cap:3,price:4500,neg:true,car:'Lexus RX, grey',rules:['AC','No smoking','No pets']},
    {id:5,driver:'Ibrahim Lawal',rating:4.6,count:19,fromC:'abuja',toC:'kaduna',from:'Abuja · Kubwa',to:'Kaduna · Kawo',when:'Fri · 6:00 AM',seats:1,cap:3,price:6000,neg:false,car:'Toyota Avensis, blue',rules:['No smoking','Set pickup points']},
    {id:6,driver:'Hauwa Garba',rating:4.8,count:87,fromC:'kaduna',toC:'abuja',from:'Kaduna · Rigasa',to:'Abuja · Jabi',when:'Tomorrow · 3:00 PM',seats:3,cap:3,price:6500,neg:true,car:'Kia Cerato, red',rules:['AC','Luggage ok','Quiet ride']},
    {id:7,mine:true,driver:'You',rating:4.9,count:42,fromC:'abuja',toC:'abuja',from:'Abuja · Kubwa',to:'Abuja · Central Business District',when:'Tomorrow · 7:00 AM',seats:2,cap:3,price:1500,neg:true,floor:1200,boosted:false,car:'Toyota Camry, silver',rules:['AC','Luggage ok']},
    {id:8,past:true,driver:'Hauwa Garba',rating:4.8,count:87,fromC:'kaduna',toC:'abuja',from:'Kaduna · Rigasa',to:'Abuja · Jabi',when:'Fri 14 Nov · 3:00 PM',seats:0,cap:3,price:6500,neg:true,car:'Kia Cerato, red',rules:['AC']},
    {id:9,past:true,mine:true,driver:'You',rating:4.9,count:42,fromC:'abuja',toC:'jos',from:'Abuja · Wuse 2',to:'Jos · Terminus',when:'Sun 16 Nov · 8:00 AM',seats:0,cap:3,price:7500,neg:true,car:'Toyota Camry, silver',rules:['AC'],earned:22500,riders:3,
      pax:[{name:'Chinedu Okeke',amount:7500},{name:'Amaka Eze',amount:7500},{name:'Bala Musa',amount:7500}],rated:4.9},
    {id:10,past:true,mine:true,driver:'You',rating:4.9,count:42,fromC:'kaduna',toC:'abuja',from:'Kaduna · Barnawa',to:'Abuja · Wuse 2',when:'Thu 13 Nov · 4:00 PM',seats:1,cap:3,price:6500,neg:true,car:'Toyota Camry, silver',rules:['AC','Luggage ok'],earned:12500,riders:2,
      pax:[{name:'Fatima Sani',amount:6500},{name:'Ifeanyi Obi',amount:6000}],rated:5}
  ],
  offers:[],
  bookings:[],
  incoming:[
    {id:1,tripId:7,name:'Chinedu Okeke',amount:1300,status:'new',rating:4.7,trips:31,since:'2024',pickup:'Kubwa Village junction',drop:'Federal Secretariat',bag:'1 small bag',note:'I can be at the gate 10 minutes early.',review:'Polite and on time. — Musa A.'},
    {id:2,tripId:7,name:'Fatima Sani',amount:1500,status:'new',rating:4.9,trips:12,since:'2025',pickup:'NNPC filling station, Kubwa',drop:'Ministry of Finance',bag:'No luggage',note:'',review:'Easy passenger, ready at pickup. — Amina B.'},
    {id:3,tripId:7,name:'Yusuf Danjuma',amount:1500,status:'accepted',rating:4.8,trips:58,since:'2023',pickup:'Phase 4, Kubwa',drop:'Central Bank',bag:'1 suitcase',note:'',review:''}
  ],
  post:{fromC:'abuja',toC:'abuja',fromA:'Kubwa',toA:'Central Business District',day:'Tomorrow',time:'07:00',seats:3,price:1500,neg:true,floor:1200,rules:['AC','Luggage ok']},
  earn:{today:8000,week:48500,month:186000,all:1240000}, earnP:'week', hideBal:false,
  reviews:[{n:'Chinedu O.',s:5,t:'Smooth driving and left right on time.'},{n:'Amaka E.',s:5,t:'Clean car, cold AC, helped with my bag.'},{n:'Bala M.',s:4,t:'Good trip. Pickup spot was easy to find.'}]
};
try{ S.hideBal=localStorage.getItem('rl_hideBal')==='1'; }catch(e){}
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

/* ---------- live map ----------
   'google' : Google Maps (key in config.js), styled to match RideLink. Routes, Places and Geocoding APIs.
   'osm'    : no key needed: OpenStreetMap streets styled to match RideLink, OSRM for road routes, Photon for place search.
   'svg'    : the drawn preview above, used only where a page may not load map tiles (for example the shared preview link).
   Your position comes from the phone's GPS and updates as you move (the pulsing dot). Maps sit in #maplayer and are moved
   over their slot after each render, so they never reload when the screen redraws. */
const CFG=window.RIDELINK_CONFIG||{}, GKEY=String(CFG.GOOGLE_MAPS_API_KEY||'').trim();
let MAPMODE=GKEY?'google':'embed', gReady=false;  /* embed = free Google map, no key */
const MAPS={}, mapEls=new Map(), geoCache={};
const NG_BBOX='2.6,4.2,14.7,13.9';
const LLc=c=>({lat:c.lat,lng:c.lon});
const place=(area,city)=>[area,city].filter(x=>x&&String(x).trim()).join(', ')+(area||city?', Nigeria':'');
const cityKey=n=>Object.keys(CITIES).find(k=>CITIES[k].n.toLowerCase()===String(n||'').trim().toLowerCase())||null;
const nearestCity=ll=>{ let best='abuja',bd=1e9; Object.entries(CITIES).forEach(([k,c])=>{ const d=(c.lat-ll.lat)**2+(c.lon-ll.lng)**2; if(d<bd){bd=d;best=k;} }); return best; };
/* which of our cities a place belongs to (FCT counts as Abuja) */
const cityOf=(parts,ll)=>{ const txt=parts.filter(Boolean).join(' ').toLowerCase(); if(/federal capital|\bfct\b|abuja/.test(txt)) return 'Abuja';
  const k=Object.keys(CITIES).find(k=>txt.includes(CITIES[k].n.toLowerCase())); return k?CITIES[k].n:(ll?CITIES[nearestCity(ll)].n:''); };
const tripPlaces=t=>{ const [c1,a1]=t.from.split(' · '), [c2,a2]=t.to.split(' · '); return {a:place(a1,c1),b:place(a2,c2),aLL:t.fromLL||areaLL(a1)||null,bLL:t.toLL||areaLL(a2)||null,ac:t.fromC,bc:t.toC}; };
const llKey=ll=>ll?ll.lat.toFixed(4)+','+ll.lng.toFixed(4):'';
const mapKey=sp=>(sp.aLL?llKey(sp.aLL):sp.a||'')+'|'+(sp.bLL?llKey(sp.bLL):sp.b||'');
function gmap(sp, tag){
  if(MAPMODE==='svg') return mapBox(mapSVG({routes:sp.ac&&sp.bc&&sp.ac!==sp.bc?[{a:sp.ac,b:sp.bc,sel:true}]:[],car:sp.car}), tag||'Map preview');
  const k=mapKey(sp)+(sp.live?'|live':''); MAPS[k]=Object.assign(MAPS[k]||{},sp);
  const showTag=tag&&!(MAPMODE==='embed'&&!sp.live);
  return `<div class="map g"><div class="gslot" data-key="${esc(k)}"></div>${showTag?`<span class="maptag">${esc(tag)}</span>`:''}</div>`;
}
const gmDir=(to,from)=>'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination='+encodeURIComponent(to)+(from?'&origin='+encodeURIComponent(from):'');
const gmBtn=(label,to,from)=>`<a class="btn ghost gmlink" href="${gmDir(to,from)}" target="_blank" rel="noopener">${ic('pin',16)} ${label}</a>`;
const brandCol=()=>getComputedStyle($('#phone')).getPropertyValue('--brand').trim()||'#0a5c4a';
/* --- map adapters: same small interface for Google and Leaflet --- */
const GSTYLE=[{elementType:'geometry',stylers:[{color:'#eef2f0'}]},{elementType:'labels.icon',stylers:[{visibility:'off'}]},{elementType:'labels.text.fill',stylers:[{color:'#5b6a64'}]},{elementType:'labels.text.stroke',stylers:[{color:'#f7faf8'}]},
  {featureType:'poi',stylers:[{visibility:'off'}]},{featureType:'transit',stylers:[{visibility:'off'}]},{featureType:'road',elementType:'geometry',stylers:[{color:'#ffffff'}]},
  {featureType:'road.highway',elementType:'geometry',stylers:[{color:'#dde7e2'}]},{featureType:'road.arterial',elementType:'labels',stylers:[{visibility:'simplified'}]},{featureType:'landscape.natural',stylers:[{color:'#e4ede8'}]},{featureType:'water',stylers:[{color:'#cfe2e8'}]},{featureType:'administrative',elementType:'geometry.stroke',stylers:[{color:'#c9d6d0'}]}];
function gAdapter(el){
  const map=new google.maps.Map(el,{center:{lat:9.07,lng:7.48},zoom:11,disableDefaultUI:true,gestureHandling:'greedy',clickableIcons:false,styles:GSTYLE,backgroundColor:'#eef2f0'});
  const P=p=>({lat:p.lat,lng:p.lng}); let user,acc,car;
  return { view:(ll,z)=>{ map.setCenter(P(ll)); map.setZoom(z); }, fit:pts=>{ const b=new google.maps.LatLngBounds(); pts.forEach(p=>b.extend(P(p))); map.fitBounds(b,36); },
    line:(path,col)=>{ new google.maps.Polyline({map,path:path.map(P),strokeColor:'#ffffff',strokeWeight:9,zIndex:1}); new google.maps.Polyline({map,path:path.map(P),strokeColor:col,strokeWeight:5,zIndex:2}); },
    pin:(ll,fill,col)=>new google.maps.Marker({map,position:P(ll),zIndex:5,icon:{path:google.maps.SymbolPath.CIRCLE,scale:6.5,fillColor:fill,fillOpacity:1,strokeColor:col,strokeWeight:3}}),
    user:ll=>{ if(!user){ acc=new google.maps.Circle({map,center:P(ll),radius:ll.acc||30,strokeOpacity:0,fillColor:'#2f80ed',fillOpacity:.12,clickable:false});
        user=new google.maps.Marker({map,position:P(ll),zIndex:9,clickable:false,icon:{path:google.maps.SymbolPath.CIRCLE,scale:8,fillColor:'#2f80ed',fillOpacity:1,strokeColor:'#fff',strokeWeight:3}}); }
      else { user.setPosition(P(ll)); acc.setCenter(P(ll)); acc.setRadius(ll.acc||30); } },
    car:(ll,rot,col)=>{ const icon={path:google.maps.SymbolPath.FORWARD_CLOSED_ARROW,scale:6,fillColor:col,fillOpacity:1,strokeColor:'#fff',strokeWeight:2,rotation:rot};
      if(!car) car=new google.maps.Marker({map,position:P(ll),zIndex:8,icon}); else { car.setPosition(P(ll)); car.setIcon(icon); } },
    pan:(ll,z)=>{ map.panTo(P(ll)); if(z) map.setZoom(z); }, onDrag:cb=>map.addListener('dragstart',cb), resize:()=>{}, center:()=>{ const c=map.getCenter(); return {lat:c.lat(),lng:c.lng()}; }, onIdle:cb=>map.addListener('idle',cb) };
}
function lAdapter(el){
  const map=L.map(el,{zoomControl:false,attributionControl:true,zoomSnap:1}).setView([9.07,7.48],11);
  map.attributionControl.setPrefix(false);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
  const A=p=>[p.lat,p.lng]; let user,acc,car;
  const carIcon=(rot,col)=>L.divIcon({className:'lcar',iconSize:[26,26],html:`<svg viewBox="0 0 26 26" style="transform:rotate(${rot}deg)"><path d="M13 2l8 20-8-5-8 5z" fill="${col}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`});
  return { view:(ll,z)=>map.setView(A(ll),z), fit:pts=>map.fitBounds(pts.map(A),{padding:[28,28]}),
    line:(path,col)=>{ L.polyline(path.map(A),{color:'#fff',weight:9,opacity:1,interactive:false}).addTo(map); L.polyline(path.map(A),{color:col,weight:5,opacity:1,interactive:false}).addTo(map); },
    pin:(ll,fill,col)=>L.circleMarker(A(ll),{radius:6.5,color:col,weight:3,fillColor:fill,fillOpacity:1,interactive:false}).addTo(map),
    user:ll=>{ if(!user){ acc=L.circle(A(ll),{radius:ll.acc||30,stroke:false,fillColor:'#2f80ed',fillOpacity:.12,interactive:false}).addTo(map);
        user=L.marker(A(ll),{icon:L.divIcon({className:'udot',iconSize:[20,20],html:'<i></i>'}),interactive:false,zIndexOffset:900}).addTo(map); }
      else { user.setLatLng(A(ll)); acc.setLatLng(A(ll)); acc.setRadius(ll.acc||30); } },
    car:(ll,rot,col)=>{ if(!car) car=L.marker(A(ll),{icon:carIcon(rot,col),interactive:false,zIndexOffset:800}).addTo(map); else { car.setLatLng(A(ll)); car.setIcon(carIcon(rot,col)); } },
    pan:(ll,z)=>map.setView(A(ll),z||map.getZoom(),{animate:true}), onDrag:cb=>map.on('dragstart',cb), resize:()=>map.invalidateSize(), center:()=>{ const c=map.getCenter(); return {lat:c.lat,lng:c.lng}; }, onIdle:cb=>map.on('moveend',cb) };
}
/* --- places: search, coordinates, address for a GPS point --- */
async function geocode(q){
  if(!q) return null; if(q in geoCache) return geoCache[q]; let r=null;
  try{ if(MAPMODE==='google'){ const res=await new google.maps.Geocoder().geocode({address:q,region:'ng'}); const l=res.results[0].geometry.location; r={lat:l.lat(),lng:l.lng()}; }
    else { const qq=encodeURIComponent(q.replace(/, Nigeria$/,'')); for(const bb of ['6.70,8.40,7.90,9.60',NG_BBOX]){
        const j=await (await fetch('https://photon.komoot.io/api/?limit=1&lang=en&lat=9.06&lon=7.49&bbox='+bb+'&q='+qq)).json(); const f=j.features&&j.features[0];
        if(f){ r={lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0]}; break; } } } }catch(e){}
  return geoCache[q]=r;
}
async function reverseStreet(ll){
  try{ if(MAPMODE==='google'){ const res=await new google.maps.Geocoder().geocode({location:{lat:ll.lat,lng:ll.lng}}); const r=res.results[0];
      const g=t=>(r.address_components.find(c=>c.types.includes(t))||{}).long_name;
      return {label:[g('street_number')&&g('route')?g('street_number')+' '+g('route'):g('route')||g('premise'),g('neighborhood')||g('sublocality')].filter(Boolean).join(', ')||r.formatted_address.split(',').slice(0,2).join(','),city:cityOf([g('locality'),g('administrative_area_level_1')],ll)}; }
    const j=await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=18&addressdetails=1&lat=${ll.lat}&lon=${ll.lng}`)).json(); const a=j.address||{};
    const street=[a.house_number,a.road].filter(Boolean).join(' ')||a.pedestrian||a.amenity||j.name;
    return {label:[street,a.suburb||a.neighbourhood||a.quarter||a.village||a.city_district].filter((v,i,x)=>v&&x.indexOf(v)===i).join(', ')||'Pinned spot',city:cityOf([a.city,a.county,a.state],ll)};
  }catch(e){ return {label:'Pinned spot',city:CITIES[nearestCity(ll)].n}; }
}
async function reverse(ll){
  try{ if(MAPMODE==='google'){ const res=await new google.maps.Geocoder().geocode({location:{lat:ll.lat,lng:ll.lng}}); const r=res.results[0];
      const g=t=>(r.address_components.find(c=>c.types.includes(t))||{}).long_name; const area=g('neighborhood')||g('sublocality')||g('route')||g('locality');
      return {label:[area,g('locality')].filter((v,i,a)=>v&&a.indexOf(v)===i).join(', '),city:cityOf([g('locality'),g('administrative_area_level_1')],ll)}; }
    const j=await (await fetch(`https://photon.komoot.io/reverse?lang=en&lat=${ll.lat}&lon=${ll.lng}`)).json(); const p=(j.features&&j.features[0]||{}).properties||{};
    const area=p.district||p.locality||p.street||p.name; return {label:[area,p.city||p.county].filter((v,i,a)=>v&&a.indexOf(v)===i).join(', '),city:cityOf([p.city,p.county,p.state],ll)};
  }catch(e){ return {label:'',city:CITIES[nearestCity(ll)].n}; }
}
const localSugg=q=>{ q=q.trim().toLowerCase(); const seen=new Set(), out=[];
  S.trips.forEach(t=>[t.from,t.to].forEach(s=>{ const [c,a]=s.split(' · '); const lab=a||c; if(!seen.has(s)&&(!q||s.toLowerCase().includes(q))){ seen.add(s); out.push({label:lab,sub:a?c:'Nigeria',city:c}); } }));
  Object.keys(AREAS).forEach(a=>{ const k='Abuja · '+a; if(!seen.has(k)&&(!q||a.toLowerCase().includes(q))){ seen.add(k); out.push({label:a,sub:'Abuja',city:'Abuja',ll:{lat:AREAS[a][0],lng:AREAS[a][1]}}); } });
  Object.values(CITIES).forEach(c=>{ if(!seen.has(c.n)&&(!q||c.n.toLowerCase().includes(q))){ seen.add(c.n); out.push({label:c.n,sub:'Nigeria',city:c.n,ll:LLc(c)}); } });
  return out.slice(0,6); };
async function suggest(q){
  if(q.trim().length<2) return localSugg(q);
  try{
    if(MAPMODE==='google'){ const {AutocompleteSuggestion}=await google.maps.importLibrary('places');
      const {suggestions}=await AutocompleteSuggestion.fetchAutocompleteSuggestions({input:q,includedRegionCodes:['ng'],...(S.loc?{origin:{lat:S.loc.lat,lng:S.loc.lng}}:{})});
      const l=suggestions.filter(s=>s.placePrediction).slice(0,6).map(s=>({label:s.placePrediction.mainText.text,sub:s.placePrediction.secondaryText?s.placePrediction.secondaryText.text:'',pred:s.placePrediction}));
      if(l.length) return l; }
    else { const bias=(S.loc&&S.loc.acc<1500?`&lat=${S.loc.lat}&lon=${S.loc.lng}`:'&lat=9.07&lon=7.48')+'&location_bias_scale=0.6';
      let j=await (await fetch('https://photon.komoot.io/api/?limit=6&lang=en&bbox=6.70,8.40,7.90,9.60'+bias+'&q='+encodeURIComponent(q))).json();
      if(!(j.features||[]).length) j=await (await fetch('https://photon.komoot.io/api/?limit=6&lang=en&bbox='+NG_BBOX+bias+'&q='+encodeURIComponent(q))).json();
      const l=(j.features||[]).map(f=>{ const p=f.properties, ll={lat:f.geometry.coordinates[1],lng:f.geometry.coordinates[0]};
        return {label:p.name||p.street||p.city,sub:[p.street&&p.name!==p.street?p.street:'',p.district||p.locality,p.city||p.county,p.state].filter((v,i,a)=>v&&a.indexOf(v)===i).join(', '),ll,city:cityOf([p.city,p.county,p.state,p.name],ll)}; }).filter(x=>x.label);
      if(l.length>=3) return l;
      try{ const vb='&viewbox=7.20,9.25,7.65,8.85'; const n=await (await fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=ng'+vb+'&q='+encodeURIComponent(q))).json();
        const seen=new Set(l.map(x=>x.label.toLowerCase()));
        n.forEach(r=>{ const a=r.address||{}, lab=r.name||a.road||r.display_name.split(',')[0]; if(!lab||seen.has(lab.toLowerCase())) return; seen.add(lab.toLowerCase());
          const ll={lat:+r.lat,lng:+r.lon}; l.push({label:lab,sub:[a.road&&a.road!==lab?a.road:'',a.suburb||a.neighbourhood||a.quarter,a.city||a.state].filter((v,i,x)=>v&&x.indexOf(v)===i).join(', '),ll,city:cityOf([a.city,a.county,a.state],ll)}); });
      }catch(e){}
      if(l.length) return l.slice(0,7); }
  }catch(e){}
  return localSugg(q);
}
async function resolveSugg(s){
  if(s.pred){ const pl=s.pred.toPlace(); await pl.fetchFields({fields:['location','addressComponents']}); const ll={lat:pl.location.lat(),lng:pl.location.lng()};
    const comps=(pl.addressComponents||[]).map(c=>c.longText); return Object.assign(s,{ll,city:cityOf(comps,ll)}); }
  if(!s.ll){ s.ll=await geocode(place(s.label===s.city?'':s.label,s.city)); }
  if(!s.city&&s.ll) s.city=CITIES[nearestCity(s.ll)].n;
  return s;
}
/* --- route: real roads when we can, a straight line otherwise --- */
async function routePath(A,B,sp){
  try{
    if(MAPMODE==='google'){ const {Route}=await google.maps.importLibrary('routes');
      const {routes}=await Route.computeRoutes({origin:A,destination:B,travelMode:'DRIVING',fields:['path']});
      const r=routes&&routes[0]; if(r&&r.path&&r.path.length>1) return r.path.map(p=>({lat:typeof p.lat==='function'?p.lat():p.lat,lng:typeof p.lng==='function'?p.lng():p.lng})); }
    else { const j=await (await fetch(`https://router.project-osrm.org/route/v1/driving/${A.lng},${A.lat};${B.lng},${B.lat}?overview=full&geometries=geojson`)).json();
      const c=j.routes&&j.routes[0]&&j.routes[0].geometry.coordinates; if(c&&c.length>1) return c.map(([lng,lat])=>({lat,lng})); }
  }catch(e){}
  return [A,B];
}
function createMap(k){
  const sp=MAPS[k]; if(!sp) return null;
  const el=document.createElement('div'); el.className='gm'; el.innerHTML=`<div class="gmc"></div><button class="mloc" aria-label="Show my location">${ic('locate',18)}</button>`;
  const m={el,k,follow:false}; el.querySelector('.mloc').onclick=()=>{ if(m.embed){ locateMe(); return; } m.follow=true; el.classList.add('following'); if(S.loc&&m.api) m.api.pan(S.loc,15); else startLoc(true); };
  if(MAPMODE==='embed'&&!(sp.live&&window.L)){ m.embed=true;
    const q=x=>encodeURIComponent(x), A=sp.aLL?sp.aLL.lat+','+sp.aLL.lng:sp.a, B=sp.bLL?sp.bLL.lat+','+sp.bLL.lng:sp.b;
    const src=A&&B?`saddr=${q(A)}&daddr=${q(B)}`:A||B?`q=${q(A||B)}&z=${/^[^,]+, (Abuja, )?Nigeria$/.test(A||B)&&cityKey((A||B).split(',')[0])?12:16}`:(S.loc&&S.loc.acc<=1500?`q=${S.loc.lat},${S.loc.lng}&z=15`:'q=Abuja&z=12');
    el.querySelector('.gmc').innerHTML=`<iframe title="Google Map" loading="eager" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?${src}&hl=en&output=embed"></iframe>`; }
  return m;
}
async function initMap(m){
  if(m.api) return; const sp=MAPS[m.k], host=m.el.querySelector('.gmc');
  m.api=MAPMODE==='google'?gAdapter(host):lAdapter(host); m.api.onDrag(()=>{ m.follow=false; m.el.classList.remove('following'); });
  requestAnimationFrame(()=>m.api.resize());
  const col=brandCol();
  if(S.loc) m.api.user(S.loc);
  const A=sp.aLL||(sp.a&&await geocode(sp.a))||(sp.ac&&LLc(CITIES[sp.ac]))||null, B=sp.bLL||(sp.b&&await geocode(sp.b))||(sp.bc&&LLc(CITIES[sp.bc]))||null;
  if(A&&B&&llKey(A)!==llKey(B)){ m.api.view(A,10); m.path=await routePath(A,B,sp); m.api.line(m.path,col); m.api.pin(A,'#fff',col); m.api.pin(B,col,col); m.api.fit(m.path); }
  else if(A||B){ const P=A||B; m.api.pin(P,col,col); m.api.view(P,13); }
  else if(S.loc){ m.follow=true; m.el.classList.add('following'); m.api.view(S.loc,15); }
  else m.api.view({lat:9.07,lng:7.48},11);
  if(MAPS[m.k].car!=null) moveCar(m,MAPS[m.k].car);
}
function syncMaps(){
  const sc=$('#screen'), layer=$('#maplayer'); if(!sc||!layer) return;
  const slots=[...sc.querySelectorAll('.gslot')], want=new Set(slots.map(s=>s.dataset.key));
  mapEls.forEach((m,k)=>{ m.el.style.display=want.has(k)?'':'none'; });
  if(!slots.length) return;
  const R=sc.getBoundingClientRect(), z=(R.width/sc.offsetWidth)||1;
  slots.forEach(s=>{ const k=s.dataset.key; let m=mapEls.get(k);
    if(!m){ m=createMap(k); if(!m) return; mapEls.set(k,m); layer.appendChild(m.el);
      if(mapEls.size>6){ for(const [ok,om] of mapEls){ if(!want.has(ok)){ om.el.remove(); mapEls.delete(ok); if(mapEls.size<=6) break; } } } }
    const r=s.getBoundingClientRect(), w=(r.width/z)+'px', h=(r.height/z)+'px', sized=m.el.style.width!==w||m.el.style.height!==h;
    Object.assign(m.el.style,{top:((r.top-R.top)/z+sc.scrollTop)+'px',left:((r.left-R.left)/z)+'px',width:w,height:h});
    if(!m.embed&&!m.api&&!m.starting&&(MAPMODE==='osm'||gReady||(MAPMODE==='embed'&&window.L))){ m.starting=true; initMap(m); }
    else if(sized&&m.api) m.api.resize();
  });
}
function resetMaps(mode){ MAPMODE=mode; mapEls.forEach(m=>m.el.remove()); mapEls.clear(); render(); }
document.addEventListener('securitypolicyviolation',e=>{ if(MAPMODE!=='svg'&&/google|cartocdn|openstreetmap|komoot|osrm/i.test(e.blockedURI||'')) resetMaps('svg'); });
function moveCar(m,t){
  const P=m.path; if(!m.api||!P||P.length<2) return;
  const seg=[]; let tot=0; for(let i=1;i<P.length;i++){ const d=Math.hypot(P[i].lat-P[i-1].lat,P[i].lng-P[i-1].lng); seg.push(d); tot+=d; }
  let goal=tot*Math.max(0,Math.min(1,t)), i=0; while(i<seg.length-1&&goal>seg[i]){ goal-=seg[i]; i++; }
  const f=seg[i]?goal/seg[i]:0, a=P[i], b=P[i+1], pos={lat:a.lat+(b.lat-a.lat)*f,lng:a.lng+(b.lng-a.lng)*f};
  m.api.car(pos,Math.atan2(b.lng-a.lng,b.lat-a.lat)*180/Math.PI,brandCol());
}
if(MAPMODE==='google'){
  window.__gmReady=()=>{ gReady=true; mapEls.forEach(m=>initMap(m)); };
  window.gm_authFailure=()=>{ resetMaps(window.L?'osm':'svg'); toast('Google Maps did not accept the key. Showing the free map.'); };
  const g=document.createElement('script'); g.async=true; g.onerror=()=>resetMaps(window.L?'osm':'svg');
  g.src='https://maps.googleapis.com/maps/api/js?key='+encodeURIComponent(GKEY)+'&v=weekly&loading=async&callback=__gmReady';
  document.head.appendChild(g);
}
/* --- your live position: follows you as you move --- */
const LOC={watch:null,started:false,denied:false};
function startLoc(ask){
  if(!navigator.geolocation){ if(ask) toast('Location is not available on this device. Type your area instead.'); return; }
  if(LOC.watch!==null){ if(ask&&!S.loc) toast('Finding your location…'); return; }
  if(ask) toast('Finding your location…');
  try{ LOC.watch=navigator.geolocation.watchPosition(p=>{ const first=!S.loc; S.loc=Object.assign(S.loc||{},{lat:p.coords.latitude,lng:p.coords.longitude,acc:p.coords.accuracy});
      mapEls.forEach(m=>{ if(m.api){ m.api.user(S.loc); if(m.follow) m.api.pan(S.loc); } });
      if(first) firstFix(ask); },
    ()=>{ LOC.watch=null; LOC.denied=true; if(ask) toast('Location is off. Allow it in your browser, or type your area.'); },
    {enableHighAccuracy:true,maximumAge:5000,timeout:20000}); }catch(e){ LOC.watch=null; }
}
async function firstFix(force){
  const r=await reverse(S.loc); S.loc.label=r.label; S.loc.city=r.city||CITIES[nearestCity(S.loc)].n;
  if(LOC.want){ const f=LOC.want; LOC.want=null; useCurrent(f); return; }
  if(force||(!S.fromPl&&!S.fromTyped&&S.loc.acc<=1500)) useCurrent('from',true);
  if(S.post&&!S.post.fromLL&&!S.post.touched){ const k=cityKey(S.loc.city); if(k){ S.post.fromC=k; S.post.fromA=r.label.split(',')[0]||S.post.fromA; S.post.fromLL={lat:S.loc.lat,lng:S.loc.lng}; } }
}
function useCurrent(field,quiet){
  if(!quiet){ closeSugg(); const a=document.activeElement; if(a&&a.blur&&a.matches&&a.matches('input')) a.blur(); }
  if(!S.loc){ LOC.want=field; startLoc(true); return; }
  const L0={lat:S.loc.lat,lng:S.loc.lng};
  if(field==='from'){ S.fromPl={label:'Current location',sub:S.loc.label||'',ll:L0,cur:true}; S.fromTxt='Current location'; S.from=S.loc.city||''; S.selTrip=null; }
  if(field==='pfa'){ S.post.fromA=(S.loc.label||'').split(',')[0]||'Current location'; S.post.fromLL=L0; const k=cityKey(S.loc.city); if(k) S.post.fromC=k; S.post.touched=true; }
  closeSugg(); const a=document.activeElement; if(!(a&&a.matches&&a.matches('input'))||!quiet) render();
  if(!quiet) toast(S.loc.acc>1500?'Your location is approximate (about '+Math.round(S.loc.acc/1000)+' km). Type your area for a precise pickup.':'Using your current location'+(S.loc.label?': '+S.loc.label:''));
}
function locateMe(){ if(S.loc) useCurrent('from'); else { LOC.wantFrom=true; startLoc(true); setTimeout(()=>{ if(S.loc&&LOC.wantFrom){ LOC.wantFrom=false; useCurrent('from'); } },2500); } }
/* --- suggestions dropdown for From, To, Pickup, Drop-off --- */
let sgT, SG={field:null,list:[]};
function openSugg(field,q){
  SG.field=field; clearTimeout(sgT);
  sgT=setTimeout(async()=>{ const list=await suggest(q||''); if(SG.field!==field) return; SG.list=list; drawSugg(); }, (q||'').length<2?0:280);
}
function drawSugg(){
  const box=$('#sg-'+(SG.field==='from'||SG.field==='to'?'find':'post')); if(!box) return;
  const cur=(SG.field==='from'||SG.field==='pfa');
  const rows=(cur?[`<button class="sg cur" onpointerdown="event.preventDefault()" onclick="useCurrent('${SG.field}')"><span class="ico">${ic('locate',16)}</span><span class="grow"><b>Current location</b><small>${S.loc&&S.loc.label?esc(S.loc.label)+(S.loc.acc>1500?' · approximate':''):LOC.denied?'Location is off':'Use where you are now'}</small></span></button>`]:[])
    .concat(SG.list.map((s,i)=>`<button class="sg" onpointerdown="event.preventDefault()" onclick="pickSugg(${i})"><span class="ico">${ic('pin',16)}</span><span class="grow"><b>${esc(s.label)}</b><small>${esc(s.sub||'')}</small></span></button>`));
  if(MAPMODE!=='svg') rows.push(`<button class="sg pickmap" onpointerdown="event.preventDefault()" onclick="openPicker('${SG.field}')"><span class="ico">${ic('pin',16)}</span><span class="grow"><b>Choose on map</b><small>Can't find it? Move the map to the exact spot</small></span></button>`);
  box.innerHTML=rows.join(''); box.hidden=!rows.length;
}
document.addEventListener('pointerdown',e=>{ if(SG.field&&!e.target.closest('.sugg,#qf,#qt,#pfa,#pta')) closeSugg(); },true);
function blurSugg(){ const a=document.activeElement; if(!(a&&a.matches&&a.matches('#qf,#qt,#pfa,#pta'))) closeSugg(); }
function closeSugg(){ SG.field=null; document.querySelectorAll('.sugg').forEach(b=>{ b.hidden=true; b.innerHTML=''; }); }
/* --- choose on map: pan the map under a fixed pin, like Bolt/Uber --- */
let PK=null;
function openPicker(field){
  closeSugg(); const a=document.activeElement; if(a&&a.blur) a.blur();
  const cur={from:S.fromPl&&S.fromPl.ll,to:S.toPl&&S.toPl.ll,pfa:S.post.fromLL,pta:S.post.toLL}[field];
  const start=cur||(S.loc&&S.loc.acc<=1500?{lat:S.loc.lat,lng:S.loc.lng}:{lat:9.0579,lng:7.4951});
  const title={from:'Pickup point',to:'Destination',pfa:'Pickup spot',pta:'Drop-off spot'}[field];
  const el=document.createElement('div'); el.id='picker'; el.innerHTML=`<div class="pk-top"><button class="back" onclick="closePicker()" style="margin:0">${ic('back',16)} Back</button><b>${title}</b><span></span></div>
    <div class="pk-map"><div class="gmc" id="pkmap"></div><span class="pk-pin">${ic('pin',40)}</span><span class="pk-shadow"></span><button class="mloc" onclick="pkLocate()" aria-label="Go to my location">${ic('locate',18)}</button></div>
    <div class="pk-card"><div class="label">Move the map so the pin is on the exact spot</div><div class="pk-addr" id="pkaddr">Finding address…</div>
      <input class="input" id="pkland" placeholder="Landmark (optional), e.g. opposite Shoprite" autocomplete="off">
      <button class="btn" id="pkok" onclick="confirmPicker()">Confirm ${title.toLowerCase()}</button></div>`;
  $('#phone').appendChild(el);
  const api=MAPMODE==='google'?gAdapter($('#pkmap')):lAdapter($('#pkmap'));
  PK={field,api,addr:null,ll:start,t:null}; api.view(start,17); if(S.loc) api.user(S.loc);
  requestAnimationFrame(()=>{ api.resize(); api.view(start,17); });
  const upd=()=>{ const c=api.center(); PK.ll=c; $('#pkaddr').textContent='Finding address…'; el.classList.remove('moving'); clearTimeout(PK.t);
    PK.t=setTimeout(async()=>{ const r=await reverseStreet(c); if(!PK||PK.ll!==c) return; PK.addr=r; $('#pkaddr').textContent=r.label; },350); };
  api.onDrag(()=>el.classList.add('moving')); api.onIdle(upd); upd();
}
function pkLocate(){ if(S.loc&&PK) PK.api.pan(S.loc,17); else startLoc(true); }
function closePicker(){ const el=$('#picker'); if(el) el.remove(); PK=null; }
function confirmPicker(){
  if(!PK) return; const f=PK.field, ll=PK.ll, r=PK.addr||{label:'Pinned spot',city:CITIES[nearestCity(ll)].n}, land=$('#pkland').value.trim();
  const lab=land||r.label, sub=land?r.label:'Pinned on map', city=r.city||CITIES[nearestCity(ll)].n;
  if(f==='from'){ S.fromPl={label:lab,sub,ll}; S.fromTxt=lab; S.from=city; S.fromTyped=true; }
  if(f==='to'){ S.toPl={label:lab,sub,ll}; S.toTxt=lab; S.to=city; }
  if(f==='pfa'||f==='pta'){ const k=cityKey(city), p=S.post; p.touched=true; if(f==='pfa'){ p.fromA=lab; p.fromLL=ll; if(k) p.fromC=k; } else { p.toA=lab; p.toLL=ll; if(k) p.toC=k; } }
  S.selTrip=null; closePicker(); render(); toast('Location set: '+lab);
}
async function pickSugg(i){
  const f=SG.field, it=SG.list[i]; if(!it) return; closeSugg(); const a=document.activeElement; if(a&&a.blur) a.blur();
  const s=await resolveSugg(it); if(!s) return;
  const city=s.city||'', lab=s.label;
  if(f==='from'){ S.fromPl={label:lab,sub:s.sub,ll:s.ll}; S.fromTxt=lab; S.from=city||lab; S.fromTyped=true; }
  if(f==='to'){ S.toPl={label:lab,sub:s.sub,ll:s.ll}; S.toTxt=lab; S.to=city||lab; }
  if(f==='pfa'||f==='pta'){ const k=cityKey(city), p=S.post; p.touched=true;
    if(f==='pfa'){ p.fromA=lab===city?'':lab; p.fromLL=s.ll; if(k) p.fromC=k; } else { p.toA=lab===city?'':lab; p.toLL=s.ll; if(k) p.toC=k; } }
  S.selTrip=null; render();
}

/* ---------- navigation ---------- */
const HOME = {passenger:'find', driver:'dTrips'};
function go(v, extra){ if(S.view==='track' && v!=='track') stopTrack(); S.view=v; S.sheet=null; Object.assign(S, extra||{}); render(); $('#screen').scrollTop=0; }
function setMode(m){
  if(m===S.mode) return;
  if(m==='driver' && !S.user.driverVerified){ startOnb('driver'); return; }
  if(S.view==='track') stopTrack();
  S.mode=m; S.sheet=null; go(HOME[m]);
}
/* logo = home: close anything open, clear the current pick, go to the mode's home screen at the top */
function goHome(){ if(S.view==='track') stopTrack(); S.sheet=null; S.selTrip=null; if(S.mode==='driver') S.dtab='up'; go(HOME[S.mode]); }
let tt; function toast(msg){ S.toast=msg; render(); clearTimeout(tt); tt=setTimeout(()=>{S.toast=null;render();},2600); }

/* ---------- onboarding / registration ---------- */
const seq = () => S.onb.only==='driver' ? ['kycId','kycCar','review','done'] : ['splash','role','phone','otp','profile',...(S.onb.roles.includes('driver')?['kycId','kycCar','review']:[]),'done'];
const NOBAR=['splash','review','done'];
function startOnb(only){ S.onbOn=true; S.onb.only=only||null; S.onb.skipped=false; S.onb.step=only==='driver'?'kycId':'splash'; if(!only){ S.onb.roles=['passenger']; S.onb.phone=''; S.onb.name=''; } render(); $('#screen').scrollTop=0; }
function nextStep(){ const q=seq(), i=q.indexOf(S.onb.step); S.onb.step=q[Math.min(i+1,q.length-1)]; render(); $('#screen').scrollTop=0; if(S.onb.step==='review') runReview(); }
function prevStep(){ const q=seq(), i=q.indexOf(S.onb.step); if(i>0){ S.onb.step=q[i-1]; render(); } else if(S.onb.only){ S.onbOn=false; render(); } }
function runReview(){ setTimeout(()=>{ if(S.onb.step!=='review')return; nextStep(); },2400); }
function skipOnb(){ S.onbOn=false; S.mode='passenger'; S.view='find'; render(); }
/* leaving the driver checks early = registered as a passenger only */
function asPassenger(){
  const o=S.onb;
  if(o.only){ S.onbOn=false; S.mode='passenger'; S.view='profile'; render(); toast('No problem. Finish driver checks any time from Profile.'); return; }
  o.roles=['passenger']; o.skipped=true; o.step='done'; render(); $('#screen').scrollTop=0;
}
function finishOnb(){
  const o=S.onb, drv=o.roles.includes('driver')&&!o.skipped;
  if(o.only){ S.user.driverVerified=true; if(!S.user.roles.includes('driver'))S.user.roles.push('driver'); S.user.veh={...o.veh}; S.mode='driver'; }
  else { S.user=Object.assign(S.user,{name:o.name||S.user.name,phone:o.phone?('0'+o.phone.replace(/^0/,'')):S.user.phone,roles:drv?['passenger','driver']:['passenger'],driverVerified:drv,veh:drv?{...o.veh}:S.user.veh,since:'Nov 2026'});
    if(!drv) S.user.driverVerified=false; S.mode=drv&&!o.roles.includes('passenger')?'driver':'passenger'; }
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
/* driver KYC */
const idReady = () => { const o=S.onb; return o.nin.length===11 && o.licNo.trim().length>=5 && !!o.docs.lic && !!o.docs.selfie; };
const carReady = () => { const o=S.onb,v=o.veh,d=o.docs; return !!(v.make.trim()&&v.model.trim()&&v.plate.trim()&&d.carFront&&d.carBack&&d.carIn&&d.papers); };
function updKyc(){ const b=$('#kgo'); if(b) b.disabled=!(S.onb.step==='kycId'?idReady():carReady()); }
function setDoc(k,el){ const f=el.files&&el.files[0]; if(!f) return; S.onb.docs[k]=URL.createObjectURL(f); render(); }
function demoKyc(){ const o=S.onb;
  if(o.step==='kycId'){ o.nin='12345678901'; o.licNo='ABJ12345AA01'; o.docs.lic='demo'; o.docs.selfie='demo'; }
  else { Object.assign(o.veh,{make:'Toyota',model:'Corolla',color:'White',plate:'ABJ 123 KD'}); ['carFront','carBack','carIn','papers'].forEach(k=>o.docs[k]='demo'); }
  render(); }
const docImg = (v,icn) => v&&v!=='demo' ? `<img src="${v}" alt="">` : ic(v?'check':icn,18);
const upl = (k,title,hint,icn,cap) => { const v=S.onb.docs[k];
  return `<label class="upload ${v?'done':''}"><input type="file" accept="image/*" ${cap?`capture="${cap}"`:''} hidden onchange="setDoc('${k}',this)"><span class="ico">${docImg(v,icn)}</span><div class="grow"><div class="name">${title}</div><div class="meta">${v?'Added · tap to change':hint}</div></div></label>`; };
const tile = (k,title) => { const v=S.onb.docs[k];
  return `<label class="ptile ${v?'done':''}"><input type="file" accept="image/*" capture="environment" hidden onchange="setDoc('${k}',this)"><span class="ico">${docImg(v,'camera')}</span><span>${title}</span></label>`; };

function vOnb(){
  const o=S.onb, q=seq(), i=q.indexOf(o.step), kyc=o.step==='kycId'||o.step==='kycCar';
  if(o.step==='splash') return `<div class="sp"><div class="brand"><img src="assets/logo-white.png" alt="RideLink"></div>
    <h2>Share the road.<br>Split the cost.</h2><p>Post a trip or join one. Agree the price. Travel with verified people.</p>
    ${mapBox(mapSVG({routes:[{a:'abuja',b:'kaduna',sel:true}],car:.42}),'Abuja to Kaduna')}
    <div class="spbtn"><button class="btn" onclick="nextStep()">Get started</button><button class="skip" onclick="skipOnb()">Skip sign-up for the demo</button></div></div>`;
  const bar = NOBAR.includes(o.step) ? '' :
    `<div class="top"><button class="back" style="margin:0" onclick="prevStep()" aria-label="Back">${ic('back',18)}</button><div class="steps">${q.filter(s=>!NOBAR.includes(s)).map(s=>`<i class="${q.indexOf(s)<=i?'on':''}"></i>`).join('')}</div><button class="skip" onclick="${kyc?'asPassenger()':'skipOnb()'}">${kyc?'Later':'Skip'}</button></div>`;
  const asP = `<button class="btn ghost" style="margin-top:8px" onclick="asPassenger()">Continue as passenger</button>`;
  let b='';
  if(o.step==='role') b=`<h2>How will you use RideLink?</h2><p class="sub">Pick one or both. Drivers need ID and car checks.</p>
    ${[['passenger','Passenger','Find a ride and book a seat','profile'],['driver','Driver','Post trips and earn from empty seats','car']].map(([k,t,d,icn])=>`<button class="role" aria-pressed="${o.roles.includes(k)}" onclick="toggleRole('${k}')"><span class="ico">${ic(icn,20)}</span><div class="grow"><div class="name">${t}</div><div class="meta">${d}</div></div><span class="tick">${ic('check',14)}</span></button>`).join('')}
    <button class="btn" style="margin-top:8px" ${o.roles.length?'':'disabled'} onclick="nextStep()">Continue</button>`;
  if(o.step==='phone') b=`<h2>Your phone number</h2><p class="sub">We send a code by SMS to confirm it is you.</p>
    <div class="field"><label for="ph">Mobile number</label><div class="phonefield"><span class="pre">+234</span><input class="input" id="ph" type="tel" inputmode="numeric" maxlength="11" placeholder="803 000 0000" value="${esc(o.phone)}" oninput="S.onb.phone=this.value.replace(/\\D/g,'');$('#phgo').disabled=S.onb.phone.length<10"></div></div>
    <button class="btn" id="phgo" ${o.phone.length>=10?'':'disabled'} onclick="nextStep()">Send code</button>`;
  if(o.step==='otp') b=`<h2>Enter the 4-digit code</h2><p class="sub">Sent to +234 ${esc(o.phone.replace(/^0/,'')||'803 000 0000')}</p>
    <div class="otp">${[0,1,2,3].map(n=>`<input id="o${n}" inputmode="numeric" maxlength="1" aria-label="Digit ${n+1}" oninput="onOtp(${n},this)" onkeydown="otpKey(${n},event)">`).join('')}</div>
    <button class="btn ghost" onclick="demoOtp()">Use demo code 1234</button>`;
  if(o.step==='profile') b=`<h2>What should we call you?</h2><p class="sub">Drivers and passengers see your name.</p>
    <div class="field"><label for="nm">Full name</label><input class="input" id="nm" value="${esc(o.name)}" placeholder="As on your ID" oninput="S.onb.name=this.value;$('#pgo').disabled=!this.value.trim()"></div>
    <button class="btn" id="pgo" ${o.name.trim()?'':'disabled'} onclick="nextStep()">${o.roles.includes('driver')?'Continue to driver checks':'Create account'}</button>`;
  if(o.step==='kycId') b=`<span class="chip">Driver check 1 of 2</span><h2 style="margin-top:8px">Confirm it’s you</h2><p class="sub">Passengers only ride with verified drivers. We check these with NIMC and the FRSC.</p>
    <div class="field"><label for="nin">National Identification Number (NIN)</label><input class="input" id="nin" inputmode="numeric" maxlength="11" placeholder="11 digits" value="${esc(o.nin)}" oninput="S.onb.nin=this.value.replace(/\\D/g,'');updKyc()"></div>
    <div class="field"><label for="lic">Driver’s licence number</label><input class="input" id="lic" maxlength="16" placeholder="e.g. ABJ12345AA01" value="${esc(o.licNo)}" oninput="S.onb.licNo=this.value.toUpperCase();updKyc()"></div>
    ${upl('lic','Photo of your licence','Front side, all corners visible','id','environment')}
    ${upl('selfie','Take a live photo','Uses your front camera. Face the light, no glasses','camera','user')}
    <button class="link" onclick="demoKyc()">Fill with demo details</button>
    <div class="foot"><button class="btn" id="kgo" ${idReady()?'':'disabled'} onclick="nextStep()">Continue</button>${asP}</div>`;
  if(o.step==='kycCar'){ const v=o.veh;
    b=`<span class="chip">Driver check 2 of 2</span><h2 style="margin-top:8px">Your car</h2><p class="sub">Passengers see your car and plate before they book.</p>
    <div class="two"><div class="field"><label for="vm">Make</label><input class="input" id="vm" value="${esc(v.make)}" placeholder="Toyota" oninput="S.onb.veh.make=this.value;updKyc()"></div><div class="field"><label for="vo">Model</label><input class="input" id="vo" value="${esc(v.model)}" placeholder="Corolla" oninput="S.onb.veh.model=this.value;updKyc()"></div></div>
    <div class="two"><div class="field"><label for="vc">Colour</label><input class="input" id="vc" value="${esc(v.color)}" placeholder="White" oninput="S.onb.veh.color=this.value"></div><div class="field"><label for="vp">Plate number</label><input class="input" id="vp" value="${esc(v.plate)}" placeholder="ABJ 123 KD" oninput="S.onb.veh.plate=this.value.toUpperCase();updKyc()"></div></div>
    <div class="field"><span class="label">Seats for passengers</span><div class="stepper"><button aria-label="Fewer seats" onclick="S.onb.veh.seats=Math.max(1,S.onb.veh.seats-1);render()">−</button><b>${v.seats}</b><button aria-label="More seats" onclick="S.onb.veh.seats=Math.min(6,S.onb.veh.seats+1);render()">+</button></div></div>
    <span class="label">Car photos</span><div class="photos">${tile('carFront','Front')}${tile('carBack','Back')}${tile('carIn','Inside')}</div>
    ${upl('papers','Vehicle papers','Registration and insurance','doc','')}
    <button class="link" onclick="demoKyc()">Fill with demo details</button>
    <div class="foot"><button class="btn" id="kgo" ${carReady()?'':'disabled'} onclick="nextStep()">Submit for review</button>${asP}</div>`; }
  if(o.step==='review') b=`<div class="center" style="padding-top:90px"><div class="spin"></div><h2>Checking your details</h2><p class="sub">In the live app our team confirms these, usually within a day. You can still book rides meanwhile.</p></div>`;
  if(o.step==='done'){ const drv=o.only||(o.roles.includes('driver')&&!o.skipped);
    b=`<div class="center" style="padding-top:70px"><div class="avatar lg" style="margin:0 auto 14px;background:var(--brand);color:#fff">${ic('check',28)}</div><h2>You’re all set${o.only?'':', '+esc((o.name||'').split(' ')[0]||'friend')}</h2>
    <p class="sub">${drv?'You are a verified driver. Switch to Driver at the top to post a trip.':o.skipped?'You are registered as a passenger. Finish driver checks any time from Profile.':'Find a ride from the middle button.'}</p>
    ${drv?`<span class="chip good">${ic('shield',12)} Driver verified</span>`:''}</div><button class="btn" style="margin-top:28px" onclick="finishOnb()">Continue</button>`; }
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
const hourOf=t=>{ const m=t.when.match(/(\d+):(\d+)\s*(AM|PM)/); if(!m) return 12; let h=+m[1]%12; if(m[3]==='PM') h+=12; return h; };
const dayOf=t=>t.when.split(' · ')[0];
const FILT = {
  today:{l:'Today',fn:t=>dayOf(t)==='Today'}, tomorrow:{l:'Tomorrow',fn:t=>dayOf(t)==='Tomorrow'}, weekend:{l:'Weekend',fn:t=>/^(Fri|Sat|Sun)/.test(dayOf(t))},
  morning:{l:'Morning',fn:t=>hourOf(t)<12}, afternoon:{l:'Afternoon',fn:t=>hourOf(t)>=12&&hourOf(t)<17}, evening:{l:'Evening',fn:t=>hourOf(t)>=17},
  ac:{l:'AC',fn:t=>t.rules.includes('AC')}, luggage:{l:'Luggage ok',fn:t=>t.rules.includes('Luggage ok')}, quiet:{l:'Quiet ride',fn:t=>t.rules.includes('Quiet ride')},
  nosmoke:{l:'No smoking',fn:t=>t.rules.includes('No smoking')}, women:{l:'Women only',fn:t=>t.rules.includes('Women only')},
  neg:{l:'Negotiable',fn:t=>t.neg}, top:{l:'4.8★ and up',fn:t=>t.rating>=4.8}, seats2:{l:'2+ seats left',fn:t=>t.seats>=2}
};
const FGROUPS=[['When',['today','tomorrow','weekend']],['Time of day',['morning','afternoon','evening']],['Comfort',['ac','luggage','quiet','nosmoke','women']],['Price and driver',['neg','top','seats2']]];
const QUICK=['today','neg','ac','women'];
const SORTS={best:'Best match',cheap:'Cheapest',early:'Earliest',rating:'Top rated'};
const dayRank=t=>({Today:0,Tomorrow:1}[dayOf(t)]??2);
function findTrips(){
  const pool=S.trips.filter(t=>!t.mine&&!t.past), known=q=>!q||pool.some(t=>(t.from+' '+t.to).toLowerCase().includes(q));
  let f=S.from.trim().toLowerCase(), d=S.to.trim().toLowerCase();
  if(!known(f)) f=(S.fromPl&&S.fromPl.ll?CITIES[nearestCity(S.fromPl.ll)].n:'abuja').toLowerCase();
  if(!known(d)) d=S.toPl&&S.toPl.ll?CITIES[nearestCity(S.toPl.ll)].n.toLowerCase():'';
  const l=S.trips.filter(t=>!t.mine && !t.past && (!f||t.from.toLowerCase().includes(f)) && (!d||t.to.toLowerCase().includes(d))
    && (!S.maxPrice||t.price<=S.maxPrice) && FGROUPS.every(([,ks])=>{ const on=ks.filter(k=>S.filters.includes(k)); return !on.length||on.some(k=>FILT[k].fn(t)); }));
  const by={best:(a,b)=>(!!b.boosted-!!a.boosted)||(dayRank(a)-dayRank(b)), cheap:(a,b)=>a.price-b.price, early:(a,b)=>(dayRank(a)-dayRank(b))||(hourOf(a)-hourOf(b)), rating:(a,b)=>b.rating-a.rating}[S.sort];
  return l.sort(by);
}
const nFilters=()=>S.filters.length+(S.maxPrice?1:0);
const tripList = () => { const l=findTrips(); return l.length ? l.map(tripCard).join('') : `<div class="empty"><b>No trips match</b>Try another route or clear a filter.</div>${nFilters()?'<button class="btn ghost" onclick="clearFilters()">Clear filters</button>':''}`; };
const findSpec = () => { const t=S.selTrip&&trip(S.selTrip); if(t) return tripPlaces(t);
  const inAbj=t=>t?t+(cityKey(t)||/abuja|fct/i.test(t)?'':', Abuja')+', Nigeria':''; return {a:S.fromPl?'':inAbj(S.from.trim()),aLL:S.fromPl&&S.fromPl.ll,b:S.toPl?'':inAbj(S.to.trim()),bLL:S.toPl&&S.toPl.ll,ac:cityKey(S.from),bc:cityKey(S.to)}; };
const findMap = () => gmap(findSpec(), S.selTrip?'Selected trip':((S.fromTxt||S.from)&&(S.toTxt||S.to)?(S.fromTxt||S.from)+' to '+(S.toTxt||S.to):''));
let fmT; function updFind(){ const l=$('#list'); if(l) l.innerHTML=tripList(); const c=$('#count'); if(c) c.textContent=countText();
  clearTimeout(fmT); fmT=setTimeout(()=>{ const w=$('#mapwrap'); if(w){ w.innerHTML=findMap(); syncMaps(); } },MAPMODE==='svg'?0:700); }
const countText=()=>{ const n=findTrips().length; return n+' trip'+(n===1?'':'s')+' · '+SORTS[S.sort]; };
function toggleFilter(k){ const i=S.filters.indexOf(k); i>=0?S.filters.splice(i,1):S.filters.push(k); render(); }
function clearFilters(){ S.filters=[]; S.maxPrice=0; S.sort='best'; render(); }
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
  const n=nFilters();
  return `<div id="mapwrap">${findMap()}</div>
  <div class="two" style="gap:8px;margin-bottom:10px">
    <div class="locwrap"><input class="input" id="qf" placeholder="From" autocomplete="off" value="${esc(S.fromTxt||S.from)}" onfocus="this.select();openSugg('from',S.fromPl?'':this.value)" onblur="setTimeout(blurSugg,150)" oninput="S.from=S.fromTxt=this.value;S.fromPl=null;S.fromTyped=true;S.selTrip=null;updFind();openSugg('from',this.value)" aria-label="From"><button class="loc" onclick="locateMe()" aria-label="Use my current location">${ic('locate',16)}</button></div>
    <input class="input" id="qt" placeholder="Where to?" autocomplete="off" value="${esc(S.toTxt||S.to)}" onfocus="this.select();openSugg('to',S.toPl?'':this.value)" onblur="setTimeout(blurSugg,150)" oninput="S.to=S.toTxt=this.value;S.toPl=null;S.selTrip=null;updFind();openSugg('to',this.value)" aria-label="To"></div>
  <div class="sugg" id="sg-find" hidden></div>
  ${rail(`<button class="chip fbtn" aria-pressed="${n>0}" onclick="S.sheet={type:'filters'};render()">${ic('filter',14)} Filters${n?` · ${n}`:''}</button>`+QUICK.map(k=>`<button class="chip" aria-pressed="${S.filters.includes(k)}" onclick="toggleFilter('${k}')">${FILT[k].l}</button>`).join(''))}
  <div class="row between" style="margin:2px 0 8px"><span class="meta" id="count">${countText()}</span>${n?'<button class="link sm" onclick="clearFilters()">Clear all</button>':''}</div>
  <div id="list">${tripList()}</div>`;
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
  ${gmap(tripPlaces(t),'≈ '+Math.round(tKm(t))+' km · '+dur(tMins(t)))}<div>
  <div class="card ${t.boosted?'promoted':''}"><div class="row between"><div class="row"><div class="avatar">${initials(t.driver)}</div><div><div class="name">${esc(t.driver)}</div><div class="meta">★ ${t.rating} · ${esc(t.car)}</div></div></div><div class="price">${naira(t.price)}<small> /seat</small></div></div>
    <div class="route"><div>${esc(t.from)}<small>${esc(t.when)}</small></div><div>${esc(t.to)}</div></div>
    <div class="chips"><span class="chip ${t.seats?'good':'bad'}">${t.seats} seat${t.seats===1?'':'s'} left</span>${t.neg?'<span class="chip">Negotiable</span>':'<span class="chip">Fixed price</span>'}</div></div>
  <h3>Trip rules <span class="swipe">Swipe ${ic('arrow',12)}</span></h3>${rail(rules.map(ruleCard).join(''))}
  ${act}<div class="btns">${gmBtn('Open route in Google Maps',tripPlaces(t).b,tripPlaces(t).a)}</div></div>`;
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
  <div class="msgs">${o.msgs.map(m=>`<div class="bubble ${m.w}">${esc(m.t)}</div>`).join('')}</div>${act}`;
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
const etaText = () => { const T=S.track,t=trip(T.tripId); const m=Math.round((1-T.t)*tMins(t)); return T.arrived?'Arrived':(m<=1?'Arriving now':dur(m)+' left'); };
function tick(){ const T=S.track; if(!T||S.view!=='track'){ stopTrack(); return; } T.t=Math.min(1,T.t+0.012); trip(T.tripId).prog=T.t;
  if(MAPMODE==='svg'){ const w=$('#mapwrap'); if(w) w.innerHTML=trackMap(); } else { const m=mapEls.get(mapKey(tripPlaces(trip(T.tripId)))+'|live'); if(m&&m.map) moveCar(m,T.t); } const e=$('#eta'); if(e) e.textContent=etaText(); const b=$('#prog'); if(b) b.style.width=(T.t*100)+'%';
  if(T.t>=1){ stopTrack(); arrive(); } }
function arrive(){ const T=S.track; T.t=1; T.arrived=true; const t=trip(T.tripId); t.live=false; t.prog=0;
  if(T.role==='passenger'){ const b=S.bookings.find(x=>x.id===T.bid); if(b) b.status='completed'; S.sheet={type:'rate',bid:T.bid,stars:0}; }
  else { t.past=true; t.earned=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted').reduce((s,i)=>s+i.amount,0); t.pax=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted').map(i=>({name:i.name,amount:i.amount})); t.riders=t.pax.length; t.when=t.when.replace(/^\w+/,'Today'); ['today','week','month','all'].forEach(k=>S.earn[k]+=t.earned); S.dtab='past'; toast('Trip complete. '+naira(t.earned)+' is on its way to you.'); }
  render(); }
const trackMap = () => { const T=S.track,t=trip(T.tripId); return gmap(Object.assign(tripPlaces(t),{car:T.t,live:true}),T.arrived?'Trip finished':'Live'); };
function vTrack(){
  const T=S.track; if(!T) return vTrips(); const t=trip(T.tripId), drv=T.role==='driver';
  const riders=S.incoming.filter(i=>i.tripId===t.id&&i.status==='accepted');
  return `<button class="back" onclick="go('${drv?'dTrips':'trips'}')">${ic('back',16)} ${drv?'My trips':'Trips'}</button>
  <div id="mapwrap">${trackMap()}</div><div>
  <div class="card"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><span class="chip ${T.arrived?'':'good'}" id="eta">${etaText()}</span></div>
    <div class="prog"><i id="prog" style="width:${T.t*100}%"></i></div>
    <div class="meta">${drv?esc(S.user.veh.make+' '+S.user.veh.model+' · '+S.user.veh.plate):esc(t.driver)+' · '+esc(t.car)}</div></div>
  ${drv?`<h3>Passengers (${riders.length})</h3>${riders.map(r=>`<div class="card row between"><div class="row"><div class="avatar">${initials(r.name)}</div><div class="name">${esc(r.name)}</div></div><button class="chip" aria-pressed="${T.picked.includes(r.id)}" onclick="togglePick(${r.id},this)">${T.picked.includes(r.id)?'Picked up':'Mark picked up'}</button></div>`).join('')||'<div class="note">No passengers booked.</div>'}
    <div class="btns">${gmBtn('Navigate with Google Maps',tripPlaces(t).b,tripPlaces(t).a)}</div>
    <button class="btn" style="margin-top:10px" ${T.arrived?'disabled':''} onclick="stopTrack();arrive()">End trip</button>`
  :`<div class="label" style="text-align:center">Pickup code</div><div class="code">${(S.bookings.find(b=>b.id===T.bid)||{code:'0000'}).code.split('').join(' ')}</div>
    <div class="btns"><button class="btn ghost" onclick="toast('Demo: a live link would be copied to your clipboard')">${ic('share',16)} Share trip</button><button class="btn bad" onclick="S.sheet={type:'sos'};render()">${ic('sos',16)} SOS</button></div>
    <div class="btns"><button class="btn ghost" onclick="toast('Demo: chat opens here')">${ic('chat',16)} Message driver</button>${T.arrived?'':'<button class="btn ghost" onclick="stopTrack();arrive()">Skip to arrival</button>'}</div>`}
  </div>`;
}
function togglePick(id,el){ const p=S.track.picked, i=p.indexOf(id); i>=0?p.splice(i,1):p.push(id); el.setAttribute('aria-pressed',i<0); el.textContent=i<0?'Picked up':'Mark picked up'; }

/* ---------- driver views ---------- */

const gap = (amt,price) => amt<price ? naira(price-amt)+' below your price' : 'Your full price';
function incomingCard(i){
  const t=trip(i.tripId); if(!t) return '';
  const right = i.status==='countered' ? `<span class="chip promo">Countered ${naira(i.counter)}</span>` : `<div class="price">${naira(i.amount)}</div>`;
  return `<div class="card"><div class="row between"><div class="row"><div class="avatar">${initials(i.name)}</div><div><div class="name">${esc(i.name)}</div><div class="meta">★ ${i.rating||'New'} · ${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div></div></div>${right}</div>
    <div class="row between" style="margin-top:8px"><span class="meta">${i.status==='countered'?'Waiting for their reply':gap(i.amount,t.price)}</span><button class="btn sm" onclick="go('req',{reqId:${i.id}})">${ic('eye',14)} View</button></div></div>`;
}
function incomingAct(id,a){ const i=S.incoming.find(x=>x.id===id), t=trip(i.tripId);
  if(a==='accept'){ if(t.seats<1){ toast('No seats left on this trip'); return; } i.status='accepted'; t.seats--; go('dTrips'); toast(i.name.split(' ')[0]+' is confirmed for this trip'); }
  else { i.status='declined'; go('dTrips'); toast('Request declined'); } }
function vReq(){
  const i=S.incoming.find(x=>x.id===S.reqId); if(!i) return vDTrips(); const t=trip(i.tripId), low=t.neg&&t.floor&&i.amount<t.floor, open=i.status==='new';
  const row=(k,v)=>`<div class="kv"><span>${k}</span><b>${v}</b></div>`;
  return `<button class="back" onclick="go('dTrips')">${ic('back',16)} My trips</button>
  <div class="card center" style="padding:16px"><div class="avatar lg" style="margin:0 auto 8px">${initials(i.name)}</div><div class="name" style="font-size:16px">${esc(i.name)}</div>
    <div class="meta">★ ${i.rating} · ${i.trips} trips · Member since ${esc(i.since)}</div>
    <div class="chips" style="justify-content:center;margin-top:8px"><span class="chip good">${ic('check',12)} Phone verified</span><span class="chip good">${ic('shield',12)} ID verified</span></div></div>
  <div class="card"><div class="row between"><div><div class="meta">${open?'Offers':'Agreed'}</div><div class="price" style="font-size:22px">${naira(i.status==='countered'?i.counter:i.amount)}</div></div><span class="chip ${i.amount<t.price?'promo':'good'}">${gap(i.amount,t.price)}</span></div>
    <div class="route"><div>${esc(i.pickup)}, ${esc(t.from.split(' · ')[0])}<small>${esc(t.when)}</small></div><div>${esc(i.drop)}, ${esc(t.to.split(' · ')[0])}</div></div>
    ${row('Seats','1')}${row('Luggage',esc(i.bag))}${row('Your listed price',naira(t.price))}
    ${i.note?`<div class="note" style="margin-top:8px">“${esc(i.note)}”</div>`:''}
    <div class="btns">${gmBtn('Directions to pickup',i.pickup+', '+t.from.split(' · ')[0]+', Nigeria')}</div></div>
  ${i.review?`<h3>From another driver</h3><div class="card"><div class="meta">${esc(i.review)}</div></div>`:''}
  ${open?`<button class="btn" onclick="incomingAct(${i.id},'accept')">Accept ${naira(i.amount)}</button>
    <div class="btns">${t.neg?`<button class="btn ghost" onclick="S.sheet={type:'counter',inc:${i.id}};render()">Counter</button>`:''}<button class="btn bad" onclick="incomingAct(${i.id},'decline')">Decline</button></div>
    ${low?`<p class="hint" style="margin-top:8px">This is below your lowest price of ${naira(t.floor)}.</p>`:''}`
   :`<div class="note">${i.status==='accepted'?'Seat confirmed.':i.status==='countered'?'You sent a counter of '+naira(i.counter)+'. Waiting for their reply.':'You declined this request.'}</div>`}`;
}
const PER={today:'Today',week:'This week',month:'This month',all:'All time'};
function toggleBal(){ S.hideBal=!S.hideBal; try{ localStorage.setItem('rl_hideBal',S.hideBal?'1':'0'); }catch(e){} render(); }
function pastCard(t){
  const pax=t.pax||[], tot=pax.reduce((x,p)=>x+p.amount,0)||t.earned||0;
  return `<details class="card past"><summary><div class="grow"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div><div class="meta">${esc(t.when)} · ${pax.length||t.riders||0} passengers</div></div><span class="chip good">${S.hideBal?'₦ •••':naira(t.earned||tot)}</span><span class="chev">${ic('chev',16)}</span></summary>
    <div class="pd"><div class="route"><div>${esc(t.from)}<small>${esc(t.when)}</small></div><div>${esc(t.to)}</div></div>
    <div class="kv"><span>Distance</span><b>≈ ${Math.round(tKm(t))} km · ${dur(tMins(t))}</b></div>
    <div class="kv"><span>Car</span><b>${esc(t.car)}</b></div><div class="kv"><span>Price per seat</span><b>${naira(t.price)}</b></div>
    ${t.rated?`<div class="kv"><span>Rating from passengers</span><b>★ ${t.rated}</b></div>`:''}
    <div class="label" style="margin:10px 0 4px">Passengers</div>${pax.map(p=>`<div class="kv"><span class="row" style="gap:8px"><span class="avatar sm">${initials(p.name)}</span>${esc(p.name)}</span><b>${naira(p.amount)}</b></div>`).join('')||'<div class="meta">No passengers on this trip.</div>'}
    <div class="kv tot"><span>Total collected</span><b>${naira(tot)}</b></div></div></details>`;
}
function vDTrips(){
  const up=S.dtab==='up', list=myTrips().filter(t=>up?!t.past:t.past).sort((a,b)=>!!b.live-!!a.live);
  const reqs=S.incoming.filter(i=>(i.status==='new'||i.status==='countered')&&trip(i.tripId)&&!trip(i.tripId).past);
  const card=t=>`<div class="card ${t.boosted?'promoted':''}"><div class="row between"><div class="name">${esc(t.from.split(' · ')[0])} → ${esc(t.to.split(' · ')[0])}</div>${t.live?'<span class="chip good">On the way</span>':t.boosted?'<span class="chip promo">Promoted</span>':`<b class="price">${naira(t.price)}</b>`}</div>
      <div class="meta">${esc(t.when)} · ${t.cap-t.seats} of ${t.cap} seats filled</div><div class="prog"><i style="width:${(t.cap-t.seats)/t.cap*100}%"></i></div>
      <div class="btns"><button class="btn sm" onclick="startTrack(${t.id},'driver')">${t.live?'Open live trip':'Start trip'}</button>${t.boosted||t.live?'':`<button class="btn boost sm" onclick="S.sheet={type:'boost',tripId:${t.id}};render()">Boost</button>`}</div></div>`;
  const hero=`<div class="hero"><div class="row between"><div class="meta">Earned · ${PER[S.earnP]}</div><button class="eye" onclick="toggleBal()" aria-label="${S.hideBal?'Show':'Hide'} earnings">${ic(S.hideBal?'eyeoff':'eye',18)}</button></div>
    <div class="big">${S.hideBal?'₦ ••••••':naira(S.earn[S.earnP])}</div>
    <div class="pers" role="tablist">${Object.entries(PER).map(([k,l])=>`<button role="tab" aria-selected="${S.earnP===k}" onclick="S.earnP='${k}';render()">${{today:'Today',week:'Week',month:'Month',all:'All time'}[k]}</button>`).join('')}</div></div>`;
  const empty=`<div class="empty"><b>${up?'No upcoming trips':'No past trips yet'}</b>${up?'Post a trip from the middle button.':'Finished trips show up here.'}</div>`;
  return `<h2>My trips</h2><div class="tabs2" role="tablist" style="margin-top:8px"><button role="tab" aria-selected="${up}" onclick="S.dtab='up';render()">Active</button><button role="tab" aria-selected="${!up}" onclick="S.dtab='past';render()">Past</button></div>
  ${up?hero+`<h3>Your trips</h3>${list.length?list.map(card).join(''):empty}`+(reqs.length?`<h3>Requests (${reqs.length})</h3>${reqs.map(incomingCard).join('')}`:`<h3>Requests</h3><div class="note">New seat requests show up here.</div>`)
      :(list.length?`<p class="sub">Tap a trip to see the details.</p>${list.map(pastCard).join('')}`:empty)}`;
}
/* post a trip */
const distText = () => { const p=S.post; if(p.fromC===p.toC&&!(p.fromA.trim()&&p.toA.trim())) return 'Add a pickup and drop-off spot'; return '≈ '+Math.round(routeKm(p.fromC,p.fromA,p.toC,p.toA))+' km · about '+dur(routeMins(p.fromC,p.fromA,p.toC,p.toA)); };
const postSpec = () => { const p=S.post; return {a:place(p.fromA,CITIES[p.fromC].n),aLL:p.fromLL||null,b:p.fromC===p.toC&&!p.toA?'':place(p.toA,CITIES[p.toC].n),bLL:p.toLL||null,ac:p.fromC,bc:p.toC}; };
const postMap = () => gmap(postSpec(),'Route preview');
let pmT; function updPost(){ const d=$('#dist'); if(d) d.textContent=distText(); clearTimeout(pmT); pmT=setTimeout(()=>{ const w=$('#mapwrap'); if(w){ w.innerHTML=postMap(); syncMaps(); } },MAPMODE==='svg'?0:700); }
function toggleRule(i,el){ const k=RULES[i].k, a=S.post.rules, j=a.indexOf(k); j>=0?a.splice(j,1):a.push(k); el.setAttribute('aria-pressed',j<0); }
function vPost(){
  const p=S.post, opts=sel=>Object.entries(CITIES).map(([k,c])=>`<option value="${k}" ${k===sel?'selected':''}>${c.n}</option>`).join('');
  return `<div id="mapwrap">${postMap()}</div><div>
  <h2>Post a trip</h2><p class="sub" id="dist">${distText()}</p>
  <div class="two"><div class="field"><label for="pfc">From</label><select class="input" id="pfc" onchange="S.post.fromC=this.value;S.post.fromLL=null;updPost()">${opts(p.fromC)}</select></div>
  <div class="field"><label for="ptc">To</label><select class="input" id="ptc" onchange="S.post.toC=this.value;S.post.toLL=null;updPost()">${opts(p.toC)}</select></div></div>
  <div class="two"><div class="field"><label for="pfa">Pickup spot</label><input class="input" id="pfa" autocomplete="off" value="${esc(p.fromA)}" placeholder="e.g. Wuse Market" onfocus="this.select();openSugg('pfa',this.value)" onblur="setTimeout(blurSugg,150)" oninput="S.post.fromA=this.value;S.post.fromLL=null;S.post.touched=true;updPost();openSugg('pfa',this.value)"></div>
  <div class="field"><label for="pta">Drop-off spot</label><input class="input" id="pta" autocomplete="off" value="${esc(p.toA)}" placeholder="e.g. Barnawa" onfocus="this.select();openSugg('pta',this.value)" onblur="setTimeout(blurSugg,150)" oninput="S.post.toA=this.value;S.post.toLL=null;updPost();openSugg('pta',this.value)"></div></div>
  <div class="sugg" id="sg-post" hidden></div>
  <div class="two"><div class="field"><label for="pd">Day</label><select class="input" id="pd" onchange="S.post.day=this.value">${['Today','Tomorrow','Fri','Sat','Sun'].map(d=>`<option ${d===p.day?'selected':''}>${d}</option>`).join('')}</select></div>
  <div class="field"><label for="ptm">Time</label><input class="input" id="ptm" type="time" value="${p.time}" onchange="S.post.time=this.value"></div></div>
  <div class="two"><div class="field"><span class="label">Seats</span><div class="stepper"><button aria-label="Fewer seats" onclick="S.post.seats=Math.max(1,S.post.seats-1);render()">−</button><b>${p.seats}</b><button aria-label="More seats" onclick="S.post.seats=Math.min(S.user.veh.seats||4,S.post.seats+1);render()">+</button></div></div>
  <div class="field"><label for="pp">Price per seat (₦)</label><input class="input" id="pp" type="number" inputmode="numeric" value="${p.price}" oninput="S.post.price=+this.value"></div></div>
  <div class="toggle"><div><div class="name">Allow offers</div><div class="hint">Passengers can negotiate your price.</div></div><button class="switch" aria-pressed="${p.neg}" aria-label="Allow offers" onclick="S.post.neg=!S.post.neg;render()"></button></div>
  ${p.neg?`<div class="field"><label for="pfl">Lowest price you accept (₦)</label><input class="input" id="pfl" type="number" inputmode="numeric" value="${p.floor}" oninput="S.post.floor=+this.value"></div>`:''}
  <h3>Trip rules <span class="swipe">Swipe ${ic('arrow',12)}</span></h3>
  ${rail(RULES.map((r,i)=>`<button class="rule" aria-pressed="${p.rules.includes(r.k)}" onclick="toggleRule(${i},this)"><span class="ico">${ic(r.ic,18)}</span><div><b>${esc(r.k)}</b><span class="d">${esc(r.d)}</span></div></button>`).join(''))}
  <button class="btn" onclick="publish()">Publish trip</button></div>`;
}
function publish(){
  const p=S.post; if(p.fromC===p.toC&&(!p.fromA.trim()||!p.toA.trim()||p.fromA.trim().toLowerCase()===p.toA.trim().toLowerCase())){ toast('Add different pickup and drop-off spots'); return; } if(!(p.price>0)){ toast('Add a price per seat'); return; }
  const t={id:S.nextId++,mine:true,driver:'You',rating:4.9,count:42,fromC:p.fromC,toC:p.toC,from:CITIES[p.fromC].n+(p.fromA.trim()?' · '+p.fromA.trim():''),to:CITIES[p.toC].n+(p.toA.trim()?' · '+p.toA.trim():''),
    when:p.day+' · '+to12(p.time),seats:p.seats,cap:p.seats,price:p.price,neg:p.neg,floor:p.floor,boosted:false,car:S.user.veh.make+' '+S.user.veh.model+', '+(S.user.veh.color||'').toLowerCase(),rules:p.rules.length?[...p.rules]:[]};
  if(!p.neg) t.floor=0; S.trips.push(t); S.dtab='up'; go('dTrips'); toast('Trip published. Passengers can request seats now.');
}

/* ---------- profile ---------- */
function setPhoto(el){ const f=el.files&&el.files[0]; if(!f) return; S.user.photo=URL.createObjectURL(f); render(); toast('Profile photo updated'); }
const face = (u,cls) => u.photo ? `<img src="${u.photo}" alt="">` : esc(initials(u.name));
const lrow = (icn,title,meta,act,right) => `<${act?'button':'div'} class="listrow" ${act?`onclick="${act}"`:''}><span class="ico">${ic(icn,16)}</span><div class="grow"><div class="name">${title}</div>${meta?`<div class="meta">${meta}</div>`:''}</div>${right===undefined?(act?`<span class="chev">${ic('chev',16)}</span>`:''):right}</${act?'button':'div'}>`;
const sw = (on,act,label) => `<button class="switch" aria-pressed="${on}" aria-label="${label}" onclick="event.stopPropagation();${act}"></button>`;
const soon = what => `toast('${what} opens here in the live app')`;
function vProfile(){
  const u=S.user, d=S.mode==='driver', st=d?u.dStats:u.pStats;
  const head=`<div class="phead"><label class="avatar xl" aria-label="Change profile photo"><input type="file" accept="image/*" hidden onchange="setPhoto(this)">${face(u)}<span class="cam">${ic('camera',13)}</span></label>
    <div class="name" style="font-size:17px">${esc(u.name||'Your name')}</div><div class="meta">${d?'Driver':'Passenger'} · Member since ${esc(u.since)}</div>
    <div class="chips" style="justify-content:center;margin-top:8px"><span class="chip good">${ic('check',12)} Phone verified</span>${u.driverVerified?`<span class="chip good">${ic('shield',12)} ID verified</span>`:''}</div>
    <div class="pstats"><div><b>${st.trips}</b><span>${d?'Trips driven':'Trips taken'}</span></div><div><b>★ ${st.rating}</b><span>Rating</span></div><div><b>${d?st.accept+'%':naira(st.saved)}</b><span>${d?'Acceptance':'Saved by offers'}</span></div></div></div>`;
  const em=u.em&&u.em.name?esc(u.em.name)+' · '+esc(u.em.phone):'Add someone we alert in an emergency';
  const safety=`<h3>Safety</h3><div class="card">${lrow('shield','Emergency contact',em,"S.sheet={type:'em'};render()")}
    ${lrow('share','Share every trip automatically','Your emergency contact gets a live link',null,sw(u.autoShare,'S.user.autoShare=!S.user.autoShare;render()','Share trips automatically'))}</div>`;
  const support=`<h3>Help</h3><div class="card">${lrow('help','Help and support','Chat with us, report a problem',soon('Support'))}${lrow('doc','Terms and privacy','How we use and protect your data',soon('Terms and privacy'))}</div>
    <div class="card">${lrow('logout','Sign out','',"startOnb()",'')}</div><p class="hint center" style="margin:6px 0 4px">RideLink 1.0 · Prototype</p>`;
  if(!d){
    return head+`<h3>Account</h3><div class="card">${lrow('edit','Personal details',esc(u.phone)+(u.email?' · '+esc(u.email):''),"S.sheet={type:'me'};render()")}
      ${lrow('pin','Saved places','Home · '+esc(u.places.home),soon('Saved places'))}
      ${lrow('card','Payment','Card or bank transfer. Held until your trip ends',soon('Payment methods'))}
      ${lrow('bell','Notifications','Offers, replies and pickup alerts',null,sw(u.notif,'S.user.notif=!S.user.notif;render()','Notifications'))}</div>
      ${safety}
      <div class="card promo-card">${u.driverVerified
        ?`<div class="name">You are a verified driver</div><div class="meta">Post a trip and earn from your empty seats.</div><button class="btn sm" style="margin-top:10px" onclick="setMode('driver')">${ic('swap',14)} Switch to driver</button>`
        :`<div class="name">Driving somewhere anyway?</div><div class="meta">Verify your ID and car once, then earn from your empty seats.</div><button class="btn sm" style="margin-top:10px" onclick="startOnb('driver')">${ic('car',14)} Become a driver</button>`}</div>
      ${support}`;
  }
  const v=u.veh, docs=[['id','NIN','Verified with NIMC','Verified'],['id','Driver’s licence','Valid until Aug 2028','Verified'],['doc','Vehicle papers','Insurance renews Jan 2027','Verified'],['camera','Car photos','Front, back and inside','3 photos']];
  return head+`<h3>Your car</h3><div class="card"><div class="row"><span class="carbox">${ic('car',26)}</span><div class="grow"><div class="name">${esc(v.make+' '+v.model)}</div><div class="meta">${esc(v.color||'')}${v.color?' · ':''}${v.seats} passenger seats</div></div><span class="plate">${esc(v.plate)}</span></div></div>
    <h3>Documents</h3><div class="card">${docs.map(([i,t,m,c])=>lrow(i,t,m,null,`<span class="chip good">${c}</span>`)).join('')}</div>
    <h3>Payouts</h3><div class="card">${lrow('bank',esc(u.bank),'Paid every Monday for finished trips',soon('Payout account'))}${lrow('wallet','Earnings',S.hideBal?'Hidden':naira(S.earn.month)+' this month',"S.dtab='up';go('dTrips')")}</div>
    <h3>What passengers say <span class="swipe">Swipe ${ic('arrow',12)}</span></h3>${rail(S.reviews.map(r=>`<div class="rev"><div class="row between"><b>${esc(r.n)}</b><span class="meta">${'★'.repeat(r.s)}</span></div><p>${esc(r.t)}</p></div>`).join(''))}
    <h3>Trip defaults</h3><div class="card">${lrow('tag','Allow offers on new trips','Passengers can negotiate your price',null,sw(u.offersOn,'S.user.offersOn=!S.user.offersOn;S.post.neg=S.user.offersOn;render()','Allow offers'))}
      ${lrow('check','Trip rules',esc(S.post.rules.join(', ')||'None set'),"go('post')")}</div>
    ${safety}<div class="card">${lrow('swap','Switch to passenger','Book a seat on someone else’s trip',"setMode('passenger')")}</div>${support}`;
}
/* ---------- sheets ---------- */
function sheetHTML(){
  const s=S.sheet; if(!s) return '';
  if(s.type==='offer'){ const t=trip(s.tripId), o=s.again?offer(s.again):null, st=t.price<=5000?100:500, start=o?o.counter:Math.max(st,Math.round(t.price*0.85/st)*st);
    return `<div class="sheet" role="dialog" aria-label="Make an offer"><h2>${o?'Counter the driver':'Make an offer'}</h2><p class="sub">Listed price ${naira(t.price)} per seat. The driver can accept, counter or decline.</p>
      <div class="field"><label for="oa">Your price (₦)</label><div class="amt"><button aria-label="Lower by ${st}" onclick="bump(-${st},${t.price})">−</button><input class="input" id="oa" type="number" inputmode="numeric" step="${st}" value="${start}"><button aria-label="Raise by ${st}" onclick="bump(${st},${t.price})">+</button></div><span class="hint">Each tap changes your offer by ${naira(st)}.</span></div>
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
  if(s.type==='filters'){ const n=findTrips().length;
    return `<div class="sheet" role="dialog" aria-label="Filters"><div class="row between"><h2>Filters</h2><button class="link sm" onclick="S.filters=[];S.maxPrice=0;S.sort='best';render()">Reset</button></div>
      <div class="label fl">Sort by</div><div class="chips">${Object.entries(SORTS).map(([k,l])=>`<button class="chip" aria-pressed="${S.sort===k}" onclick="S.sort='${k}';render()">${l}</button>`).join('')}</div>
      <div class="label fl">Most you want to pay</div><div class="chips">${[0,5000,6000,7000].map(v=>`<button class="chip" aria-pressed="${S.maxPrice===v}" onclick="S.maxPrice=${v};render()">${v?naira(v):'Any price'}</button>`).join('')}</div>
      ${FGROUPS.map(([g,ks])=>`<div class="label fl">${g}</div><div class="chips">${ks.map(k=>`<button class="chip" aria-pressed="${S.filters.includes(k)}" onclick="toggleFilter('${k}')">${FILT[k].l}</button>`).join('')}</div>`).join('')}
      <button class="btn" style="margin-top:16px" onclick="S.sheet=null;render()">Show ${n} trip${n===1?'':'s'}</button></div>`; }
  if(s.type==='me'){ const u=S.user;
    return `<div class="sheet" role="dialog" aria-label="Personal details"><h2>Personal details</h2><p class="sub">Your name is shown to drivers and passengers.</p>
      <div class="field"><label for="mn">Full name</label><input class="input" id="mn" value="${esc(u.name)}"></div>
      <div class="field"><label for="mp">Phone</label><input class="input" id="mp" type="tel" value="${esc(u.phone)}"></div>
      <div class="field"><label for="me2">Email (optional)</label><input class="input" id="me2" type="email" value="${esc(u.email)}" placeholder="For receipts"></div>
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Cancel</button><button class="btn" onclick="saveMe()">Save</button></div></div>`; }
  if(s.type==='em'){ const e=S.user.em||{name:'',phone:''};
    return `<div class="sheet" role="dialog" aria-label="Emergency contact"><h2>Emergency contact</h2><p class="sub">We alert this person when you press SOS or share a trip.</p>
      <div class="field"><label for="en">Name</label><input class="input" id="en" value="${esc(e.name)}"></div>
      <div class="field"><label for="ep">Phone</label><input class="input" id="ep" type="tel" value="${esc(e.phone)}"></div>
      <div class="btns"><button class="btn ghost" onclick="S.sheet=null;render()">Cancel</button><button class="btn" onclick="saveEm()">Save</button></div></div>`; }
  if(s.type==='sos') return `<div class="sheet" role="dialog" aria-label="Emergency"><h2>Emergency help</h2><p class="sub">Demo only. In the live app these actions work.</p>
      <div class="btns" style="flex-direction:column"><button class="btn bad" onclick="S.sheet=null;toast('Demo: this would call 112')">Call 112</button><button class="btn ghost" onclick="S.sheet=null;toast('Demo: your emergency contact would be alerted')">Alert my emergency contact</button><button class="btn ghost" onclick="S.sheet=null;toast('Demo: live location would be shared')">Share live location</button><button class="btn ghost" onclick="S.sheet=null;render()">Close</button></div></div>`;
  return '';
}
function bump(d,max){ const el=$('#oa'), st=Math.abs(d); const v=Math.min(max,Math.max(st,Math.round(((+el.value||0)+d)/st)*st)); el.value=v; }
function submitOffer(tripId, again){ const v=+$('#oa').value, t=trip(tripId); if(!(v>0)){ toast('Enter an amount'); return; } if(v>t.price){ toast('Offer is above the listed price. Use the listed price instead.'); return; } sendOffer(tripId,v,again||undefined); }
function submitCounter(id){ const v=+$('#oa').value, i=S.incoming.find(x=>x.id===id), t=trip(i.tripId); if(!(v>0)){ toast('Enter an amount'); return; }
  i.status='countered'; i.counter=v; S.sheet=null; render();
  setTimeout(()=>{ if(i.status==='countered'){ i.status='accepted'; i.amount=v; if(t.seats>0) t.seats--; toast(i.name.split(' ')[0]+' accepted '+naira(v)); } },2200); }
function saveMe(){ const n=$('#mn').value.trim(); if(!n){ toast('Add your name'); return; } Object.assign(S.user,{name:n,phone:$('#mp').value.trim(),email:$('#me2').value.trim()}); S.sheet=null; render(); toast('Details saved'); }
function saveEm(){ S.user.em={name:$('#en').value.trim(),phone:$('#ep').value.trim()}; S.sheet=null; render(); toast('Emergency contact saved'); }
function buyBoost(id){ const t=trip(id), plans=['3 hours','12 hours','24 hours']; t.boosted=true; t.boost=plans[S.plan]; S.sheet=null; render(); toast('Boost is live. You are first in search.'); }
function submitRate(bid){ const b=S.bookings.find(x=>x.id===bid); if(b) b.rated=true; S.sheet=null; render(); toast('Thanks. Your rating helps other riders.'); }

/* ---------- shell: header, tabs, render ---------- */
function renderHeader(){
  $('#hdr').innerHTML=`<button class="logo" onclick="goHome()" aria-label="RideLink home"><img class="full" src="assets/logo.png" alt="RideLink"><img class="mark" src="assets/logo-mark.png" alt="RideLink"></button>
  <div class="seg" role="tablist" aria-label="Mode" data-m="${S.mode}"><span class="thumb"></span>
    <button role="tab" aria-selected="${S.mode==='passenger'}" onclick="setMode('passenger')">${ic('profile',14)}<span class="l1">Passenger</span></button>
    <button role="tab" aria-selected="${S.mode==='driver'}" onclick="setMode('driver')">${ic('car',14)}<span class="l1">Driver</span></button></div>
  <button class="me" onclick="go('profile')" aria-label="Profile">${face(S.user)}</button>`;
}
const TABS = {
  passenger:[['trips','Trips','trips'],['find','Find a ride','find'],['profile','Profile','profile']],
  driver:[['dTrips','Trips','trips'],['post','Post a trip','post'],['profile','Profile','profile']]
};
function renderTabs(){
  const sub={req:'dTrips',detail:'find',thread:'trips',confirmed:'trips',track:S.mode==='driver'?'dTrips':'trips'}, cur=sub[S.view]||S.view, n=unread();
  $('#tabs').innerHTML=TABS[S.mode].map(([k,l,icn],idx)=> idx===1
    ? `<button class="fab" onclick="go('${k}')" ${cur===k?'aria-current="page"':''}><span class="disc">${ic(icn,24)}</span>${l}</button>`
    : `<button class="t" ${cur===k?'aria-current="page"':''} onclick="go('${k}')">${ic(icn,21)}${l}${idx===0&&n&&cur!==k?'<span class="dot" aria-label="New activity"></span>':''}</button>`).join('');
}
const VIEWS = {req:vReq,find:vFind,detail:vDetail,thread:vThread,confirmed:vConfirmed,trips:vTrips,track:vTrack,profile:vProfile,post:vPost,dTrips:vDTrips};
function render(){
  const ph=$('#phone'); ph.dataset.mode=S.mode; ph.classList.toggle('onb',S.onbOn); ph.classList.toggle('splash',S.onbOn&&S.onb.step==='splash');
  const sc=$('#screen'), top=sc.scrollTop;
  const ae=document.activeElement, fid=ae&&ae.id&&ae.matches('input')?ae.id:null, sel=fid&&ae.type!=='number'?[ae.selectionStart,ae.selectionEnd]:null;
  $('#view').innerHTML=S.onbOn?vOnb():(VIEWS[S.view]||vFind)(); sc.scrollTop=top; syncMaps(); requestAnimationFrame(syncMaps);
  if(fid){ const el=document.getElementById(fid); if(el){ el.focus({preventScroll:true}); if(sel) try{ el.setSelectionRange(sel[0],sel[1]); }catch(e){} } }
  if(SG.field&&fid) drawSugg();
  if(!S.onbOn){ renderHeader(); renderTabs(); if(!LOC.started){ LOC.started=true; startLoc(false); } }
  ph.querySelectorAll('.backdrop,.toast').forEach(e=>e.remove());
  if(S.sheet&&!S.onbOn){ const b=document.createElement('div'); b.className='backdrop'; b.innerHTML=sheetHTML(); b.addEventListener('click',e=>{ if(e.target===b){ S.sheet=null; render(); } }); ph.appendChild(b); }
  if(S.toast){ const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=S.toast; ph.appendChild(t); }
}

/* ---------- device preview (iPhone, folded, unfolded) ---------- */
const DEVICES = {iphone:{n:'iPhone',w:390,h:844},cover:{n:'Fold · folded',w:280,h:653},open:{n:'Fold · open',w:700,h:760}};
function renderDevbar(){ $('#devbar').innerHTML=Object.entries(DEVICES).map(([k,d])=>`<button aria-pressed="${S.dev===k}" onclick="setDevice('${k}')">${d.n}</button>`).join(''); }
function setDevice(k){ S.dev=k; const d=DEVICES[k], p=$('#phone'); p.className='phone dev-'+k+(S.onbOn?' onb':'')+(S.onbOn&&S.onb.step==='splash'?' splash':''); p.style.width=d.w+'px'; p.style.height=d.h+'px'; renderDevbar(); fit(); render(); }
function fit(){
  const bare=innerWidth<=520||matchMedia('(pointer:coarse)').matches; document.body.classList.toggle('bare',bare);
  const d=DEVICES[S.dev], p=$('#phone');
  p.style.transform=bare?'':'scale('+Math.min(1,(innerHeight-96)/d.h,(innerWidth-48)/d.w)+')';
}
addEventListener('resize',()=>{ fit(); syncMaps(); });
let lastBand=''; const phoneRO=new ResizeObserver(()=>{ const w=$('#phone').clientWidth, band=(w>=600)+'|'+(w<=340); if(band!==lastBand){ lastBand=band; render(); } else syncMaps(); }); phoneRO.observe($('#phone'));
if(document.fonts) document.fonts.ready.then(syncMaps);

/* mouse drag for swipeable rails (touch swipes natively) */
let drag=null, dragUntil=0;
document.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse')return; const r=e.target.closest('.rail'); if(r) drag={r,x:e.clientX,sl:r.scrollLeft,moved:false}; });
document.addEventListener('pointermove',e=>{ if(!drag)return; const dx=e.clientX-drag.x; if(Math.abs(dx)>5){ drag.moved=true; drag.r.classList.add('drag'); } if(drag.moved) drag.r.scrollLeft=drag.sl-dx; });
addEventListener('pointerup',()=>{ if(drag){ drag.r.classList.remove('drag'); if(drag.moved) dragUntil=Date.now()+60; drag=null; } });
document.addEventListener('click',e=>{ if(Date.now()<dragUntil){ e.stopPropagation(); e.preventDefault(); } },true);

setDevice('iphone');

/* boot screen: the logo shows first on every refresh */
(()=>{ const b=document.getElementById('boot'); if(!b) return; const t0=performance.now();
  const hide=()=>setTimeout(()=>{ b.classList.add('out'); setTimeout(()=>b.remove(),450); },Math.max(0,1400-(performance.now()-t0)));
  document.readyState==='complete'?hide():addEventListener('load',hide,{once:true}); setTimeout(hide,4000); })();
