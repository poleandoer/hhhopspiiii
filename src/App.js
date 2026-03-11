import { useState, useRef, useEffect } from "react";
import imgAiHealth  from "./images/ai-health.png";
import imgProviders from "./images/providers.png";
import imgTourism   from "./images/tourism.png";
import imgAiAvatar  from "./images/ai-avatar.png";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  teal: "#5ACAD6", tealDk: "#3FB5C2", tealLt: "#EAF7F9", tealBg: "#F2FBFC",
  white: "#FFFFFF", offWhite: "#F6F9FA", gray: "#F0F3F5", grayMd: "#D8E0E8",
  text: "#0E1C26", textMd: "#3A4A5C", textSm: "#7A8FA0",
  border: "#D6E4EA", borderLt: "#EAF1F4",
  red: "#E04C4C", redLt: "#FFF4F4", redBd: "#F9BFBF",
  green: "#1AA37A", greenLt: "#E5F7F1",
  amber: "#D08A0A", amberLt: "#FEF9EB",
  blue: "#2563EB", blueLt: "#EFF6FF",
  purple: "#6B31D4", purpleLt: "#F0EAFF",
};

const GLOBAL_CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: ${C.offWhite}; color: ${C.text}; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  .fade-up { animation: fadeUp .22s ease forwards; }
  .nav-link { position:relative; font-size:13.5px; font-weight:500; cursor:pointer; padding:5px 0; transition:color .18s; color:${C.textSm}; background:none; border:none; font-family:inherit; letter-spacing:.01em; }
  .nav-link:hover { color:${C.teal}; }
  .nav-link::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:${C.teal}; transition:width .22s ease; border-radius:2px; }
  .nav-link:hover::after { width:100%; }
  .nav-link.accent { color:${C.teal}; font-weight:600; }
  .btn-primary { transition:background .15s, transform .1s, box-shadow .15s; }
  .btn-primary:hover { background:${C.tealDk} !important; transform:translateY(-1px); box-shadow:0 4px 12px rgba(11,191,191,.3); }
  .btn-ghost { transition:all .15s; }
  .btn-ghost:hover { border-color:${C.teal} !important; color:${C.teal} !important; background:${C.tealLt} !important; }
  .card { transition:box-shadow .18s, transform .18s; }
  .card:hover { box-shadow:0 6px 24px rgba(11,191,191,.14) !important; transform:translateY(-2px); }
  .cal-cell { transition:background .12s; cursor:pointer; }
  .cal-cell:hover { background:${C.tealLt}; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:${C.grayMd}; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:${C.teal}; }
  * { scrollbar-width:thin; scrollbar-color:${C.grayMd} transparent; }
  @media (max-width:700px) {
    .nav-desktop { display:none !important; }
    .hamburger { display:flex !important; }
  }
  @media (min-width:701px) {
    .hamburger { display:none !important; }
    .mobile-menu-panel { display:none !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROVIDERS = [
  { id:1, name:"Dr. Sarah Mitchell", specialty:"Family Medicine", rating:4.8, reviews:312, distance:0.8, city:"Toronto", address:"120 King St W", hours:"Mon–Fri 9–5", phone:"+1 416-555-0192", image:"SM", tags:["Family Medicine","Preventive Care"], contracted:true, hasCalendar:true },
  { id:2, name:"Dr. James Okafor", specialty:"Cardiology", rating:4.9, reviews:187, distance:1.2, city:"Toronto", address:"340 Bay St", hours:"Tue–Sat 10–6", phone:"+1 416-555-0234", image:"JO", tags:["Cardiology","Internal Medicine"], contracted:true, hasCalendar:true },
  { id:3, name:"Dr. Elena Vasquez", specialty:"Dermatology", rating:4.7, reviews:421, distance:2.1, city:"Toronto", address:"88 Bloor St E", hours:"Mon–Thu 8–4", phone:"+1 416-555-0311", image:"EV", tags:["Dermatology","Cosmetic"], contracted:false, hasCalendar:false },
  { id:4, name:"Toronto Medical Spa", specialty:"Medical Aesthetics", rating:4.6, reviews:530, distance:1.5, city:"Toronto", address:"55 Avenue Rd", hours:"Daily 10–7", phone:"+1 416-555-0445", image:"TM", tags:["Botox","Injectables","Skin Care"], contracted:true, hasCalendar:true },
  { id:5, name:"Dr. Amir Patel", specialty:"Orthopedics", rating:4.5, reviews:203, distance:3.4, city:"Vancouver", address:"200 Burrard St", hours:"Mon–Fri 8–3", phone:"+1 604-555-0678", image:"AP", tags:["Orthopedics","Sports Medicine"], contracted:false, hasCalendar:false },
  { id:6, name:"Dr. Priya Sharma", specialty:"Cardiology", rating:4.3, reviews:156, distance:4.2, city:"Toronto", address:"600 University Ave", hours:"MWF 9–4", phone:"+1 416-555-0789", image:"PS", tags:["Cardiology","Echocardiography"], contracted:false, hasCalendar:false },
  { id:7, name:"HealthCross Clinic", specialty:"Family Medicine", rating:4.2, reviews:89, distance:5.1, city:"Vancouver", address:"1081 Burrard St", hours:"Daily 8–8", phone:"+1 604-555-0890", image:"HC", tags:["Family Medicine","Walk-in"], contracted:false, hasCalendar:false },
];

const FACILITATORS = [
  { id:10, name:"MedTravel Facilitators", rating:4.9, reviews:98, city:"Toronto", image:"MT", tags:["Hair Transplant","Cosmetic Surgery","International"], contracted:true, countries:["Turkey","Thailand","Poland"], languages:["EN","FR","TR"], procedures:["Hair Transplant","Rhinoplasty","Dental"] },
  { id:11, name:"GlobalCare Connect", rating:4.7, reviews:145, city:"Vancouver", image:"GC", tags:["Dental","Cosmetic","Eastern Europe"], contracted:true, countries:["Hungary","Czech Republic","Thailand"], languages:["EN","DE"], procedures:["Dental","Cosmetic Surgery","Orthopedics"] },
  { id:12, name:"HealthBridge International", rating:4.8, reviews:211, city:"Toronto", image:"HB", tags:["Cardiac","Oncology","Complex Surgery"], contracted:true, countries:["Germany","India","South Korea"], languages:["EN","HI","KO"], procedures:["Cardiac Surgery","Cancer Treatment","Joint Replacement"] },
  { id:13, name:"MediRoute Global", rating:4.6, reviews:77, city:"Montreal", image:"MR", tags:["Fertility","Ophthalmology","Dental"], contracted:false, countries:["Spain","Cyprus","Mexico"], languages:["EN","FR","ES"], procedures:["IVF","LASIK","Dental Implants"] },
];

// ─── INTERNATIONAL CLINICS DATA ───────────────────────────────────────────────
const INTL_CLINICS = [
  { id:101, name:"Estetik International", country:"Turkey", city:"Istanbul", flag:"🇹🇷", procedures:["Hair Transplant","Rhinoplasty","Liposuction","Dental Veneers"], description:"One of Turkey's largest accredited medical aesthetic centers, recognized internationally for hair restoration and cosmetic surgery with over 20 years of experience.", image:"EI", rating:4.8, reviews:1240 },
  { id:102, name:"Bumrungrad International", country:"Thailand", city:"Bangkok", flag:"🇹🇭", procedures:["Cardiac Surgery","Orthopedics","Oncology","General Surgery"], description:"A JCI-accredited hospital recognized among Asia's leading medical centers, treating over 1.1 million patients annually including 520,000 international patients.", image:"BI", rating:4.9, reviews:3100 },
  { id:103, name:"Charité – Universitätsmedizin", country:"Germany", city:"Berlin", flag:"🇩🇪", procedures:["Neurology","Cancer Treatment","Cardiac Surgery","Rare Diseases"], description:"Germany's largest university hospital and one of Europe's most prestigious medical institutions, offering cutting-edge diagnostics and specialist treatments.", image:"CH", rating:4.9, reviews:890 },
  { id:104, name:"Apollo Hospitals", country:"India", city:"Chennai", flag:"🇮🇳", procedures:["Cardiac Surgery","Bone Marrow Transplant","Liver Transplant","Orthopedics"], description:"India's largest healthcare group, JCI-accredited, providing world-class tertiary care at significantly lower costs than Western countries.", image:"AH", rating:4.7, reviews:2700 },
  { id:105, name:"Quirónsalud Barcelona", country:"Spain", city:"Barcelona", flag:"🇪🇸", procedures:["IVF","Dental Implants","Orthopedics","Ophthalmology"], description:"Spain's leading private hospital group offering fertility treatments, dental care, and surgical procedures with multilingual staff across 50+ centers.", image:"QB", rating:4.6, reviews:640 },
  { id:106, name:"Samsung Medical Center", country:"South Korea", city:"Seoul", flag:"🇰🇷", procedures:["Cancer Treatment","Robotic Surgery","Cardiology","Stem Cell Therapy"], description:"One of Asia's top-ranked hospitals known for advanced robotic surgery and cancer treatment programs, consistently ranked among the world's best.", image:"SM", rating:4.9, reviews:1870 },
  { id:107, name:"Medicover Dental Warsaw", country:"Poland", city:"Warsaw", flag:"🇵🇱", procedures:["Dental Implants","Veneers","Full Mouth Rehabilitation","Orthodontics"], description:"Premium dental care clinic offering European-standard treatments at 40–60% lower cost than the UK, US, or Canada, with English-speaking staff.", image:"MD", rating:4.7, reviews:520 },
  { id:108, name:"Clinique des Cèdres", country:"France", city:"Toulouse", flag:"🇫🇷", procedures:["Bariatric Surgery","Cardiac Surgery","Orthopedics","Neurosurgery"], description:"Internationally recognized French private hospital offering specialist surgeries with state-of-the-art facilities and post-operative rehabilitation programs.", image:"CC", rating:4.8, reviews:390 },
];

const CHAT_RESPONSES = [
  { trigger:["headache","head","migraine"], response:"Based on your symptoms, this could be a tension headache or migraine.\n\n- Rest in a quiet, dark room\n- Drink at least 2 glasses of water\n- Ibuprofen or acetaminophen may help\n- Cold or warm compress on forehead\n\nIf headache is sudden, severe, or accompanied by fever or stiff neck — seek emergency care immediately.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["chest","heart","breathing","breath"], response:"IMPORTANT — Chest pain or difficulty breathing may indicate a serious condition.\n\nIf you have severe chest pain, shortness of breath, or pain in your arm or jaw — call 911 immediately.\n\nDo not wait. Please seek care now.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, emergency:true },
  { trigger:["cold","flu","fever","cough","sore throat"], response:"Your symptoms suggest a common cold or flu.\n\n- Rest as much as possible\n- Warm liquids like broth or tea\n- Honey and lemon for sore throat\n- Saline nasal rinse for congestion\n- Fever above 39.5°C — see a doctor\n\nMost symptoms resolve within 7–10 days.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:false },
  { trigger:["hair","transplant","turkey","abroad","facilitator","medical tourism","find care abroad","international","surgery abroad","treatment abroad","cheapest","knee replacement abroad","dental abroad"], response:"For procedures abroad, a Medical Tourism Facilitator handles:\n\n- Finding accredited clinics\n- Travel & accommodation\n- Document translation\n- Pre/post-procedure coordination\n\nAlways verify clinic credentials before proceeding.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, facilitator:true, showFacilitatorCTA:true },
  { trigger:["cardiologist","cardiology","heart doctor"], response:"Cardiology specialists diagnose and treat heart and vascular conditions. Consider their subspecialty, hospital affiliations, and new patient wait times.\n\nHere are cardiologists available near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dermatologist","skin","acne","rash"], response:"A dermatologist can evaluate skin conditions properly. In the meantime: avoid touching the area, keep it clean, and protect from sun exposure.\n\nHere are dermatologists available near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
];
const DEFAULT_RESPONSE = { response:"I recommend consulting a healthcare professional for proper evaluation.\n\n- Monitor your symptoms\n- Stay hydrated and rest\n\nWould you like help finding a specialist?\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true };

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const r of CHAT_RESPONSES) { if (r.trigger.some(t => lower.includes(t))) return r; }
  return DEFAULT_RESPONSE;
}

function isInternationalQuery(input) {
  const lower = input.toLowerCase();
  const intlKeywords = ["abroad","turkey","thailand","india","germany","poland","spain","korea","international","overseas","medical tourism","find care abroad","cheapest","hair transplant","surgery abroad","treatment abroad","dental abroad"];
  return intlKeywords.some(k => lower.includes(k));
}

const ALL_TIMES = ["8:00","8:30","9:00","9:30","10:00","10:30","11:00","11:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00"];

// ─── CALENDAR DATA ────────────────────────────────────────────────────────────
const INIT_EVENTS = [
  { id:1, date:"2026-03-06", time:"9:00",  patient:"Alex K.",  reason:"Annual checkup",  status:"confirmed", color:C.teal,  visitApproved:false },
  { id:2, date:"2026-03-06", time:"10:30", patient:"Maria R.", reason:"Follow-up",        status:"confirmed", color:C.teal,  visitApproved:false },
  { id:3, date:"2026-03-06", time:"13:00", patient:"Sam T.",   reason:"Consultation",     status:"pending",   color:C.amber, visitApproved:false },
  { id:4, date:"2026-03-06", time:"15:00", patient:"Lisa P.",  reason:"New patient",      status:"pending",   color:C.amber, visitApproved:false },
  { id:5, date:"2026-03-09", time:"9:30",  patient:"John M.",  reason:"Skin treatment",   status:"confirmed", color:C.teal,  visitApproved:false },
  { id:6, date:"2026-03-09", time:"11:00", patient:"Sara B.",  reason:"Botox session",    status:"confirmed", color:C.teal,  visitApproved:false },
  { id:7, date:"2026-03-10", time:"10:00", patient:"Tom W.",   reason:"Check-up",         status:"pending",   color:C.amber, visitApproved:false },
  { id:8, date:"2026-03-11", time:"14:00", patient:"Nina S.",  reason:"Consultation",     status:"confirmed", color:C.teal,  visitApproved:false },
  { id:9, date:"2026-03-12", time:"9:00",  patient:"Paul D.",  reason:"Injectables",      status:"pending",   color:C.amber, visitApproved:false },
  { id:10,date:"2026-03-13", time:"16:00", patient:"Amy C.",   reason:"Follow-up",        status:"confirmed", color:C.teal,  visitApproved:false },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function Badge({ children, color = C.teal, bg = C.tealLt, small }) {
  return <span style={{ background:bg, color, fontSize:small?9:10, fontWeight:700, padding:small?"1px 6px":"2px 9px", borderRadius:20, letterSpacing:.4, whiteSpace:"nowrap" }}>{children}</span>;
}

function Chip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 13px", border:`1.5px solid ${active?(color||C.teal):C.border}`, borderRadius:20, background:active?(color?color+"15":C.tealLt):C.white, color:active?(color||C.teal):C.textSm, fontSize:12, cursor:"pointer", fontWeight:active?700:400, fontFamily:"inherit", transition:"all .15s" }}>{label}</button>
  );
}

function FooterLink({ onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:"none", border:"none", fontSize:12.5, color:h?C.teal:C.textSm, cursor:"pointer", fontFamily:"inherit", fontWeight:600, textDecoration:h?"underline":"none", transition:"color .15s" }}>
      {children}
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ setPage, isProviderView, setIsProviderView, isFacilitatorView, setIsFacilitatorView }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label:"Providers", page:"directory" },
    { label:"AI Assistant", page:"chat" },
    { label:"International", page:"international" },
  ];
  return (
    <>
      <nav style={{ height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:200 }}>
        <div onClick={() => { setPage("home"); setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="9.5" cy="9.5" r="7" stroke="#047598" strokeWidth="2.8"/>
            <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="#047598" strokeWidth="2.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-.3px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598", fontWeight:800 }}>.com</span></span>
        </div>
        <ul className="nav-desktop" style={{ display:"flex", gap:28, listStyle:"none" }}>
          {links.map(l => <li key={l.label}><button className={`nav-link${l.accent?" accent":""}`} onClick={() => setPage(l.page)}>{l.label}</button></li>)}
        </ul>
        <div className="nav-desktop" style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button className="btn-ghost" onClick={() => setPage("login")} style={{ padding:"7px 18px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
          <button className="btn-primary" onClick={() => setPage("signup")} style={{ padding:"7px 18px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
          {/* Provider dashboard toggle */}
          <button title="Provider Dashboard" onClick={() => { setIsProviderView(v=>!v); setIsFacilitatorView(false); }} style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${isProviderView?C.teal:C.border}`, background:isProviderView?C.tealLt:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isProviderView?C.teal:C.textSm} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          {/* Facilitator dashboard toggle */}
          <button title="Facilitator Dashboard" onClick={() => { setIsFacilitatorView(v=>!v); setIsProviderView(false); }} style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${isFacilitatorView?C.purple:C.border}`, background:isFacilitatorView?C.purpleLt:C.white, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isFacilitatorView?C.purple:C.textSm} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
        <button className="hamburger" onClick={() => setOpen(o=>!o)} style={{ display:"none", flexDirection:"column", gap:5, background:"none", border:"none", cursor:"pointer", padding:4 }}>
          {[0,1,2].map(i => <span key={i} style={{ width:20, height:2, background:C.text, borderRadius:2, display:"block", transition:"all .2s",
            transform: open ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"none") : "none",
            opacity: open && i===1 ? 0 : 1 }} />)}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu-panel fade-up" style={{ position:"fixed", top:58, left:0, right:0, background:C.white, borderBottom:`1px solid ${C.border}`, zIndex:199, padding:"12px 20px 20px", boxShadow:"0 8px 24px rgba(0,0,0,.1)" }}>
          {links.map(l => <button key={l.label} onClick={() => { setPage(l.page); setOpen(false); }} style={{ display:"block", width:"100%", textAlign:"left", padding:"13px 0", background:"none", border:"none", borderBottom:`1px solid ${C.borderLt}`, fontSize:15, fontWeight:l.accent?700:500, color:l.accent?C.teal:C.text, cursor:"pointer", fontFamily:"inherit" }}>{l.label}</button>)}
          <div style={{ display:"flex", gap:8, marginTop:16 }}>
            <button onClick={() => { setPage("login"); setOpen(false); }} style={{ flex:1, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
            <button onClick={() => { setPage("signup"); setOpen(false); }} style={{ flex:1, padding:"11px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
          </div>
          <button onClick={() => { setIsProviderView(v=>!v); setIsFacilitatorView(false); setOpen(false); }} style={{ marginTop:8, width:"100%", padding:"10px", border:`1px solid ${isProviderView?C.teal:C.border}`, borderRadius:10, background:isProviderView?C.tealLt:C.white, color:isProviderView?C.teal:C.textSm, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {isProviderView ? "← Exit Provider View" : "Switch to Provider View"}
          </button>
          <button onClick={() => { setIsFacilitatorView(v=>!v); setIsProviderView(false); setOpen(false); }} style={{ marginTop:6, width:"100%", padding:"10px", border:`1px solid ${isFacilitatorView?C.purple:C.border}`, borderRadius:10, background:isFacilitatorView?C.purpleLt:C.white, color:isFacilitatorView?C.purple:C.textSm, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            {isFacilitatorView ? "← Exit Facilitator View" : "Switch to Facilitator View"}
          </button>
        </div>
      )}
    </>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function SocialBtn({ letter, label }) {
  const [h, setH] = useState(false);
  return (
    <button onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"10px 16px", border:`1.5px solid ${h?C.teal:C.border}`, borderRadius:10, background:h?C.tealLt:C.white, cursor:"pointer", fontSize:14, fontWeight:500, color:C.text, transition:"all .15s", marginBottom:9, fontFamily:"inherit" }}>
      <span style={{ width:24, height:24, borderRadius:6, background:C.gray, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:C.textSm, flexShrink:0 }}>{letter}</span>
      {label}
    </button>
  );
}

function FieldInput({ label, type, value, onChange, placeholder, hint, right }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom:14 }}>
      {label && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
        <label style={{ fontSize:12, fontWeight:700, color:C.text }}>{label}</label>
        {hint}
      </div>}
      <div style={{ position:"relative" }}>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder}
          style={{ width:"100%", padding: right ? "10px 44px 10px 13px" : "10px 13px", border:`1.5px solid ${focus?C.teal:C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color .15s", color:C.text, background:C.white }}
          onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} />
        {right}
      </div>
    </div>
  );
}

// Role Selector — shown at top of login/signup
function RoleSelector({ role, setRole }) {
  return (
    <div style={{ display:"flex", gap:10, marginBottom:22 }}>
      {[{val:"patient",label:"I'm a Patient"},{val:"provider",label:"I'm a Provider"}].map(r=>(
        <button key={r.val} onClick={()=>setRole(r.val)} style={{ flex:1, padding:"14px 10px", border:`2px solid ${role===r.val?C.teal:C.border}`, borderRadius:14, background:role===r.val?C.tealLt:C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:13, fontWeight:700, color:role===r.val?C.teal:C.textMd }}>{r.label}</span>
        </button>
      ))}
    </div>
  );
}

function LoginPage({ setPage }) {
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ email:"", pw:"" });
  const [show, setShow] = useState(false);
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:400, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom:10 }}>
            <circle cx="15" cy="15" r="10" stroke="#047598" strokeWidth="3.2"/>
            <line x1="22" y1="22" x2="32" y2="32" stroke="#047598" strokeWidth="3.2" strokeLinecap="round"/>
          </svg>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Sign In</h2>
          <p style={{ color:C.textSm, fontSize:13 }}>Sign in to your Hospital.com account</p>
        </div>
        <RoleSelector role={role} setRole={setRole}/>
        <SocialBtn letter="G" label="Continue with Google" />
        <SocialBtn letter="A" label="Continue with Apple" />
        <SocialBtn letter="f" label="Continue with Facebook" />
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
        </div>
        <FieldInput label="Email" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
        <FieldInput label="Password" type={show?"text":"password"} value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))} placeholder="••••••••"
          hint={<button onClick={()=>{}} style={{ background:"none", border:"none", fontSize:12, color:C.teal, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>Forgot?</button>}
          right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
        <button className="btn-primary" onClick={()=>setPage("home")} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Sign In as {role==="patient"?"Patient":"Provider"}</button>
        <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:18 }}>No account?{" "}<button onClick={()=>setPage("signup")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign Up</button></p>
      </div>
    </div>
  );
}

function SignupPage({ setPage }) {
  const [role, setRole] = useState("patient");
  // Patient state
  const [f, setF] = useState({ name:"", email:"", pw:"" });
  const [show, setShow] = useState(false);
  // Provider state
  const [pf, setPf] = useState({ clinicName:"", specialty:"", location:"", email:"", phone:"" });
  const [providerDone, setProviderDone] = useState(false);

  if (role === "provider") {
    if (providerDone) {
      return (
        <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
          <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding:"40px 34px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <h2 style={{ fontSize:21, fontWeight:800, marginBottom:10 }}>Application Submitted!</h2>
            <p style={{ color:C.textSm, fontSize:14, lineHeight:1.6, marginBottom:22 }}>Thank you for your interest in joining Hospital.com as a provider. Our admin team will review your application and your profile will go live once approved.</p>
            <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:12, padding:"13px 16px", marginBottom:24, textAlign:"left" }}>
              <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:4 }}>Pending Admin Review</div>
              <div style={{ fontSize:13, color:"#78350F" }}>You will be notified by email once your account is approved. This typically takes 1–2 business days.</div>
            </div>
            <button className="btn-primary" onClick={()=>setPage("home")} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Back to Home</button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom:10 }}>
              <circle cx="15" cy="15" r="10" stroke="#047598" strokeWidth="3.2"/>
              <line x1="22" y1="22" x2="32" y2="32" stroke="#047598" strokeWidth="3.2" strokeLinecap="round"/>
            </svg>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Provider Registration</h2>
            <p style={{ color:C.textSm, fontSize:13 }}>Submit your details for admin review</p>
          </div>
          <RoleSelector role={role} setRole={setRole}/>
          <FieldInput label="Clinic / Practice Name *" type="text" value={pf.clinicName} onChange={e=>setPf(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
          <FieldInput label="Specialty *" type="text" value={pf.specialty} onChange={e=>setPf(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Family Medicine" />
          <FieldInput label="Location / City *" type="text" value={pf.location} onChange={e=>setPf(p=>({...p,location:e.target.value}))} placeholder="e.g. Toronto, ON" />
          <FieldInput label="Email *" type="email" value={pf.email} onChange={e=>setPf(p=>({...p,email:e.target.value}))} placeholder="clinic@example.com" />
          <FieldInput label="Phone" type="tel" value={pf.phone} onChange={e=>setPf(p=>({...p,phone:e.target.value}))} placeholder="+1 416-555-0000" />
          <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:12.5, color:"#92400E" }}>
            Provider accounts require admin approval before going live.
          </div>
          <button className="btn-primary" onClick={()=>setProviderDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Submit for Review</button>
          <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:14 }}>Have an account?{" "}<button onClick={()=>setPage("login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
        </div>
      </div>
    );
  }

  // Patient signup
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:400, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom:10 }}>
            <circle cx="15" cy="15" r="10" stroke="#047598" strokeWidth="3.2"/>
            <line x1="22" y1="22" x2="32" y2="32" stroke="#047598" strokeWidth="3.2" strokeLinecap="round"/>
          </svg>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Create account</h2>
          <p style={{ color:C.textSm, fontSize:13 }}>Join thousands of patients and providers</p>
        </div>
        <RoleSelector role={role} setRole={setRole}/>
        <SocialBtn letter="G" label="Sign up with Google" />
        <SocialBtn letter="A" label="Sign up with Apple" />
        <SocialBtn letter="f" label="Sign up with Facebook" />
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
        </div>
        <FieldInput label="Full name" type="text" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Jane Doe" />
        <FieldInput label="Email" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
        <FieldInput label="Password" type={show?"text":"password"} value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))} placeholder="Min. 8 characters"
          right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
        <button className="btn-primary" onClick={()=>setPage("home")} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Create Account</button>
        <p style={{ textAlign:"center", fontSize:11, color:C.textSm, marginTop:12 }}>By signing up you agree to our Terms & Privacy Policy.</p>
        <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:10 }}>Have an account?{" "}<button onClick={()=>setPage("login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
      </div>
    </div>
  );
}

// ─── BECOME A PROVIDER PAGE ───────────────────────────────────────────────────
function BecomeProviderPage({ setPage }) {
  const [f, setF] = useState({ clinicName:"", contactName:"", email:"", phone:"", specialty:"", city:"" });
  const [done, setDone] = useState(false);
  if (done) {
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:480, background:C.white, borderRadius:20, padding:"44px 36px", boxShadow:"0 8px 40px rgba(11,191,191,.1)", textAlign:"center" }}>
          <div style={{ width:60, height:60, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <h2 style={{ fontSize:22, fontWeight:800, marginBottom:10 }}>Application Received!</h2>
          <p style={{ color:C.textSm, fontSize:14.5, lineHeight:1.65 }}>Thank you! Our team will review your application and get back to you within 2 business days.</p>
          <button className="btn-primary" onClick={()=>setPage("home")} style={{ marginTop:28, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Back to Home</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", background:`linear-gradient(155deg, ${C.white} 50%, ${C.tealBg} 100%)` }}>
      <div style={{ maxWidth:780, margin:"0 auto", padding:"44px 20px" }}>
        <div className="fade-up" style={{ marginBottom:40, textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"5px 14px", marginBottom:16 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.teal }}>FOR PROVIDERS</span>
          </div>
          <h1 style={{ fontSize:34, fontWeight:800, letterSpacing:"-.4px", marginBottom:14 }}>Become a Provider on <span style={{ color:C.teal }}>Hospital.com</span></h1>
          <p style={{ color:C.textSm, fontSize:16, maxWidth:560, margin:"0 auto" }}>Join Canada's growing healthcare network and connect with thousands of patients looking for quality care.</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14, marginBottom:44 }}>
          {[
            { icon:"→", title:"Targeted Reach", desc:"Get discovered by patients actively searching for your specialty in your city." },
            { icon:"→", title:"Seamless Bookings", desc:"Integrated calendar lets patients book directly — reducing admin overhead for your team." },
            { icon:"→", title:"Real-Time Analytics", desc:"Track visits, calls, and bookings from your provider dashboard. Pay only for the leads you receive." },
          ].map(b => (
            <div key={b.title} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 20px", boxShadow:"0 1px 6px rgba(0,0,0,.05)" }}>
              <div style={{ fontWeight:800, fontSize:13, color:C.teal, marginBottom:12, letterSpacing:1 }}>{b.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:7 }}>{b.title}</div>
              <div style={{ color:C.textSm, fontSize:13.5, lineHeight:1.6 }}>{b.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 32px", maxWidth:560, margin:"0 auto", boxShadow:"0 4px 20px rgba(11,191,191,.09)" }}>
          <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6 }}>Request Partnership</h2>
          <p style={{ color:C.textSm, fontSize:13, marginBottom:24 }}>Fill in your details and our team will be in touch.</p>
          <FieldInput label="Clinic / Practice Name *" type="text" value={f.clinicName} onChange={e=>setF(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
          <FieldInput label="Contact Name *" type="text" value={f.contactName} onChange={e=>setF(p=>({...p,contactName:e.target.value}))} placeholder="Your full name" />
          <FieldInput label="Email *" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@clinic.com" />
          <FieldInput label="Phone" type="tel" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 416-555-0000" />
          <FieldInput label="Specialty *" type="text" value={f.specialty} onChange={e=>setF(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Family Medicine" />
          <FieldInput label="City" type="text" value={f.city} onChange={e=>setF(p=>({...p,city:e.target.value}))} placeholder="e.g. Toronto, ON" />
          <button className="btn-primary" onClick={()=>setDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Request Partnership</button>
        </div>
      </div>
    </div>
  );
}

// ─── FACILITATOR CONTACT FORM MODAL ──────────────────────────────────────────
function FacilitatorModal({ onClose }) {
  const [f, setF] = useState({ name:"", email:"", phone:"", procedure:"", country:"", message:"" });
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
      <div className="fade-up" style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:500, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.white, zIndex:10 }}>
          <div>
            <h2 style={{ fontWeight:800, fontSize:18 }}>Talk to a Facilitator</h2>
            <p style={{ color:C.textSm, fontSize:12.5, marginTop:3 }}>Our medical coordinators will reach out within 24 hours.</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:24, lineHeight:1, padding:4 }}>×</button>
        </div>
        <div style={{ padding:"22px 24px" }}>
          {done ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <h3 style={{ fontWeight:800, fontSize:19, marginBottom:10 }}>Request Sent!</h3>
              <p style={{ color:C.textSm, fontSize:14, lineHeight:1.6 }}>Thank you! A medical coordinator will reach out to you within 24 hours.</p>
              <button className="btn-primary" onClick={onClose} style={{ marginTop:24, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 32px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
            </div>
          ) : (
            <>
              <FieldInput label="Full Name *" type="text" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
              <FieldInput label="Email *" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
              <FieldInput label="Phone Number" type="tel" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 416-555-0000" />
              <FieldInput label="What procedure are you interested in? *" type="text" value={f.procedure} onChange={e=>setF(p=>({...p,procedure:e.target.value}))} placeholder="e.g. Hair transplant, Dental implants, Knee replacement" />
              <FieldInput label="Preferred country or region (optional)" type="text" value={f.country} onChange={e=>setF(p=>({...p,country:e.target.value}))} placeholder="e.g. Turkey, Southeast Asia, Europe" />
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Short message (optional)</label>
                <textarea value={f.message} onChange={e=>setF(p=>({...p,message:e.target.value}))} placeholder="Any additional details or questions…" rows={3}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", color:C.text }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
              <button className="btn-primary" onClick={()=>setDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Send Request</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PROVIDER CARD ────────────────────────────────────────────────────────────
function ProviderCard({ provider, onClick, compact }) {
  return (
    <div className="card" onClick={()=>onClick(provider)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:compact?"12px 14px":"18px 20px", cursor:"pointer", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
      <div style={{ width:compact?42:52, height:compact?42:52, borderRadius:12, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:compact?13:17, color:C.teal, flexShrink:0, border:`1px solid ${C.tealLt}` }}>{provider.image}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
          <span style={{ fontWeight:700, fontSize:compact?13.5:15 }}>{provider.name}</span>
          {provider.contracted && <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:C.amberLt, color:"#B45309", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, letterSpacing:.3 }}>Featured</span>}
        </div>
        <div style={{ color:C.textSm, fontSize:12.5, marginBottom:6 }}>{provider.specialty}</div>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
          <span style={{ fontSize:12, color:C.amber }}>★ {provider.rating}</span>
          <span style={{ fontSize:12, color:C.textSm }}>({provider.reviews})</span>
          {!compact && <span style={{ fontSize:12, color:C.textSm }}>{provider.distance < 10 ? `${provider.distance} km` : "Global"}</span>}
          {!compact && <span style={{ fontSize:12, color:C.textSm }}>{provider.city}</span>}
        </div>
        {!compact && <div style={{ display:"flex", gap:5, marginTop:10, flexWrap:"wrap" }}>{provider.tags.map(t=><span key={t} style={{ background:C.gray, color:C.textSm, fontSize:11, padding:"2px 8px", borderRadius:10 }}>{t}</span>)}</div>}
      </div>
    </div>
  );
}

// ─── CUSTOM SELECT ───────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder, minWidth }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = options.find(o => (o.value ?? o) === value);
  const label = current ? (current.label ?? current) : placeholder ?? "Select…";

  return (
    <div ref={ref} style={{ position:"relative", minWidth: minWidth || 120 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
          padding:"8px 12px 8px 14px", border:`1.5px solid ${open ? C.teal : C.border}`,
          borderRadius:22, background:open ? C.tealLt : C.white, cursor:"pointer",
          fontSize:13, fontWeight:500, color: open ? C.teal : C.textMd,
          fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap",
          boxShadow: open ? `0 0 0 3px ${C.teal}18` : "none",
        }}
      >
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ flexShrink:0, transition:"transform .18s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {open && (
        <div className="fade-up" style={{
          position:"absolute", top:"calc(100% + 6px)", left:0, minWidth:"100%",
          background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14,
          boxShadow:"0 8px 24px rgba(0,0,0,.10)", zIndex:999, overflow:"hidden", padding:"4px",
        }}>
          {options.map(o => {
            const val = o.value ?? o;
            const lbl = o.label ?? o;
            const selected = val === value;
            return (
              <button key={val} onClick={() => { onChange(val); setOpen(false); }}
                style={{
                  display:"block", width:"100%", textAlign:"left", padding:"9px 12px",
                  background: selected ? C.tealLt : "transparent",
                  color: selected ? C.teal : C.textMd,
                  fontWeight: selected ? 700 : 400,
                  fontSize:13, border:"none", borderRadius:10, cursor:"pointer",
                  fontFamily:"inherit", transition:"background .12s",
                }}
                onMouseEnter={e => { if(!selected) e.currentTarget.style.background = C.gray; }}
                onMouseLeave={e => { if(!selected) e.currentTarget.style.background = "transparent"; }}
              >
                {selected && <span style={{ marginRight:6, fontSize:11 }}>✓</span>}
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage, setInitialQuery }) {
  const [q, setQ] = useState("");
  const send = (v) => { const t=v||q; if(!t.trim())return; setInitialQuery(t); setPage("chat"); };
  const suggestions = ["Find a cardiologist","I have a headache","Hair transplant abroad","Sore throat remedies","Find a facilitator","Find care abroad"];
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 16px", background:`linear-gradient(155deg, ${C.white} 50%, ${C.tealBg} 100%)` }}>
      <div className="fade-up" style={{ textAlign:"center", maxWidth:780, width:"100%", padding:"0 8px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <svg width="44" height="44" viewBox="0 0 40 40" fill="none">
            <circle cx="17" cy="17" r="12" stroke="#047598" strokeWidth="3.8"/>
            <line x1="26" y1="26" x2="37" y2="37" stroke="#047598" strokeWidth="3.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize:40, fontWeight:800, letterSpacing:"-0.5px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598", fontWeight:800 }}>.com</span></span>
        </div>
        <p style={{ color:C.textSm, fontSize:18, marginBottom:36, fontWeight:500 }}>AI-powered healthcare, right at your fingertips</p>
        <div style={{ position:"relative", marginBottom:20 }}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask me any healthcare question…"
            style={{ width:"100%", padding:"17px 60px 17px 24px", border:`1.5px solid ${C.border}`, borderRadius:40, fontSize:16, outline:"none", boxSizing:"border-box", boxShadow:"0 4px 20px rgba(0,0,0,.09)", background:C.white, fontFamily:"inherit" }}
            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
          <button onClick={()=>send()} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:C.teal, border:"none", borderRadius:"50%", width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
          </button>
        </div>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginBottom: 30}}>
          {suggestions.map(s=>(
            <button key={s} onClick={()=>send(s)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"6px 15px", fontSize:12.5, color:C.textSm, cursor:"pointer", transition:"all .15s", fontFamily:"inherit" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSm;}}>{s}</button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:12, maxWidth:"100%", margin:"0 auto" }}>
          {[
            { src: imgAiHealth,  alt:"AI Health Assistant",  title:"AI Health Assistant",  sub:"Science-based guidance" },
            { src: imgProviders, alt:"Provider Directory",    title:"Provider Directory",   sub:"Verified specialists" },
            { src: imgTourism,   alt:"Medical Tourism",       title:"Medical Tourism",      sub:"Facilitator network" },
          ].map(({src,alt,title,sub})=>(
            <div key={title} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 12px", textAlign:"center" }}>
              <div style={{ width:50, height:50, borderRadius:10, background:"transparent", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", overflow:"hidden" }}>
                <img src={src} alt={alt} onError={e=>{ e.currentTarget.style.display="none"; e.currentTarget.nextSibling.style.display="flex"; }}
                  style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:0 }}/>
                <div style={{ display:"none", width:"100%", height:"100%", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
                  <span style={{ fontSize:9, color:C.textSm, fontWeight:600 }}>IMG</span>
                </div>
              </div>
              <div style={{ fontWeight:700, fontSize:13 }}>{title}</div>
              <div style={{ fontSize:11, color:C.textSm, marginTop:3 }}>{sub}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:24, borderTop:`1px solid ${C.border}`, paddingTop:18, display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
          <FooterLink onClick={()=>setPage("become-provider")}>Become a Provider</FooterLink>
          <span style={{ color:C.border }}>·</span>
          <FooterLink onClick={()=>setPage("international")}>Find Care Abroad</FooterLink>
        </div>
      </div>
    </div>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatPage({ setPage, setSelectedProvider, initialQuery, setInitialQuery, openFacilitatorModal }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"Hi! I'm your AI health assistant. Ask me about symptoms, health concerns, or finding a provider.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:[] }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const AiAvatar = () => (
    <div style={{ width:32, height:32, borderRadius:9, background:C.gray, flexShrink:0, overflow:"hidden" }}>
      <img src={imgAiAvatar} alt="AI" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
    </div>
  );

  const send = (text) => {
    if(!text.trim()) return;
    setMsgs(m=>[...m,{role:"user",text}]); setInput(""); setLoading(true);
    const resp = getResponse(text);
    const showIntlCTA = isInternationalQuery(text) || resp.showFacilitatorCTA;
    setTimeout(()=>{
      const providers = resp.providers ? (resp.facilitator ? FACILITATORS.slice(0,2).map(f=>({...f,specialty:"Medical Tourism",distance:99,contracted:f.contracted,hasCalendar:false})) : PROVIDERS.filter(p=>p.contracted).slice(0,3)) : [];
      setMsgs(m=>[...m,{role:"assistant",text:resp.response,providers,emergency:resp.emergency,showIntlCTA}]);
      setLoading(false);
    }, 900);
  };

  useEffect(() => {
    if (initialQuery) { send(initialQuery); setInitialQuery(""); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [msgs]);

  return (
    <div style={{ display:"flex", height:"calc(100vh - 58px)" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", maxWidth:780, margin:"0 auto", width:"100%" }}>
        <div style={{ flex:1, overflowY:"auto", padding:"20px 14px" }}>
          {msgs.map((msg,i)=>(
            <div key={i} style={{ marginBottom:18 }}>
              <div style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:8 }}>
                {msg.role==="assistant"&&<AiAvatar/>}
                <div style={{ maxWidth:"78%", background:msg.role==="user"?C.teal:msg.emergency?C.redLt:C.gray, color:msg.role==="user"?"#fff":msg.emergency?C.red:C.text, borderRadius:msg.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"11px 15px", fontSize:13.5, lineHeight:1.7, border:msg.emergency?`1px solid ${C.redBd}`:"none", whiteSpace:"pre-wrap" }}>{msg.text}</div>
              </div>
              {msg.providers?.length>0&&(
                <div style={{ marginTop:10, marginLeft:38 }}>
                  <p style={{ fontSize:10, color:C.textSm, marginBottom:7, fontWeight:700, letterSpacing:.6 }}>SUGGESTED PROVIDERS</p>
                  <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                    {msg.providers.map(p=><ProviderCard key={p.id} provider={p} onClick={prov=>setSelectedProvider(prov)} compact />)}
                  </div>
                </div>
              )}
              {/* Facilitator CTA block for international queries */}
              {msg.role==="assistant" && msg.showIntlCTA && (
                <div className="fade-up" style={{ marginTop:10, marginLeft:38, background:`linear-gradient(120deg, ${C.purpleLt}, ${C.tealLt})`, border:`1px solid ${C.teal}30`, borderRadius:14, padding:"14px 16px", display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:180 }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:3, color:C.text }}>Looking for care outside your country?</div>
                    <div style={{ fontSize:12.5, color:C.textMd }}>We can connect you with a medical coordinator who specializes in international care.</div>
                  </div>
                  <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Talk to a Facilitator</button>
                </div>
              )}
            </div>
          ))}
          {loading&&(
            <div style={{ display:"flex",gap:8,alignItems:"center" }}>
              <AiAvatar/>
              <div style={{ background:C.gray,borderRadius:"18px 18px 18px 4px",padding:"13px 16px",display:"flex",gap:4 }}>
                {[0,1,2].map(i=><div key={i} style={{ width:6,height:6,borderRadius:"50%",background:C.teal,animation:"bounce 1s infinite",animationDelay:`${i*.2}s` }}/>)}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>
        <div style={{ padding:"12px 14px", borderTop:`1px solid ${C.border}`, background:C.white }}>
          <div style={{ display:"flex",gap:8,background:C.gray,borderRadius:28,padding:"6px 6px 6px 14px",alignItems:"center" }}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Describe symptoms or ask a question…" style={{ flex:1,border:"none",background:"transparent",outline:"none",fontSize:13.5,fontFamily:"inherit",minWidth:0 }}/>
            <button onClick={()=>send(input)} style={{ background:C.teal,border:"none",borderRadius:22,padding:"9px 18px",color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap" }}>Send</button>
          </div>
          <p style={{ fontSize:10.5,color:C.textSm,textAlign:"center",marginTop:7 }}>For informational purposes only. Not a substitute for professional medical advice.</p>
        </div>
      </div>
    </div>
  );
}

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
function DirectoryPage({ setPage, setSelectedProvider }) {
  const [specialty, setSpecialty] = useState("All");
  const [city, setCity] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  let filtered = PROVIDERS.filter(p=>
    (specialty==="All"||p.specialty===specialty||p.tags.includes(specialty)) &&
    (city==="All"||p.city===city) &&
    p.rating>=minRating &&
    (!search||p.name.toLowerCase().includes(search.toLowerCase())||p.specialty.toLowerCase().includes(search.toLowerCase()))
  );
  if(sortBy==="rating") filtered=[...filtered].sort((a,b)=>b.rating-a.rating);
  if(sortBy==="distance") filtered=[...filtered].sort((a,b)=>a.distance-b.distance);
  if(sortBy==="reviews") filtered=[...filtered].sort((a,b)=>b.reviews-a.reviews);
  filtered=[...filtered.filter(p=>p.contracted), ...filtered.filter(p=>!p.contracted)];

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:2 }}>Provider Directory</h1>
          <p style={{ color:C.textSm, fontSize:13 }}>Verified healthcare providers across Canada</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or specialty…" style={{ flex:1, minWidth:180, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
        <Select value={specialty} onChange={setSpecialty} minWidth={160}
          options={["All","Family Medicine","Cardiology","Dermatology","Medical Aesthetics","Orthopedics"]}/>
        <Select value={city} onChange={setCity} minWidth={120}
          options={["All","Toronto","Vancouver"]}/>
        <Select value={sortBy} onChange={setSortBy} minWidth={140}
          options={[{value:"rating",label:"Sort: Rating"},{value:"distance",label:"Sort: Distance"},{value:"reviews",label:"Sort: Reviews"}]}/>
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.textSm }}>MIN RATING</span>
        {[{l:"Any",v:0},{l:"4+",v:4},{l:"4.5+",v:4.5},{l:"4.8+",v:4.8}].map(r=><Chip key={r.l} label={r.l} active={minRating===r.v} onClick={()=>setMinRating(r.v)}/>)}
      </div>
      <p style={{ fontSize:12.5, color:C.textSm, marginBottom:14 }}>{filtered.length} provider{filtered.length!==1?"s":""} found</p>
      <div style={{ display:"grid", gap:9 }}>
        {filtered.map(p=><ProviderCard key={p.id} provider={p} onClick={prov=>setSelectedProvider(prov)}/>)}
        {filtered.length===0&&<div style={{ textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>No providers found. Adjust your filters.</div>}
      </div>
    </div>
  );
}

// ─── FACILITATORS ─────────────────────────────────────────────────────────────
function FacilitatorsPage({ setPage, setSelectedProvider }) {
  const [search, setSearch] = useState("");
  const [procedure, setProcedure] = useState("All");
  const [city, setCity] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("rating");

  const allProcedures = ["All", ...Array.from(new Set(FACILITATORS.flatMap(f=>f.procedures)))];
  const allCities = ["All", ...Array.from(new Set(FACILITATORS.map(f=>f.city)))];

  let filtered = FACILITATORS.filter(f=>
    f.rating >= minRating &&
    (procedure==="All"||f.procedures.includes(procedure)) &&
    (city==="All"||f.city===city) &&
    (!search||f.name.toLowerCase().includes(search.toLowerCase())||f.tags.some(t=>t.toLowerCase().includes(search.toLowerCase())))
  );
  if(sortBy==="rating") filtered=[...filtered].sort((a,b)=>b.rating-a.rating);
  if(sortBy==="reviews") filtered=[...filtered].sort((a,b)=>b.reviews-a.reviews);

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"28px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22, flexWrap:"wrap" }}>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
            <h1 style={{ fontSize:22, fontWeight:800 }}>Medical Tourism Facilitators</h1>
          </div>
          <p style={{ color:C.textSm, fontSize:13 }}>Licensed agencies connecting patients with accredited clinics abroad — handling travel, logistics, and aftercare.</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {[["3","Countries","covered"],["+500","Clinics","vetted"],["24/7","Support","available"]].map(([n,l,s])=>(
            <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 14px", textAlign:"center", minWidth:74 }}>
              <div style={{ fontSize:17, fontWeight:800, color:C.teal }}>{n}</div>
              <div style={{ fontSize:10.5, fontWeight:700, color:C.textMd }}>{l}</div>
              <div style={{ fontSize:9.5, color:C.textSm }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:18 }}>
        <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search facilitators…" style={{ flex:1, minWidth:160, padding:"8px 13px", border:`1.5px solid ${C.border}`, borderRadius:20, fontSize:13, outline:"none", fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
          <Select value={procedure} onChange={setProcedure} minWidth={160} options={allProcedures}/>
          <Select value={city} onChange={setCity} minWidth={130} options={allCities}/>
          <Select value={sortBy} onChange={setSortBy} minWidth={130}
            options={[{value:"rating",label:"Rating ↓"},{value:"reviews",label:"Reviews ↓"}]}/>
        </div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center" }}>
          <span style={{ fontSize:10.5, fontWeight:700, color:C.textSm }}>RATING</span>
          {[{l:"Any",v:0},{l:"4+",v:4},{l:"4.5+",v:4.5},{l:"4.8+",v:4.8}].map(r=><Chip key={r.l} label={r.l} active={minRating===r.v} onClick={()=>setMinRating(r.v)}/>)}
        </div>
      </div>
      <p style={{ fontSize:12.5, color:C.textSm, marginBottom:12 }}>{filtered.length} facilitator{filtered.length!==1?"s":""} found</p>
      <div style={{ display:"grid", gap:10 }}>
        {filtered.map(f => (
          <div key={f.id} className="card" onClick={()=>setSelectedProvider({...f,specialty:"Medical Tourism",distance:99,contracted:f.contracted,hasCalendar:false,tags:f.tags,phone:"+1 000-000-0000",city:f.city,address:"Remote / HQ",hours:"Mon–Fri 9–6"})} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
            <div style={{ display:"flex", gap:14, alignItems:"flex-start", flexWrap:"wrap" }}>
              <div style={{ width:50, height:50, borderRadius:12, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, color:C.purple, flexShrink:0 }}>{f.image}</div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:15 }}>{f.name}</span>
                  {f.contracted && <span style={{ display:"inline-flex", alignItems:"center", gap:3, background:C.amberLt, color:"#B45309", fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, letterSpacing:.3 }}>Featured</span>}
                </div>
                <div style={{ display:"flex", gap:10, marginBottom:10, flexWrap:"wrap" }}>
                  <span style={{ fontSize:12.5, color:C.amber }}>★ {f.rating}</span>
                  <span style={{ fontSize:12.5, color:C.textSm }}>({f.reviews} reviews)</span>
                  <span style={{ fontSize:12.5, color:C.textSm }}>· {f.city}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(140px, 1fr))", gap:8 }}>
                  <div style={{ background:C.gray, borderRadius:9, padding:"8px 11px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textSm, marginBottom:4 }}>PROCEDURES</div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{f.procedures.map(p=><span key={p} style={{ background:C.white, border:`1px solid ${C.border}`, fontSize:11, padding:"2px 7px", borderRadius:8, color:C.textMd }}>{p}</span>)}</div>
                  </div>
                  <div style={{ background:C.gray, borderRadius:9, padding:"8px 11px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textSm, marginBottom:4 }}>COUNTRIES</div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{f.countries.map(c=><span key={c} style={{ background:C.white, border:`1px solid ${C.border}`, fontSize:11, padding:"2px 7px", borderRadius:8, color:C.textMd }}>{c}</span>)}</div>
                  </div>
                  <div style={{ background:C.gray, borderRadius:9, padding:"8px 11px" }}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textSm, marginBottom:4 }}>LANGUAGES</div>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>{f.languages.map(l=><span key={l} style={{ background:C.white, border:`1px solid ${C.border}`, fontSize:11, padding:"2px 7px", borderRadius:8, color:C.textMd }}>{l}</span>)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{ textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>No facilitators found. Try adjusting filters.</div>}
      </div>
    </div>
  );
}

// ─── INTERNATIONAL PAGE ───────────────────────────────────────────────────────
function InternationalPage({ setSelectedClinic, openFacilitatorModal }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [procedure, setProcedure] = useState("All");

  const allCountries = ["All", ...Array.from(new Set(INTL_CLINICS.map(c=>c.country)))];
  const allProcedures = ["All", ...Array.from(new Set(INTL_CLINICS.flatMap(c=>c.procedures)))];

  const filtered = INTL_CLINICS.filter(c=>
    (country==="All"||c.country===country) &&
    (procedure==="All"||c.procedures.includes(procedure)) &&
    (!search||c.name.toLowerCase().includes(search.toLowerCase())||c.country.toLowerCase().includes(search.toLowerCase())||c.procedures.some(p=>p.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"28px 16px" }}>
      <div style={{ marginBottom:26 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>International Clinics &amp; Hospitals</h1>
        <p style={{ color:C.textSm, fontSize:13.5, maxWidth:640 }}>Browse internationally accredited medical facilities offering world-class procedures — often at a fraction of the cost. Our medical coordinators can help you navigate the process.</p>
      </div>
      {/* CTA Banner */}
      <div style={{ background:`linear-gradient(120deg, ${C.purpleLt}, ${C.tealLt})`, border:`1px solid ${C.teal}30`, borderRadius:16, padding:"18px 22px", marginBottom:24, display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ fontWeight:700, fontSize:14.5, marginBottom:4 }}>Not sure where to start?</div>
          <div style={{ color:C.textMd, fontSize:13 }}>Our medical coordinators can help you navigate your options and find the right clinic for your needs.</div>
        </div>
        <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"11px 22px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Talk to a Facilitator</button>
      </div>
      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clinics, countries, procedures…" style={{ flex:1, minWidth:200, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
        <Select value={country} onChange={setCountry} minWidth={140} options={allCountries}/>
        <Select value={procedure} onChange={setProcedure} minWidth={160} options={allProcedures}/>
      </div>
      <p style={{ fontSize:12.5, color:C.textSm, marginBottom:14 }}>{filtered.length} clinic{filtered.length!==1?"s":""} found</p>
      <div style={{ display:"grid", gap:12 }}>
        {filtered.map(clinic=>(
          <div key={clinic.id} className="card" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"20px 22px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }} onClick={()=>setSelectedClinic(clinic)}>
            <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
              <div style={{ width:54, height:54, borderRadius:14, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:C.purple, flexShrink:0 }}>{clinic.image}</div>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                  <span style={{ fontWeight:700, fontSize:16 }}>{clinic.name}</span>
                  <span style={{ background:C.gray, color:C.textSm, fontSize:11.5, padding:"2px 10px", borderRadius:10, fontWeight:600 }}>{clinic.country}</span>
                </div>
                <div style={{ color:C.textSm, fontSize:13, marginBottom:10 }}>{clinic.city}, {clinic.country}</div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {clinic.procedures.map(p=>(
                    <span key={p} style={{ background:C.tealLt, color:C.teal, fontSize:11.5, padding:"3px 10px", borderRadius:18, fontWeight:600 }}>{p}</span>
                  ))}
                </div>
              </div>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:6, flexShrink:0 }}>
                <div style={{ fontSize:12, color:C.amber, fontWeight:700 }}>★ {clinic.rating} <span style={{ color:C.textSm, fontWeight:400 }}>({clinic.reviews})</span></div>
                <button className="btn-primary" onClick={e=>{e.stopPropagation();openFacilitatorModal();}} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"8px 16px", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Get Help from a Facilitator</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div style={{ textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>No clinics found. Try adjusting your search or filters.</div>}
      </div>
    </div>
  );
}

// ─── INTERNATIONAL CLINIC PROFILE ────────────────────────────────────────────
function InternationalClinicProfile({ clinic, onBack, openFacilitatorModal }) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 80);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  return (
    <div ref={scrollRef} style={{ maxHeight:"calc(100vh - 58px)", overflowY:"auto", position:"relative" }}>
      {/* Sticky banner */}
      {scrolled && (
        <div className="fade-up" style={{ position:"sticky", top:0, zIndex:100, background:`linear-gradient(120deg, ${C.purple}EE, ${C.teal}EE)`, backdropFilter:"blur(8px)", padding:"12px 20px", display:"flex", gap:14, alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" }}>
          <div style={{ color:"#fff", fontSize:13.5, fontWeight:600 }}>Not sure where to start? Our medical coordinators can help you navigate your options.</div>
          <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:"#fff", color:C.teal, border:"none", borderRadius:22, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Talk to a Facilitator</button>
        </div>
      )}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 20px 60px" }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13.5, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:22, padding:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
          Back to International
        </button>
        {/* Header */}
        <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 26px", marginBottom:18, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
          <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>
            <div style={{ width:72, height:72, borderRadius:18, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:22, color:C.purple, flexShrink:0 }}>{clinic.image}</div>
            <div style={{ flex:1, minWidth:200 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:6 }}>
                <h1 style={{ fontSize:24, fontWeight:800, margin:0 }}>{clinic.name}</h1>
              </div>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", marginBottom:10, fontSize:13.5, color:C.textSm }}>
                <span>{clinic.city}, {clinic.country}</span>
                <span style={{ color:C.amber, fontWeight:700 }}>★ {clinic.rating} <span style={{ fontWeight:400, color:C.textSm }}>({clinic.reviews} reviews)</span></span>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {clinic.procedures.map(p=>(
                  <span key={p} style={{ background:C.tealLt, color:C.teal, fontSize:12, padding:"3px 11px", borderRadius:18, fontWeight:600 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontWeight:800, fontSize:16, marginBottom:12 }}>About this Clinic</h2>
          <p style={{ color:C.textMd, fontSize:14.5, lineHeight:1.75 }}>{clinic.description}</p>
        </div>
        {/* Procedures detail */}
        <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:28, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Available Procedures</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:10 }}>
            {clinic.procedures.map(p=>(
              <div key={p} style={{ background:C.tealLt, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
        {/* CTA Section */}
        <div className="fade-up" style={{ background:`linear-gradient(135deg, ${C.purpleLt}, ${C.tealLt})`, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"30px 28px", textAlign:"center", boxShadow:"0 4px 16px rgba(11,191,191,.10)" }}>
          
          <h2 style={{ fontWeight:800, fontSize:20, marginBottom:10 }}>Not sure where to start?</h2>
          <p style={{ color:C.textMd, fontSize:14.5, lineHeight:1.65, maxWidth:480, margin:"0 auto 22px" }}>Our medical coordinators can help you navigate your options, compare clinics, arrange travel, and coordinate your full care journey.</p>
          <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"14px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Talk to a Facilitator</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROVIDER MODAL ───────────────────────────────────────────────────────────
const BOOKED = ["9:00","10:30","14:00"];

function ProviderModal({ provider, onClose, setBookings }) {
  const [showBooking, setShowBooking] = useState(false);
  const [tab, setTab] = useState("calendar");
  const [form, setForm] = useState({ name:"",email:"",phone:"",reason:"",time:"" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [done, setDone] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if(!provider) return null;
  const today = new Date();
  const days = Array.from({length:8},(_,i)=>{ const d=new Date(today); d.setDate(today.getDate()+i+1); return d; }).filter(d=>d.getDay()!==0&&d.getDay()!==6);

  const handleBook = () => {
    if(!form.name||!form.email||!form.phone) return;
    setBookings(b=>[...b,{...form,provider:provider.name,id:Date.now(),status:"Pending",date:selectedDate?.toDateString()||"TBD"}]);
    setDone(true);
  };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed",inset:0,background:"rgba(10,20,30,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"16px",backdropFilter:"blur(3px)" }}>
      <div ref={scrollRef} className="fade-up" style={{ background:C.white,borderRadius:20,width:"100%",maxWidth:780,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ background:`linear-gradient(110deg, ${C.tealLt}, ${C.tealBg})`, padding:"22px 22px 18px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <div style={{ width:60, height:60, borderRadius:14, background:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:19, color:C.teal, boxShadow:"0 2px 8px rgba(0,0,0,.08)", flexShrink:0 }}>{provider.image}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:2 }}>
                <h2 style={{ fontSize:19, fontWeight:800, margin:0 }}>{provider.name}</h2>
                {provider.contracted&&<span style={{ display:"inline-flex", alignItems:"center", gap:3, background:C.amberLt, color:"#B45309", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, letterSpacing:.3 }}>Featured</span>}
              </div>
              <p style={{ color:C.textSm, fontSize:13, margin:"2px 0 6px" }}>{provider.specialty}</p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:12.5 }}>
                <span style={{ color:C.amber }}>★ <strong>{provider.rating}</strong> <span style={{ color:C.textSm }}>({provider.reviews})</span></span>
                <span style={{ color:C.textSm }}>{provider.address}</span>
                <span style={{ color:C.textSm }}>{provider.hours}</span>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:22, lineHeight:1, padding:4, flexShrink:0 }}>×</button>
          </div>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
            <button className="btn-primary" onClick={()=>setShowBooking(true)} style={{ flex:1,minWidth:110,background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"inherit" }}>Book Appointment</button>
            <a href={`tel:${provider.phone}`} style={{ flex:1,minWidth:110,background:C.white,color:C.teal,border:`2px solid ${C.teal}`,borderRadius:10,padding:"10px",fontWeight:700,fontSize:13.5,cursor:"pointer",textDecoration:"none",display:"flex",alignItems:"center",justifyContent:"center" }}>Call</a>
            <button className="btn-ghost" style={{ flex:1,minWidth:110,background:C.white,color:C.textMd,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px",fontWeight:600,fontSize:13.5,cursor:"pointer",fontFamily:"inherit" }}>Website</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:18 }}>
            <div>
              <h3 style={{ fontSize:13.5, fontWeight:700, marginBottom:9 }}>Specialties</h3>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
                {provider.tags?.map(t=><span key={t} style={{ background:C.tealLt,color:C.teal,fontSize:12,padding:"3px 10px",borderRadius:18,fontWeight:600 }}>{t}</span>)}
              </div>
              <div style={{ fontSize:12, color:C.textSm }}>{provider.city} · {provider.distance<10?`${provider.distance} km away`:"Global"}</div>
            </div>
            <div>
              <h3 style={{ fontSize:13.5, fontWeight:700, marginBottom:9 }}>AI Review Summary</h3>
              <div style={{ background:C.gray, borderRadius:12, padding:13, fontSize:12.5, lineHeight:1.6 }}>
                <div style={{ color:C.green, fontWeight:700, fontSize:11.5, marginBottom:3 }}>✓ Pros</div>
                <p style={{ color:C.textMd, marginBottom:9 }}>Highly professional, thorough explanations and personalized care.</p>
                <div style={{ color:C.amber, fontWeight:700, fontSize:11.5, marginBottom:3 }}>△ Cons</div>
                <p style={{ color:C.textMd, margin:0 }}>Wait times longer during peak hours. Limited parking nearby.</p>
              </div>
            </div>
          </div>
        </div>
        {showBooking&&!done&&(
          <div style={{ margin:"0 22px 22px", border:`1px solid ${C.border}`, borderRadius:14, padding:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ fontSize:16, fontWeight:800 }}>Book Appointment</h3>
              <button onClick={()=>setShowBooking(false)} style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:C.textSm,lineHeight:1 }}>×</button>
            </div>
            {provider.hasCalendar?(
              <>
                <div style={{ display:"flex",gap:4,background:C.gray,borderRadius:10,padding:3,marginBottom:14 }}>
                  {[["calendar","Pick a slot"],["form","Request time"]].map(([t,l])=><button key={t} onClick={()=>setTab(t)} style={{ flex:1,padding:"7px",border:"none",borderRadius:8,background:tab===t?C.white:"transparent",fontWeight:tab===t?700:400,fontSize:13,cursor:"pointer",color:tab===t?C.text:C.textSm,fontFamily:"inherit" }}>{l}</button>)}
                </div>
                {tab==="calendar"&&(
                  <>
                    <p style={{ fontSize:10.5,fontWeight:700,color:C.textSm,marginBottom:8 }}>SELECT DATE</p>
                    <div style={{ display:"flex",gap:7,overflowX:"auto",paddingBottom:4,marginBottom:12 }}>
                      {days.slice(0,7).map((d,i)=>(
                        <button key={i} onClick={()=>setSelectedDate(d)} style={{ flexShrink:0,width:50,padding:"8px 0",border:`1.5px solid ${selectedDate?.toDateString()===d.toDateString()?C.teal:C.border}`,borderRadius:10,background:selectedDate?.toDateString()===d.toDateString()?C.tealLt:C.white,cursor:"pointer",textAlign:"center",fontFamily:"inherit" }}>
                          <div style={{ fontSize:9.5,color:C.textSm,fontWeight:700 }}>{d.toLocaleDateString("en",{weekday:"short"}).toUpperCase()}</div>
                          <div style={{ fontSize:15,fontWeight:800,color:selectedDate?.toDateString()===d.toDateString()?C.teal:C.text,marginTop:2 }}>{d.getDate()}</div>
                        </button>
                      ))}
                    </div>
                    {selectedDate&&(
                      <>
                        <p style={{ fontSize:10.5,fontWeight:700,color:C.textSm,marginBottom:8 }}>SELECT TIME</p>
                        <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:16 }}>
                          {ALL_TIMES.map(t=>{ const taken=BOOKED.includes(t); return (
                            <button key={t} onClick={()=>!taken&&setForm(f=>({...f,time:t}))} disabled={taken} style={{ padding:"5px 12px",border:`1.5px solid ${form.time===t?C.teal:C.border}`,borderRadius:18,background:form.time===t?C.tealLt:taken?C.gray:C.white,color:form.time===t?C.teal:taken?"#bbb":C.textSm,fontSize:12,cursor:taken?"not-allowed":"pointer",fontWeight:form.time===t?700:400,textDecoration:taken?"line-through":"none",fontFamily:"inherit" }}>{t}</button>
                          );})}
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            ):(
              <div style={{ background:C.amberLt,border:`1px solid #FDE68A`,borderRadius:10,padding:11,marginBottom:14,fontSize:13,color:"#92400E" }}>
                No calendar connected yet — submit a request and the provider will confirm.
              </div>
            )}
            {[["Full Name *","name","text"],["Email *","email","email"],["Phone *","phone","tel"],["Reason for Visit","reason","text"]].map(([l,k,t])=>(
              <div key={k} style={{ marginBottom:11 }}>
                <label style={{ fontSize:12,fontWeight:700,color:C.text,display:"block",marginBottom:4 }}>{l}</label>
                <input type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{ width:"100%",padding:"9px 12px",border:`1.5px solid ${C.border}`,borderRadius:9,fontSize:13.5,outline:"none",fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
              </div>
            ))}
            <button className="btn-primary" onClick={handleBook} style={{ width:"100%",background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"12px",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"inherit",marginTop:4 }}>Confirm Booking</button>
          </div>
        )}
        {done&&(
          <div style={{ margin:"0 22px 22px", background:C.tealLt, border:`1px solid ${C.teal}40`, borderRadius:14, padding:"24px", textAlign:"center" }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:C.white,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 2px 8px rgba(11,191,191,.2)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
            </div>
            <h3 style={{ fontWeight:800,fontSize:17,marginBottom:6 }}>Booking Confirmed!</h3>
            <p style={{ color:C.textSm,fontSize:13,marginBottom:16 }}>Confirmation sent to <strong>{form.email}</strong>. Provider will confirm within 24h.</p>
            <button onClick={()=>{setShowBooking(false);setDone(false);}} style={{ background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"10px 28px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:14 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DEMO CALENDAR ────────────────────────────────────────────────────────────
function DemoCalendar({ events, setEvents }) {
  const [currentMonth, setCurrentMonth] = useState({ y:2026, m:2 });
  const [selectedDay, setSelectedDay] = useState("2026-03-06");
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const daysInMonth = new Date(currentMonth.y, currentMonth.m+1, 0).getDate();
  const firstDow = new Date(currentMonth.y, currentMonth.m, 1).getDay();
  const monthName = new Date(currentMonth.y, currentMonth.m, 1).toLocaleDateString("en",{month:"long",year:"numeric"});

  const pad = n => String(n).padStart(2,"0");
  const dateStr = (d) => `${currentMonth.y}-${pad(currentMonth.m+1)}-${pad(d)}`;
  const eventsForDay = (d) => events.filter(e=>e.date===dateStr(d));
  const selectedEvents = events.filter(e=>e.date===selectedDay);

  const prevMonth = () => setCurrentMonth(({y,m})=>m===0?{y:y-1,m:11}:{y,m:m-1});
  const nextMonth = () => setCurrentMonth(({y,m})=>m===11?{y:y+1,m:0}:{y,m:m+1});

  const handleDelete = (id) => { setEvents(e=>e.filter(ev=>ev.id!==id)); setDeleteTarget(null); };
  const handleReschedule = (id,newTime) => { setEvents(e=>e.map(ev=>ev.id===id?{...ev,time:newTime}:ev)); setRescheduleTarget(null); };

  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:16 }}>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
          <button onClick={prevMonth} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textSm }}>‹</button>
          <span style={{ fontWeight:700, fontSize:14 }}>{monthName}</span>
          <button onClick={nextMonth} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, width:28, height:28, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.textSm }}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2, marginBottom:6 }}>
          {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} style={{ textAlign:"center", fontSize:10.5, fontWeight:700, color:C.textSm, padding:"4px 0" }}>{d}</div>)}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:2 }}>
          {Array(firstDow).fill(null).map((_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const d=i+1; const ds=dateStr(d); const evs=eventsForDay(d); const sel=selectedDay===ds;
            return (
              <div key={d} className="cal-cell" onClick={()=>setSelectedDay(ds)} style={{ textAlign:"center", padding:"4px 2px", borderRadius:6, background:sel?C.tealLt:"transparent", position:"relative" }}>
                <span style={{ fontSize:12, fontWeight:sel?700:400, color:sel?C.teal:C.text }}>{d}</span>
                {evs.length>0&&<div style={{ display:"flex", justifyContent:"center", gap:1, marginTop:1 }}>{evs.slice(0,3).map((_,ei)=><div key={ei} style={{ width:4, height:4, borderRadius:"50%", background:C.teal }}/>)}</div>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px" }}>
        <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>
          {new Date(selectedDay+"T12:00").toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})}
        </h3>
        {selectedEvents.length===0?(
          <div style={{ textAlign:"center", padding:"30px 0", color:C.textSm, fontSize:13 }}>No appointments</div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {selectedEvents.map(ev=>(
              <div key={ev.id} style={{ border:`1px solid ${C.border}`, borderRadius:10, padding:"10px 12px", borderLeft:`3px solid ${ev.color}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{ev.time} — {ev.patient}</div>
                    <div style={{ fontSize:12, color:C.textSm, marginTop:2 }}>{ev.reason}</div>
                  </div>
                  <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                   
                    <Badge bg={ev.status==="confirmed"?C.tealLt:C.amberLt} color={ev.status==="confirmed"?C.teal:C.amber}>{ev.status}</Badge>
                  </div>
                </div>
                <div style={{ display:"flex", gap:6 }}>
                  {ev.status !== "confirmed" && (!ev.visitApproved ? (
                    <button onClick={e=>{e.stopPropagation();setEvents(es=>es.map(e2=>e2.id===ev.id?{...e2,visitApproved:true,status:"confirmed",color:C.teal}:e2));}}
                      style={{ flex:1, background:C.green, border:"none", borderRadius:7, padding:"6px", fontSize:11.5, cursor:"pointer", color:"#fff", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                      Approve Visit
                    </button>
                  ) : (
                    <button onClick={e=>{e.stopPropagation();setEvents(es=>es.map(e2=>e2.id===ev.id?{...e2,visitApproved:false}:e2));}}
                      style={{ flex:1, background:C.white, border:`1px solid ${C.green}`, borderRadius:7, padding:"6px", fontSize:11.5, cursor:"pointer", color:C.green, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                      Approved ✓
                    </button>
                  ))}
                  <button onClick={e=>{e.stopPropagation();setRescheduleTarget(ev);}} style={{ flex:1, background:C.white, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px", fontSize:11.5, cursor:"pointer", color:C.textMd, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23,4 23,10 17,10"/><path d="M20.49,15a9,9,0,1,1-2.12-9.36L23,10"/></svg>
                    Reschedule
                  </button>
                  <button onClick={e=>{e.stopPropagation();setDeleteTarget(ev);}} style={{ flex:1, background:C.white, border:`1px solid ${C.redBd}`, borderRadius:7, padding:"5px", fontSize:11.5, cursor:"pointer", color:C.red, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", gap:4, fontFamily:"inherit" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {rescheduleTarget&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:14 }}>
          <div style={{ background:C.white,borderRadius:16,padding:"24px 22px",width:"100%",maxWidth:380 }}>
            <h3 style={{ fontWeight:800,fontSize:17,marginBottom:4 }}>Reschedule</h3>
            <p style={{ color:C.textSm,fontSize:13,marginBottom:16 }}>{rescheduleTarget.patient} — {rescheduleTarget.reason}</p>
            <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:20 }}>
              {ALL_TIMES.map(t=><button key={t} onClick={()=>setRescheduleTarget(r=>({...r,_newTime:t}))} style={{ padding:"6px 13px",border:`1.5px solid ${rescheduleTarget._newTime===t?C.teal:C.border}`,borderRadius:18,background:rescheduleTarget._newTime===t?C.tealLt:C.white,color:rescheduleTarget._newTime===t?C.teal:C.textSm,fontSize:12,cursor:"pointer",fontWeight:rescheduleTarget._newTime===t?700:400,fontFamily:"inherit" }}>{t}</button>)}
            </div>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setRescheduleTarget(null)} style={{ flex:1,background:C.gray,color:C.text,border:"none",borderRadius:10,padding:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Cancel</button>
              <button onClick={()=>handleReschedule(rescheduleTarget.id, rescheduleTarget._newTime||rescheduleTarget.time)} style={{ flex:1,background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Save</button>
            </div>
          </div>
        </div>
      )}
      {deleteTarget&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:400,padding:14 }}>
          <div style={{ background:C.white,borderRadius:16,padding:"28px 22px",width:"100%",maxWidth:340,textAlign:"center" }}>
            <div style={{ width:48,height:48,borderRadius:"50%",background:C.redLt,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M10,11v6M14,11v6"/><path d="M9,6V4h6v2"/></svg>
            </div>
            <h3 style={{ fontWeight:800,fontSize:17,marginBottom:7 }}>Cancel appointment?</h3>
            <p style={{ color:C.textSm,fontSize:13,marginBottom:22 }}><strong>{deleteTarget.patient}</strong> at <strong>{deleteTarget.time}</strong> will be removed.</p>
            <div style={{ display:"flex",gap:8 }}>
              <button onClick={()=>setDeleteTarget(null)} style={{ flex:1,background:C.gray,color:C.text,border:"none",borderRadius:10,padding:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit" }}>Keep</button>
              <button onClick={()=>handleDelete(deleteTarget.id)} style={{ flex:1,background:C.red,color:"#fff",border:"none",borderRadius:10,padding:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit" }}>Cancel It</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROVIDER DASHBOARD ───────────────────────────────────────────────────────
const MOCK_STATS = {
  totalLeads:142, visits:89, calls:31, bookings:22, pendingInvoice:1200,
  monthly:[{m:"Oct",v:18},{m:"Nov",v:24},{m:"Dec",v:19},{m:"Jan",v:31},{m:"Feb",v:28},{m:"Mar",v:22}],
  leads:[
    {date:"Mar 6",type:"Booking",user:"A.K.",status:"Confirmed",amount:50, visitApproved:false},
    {date:"Mar 6",type:"Call",user:"M.R.",status:"Confirmed",amount:25},
    {date:"Mar 5",type:"Website Visit",user:"S.T.",status:"Confirmed",amount:1},
    {date:"Mar 5",type:"Booking",user:"L.P.",status:"Pending",amount:50, visitApproved:false},
    {date:"Mar 4",type:"Call",user:"D.V.",status:"Confirmed",amount:25},
  ]
};

function ProviderDashboard() {
  const [tab, setTab] = useState("overview");
  const [events, setEvents] = useState(INIT_EVENTS);
  const maxV = Math.max(...MOCK_STATS.monthly.map(m=>m.v));

  function LeadsTab() {
    const [leads] = useState(MOCK_STATS.leads);
    return (
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:480 }}>
          <thead>
            <tr style={{ background:C.gray }}>
              {["Date","Lead Type","User","Status","Amount"].map(h=><th key={h} style={{ padding:"11px 16px",textAlign:"left",fontWeight:700,color:C.textSm,fontSize:10.5,letterSpacing:.5,whiteSpace:"nowrap" }}>{h.toUpperCase()}</th>)}
            </tr>
          </thead>
          <tbody>
            {leads.map((l,i)=>(
              <tr key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                <td style={{ padding:"11px 16px",color:C.textSm }}>{l.date}</td>
                <td style={{ padding:"11px 16px",fontWeight:600 }}>{l.type}</td>
                <td style={{ padding:"11px 16px",color:C.textSm }}>{l.user}</td>
                <td style={{ padding:"11px 16px" }}><Badge bg={l.status==="Confirmed"?C.tealLt:C.amberLt} color={l.status==="Confirmed"?C.teal:C.amber}>{l.status}</Badge></td>
                <td style={{ padding:"11px 16px",fontWeight:700 }}>${l.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function ProfileTab() {
    return (
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
          <h3 style={{ fontWeight:700, fontSize:15 }}>Profile Information</h3>
          <Badge bg={C.amberLt} color={C.amber}>Pending admin review</Badge>
        </div>
        {[["Practice Name","Toronto Medical Spa"],["Specialty","Medical Aesthetics"],["Address","55 Avenue Rd, Toronto, ON"],["Phone","+1 416-555-0445"],["Hours","Daily 10am–7pm"]].map(([l,v])=>(
          <div key={l} style={{ display:"flex", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.borderLt}`, flexWrap:"wrap" }}>
            <div style={{ width:130, fontSize:13, fontWeight:600, color:C.textSm, flexShrink:0 }}>{l}</div>
            <div style={{ flex:1, fontSize:13.5, minWidth:110 }}>{v}</div>
            <button className="btn-ghost" style={{ background:"none",border:`1px solid ${C.border}`,borderRadius:8,padding:"4px 12px",fontSize:12,cursor:"pointer",color:C.textSm,fontFamily:"inherit" }}>Edit</button>
          </div>
        ))}
        <p style={{ fontSize:11.5, color:C.textSm, marginTop:14 }}>All edits require admin approval before going live.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"24px 16px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800 }}>Provider Dashboard</h1>
          <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>Toronto Medical Spa · Partner</p>
        </div>
        <div style={{ background:C.tealLt, border:`1px solid ${C.teal}40`, borderRadius:12, padding:"10px 16px", textAlign:"right" }}>
          <div style={{ fontSize:10.5, color:C.teal, fontWeight:700, letterSpacing:.5 }}>PENDING INVOICE</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.teal }}>${MOCK_STATS.pendingInvoice}</div>
          <div style={{ fontSize:11, color:C.textSm }}>Due Apr 1, 2026</div>
        </div>
      </div>
      <div style={{ display:"flex", gap:3, background:C.gray, borderRadius:11, padding:3, marginBottom:22, width:"fit-content", overflowX:"auto" }}>
        {["overview","leads","calendar","profile"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 18px", border:"none", borderRadius:9, background:tab===t?C.white:"transparent", fontWeight:tab===t?700:400, fontSize:13, cursor:"pointer", color:tab===t?C.text:C.textSm, boxShadow:tab===t?"0 1px 4px rgba(0,0,0,.08)":"none", textTransform:"capitalize", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all .15s" }}>{t}</button>
        ))}
      </div>
      {tab==="overview"&&(
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:16 }}>
            {[["Total Leads",MOCK_STATS.totalLeads,"All time"],["Visits",MOCK_STATS.visits,"This month"],["Calls",MOCK_STATS.calls,"This month"],["Bookings",MOCK_STATS.bookings,"This month"]].map(([l,v,s])=>(
              <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{v}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:2 }}>{l}</div>
                <div style={{ fontSize:11.5, color:C.textSm, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Monthly Lead Volume</h3>
              <div style={{ display:"flex", gap:8, alignItems:"flex-end", height:100 }}>
                {MOCK_STATS.monthly.map(m=>(
                  <div key={m.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                    <div style={{ fontSize:10, color:C.textSm }}>{m.v}</div>
                    <div style={{ width:"100%", background:C.teal, borderRadius:"4px 4px 0 0", height:`${(m.v/maxV)*68}px`, opacity:.85 }}/>
                    <div style={{ fontSize:10, color:C.textSm }}>{m.m}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Lead Breakdown</h3>
              {[["Visits",MOCK_STATS.visits,"$1–2"],["Calls",MOCK_STATS.calls,"$25"],["Bookings",MOCK_STATS.bookings,"$50"]].map(([l,v,p])=>(
                <div key={l} style={{ marginBottom:13 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                    <span style={{ fontWeight:600 }}>{l}</span>
                    <span style={{ color:C.textSm }}>{v} · {p} each</span>
                  </div>
                  <div style={{ height:6, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:6, background:C.teal, borderRadius:4, width:`${(v/MOCK_STATS.totalLeads)*100}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {tab==="leads"&&(
        <LeadsTab/>
      )}
      {tab==="calendar"&&<DemoCalendar events={events} setEvents={setEvents}/>}
      {tab==="profile"&&(
        <ProfileTab/>
      )}
    </div>
  );
}

// ─── FACILITATOR DASHBOARD DATA ──────────────────────────────────────────────
const FACIL_LEADS = [
  { id:1,  date:"Mar 12", name:"James W.",    email:"james.w@gmail.com",    phone:"+1 416-555-0101", procedure:"Hair Transplant",        country:"Turkey",      status:"New",        age:34, gender:"Male",   location:"Toronto, CA" },
  { id:2,  date:"Mar 12", name:"Anika S.",    email:"anika.s@outlook.com",  phone:"+1 604-555-0202", procedure:"Dental Implants",         country:"Poland",      status:"Contacted",  age:52, gender:"Female", location:"Vancouver, CA" },
  { id:3,  date:"Mar 11", name:"Robert L.",   email:"r.lee@yahoo.com",      phone:"+1 647-555-0303", procedure:"Knee Replacement",        country:"Germany",     status:"Converted",  age:61, gender:"Male",   location:"Toronto, CA" },
  { id:4,  date:"Mar 11", name:"Maria D.",    email:"maria.d@gmail.com",    phone:"+44 7700-900404", procedure:"IVF",                     country:"Spain",       status:"New",        age:38, gender:"Female", location:"London, UK" },
  { id:5,  date:"Mar 10", name:"Chen H.",     email:"chen.h@gmail.com",     phone:"+1 514-555-0505", procedure:"Rhinoplasty",             country:"Turkey",      status:"Contacted",  age:29, gender:"Male",   location:"Montreal, CA" },
  { id:6,  date:"Mar 10", name:"Fatima A.",   email:"fatima.a@icloud.com",  phone:"+1 416-555-0606", procedure:"Cancer Treatment",        country:"South Korea", status:"Converted",  age:47, gender:"Female", location:"Toronto, CA" },
  { id:7,  date:"Mar 09", name:"David M.",    email:"david.m@gmail.com",    phone:"+1 780-555-0707", procedure:"Bariatric Surgery",       country:"Germany",     status:"New",        age:44, gender:"Male",   location:"Edmonton, CA" },
  { id:8,  date:"Mar 09", name:"Sofia R.",    email:"sofia.r@hotmail.com",  phone:"+1 416-555-0808", procedure:"LASIK",                   country:"Spain",       status:"Closed",     age:31, gender:"Female", location:"Toronto, CA" },
  { id:9,  date:"Mar 08", name:"Omar K.",     email:"omar.k@gmail.com",     phone:"+61 400-555-909", procedure:"Cardiac Surgery",         country:"India",       status:"Converted",  age:58, gender:"Male",   location:"Sydney, AU" },
  { id:10, date:"Mar 08", name:"Priya N.",    email:"priya.n@gmail.com",    phone:"+1 604-555-1010", procedure:"Hair Transplant",         country:"Turkey",      status:"Contacted",  age:27, gender:"Female", location:"Vancouver, CA" },
  { id:11, date:"Mar 07", name:"Lucas F.",    email:"lucas.f@gmail.com",    phone:"+1 416-555-1111", procedure:"Dental Implants",         country:"Poland",      status:"New",        age:49, gender:"Male",   location:"Toronto, CA" },
  { id:12, date:"Mar 07", name:"Elena V.",    email:"elena.v@yahoo.com",    phone:"+1 905-555-1212", procedure:"Rhinoplasty",             country:"Turkey",      status:"Closed",     age:35, gender:"Female", location:"Mississauga, CA" },
  { id:13, date:"Mar 06", name:"Tom B.",      email:"tom.b@gmail.com",      phone:"+1 403-555-1313", procedure:"Orthopedics",             country:"Germany",     status:"Converted",  age:55, gender:"Male",   location:"Calgary, CA" },
  { id:14, date:"Mar 06", name:"Nina P.",     email:"nina.p@outlook.com",   phone:"+1 416-555-1414", procedure:"Stem Cell Therapy",       country:"South Korea", status:"Contacted",  age:42, gender:"Female", location:"Toronto, CA" },
  { id:15, date:"Mar 05", name:"Andre T.",    email:"andre.t@gmail.com",    phone:"+1 514-555-1515", procedure:"Hair Transplant",         country:"Turkey",      status:"New",        age:33, gender:"Male",   location:"Montreal, CA" },
  { id:16, date:"Mar 05", name:"Jessica L.",  email:"jess.l@gmail.com",     phone:"+1 613-555-1616", procedure:"IVF",                     country:"Spain",       status:"Converted",  age:36, gender:"Female", location:"Ottawa, CA" },
  { id:17, date:"Mar 04", name:"Sam K.",      email:"sam.k@yahoo.com",      phone:"+1 416-555-1717", procedure:"Cardiac Surgery",         country:"Germany",     status:"Contacted",  age:64, gender:"Male",   location:"Toronto, CA" },
  { id:18, date:"Mar 04", name:"Yuki T.",     email:"yuki.t@gmail.com",     phone:"+44 7911-900181", procedure:"Cancer Treatment",        country:"South Korea", status:"New",        age:51, gender:"Female", location:"Manchester, UK" },
  { id:19, date:"Mar 03", name:"Marco B.",    email:"marco.b@gmail.com",    phone:"+1 604-555-1919", procedure:"Dental Implants",         country:"Poland",      status:"Converted",  age:46, gender:"Male",   location:"Vancouver, CA" },
  { id:20, date:"Mar 03", name:"Aisha H.",    email:"aisha.h@outlook.com",  phone:"+1 416-555-2020", procedure:"Bariatric Surgery",       country:"Germany",     status:"Closed",     age:39, gender:"Female", location:"Toronto, CA" },
];

const FACIL_STATS = {
  totalLeads: 20, newLeads: 6, converted: 7, revenue: 14350,
  monthly: [
    { m:"Oct", leads:9,  conv:3 },
    { m:"Nov", leads:14, conv:5 },
    { m:"Dec", leads:11, conv:4 },
    { m:"Jan", leads:18, conv:7 },
    { m:"Feb", leads:16, conv:6 },
    { m:"Mar", leads:20, conv:7 },
  ],
};

const STATUS_COLORS = {
  New:       { bg: C.blueLt,   color: C.blue   },
  Contacted: { bg: C.amberLt,  color: C.amber  },
  Converted: { bg: C.greenLt,  color: C.green  },
  Closed:    { bg: C.gray,     color: C.textSm },
};

// ─── FACILITATOR DASHBOARD ────────────────────────────────────────────────────
function FacilitatorDashboard() {
  const [tab, setTab] = useState("overview");
  const [leads, setLeads] = useState(FACIL_LEADS);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProc, setFilterProc] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const allProcs = ["All", ...Array.from(new Set(FACIL_LEADS.map(l=>l.procedure)))];

  // ── Sort + filter ──
  let visible = leads.filter(l =>
    (filterStatus === "All" || l.status === filterStatus) &&
    (filterProc === "All" || l.procedure === filterProc) &&
    (!search || l.name.toLowerCase().includes(search.toLowerCase()) || l.procedure.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()))
  );
  const sortLeads = (key) => {
    if (key === sortKey) { setSortDir(d => d === "asc" ? "desc" : "asc"); }
    else { setSortKey(key); setSortDir("asc"); }
  };
  visible = [...visible].sort((a,b) => {
    let av = a[sortKey], bv = b[sortKey];
    if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // ── Analytics helpers ──
  const all = leads;
  const genderCount = { Male: all.filter(l=>l.gender==="Male").length, Female: all.filter(l=>l.gender==="Female").length };
  const ageGroups = [
    { label:"18–29", count: all.filter(l=>l.age>=18&&l.age<=29).length },
    { label:"30–39", count: all.filter(l=>l.age>=30&&l.age<=39).length },
    { label:"40–49", count: all.filter(l=>l.age>=40&&l.age<=49).length },
    { label:"50–59", count: all.filter(l=>l.age>=50&&l.age<=59).length },
    { label:"60+",   count: all.filter(l=>l.age>=60).length },
  ];
  const maxAge = Math.max(...ageGroups.map(g=>g.count));
  const procedureCounts = allProcs.slice(1).map(p=>({ label:p, count:all.filter(l=>l.procedure===p).length })).sort((a,b)=>b.count-a.count);
  const maxProc = Math.max(...procedureCounts.map(p=>p.count));
  const locationCounts = Object.entries(all.reduce((acc,l)=>{ acc[l.location]=(acc[l.location]||0)+1; return acc; },{})).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxLoc = Math.max(...locationCounts.map(l=>l[1]));
  const countryCounts = Object.entries(all.reduce((acc,l)=>{ acc[l.country]=(acc[l.country]||0)+1; return acc; },{})).sort((a,b)=>b[1]-a[1]);
  const maxCountry = Math.max(...countryCounts.map(c=>c[1]));
  const maxMonthly = Math.max(...FACIL_STATS.monthly.map(m=>m.leads));

  const SortBtn = ({ k, label }) => (
    <th onClick={()=>sortLeads(k)} style={{ padding:"10px 14px", textAlign:"left", fontWeight:700, color:C.textSm, fontSize:10.5, letterSpacing:.5, cursor:"pointer", whiteSpace:"nowrap", userSelect:"none" }}>
      {label.toUpperCase()} {sortKey===k ? (sortDir==="asc"?"↑":"↓") : <span style={{opacity:.3}}>↕</span>}
    </th>
  );

  return (
    <div style={{ maxWidth:1040, margin:"0 auto", padding:"24px 16px" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800 }}>Facilitator Dashboard</h1>
          <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>MedTravel Facilitators · Partner</p>
        </div>
        <div style={{ background:C.purpleLt, border:`1px solid ${C.purple}30`, borderRadius:12, padding:"10px 18px", textAlign:"right" }}>
          <div style={{ fontSize:10.5, color:C.purple, fontWeight:700, letterSpacing:.5 }}>REVENUE THIS MONTH</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.purple }}>${FACIL_STATS.revenue.toLocaleString()}</div>
          <div style={{ fontSize:11, color:C.textSm }}>7 conversions · avg $2,050</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:3, background:C.gray, borderRadius:11, padding:3, marginBottom:22, width:"fit-content", overflowX:"auto" }}>
        {["overview","leads","analytics"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 20px", border:"none", borderRadius:9, background:tab===t?C.white:"transparent", fontWeight:tab===t?700:400, fontSize:13, cursor:"pointer", color:tab===t?C.text:C.textSm, boxShadow:tab===t?"0 1px 4px rgba(0,0,0,.08)":"none", textTransform:"capitalize", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all .15s" }}>{t}</button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab==="overview"&&(
        <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(150px,1fr))", gap:10, marginBottom:18 }}>
            {[
              ["Total Leads", FACIL_STATS.totalLeads, "All time"],
              ["New",         FACIL_STATS.newLeads,   "Uncontacted"],
              ["Converted",   FACIL_STATS.converted,  "This month"],
              ["Conv. Rate",  Math.round(FACIL_STATS.converted/FACIL_STATS.totalLeads*100)+"%", "This month"],
            ].map(([l,v,s])=>(
              <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{v}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:2 }}>{l}</div>
                <div style={{ fontSize:11.5, color:C.textSm, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:14 }}>
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Lead Status</h3>
              {["New","Contacted","Converted","Closed"].map(s=>{
                const cnt = leads.filter(l=>l.status===s).length;
                const sc = STATUS_COLORS[s];
                return (
                  <div key={s} style={{ marginBottom:13 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                      <span style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ width:8, height:8, borderRadius:"50%", background:sc.color, display:"inline-block" }}/>
                        <span style={{ fontWeight:600 }}>{s}</span>
                      </span>
                      <span style={{ color:C.textSm }}>{cnt} lead{cnt!==1?"s":""}</span>
                    </div>
                    <div style={{ height:6, background:C.gray, borderRadius:4 }}>
                      <div style={{ height:6, background:sc.color, borderRadius:4, width:`${(cnt/leads.length)*100}%`, transition:"width .4s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:14 }}>Monthly Leads vs Conversions</h3>
              <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:90 }}>
                {FACIL_STATS.monthly.map(m=>(
                  <div key={m.m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:68 }}>
                      <div style={{ flex:1, background:C.teal, borderRadius:"3px 3px 0 0", height:`${(m.leads/maxMonthly)*68}px`, opacity:.8 }}/>
                      <div style={{ flex:1, background:C.purple, borderRadius:"3px 3px 0 0", height:`${(m.conv/maxMonthly)*68}px`, opacity:.7 }}/>
                    </div>
                    <div style={{ fontSize:9.5, color:C.textSm }}>{m.m}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:14, marginTop:10 }}>
                <span style={{ fontSize:11, color:C.textSm, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:C.teal, display:"inline-block" }}/> Leads</span>
                <span style={{ fontSize:11, color:C.textSm, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:10, height:10, borderRadius:2, background:C.purple, display:"inline-block" }}/> Converted</span>
              </div>
            </div>
          </div>

          {/* Recent leads mini-table */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontWeight:700, fontSize:14 }}>Recent Requests</h3>
              <button onClick={()=>setTab("leads")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit" }}>View all →</button>
            </div>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:520 }}>
                <tbody>
                  {leads.slice(0,5).map(l=>(
                    <tr key={l.id} style={{ borderTop:`1px solid ${C.border}`, cursor:"pointer" }} onClick={()=>{ setSelectedLead(l); setTab("leads"); }}>
                      <td style={{ padding:"11px 18px", fontWeight:600 }}>{l.name}</td>
                      <td style={{ padding:"11px 14px", color:C.textSm }}>{l.procedure}</td>
                      <td style={{ padding:"11px 14px", color:C.textSm }}>{l.country}</td>
                      <td style={{ padding:"11px 14px" }}><Badge bg={STATUS_COLORS[l.status].bg} color={STATUS_COLORS[l.status].color}>{l.status}</Badge></td>
                      <td style={{ padding:"11px 18px", color:C.textSm, fontSize:12 }}>{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── LEADS ── */}
      {tab==="leads"&&(
        <>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, procedure, city…" style={{ flex:1, minWidth:180, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
            <Select value={filterStatus} onChange={setFilterStatus} minWidth={130} options={["All","New","Contacted","Converted","Closed"]}/>
            <Select value={filterProc} onChange={setFilterProc} minWidth={180} options={allProcs}/>
          </div>
          <p style={{ fontSize:12.5, color:C.textSm, marginBottom:12 }}>{visible.length} request{visible.length!==1?"s":""}</p>

          {selectedLead && (
            <div className="fade-up" style={{ background:C.white, border:`2px solid ${C.purple}40`, borderRadius:14, padding:"18px 20px", marginBottom:16, position:"relative" }}>
              <button onClick={()=>setSelectedLead(null)} style={{ position:"absolute", top:14, right:14, background:"none", border:"none", fontSize:20, cursor:"pointer", color:C.textSm, lineHeight:1 }}>×</button>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, flexWrap:"wrap" }}>
                <h3 style={{ fontWeight:800, fontSize:15 }}>{selectedLead.name}</h3>
                <Badge bg={STATUS_COLORS[selectedLead.status].bg} color={STATUS_COLORS[selectedLead.status].color}>{selectedLead.status}</Badge>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px,1fr))", gap:10, marginBottom:16 }}>
                {[["Procedure",selectedLead.procedure],["Destination",selectedLead.country],["Location",selectedLead.location],["Age",selectedLead.age],["Gender",selectedLead.gender],["Email",selectedLead.email],["Phone",selectedLead.phone],["Date",selectedLead.date]].map(([k,v])=>(
                  <div key={k}>
                    <div style={{ fontSize:10, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:3 }}>{k.toUpperCase()}</div>
                    <div style={{ fontSize:13.5, fontWeight:500 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                <span style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.4 }}>STATUS</span>
                {["New","Contacted","Converted","Closed"].map(s=>(
                  <button key={s} onClick={()=>{ setLeads(ls=>ls.map(l=>l.id===selectedLead.id?{...l,status:s}:l)); setSelectedLead(prev=>({...prev,status:s})); }} style={{ padding:"6px 14px", border:`1.5px solid ${selectedLead.status===s?STATUS_COLORS[s].color:C.border}`, borderRadius:18, background:selectedLead.status===s?STATUS_COLORS[s].bg:C.white, color:selectedLead.status===s?STATUS_COLORS[s].color:C.textSm, fontSize:12, fontWeight:selectedLead.status===s?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .12s" }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:700 }}>
              <thead>
                <tr style={{ background:C.gray }}>
                  <SortBtn k="date"      label="Date"/>
                  <SortBtn k="name"      label="Name"/>
                  <SortBtn k="procedure" label="Procedure"/>
                  <SortBtn k="country"   label="Destination"/>
                  <SortBtn k="location"  label="Location"/>
                  <SortBtn k="age"       label="Age"/>
                  <SortBtn k="gender"    label="Gender"/>
                  <SortBtn k="status"    label="Status"/>
                </tr>
              </thead>
              <tbody>
                {visible.map(l=>(
                  <tr key={l.id} onClick={()=>setSelectedLead(l)} style={{ borderTop:`1px solid ${C.border}`, cursor:"pointer", background:selectedLead?.id===l.id?C.purpleLt:"transparent", transition:"background .1s" }}
                    onMouseEnter={e=>{ if(selectedLead?.id!==l.id) e.currentTarget.style.background=C.offWhite; }}
                    onMouseLeave={e=>{ if(selectedLead?.id!==l.id) e.currentTarget.style.background="transparent"; }}>
                    <td style={{ padding:"11px 14px", color:C.textSm, whiteSpace:"nowrap" }}>{l.date}</td>
                    <td style={{ padding:"11px 14px", fontWeight:600, whiteSpace:"nowrap" }}>{l.name}</td>
                    <td style={{ padding:"11px 14px" }}>{l.procedure}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm }}>{l.country}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm, whiteSpace:"nowrap" }}>{l.location}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm, textAlign:"center" }}>{l.age}</td>
                    <td style={{ padding:"11px 14px", color:C.textSm }}>{l.gender}</td>
                    <td style={{ padding:"11px 18px" }}><Badge bg={STATUS_COLORS[l.status].bg} color={STATUS_COLORS[l.status].color}>{l.status}</Badge></td>
                  </tr>
                ))}
                {visible.length===0&&<tr><td colSpan={8} style={{ padding:"40px", textAlign:"center", color:C.textSm }}>No leads match filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── ANALYTICS ── */}
      {tab==="analytics"&&(
        <div style={{ display:"grid", gap:14 }}>
          {/* Row 1 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>

            {/* Gender */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:18 }}>Gender Distribution</h3>
              <div style={{ display:"flex", gap:16, alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                {[["Male",genderCount.Male,C.teal],["Female",genderCount.Female,C.purple]].map(([g,cnt,col])=>(
                  <div key={g} style={{ textAlign:"center" }}>
                    <div style={{ width:80, height:80, borderRadius:"50%", background:`conic-gradient(${col} 0% ${Math.round(cnt/all.length*100)}%, ${C.gray} ${Math.round(cnt/all.length*100)}% 100%)`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", position:"relative" }}>
                      <div style={{ width:54, height:54, borderRadius:"50%", background:C.white, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <span style={{ fontSize:16, fontWeight:800, color:col }}>{Math.round(cnt/all.length*100)}%</span>
                      </div>
                    </div>
                    <div style={{ fontWeight:700, fontSize:13 }}>{g}</div>
                    <div style={{ fontSize:12, color:C.textSm }}>{cnt} leads</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age groups */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Age Groups</h3>
              {ageGroups.map(g=>(
                <div key={g.label} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{g.label}</span>
                    <span style={{ color:C.textSm }}>{g.count} lead{g.count!==1?"s":""}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:`linear-gradient(90deg, ${C.teal}, ${C.purple})`, borderRadius:4, width:`${maxAge?Math.round(g.count/maxAge*100):0}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>

            {/* Top locations */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Top Locations</h3>
              {locationCounts.map(([loc,cnt])=>(
                <div key={loc} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{loc}</span>
                    <span style={{ color:C.textSm }}>{cnt}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:C.teal, borderRadius:4, width:`${Math.round(cnt/maxLoc*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Requested destinations */}
            <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Requested Destinations</h3>
              {countryCounts.map(([country,cnt])=>(
                <div key={country} style={{ marginBottom:11 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{country}</span>
                    <span style={{ color:C.textSm }}>{cnt}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:C.purple, borderRadius:4, width:`${Math.round(cnt/maxCountry*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 3 — procedures */}
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
            <h3 style={{ fontWeight:700, fontSize:14, marginBottom:16 }}>Procedures Requested</h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:10 }}>
              {procedureCounts.map(p=>(
                <div key={p.label} style={{ marginBottom:4 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:4 }}>
                    <span style={{ fontWeight:600 }}>{p.label}</span>
                    <span style={{ color:C.textSm }}>{p.count}</span>
                  </div>
                  <div style={{ height:7, background:C.gray, borderRadius:4 }}>
                    <div style={{ height:7, background:`linear-gradient(90deg,${C.purple},${C.teal})`, borderRadius:4, width:`${Math.round(p.count/maxProc*100)}%`, transition:"width .4s" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [, setBookings] = useState([]);
  const [initialQuery, setInitialQuery] = useState("");
  const [isProviderView, setIsProviderView] = useState(false);
  const [isFacilitatorView, setIsFacilitatorView] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showFacilitatorModal, setShowFacilitatorModal] = useState(false);

  const openProvider = (prov) => setSelectedProvider(prov);
  const closeProvider = () => setSelectedProvider(null);
  const openFacilitatorModal = () => setShowFacilitatorModal(true);
  const closeFacilitatorModal = () => setShowFacilitatorModal(false);

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", minHeight:"100vh", background:C.offWhite, color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet"/>
      <style>{GLOBAL_CSS}</style>
      <Nav setPage={p=>{ setSelectedClinic(null); setPage(p); }} isProviderView={isProviderView} setIsProviderView={setIsProviderView} isFacilitatorView={isFacilitatorView} setIsFacilitatorView={setIsFacilitatorView}/>
      {isProviderView ? <ProviderDashboard/> : isFacilitatorView ? <FacilitatorDashboard/> : (
        <>
          {selectedClinic ? (
            <InternationalClinicProfile
              clinic={selectedClinic}
              onBack={()=>setSelectedClinic(null)}
              openFacilitatorModal={openFacilitatorModal}
            />
          ) : (
            <>
              {page==="home"&&<HomePage setPage={setPage} setInitialQuery={setInitialQuery}/>}
              {page==="chat"&&<ChatPage setPage={setPage} setSelectedProvider={openProvider} initialQuery={initialQuery} setInitialQuery={setInitialQuery} openFacilitatorModal={openFacilitatorModal}/>}
              {page==="directory"&&<DirectoryPage setPage={setPage} setSelectedProvider={openProvider}/>}
              {page==="facilitators"&&<FacilitatorsPage setPage={setPage} setSelectedProvider={openProvider}/>}
              {page==="international"&&<InternationalPage setSelectedClinic={setSelectedClinic} openFacilitatorModal={openFacilitatorModal}/>}
              {page==="login"&&<LoginPage setPage={setPage}/>}
              {page==="signup"&&<SignupPage setPage={setPage}/>}
              {page==="become-provider"&&<BecomeProviderPage setPage={setPage}/>}
            </>
          )}
        </>
      )}
      {selectedProvider && <ProviderModal provider={selectedProvider} onClose={closeProvider} setBookings={setBookings}/>}
      {showFacilitatorModal && <FacilitatorModal onClose={closeFacilitatorModal}/>}
    </div>
  );
}