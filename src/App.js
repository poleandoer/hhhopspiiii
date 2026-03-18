import { useState, useRef, useEffect } from "react";
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
  @keyframes slideInLeft { from{transform:translateX(-100%);opacity:0} to{transform:translateX(0);opacity:1} }
  .fade-up { animation: fadeUp .22s ease forwards; }
  .slide-in-left { animation: slideInLeft .25s ease forwards; }
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
  .bookmark-btn { transition:all .18s; }
  .bookmark-btn:hover { transform:scale(1.15); }
  .chat-history-item { transition:background .12s; }
  .chat-history-item:hover { background:${C.tealLt} !important; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:${C.grayMd}; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:${C.teal}; }
  * { scrollbar-width:thin; scrollbar-color:${C.grayMd} transparent; }
  @media (max-width:700px) {
    .nav-desktop { display:none !important; }
    .hamburger { display:flex !important; }
    .home-feature-grid { grid-template-columns:1fr !important; }
    .home-feature-card { flex-direction:row !important; text-align:left !important; padding:16px !important; }
    .home-feature-icon { width:40px !important; height:40px !important; flex-shrink:0; }
    .home-feature-card > div:last-child { text-align:left !important; }
    .dash-stats { grid-template-columns:repeat(2,1fr) !important; }
    .facil-leads-table-wrap { display:none !important; }
    .facil-leads-cards { display:flex !important; flex-direction:column; gap:8px; }
    .prov-dash-charts { grid-template-columns:1fr !important; }
    .prov-grid-3col { grid-template-columns:1fr !important; }
    .facil-charts { grid-template-columns:1fr !important; }
    .facil-analytics-row { grid-template-columns:1fr !important; }
    .home-search-box { padding:13px 50px 13px 18px !important; font-size:14px !important; }
    .home-chips span, .home-chips button { font-size:11px !important; padding:5px 12px !important; }
    .chat-sidebar { width:280px !important; }
  }
  @media (min-width:701px) {
    .hamburger { display:none !important; }
    .mobile-menu-panel { display:none !important; }
    .facil-leads-cards { display:none !important; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PROVIDERS = [
  { id:1, name:"Dr. Sarah Mitchell", specialty:"Family Medicine", rating:4.8, reviews:312, distance:0.8, city:"New York", address:"120 E 36th St", hours:"Mon–Fri 9–5", phone:"+1 212-555-0192", image:"SM", photo:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Preventive Care"], contracted:true, hasCalendar:true },
  { id:2, name:"Dr. James Okafor", specialty:"Cardiology", rating:4.9, reviews:187, distance:1.2, city:"New York", address:"340 E 72nd St", hours:"Tue–Sat 10–6", phone:"+1 212-555-0234", image:"JO", photo:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Internal Medicine"], contracted:true, hasCalendar:true },
  { id:3, name:"Dr. Elena Vasquez", specialty:"Dermatology", rating:4.7, reviews:421, distance:2.1, city:"Los Angeles", address:"8635 W 3rd St, Ste 200", hours:"Mon–Thu 8–4", phone:"+1 310-555-0311", image:"EV", photo:"https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=150&h=150&fit=crop&crop=face", tags:["Dermatology","Cosmetic"], contracted:false, hasCalendar:false },
  { id:4, name:"Glow Medical Spa", specialty:"Medical Aesthetics", rating:4.6, reviews:530, distance:1.5, city:"Miami", address:"1395 Brickell Ave, Ste 800", hours:"Daily 10–7", phone:"+1 305-555-0445", image:"GM", photo:"https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=150&h=150&fit=crop&crop=face", tags:["Botox","Injectables","Skin Care"], contracted:true, hasCalendar:true, branches:[
    { id:"4a", name:"Glow Medical Spa — Brickell", address:"1395 Brickell Ave, Ste 800", city:"Miami, FL", phone:"+1 305-555-0445", hours:"Daily 10–7", rating:4.6, reviews:340 },
    { id:"4b", name:"Glow Medical Spa — Wynwood", address:"2520 NW 2nd Ave", city:"Miami, FL", phone:"+1 305-555-0446", hours:"Mon–Sat 9–6", rating:4.5, reviews:190 },
  ] },
  { id:5, name:"Dr. Amir Patel", specialty:"Orthopedics", rating:4.5, reviews:203, distance:3.4, city:"Chicago", address:"680 N Lake Shore Dr", hours:"Mon–Fri 8–3", phone:"+1 312-555-0678", image:"AP", photo:"https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&h=150&fit=crop&crop=face", tags:["Orthopedics","Sports Medicine"], contracted:true, hasCalendar:false },
  { id:6, name:"Dr. Priya Sharma", specialty:"Cardiology", rating:4.3, reviews:156, distance:4.2, city:"Houston", address:"6624 Fannin St", hours:"MWF 9–4", phone:"+1 713-555-0789", image:"PS", photo:"https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=150&h=150&fit=crop&crop=face", tags:["Cardiology","Echocardiography"], contracted:false, hasCalendar:false },
  { id:7, name:"CityHealth Clinic", specialty:"Family Medicine", rating:4.2, reviews:89, distance:5.1, city:"Los Angeles", address:"4835 Van Nuys Blvd, Ste 105", hours:"Daily 8–8", phone:"+1 818-555-0890", image:"CH", photo:"https://images.unsplash.com/photo-1666214280557-091e285b2bba?w=150&h=150&fit=crop&crop=face", tags:["Family Medicine","Walk-in"], contracted:false, hasCalendar:false },
];

const FACILITATORS = [
  { id:10, name:"MedTravel Facilitators", rating:4.9, reviews:98, city:"New York", image:"MT", tags:["Hair Transplant","Cosmetic Surgery","International"], contracted:true, countries:["Turkey","Thailand","Poland"], languages:["EN","FR","TR"], procedures:["Hair Transplant","Rhinoplasty","Dental"] },
  { id:11, name:"GlobalCare Connect", rating:4.7, reviews:145, city:"Los Angeles", image:"GC", tags:["Dental","Cosmetic","Eastern Europe"], contracted:true, countries:["Hungary","Czech Republic","Thailand"], languages:["EN","DE"], procedures:["Dental","Cosmetic Surgery","Orthopedics"] },
  { id:12, name:"HealthBridge International", rating:4.8, reviews:211, city:"Miami", image:"HB", tags:["Cardiac","Oncology","Complex Surgery"], contracted:true, countries:["Germany","India","South Korea"], languages:["EN","HI","KO"], procedures:["Cardiac Surgery","Cancer Treatment","Joint Replacement"] },
  { id:13, name:"MediRoute Global", rating:4.6, reviews:77, city:"Houston", image:"MR", tags:["Fertility","Ophthalmology","Dental"], contracted:false, countries:["Spain","Cyprus","Mexico"], languages:["EN","FR","ES"], procedures:["IVF","LASIK","Dental Implants"] },
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
  { trigger:["headache","head","migraine"], matchTags:["Family Medicine","Preventive Care"], response:"Based on your symptoms, this could be a tension headache or migraine.\n\n- Rest in a quiet, dark room\n- Drink at least 2 glasses of water\n- Ibuprofen or acetaminophen may help\n- Cold or warm compress on forehead\n\nIf headache is sudden, severe, or accompanied by fever or stiff neck — seek emergency care immediately.\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["chest","heart","breathing","breath"], matchTags:["Cardiology","Internal Medicine","Echocardiography"], response:"IMPORTANT — Chest pain or difficulty breathing may indicate a serious condition.\n\nIf you have severe chest pain, shortness of breath, or pain in your arm or jaw — call 911 immediately.\n\nDo not wait. Please seek care now.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, emergency:true },
  { trigger:["cold","flu","fever","cough","sore throat"], matchTags:["Family Medicine","Walk-in","Preventive Care"], response:"Your symptoms suggest a common cold or flu.\n\n- Rest as much as possible\n- Warm liquids like broth or tea\n- Honey and lemon for sore throat\n- Saline nasal rinse for congestion\n- Fever above 39.5°C — see a doctor\n\nHere are providers who can help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["hair","transplant","turkey","abroad","facilitator","medical tourism","find care abroad","international","surgery abroad","treatment abroad","cheapest","knee replacement abroad","dental abroad"], matchTags:[], response:"Here are some top-rated international clinics that match your needs. You can click on a clinic name to see full details, or talk to a medical coordinator who will guide you through the entire process — from choosing a clinic to travel arrangements.\n\nAll clinics are accredited and vetted by Hospital.com.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, facilitator:true, showFacilitatorCTA:true },
  { trigger:["cardiologist","cardiology","heart doctor"], matchTags:["Cardiology","Internal Medicine","Echocardiography"], response:"Cardiology specialists diagnose and treat heart and vascular conditions. Consider their subspecialty, hospital affiliations, and new patient wait times.\n\nHere are cardiologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dermatologist","skin","acne","rash"], matchTags:["Dermatology","Cosmetic","Skin Care"], response:"A dermatologist can evaluate skin conditions properly. In the meantime: avoid touching the area, keep it clean, and protect from sun exposure.\n\nHere are dermatologists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["dentist","teeth","dental","tooth","cavity"], matchTags:["Family Medicine","Walk-in"], response:"A dentist can help with tooth pain, cavities, cleanings, and other oral health issues. Regular check-ups every 6 months are recommended.\n\nHere are providers who may help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["eye","vision","glasses","ophthalmol","optom"], matchTags:["Family Medicine","Preventive Care"], response:"An eye specialist can help with vision changes, eye pain, or routine eye exams. If you experience sudden vision loss, seek emergency care immediately.\n\nHere are providers who may help:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["botox","filler","inject","aestheti","cosmetic","med spa","medspa"], matchTags:["Botox","Injectables","Skin Care","Medical Aesthetics","Cosmetic"], response:"Medical aesthetics procedures like Botox and fillers should only be performed by licensed professionals. Always verify credentials and look at reviews before booking.\n\nHere are top-rated providers near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
  { trigger:["knee","joint","bone","orthop","sport","back pain","spine","shoulder"], matchTags:["Orthopedics","Sports Medicine"], response:"Orthopedic issues can range from acute injuries to chronic conditions. Early evaluation leads to better outcomes.\n\nHere are orthopedic specialists near you:\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true },
];
const DEFAULT_RESPONSE = { response:"I recommend consulting a healthcare professional for proper evaluation.\n\n- Monitor your symptoms\n- Stay hydrated and rest\n\nWould you like help finding a specialist?\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:true, matchTags:[] };

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const r of CHAT_RESPONSES) { if (r.trigger.some(t => lower.includes(t))) return r; }
  return DEFAULT_RESPONSE;
}

function matchProviders(text, resp) {
  const lower = text.toLowerCase();
  const tags = resp.matchTags || [];

  // Try matching by tags first
  if (tags.length > 0) {
    const matched = PROVIDERS.filter(p =>
      p.tags.some(t => tags.some(mt => t.toLowerCase().includes(mt.toLowerCase()) || mt.toLowerCase().includes(t.toLowerCase()))) ||
      tags.some(mt => p.specialty.toLowerCase().includes(mt.toLowerCase()))
    );
    if (matched.length > 0) {
      // Contracted first, then by rating
      return [...matched.filter(p=>p.contracted), ...matched.filter(p=>!p.contracted)]
        .sort((a,b)=>b.rating-a.rating)
        .slice(0, 3);
    }
  }

  // Try matching by query keywords against provider tags/specialty
  const queryMatched = PROVIDERS.filter(p =>
    p.tags.some(t => lower.includes(t.toLowerCase())) ||
    lower.includes(p.specialty.toLowerCase())
  );
  if (queryMatched.length > 0) {
    return [...queryMatched.filter(p=>p.contracted), ...queryMatched.filter(p=>!p.contracted)]
      .sort((a,b)=>b.rating-a.rating)
      .slice(0, 3);
  }

  // Fallback: top contracted providers
  return PROVIDERS.filter(p => p.contracted).sort((a,b)=>b.rating-a.rating).slice(0, 3);
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
function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth <= 700);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const h = (e) => setMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return mobile;
}

function Badge({ children, color = C.teal, bg = C.tealLt, small }) {
  return <span style={{ background:bg, color, fontSize:small?9:10, fontWeight:700, padding:small?"1px 6px":"2px 9px", borderRadius:20, letterSpacing:.4, whiteSpace:"nowrap" }}>{children}</span>;
}

function Chip({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{ padding:"5px 13px", border:`1.5px solid ${active?(color||C.teal):C.border}`, borderRadius:20, background:active?(color?color+"15":C.tealLt):C.white, color:active?(color||C.teal):C.textSm, fontSize:12, cursor:"pointer", fontWeight:active?700:400, fontFamily:"inherit", transition:"all .15s" }}>{label}</button>
  );
}


// ─── SEAL OF APPROVAL BADGE ──────────────────────────────────────────────────
function SealBadge({ small }) {
  return (
    <span title="Verified by Hospital.com" style={{ display:"inline-flex", alignItems:"center", gap:small?3:4, background:"linear-gradient(135deg, #047598, #5ACAD6)", color:"#fff", fontSize:small?9:11, fontWeight:700, padding:small?"2px 7px":"3px 10px", borderRadius:20, letterSpacing:.3, whiteSpace:"nowrap", cursor:"default" }}>
      <svg width={small?10:12} height={small?10:12} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
      {small ? "Verified" : "Hospital.com Verified"}
    </span>
  );
}

// ─── PROVIDER AVATAR ─────────────────────────────────────────────────────────
function ProviderAvatar({ provider, size=48, radius=12, fontSize=15 }) {
  const [imgError, setImgError] = useState(false);
  if (provider.photo && !imgError) {
    return (
      <div style={{ width:size, height:size, borderRadius:radius, overflow:"hidden", flexShrink:0, border:`1px solid ${C.borderLt}` }}>
        <img src={provider.photo} alt={provider.name} onError={()=>setImgError(true)} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
      </div>
    );
  }
  return (
    <div style={{ width:size, height:size, borderRadius:radius, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize, color:C.teal, flexShrink:0, border:`1px solid ${C.tealLt}` }}>{provider.image}</div>
  );
}

// ─── BOOKMARK ICON ────────────────────────────────────────────────────────────
function BookmarkIcon({ filled, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? C.teal : "none"} stroke={filled ? C.teal : C.textSm} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}

function BookmarkButton({ providerId, bookmarks, toggleBookmark, isLoggedIn, setPage, size = 18 }) {
  const isBookmarked = bookmarks.includes(providerId);
  const handleClick = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      setPage("signup");
      return;
    }
    toggleBookmark(providerId);
  };
  return (
    <button className="bookmark-btn" onClick={handleClick} title={isLoggedIn ? (isBookmarked ? "Remove bookmark" : "Bookmark this provider") : "Sign up to bookmark"}
      style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <BookmarkIcon filled={isBookmarked} size={size} />
    </button>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav({ setPage, isProviderView, setIsProviderView, isFacilitatorView, setIsFacilitatorView, showUserProfile, setShowUserProfile, providerTab, setProviderTab, facilitatorTab, setFacilitatorTab }) {
  const [open, setOpen] = useState(false);
  const patientLinks = [
    { label:"AI Health Assistant", page:"chat" },
    { label:"Find Local Care", page:"directory" },
    { label:"Global Health Services", page:"international" },
  ];
  const providerLinks = [
    { label:"Overview", tab:"overview" },
    { label:"Leads", tab:"leads" },
    { label:"Calendar", tab:"calendar" },
    { label:"Portal", tab:"portal" },
    { label:"My Clinics", tab:"profile" },
    { label:"Account", tab:"account" },
  ];
  const facilitatorLinks = [
    { label:"Overview", tab:"overview" },
    { label:"Leads", tab:"leads" },
    { label:"Analytics", tab:"analytics" },
    { label:"Account", tab:"account" },
  ];

  const activeLinks = isProviderView ? providerLinks : isFacilitatorView ? facilitatorLinks : patientLinks;
  const accentColor = isProviderView ? C.teal : isFacilitatorView ? C.purple : C.teal;

  return (
    <>
      <nav style={{ height:58, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", background:C.white, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:200 }}>
        <div onClick={() => { if(isProviderView||isFacilitatorView||showUserProfile){setIsProviderView(false);setIsFacilitatorView(false);setShowUserProfile(false);}else{setPage("home");}setOpen(false); }} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", userSelect:"none", minWidth:140 }}>
          <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-.3px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598", fontWeight:800 }}>.com</span></span>
          {(isProviderView||isFacilitatorView) && (
            <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:6, marginLeft:4, background:isProviderView?C.tealLt:C.purpleLt, color:isProviderView?C.teal:C.purple }}>{isProviderView?"Provider":"Facilitator"}</span>
          )}
        </div>
        <ul className="nav-desktop" style={{ display:"flex", gap:isProviderView||isFacilitatorView?8:28, listStyle:"none", position:"absolute", left:"50%", transform:"translateX(-50%)" }}>
          {activeLinks.map(l => {
            if (l.page) {
              return <li key={l.label}><button className="nav-link" onClick={() => { setPage(l.page); setShowUserProfile(false); }}>{l.label}</button></li>;
            }
            const isActive = isProviderView ? providerTab===l.tab : facilitatorTab===l.tab;
            return (
              <li key={l.label}>
                <button onClick={() => { isProviderView ? setProviderTab(l.tab) : setFacilitatorTab(l.tab); }}
                  style={{ padding:"8px 16px", background:isActive?`${accentColor}12`:"none", border:"none", borderRadius:10, fontWeight:isActive?700:500, fontSize:13.5, color:isActive?accentColor:C.textSm, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}
                  onMouseEnter={e=>{if(!isActive)e.currentTarget.style.color=accentColor;}}
                  onMouseLeave={e=>{if(!isActive)e.currentTarget.style.color=C.textSm;}}>
                  {l.label}
                </button>
              </li>
            );
          })}
        </ul>
        <div className="nav-desktop" style={{ display:"flex", gap:8, alignItems:"center" }}>
          {(isProviderView||isFacilitatorView||showUserProfile) ? (
            <button onClick={()=>{setIsProviderView(false);setIsFacilitatorView(false);setShowUserProfile(false);}} style={{ padding:"7px 18px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textSm, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => setPage("login")} style={{ padding:"7px 18px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button className="btn-primary" onClick={() => setPage("signup")} style={{ padding:"7px 18px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
            </>
          )}
        </div>
        <button className="hamburger" onClick={() => setOpen(o=>!o)} style={{ display:"none", flexDirection:"column", gap:5, background:"none", border:"none", cursor:"pointer", padding:4 }}>
          {[0,1,2].map(i => <span key={i} style={{ width:20, height:2, background:C.text, borderRadius:2, display:"block", transition:"all .2s",
            transform: open ? (i===0?"rotate(45deg) translate(5px,5px)":i===2?"rotate(-45deg) translate(5px,-5px)":"none") : "none",
            opacity: open && i===1 ? 0 : 1 }} />)}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu-panel fade-up" style={{ position:"fixed", top:58, left:0, right:0, background:C.white, borderBottom:`1px solid ${C.border}`, zIndex:199, padding:"12px 20px 20px", boxShadow:"0 8px 24px rgba(0,0,0,.1)" }}>
          {activeLinks.map(l => (
            <button key={l.label} onClick={() => {
              if(l.page){ setPage(l.page); setShowUserProfile(false); }
              else if(isProviderView) setProviderTab(l.tab);
              else if(isFacilitatorView) setFacilitatorTab(l.tab);
              setOpen(false);
            }} style={{ display:"block", width:"100%", textAlign:"left", padding:"13px 0", background:"none", border:"none", borderBottom:`1px solid ${C.borderLt}`, fontSize:15, fontWeight:500, color:C.text, cursor:"pointer", fontFamily:"inherit" }}>{l.label}</button>
          ))}
          {(isProviderView||isFacilitatorView||showUserProfile) ? (
            <button onClick={()=>{setIsProviderView(false);setIsFacilitatorView(false);setShowUserProfile(false);setOpen(false);}} style={{ marginTop:16, width:"100%", padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textSm, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          ) : (
            <div style={{ display:"flex", gap:8, marginTop:16 }}>
              <button onClick={() => { setPage("login"); setOpen(false); }} style={{ flex:1, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:22, background:C.white, color:C.textMd, fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Login</button>
              <button onClick={() => { setPage("signup"); setOpen(false); }} style={{ flex:1, padding:"11px", border:"none", borderRadius:22, background:C.teal, color:"#fff", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── FLOATING VIEW SWITCHER ──────────────────────────────────────────────────
function FloatingViewSwitcher({ showUserProfile, setShowUserProfile, isProviderView, setIsProviderView, isFacilitatorView, setIsFacilitatorView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const active = showUserProfile ? "user" : isProviderView ? "provider" : isFacilitatorView ? "facilitator" : null;

  return (
    <div ref={ref} style={{ position:"fixed", bottom:24, right:24, zIndex:500 }}>
      {/* Expanded menu */}
      {open && (
        <div className="fade-up" style={{ position:"absolute", bottom:"calc(100% + 10px)", right:0, width:220, background:C.white, border:`1px solid ${C.border}`, borderRadius:16, boxShadow:"0 12px 40px rgba(0,0,0,.15)", padding:8, display:"flex", flexDirection:"column", gap:4 }}>
          <div style={{ padding:"6px 12px", fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:".5px" }}>SWITCH VIEW</div>
          {/* User Profile */}
          <button onClick={()=>{setShowUserProfile(v=>!v);setIsProviderView(false);setIsFacilitatorView(false);setOpen(false);}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="user"?"#FFF3E0":"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="user")e.currentTarget.style.background=C.gray;}} onMouseLeave={e=>{if(active!=="user")e.currentTarget.style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="user"?"#E87722":"#FFF3E0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="user"?"#fff":"#E87722"} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="user"?"#E87722":C.text }}>My Profile</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Personal settings</div>
            </div>
          </button>
          {/* Provider Dashboard */}
          <button onClick={()=>{setIsProviderView(v=>!v);setIsFacilitatorView(false);setShowUserProfile(false);setOpen(false);}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="provider"?C.tealLt:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="provider")e.currentTarget.style.background=C.gray;}} onMouseLeave={e=>{if(active!=="provider")e.currentTarget.style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="provider"?C.teal:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="provider"?"#fff":C.teal} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="provider"?C.teal:C.text }}>Provider Dashboard</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Manage your practice</div>
            </div>
          </button>
          {/* Facilitator Dashboard */}
          <button onClick={()=>{setIsFacilitatorView(v=>!v);setIsProviderView(false);setShowUserProfile(false);setOpen(false);}}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:active==="facilitator"?C.purpleLt:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", transition:"background .12s" }}
            onMouseEnter={e=>{if(active!=="facilitator")e.currentTarget.style.background=C.gray;}} onMouseLeave={e=>{if(active!=="facilitator")e.currentTarget.style.background="transparent";}}>
            <div style={{ width:32, height:32, borderRadius:10, background:active==="facilitator"?C.purple:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active==="facilitator"?"#fff":C.purple} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:600, fontSize:13, color:active==="facilitator"?C.purple:C.text }}>Facilitator Portal</div>
              <div style={{ fontSize:10.5, color:C.textSm }}>Manage leads & clients</div>
            </div>
          </button>
          {/* Exit */}
          {active && (
            <button onClick={()=>{setShowUserProfile(false);setIsProviderView(false);setIsFacilitatorView(false);setOpen(false);}}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 12px", border:"none", borderRadius:12, background:"transparent", cursor:"pointer", fontFamily:"inherit", width:"100%", textAlign:"left", borderTop:`1px solid ${C.borderLt}`, marginTop:2, paddingTop:12 }}
              onMouseEnter={e=>e.currentTarget.style.background=C.gray} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
              <span style={{ fontWeight:600, fontSize:13, color:C.textSm }}>Back to Patient View</span>
            </button>
          )}
        </div>
      )}
      {/* FAB button */}
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:48, height:48, borderRadius:16, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", boxShadow:"0 4px 20px rgba(0,0,0,.15)",
          background: active==="user" ? "linear-gradient(135deg, #E87722, #FFB347)" :
                     active==="provider" ? `linear-gradient(135deg, ${C.teal}, #5ACAD6)` :
                     active==="facilitator" ? `linear-gradient(135deg, ${C.purple}, #9B6DD7)` :
                     C.white,
        }}>
        {active ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
            {active==="user" && <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
            {active==="provider" && <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>}
            {active==="facilitator" && <><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></>}
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2">
            <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
          </svg>
        )}
      </button>
    </div>
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

// Role Selector
function RoleSelector({ role, setRole }) {
  const roles = [
    { val:"patient", label:"Patient", desc:"Find care & book appointments", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>, color:C.teal, bg:C.tealLt },
    { val:"provider", label:"Provider", desc:"List your clinic & manage leads", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>, color:C.teal, bg:C.tealLt },
    { val:"facilitator", label:"Facilitator", desc:"Manage international patient leads", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, color:C.purple, bg:C.purpleLt },
  ];
  return (
    <div style={{ display:"flex", gap:10, marginBottom:22 }}>
      {roles.map(r => (
        <button key={r.val} onClick={()=>setRole(r.val)}
          style={{ flex:1, padding:"16px 10px 14px", border:`2px solid ${role===r.val?r.color:C.border}`, borderRadius:14, background:role===r.val?r.bg:C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", display:"flex", flexDirection:"column", alignItems:"center", gap:8, textAlign:"center" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", background:role===r.val?C.white:C.gray, display:"flex", alignItems:"center", justifyContent:"center", color:role===r.val?r.color:C.textSm, transition:"all .18s" }}>
            {r.icon}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:role===r.val?r.color:C.text, marginBottom:3 }}>{r.label}</div>
            <div style={{ fontSize:10.5, color:C.textSm, lineHeight:1.4 }}>{r.desc}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

function LoginPage({ setPage, onLogin }) {
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ email:"", pw:"" });
  const [show, setShow] = useState(false);
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:440, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>Sign In</h2>
          <p style={{ color:C.textSm, fontSize:13 }}>Sign in to your Hospital.com account</p>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:22 }}>
          {[{val:"patient",label:"Patient"},{val:"provider",label:"Provider"},{val:"facilitator",label:"Facilitator"}].map(r=>(
            <button key={r.val} onClick={()=>setRole(r.val)} style={{ flex:1, padding:"10px 8px", border:`2px solid ${role===r.val?(r.val==="facilitator"?C.purple:C.teal):C.border}`, borderRadius:50, background:role===r.val?(r.val==="facilitator"?C.purpleLt:C.tealLt):C.white, cursor:"pointer", fontFamily:"inherit", transition:"all .18s", fontSize:13, fontWeight:700, color:role===r.val?(r.val==="facilitator"?C.purple:C.teal):C.textMd }}>
              {r.label}
            </button>
          ))}
        </div>
        {role==="patient" && (
          <>
            <SocialBtn letter="G" label="Continue with Google" />
            <SocialBtn letter="A" label="Continue with Apple" />
            <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
              <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
            </div>
          </>
        )}
        <FieldInput label="Email" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
        <FieldInput label="Password" type={show?"text":"password"} value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))} placeholder="••••••••"
          hint={<button onClick={()=>{}} style={{ background:"none", border:"none", fontSize:12, color:C.teal, cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>Forgot?</button>}
          right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
        <button className="btn-primary" onClick={()=>{onLogin();setPage("home");}} style={{ width:"100%", background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Sign In as {role==="patient"?"Patient":role==="provider"?"Provider":"Facilitator"}</button>
        <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:18 }}>No account?{" "}<button onClick={()=>setPage("signup")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign Up</button></p>
      </div>
    </div>
  );
}

function SignupPage({ setPage, onLogin }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("patient");
  const [f, setF] = useState({ name:"", email:"", pw:"" });
  const [show, setShow] = useState(false);
  const [pf, setPf] = useState({ clinicName:"", specialty:"", location:"", email:"", phone:"" });
  const [ff, setFf] = useState({ orgName:"", name:"", email:"", phone:"", comments:"" });
  const [providerDone, setProviderDone] = useState(false);
  const [facilitatorDone, setFacilitatorDone] = useState(false);

  if (step === 0) {
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:480, background:C.white, borderRadius:22, padding:"36px 28px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ textAlign:"center", marginBottom:26 }}>
            <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:6 }}>Create your account</h2>
            <p style={{ color:C.textSm, fontSize:13.5 }}>Who are you signing up as?</p>
          </div>
          <RoleSelector role={role} setRole={setRole}/>
          <button className="btn-primary" onClick={()=>setStep(1)} style={{ width:"100%", background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>
            Continue as {role==="patient"?"Patient":role==="provider"?"Provider":"Facilitator"}
          </button>
          <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:16 }}>Already have an account?{" "}<button onClick={()=>setPage("login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
        </div>
      </div>
    );
  }

  // Provider/Facilitator done state
  if ((role==="provider"&&providerDone)||(role==="facilitator"&&facilitatorDone)) {
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding:"40px 34px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)", textAlign:"center" }}>
          <div style={{ width:56, height:56, borderRadius:"50%", background:role==="facilitator"?C.purpleLt:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 18px" }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={role==="facilitator"?C.purple:C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
          </div>
          <h2 style={{ fontSize:21, fontWeight:800, marginBottom:10 }}>Application Submitted!</h2>
          <p style={{ color:C.textSm, fontSize:14, lineHeight:1.6, marginBottom:22 }}>Thank you for your interest in joining Hospital.com as a {role}. Our admin team will review your application and notify you once approved.</p>
          <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:12, padding:"13px 16px", marginBottom:24, textAlign:"left" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#92400E", marginBottom:4 }}>Pending Admin Review</div>
            <div style={{ fontSize:13, color:"#78350F" }}>You will be notified by email once your account is approved. This typically takes 1–2 business days.</div>
          </div>
          <button className="btn-primary" onClick={()=>setPage("home")} style={{ background:role==="facilitator"?C.purple:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Back to Home</button>
        </div>
      </div>
    );
  }

  // Facilitator form
  if (role==="facilitator") {
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            Back
          </button>
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Facilitator Registration</h2>
            <p style={{ color:C.textSm, fontSize:13 }}>Tell us about your organization</p>
          </div>
          <FieldInput label="Organization Name *" type="text" value={ff.orgName} onChange={e=>setFf(p=>({...p,orgName:e.target.value}))} placeholder="e.g. MedTravel Facilitators" />
          <FieldInput label="Your Name *" type="text" value={ff.name} onChange={e=>setFf(p=>({...p,name:e.target.value}))} placeholder="Full name" />
          <FieldInput label="Email *" type="email" value={ff.email} onChange={e=>setFf(p=>({...p,email:e.target.value}))} placeholder="org@example.com" />
          <FieldInput label="Phone *" type="tel" value={ff.phone} onChange={e=>setFf(p=>({...p,phone:e.target.value}))} placeholder="+1 000-000-0000" />
          <div style={{ marginBottom:14 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Comments / Additional Info</label>
            <textarea value={ff.comments} onChange={e=>setFf(p=>({...p,comments:e.target.value}))} placeholder="Tell us about your services, countries you operate in, types of patients you work with…" rows={4}
              style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical" }} />
          </div>
          <div style={{ background:C.purpleLt, border:`1px solid ${C.purple}30`, borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:12.5, color:C.purple }}>
            Facilitator accounts require admin approval before going live.
          </div>
          <button className="btn-primary" onClick={()=>setFacilitatorDone(true)} style={{ width:"100%", background:C.purple, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Submit for Review</button>
        </div>
      </div>
    );
  }

  // Provider form
  if (role === "provider") {
    return (
      <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:460, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
          <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
            Back
          </button>
          <div style={{ textAlign:"center", marginBottom:22 }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Provider Registration</h2>
            <p style={{ color:C.textSm, fontSize:13 }}>Submit your details for admin review</p>
          </div>
          <FieldInput label="Clinic / Practice Name *" type="text" value={pf.clinicName} onChange={e=>setPf(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
          <FieldInput label="Specialty *" type="text" value={pf.specialty} onChange={e=>setPf(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Family Medicine" />
          <FieldInput label="Location / City *" type="text" value={pf.location} onChange={e=>setPf(p=>({...p,location:e.target.value}))} placeholder="e.g. New York, NY" />
          <FieldInput label="Email *" type="email" value={pf.email} onChange={e=>setPf(p=>({...p,email:e.target.value}))} placeholder="clinic@example.com" />
          <FieldInput label="Phone" type="tel" value={pf.phone} onChange={e=>setPf(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />
          <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:10, padding:"11px 14px", marginBottom:16, fontSize:12.5, color:"#92400E" }}>
            Provider accounts require admin approval before going live.
          </div>
          <button className="btn-primary" onClick={()=>setProviderDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Submit for Review</button>
        </div>
      </div>
    );
  }

  // Patient form
  return (
    <div style={{ minHeight:"calc(100vh - 58px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", background:`linear-gradient(150deg, ${C.offWhite} 55%, ${C.tealBg})` }}>
      <div className="fade-up" style={{ width:"100%", maxWidth:400, background:C.white, borderRadius:20, padding:"36px 30px", boxShadow:"0 8px 40px rgba(11,191,191,.1), 0 2px 8px rgba(0,0,0,.06)" }}>
        <button onClick={()=>setStep(0)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:20, padding:0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
          Back
        </button>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>Create your account</h2>
          <p style={{ color:C.textSm, fontSize:13 }}>Join thousands of patients finding better care</p>
        </div>
        <SocialBtn letter="G" label="Sign up with Google" />
        <SocialBtn letter="A" label="Sign up with Apple" />
        <div style={{ display:"flex", alignItems:"center", gap:10, margin:"14px 0" }}>
          <div style={{ flex:1, height:1, background:C.border }}/><span style={{ fontSize:11, color:C.textSm, fontWeight:600, whiteSpace:"nowrap" }}>or with email</span><div style={{ flex:1, height:1, background:C.border }}/>
        </div>
        <FieldInput label="Full Name *" type="text" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
        <FieldInput label="Email *" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
        <FieldInput label="Password *" type={show?"text":"password"} value={f.pw} onChange={e=>setF(p=>({...p,pw:e.target.value}))} placeholder="Create a password"
          right={<button onClick={()=>setShow(s=>!s)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textSm, fontWeight:700, fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>} />
        <button className="btn-primary" onClick={()=>{onLogin();setPage("home");}} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:50, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Create Account</button>
        <p style={{ textAlign:"center", fontSize:13, color:C.textSm, marginTop:16 }}>Already have an account?{" "}<button onClick={()=>setPage("login")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Sign In</button></p>
      </div>
    </div>
  );
}

// ─── BECOME A PROVIDER PAGE ───────────────────────────────────────────────────
function BecomeProviderPage({ setPage }) {
  const [f, setF] = useState({ clinicName:"", contactName:"", email:"", phone:"", specialty:"", country:"" });
  const [done, setDone] = useState(false);
  const isMobile = useIsMobile();
  const [faqOpen, setFaqOpen] = useState(null);

  const faqs = [
    { q:"How much does it cost to join?", a:"Creating a provider profile on Hospital.com is free. We offer premium features for enhanced visibility and lead generation." },
    { q:"How long does verification take?", a:"Typically 1–2 business days. Our team reviews your credentials and clinic information to ensure quality for patients." },
    { q:"What kind of providers can join?", a:"We welcome all licensed healthcare providers — from individual practitioners to large hospital systems, as well as medical tourism facilitators." },
    { q:"How will I receive patient inquiries?", a:"You'll receive inquiries directly to your email and dashboard. Patients can also book appointments through your profile if you enable the calendar feature." },
    { q:"Can I join from outside North America?", a:"Yes! Our Global Health Services section is open to certified clinics and providers worldwide." },
  ];

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
    <div style={{ minHeight:"calc(100vh - 58px)", background:C.white }}>
      {/* 1. HERO */}
      <div style={{ background:`linear-gradient(160deg, ${C.white} 40%, ${C.tealBg} 100%)`, padding:isMobile?"48px 16px 56px":"80px 16px 90px", textAlign:"center" }}>
        <div className="fade-up" style={{ maxWidth:720, margin:"0 auto" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"5px 14px", marginBottom:20 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.teal }}>FOR HEALTHCARE PROVIDERS</span>
          </div>
          <h1 style={{ fontSize:isMobile?26:42, fontWeight:800, letterSpacing:"-.5px", marginBottom:14, lineHeight:1.2 }}>Become a Provider on <span style={{ color:C.teal }}>Hospital.com</span></h1>
          <p style={{ color:C.textSm, fontSize:isMobile?14:18, maxWidth:540, margin:"0 auto 32px", lineHeight:1.6 }}>Connect with patients searching for trusted healthcare providers worldwide.</p>
          <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:isMobile?"14px 28px":"16px 40px", fontWeight:700, fontSize:isMobile?15:17, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
        </div>
      </div>

      {/* 2. CREDIBILITY / STATS */}
      <div style={{ padding:isMobile?"32px 16px":"48px 16px", background:C.offWhite, borderTop:`1px solid ${C.borderLt}` }}>
        <div style={{ maxWidth:700, margin:"0 auto", display:"flex", gap:isMobile?12:24, justifyContent:"center", flexWrap:"wrap" }}>
          {[
            { num:"20+", label:"Provider Countries" },
            { num:"50K+", label:"Monthly Healthcare Searches" },
            { num:"1,000+", label:"Global Provider Network" },
          ].map(s=>(
            <div key={s.label} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:isMobile?"18px 20px":"24px 32px", textAlign:"center", flex:isMobile?"1 1 140px":"1", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <div style={{ fontSize:isMobile?24:32, fontWeight:800, color:C.teal, marginBottom:4 }}>{s.num}</div>
              <div style={{ fontSize:isMobile?11:13, fontWeight:600, color:C.textSm }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. WHY JOIN */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px" }}>
        <div style={{ maxWidth:960, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:isMobile?22:30, fontWeight:800, marginBottom:8 }}>Why Join Hospital.com?</h2>
          <p style={{ color:C.textSm, fontSize:isMobile?13:15, marginBottom:32 }}>Everything you need to grow your practice and reach more patients.</p>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(4, 1fr)", gap:16 }}>
            {[
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title:"Reach New Patients", desc:"Get discovered by patients actively searching for your specialty." },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title:"AI-Powered Discovery", desc:"Our AI assistant recommends you to patients based on their needs." },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>, title:"Build Trust with Reviews", desc:"Collect verified patient reviews to build credibility." },
              { icon:<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>, title:"Global Visibility", desc:"Reach patients worldwide through our international network." },
            ].map(b=>(
              <div key={b.title} style={{ background:C.offWhite, borderRadius:16, padding:"28px 20px", textAlign:"center" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>{b.icon}</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{b.title}</div>
                <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. HOW IT WORKS */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.tealBg }}>
        <div style={{ maxWidth:700, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:isMobile?22:30, fontWeight:800, marginBottom:8 }}>How It Works</h2>
          <p style={{ color:C.textSm, fontSize:isMobile?13:15, marginBottom:32 }}>Get started in three simple steps.</p>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:16 }}>
            {[
              { num:"1", title:"Create Your Profile", desc:"Sign up and fill in your practice details, specialties, and credentials." },
              { num:"2", title:"Get Verified", desc:"Our team reviews and verifies your clinic within 1–2 business days." },
              { num:"3", title:"Start Receiving Patients", desc:"Once approved, patients can find you, read reviews, and book appointments." },
            ].map(s=>(
              <div key={s.num} style={{ background:C.white, borderRadius:16, padding:"28px 20px", textAlign:"center", boxShadow:"0 2px 10px rgba(0,0,0,.05)" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:C.teal, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:"#fff", margin:"0 auto 14px" }}>{s.num}</div>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:8 }}>{s.title}</div>
                <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. PARTNER TYPES — Two Cards */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px" }}>
        <div style={{ maxWidth:860, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:isMobile?22:30, fontWeight:800, marginBottom:8 }}>Partner with Hospital.com</h2>
          <p style={{ color:C.textSm, fontSize:isMobile?13:15, marginBottom:32 }}>Choose the partnership type that fits your practice.</p>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:20 }}>
            {/* Local Providers */}
            <div style={{ background:C.white, border:`2px solid ${C.teal}30`, borderRadius:20, padding:"32px 24px", textAlign:"left" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <h3 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Local Healthcare Providers</h3>
              <p style={{ color:C.textSm, fontSize:13.5, lineHeight:1.65, marginBottom:16 }}>Healthcare professionals and clinics looking to reach patients in their local region.</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
                {["Dentists","Chiropractors","Physiotherapists","Dermatologists","Clinics","Medical Spas"].map(t=>(
                  <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:11.5, fontWeight:600, padding:"4px 11px", borderRadius:10 }}>{t}</span>
                ))}
              </div>
              <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"11px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Join as Local Provider</button>
            </div>
            {/* Medical Tourism Partners */}
            <div style={{ background:C.white, border:`2px solid ${C.purple}30`, borderRadius:20, padding:"32px 24px", textAlign:"left" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <h3 style={{ fontSize:18, fontWeight:800, marginBottom:8 }}>Medical Tourism Partners</h3>
              <p style={{ color:C.textSm, fontSize:13.5, lineHeight:1.65, marginBottom:16 }}>Medical travel platforms and facilitator agencies connecting patients with international treatment options.</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
                {["Medical Tourism Platforms","Patient Coordinators","Treatment Facilitators","Healthcare Travel Agencies"].map(t=>(
                  <span key={t} style={{ background:C.purpleLt, color:C.purple, fontSize:11.5, fontWeight:600, padding:"4px 11px", borderRadius:10 }}>{t}</span>
                ))}
              </div>
              <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.purple, color:"#fff", border:"none", borderRadius:22, padding:"11px 24px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Become a Tourism Partner</button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PROFILE PREVIEW */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.offWhite }}>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, marginBottom:8 }}>Your Provider Profile</h2>
          <p style={{ color:C.textSm, fontSize:14, marginBottom:24 }}>Here's what patients will see when they find you on Hospital.com.</p>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", textAlign:"left", boxShadow:"0 4px 16px rgba(0,0,0,.06)" }}>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:14 }}>
              <div style={{ width:56, height:56, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:18, color:C.teal }}>SC</div>
              <div>
                <div style={{ fontWeight:700, fontSize:16 }}>Sunshine Medical Clinic</div>
                <div style={{ color:C.textSm, fontSize:13 }}>Family Medicine · New York, NY</div>
              </div>
              <span style={{ marginLeft:"auto", background:C.amberLt, color:"#B45309", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>Featured</span>
            </div>
            <div style={{ display:"flex", gap:8, marginBottom:12, fontSize:12.5, color:C.textSm }}>
              <span style={{ color:C.amber, fontWeight:700 }}>★ 4.8</span>
              <span>(312 reviews)</span>
              <span>Mon–Fri 9–5</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
              {["Family Medicine","Preventive Care","Walk-in"].map(t=><span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:10 }}>{t}</span>)}
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ flex:1, background:C.teal, color:"#fff", borderRadius:10, padding:"10px", textAlign:"center", fontWeight:700, fontSize:13 }}>Book Appointment</div>
              <div style={{ flex:1, background:C.white, color:C.teal, border:`1.5px solid ${C.teal}`, borderRadius:10, padding:"10px", textAlign:"center", fontWeight:700, fontSize:13 }}>Call</div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FAQ */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <h2 style={{ fontSize:isMobile?22:28, fontWeight:800, textAlign:"center", marginBottom:28 }}>Frequently Asked Questions</h2>
          {faqs.map((faq,i)=>(
            <div key={i} style={{ borderBottom:`1px solid ${C.border}`, marginBottom:0 }}>
              <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 4px", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                <span style={{ fontWeight:600, fontSize:14.5, color:C.text }}>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
              </button>
              {faqOpen===i && <div className="fade-up" style={{ padding:"0 4px 16px", color:C.textSm, fontSize:13.5, lineHeight:1.65 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* 8. SIGNUP FORM */}
      <div id="provider-form" style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.offWhite }}>
        <div style={{ maxWidth:540, margin:"0 auto" }}>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"36px 30px", boxShadow:"0 4px 20px rgba(11,191,191,.09)" }}>
            <h2 style={{ fontSize:20, fontWeight:800, marginBottom:6, textAlign:"center" }}>Become a Provider</h2>
            <p style={{ color:C.textSm, fontSize:13, marginBottom:24, textAlign:"center" }}>Fill in your details and our team will be in touch.</p>
            <FieldInput label="Clinic / Provider Name *" type="text" value={f.clinicName} onChange={e=>setF(p=>({...p,clinicName:e.target.value}))} placeholder="e.g. Sunshine Medical Clinic" />
            <FieldInput label="Country *" type="text" value={f.country} onChange={e=>setF(p=>({...p,country:e.target.value}))} placeholder="e.g. United States, Canada, Turkey" />
            <FieldInput label="Specialty *" type="text" value={f.specialty} onChange={e=>setF(p=>({...p,specialty:e.target.value}))} placeholder="e.g. Cardiology, Dental, Plastic Surgery" />
            <FieldInput label="Email *" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@clinic.com" />
            <FieldInput label="Phone" type="tel" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />
            <button className="btn-primary" onClick={()=>setDone(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Become a Provider</button>
          </div>
        </div>
      </div>

      {/* 9. FINAL CTA */}
      <div style={{ background:"linear-gradient(135deg,#0E1C26,#1a3a4a)", padding:isMobile?"44px 16px":"72px 16px", textAlign:"center" }}>
        <h2 style={{ color:"#fff", fontSize:isMobile?22:32, fontWeight:800, marginBottom:12, letterSpacing:"-.3px" }}>Start Connecting with Patients Worldwide</h2>
        <p style={{ color:"#94A3B8", fontSize:isMobile?13:16, marginBottom:28, maxWidth:480, margin:"0 auto 28px" }}>Join Hospital.com's growing network and let patients find you.</p>
        <button className="btn-primary" onClick={()=>document.getElementById("provider-form")?.scrollIntoView({behavior:"smooth"})} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"15px 40px", fontWeight:700, fontSize:17, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
      </div>
      <Footer setPage={setPage} />
    </div>
  );
}

// ─── FACILITATOR CONTACT FORM MODAL ──────────────────────────────────────────
function FacilitatorModal({ onClose, clinic }) {
  const hasClinic = !!clinic;
  const [f, setF] = useState({
    name:"", email:"", phone:"",
    procedure: "",
    country: hasClinic ? `${clinic.country} — ${clinic.city}` : "",
    clinicName: hasClinic ? clinic.name : "",
    message:""
  });
  const [selectedProcs, setSelectedProcs] = useState([]);
  const [done, setDone] = useState(false);

  const toggleProc = (p) => setSelectedProcs(prev => prev.includes(p) ? prev.filter(x=>x!==p) : [...prev, p]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.55)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
      <div className="fade-up" style={{ background:C.white, borderRadius:20, width:"100%", maxWidth:500, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ padding:"22px 24px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, background:C.white, zIndex:10, borderRadius:"20px 20px 0 0" }}>
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
              {/* Clinic info banner when coming from a clinic */}
              {hasClinic && (
                <div style={{ background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:12, padding:"14px 16px", marginBottom:18, display:"flex", gap:12, alignItems:"center" }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.teal, flexShrink:0, border:`1px solid ${C.teal}20` }}>{clinic.image}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:13.5, color:C.text }}>{clinic.name}</div>
                    <div style={{ fontSize:12, color:C.textSm }}>{clinic.city}, {clinic.country} {clinic.flag}</div>
                  </div>
                </div>
              )}

              <FieldInput label="Full Name *" type="text" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="Your full name" />
              <FieldInput label="Email *" type="email" value={f.email} onChange={e=>setF(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
              <FieldInput label="Phone Number" type="tel" value={f.phone} onChange={e=>setF(p=>({...p,phone:e.target.value}))} placeholder="+1 212-555-0000" />

              {/* Clinic & Country — locked when pre-filled */}
              {hasClinic ? (
                <>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Clinic</label>
                    <div style={{ padding:"10px 13px", border:`1.5px solid ${C.borderLt}`, borderRadius:9, fontSize:14, background:C.offWhite, color:C.textMd }}>{clinic.name}</div>
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Country</label>
                    <div style={{ padding:"10px 13px", border:`1.5px solid ${C.borderLt}`, borderRadius:9, fontSize:14, background:C.offWhite, color:C.textMd }}>{clinic.city}, {clinic.country}</div>
                  </div>
                  {/* Procedure picker from clinic's list */}
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:8 }}>Procedure(s) *</label>
                    <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                      {clinic.procedures.map(p => {
                        const active = selectedProcs.includes(p);
                        return (
                          <button key={p} onClick={()=>toggleProc(p)} style={{ padding:"7px 14px", border:`1.5px solid ${active?C.teal:C.border}`, borderRadius:20, background:active?C.tealLt:C.white, color:active?C.teal:C.textMd, fontSize:13, fontWeight:active?700:400, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", display:"flex", alignItems:"center", gap:5 }}>
                            {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>}
                            {p}
                          </button>
                        );
                      })}
                    </div>
                    {selectedProcs.length === 0 && <p style={{ fontSize:11, color:C.textSm, marginTop:6 }}>Select one or more procedures</p>}
                  </div>
                </>
              ) : (
                <>
                  <FieldInput label="Procedure *" type="text" value={f.procedure} onChange={e=>setF(p=>({...p,procedure:e.target.value}))} placeholder="e.g. Hair transplant, Dental implants, Knee replacement" />
                  <FieldInput label="Preferred country or region (optional)" type="text" value={f.country} onChange={e=>setF(p=>({...p,country:e.target.value}))} placeholder="e.g. Turkey, Southeast Asia, Europe" />
                </>
              )}

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
function ProviderCard({ provider, onClick, onNameClick, compact, bookmarks, toggleBookmark, isLoggedIn, setPage }) {
  return (
    <div className="card" onClick={()=>onClick(provider)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:compact?"12px 14px":"18px 20px", cursor:"pointer", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
      <ProviderAvatar provider={provider} size={compact?42:52} radius={12} fontSize={compact?13:17} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:2 }}>
          <span onClick={onNameClick ? (e)=>{e.stopPropagation();onNameClick(provider);} : undefined} style={{ fontWeight:700, fontSize:compact?13.5:15, color:onNameClick?C.teal:C.text, cursor:onNameClick?"pointer":"inherit", transition:"color .15s" }}
            onMouseEnter={onNameClick?e=>{e.currentTarget.style.textDecoration="underline";}:undefined}
            onMouseLeave={onNameClick?e=>{e.currentTarget.style.textDecoration="none";}:undefined}>{provider.name}</span>
          {provider.contracted && <SealBadge small />}
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
      {bookmarks && (
        <BookmarkButton providerId={provider.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} size={compact?16:18} />
      )}
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
          background:C.white, border:`1px solid ${C.border}`, borderRadius:16,
          boxShadow:"0 12px 36px rgba(0,0,0,.12)", zIndex:999, overflow:"hidden", padding:"6px",
        }}>
          {options.map(o => {
            const val = o.value ?? o;
            const lbl = o.label ?? o;
            const selected = val === value;
            return (
              <button key={val} onClick={() => { onChange(val); setOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", gap:8, width:"100%", textAlign:"left", padding:"10px 14px",
                  background: selected ? C.tealLt : "transparent",
                  color: selected ? C.teal : C.text,
                  fontWeight: selected ? 700 : 500,
                  fontSize:14, border:"none", borderRadius:11, cursor:"pointer",
                  fontFamily:"inherit", transition:"background .12s",
                }}
                onMouseEnter={e => { if(!selected) e.currentTarget.style.background = C.gray; }}
                onMouseLeave={e => { if(!selected) e.currentTarget.style.background = selected ? C.tealLt : "transparent"; }}
              >
                {selected && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="3" style={{ flexShrink:0 }}><polyline points="20,6 9,17 4,12"/></svg>}
                {lbl}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── HOME PAGE DATA ──────────────────────────────────────────────────────────
const HOME_SPECIALTIES = [
  { icon:"🫀", label:"Cardiology" },
  { icon:"🦷", label:"Dentistry" },
  { icon:"🧴", label:"Dermatology" },
  { icon:"👁", label:"Ophthalmology" },
  { icon:"🦴", label:"Orthopedics" },
  { icon:"🧠", label:"Psychiatry" },
  { icon:"👶", label:"Pediatrics" },
  { icon:"💊", label:"Family Medicine" },
  { icon:"🏥", label:"Urgent Care" },
  { icon:"🔬", label:"Gastroenterology" },
  { icon:"🩺", label:"OB-GYN" },
  { icon:"💆", label:"Medical Aesthetics" },
];

const HOME_PROCEDURES = [
  "Teeth Cleaning","Annual Checkup","Skin Exam","Eye Exam","Physical Therapy","Botox","Blood Work","Allergy Testing","Colonoscopy","Knee Replacement","Hair Transplant","LASIK"
];

const HOME_REASONS = [
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title:"Verified Providers", desc:"Every provider is credentialed and reviewed by real patients." },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title:"Book Instantly", desc:"Schedule appointments online 24/7 — no phone calls needed." },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>, title:"Find Care Nearby", desc:"Search by specialty, insurance, and location to find the right fit." },
  { icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title:"AI Health Assistant", desc:"Get instant guidance on symptoms and find the right specialist with AI." },
];

// ─── HOME INSURANCE LIST ─────────────────────────────────────────────────────

// ─── USER PROFILE PAGE ────────────────────────────────────────────────────────
function UserProfilePage({ setPage }) {
  const [profile, setProfile] = useState({ firstName:"John", lastName:"Doe", email:"john.doe@gmail.com", phone:"+1 212-555-0100", city:"New York", state:"NY", zip:"10001", dob:"1990-05-15", insurance:"Aetna" });
  const [saved, setSaved] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const isMobile = useIsMobile();

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false), 3000); };
  const handleEmailChange = () => {
    if (!newEmail.trim() || !newEmail.includes("@")) return;
    setEmailSent(true);
    setTimeout(()=>{ setEmailSent(false); setShowEmailChange(false); setNewEmail(""); }, 4000);
  };

  const Field = ({ label, field, type="text", placeholder="" }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>{label}</label>
      <input type={type} value={profile[field]} onChange={e=>setProfile(p=>({...p,[field]:e.target.value}))} placeholder={placeholder}
        style={{ width:"100%", padding:"10px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", transition:"border-color .15s" }}
        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
    </div>
  );

  return (
    <div style={{ minHeight:"calc(100vh - 58px)", background:C.offWhite }}>
      <div style={{ maxWidth:680, margin:"0 auto", padding:isMobile?"24px 16px 48px":"40px 24px 60px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28 }}>
          <div style={{ width:64, height:64, borderRadius:18, background:"linear-gradient(135deg, #E87722, #FFB347)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:22, color:"#fff" }}>
            {profile.firstName[0]}{profile.lastName[0]}
          </div>
          <div>
            <h1 style={{ fontSize:isMobile?20:26, fontWeight:800, margin:0 }}>My Profile</h1>
            <p style={{ color:C.textSm, fontSize:13.5, marginTop:2 }}>Manage your personal information</p>
          </div>
        </div>

        {/* Personal Info */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Personal Information</h2>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 20px" }}>
            <Field label="First Name" field="firstName" />
            <Field label="Last Name" field="lastName" />
          </div>
          <Field label="Date of Birth" field="dob" type="date" />
        </div>

        {/* Contact */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Contact Details</h2>
          {/* Email — read-only with change flow */}
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Email</label>
            <div style={{ display:"flex", gap:10, alignItems:"center" }}>
              <div style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.offWhite, color:C.textMd }}>{profile.email}</div>
              <button onClick={()=>setShowEmailChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Change</button>
            </div>
            {showEmailChange && (
              <div className="fade-up" style={{ marginTop:10, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px" }}>
                {emailSent ? (
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:C.green }}>Verification link sent!</div>
                      <div style={{ fontSize:12.5, color:C.textSm, marginTop:2 }}>Check <strong>{newEmail}</strong> and click the link to confirm your new email address.</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize:12.5, color:C.textSm, marginBottom:10 }}>Enter your new email. We'll send a verification link to confirm the change.</p>
                    <div style={{ display:"flex", gap:8 }}>
                      <input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="new.email@example.com"
                        style={{ flex:1, padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                      <button onClick={handleEmailChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Send Link</button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <Field label="Phone Number" field="phone" type="tel" />
        </div>

        {/* Location */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
          <h2 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Location</h2>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"2fr 1fr 1fr", gap:"0 20px" }}>
            <Field label="City" field="city" />
            <Field label="State" field="state" />
            <Field label="ZIP Code" field="zip" />
          </div>
        </div>

        {/* Save */}
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button onClick={handleSave} className="btn-primary" style={{ background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"13px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
          {saved && <span className="fade-up" style={{ color:C.green, fontWeight:600, fontSize:14 }}>✓ Profile saved!</span>}
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT TAB (shared by Provider & Facilitator) ─────────────────────────
function AccountTab({ role }) {
  const [acc, setAcc] = useState({ firstName: role==="provider"?"Jessica":"Mark", lastName: role==="provider"?"Chen":"Williams", email: role==="provider"?"jessica.chen@glowmedspa.com":"mark.w@globalcare.com", phone: role==="provider"?"+1 305-555-0445":"+1 310-555-1010" });
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pw, setPw] = useState({ current:"", newPw:"", confirm:"" });
  const [pwSaved, setPwSaved] = useState(false);
  const [saved, setSaved] = useState(false);
  const isMobile = useIsMobile();

  const handleEmailChange = () => {
    if (!newEmail.trim()||!newEmail.includes("@")) return;
    setEmailSent(true);
    setTimeout(()=>{setEmailSent(false);setShowEmailChange(false);setNewEmail("");},4000);
  };
  const handlePwChange = () => {
    if (!pw.current||!pw.newPw||pw.newPw!==pw.confirm) return;
    setPwSaved(true);
    setTimeout(()=>{setPwSaved(false);setShowPwChange(false);setPw({current:"",newPw:"",confirm:""});},3000);
  };

  return (
    <div style={{ maxWidth:600, margin:"0 auto", display:"grid", gap:16 }}>
      {/* Personal Info */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:18 }}>Account Information</h3>
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 20px" }}>
          {[["First Name","firstName"],["Last Name","lastName"]].map(([l,k])=>(
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
              <input value={acc[k]} onChange={e=>setAcc(p=>({...p,[k]:e.target.value}))}
                style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Phone</label>
          <input value={acc.phone} onChange={e=>setAcc(p=>({...p,phone:e.target.value}))}
            style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),3000);}} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 28px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save Changes</button>
        {saved && <span className="fade-up" style={{ marginLeft:10, color:C.green, fontWeight:600, fontSize:13 }}>✓ Saved!</span>}
      </div>

      {/* Email */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <h3 style={{ fontWeight:700, fontSize:16, marginBottom:14 }}>Email Address</h3>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:showEmailChange?14:0 }}>
          <div style={{ flex:1, padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, background:C.offWhite, color:C.textMd }}>{acc.email}</div>
          <button onClick={()=>setShowEmailChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Change</button>
        </div>
        {showEmailChange && (
          <div className="fade-up" style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:16 }}>
            {emailSent ? (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                <div><div style={{ fontWeight:700, fontSize:14, color:C.green }}>Verification link sent!</div><div style={{ fontSize:12, color:C.textSm }}>Check <strong>{newEmail}</strong> to confirm.</div></div>
              </div>
            ) : (
              <>
                <p style={{ fontSize:12.5, color:C.textSm, marginBottom:10 }}>We'll send a verification link to your new email.</p>
                <div style={{ display:"flex", gap:8 }}>
                  <input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} placeholder="new.email@example.com"
                    style={{ flex:1, padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                  <button onClick={handleEmailChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 18px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Send Link</button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Password */}
      <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:showPwChange?14:0 }}>
          <h3 style={{ fontWeight:700, fontSize:16 }}>Password</h3>
          <button onClick={()=>setShowPwChange(s=>!s)} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"8px 16px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>{showPwChange?"Cancel":"Change Password"}</button>
        </div>
        {showPwChange && (
          <div className="fade-up">
            {pwSaved ? (
              <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 0" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                <span style={{ fontWeight:700, fontSize:14, color:C.green }}>Password updated!</span>
              </div>
            ) : (
              <>
                {[["Current Password","current"],["New Password","newPw"],["Confirm New Password","confirm"]].map(([l,k])=>(
                  <div key={k} style={{ marginBottom:12 }}>
                    <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
                    <input type="password" value={pw[k]} onChange={e=>setPw(p=>({...p,[k]:e.target.value}))} placeholder="••••••••"
                      style={{ width:"100%", padding:"9px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                      onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                  </div>
                ))}
                {pw.newPw && pw.confirm && pw.newPw!==pw.confirm && <p style={{ fontSize:12, color:C.red, marginBottom:8 }}>Passwords don't match</p>}
                <button onClick={handlePwChange} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 28px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Update Password</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Payment Method — provider only */}
      {role==="provider" && (
        <PaymentMethodCard />
      )}
    </div>
  );
}

function PaymentMethodCard() {
  const [card, setCard] = useState({ number:"•••• •••• •••• 4242", name:"Jessica Chen", expiry:"12/27", brand:"Visa" });
  const [editing, setEditing] = useState(false);
  const [editCard, setEditCard] = useState({ number:"", name:"", expiry:"", cvc:"" });
  const [cardSaved, setCardSaved] = useState(false);

  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <h3 style={{ fontWeight:700, fontSize:16 }}>Payment Method</h3>
        <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:C.textSm }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Secured by Stripe
        </div>
      </div>

      {!editing ? (
        <>
          <div style={{ background:`linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`, borderRadius:14, padding:"20px 22px", color:"#fff", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, opacity:.6 }}>{card.brand}</div>
              <svg width="32" height="20" viewBox="0 0 32 20"><rect width="32" height="20" rx="3" fill="#fff" fillOpacity=".15"/><circle cx="12" cy="10" r="6" fill="#EB001B" fillOpacity=".8"/><circle cx="20" cy="10" r="6" fill="#F79E1B" fillOpacity=".8"/></svg>
            </div>
            <div style={{ fontSize:18, fontWeight:700, letterSpacing:2, marginBottom:16 }}>{card.number}</div>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <div><div style={{ fontSize:9, opacity:.5, marginBottom:2 }}>CARD HOLDER</div><div style={{ fontSize:12, fontWeight:600 }}>{card.name}</div></div>
              <div><div style={{ fontSize:9, opacity:.5, marginBottom:2 }}>EXPIRES</div><div style={{ fontSize:12, fontWeight:600 }}>{card.expiry}</div></div>
            </div>
          </div>
          <button onClick={()=>{setEditing(true);setEditCard({number:"",name:card.name,expiry:"",cvc:""});}} style={{ background:"none", border:`1.5px solid ${C.border}`, borderRadius:10, padding:"9px 20px", fontSize:13, fontWeight:600, color:C.teal, cursor:"pointer", fontFamily:"inherit" }}>Update Card</button>
        </>
      ) : (
        <div className="fade-up">
          {cardSaved ? (
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"16px 0" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              <span style={{ fontWeight:700, fontSize:14, color:C.green }}>Card updated successfully!</span>
            </div>
          ) : (
            <>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Card Number</label>
                <input value={editCard.number} onChange={e=>setEditCard(p=>({...p,number:e.target.value}))} placeholder="1234 5678 9012 3456"
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", letterSpacing:1 }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Name on Card</label>
                <input value={editCard.name} onChange={e=>setEditCard(p=>({...p,name:e.target.value}))} placeholder="John Doe"
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>Expiry</label>
                  <input value={editCard.expiry} onChange={e=>setEditCard(p=>({...p,expiry:e.target.value}))} placeholder="MM/YY"
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>CVC</label>
                  <input value={editCard.cvc} onChange={e=>setEditCard(p=>({...p,cvc:e.target.value}))} placeholder="123" type="password" maxLength={4}
                    style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit" }}
                    onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                </div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>{setCardSaved(true);setTimeout(()=>{setCardSaved(false);setEditing(false);setCard(c=>({...c,number:"•••• •••• •••• "+editCard.number.slice(-4),name:editCard.name||c.name,expiry:editCard.expiry||c.expiry}));},2000);}}
                  style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save Card</button>
                <button onClick={()=>setEditing(false)} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"10px 20px", fontWeight:600, fontSize:13, color:C.textSm, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
function Footer({ setPage }) {
  const [showContact, setShowContact] = useState(false);
  const isMobile = useIsMobile();
  return (
    <>
      {showContact && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowContact(false);}} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
          <div className="fade-up" style={{ background:C.white, borderRadius:20, padding:"32px 28px", maxWidth:400, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.2)", textAlign:"center" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={C.teal} stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
            </div>
            <h3 style={{ fontWeight:800, fontSize:20, marginBottom:12 }}>Contact Us</h3>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:8 }}><strong>Phone:</strong> +1 (855) 962-0100</div>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:8 }}><strong>Email:</strong> support@hospital.com</div>
            <div style={{ fontSize:14, color:C.textMd, marginBottom:20 }}><strong>Address:</strong> 350 Fifth Avenue, Suite 4820, New York, NY 10118</div>
            <div style={{ display:"flex", gap:8 }}>
              <a href="tel:+18559620100" className="btn-primary" style={{ flex:1, background:C.teal, color:"#fff", border:"none", borderRadius:12, padding:"12px", fontWeight:700, fontSize:14, textDecoration:"none", display:"flex", alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                Call Now
              </a>
              <button onClick={()=>setShowContact(false)} style={{ flex:1, background:C.white, color:C.textMd, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px", fontWeight:600, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ background:"#0E1C26", padding:isMobile?"32px 16px":"48px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4, 1fr)", gap:isMobile?24:40, marginBottom:32 }}>
            <div>
              <div style={{ marginBottom:14 }}><span style={{ fontSize:18, fontWeight:800 }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#5ACAD6" }}>.com</span></span></div>
              <p style={{ fontSize:12.5, color:"#7A8FA0", lineHeight:1.6 }}>AI-powered healthcare platform connecting patients with trusted providers worldwide.</p>
              <button onClick={()=>setShowContact(true)} style={{ marginTop:14, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 20px", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                Contact Us
              </button>
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>For Patients</div>
              {["AI Health Assistant","Find Local Care","Global Health Services","Browse Specialties","Insurance Plans"].map(l=>(
                <div key={l} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.color=C.teal} onMouseLeave={e=>e.currentTarget.style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>For Providers</div>
              {["Become a Partner","List Your Practice","Provider Dashboard","Facilitator Portal","Help Center"].map(l=>(
                <div key={l} onClick={l==="Become a Partner"?()=>setPage("become-provider"):undefined} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.color=C.teal} onMouseLeave={e=>e.currentTarget.style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:"#fff", marginBottom:12 }}>Company</div>
              {["About Us","Careers","Press","Blog"].map(l=>(
                <div key={l} style={{ fontSize:12.5, color:"#7A8FA0", padding:"4px 0", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.color=C.teal} onMouseLeave={e=>e.currentTarget.style.color="#7A8FA0"}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"1px solid #1a3a4a", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
              {["Privacy Policy","Terms of Service","Cookie Policy","Accessibility"].map(l=>(
                <span key={l} style={{ fontSize:12, color:"#7A8FA0", cursor:"pointer" }}>{l}</span>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:"#546A7B" }}>© 2026 Hospital.com. All rights reserved.</div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ setPage, setInitialQuery, setInitialSpecialty, openProviderProfile, openClinicProfile }) {
  const [q, setQ] = useState("");
  const isMobile = useIsMobile();
  const send = (v) => { const t=v||q; if(!t.trim())return; setInitialQuery(t); setPage("chat"); };
  const suggestions = ["Find a cardiologist","I have a headache","Hair transplant abroad","Sore throat remedies","Botox near me","Knee pain treatment"];

  return (
    <div style={{ minHeight:"calc(100vh - 58px)", background:C.white }}>
      {/* HERO — split layout, full viewport */}
      <div style={{ background:`linear-gradient(160deg, ${C.white} 40%, ${C.tealBg} 100%)`, display:"flex", alignItems:"center", padding:isMobile?"40px 16px":"0 40px", minHeight:"calc(100vh - 58px)" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", width:"100%", display:"flex", alignItems:isMobile?"stretch":"center", flexDirection:isMobile?"column":"row", gap:isMobile?32:60 }}>

          {/* LEFT — branding + text */}
          <div style={{ flex:1 }}>
            <div style={{ marginBottom:isMobile?10:18 }}>
              <span style={{ fontSize:isMobile?28:42, fontWeight:800, letterSpacing:"-.5px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598" }}>.com</span></span>
            </div>
            <h1 style={{ fontSize:isMobile?24:40, fontWeight:800, lineHeight:1.2, letterSpacing:"-.4px", marginBottom:isMobile?10:16 }}>
              AI-powered healthcare,<br/>right at your fingertips
            </h1>
            <p style={{ color:C.textSm, fontSize:isMobile?14:17, lineHeight:1.6, maxWidth:440 }}>
              Ask any health question, find specialists, or explore treatment options abroad — all in one place.
            </p>
          </div>

          {/* RIGHT — search card + chips */}
          <div style={{ flex:1, maxWidth:isMobile?"100%":520 }}>
            <div style={{ background:C.white, borderRadius:20, padding:isMobile?"24px 20px":"36px 32px", boxShadow:"0 8px 40px rgba(0,0,0,.08)", border:`1px solid ${C.borderLt}` }}>
              <div style={{ fontWeight:700, fontSize:isMobile?16:19, marginBottom:6 }}>How can we help you?</div>
              <p style={{ color:C.textSm, fontSize:13, marginBottom:18 }}>Ask a health question or search for a specialist</p>

              <div style={{ position:"relative", marginBottom:16 }}>
                <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask me any healthcare question…"
                  className="home-search-box"
                  style={{ width:"100%", padding:"14px 52px 14px 18px", border:`2px solid ${C.border}`, borderRadius:14, fontSize:isMobile?14:15, outline:"none", background:C.offWhite, fontFamily:"inherit", transition:"border-color .2s" }}
                  onFocus={e=>{e.target.style.borderColor=C.teal;e.target.style.background=C.white;}} onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.background=C.offWhite;}} />
                <button onClick={()=>send()} style={{ position:"absolute", right:8, top:"50%", transform:"translateY(-50%)", background:C.teal, border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
                </button>
              </div>

              <div className="home-chips" style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:7 }}>
                {suggestions.map(s=>(
                  <button key={s} onClick={()=>send(s)} style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:10, padding:"7px 10px", fontSize:11.5, color:C.textSm, cursor:"pointer", transition:"all .15s", fontFamily:"inherit", textAlign:"center" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;e.currentTarget.style.background=C.tealLt;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textSm;e.currentTarget.style.background=C.offWhite;}}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT SECTIONS (below hero) ─────────────────────────────────── */}

      {/* WHY USE HOSPITAL.COM */}
      <div style={{ background:C.tealBg, padding:isMobile?"28px 16px":"44px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ fontWeight:700, fontSize:isMobile?16:20, marginBottom:18 }}>Why use Hospital.com to find local care?</div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr 1fr":"repeat(4, 1fr)", gap:14 }}>
            {HOME_REASONS.map(r=>(
              <div key={r.title} style={{ background:C.white, borderRadius:14, padding:"20px 18px", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <div style={{ width:40, height:40, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>{r.icon}</div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:6 }}>{r.title}</div>
                <div style={{ color:C.textSm, fontSize:12.5, lineHeight:1.6 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INSURANCE PROVIDERS */}
      <div style={{ background:C.tealBg, padding:isMobile?"28px 16px":"40px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:isMobile?"flex-start":"center", justifyContent:"space-between", flexDirection:isMobile?"column":"row", gap:isMobile?12:20 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:isMobile?16:20, marginBottom:4 }}>1,000+ insurance plans accepted</div>
              <p style={{ color:C.textSm, fontSize:13.5 }}>We work with all major carriers so you can find in-network providers</p>
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
              {[
                {name:"Aetna", color:"#7B2D8E"},
                {name:"BCBS", color:"#0073CF"},
                {name:"Cigna", color:"#E87722"},
                {name:"UHC", color:"#002677"},
                {name:"Humana", color:"#39B54A"},
              ].map(ins=>(
                <div key={ins.name} style={{ display:"flex", alignItems:"center", gap:6, background:C.white, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 14px" }}>
                  <div style={{ width:22, height:22, borderRadius:6, background:ins.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:8, color:"#fff" }}>{ins.name.slice(0,2)}</div>
                  <span style={{ fontSize:12.5, fontWeight:600, color:C.textMd }}>{ins.name}</span>
                </div>
              ))}
              <span style={{ fontSize:12.5, color:C.teal, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }} onClick={()=>setPage("directory")}>+ 995 more</span>
            </div>
          </div>
        </div>
      </div>

      {/* SPECIALTIES & PROCEDURES — side by side */}
      <div style={{ padding:isMobile?"28px 16px":"44px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1px 1fr", gap:isMobile?28:40 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:isMobile?16:20, marginBottom:14 }}>Most popular specialties</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"5px 24px" }}>
              {HOME_SPECIALTIES.map(s=>(
                <span key={s.label} onClick={()=>{setInitialSpecialty(s.label);setPage("directory");}} style={{ fontSize:13.5, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{s.label}</span>
              ))}
            </div>
          </div>
          {!isMobile && <div style={{ background:C.border }} />}
          <div>
            <div style={{ fontWeight:700, fontSize:isMobile?16:20, marginBottom:14 }}>Most popular procedures</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"5px 24px" }}>
              {HOME_PROCEDURES.map(p=>(
                <span key={p} onClick={()=>send(p)} style={{ fontSize:13.5, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOP-RATED SPECIALISTS */}
      <div style={{ background:C.offWhite, padding:isMobile?"28px 16px":"44px 40px", borderTop:`1px solid ${C.borderLt}` }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontWeight:700, fontSize:isMobile?16:20 }}>Top-rated specialists</div>
            <button onClick={()=>setPage("directory")} style={{ background:"none", border:"none", color:C.teal, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>View all →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:14 }}>
            {PROVIDERS.filter(p=>p.rating>=4.7).slice(0,3).map(p=>(
              <div key={p.id} className="card" onClick={()=>openProviderProfile(p)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.04)", display:"flex", gap:14, alignItems:"center" }}>
                <ProviderAvatar provider={p} size={48} radius={12} fontSize={15} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{p.name}</span>
                    {p.contracted && <SealBadge small />}
                  </div>
                  <div style={{ color:C.textSm, fontSize:12.5 }}>{p.specialty} · {p.city}</div>
                  <div style={{ fontSize:12, color:C.amber, fontWeight:600, marginTop:2 }}>★ {p.rating} <span style={{ color:C.textSm, fontWeight:400 }}>({p.reviews} reviews)</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOP-RATED CLINICS */}
      <div style={{ padding:isMobile?"28px 16px":"44px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
            <div style={{ fontWeight:700, fontSize:isMobile?16:20 }}>Top-rated clinics worldwide</div>
            <button onClick={()=>setPage("international")} style={{ background:"none", border:"none", color:C.teal, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Explore →</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:14 }}>
            {INTL_CLINICS.filter(c=>c.rating>=4.8).slice(0,3).map(c=>(
              <div key={c.id} className="card" onClick={()=>openClinicProfile(c)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.04)", display:"flex", gap:14, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:12, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:15, color:C.purple, flexShrink:0 }}>{c.image}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{c.name}</div>
                  <div style={{ color:C.textSm, fontSize:12.5 }}>{c.city}, {c.country} {c.flag}</div>
                  <div style={{ fontSize:12, color:C.amber, fontWeight:600, marginTop:2 }}>★ {c.rating} <span style={{ color:C.textSm, fontWeight:400 }}>({c.reviews} reviews)</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROVIDER CTA */}
      <div style={{ background:`linear-gradient(135deg, #0E1C26, #1a3a4a)`, padding:isMobile?"36px 16px":"56px 40px", textAlign:"center" }}>
        <h3 style={{ color:"#fff", fontSize:isMobile?18:26, fontWeight:800, marginBottom:10 }}>Are you a healthcare provider?</h3>
        <p style={{ color:"#7A8FA0", fontSize:isMobile?13:16, marginBottom:24 }}>Join Hospital.com and connect with patients searching for your specialty.</p>
        <button className="btn-primary" onClick={()=>setPage("become-provider")} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:24, padding:"13px 36px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}
// ─── CHAT SIDEBAR ─────────────────────────────────────────────────────────────
function ChatSidebar({ chatHistory, activeChatId, onSelectChat, onNewChat, onDeleteChat, isOpen, onClose }) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.35)", zIndex:499 }}/>
      )}
      <div className={isOpen?"slide-in-left":""}
        style={{
          width: isMobile ? 300 : 300,
          background: C.white,
          borderRight: isMobile ? "none" : `1px solid ${C.border}`,
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          flexShrink: 0,
          height: isMobile ? "100vh" : "100%",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: isMobile ? 500 : 1,
          boxShadow: isMobile ? "4px 0 24px rgba(0,0,0,.16)" : "none",
          borderRadius: isMobile ? "0 20px 20px 0" : 0,
        }}
      >
        {/* Header */}
        <div style={{ padding: isMobile ? "16px 18px" : "16px 18px", borderBottom:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            {isMobile && <span style={{ fontSize:14, fontWeight:800, letterSpacing:"-.2px" }}><span style={{ color:C.teal }}>Hospital</span><span style={{ color:"#047598" }}>.com</span></span>}
            {isMobile && <span style={{ width:1, height:16, background:C.border, display:"inline-block" }}/>}
            <span style={{ fontWeight:700, fontSize:14.5, color:C.text }}>Chats</span>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={onNewChat} title="New chat" style={{ width:32, height:32, borderRadius:10, border:`1.5px solid ${C.border}`, background:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background=C.tealLt;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.offWhite;}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            {isMobile && (
              <button onClick={onClose} style={{ width:32, height:32, borderRadius:10, border:`1.5px solid ${C.border}`, background:C.offWhite, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            )}
          </div>
        </div>
        {/* Chat list */}
        <div style={{ flex:1, overflowY:"auto", padding:"8px 10px" }}>
          {chatHistory.length === 0 ? (
            <div style={{ textAlign:"center", padding:"40px 16px", color:C.textSm }}>
              <div style={{ width:44, height:44, borderRadius:14, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:C.textMd, marginBottom:4 }}>No conversations yet</div>
              <div style={{ fontSize:12 }}>Start a new chat to get started!</div>
            </div>
          ) : (
            chatHistory.map(chat => (
              <div key={chat.id} className="chat-history-item"
                onClick={() => onSelectChat(chat.id)}
                style={{
                  padding:"11px 14px",
                  borderRadius:12,
                  cursor:"pointer",
                  background: chat.id === activeChatId ? C.tealLt : "transparent",
                  border: chat.id === activeChatId ? `1.5px solid ${C.teal}30` : "1.5px solid transparent",
                  marginBottom:4,
                  display:"flex",
                  alignItems:"flex-start",
                  gap:10,
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={chat.id===activeChatId?C.teal:C.textSm} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:chat.id===activeChatId?700:500, color:chat.id===activeChatId?C.teal:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {chat.title}
                  </div>
                  <div style={{ fontSize:10.5, color:C.textSm, marginTop:2 }}>
                    {chat.messages.length - 1} message{chat.messages.length - 1 !== 1 ? "s" : ""} · {chat.timestamp}
                  </div>
                </div>
                <button onClick={e=>{e.stopPropagation();onDeleteChat(chat.id);}} title="Delete chat"
                  style={{ background:"none", border:"none", cursor:"pointer", padding:2, opacity:.4, transition:"opacity .15s", flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.opacity=1}
                  onMouseLeave={e=>e.currentTarget.style.opacity=.4}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2"><polyline points="3,6 5,6 21,6"/><path d="M19,6l-1,14H6L5,6"/><path d="M9,6V4h6v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
function ChatPage({ setPage, setSelectedProvider, openProviderProfile, setSelectedClinic, initialQuery, setInitialQuery, openFacilitatorModal, bookmarks, toggleBookmark, isLoggedIn }) {
  const WELCOME_MSG = { role:"assistant", text:"Hi! I'm your AI health assistant. Ask me about symptoms, health concerns, or finding a provider.\n\nThis is general health information only. Please consult a licensed healthcare professional for medical advice.", providers:[] };

  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [msgs, setMsgs] = useState([WELCOME_MSG]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef(null);
  const isMobile = useIsMobile();

  const AiAvatar = () => (
    <div style={{ width:38, height:38, borderRadius:14, background:`linear-gradient(135deg, ${C.tealLt}, ${C.tealBg})`, border:`1.5px solid ${C.teal}25`, flexShrink:0, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src={imgAiAvatar} alt="AI" onError={e=>{e.currentTarget.style.display="none";}} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
    </div>
  );

  // Save current chat to history
  const saveCurrent = (currentMsgs, currentId) => {
    if (!currentId || currentMsgs.length <= 1) return;
    const firstUserMsg = currentMsgs.find(m => m.role === "user");
    const title = firstUserMsg ? (firstUserMsg.text.length > 40 ? firstUserMsg.text.slice(0, 40) + "…" : firstUserMsg.text) : "New chat";
    const now = new Date();
    const timestamp = now.toLocaleDateString("en", { month:"short", day:"numeric" });
    setChatHistory(prev => {
      const existing = prev.findIndex(c => c.id === currentId);
      const updated = { id: currentId, title, messages: currentMsgs, timestamp };
      if (existing >= 0) {
        const copy = [...prev];
        copy[existing] = updated;
        return copy;
      }
      return [updated, ...prev];
    });
  };

  const send = (text) => {
    if (!text.trim()) return;
    // If no active chat, create one
    let chatId = activeChatId;
    if (!chatId) {
      chatId = Date.now();
      setActiveChatId(chatId);
    }

    const newMsgs = [...msgs, { role: "user", text }];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);

    const resp = getResponse(text);
    const showIntlCTA = isInternationalQuery(text) || resp.showFacilitatorCTA;

    setTimeout(() => {
      const isIntl = isInternationalQuery(text) || resp.facilitator;
      const providers = resp.providers && !isIntl ? matchProviders(text, resp) : [];
      
      let finalClinics = [];
      if (isIntl) {
        const lower = text.toLowerCase();
        // 1. Try matching by specific procedure keywords
        const byProcedure = INTL_CLINICS.filter(c =>
          c.procedures.some(p => lower.includes(p.toLowerCase()))
        );
        // 2. Try matching by country
        const byCountry = INTL_CLINICS.filter(c =>
          lower.includes(c.country.toLowerCase())
        );
        // 3. Use procedure match first, then country, then fallback to top-rated
        if (byProcedure.length > 0) {
          finalClinics = byProcedure.slice(0, 3);
        } else if (byCountry.length > 0) {
          finalClinics = byCountry.slice(0, 3);
        } else {
          finalClinics = INTL_CLINICS.sort((a,b) => b.rating - a.rating).slice(0, 3);
        }
      }
      
      const finalMsgs = [...newMsgs, { role: "assistant", text: resp.response, providers, clinics: finalClinics, emergency: resp.emergency, showIntlCTA }];
      setMsgs(finalMsgs);
      setLoading(false);
      saveCurrent(finalMsgs, chatId);
    }, 900);
  };

  const handleNewChat = () => {
    saveCurrent(msgs, activeChatId);
    setActiveChatId(null);
    setMsgs([WELCOME_MSG]);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSelectChat = (id) => {
    saveCurrent(msgs, activeChatId);
    const chat = chatHistory.find(c => c.id === id);
    if (chat) {
      setActiveChatId(chat.id);
      setMsgs(chat.messages);
    }
    if (isMobile) setSidebarOpen(false);
  };

  const handleDeleteChat = (id) => {
    setChatHistory(prev => prev.filter(c => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(null);
      setMsgs([WELCOME_MSG]);
    }
  };

  useEffect(() => {
    if (initialQuery) { send(initialQuery); setInitialQuery(""); }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 58px)", background: C.white }}>
      <ChatSidebar
        chatHistory={chatHistory}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", width: "100%", minWidth: 0 }}>
        {/* Full-page chat */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.white, overflow: "hidden", minHeight: 0 }}>

          {/* Chat header */}
          <div style={{ padding: isMobile ? "10px 14px" : "14px 20px", background: C.white, display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${C.borderLt}` }}>
            <button onClick={() => setSidebarOpen(o => !o)} title="Toggle chat history"
              style={{ width: isMobile ? 34 : 38, height: isMobile ? 34 : 38, borderRadius: 10, border: `1.5px solid ${sidebarOpen ? C.teal : C.border}`, background: sidebarOpen ? C.tealLt : C.offWhite, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={sidebarOpen ? C.teal : C.textSm} strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {activeChatId ? (chatHistory.find(c => c.id === activeChatId)?.title || "Chat") : "New Chat"}
              </div>
              <div style={{ fontSize: 11.5, color: C.textSm, marginTop: 1, display: isMobile ? "none" : "block" }}>AI Health Assistant</div>
            </div>
            <button onClick={handleNewChat} title="New chat"
              style={{ width: isMobile ? 34 : 38, height: isMobile ? 34 : 38, borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.offWhite, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.background = C.tealLt; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.offWhite; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>

          {/* Messages area */}
          <div style={{ flex: 1, overflowY: "auto", padding: isMobile ? "16px 14px" : "28px 0", background: C.offWhite }}>
           <div style={{ maxWidth: 820, margin: "0 auto", padding: isMobile ? 0 : "0 24px" }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
                  {msg.role === "assistant" && <AiAvatar />}
                  <div style={{
                    maxWidth: isMobile ? "85%" : "70%",
                    background: msg.role === "user" ? `linear-gradient(135deg, ${C.teal}, ${C.tealDk})` : msg.emergency ? C.redLt : C.white,
                    color: msg.role === "user" ? "#fff" : msg.emergency ? C.red : C.text,
                    borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                    padding: isMobile ? "13px 16px" : "15px 22px",
                    fontSize: isMobile ? 13.5 : 14, lineHeight: 1.75,
                    border: msg.emergency ? `1px solid ${C.redBd}` : msg.role === "assistant" ? `1px solid ${C.border}` : "none",
                    whiteSpace: "pre-wrap",
                    boxShadow: msg.role === "user" ? "0 3px 14px rgba(90,202,214,.22)" : "0 1px 6px rgba(0,0,0,.04)",
                  }}>{msg.text}</div>
                </div>
                {msg.providers?.length > 0 && (
                  <div style={{ marginTop: 12, marginLeft: 48 }}>
                    <p style={{ fontSize: 10, color: C.textSm, marginBottom: 8, fontWeight: 700, letterSpacing: .6 }}>SUGGESTED PROVIDERS</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {msg.providers.map(p => <ProviderCard key={p.id} provider={p} onClick={prov => setSelectedProvider(prov)} onNameClick={prov => openProviderProfile(prov)} compact bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} />)}
                    </div>
                  </div>
                )}
                {msg.clinics?.length > 0 && (
                  <div style={{ marginTop: 12, marginLeft: 48 }}>
                    <p style={{ fontSize: 10, color: C.textSm, marginBottom: 8, fontWeight: 700, letterSpacing: .6 }}>RECOMMENDED CLINICS</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {msg.clinics.map(clinic => (
                        <div key={clinic.id} className="card" style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}
                          onClick={() => openFacilitatorModal(clinic)}>
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.purpleLt, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: C.purple, flexShrink: 0 }}>{clinic.image}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                              <span onClick={e => { e.stopPropagation(); setSelectedClinic(clinic); }}
                                style={{ fontWeight: 700, fontSize: 13.5, color: C.teal, cursor: "pointer", transition: "color .15s" }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>{clinic.name}</span>
                              <span style={{ fontSize: 11, color: C.textSm }}>{clinic.flag}</span>
                            </div>
                            <div style={{ color: C.textSm, fontSize: 12, marginBottom: 4 }}>{clinic.city}, {clinic.country}</div>
                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                              <span style={{ color: C.amber, fontSize: 12, fontWeight: 600 }}>★ {clinic.rating}</span>
                              <span style={{ fontSize: 11.5, color: C.textSm }}>({clinic.reviews} reviews)</span>
                            </div>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {clinic.procedures.slice(0, 3).map(p => (
                                <span key={p} style={{ background: C.tealLt, color: C.teal, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 8 }}>{p}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {msg.role === "assistant" && msg.showIntlCTA && (
                  <div className="fade-up" style={{ marginTop: 12, marginLeft: 48, background: `linear-gradient(120deg, ${C.purpleLt}, ${C.tealLt})`, border: `1px solid ${C.teal}30`, borderRadius: 16, padding: "16px 18px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 180 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 3, color: C.text }}>Looking for care outside your country?</div>
                      <div style={{ fontSize: 12.5, color: C.textMd }}>We can connect you with a medical coordinator who specializes in international care.</div>
                    </div>
                    <button className="btn-primary" onClick={openFacilitatorModal} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 22, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>Talk to a Facilitator</button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <AiAvatar />
                <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "20px 20px 20px 4px", padding: "15px 22px", display: "flex", gap: 6, boxShadow: "0 1px 6px rgba(0,0,0,.04)" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.teal, animation: "bounce 1s infinite", animationDelay: `${i * .18}s` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
           </div>
          </div>

          {/* Input area */}
          <div style={{ padding: isMobile ? "12px 14px" : "18px 24px", background: C.white, borderTop: `1px solid ${C.borderLt}` }}>
           <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10, background: C.offWhite, borderRadius: 22, padding: "6px 6px 6px 20px", alignItems: "center", border: `1.5px solid ${C.border}`, transition: "border-color .2s, box-shadow .2s" }}
              onFocus={e => { e.currentTarget.style.borderColor = C.teal; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.teal}15`; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Describe symptoms or ask a question…" style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 14.5, fontFamily: "inherit", minWidth: 0, color: C.text, padding: "6px 0" }} />
              <button onClick={() => send(input)} style={{ background: C.teal, border: "none", borderRadius: 18, padding: "11px 24px", color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", transition: "background .15s, transform .1s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.tealDk; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.teal; e.currentTarget.style.transform = "none"; }}>Send</button>
            </div>
            <p style={{ fontSize: 10.5, color: C.textSm, textAlign: "center", marginTop: 10 }}>For informational purposes only. Not a substitute for professional medical advice.</p>
           </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FIND DOCTORS LINKS (bottom of search results) ──────────────────────────
function FindDoctorsLinks() {
  const [linkTab, setLinkTab] = useState("specialties");
  const tabs = [
    { key:"specialties", label:"Specialties" },
    { key:"locations", label:"Locations" },
    { key:"insurances", label:"Insurances" },
    { key:"more", label:"More" },
  ];
  const data = {
    specialties: ["Cardiologists","Dentists","Dermatologists","Eye Doctors","Gastroenterologists","OB-GYNs","Ophthalmologists","Orthopedic Surgeons","Pediatricians","Plastic Surgeons","Psychiatrists","Psychologists","Urgent Care","Family Medicine","Chiropractors","More Specialties"],
    locations: ["New York","Los Angeles","Chicago","Houston","Miami","Phoenix","Dallas","San Diego","San Francisco","Philadelphia","Austin","Seattle","Denver","Boston","Atlanta","More Locations"],
    insurances: ["Aetna","Blue Cross Blue Shield","Cigna","UnitedHealthcare","Humana","Kaiser Permanente","Medicare","Medicaid","Anthem","Molina","Oscar Health","Health Net","Tricare","Highmark","More Insurances"],
    more: ["Procedures","Walk-in Clinics","Telehealth","Emergency Care","Pharmacies","Lab Testing","Mental Health","Physical Therapy","Dental Clinics","Medical Spas","Specialty Hospitals","Rehabilitation Centers"],
  };
  return (
    <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginTop:28 }}>
      <div style={{ fontWeight:800, fontSize:15, marginBottom:14 }}>Find Doctors</div>
      <div style={{ display:"flex", gap:4, borderBottom:`1px solid ${C.border}`, marginBottom:16 }}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setLinkTab(t.key)} style={{ padding:"8px 14px", background:"none", border:"none", borderBottom:`2px solid ${linkTab===t.key?C.teal:"transparent"}`, color:linkTab===t.key?C.teal:C.textSm, fontWeight:linkTab===t.key?700:500, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>{t.label}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"8px 16px" }}>
        {data[linkTab].map(item=>(
          <span key={item} style={{ fontSize:12.5, color:C.teal, cursor:"pointer", padding:"4px 0", fontWeight:500 }}
            onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
            onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{item}</span>
        ))}
      </div>
    </div>
  );
}

// ─── INSURANCE PICKER DATA ───────────────────────────────────────────────────
const INSURANCE_CARRIERS = [
  { name:"Aetna", color:"#7B2D8E", plans:["Aetna Choice POS II","Aetna HMO","Aetna PPO","Aetna Medicare Advantage","Aetna Open Access"] },
  { name:"BlueCross BlueShield", color:"#0073CF", plans:["BCBS PPO","BCBS HMO","BCBS Blue Card","BCBS Federal","BCBS Medicare Supplement"] },
  { name:"Cigna", color:"#E87722", plans:["Cigna PPO","Cigna HMO","Cigna Open Access Plus","Cigna EPO","Cigna Medicare Advantage"] },
  { name:"UnitedHealthcare", color:"#002677", plans:["UHC Choice Plus","UHC Navigate","UHC Options PPO","UHC Medicare Advantage","UHC Dual Complete"] },
  { name:"Medicare", color:"#00548E", plans:["Medicare Part A","Medicare Part B","Medicare Advantage","Medigap"] },
  { name:"Humana", color:"#39B54A", plans:["Humana PPO","Humana HMO","Humana Gold Plus","Humana Medicare Advantage"] },
  { name:"Kaiser Permanente", color:"#006BA6", plans:["Kaiser HMO","Kaiser Medicare"] },
  { name:"Medicaid", color:"#5C7A29", plans:["Medicaid Managed Care","Medicaid Fee-for-Service"] },
  { name:"Anthem", color:"#0033A0", plans:["Anthem PPO","Anthem HMO","Anthem Blue Access"] },
  { name:"Oscar Health", color:"#FF6600", plans:["Oscar PPO","Oscar EPO"] },
  { name:"Tricare", color:"#003F72", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
  { name:"Molina", color:"#8DC63F", plans:["Molina Marketplace","Molina Medicaid"] },
];

function InsurancePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [expandedCarrier, setExpandedCarrier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label = value === "All" ? "All Insurances" : value;

  const filteredCarriers = searchTerm
    ? INSURANCE_CARRIERS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.plans.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())))
    : INSURANCE_CARRIERS;

  return (
    <div ref={ref} style={{ position:"relative", minWidth:180 }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8,
          padding:"8px 12px 8px 14px", border:`1.5px solid ${open?C.teal:C.border}`,
          borderRadius:22, background:open?C.tealLt:C.white, cursor:"pointer",
          fontSize:13, fontWeight:500, color:value!=="All"?C.teal:open?C.teal:C.textMd,
          fontFamily:"inherit", transition:"all .15s", whiteSpace:"nowrap",
          boxShadow:open?`0 0 0 3px ${C.teal}18`:"none" }}>
        <span style={{ display:"flex", alignItems:"center", gap:6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
          {label}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ flexShrink:0, transition:"transform .18s", transform:open?"rotate(180deg)":"rotate(0deg)" }}>
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {open && (
        <div className="fade-up" style={{ position:"absolute", top:"calc(100% + 6px)", left:0, width:320, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, boxShadow:"0 8px 32px rgba(0,0,0,.14)", zIndex:999, overflow:"hidden", maxHeight:420, display:"flex", flexDirection:"column" }}>
          {/* Search */}
          <div style={{ padding:"10px 12px", borderBottom:`1px solid ${C.borderLt}` }}>
            <input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search carrier or plan…" autoFocus
              style={{ width:"100%", padding:"8px 12px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13, outline:"none", fontFamily:"inherit" }}
              onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
          </div>
          {/* List */}
          <div style={{ overflowY:"auto", flex:1, padding:"6px" }}>
            {/* All option */}
            <button onClick={()=>{onChange("All");setOpen(false);setSearchTerm("");}}
              style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 12px", background:value==="All"?C.tealLt:"transparent", color:value==="All"?C.teal:C.textMd, fontWeight:value==="All"?700:500, fontSize:13, border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", marginBottom:2 }}>
              {value==="All" && <span style={{ marginRight:6, fontSize:11 }}>✓</span>}
              All Insurances
            </button>

            {filteredCarriers.map(carrier => (
              <div key={carrier.name}>
                {/* Carrier header */}
                <button onClick={()=>setExpandedCarrier(expandedCarrier===carrier.name?null:carrier.name)}
                  style={{ display:"flex", width:"100%", alignItems:"center", gap:8, padding:"9px 12px", background:expandedCarrier===carrier.name?C.offWhite:"transparent", border:"none", borderRadius:10, cursor:"pointer", fontFamily:"inherit", transition:"background .12s" }}
                  onMouseEnter={e=>{if(expandedCarrier!==carrier.name) e.currentTarget.style.background=C.gray;}}
                  onMouseLeave={e=>{if(expandedCarrier!==carrier.name) e.currentTarget.style.background="transparent";}}>
                  <div style={{ width:22, height:22, borderRadius:6, background:carrier.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:8, color:"#fff", flexShrink:0 }}>{carrier.name.slice(0,2).toUpperCase()}</div>
                  <span style={{ flex:1, fontWeight:600, fontSize:13, color:C.text, textAlign:"left" }}>{carrier.name}</span>
                  <span style={{ fontSize:11, color:C.textSm }}>{carrier.plans.length} plans</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ transition:"transform .15s", transform:expandedCarrier===carrier.name?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                </button>
                {/* Expanded plans */}
                {expandedCarrier===carrier.name && (
                  <div className="fade-up" style={{ paddingLeft:42, paddingBottom:4 }}>
                    {/* Select whole carrier */}
                    <button onClick={()=>{onChange(carrier.name);setOpen(false);setSearchTerm("");}}
                      style={{ display:"block", width:"100%", textAlign:"left", padding:"7px 10px", background:value===carrier.name?C.tealLt:"transparent", color:value===carrier.name?C.teal:C.textMd, fontWeight:value===carrier.name?700:500, fontSize:12.5, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit", marginBottom:1 }}>
                      {value===carrier.name && <span style={{ marginRight:4, fontSize:10 }}>✓</span>}
                      All {carrier.name} plans
                    </button>
                    {carrier.plans.map(plan=>(
                      <button key={plan} onClick={()=>{onChange(plan);setOpen(false);setSearchTerm("");}}
                        style={{ display:"block", width:"100%", textAlign:"left", padding:"6px 10px", background:value===plan?C.tealLt:"transparent", color:value===plan?C.teal:C.textSm, fontWeight:value===plan?700:400, fontSize:12, border:"none", borderRadius:8, cursor:"pointer", fontFamily:"inherit" }}
                        onMouseEnter={e=>{if(value!==plan) e.currentTarget.style.background=C.gray;}}
                        onMouseLeave={e=>{if(value!==plan) e.currentTarget.style.background="transparent";}}>
                        {value===plan && <span style={{ marginRight:4, fontSize:10 }}>✓</span>}
                        {plan}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DIRECTORY ────────────────────────────────────────────────────────────────
function DirectoryPage({ setPage, setSelectedProvider, bookmarks, toggleBookmark, isLoggedIn, setInitialQuery, bookingsList, initialSpecialty, setInitialSpecialty }) {
  const [specialty, setSpecialty] = useState(initialSpecialty || "All");
  const [city, setCity] = useState("All");
  const [minRating, setMinRating] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewTab, setViewTab] = useState("all");
  const [insurance, setInsurance] = useState("All");
  const isMobile = useIsMobile();

  // Clear initialSpecialty after mount
  useEffect(() => {
    if (initialSpecialty) setInitialSpecialty("");
  }, [initialSpecialty, setInitialSpecialty]);

  let filtered = PROVIDERS.filter(p =>
    (specialty === "All" || p.specialty === specialty || p.tags.includes(specialty)) &&
    (city === "All" || p.city === city) &&
    p.rating >= minRating &&
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  if (viewTab === "bookmarked") {
    filtered = filtered.filter(p => bookmarks.includes(p.id));
  }

  if (sortBy === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  if (sortBy === "distance") filtered = [...filtered].sort((a, b) => a.distance - b.distance);
  if (sortBy === "reviews") filtered = [...filtered].sort((a, b) => b.reviews - a.reviews);
  filtered = [...filtered.filter(p => p.contracted), ...filtered.filter(p => !p.contracted)];

  return (
    <div>
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"28px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:800, marginBottom:2 }}>Find Local Care</h1>
          <p style={{ color:C.textSm, fontSize:13 }}>Find local medical service providers by specialty, procedure, insurance, and location</p>
        </div>
      </div>

      {/* Tab: All / Bookmarked / My Bookings */}
      <div style={{ display:"flex", gap:3, background:C.gray, borderRadius:11, padding:3, marginBottom:16, width:"fit-content" }}>
        {[{ key:"all", label:"All Providers" }, { key:"bookmarked", label:`Bookmarked (${bookmarks.length})` }, { key:"bookings", label:`My Bookings (${bookingsList.length})` }].map(t => (
          <button key={t.key} onClick={() => {
            if (t.key === "bookmarked" && !isLoggedIn) { setPage("signup"); return; }
            setViewTab(t.key);
          }} style={{ padding:"7px 18px", border:"none", borderRadius:9, background:viewTab===t.key?C.white:"transparent", fontWeight:viewTab===t.key?700:400, fontSize:13, cursor:"pointer", color:viewTab===t.key?C.text:C.textSm, boxShadow:viewTab===t.key?"0 1px 4px rgba(0,0,0,.08)":"none", whiteSpace:"nowrap", fontFamily:"inherit", transition:"all .15s", display:"flex", alignItems:"center", gap:6 }}>
            {t.key === "bookmarked" && <BookmarkIcon filled={viewTab === "bookmarked"} size={13} />}
            {t.key === "bookings" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={viewTab==="bookings"?C.teal:C.textSm} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
            {t.label}
          </button>
        ))}
      </div>

      {/* MY BOOKINGS VIEW */}
      {viewTab === "bookings" ? (
        <div>
          {bookingsList.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 20px", color:C.textSm }}>
              <div style={{ width:56, height:56, borderRadius:16, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:6 }}>No bookings yet</div>
              <p style={{ fontSize:13.5, maxWidth:360, margin:"0 auto" }}>When you book an appointment or request a visit, it will appear here.</p>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[...bookingsList].reverse().map(b => {
                const statusColors = { Confirmed:{bg:C.greenLt,color:C.green,icon:"✓"}, Pending:{bg:C.amberLt,color:C.amber,icon:"⏳"}, Cancelled:{bg:C.redLt,color:C.red,icon:"✗"} };
                const sc = statusColors[b.status] || statusColors.Pending;
                return (
                  <div key={b.id} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                    <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                      {b.providerObj && <ProviderAvatar provider={b.providerObj} size={48} radius={12} fontSize={15} />}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                          <span onClick={()=>{ if(b.providerObj) setSelectedProvider(b.providerObj); }}
                            style={{ fontWeight:700, fontSize:15, color:C.teal, cursor:"pointer" }}
                            onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                            onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{b.providerName}</span>
                          <span style={{ background:sc.bg, color:sc.color, fontSize:10.5, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>{sc.icon} {b.status}</span>
                          <span style={{ background:b.type==="request"?C.purpleLt:C.tealLt, color:b.type==="request"?C.purple:C.teal, fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{b.type==="request"?"Request":"Booking"}</span>
                        </div>
                        <div style={{ display:"flex", gap:14, fontSize:12.5, color:C.textSm, marginBottom:6, flexWrap:"wrap" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            {b.date}
                          </span>
                          {b.time && <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {b.time}
                          </span>}
                          {b.email && <span>{b.email}</span>}
                        </div>
                        {b.reason && <p style={{ fontSize:12.5, color:C.textMd, lineHeight:1.5, background:C.offWhite, borderRadius:8, padding:"8px 12px", marginTop:4 }}>"{b.reason}"</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
      <>

      <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or specialty…" style={{ flex:1, minWidth:180, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }} onFocus={e => e.target.style.borderColor = C.teal} onBlur={e => e.target.style.borderColor = C.border} />
        <Select value={specialty} onChange={setSpecialty} minWidth={160}
          options={[{value:"All",label:"All Specialties"}, "Cardiology", "Dentistry", "Dermatology", "Ophthalmology", "Orthopedics", "Psychiatry", "Pediatrics", "Family Medicine", "Urgent Care", "Gastroenterology", "OB-GYN", "Medical Aesthetics"]} />
        <Select value={city} onChange={setCity} minWidth={120}
          options={[{value:"All",label:"All Cities"}, "New York", "Los Angeles", "Chicago", "Houston", "Miami"]} />
        <InsurancePicker value={insurance} onChange={setInsurance} />
        <Select value={sortBy} onChange={setSortBy} minWidth={140}
          options={[{ value:"rating", label:"Sort: Rating" }, { value:"distance", label:"Sort: Distance" }, { value:"reviews", label:"Sort: Reviews" }]} />
      </div>
      <div style={{ display:"flex", gap:7, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <span style={{ fontSize:11, fontWeight:700, color:C.textSm }}>MIN RATING</span>
        {[{ l:"Any", v:0 }, { l:"4+", v:4 }, { l:"4.5+", v:4.5 }, { l:"4.8+", v:4.8 }].map(r => <Chip key={r.l} label={r.l} active={minRating === r.v} onClick={() => setMinRating(r.v)} />)}
        {insurance !== "All" && (
          <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"4px 12px 4px 10px", fontSize:12, fontWeight:600, color:C.teal, marginLeft:8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
            {insurance}
            <button onClick={()=>setInsurance("All")} style={{ background:"none", border:"none", cursor:"pointer", color:C.teal, fontSize:14, lineHeight:1, padding:0, marginLeft:2, fontWeight:700 }}>×</button>
          </span>
        )}
      </div>
      <p style={{ fontSize:12.5, color:C.textSm, marginBottom:14 }}>
        {filtered.length} provider{filtered.length !== 1 ? "s" : ""} found
        {viewTab === "bookmarked" && filtered.length === 0 && " — bookmark providers to see them here"}
      </p>

      {/* LIST + MAP layout */}
      <div style={{ display:"flex", gap:20, alignItems:"flex-start" }}>
        {/* Provider list — left side */}
        <div style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column", gap:14 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" onClick={() => setSelectedProvider(p)} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 20px", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)", display:"flex", gap:14, alignItems:"flex-start", position:"relative" }}>
              <div style={{ position:"absolute", top:14, right:14 }}>
                <BookmarkButton providerId={p.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} size={18} />
              </div>
              <ProviderAvatar provider={p} size={52} radius={12} fontSize={16} />
              <div style={{ flex:1, minWidth:0, paddingRight:24 }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:14.5 }}>{p.name}</span>
                  {p.contracted && <SealBadge small />}
                </div>
                <div style={{ color:C.textSm, fontSize:12.5, marginBottom:6 }}>{p.specialty}</div>
                <div style={{ display:"flex", gap:8, alignItems:"center", fontSize:12, color:C.textSm, marginBottom:8 }}>
                  <span style={{ color:C.amber, fontWeight:600 }}>★ {p.rating}</span>
                  <span>· {p.reviews} reviews</span>
                  <span>· {p.distance}km</span>
                  <span>· {p.city}</span>
                </div>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:8 }}>
                  {p.tags.map(t => <span key={t} style={{ background:C.tealLt, color:C.teal, fontSize:10.5, fontWeight:600, padding:"2px 9px", borderRadius:10 }}>{t}</span>)}
                </div>
                <div style={{ fontSize:12, color:C.textSm, marginBottom:10 }}>{p.address} · {p.hours}</div>
                {p.contracted ? (
                  <button className="btn-primary" style={{ padding:"8px 22px", border:"none", borderRadius:20, background:C.teal, color:"#fff", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit" }}>Book Appointment</button>
                ) : (
                  <button className="btn-ghost" style={{ padding:"8px 22px", border:`1.5px solid ${C.border}`, borderRadius:20, background:C.white, color:C.textMd, fontWeight:600, fontSize:12.5, cursor:"pointer", fontFamily:"inherit" }}>Learn More</button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>
            {viewTab === "bookmarked" ? "No bookmarked providers yet. Browse the directory and bookmark providers you're interested in." : "No providers found. Adjust your filters."}
          </div>}
        </div>

        {/* MAP PLACEHOLDER — right side */}
        {!isMobile && (
          <div style={{ width:420, flexShrink:0, position:"sticky", top:78, alignSelf:"flex-start" }}>
            <div style={{ background:C.gray, border:`2px dashed ${C.grayMd}`, borderRadius:16, height:560, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.grayMd} strokeWidth="1.5">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <div style={{ fontWeight:700, fontSize:15, color:C.grayMd }}>Map View</div>
              <div style={{ fontSize:12, color:C.grayMd, textAlign:"center", maxWidth:180, lineHeight:1.5 }}>Interactive map with provider locations will be displayed here</div>
              <div style={{ width:"80%", height:200, position:"relative", marginTop:8 }}>
                {filtered.slice(0,5).map((p,i)=>(
                  <div key={p.id} style={{ position:"absolute", left:`${20+i*14}%`, top:`${15+((i*37)%60)}%`, width:12, height:12, borderRadius:"50%", background:C.teal, border:"2px solid #fff", boxShadow:"0 1px 4px rgba(0,0,0,.2)", cursor:"pointer" }} title={p.name}/>
                ))}
                <div style={{ position:"absolute", inset:0, borderRadius:10, background:`repeating-linear-gradient(0deg, transparent, transparent 39px, ${C.borderLt} 39px, ${C.borderLt} 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, ${C.borderLt} 39px, ${C.borderLt} 40px)`, opacity:.5 }}/>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA for specialists */}
      <FindDoctorsLinks />
      <div style={{ background:`linear-gradient(135deg, #0E1C26 0%, #1a3a4a 100%)`, borderRadius:16, padding:"32px 24px", textAlign:"center", marginTop:28 }}>
        <h3 style={{ color:"#fff", fontSize:18, fontWeight:800, marginBottom:8 }}>Are You a Healthcare Provider?</h3>
        <p style={{ color:"#94A3B8", fontSize:13, marginBottom:18 }}>Join Hospital.com to reach patients searching for your specialty.</p>
        <button className="btn-primary" onClick={()=>setPage("become-provider")} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"11px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Become a Provider</button>
      </div>
      </>
      )}
      </div>
      <Footer setPage={setPage} />
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
          <Select value={procedure} onChange={setProcedure} minWidth={160} options={allProcedures.map(p=>({value:p, label:p==="All"?"All Procedures":p}))}/>
          <Select value={city} onChange={setCity} minWidth={130} options={allCities.map(c=>({value:c, label:c==="All"?"All Cities":c}))}/>
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
const CLINIC_GRADIENTS = [
  "linear-gradient(135deg,#0a4a5a,#1a7a8a)",
  "linear-gradient(135deg,#4a1a0a,#8a4a1a)",
  "linear-gradient(135deg,#1a1a4a,#2a2a8a)",
  "linear-gradient(135deg,#2a0a0a,#5a1a1a)",
  "linear-gradient(135deg,#1a4a1a,#2a8a3a)",
  "linear-gradient(135deg,#3a1a4a,#6a2a8a)",
  "linear-gradient(135deg,#0a3a4a,#1a6a7a)",
  "linear-gradient(135deg,#4a3a0a,#8a6a1a)",
];

function InternationalPage({ setSelectedClinic, openFacilitatorModal }) {
  const [country, setCountry] = useState("All");
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({ phone:"", contactMethod:"", name:"", description:"" });
  const [formSent, setFormSent] = useState(false);

  const allCountries = ["All", ...Array.from(new Set(INTL_CLINICS.map(c=>c.country)))];
  const [procedure, setProcedure] = useState("All");
  const allProcedures = ["All", ...Array.from(new Set(INTL_CLINICS.flatMap(c=>c.procedures)))];

  const filtered = INTL_CLINICS.filter(c=>
    (country==="All"||c.country===country) &&
    (procedure==="All"||c.procedures.includes(procedure)) &&
    (!search||c.name.toLowerCase().includes(search.toLowerCase())||c.country.toLowerCase().includes(search.toLowerCase())||c.procedures.some(p=>p.toLowerCase().includes(search.toLowerCase())))
  );

  const SectionTitle = ({ children, sub }) => (
    <div style={{ textAlign:"center", marginBottom:28 }}>
      <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, letterSpacing:"-.3px", marginBottom:6 }}>{children}</h2>
      {sub && <p style={{ color:C.textSm, fontSize:isMobile?13:15 }}>{sub}</p>}
    </div>
  );

  const GLOBAL_SPECIALTIES = ["Plastic Surgery","Dental","Cardiac Surgery","Orthopedics","Ophthalmology","Oncology","Fertility / IVF","Hair Transplant","Neurology","Bariatric Surgery","Dermatology","Urology"];
  const GLOBAL_PROCEDURES = ["Hair Transplant","Rhinoplasty","Dental Implants","Liposuction","LASIK","IVF","Knee Replacement","Cardiac Surgery","Veneers","Bariatric Surgery","Facelift","Stem Cell Therapy"];

  const HOW_STEPS = [
    { num:"1", title:"Submit a Request", desc:"Tell us about the procedure you need and your preferences." },
    { num:"2", title:"We Review Your Case", desc:"Our medical coordinators study your request and identify the best options." },
    { num:"3", title:"Get Matched", desc:"We recommend the best hospital and specialist for your case." },
    { num:"4", title:"Plan Your Trip", desc:"We help arrange your treatment program, travel, and accommodation." },
    { num:"5", title:"24/7 Support", desc:"Our coordinator stays in touch throughout your entire treatment." },
    { num:"6", title:"Aftercare", desc:"We follow your recovery and stay connected even after you return home." },
  ];

  const CERTIFICATIONS = ["ISO","JCI","ESMO","OECI","EFQM","DKG","ADA","ISAPS"];

  return (
    <div style={{ minHeight:"calc(100vh - 58px)", background:C.white }}>
      {/* HERO — clean, just text */}
      <div style={{ background:"linear-gradient(135deg,#0E1C26 0%,#1a3a4a 100%)", padding:isMobile?"48px 20px":"80px 40px", textAlign:"center", color:"#fff" }}>
        <h1 style={{ fontSize:isMobile?26:42, fontWeight:800, marginBottom:14, letterSpacing:"-.5px" }}>World-Class Treatment <span style={{ color:C.teal }}>Abroad</span></h1>
        <p style={{ color:"#94A3B8", fontSize:isMobile?14:17, maxWidth:560, margin:"0 auto", lineHeight:1.6 }}>Connect with certified clinics worldwide. Save 40–80% on procedures with our vetted global network.</p>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.offWhite }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <SectionTitle sub="Our team guides you through every step of your medical journey">How Does It Work?</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(3, 1fr)", gap:16 }}>
            {HOW_STEPS.map(s=>(
              <div key={s.num} style={{ background:C.white, borderRadius:16, padding:"24px 20px", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:16, color:C.teal, flexShrink:0 }}>{s.num}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:5 }}>{s.title}</div>
                  <div style={{ color:C.textSm, fontSize:13, lineHeight:1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FREE SERVICE CTA */}
      <div style={{ padding:isMobile?"32px 16px":"48px 16px", background:C.tealBg }}>
        <div style={{ maxWidth:800, margin:"0 auto", display:"flex", alignItems:isMobile?"stretch":"center", gap:24, flexDirection:isMobile?"column":"row" }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:isMobile?20:26, fontWeight:800, marginBottom:10 }}>Hospital.com service is <span style={{ color:C.teal }}>absolutely free.</span></h2>
            <p style={{ color:C.textSm, fontSize:14, lineHeight:1.65, marginBottom:18 }}>Our services are free. You pay the same rates for treatment as in the clinic's original price list. We earn from the clinic — not from you.</p>
            <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"12px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Find a Solution</button>
          </div>
          <div style={{ width:isMobile?"100%":200, height:isMobile?140:180, borderRadius:18, background:"linear-gradient(135deg,#0E1C26,#1a3a4a)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
      </div>

      {/* CONSULTATION FORM */}
      <div style={{ padding:isMobile?"36px 16px":"60px 16px", background:C.white }}>
        <div style={{ maxWidth:500, margin:"0 auto", background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 24px" }}>
          <h3 style={{ fontWeight:800, fontSize:18, textAlign:"center", marginBottom:6 }}>Get a Free Consultation</h3>
          <p style={{ color:C.textSm, fontSize:13, textAlign:"center", marginBottom:20 }}>Fill out the form and our coordinator will contact you within 24 hours.</p>
          {formSent ? (
            <div style={{ textAlign:"center", padding:"20px 0" }}>
              <div style={{ width:48, height:48, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
              </div>
              <div style={{ fontWeight:700, fontSize:16 }}>Request Sent!</div>
              <p style={{ color:C.textSm, fontSize:13, marginTop:6 }}>We'll be in touch within 24 hours.</p>
            </div>
          ) : (
            <>
              <FieldInput label="Phone Number" type="tel" value={formData.phone} onChange={e=>setFormData(p=>({...p,phone:e.target.value}))} placeholder="+1 000-000-0000" />
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Best way to contact you</label>
                <Select value={formData.contactMethod||"select"} onChange={v=>setFormData(p=>({...p,contactMethod:v==="select"?"":v}))} minWidth={0}
                  options={[{value:"select",label:"Select…"},{value:"phone",label:"Phone"},{value:"email",label:"Email"},{value:"whatsapp",label:"WhatsApp"}]} />
              </div>
              <FieldInput label="Your Name" type="text" value={formData.name} onChange={e=>setFormData(p=>({...p,name:e.target.value}))} placeholder="Enter your name" />
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:5 }}>Short Description</label>
                <textarea value={formData.description} onChange={e=>setFormData(p=>({...p,description:e.target.value}))} placeholder="Describe your medical needs…" rows={3}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", color:C.text }} />
              </div>
              <button className="btn-primary" onClick={()=>setFormSent(true)} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"13px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Book Appointment</button>
            </>
          )}
        </div>
      </div>

      {/* TOP-RATED HOSPITALS — with filters above */}
      <div style={{ padding:isMobile?"32px 16px":"52px 16px", background:C.offWhite }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <SectionTitle sub="We only feature certified and accredited medical institutions">Top-Rated Hospitals & Clinics</SectionTitle>
          {/* Certifications */}
          <div style={{ display:"flex", gap:isMobile?8:14, justifyContent:"center", flexWrap:"wrap", marginBottom:20 }}>
            {CERTIFICATIONS.map(cert=>(
              <div key={cert} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:60 }}>
                <div style={{ width:36, height:36, borderRadius:"50%", background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 6px", fontWeight:800, fontSize:10, color:C.teal }}>{cert.slice(0,2)}</div>
                <div style={{ fontSize:11, fontWeight:700, color:C.textMd }}>{cert}</div>
              </div>
            ))}
          </div>
          {/* Search + Filters — single row */}
          <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:200 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clinics, countries, procedures…"
                style={{ width:"100%", padding:"9px 16px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit", background:C.white, transition:"border-color .2s" }}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
            </div>
            <div style={{ minWidth:160 }}><Select value={country} onChange={setCountry} minWidth={0} options={allCountries.map(c=>({value:c, label:c==="All"?"All Countries":c}))}/></div>
            <div style={{ minWidth:160 }}><Select value={procedure} onChange={setProcedure} minWidth={0} options={allProcedures.map(p=>({value:p, label:p==="All"?"All Procedures":p}))}/></div>
          </div>
          {/* Clinic cards */}
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(4, 1fr)", gap:isMobile?10:16 }}>
            {filtered.slice(0,8).map((clinic,idx)=>(
              <div key={clinic.id} className="card" onClick={()=>setSelectedClinic(clinic)}
                style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, overflow:"hidden", cursor:"pointer", boxShadow:"0 1px 4px rgba(0,0,0,.05)" }}>
                {isMobile ? (
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 14px 0" }}>
                    <div style={{ width:48, height:48, borderRadius:12, background:CLINIC_GRADIENTS[idx%CLINIC_GRADIENTS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"rgba(255,255,255,.4)", flexShrink:0 }}>{clinic.image}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:13.5 }}>{clinic.name}</div>
                      <div style={{ fontSize:11.5, color:C.textSm }}>{clinic.city}, {clinic.country} · {clinic.flag}</div>
                    </div>
                    <span style={{ background:C.tealLt, color:C.teal, fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, flexShrink:0 }}>★ {clinic.rating}</span>
                  </div>
                ) : (
                  <div style={{ height:100, background:CLINIC_GRADIENTS[idx%CLINIC_GRADIENTS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:800, color:"rgba(255,255,255,.25)" }}>{clinic.image}</div>
                )}
                <div style={{ padding:isMobile?"10px 14px 14px":"14px" }}>
                  {!isMobile&&(
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, lineHeight:1.3, flex:1, marginRight:6 }}>{clinic.name}</div>
                      <span style={{ background:C.tealLt, color:C.teal, fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:20, flexShrink:0 }}>★ {clinic.rating}</span>
                    </div>
                  )}
                  {!isMobile&&<div style={{ fontSize:11.5, color:C.textSm, marginBottom:10 }}>{clinic.city}, {clinic.country} {clinic.flag}</div>}
                  <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:isMobile?10:12 }}>
                    {clinic.procedures.slice(0,2).map(p=>(
                      <span key={p} style={{ background:C.tealLt, color:C.teal, fontSize:isMobile?10:9, padding:"2px 8px", borderRadius:18, fontWeight:600 }}>{p}</span>
                    ))}
                    {clinic.procedures.length>2&&<span style={{ background:C.gray, color:C.textSm, fontSize:isMobile?10:9, padding:"2px 8px", borderRadius:18, fontWeight:600 }}>+{clinic.procedures.length-2}</span>}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-primary" onClick={e=>{e.stopPropagation();setSelectedClinic(clinic);}} style={{ flex:1, padding:"8px", background:C.teal, color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>View Clinic</button>
                    <button onClick={e=>{e.stopPropagation();openFacilitatorModal(clinic);}} style={{ padding:"8px 10px", background:C.white, color:C.textSm, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>Get Help</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length===0&&<div style={{ gridColumn:"1/-1", textAlign:"center", padding:48, color:C.textSm, background:C.gray, borderRadius:14 }}>No clinics found. Try adjusting your search or filters.</div>}
          </div>
        </div>
      </div>

      {/* POPULAR SPECIALTIES & PROCEDURES — two-column split */}
      <div style={{ padding:isMobile?"28px 16px":"52px 16px", background:C.offWhite }}>
        <div style={{ maxWidth:960, margin:"0 auto", display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1px 1fr", gap:isMobile?24:40 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:isMobile?16:18, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/></svg>
              </div>
              Popular Specialties
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"4px 20px" }}>
              {GLOBAL_SPECIALTIES.map(s=>(
                <span key={s} style={{ fontSize:13, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{s}</span>
              ))}
            </div>
          </div>
          {!isMobile && <div style={{ background:C.border, width:1 }} />}
          <div>
            <div style={{ fontWeight:700, fontSize:isMobile?16:18, marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:C.purpleLt, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              </div>
              Popular Procedures
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 1fr)", gap:"4px 20px" }}>
              {GLOBAL_PROCEDURES.map(p=>(
                <span key={p} style={{ fontSize:13, color:C.teal, cursor:"pointer", padding:"5px 0", fontWeight:500 }}
                  onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"}
                  onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ background:`linear-gradient(135deg, ${C.purple}15, ${C.tealLt})`, padding:isMobile?"40px 16px":"60px 16px", textAlign:"center" }}>
        <h2 style={{ fontSize:isMobile?20:28, fontWeight:800, marginBottom:12 }}>Ready to Explore Your Options?</h2>
        <p style={{ color:C.textSm, fontSize:isMobile?13:15, maxWidth:500, margin:"0 auto 24px" }}>Talk to our medical coordinators for personalized guidance on clinics, procedures, and travel planning.</p>
        <button className="btn-primary" onClick={openFacilitatorModal} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:28, padding:"14px 36px", fontWeight:700, fontSize:16, cursor:"pointer", fontFamily:"inherit" }}>Talk to a Facilitator</button>
      </div>
      <Footer setPage={()=>{}} />
    </div>
  );
}

// ─── INTERNATIONAL CLINIC PROFILE ────────────────────────────────────────────
function InternationalClinicProfile({ clinic, onBack, openFacilitatorModal }) {
  const scrollRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeClinicSection, setActiveClinicSection] = useState("clinic-overview");
  const [clinicCommentText, setClinicCommentText] = useState("");
  const [clinicCommentRating, setClinicCommentRating] = useState(0);
  const [clinicCommentDone, setClinicCommentDone] = useState(false);
  const [clinicReviews, setClinicReviews] = useState([
    { id:1, author:"James R.", date:"Feb 2026", rating:5, text:"Amazing experience from start to finish. The clinic was modern, clean, and the staff was incredibly attentive. My procedure went perfectly and the results exceeded expectations." },
    { id:2, author:"Maria L.", date:"Jan 2026", rating:5, text:"Traveled internationally for my procedure and it was worth every mile. The medical team was professional, the facilities were top-notch, and the aftercare support was excellent." },
    { id:3, author:"David K.", date:"Dec 2025", rating:4, text:"Very satisfied with the quality of care. The only minor issue was the language barrier with some support staff, but the doctors spoke perfect English. Would recommend." },
  ]);

  const handleClinicComment = () => {
    if (!clinicCommentText.trim() || !clinicCommentRating) return;
    setClinicReviews(prev => [{ id:Date.now(), author:"You", date:"Mar 2026", rating:clinicCommentRating, text:clinicCommentText }, ...prev]);
    setClinicCommentText(""); setClinicCommentRating(0); setClinicCommentDone(true);
    setTimeout(()=>setClinicCommentDone(false), 3000);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 80);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollToClinicSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveClinicSection(id);
  };

  const CLINIC_SECTIONS = [
    { id:"clinic-overview", label:"Overview" },
    { id:"clinic-about", label:"About" },
    { id:"clinic-procedures", label:"Procedures" },
    { id:"clinic-reviews", label:"Reviews" },
    { id:"clinic-contact", label:"Get Help" },
  ];

  return (
    <div ref={scrollRef} style={{ maxHeight:"calc(100vh - 58px)", overflowY:"auto", position:"relative" }}>
      {/* Sticky secondary nav */}
      {scrolled && (
        <div style={{ position:"sticky", top:0, zIndex:100, background:C.white, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", flexWrap:"wrap" }}>
          <div style={{ display:"flex", gap:2, overflowX:"auto" }}>
            {CLINIC_SECTIONS.map(s=>(
              <button key={s.id} onClick={()=>scrollToClinicSection(s.id)} style={{ padding:"12px 14px", background:"none", border:"none", borderBottom:`2px solid ${activeClinicSection===s.id?C.teal:"transparent"}`, color:activeClinicSection===s.id?C.teal:C.textSm, fontWeight:activeClinicSection===s.id?700:500, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all .15s" }}>{s.label}</button>
            ))}
          </div>
          <button className="btn-primary" onClick={()=>openFacilitatorModal(clinic)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:20, padding:"8px 18px", fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", margin:"6px 0" }}>Talk to a Facilitator</button>
        </div>
      )}
      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 20px 60px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13.5, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:22, padding:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
          Back to Global Health Services
        </button>

        <div>
          {/* Main content */}
          <div>
            <div id="clinic-overview" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:"28px 26px", marginBottom:18, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
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
            <div id="clinic-about" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:12 }}>About this Clinic</h2>
              <p style={{ color:C.textMd, fontSize:14.5, lineHeight:1.75 }}>{clinic.description}</p>
            </div>
            <div id="clinic-procedures" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
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

            {/* GET A FREE CONSULTATION — inline card */}
            <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
              <div style={{ flex:1, minWidth:200 }}>
                <div style={{ fontWeight:800, fontSize:17, marginBottom:6 }}>Get a Free Consultation</div>
                <p style={{ color:C.textSm, fontSize:13.5, lineHeight:1.6 }}>Our coordinators will help you plan your medical journey — from choosing the right clinic to travel and accommodation.</p>
              </div>
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <button className="btn-primary" onClick={()=>openFacilitatorModal(clinic)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"13px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", marginBottom:6 }}>Talk to a Facilitator</button>
                <div style={{ fontSize:11, color:C.textSm }}>Free · No obligation</div>
              </div>
            </div>

            {/* REVIEWS */}
            <div id="clinic-reviews" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Patient Reviews</h2>
              <div style={{ display:"flex", gap:20, marginBottom:18, flexWrap:"wrap" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:28, fontWeight:800, color:C.teal }}>★ {clinic.rating}</div>
                  <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Overall ({clinic.reviews} reviews)</div>
                </div>
              </div>
              {clinicReviews.map((r,i)=>(
                <div key={r.id} style={{ borderBottom:i<clinicReviews.length-1?`1px solid ${C.borderLt}`:"none", paddingBottom:14, marginBottom:14 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ color:s<=r.rating?C.amber:C.grayMd, fontSize:14 }}>★</span>)}</div>
                    <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{r.author}</span>
                    <span style={{ fontSize:11, color:C.textSm }}>· {r.date}</span>
                  </div>
                  <p style={{ fontSize:13.5, color:C.textMd, lineHeight:1.65 }}>{r.text}</p>
                </div>
              ))}
              {/* Write a review */}
              <div style={{ background:C.offWhite, borderRadius:12, padding:"16px 18px", marginTop:8 }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Write a review</div>
                <div style={{ display:"flex", gap:4, marginBottom:10 }}>
                  {[1,2,3,4,5].map(i=>(
                    <button key={i} onClick={()=>setClinicCommentRating(i)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:i<=clinicCommentRating?C.amber:C.grayMd, transition:"color .1s" }}>★</button>
                  ))}
                </div>
                <textarea value={clinicCommentText} onChange={e=>setClinicCommentText(e.target.value)} placeholder="Share your experience with this clinic…" rows={3}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10 }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                <button className="btn-primary" onClick={handleClinicComment} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Submit Review</button>
                {clinicCommentDone && <span className="fade-up" style={{ marginLeft:12, fontSize:13, color:C.green, fontWeight:600 }}>Review submitted!</span>}
              </div>
            </div>

            {/* BOTTOM CTA */}
            <div id="clinic-contact" className="fade-up" style={{ background:`linear-gradient(135deg, ${C.purpleLt}, ${C.tealLt})`, border:`1px solid ${C.teal}30`, borderRadius:20, padding:"30px 28px", textAlign:"center", boxShadow:"0 4px 16px rgba(11,191,191,.10)" }}>
              <h2 style={{ fontWeight:800, fontSize:20, marginBottom:10 }}>Not sure where to start?</h2>
              <p style={{ color:C.textMd, fontSize:14.5, lineHeight:1.65, maxWidth:480, margin:"0 auto 22px" }}>Our medical coordinators can help you navigate your options, compare clinics, arrange travel, and coordinate your full care journey.</p>
              <button className="btn-primary" onClick={()=>openFacilitatorModal(clinic)} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:22, padding:"14px 32px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Talk to a Facilitator</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── PROVIDER PROFILE PAGE ────────────────────────────────────────────────────
const DEMO_REVIEWS = [
  { id:1, author:"Emily R.", date:"Feb 28, 2026", rating:5, text:"Absolutely wonderful experience. The doctor was thorough, listened carefully, and explained everything clearly. Highly recommend to anyone looking for quality care.", waitRating:5, bedsideRating:5 },
  { id:2, author:"Michael T.", date:"Feb 14, 2026", rating:4, text:"Great doctor, very knowledgeable. The only downside was the wait time — about 25 minutes past my scheduled appointment. But the care itself was excellent.", waitRating:3, bedsideRating:5 },
  { id:3, author:"Sarah K.", date:"Jan 30, 2026", rating:5, text:"I've been coming here for over a year and it's consistently great. The staff is friendly, the office is clean, and the doctor genuinely cares about patients.", waitRating:5, bedsideRating:5 },
  { id:4, author:"David L.", date:"Jan 15, 2026", rating:4, text:"Professional and efficient. Got my issue resolved in one visit. Would appreciate more flexible scheduling options though.", waitRating:4, bedsideRating:4 },
  { id:5, author:"Anna P.", date:"Dec 22, 2025", rating:5, text:"Best healthcare experience I've had in years. The doctor took time to understand my concerns and created a personalized treatment plan.", waitRating:5, bedsideRating:5 },
];

function ProviderProfilePage({ provider, onBack, bookmarks, toggleBookmark, isLoggedIn, setPage, setBookings }) {
  const [, setShowBooking] = useState(false);
  const [form, setForm] = useState({ name:"",email:"",phone:"",reason:"",time:"" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [done, setDone] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState(0);
  const [comments, setComments] = useState(DEMO_REVIEWS);
  const [commentDone, setCommentDone] = useState(false);
  const [reviewSort, setReviewSort] = useState("newest");
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);

  const [scrolledProv, setScrolledProv] = useState(false);
  const [activeSection, setActiveSection] = useState("highlights");

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => setScrolledProv(el.scrollTop > 160);
    el.addEventListener("scroll", handler);
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveSection(id);
  };

  const PROFILE_SECTIONS = [
    { id:"highlights", label:"Highlights" },
    { id:"about", label:"About" },
    { id:"insurances", label:"Insurances" },
    { id:"location", label:"Location" },
    { id:"reviews", label:"Reviews" },
    { id:"faqs", label:"FAQs" },
  ];

  const today = new Date();
  const days = Array.from({length:8},(_,i)=>{ const d=new Date(today); d.setDate(today.getDate()+i+1); return d; }).filter(d=>d.getDay()!==0&&d.getDay()!==6);

  const handleBook = () => {
    if(!form.name||!form.email||!form.phone) return;
    setBookings(b=>[...b,{...form,providerName:provider.name,providerId:provider.id,providerObj:provider,id:Date.now(),status:provider.hasCalendar?"Confirmed":"Pending",date:selectedDate?.toDateString()||"TBD",type:provider.hasCalendar?"booking":"request"}]);
    setDone(true);
  };

  const handleComment = () => {
    if(!isLoggedIn) { setPage("signup"); return; }
    if(!commentText.trim()||!commentRating) return;
    setComments(prev=>[{ id:Date.now(), author:"You", date:"Mar 17, 2026", rating:commentRating, text:commentText, waitRating:commentRating, bedsideRating:commentRating }, ...prev]);
    setCommentText(""); setCommentRating(0); setCommentDone(true);
    setTimeout(()=>setCommentDone(false),3000);
  };

  const avgRating = (comments.reduce((a,c)=>a+c.rating,0)/comments.length).toFixed(2);
  const avgWait = (comments.reduce((a,c)=>a+(c.waitRating||4),0)/comments.length).toFixed(2);
  const avgBedside = (comments.reduce((a,c)=>a+(c.bedsideRating||5),0)/comments.length).toFixed(2);
  const pct5Star = Math.round(comments.filter(c=>c.rating===5).length/comments.length*100);

  const DEMO_INSURANCE_TOP = [
    { name:"Aetna", color:"#7B2D8E", plans:["Aetna Choice POS II","Aetna HMO","Aetna PPO","Aetna Medicare Advantage","Aetna Open Access"] },
    { name:"BlueCross BlueShield", color:"#0073CF", plans:["BCBS PPO","BCBS HMO","BCBS Blue Card","BCBS Federal","BCBS Medicare Supplement"] },
    { name:"Cigna", color:"#E87722", plans:["Cigna PPO","Cigna HMO","Cigna Open Access Plus","Cigna EPO","Cigna Medicare Advantage"] },
    { name:"UnitedHealthcare", color:"#002677", plans:["UHC Choice Plus","UHC Navigate","UHC Options PPO","UHC Medicare Advantage","UHC Dual Complete"] },
    { name:"Medicare", color:"#00548E", plans:["Medicare Part A","Medicare Part B","Medicare Advantage","Medicare Supplement (Medigap)"] },
    { name:"Humana", color:"#39B54A", plans:["Humana PPO","Humana HMO","Humana Gold Plus","Humana Medicare Advantage","Humana Dental"] },
  ];
  const DEMO_INSURANCE_MORE = [
    { name:"Kaiser Permanente", plans:["Kaiser HMO","Kaiser Medicare"] },
    { name:"Medicaid", plans:["Medicaid Managed Care","Medicaid Fee-for-Service"] },
    { name:"Anthem", plans:["Anthem PPO","Anthem HMO","Anthem Blue Access"] },
    { name:"Molina Healthcare", plans:["Molina Marketplace","Molina Medicaid"] },
    { name:"Centene", plans:["Ambetter","WellCare"] },
    { name:"Health Net", plans:["Health Net PPO","Health Net HMO","Health Net Medi-Cal"] },
    { name:"Oscar Health", plans:["Oscar PPO","Oscar EPO"] },
    { name:"Tricare", plans:["Tricare Prime","Tricare Select","Tricare for Life"] },
    { name:"Oxford", plans:["Oxford Freedom","Oxford Liberty"] },
    { name:"Emblem Health", plans:["GHI HMO","HIP HMO","EmblemHealth PPO"] },
    { name:"Fidelis Care", plans:["Fidelis Medicaid","Fidelis Medicare"] },
    { name:"Amerigroup", plans:["Amerigroup Medicaid","Amerigroup Medicare"] },
    { name:"CareFirst", plans:["CareFirst PPO","CareFirst HMO"] },
    { name:"Highmark", plans:["Highmark PPO","Highmark Blue Shield"] },
    { name:"Independence Blue Cross", plans:["Keystone HMO","Personal Choice PPO"] },
    { name:"Horizon BCBS", plans:["Horizon Direct Access","Horizon OMNIA"] },
  ];
  const totalPlans = DEMO_INSURANCE_TOP.reduce((a,i)=>a+i.plans.length,0) + DEMO_INSURANCE_MORE.reduce((a,i)=>a+i.plans.length,0);
  const [showAllInsurance, setShowAllInsurance] = useState(false);
  const DEMO_EXPERTISE = ["Lower Back Pain","Joint Stiffness","Sports Injury","Neck Pain","Headache","Knee Pain","Shoulder Pain","Sciatica"];
  const DEMO_SERVICES = provider.tags || ["General Consultation","Follow-up Visit","Preventive Care"];

  const DEMO_FAQS = [
    { q:`Is ${provider.name} accepting new patients?`, a:"Yes, this provider is currently accepting new patients. You can book an appointment directly through their profile." },
    { q:`What insurance does ${provider.name} accept?`, a:`${provider.name} accepts a wide range of insurance plans including Aetna, BlueCross BlueShield, Cigna, UnitedHealthcare, and more.` },
    { q:`What are ${provider.name}'s office hours?`, a:`Office hours are ${provider.hours}. We recommend booking in advance for the best availability.` },
    { q:"How do I prepare for my first visit?", a:"Please bring your insurance card, a valid photo ID, and any relevant medical records. Arrive 10 minutes early to complete paperwork." },
  ];
  const [faqOpen, setFaqOpen] = useState(null);

  const sortedReviews = [...comments].sort((a,b)=>{
    if(reviewSort==="newest") return b.id-a.id;
    if(reviewSort==="highest") return b.rating-a.rating;
    if(reviewSort==="lowest") return a.rating-b.rating;
    return 0;
  });

  return (
    <div ref={scrollRef} style={{ maxHeight:"calc(100vh - 58px)", overflowY:"auto" }}>
      {/* Sticky secondary nav */}
      {scrolledProv && (
        <div style={{ position:"sticky", top:0, zIndex:100, background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 32px", display:"flex", alignItems:"center", gap:2, overflowX:"auto" }}>
          {PROFILE_SECTIONS.map(s=>(
            <button key={s.id} onClick={()=>scrollToSection(s.id)} style={{ padding:"12px 16px", background:"none", border:"none", borderBottom:`2px solid ${activeSection===s.id?C.teal:"transparent"}`, color:activeSection===s.id?C.teal:C.textSm, fontWeight:activeSection===s.id?700:500, fontSize:13, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap", transition:"all .15s" }}>{s.label}</button>
          ))}
        </div>
      )}

      <div style={{ maxWidth:1200, margin:"0 auto", padding:isMobile?"20px 16px 48px":"32px 32px 60px" }}>
        {/* Back */}
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:13.5, fontWeight:600, fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:22, padding:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15,18 9,12 15,6"/></svg>
          Back
        </button>

        {/* ─── TWO COLUMN: Content left, Booking right ─── */}
        <div style={{ display:"flex", gap:28, alignItems:"flex-start", flexDirection:isMobile?"column":"row" }}>

          {/* LEFT COLUMN */}
          <div style={{ flex:1, minWidth:0 }}>

            {/* ─── HEADER CARD ─── */}
            <div id="highlights" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:20, padding:isMobile?"20px":"28px 30px", marginBottom:20, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
              <div style={{ display:"flex", gap:18, alignItems:"flex-start", flexWrap:"wrap" }}>
                <ProviderAvatar provider={provider} size={80} radius={18} fontSize={24} />
                <div style={{ flex:1, minWidth:200 }}>
                  <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap", marginBottom:4 }}>
                    <h1 style={{ fontSize:isMobile?20:26, fontWeight:800, margin:0 }}>{provider.name}</h1>
                    {provider.contracted && <SealBadge />}
                  </div>
                  <div style={{ color:C.textSm, fontSize:14, marginBottom:6 }}>{provider.specialty}</div>
                  <div style={{ fontSize:13, color:C.textSm, marginBottom:8 }}>{provider.address}, {provider.city}</div>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:12 }}>
                    <span style={{ background:C.tealLt, color:C.teal, fontWeight:800, fontSize:16, padding:"4px 12px", borderRadius:10 }}>★ {avgRating}</span>
                    <span style={{ fontSize:13, color:C.textSm }}>({comments.length} patient ratings)</span>
                  </div>
                  {/* AI Review Summary — pros & cons */}
                  <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                    <div style={{ flex:1, minWidth:160, background:C.greenLt, borderRadius:12, padding:"12px 14px" }}>
                      <div style={{ color:C.green, fontWeight:700, fontSize:12, marginBottom:5, display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                        What patients love
                      </div>
                      <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.55 }}>Thorough explanations, personalized care, attentive approach, and clear communication.</p>
                    </div>
                    <div style={{ flex:1, minWidth:160, background:C.amberLt, borderRadius:12, padding:"12px 14px" }}>
                      <div style={{ color:C.amber, fontWeight:700, fontSize:12, marginBottom:5, display:"flex", alignItems:"center", gap:4 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                        Things to know
                      </div>
                      <p style={{ color:C.textMd, fontSize:12.5, lineHeight:1.55 }}>Wait times may be longer during peak hours. Arrive 10 min early for new patients.</p>
                    </div>
                  </div>
                </div>
                <BookmarkButton providerId={provider.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} size={24} />
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Highlights</h2>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12 }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/></svg>
                  </div>
                  <div><div style={{ fontWeight:700, fontSize:13 }}>Highly recommended</div><div style={{ fontSize:12, color:C.textSm }}>{pct5Star}% of patients gave 5 stars</div></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div><div style={{ fontWeight:700, fontSize:13 }}>Excellent wait time</div><div style={{ fontSize:12, color:C.textSm }}>96% waited less than 30 min</div></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  </div>
                  <div><div style={{ fontWeight:700, fontSize:13 }}>New patient appointments</div><div style={{ fontSize:12, color:C.textSm }}>Appointments available for new patients</div></div>
                </div>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div><div style={{ fontWeight:700, fontSize:13 }}>In-network insurances</div><div style={{ fontSize:12, color:C.textSm }}>{DEMO_INSURANCE_TOP.slice(0,3).map(i=>i.name).join(", ")} (+{totalPlans-3} more)</div></div>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <div id="about" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:12 }}>About {provider.name}</h2>
              <p style={{ color:C.textMd, fontSize:14, lineHeight:1.75, marginBottom:16 }}>
                {provider.name} is a highly rated {provider.specialty.toLowerCase()} specialist based in {provider.city}. With {provider.reviews}+ verified patient reviews and a {provider.rating} star rating, they are known for excellent patient care, thorough consultations, and a welcoming practice environment.
              </p>
              {/* Areas of expertise */}
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Areas of expertise</h3>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                {DEMO_EXPERTISE.map(e=>(
                  <span key={e} style={{ background:C.tealLt, color:C.teal, fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:18 }}>{e}</span>
                ))}
              </div>
              {/* Education */}
              <h3 style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Education & background</h3>
              <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:10 }}>
                {[
                  { label:"Practice", value:provider.name },
                  { label:"Specialty", value:provider.specialty },
                  { label:"Location", value:`${provider.address}, ${provider.city}` },
                  { label:"Hours", value:provider.hours },
                  { label:"Languages", value:"English" },
                ].map(item=>(
                  <div key={item.label} style={{ fontSize:13 }}>
                    <span style={{ color:C.textSm, fontWeight:600 }}>{item.label}: </span>
                    <span style={{ color:C.text }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* INSURANCES */}
            <div id="insurances" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>In-network insurances</h2>
              <p style={{ fontSize:12.5, color:C.textSm, marginBottom:16 }}>99% of patients have successfully booked with these insurances</p>
              {/* Top carriers with color badges */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:10, marginBottom:16 }}>
                {DEMO_INSURANCE_TOP.map(ins=>(
                  <div key={ins.name} style={{ display:"flex", alignItems:"center", gap:8, background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:12, padding:"10px 16px" }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:ins.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:11, color:"#fff", flexShrink:0 }}>{ins.name.slice(0,2).toUpperCase()}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{ins.name}</div>
                      <div style={{ fontSize:11, color:C.textSm }}>{ins.plans.length} plans</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Expand button */}
              <button onClick={()=>setShowAllInsurance(!showAllInsurance)} style={{ background:C.tealLt, border:`1px solid ${C.teal}30`, borderRadius:10, padding:"10px 18px", fontSize:13, fontWeight:700, color:C.teal, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, marginBottom:showAllInsurance?16:0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ transition:"transform .2s", transform:showAllInsurance?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                {showAllInsurance ? "Hide all plans" : `View all ${totalPlans}+ plans`}
              </button>
              {/* Expanded list */}
              {showAllInsurance && (
                <div className="fade-up">
                  {[...DEMO_INSURANCE_TOP, ...DEMO_INSURANCE_MORE].map(carrier=>(
                    <div key={carrier.name} style={{ marginBottom:14 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                        <div style={{ width:24, height:24, borderRadius:6, background:carrier.color||C.teal, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:9, color:"#fff", flexShrink:0 }}>{carrier.name.slice(0,2).toUpperCase()}</div>
                        <span style={{ fontWeight:700, fontSize:13.5, color:C.text }}>{carrier.name}</span>
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", paddingLeft:32 }}>
                        {carrier.plans.map(plan=>(
                          <span key={plan} style={{ background:C.offWhite, border:`1px solid ${C.borderLt}`, borderRadius:8, padding:"5px 12px", fontSize:12, color:C.textMd }}>{plan}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* LOCATION + MAP */}
            <div id="location" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Office location</h2>
              {/* Map placeholder */}
              <div style={{ background:C.gray, border:`2px dashed ${C.grayMd}`, borderRadius:14, height:220, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8, marginBottom:16 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.grayMd} strokeWidth="1.5">
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div style={{ fontWeight:700, fontSize:14, color:C.grayMd }}>Map</div>
                <div style={{ fontSize:12, color:C.grayMd }}>Interactive map will be displayed here</div>
              </div>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" style={{ flexShrink:0, marginTop:2 }}>
                  <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{provider.address}</div>
                  <div style={{ fontSize:13, color:C.textSm, marginBottom:8 }}>{provider.city}</div>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.address+", "+provider.city)}`} target="_blank" rel="noopener noreferrer" style={{ background:"none", border:"none", color:C.teal, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit", padding:0, textDecoration:"none" }}>Get directions →</a>
                </div>
              </div>
            </div>

            {/* REVIEWS */}
            <div id="reviews" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>Patient reviews</h2>
              {/* Rating summary */}
              <div style={{ display:"flex", gap:24, marginBottom:20, flexWrap:"wrap" }}>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:32, fontWeight:800, color:C.teal }}>{avgRating}</div>
                  <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Overall rating</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:32, fontWeight:800, color:C.text }}>{avgWait}</div>
                  <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Wait time</div>
                </div>
                <div style={{ textAlign:"center" }}>
                  <div style={{ fontSize:32, fontWeight:800, color:C.text }}>{avgBedside}</div>
                  <div style={{ fontSize:12, color:C.textSm, fontWeight:600 }}>Bedside manner</div>
                </div>
              </div>
              {/* Sort */}
              <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
                {[{k:"newest",l:"Newest"},{k:"highest",l:"Highest rated"},{k:"lowest",l:"Lowest rated"}].map(s=>(
                  <button key={s.k} onClick={()=>setReviewSort(s.k)} style={{ padding:"6px 14px", border:`1.5px solid ${reviewSort===s.k?C.teal:C.border}`, borderRadius:20, background:reviewSort===s.k?C.tealLt:C.white, color:reviewSort===s.k?C.teal:C.textSm, fontSize:12, fontWeight:reviewSort===s.k?700:400, cursor:"pointer", fontFamily:"inherit" }}>{s.l}</button>
                ))}
              </div>
              {/* Review list */}
              {sortedReviews.map(r=>(
                <div key={r.id} style={{ borderBottom:`1px solid ${C.borderLt}`, paddingBottom:14, marginBottom:14 }}>
                  <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(i=><span key={i} style={{ color:i<=r.rating?C.amber:C.grayMd, fontSize:14 }}>★</span>)}</div>
                    <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{r.author}</span>
                    <span style={{ fontSize:11, color:C.textSm }}>· {r.date}</span>
                  </div>
                  <p style={{ fontSize:13.5, color:C.textMd, lineHeight:1.65 }}>{r.text}</p>
                </div>
              ))}
              {/* Write a review */}
              <div style={{ background:C.offWhite, borderRadius:12, padding:"16px 18px", marginTop:8 }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:10 }}>Write a review</div>
                <div style={{ display:"flex", gap:4, marginBottom:10 }}>
                  {[1,2,3,4,5].map(i=>(
                    <button key={i} onClick={()=>setCommentRating(i)} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:i<=commentRating?C.amber:C.grayMd, transition:"color .1s" }}>★</button>
                  ))}
                </div>
                <textarea value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Share your experience…" rows={3}
                  style={{ width:"100%", padding:"10px 13px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:14, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10 }}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                <button className="btn-primary" onClick={handleComment} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Submit Review</button>
                {commentDone && <span className="fade-up" style={{ marginLeft:12, fontSize:13, color:C.green, fontWeight:600 }}>Review submitted!</span>}
              </div>
            </div>

            {/* FAQS */}
            <div id="faqs" className="fade-up" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 24px", marginBottom:18, boxShadow:"0 1px 6px rgba(0,0,0,.04)" }}>
              <h2 style={{ fontWeight:800, fontSize:16, marginBottom:14 }}>Frequently asked questions</h2>
              {DEMO_FAQS.map((faq,i)=>(
                <div key={i} style={{ borderBottom:i<DEMO_FAQS.length-1?`1px solid ${C.borderLt}`:"none" }}>
                  <button onClick={()=>setFaqOpen(faqOpen===i?null:i)} style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
                    <span style={{ fontWeight:600, fontSize:14, color:C.text, flex:1 }}>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0, transition:"transform .2s", transform:faqOpen===i?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
                  </button>
                  {faqOpen===i && <div className="fade-up" style={{ padding:"0 0 14px", color:C.textSm, fontSize:13.5, lineHeight:1.65 }}>{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN — Sidebar */}
          {!isMobile && (
            <div style={{ width:300, flexShrink:0, position:"sticky", top:56, alignSelf:"flex-start" }}>
              <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:16, padding:"22px 20px", boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>

                {provider.contracted && provider.hasCalendar ? (
                  <>
                    <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Book an appointment</div>
                    <p style={{ fontSize:12, color:C.textSm, marginBottom:16 }}>Schedule online — free and easy</p>

                    {/* Services */}
                    <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SERVICES</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
                      {DEMO_SERVICES.map(s=>(
                        <span key={s} style={{ background:C.offWhite, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11.5, color:C.textMd, fontWeight:500 }}>{s}</span>
                      ))}
                    </div>

                    {/* Date picker */}
                    <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SELECT DATE</div>
                    <div style={{ display:"flex", gap:4, overflowX:"auto", paddingBottom:4, marginBottom:12 }}>
                      {days.slice(0,5).map((d,i)=>(
                        <button key={i} onClick={()=>setSelectedDate(d)} style={{ flexShrink:0, width:46, padding:"7px 0", border:`1.5px solid ${selectedDate?.toDateString()===d.toDateString()?C.teal:C.border}`, borderRadius:10, background:selectedDate?.toDateString()===d.toDateString()?C.tealLt:C.white, cursor:"pointer", textAlign:"center", fontFamily:"inherit" }}>
                          <div style={{ fontSize:9.5, color:C.textSm, fontWeight:700 }}>{d.toLocaleDateString("en",{weekday:"short"}).toUpperCase()}</div>
                          <div style={{ fontSize:15, fontWeight:800, color:selectedDate?.toDateString()===d.toDateString()?C.teal:C.text, marginTop:2 }}>{d.getDate()}</div>
                        </button>
                      ))}
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                      <>
                        <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8 }}>SELECT TIME</div>
                        <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:14 }}>
                          {ALL_TIMES.slice(0,8).map(t=>(
                            <button key={t} onClick={()=>setForm(f=>({...f,time:t}))} style={{ padding:"5px 11px", border:`1.5px solid ${form.time===t?C.teal:C.border}`, borderRadius:8, background:form.time===t?C.tealLt:C.white, color:form.time===t?C.teal:C.textSm, fontSize:11.5, cursor:"pointer", fontWeight:form.time===t?700:400, fontFamily:"inherit" }}>{t}</button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Quick form */}
                    {(selectedDate && form.time) && !done && (
                      <>
                        {[["Name","name","text"],["Email","email","email"],["Phone","phone","tel"]].map(([l,k,t])=>(
                          <input key={k} type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}
                            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8 }}
                            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                        ))}
                        <button className="btn-primary" onClick={handleBook} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", marginTop:4 }}>Confirm Booking</button>
                      </>
                    )}

                    {done && (
                      <div style={{ textAlign:"center", padding:"12px 0" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ marginBottom:6 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <div style={{ fontWeight:700, fontSize:14, color:C.teal }}>Booked!</div>
                        <div style={{ fontSize:12, color:C.textSm }}>Confirmation sent to {form.email}</div>
                      </div>
                    )}

                    {!selectedDate && !done && (
                      <button className="btn-primary" onClick={()=>setSelectedDate(days[0])} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>View Availability</button>
                    )}
                  </>
                ) : provider.contracted && !provider.hasCalendar ? (
                  <>
                    <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Request an Appointment</div>
                    <p style={{ fontSize:12, color:C.textSm, marginBottom:12 }}>This provider doesn't have online booking yet. Fill out the form and they'll get back to you.</p>
                    <div style={{ background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:10, padding:"10px 12px", marginBottom:14, display:"flex", alignItems:"center", gap:8, fontSize:12, color:C.teal, fontWeight:600 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
                      Verified by Hospital.com
                    </div>
                    {!done ? (
                      <>
                        {[["Your Name","name","text"],["Email","email","email"],["Phone","phone","tel"]].map(([l,k,t])=>(
                          <input key={k} type={t} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder={l}
                            style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", marginBottom:8 }}
                            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                        ))}
                        <textarea value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} placeholder="Describe your reason for visit or any questions…" rows={3}
                          style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit", resize:"vertical", marginBottom:10 }}
                          onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
                        <button className="btn-primary" onClick={()=>{if(form.name&&form.email){setBookings(b=>[...b,{...form,providerName:provider.name,providerId:provider.id,providerObj:provider,id:Date.now(),status:"Pending",date:"TBD",type:"request"}]);setDone(true);}}} style={{ width:"100%", background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"12px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Request Appointment</button>
                      </>
                    ) : (
                      <div style={{ textAlign:"center", padding:"12px 0" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" style={{ marginBottom:6 }}><polyline points="20,6 9,17 4,12"/></svg>
                        <div style={{ fontWeight:700, fontSize:14, color:C.teal }}>Request Sent!</div>
                        <div style={{ fontSize:12, color:C.textSm, marginTop:4 }}>The provider will contact you at {form.email} to confirm your appointment.</div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Contact this provider</div>
                    <p style={{ fontSize:12, color:C.textSm, marginBottom:16 }}>This provider is not yet a verified partner. Contact them directly.</p>
                  </>
                )}

                {/* Call + Website — always shown */}
                <div style={{ borderTop:provider.contracted?`1px solid ${C.borderLt}`:"none", marginTop:provider.contracted?14:0, paddingTop:provider.contracted?14:0, display:"flex", gap:8 }}>
                  <a href={`tel:${provider.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", border:`2px solid ${C.teal}`, borderRadius:12, color:C.teal, fontWeight:700, fontSize:13.5, cursor:"pointer", textDecoration:"none", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=C.tealLt;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=C.white;}}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={C.teal} stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                    Call
                  </a>
                  <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:12, color:C.textMd, fontWeight:600, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", background:C.white, transition:"all .15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.color=C.teal;}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.textMd;}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Website
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile: fixed bottom button */}
          {isMobile && provider.contracted && (
            <button className="btn-primary" onClick={()=>setShowBooking(s=>!s)} style={{ position:"fixed", bottom:16, left:16, right:16, background:C.teal, color:"#fff", border:"none", borderRadius:14, padding:"14px", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(11,191,191,.3)", zIndex:50 }}>{provider.hasCalendar ? "Book Appointment" : "Request Appointment"}</button>
          )}
          {isMobile && !provider.contracted && (
            <div style={{ position:"fixed", bottom:16, left:16, right:16, display:"flex", gap:8, zIndex:50 }}>
              <a href={`tel:${provider.phone}`} style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px", background:C.teal, border:"none", borderRadius:14, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", textDecoration:"none", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(11,191,191,.3)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2z"/></svg>
                Call
              </a>
              <button style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"14px", background:C.white, border:`2px solid ${C.border}`, borderRadius:14, color:C.textMd, fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"inherit", boxShadow:"0 4px 20px rgba(0,0,0,.1)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// ─── PROVIDER MODAL ───────────────────────────────────────────────────────────
const BOOKED = ["9:00","10:30","14:00"];

function ProviderModal({ provider, onClose, setBookings, bookmarks, toggleBookmark, isLoggedIn, setPage, openProviderProfile }) {
  const [showBooking, setShowBooking] = useState(false);
  const [tab, setTab] = useState("calendar");
  const [form, setForm] = useState({ name:"",email:"",phone:"",reason:"",time:"" });
  const [selectedDate, setSelectedDate] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if(!provider) return null;
  const today = new Date();
  const days = Array.from({length:8},(_,i)=>{ const d=new Date(today); d.setDate(today.getDate()+i+1); return d; }).filter(d=>d.getDay()!==0&&d.getDay()!==6);

  const handleBook = () => {
    if(!form.name||!form.email||!form.phone) return;
    setBookings(b=>[...b,{...form,providerName:provider.name,providerId:provider.id,providerObj:provider,id:Date.now(),status:provider.hasCalendar?"Confirmed":"Pending",date:selectedDate?.toDateString()||"TBD",type:provider.hasCalendar?"booking":"request"}]);
    setDone(true);
  };

  return (
    <div onClick={e=>{ if(e.target===e.currentTarget) onClose(); }} style={{ position:"fixed",inset:0,background:"rgba(10,20,30,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:"16px",backdropFilter:"blur(3px)" }}>
      <div className="fade-up" style={{ background:C.white,borderRadius:20,width:"100%",maxWidth:780,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px rgba(0,0,0,.22)" }}>
        <div style={{ background:`linear-gradient(110deg, ${C.tealLt}, ${C.tealBg})`, padding:"22px 22px 18px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", gap:16, alignItems:"flex-start" }}>
            <ProviderAvatar provider={provider} size={60} radius={14} fontSize={19} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap", marginBottom:2 }}>
                <h2 onClick={openProviderProfile ? ()=>{onClose();openProviderProfile(provider);} : undefined}
                  style={{ fontSize:19, fontWeight:800, margin:0, color:openProviderProfile?C.teal:C.text, cursor:openProviderProfile?"pointer":"default", transition:"color .15s" }}
                  onMouseEnter={openProviderProfile?e=>{e.currentTarget.style.textDecoration="underline";}:undefined}
                  onMouseLeave={openProviderProfile?e=>{e.currentTarget.style.textDecoration="none";}:undefined}>{provider.name}</h2>
                {provider.contracted&&<SealBadge small />}
              </div>
              <p style={{ color:C.textSm, fontSize:13, margin:"2px 0 6px" }}>{provider.specialty}</p>
              <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:12.5 }}>
                <span style={{ color:C.amber }}>★ <strong>{provider.rating}</strong> <span style={{ color:C.textSm }}>({provider.reviews})</span></span>
                <span style={{ color:C.textSm }}>{provider.address}</span>
                <span style={{ color:C.textSm }}>{provider.hours}</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
              <BookmarkButton providerId={provider.id} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} size={22} />
              <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:C.textSm, fontSize:22, lineHeight:1, padding:4 }}>×</button>
            </div>
          </div>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <div style={{ display:"flex", gap:9, marginBottom:22, flexWrap:"wrap" }}>
            {provider.contracted && <button className="btn-primary" onClick={()=>setShowBooking(true)} style={{ flex:1,minWidth:110,background:C.teal,color:"#fff",border:"none",borderRadius:10,padding:"10px",fontWeight:700,fontSize:13.5,cursor:"pointer",fontFamily:"inherit" }}>Book Appointment</button>}
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
                    {ev.visitApproved && <Badge bg={C.greenLt} color={C.green}>Visit Approved</Badge>}
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

function ProviderDashboard({ tab, setTab }) {
  const [events, setEvents] = useState(INIT_EVENTS);
  const isMobile = useIsMobile();
  const maxV = Math.max(...MOCK_STATS.monthly.map(m=>m.v));

  function LeadsTab() {
    const [leads] = useState(MOCK_STATS.leads);
    return (
      <div style={{ display:"grid", gap:16 }}>
        {/* Billing summary */}
        <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:14 }}>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:6 }}>OUTSTANDING BALANCE</div>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>$1,200.00</div>
              </div>
              <div style={{ background:C.amberLt, borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:C.amber }}>Due Apr 1</div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <button style={{ flex:1, background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"10px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Pay Now
              </button>
              <button style={{ padding:"10px 16px", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:10, fontWeight:600, fontSize:13, color:C.textSm, cursor:"pointer", fontFamily:"inherit" }}>View Invoice</button>
            </div>
          </div>
          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px 22px" }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.textSm, letterSpacing:.5, marginBottom:6 }}>BILLING SUMMARY</div>
            <div style={{ display:"grid", gap:8 }}>
              {[["This Month","$475.00","18 leads"],["Last Month","$725.00","29 leads"],["Total Spent","$3,850.00","All time"]].map(([l,v,s])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.borderLt}` }}>
                  <div><div style={{ fontSize:13, fontWeight:600 }}>{l}</div><div style={{ fontSize:11, color:C.textSm }}>{s}</div></div>
                  <div style={{ fontSize:15, fontWeight:800 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12, fontSize:11.5, color:C.textSm }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="1.5"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
              Payments powered by Stripe
            </div>
          </div>
        </div>
        {/* Leads table */}
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
      </div>
    );
  }

  function ProfileTab() {
    const [clinics, setClinics] = useState([
      { id:1, name:"Glow Medical Spa — Miami", specialty:"Medical Aesthetics", address:"1395 Brickell Ave, Ste 800", city:"Miami, FL", phone:"+1 305-555-0445", hours:"Daily 10am–7pm", email:"miami@glowmedspa.com", website:"glowmedspa.com", insurances:["Aetna","Cigna","UnitedHealthcare"], avatar:null, status:"Active" },
      { id:2, name:"Glow Medical Spa — NYC", specialty:"Medical Aesthetics", address:"110 E 55th St, Ste 12", city:"New York, NY", phone:"+1 212-555-0446", hours:"Mon–Sat 9am–6pm", email:"nyc@glowmedspa.com", website:"glowmedspa.com", insurances:["Aetna","BlueCross BlueShield"], avatar:null, status:"Pending" },
      { id:3, name:"Glow Dermatology", specialty:"Dermatology", address:"4200 W Cypress St", city:"Tampa, FL", phone:"+1 813-555-0447", hours:"Mon–Fri 8am–5pm", email:"tampa@glowderm.com", website:"glowderm.com", insurances:["Humana","Medicare","Cigna"], avatar:null, status:"Active" },
    ]);
    const [expandedClinic, setExpandedClinic] = useState(null);
    const [profileSaved, setProfileSaved] = useState(false);
    const [insPickerFor, setInsPickerFor] = useState(null);
    const [insSearch, setInsSearch] = useState("");
    const insRef = useRef(null);
    const fileRefs = useRef({});

    useEffect(() => {
      const handler = (e) => { if (insRef.current && !insRef.current.contains(e.target)) setInsPickerFor(null); };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const updateClinic = (id, field, value) => setClinics(prev=>prev.map(c=>c.id===id?{...c,[field]:value}:c));
    const toggleIns = (clinicId, ins) => setClinics(prev=>prev.map(c=>c.id===clinicId?{...c,insurances:c.insurances.includes(ins)?c.insurances.filter(i=>i!==ins):[...c.insurances,ins]}:c));
    const removeIns = (clinicId, ins) => setClinics(prev=>prev.map(c=>c.id===clinicId?{...c,insurances:c.insurances.filter(i=>i!==ins)}:c));
    const addClinic = () => {
      const id = Date.now();
      setClinics(prev=>[...prev,{ id, name:"New Clinic", specialty:"", address:"", city:"", phone:"", hours:"", email:"", website:"", insurances:[], avatar:null, status:"Pending" }]);
      setExpandedClinic(id);
    };
    const removeClinic = (id) => { setClinics(prev=>prev.filter(c=>c.id!==id)); if(expandedClinic===id) setExpandedClinic(null); };

    const handleAvatar = (clinicId, e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => updateClinic(clinicId, "avatar", ev.target.result);
        reader.readAsDataURL(file);
      }
    };

    return (
      <div style={{ display:"grid", gap:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <div>
            <h3 style={{ fontWeight:800, fontSize:18, marginBottom:4 }}>My Clinics</h3>
            <p style={{ color:C.textSm, fontSize:13 }}>{clinics.length} location{clinics.length!==1?"s":""} registered</p>
          </div>
          <button onClick={addClinic} style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 20px", background:C.teal, color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Clinic
          </button>
        </div>

        {clinics.map(clinic => (
          <div key={clinic.id} style={{ background:C.white, border:`1px solid ${expandedClinic===clinic.id?C.teal+"40":C.border}`, borderRadius:14, overflow:"hidden", transition:"border-color .15s" }}>
            {/* Collapsed header */}
            <button onClick={()=>setExpandedClinic(expandedClinic===clinic.id?null:clinic.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:14, padding:"18px 22px", background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:clinic.avatar?"transparent":C.tealLt, border:`1px solid ${C.borderLt}`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:C.teal, flexShrink:0, overflow:"hidden" }}>
                {clinic.avatar ? <img src={clinic.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : clinic.name.split(" ").map(w=>w[0]).slice(0,2).join("")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:14.5, marginBottom:2 }}>{clinic.name}</div>
                <div style={{ fontSize:12.5, color:C.textSm }}>{clinic.address}{clinic.city?`, ${clinic.city}`:""}</div>
              </div>
              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                {clinic.status==="Pending" && <Badge bg={C.amberLt} color={C.amber}>Pending</Badge>}
                {clinic.status==="Active" && <Badge bg={C.greenLt} color={C.green}>Active</Badge>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ transition:"transform .2s", transform:expandedClinic===clinic.id?"rotate(180deg)":"none" }}><polyline points="6,9 12,15 18,9"/></svg>
              </div>
            </button>

            {/* Expanded edit form */}
            {expandedClinic===clinic.id && (
              <div className="fade-up" style={{ padding:"0 22px 22px", borderTop:`1px solid ${C.borderLt}` }}>
                {/* Avatar */}
                <div style={{ display:"flex", gap:14, alignItems:"center", padding:"18px 0 14px" }}>
                  <div onClick={()=>fileRefs.current[clinic.id]?.click()} style={{ width:64, height:64, borderRadius:16, background:clinic.avatar?"transparent":C.tealLt, border:`2px dashed ${clinic.avatar?C.teal:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", flexShrink:0 }}>
                    {clinic.avatar ? <img src={clinic.avatar} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>}
                  </div>
                  <input ref={el=>fileRefs.current[clinic.id]=el} type="file" accept="image/*" onChange={e=>handleAvatar(clinic.id,e)} style={{ display:"none" }} />
                  <div>
                    <div style={{ fontWeight:600, fontSize:13 }}>Clinic Photo</div>
                    <div style={{ fontSize:11.5, color:C.textSm }}>Click to upload</div>
                    {clinic.avatar && <button onClick={()=>updateClinic(clinic.id,"avatar",null)} style={{ background:"none", border:"none", color:C.red, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit", padding:0, marginTop:2 }}>Remove</button>}
                  </div>
                </div>
                {/* Fields */}
                <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"0 16px" }}>
                  {[["Clinic Name","name"],["Specialty","specialty"],["Address","address"],["City / State","city"],["Phone","phone"],["Hours","hours"],["Email","email"],["Website","website"]].map(([l,k])=>(
                    <div key={l} style={{ marginBottom:12 }}>
                      <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:4 }}>{l}</label>
                      <input value={clinic[k]} onChange={e=>updateClinic(clinic.id,k,e.target.value)}
                        style={{ width:"100%", padding:"8px 12px", border:`1.5px solid ${C.border}`, borderRadius:9, fontSize:13, outline:"none", fontFamily:"inherit" }}
                        onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                    </div>
                  ))}
                </div>
                {/* Insurances */}
                <div style={{ marginTop:8, marginBottom:16 }}>
                  <label style={{ fontSize:11, fontWeight:700, color:C.textSm, display:"block", marginBottom:8 }}>ACCEPTED INSURANCES</label>
                  {clinic.insurances.length>0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:10 }}>
                      {clinic.insurances.map(ins=>{
                        const cr = INSURANCE_CARRIERS.find(c=>c.name===ins);
                        return (
                          <span key={ins} style={{ display:"inline-flex", alignItems:"center", gap:4, background:C.tealLt, border:`1px solid ${C.teal}25`, borderRadius:16, padding:"3px 6px 3px 10px", fontSize:11.5, fontWeight:600, color:C.teal }}>
                            {cr && <div style={{ width:14, height:14, borderRadius:4, background:cr.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:6, color:"#fff" }}>{cr.name.slice(0,2)}</div>}
                            {ins}
                            <button onClick={()=>removeIns(clinic.id,ins)} style={{ background:"none", border:"none", color:C.teal, fontSize:13, cursor:"pointer", padding:"0 1px", fontWeight:700, lineHeight:1 }}>×</button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div ref={insPickerFor===clinic.id?insRef:undefined} style={{ position:"relative", display:"inline-block" }}>
                    <button onClick={()=>{setInsPickerFor(insPickerFor===clinic.id?null:clinic.id);setInsSearch("");}}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", border:`1.5px solid ${insPickerFor===clinic.id?C.teal:C.border}`, borderRadius:10, background:insPickerFor===clinic.id?C.tealLt:C.white, color:insPickerFor===clinic.id?C.teal:C.textSm, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Add
                    </button>
                    {insPickerFor===clinic.id && (
                      <div className="fade-up" style={{ position:"absolute", bottom:"calc(100% + 6px)", left:0, width:280, background:C.white, border:`1px solid ${C.border}`, borderRadius:14, boxShadow:"0 10px 36px rgba(0,0,0,.13)", zIndex:50, maxHeight:300, display:"flex", flexDirection:"column", overflow:"hidden" }}>
                        <div style={{ padding:"8px 10px", borderBottom:`1px solid ${C.borderLt}` }}>
                          <input value={insSearch} onChange={e=>setInsSearch(e.target.value)} placeholder="Search…" autoFocus
                            style={{ width:"100%", padding:"7px 10px", border:`1.5px solid ${C.border}`, borderRadius:8, fontSize:12, outline:"none", fontFamily:"inherit" }}
                            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border} />
                        </div>
                        <div style={{ overflowY:"auto", flex:1, padding:4 }}>
                          {INSURANCE_CARRIERS.filter(c=>!insSearch||c.name.toLowerCase().includes(insSearch.toLowerCase())).map(cr=>{
                            const sel = clinic.insurances.includes(cr.name);
                            return (
                              <button key={cr.name} onClick={()=>toggleIns(clinic.id,cr.name)}
                                style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 10px", border:"none", borderRadius:8, background:sel?C.tealLt:"transparent", cursor:"pointer", fontFamily:"inherit", textAlign:"left", fontSize:12.5, fontWeight:sel?700:500, color:sel?C.teal:C.text }}
                                onMouseEnter={e=>{if(!sel)e.currentTarget.style.background=C.gray;}} onMouseLeave={e=>{if(!sel)e.currentTarget.style.background=sel?C.tealLt:"transparent";}}>
                                <div style={{ width:12, height:12, borderRadius:3, border:`2px solid ${sel?C.teal:C.border}`, background:sel?C.teal:"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                  {sel && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4"><polyline points="20,6 9,17 4,12"/></svg>}
                                </div>
                                <div style={{ width:18, height:18, borderRadius:5, background:cr.color, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:7, color:"#fff", flexShrink:0 }}>{cr.name.slice(0,2)}</div>
                                {cr.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display:"flex", gap:10, alignItems:"center", paddingTop:8, borderTop:`1px solid ${C.borderLt}` }}>
                  <button onClick={()=>{setProfileSaved(true);setTimeout(()=>setProfileSaved(false),3000);}} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"9px 24px", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Save</button>
                  <button onClick={()=>removeClinic(clinic.id)} style={{ background:"none", border:`1.5px solid ${C.red}30`, borderRadius:10, padding:"9px 18px", fontWeight:600, fontSize:13, color:C.red, cursor:"pointer", fontFamily:"inherit" }}>Remove Clinic</button>
                  {profileSaved && <span className="fade-up" style={{ color:C.green, fontWeight:600, fontSize:12 }}>✓ Saved!</span>}
                </div>
              </div>
            )}
          </div>
        ))}
        <p style={{ fontSize:11.5, color:C.textSm }}>All edits require admin approval before going live.</p>
      </div>
    );
  }

  function PortalTab() {
    const [workDays, setWorkDays] = useState({ Mon:true, Tue:true, Wed:true, Thu:true, Fri:true, Sat:false, Sun:false });
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");
    const [apptLength, setApptLength] = useState(30);
    const [portalSaved, setPortalSaved] = useState(false);
    const [editsPending, setEditsPending] = useState(false);
    const [bookingMode, setBookingMode] = useState("calendar");

    const toggleDay = (d) => setWorkDays(prev=>({...prev,[d]:!prev[d]}));
    const handleSave = () => { setPortalSaved(true); setEditsPending(true); setTimeout(()=>setPortalSaved(false),3000); };

    return (
      <div style={{ display:"grid", gap:16 }}>
        {/* Scheduling */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:10 }}>
            <div>
              <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Scheduling & Availability</h3>
              <p style={{ color:C.textSm, fontSize:12.5 }}>Set your working days, hours, and appointment duration. Patients will only see available slots based on these settings.</p>
            </div>
            {editsPending && <Badge bg={C.amberLt} color={C.amber}>Pending admin review</Badge>}
          </div>

          {/* Working days */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>WORKING DAYS</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>(
                <button key={d} onClick={()=>toggleDay(d)}
                  style={{ width:52, padding:"10px 0", border:`1.5px solid ${workDays[d]?C.teal:C.border}`, borderRadius:10, background:workDays[d]?C.tealLt:C.white, color:workDays[d]?C.teal:C.textSm, fontSize:13, fontWeight:workDays[d]?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s", textAlign:"center" }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Working hours */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>WORKING HOURS</label>
            <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:11, color:C.textSm, marginBottom:4 }}>Start</div>
                <select value={startTime} onChange={e=>setStartTime(e.target.value)}
                  style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", color:C.text, background:C.white, cursor:"pointer", outline:"none", minWidth:100 }}>
                  {["07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <span style={{ color:C.textSm, fontWeight:600, marginTop:18 }}>to</span>
              <div>
                <div style={{ fontSize:11, color:C.textSm, marginBottom:4 }}>End</div>
                <select value={endTime} onChange={e=>setEndTime(e.target.value)}
                  style={{ padding:"9px 14px", border:`1.5px solid ${C.border}`, borderRadius:10, fontSize:13.5, fontFamily:"inherit", color:C.text, background:C.white, cursor:"pointer", outline:"none", minWidth:100 }}>
                  {["14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Appointment length */}
          <div style={{ marginBottom:24 }}>
            <label style={{ fontSize:12, fontWeight:700, color:C.text, display:"block", marginBottom:10, letterSpacing:.3 }}>APPOINTMENT LENGTH</label>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {[15,20,30,45,60,90].map(m=>(
                <button key={m} onClick={()=>setApptLength(m)}
                  style={{ padding:"9px 18px", border:`1.5px solid ${apptLength===m?C.teal:C.border}`, borderRadius:10, background:apptLength===m?C.tealLt:C.white, color:apptLength===m?C.teal:C.textSm, fontSize:13, fontWeight:apptLength===m?700:500, cursor:"pointer", fontFamily:"inherit", transition:"all .15s" }}>
                  {m} min
                </button>
              ))}
            </div>
          </div>

          {/* Summary + Save */}
          <div style={{ background:C.offWhite, borderRadius:12, padding:"14px 18px", marginBottom:18, border:`1px solid ${C.borderLt}` }}>
            <div style={{ fontSize:12, fontWeight:700, color:C.textSm, marginBottom:8, letterSpacing:.3 }}>CURRENT SCHEDULE SUMMARY</div>
            <div style={{ fontSize:13.5, color:C.text, lineHeight:1.8 }}>
              <strong>Days:</strong> {Object.entries(workDays).filter(([,v])=>v).map(([d])=>d).join(", ") || "None selected"}<br/>
              <strong>Hours:</strong> {startTime} – {endTime}<br/>
              <strong>Appointment:</strong> {apptLength} minutes per session
            </div>
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button className="btn-primary" onClick={handleSave} style={{ background:C.teal, color:"#fff", border:"none", borderRadius:10, padding:"11px 28px", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit" }}>Save Schedule</button>
            {portalSaved && <span style={{ color:C.green, fontSize:12.5, fontWeight:600 }}>✓ Saved — pending admin review</span>}
          </div>
        </div>

        {/* Calendar integration */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Calendar Integration</h3>
          <p style={{ color:C.textSm, fontSize:12.5, marginBottom:18 }}>Connect your calendar so patients can book directly into your available slots.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { name:"Google Calendar", connected:true, color:"#4285F4" },
              { name:"Microsoft Outlook", connected:false, color:"#0078D4" },
            ].map(cal=>(
              <div key={cal.name} style={{ flex:1, minWidth:200, border:`1.5px solid ${cal.connected?C.green:C.border}`, borderRadius:12, padding:"16px 18px", display:"flex", alignItems:"center", gap:12, background:cal.connected?C.greenLt:C.white }}>
                <div style={{ width:36, height:36, borderRadius:10, background:cal.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontWeight:800, fontSize:14, color:cal.color }}>{cal.name.charAt(0)}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:13 }}>{cal.name}</div>
                  <div style={{ fontSize:11.5, color:cal.connected?C.green:C.textSm }}>{cal.connected?"Connected":"Not connected"}</div>
                </div>
                <button style={{ padding:"6px 14px", border:`1.5px solid ${cal.connected?C.green:C.teal}`, borderRadius:8, background:cal.connected?C.white:C.tealLt, color:cal.connected?C.green:C.teal, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>
                  {cal.connected?"Disconnect":"Connect"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-in / Booking mode */}
        <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:14, padding:"24px 26px" }}>
          <h3 style={{ fontWeight:800, fontSize:16, marginBottom:4 }}>Booking Mode</h3>
          <p style={{ color:C.textSm, fontSize:12.5, marginBottom:18 }}>Choose how patients can schedule visits with you.</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {[
              { mode:"calendar", label:"Calendar Booking", desc:"Patients pick a date & time slot",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
              { mode:"request", label:"Request Only", desc:"Patients submit a request, you confirm",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
              { mode:"walkin", label:"Walk-in Only", desc:"No online booking — walk-in patients only",
                icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2"/><path d="M10 22V18L7 15V11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4l-3 3v4"/></svg> },
            ].map(opt=>{
              const active = bookingMode===opt.mode;
              return (
                <button key={opt.mode} onClick={()=>setBookingMode(opt.mode)} style={{ flex:1, minWidth:160, padding:"18px 16px", border:`2px solid ${active?C.teal:C.border}`, borderRadius:14, background:active?C.tealLt:C.white, cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all .18s" }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:active?C.white:C.gray, display:"flex", alignItems:"center", justifyContent:"center", color:active?C.teal:C.textSm, marginBottom:10 }}>{opt.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13.5, color:active?C.teal:C.text, marginBottom:4 }}>{opt.label}</div>
                  <div style={{ fontSize:11.5, color:C.textSm, lineHeight:1.5 }}>{opt.desc}</div>
                  {active && <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:5, color:C.teal, fontSize:11.5, fontWeight:700 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                    Active
                  </div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin notice */}
        <div style={{ background:C.amberLt, border:`1px solid #FDE68A`, borderRadius:12, padding:"14px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={{ width:28, height:28, borderRadius:8, background:"#FDE68A", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:"#92400E", marginBottom:3 }}>All changes require admin approval</div>
            <div style={{ fontSize:12.5, color:"#78350F", lineHeight:1.6 }}>Schedule changes, profile edits, and booking mode updates will be reviewed by the Hospital.com team before going live. You'll receive an email notification once approved.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:980, margin:"0 auto", padding:"24px 16px" }}>
      {tab!=="account" && (
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800 }}>Provider Dashboard</h1>
          <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>Glow Medical Spa · Partner</p>
        </div>
      </div>
      )}
      {tab==="overview"&&(
        <>
          <div className="dash-stats" style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit, minmax(150px, 1fr))", gap:10, marginBottom:16 }}>
            {[["Total Leads",MOCK_STATS.totalLeads,"All time"],["Visits",MOCK_STATS.visits,"This month"],["Calls",MOCK_STATS.calls,"This month"],["Bookings",MOCK_STATS.bookings,"This month"]].map(([l,v,s])=>(
              <div key={l} style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
                <div style={{ fontSize:28, fontWeight:800, color:C.text }}>{v}</div>
                <div style={{ fontWeight:600, fontSize:13, marginTop:2 }}>{l}</div>
                <div style={{ fontSize:11.5, color:C.textSm, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>
          <div className="prov-dash-charts" style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit, minmax(260px, 1fr))", gap:14 }}>
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
      {tab==="leads"&&<LeadsTab/>}
      {tab==="calendar"&&<DemoCalendar events={events} setEvents={setEvents}/>}
      {tab==="portal"&&<PortalTab/>}
      {tab==="profile"&&<ProfileTab/>}
      {tab==="account"&&<AccountTab role="provider" />}
    </div>
  );
}

// ─── FACILITATOR DASHBOARD DATA ──────────────────────────────────────────────
const FACIL_LEADS = [
  { id:1,  date:"Mar 12", name:"James W.",    email:"james.w@gmail.com",    phone:"+1 212-555-0101", procedure:"Hair Transplant",        country:"Turkey",      status:"New",        age:34, gender:"Male",   location:"New York, NY" },
  { id:2,  date:"Mar 12", name:"Anika S.",    email:"anika.s@outlook.com",  phone:"+1 310-555-0202", procedure:"Dental Implants",         country:"Poland",      status:"Contacted",  age:52, gender:"Female", location:"Los Angeles, CA" },
  { id:3,  date:"Mar 11", name:"Robert L.",   email:"r.lee@yahoo.com",      phone:"+1 646-555-0303", procedure:"Knee Replacement",        country:"Germany",     status:"Converted",  age:61, gender:"Male",   location:"New York, NY" },
  { id:4,  date:"Mar 11", name:"Maria D.",    email:"maria.d@gmail.com",    phone:"+44 7700-900404", procedure:"IVF",                     country:"Spain",       status:"New",        age:38, gender:"Female", location:"London, UK" },
  { id:5,  date:"Mar 10", name:"Chen H.",     email:"chen.h@gmail.com",     phone:"+1 713-555-0505", procedure:"Rhinoplasty",             country:"Turkey",      status:"Contacted",  age:29, gender:"Male",   location:"Houston, TX" },
  { id:6,  date:"Mar 10", name:"Fatima A.",   email:"fatima.a@icloud.com",  phone:"+1 212-555-0606", procedure:"Cancer Treatment",        country:"South Korea", status:"Converted",  age:47, gender:"Female", location:"New York, NY" },
  { id:7,  date:"Mar 09", name:"David M.",    email:"david.m@gmail.com",    phone:"+1 780-555-0707", procedure:"Bariatric Surgery",       country:"Germany",     status:"New",        age:44, gender:"Male",   location:"Edmonton, CA" },
  { id:8,  date:"Mar 09", name:"Sofia R.",    email:"sofia.r@hotmail.com",  phone:"+1 212-555-0808", procedure:"LASIK",                   country:"Spain",       status:"Closed",     age:31, gender:"Female", location:"New York, NY" },
  { id:9,  date:"Mar 08", name:"Omar K.",     email:"omar.k@gmail.com",     phone:"+61 400-555-909", procedure:"Cardiac Surgery",         country:"India",       status:"Converted",  age:58, gender:"Male",   location:"Sydney, AU" },
  { id:10, date:"Mar 08", name:"Priya N.",    email:"priya.n@gmail.com",    phone:"+1 310-555-1010", procedure:"Hair Transplant",         country:"Turkey",      status:"Contacted",  age:27, gender:"Female", location:"Los Angeles, CA" },
  { id:11, date:"Mar 07", name:"Lucas F.",    email:"lucas.f@gmail.com",    phone:"+1 212-555-1111", procedure:"Dental Implants",         country:"Poland",      status:"New",        age:49, gender:"Male",   location:"New York, NY" },
  { id:12, date:"Mar 07", name:"Elena V.",    email:"elena.v@yahoo.com",    phone:"+1 905-555-1212", procedure:"Rhinoplasty",             country:"Turkey",      status:"Closed",     age:35, gender:"Female", location:"Mississauga, CA" },
  { id:13, date:"Mar 06", name:"Tom B.",      email:"tom.b@gmail.com",      phone:"+1 403-555-1313", procedure:"Orthopedics",             country:"Germany",     status:"Converted",  age:55, gender:"Male",   location:"Calgary, CA" },
  { id:14, date:"Mar 06", name:"Nina P.",     email:"nina.p@outlook.com",   phone:"+1 212-555-1414", procedure:"Stem Cell Therapy",       country:"South Korea", status:"Contacted",  age:42, gender:"Female", location:"New York, NY" },
  { id:15, date:"Mar 05", name:"Andre T.",    email:"andre.t@gmail.com",    phone:"+1 713-555-1515", procedure:"Hair Transplant",         country:"Turkey",      status:"New",        age:33, gender:"Male",   location:"Houston, TX" },
  { id:16, date:"Mar 05", name:"Jessica L.",  email:"jess.l@gmail.com",     phone:"+1 613-555-1616", procedure:"IVF",                     country:"Spain",       status:"Converted",  age:36, gender:"Female", location:"Ottawa, CA" },
  { id:17, date:"Mar 04", name:"Sam K.",      email:"sam.k@yahoo.com",      phone:"+1 212-555-1717", procedure:"Cardiac Surgery",         country:"Germany",     status:"Contacted",  age:64, gender:"Male",   location:"New York, NY" },
  { id:18, date:"Mar 04", name:"Yuki T.",     email:"yuki.t@gmail.com",     phone:"+44 7911-900181", procedure:"Cancer Treatment",        country:"South Korea", status:"New",        age:51, gender:"Female", location:"Manchester, UK" },
  { id:19, date:"Mar 03", name:"Marco B.",    email:"marco.b@gmail.com",    phone:"+1 310-555-1919", procedure:"Dental Implants",         country:"Poland",      status:"Converted",  age:46, gender:"Male",   location:"Los Angeles, CA" },
  { id:20, date:"Mar 03", name:"Aisha H.",    email:"aisha.h@outlook.com",  phone:"+1 212-555-2020", procedure:"Bariatric Surgery",       country:"Germany",     status:"Closed",     age:39, gender:"Female", location:"New York, NY" },
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
function FacilitatorDashboard({ tab, setTab }) {
  const [leads, setLeads] = useState(FACIL_LEADS);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterProc, setFilterProc] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const isMobile = useIsMobile();

  const allProcs = ["All", ...Array.from(new Set(FACIL_LEADS.map(l=>l.procedure)))];

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
      {tab!=="account" && (
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:12 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800 }}>Facilitator Dashboard</h1>
          <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>MedTravel Facilitators · Partner</p>
        </div>
      </div>
      )}

      {tab==="overview"&&(
        <>
          <div className="dash-stats" style={{ display:"grid", gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit, minmax(150px,1fr))", gap:10, marginBottom:18 }}>
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

          <div className="facil-charts" style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14, marginBottom:14 }}>
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

          <div style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <h3 style={{ fontWeight:700, fontSize:14 }}>Recent Requests</h3>
              <button onClick={()=>setTab("leads")} style={{ background:"none", border:"none", color:C.teal, fontWeight:700, fontSize:12.5, cursor:"pointer", fontFamily:"inherit" }}>View all </button>
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

      {tab==="leads"&&(
        <>
          <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, procedure, city…" style={{ flex:1, minWidth:180, padding:"9px 15px", border:`1.5px solid ${C.border}`, borderRadius:22, fontSize:13.5, outline:"none", fontFamily:"inherit" }} onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
            <Select value={filterStatus} onChange={setFilterStatus} minWidth={130} options={[{value:"All",label:"All Statuses"},"New","Contacted","Converted","Closed"]}/>
            <Select value={filterProc} onChange={setFilterProc} minWidth={180} options={allProcs.map(p=>({value:p, label:p==="All"?"All Procedures":p}))}/>
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

          <div className="facil-leads-table-wrap" style={{ background:C.white, border:`1px solid ${C.border}`, borderRadius:12, overflow:"auto" }}>
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

          <div className="facil-leads-cards">
            {visible.map(l=>(
              <div key={l.id} onClick={()=>setSelectedLead(l)}
                style={{ background:selectedLead?.id===l.id?C.purpleLt:C.white, border:`${selectedLead?.id===l.id?"2px":"1px"} solid ${selectedLead?.id===l.id?C.purple+"40":C.border}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", transition:"background .1s" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
                  <span style={{ fontWeight:700, fontSize:13 }}>{l.name}</span>
                  <Badge bg={STATUS_COLORS[l.status].bg} color={STATUS_COLORS[l.status].color}>{l.status}</Badge>
                </div>
                <div style={{ fontSize:11.5, color:C.textMd, marginBottom:2 }}>{l.procedure} · {l.country}</div>
                <div style={{ fontSize:11, color:C.textSm }}>{l.location} · Age {l.age} · {l.gender} · {l.date}</div>
                {selectedLead?.id===l.id&&(
                  <div style={{ marginTop:10, borderTop:`1px solid ${C.purple}20`, paddingTop:10 }}>
                    <div style={{ fontSize:9.5, fontWeight:700, color:C.textSm, letterSpacing:.4, marginBottom:6 }}>STATUS</div>
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {["New","Contacted","Converted","Closed"].map(s=>(
                        <button key={s} onClick={e=>{e.stopPropagation();setLeads(ls=>ls.map(lx=>lx.id===l.id?{...lx,status:s}:lx));setSelectedLead(prev=>({...prev,status:s}));}}
                          style={{ padding:"5px 11px", border:`1.5px solid ${selectedLead.status===s?STATUS_COLORS[s].color:C.border}`, borderRadius:16, background:selectedLead.status===s?STATUS_COLORS[s].bg:C.white, color:selectedLead.status===s?STATUS_COLORS[s].color:C.textSm, fontSize:11, fontWeight:selectedLead.status===s?700:400, cursor:"pointer", fontFamily:"inherit" }}>{s}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {visible.length===0&&<div style={{ textAlign:"center", padding:"40px", color:C.textSm, background:C.gray, borderRadius:12 }}>No leads match filters.</div>}
          </div>
        </>
      )}

      {tab==="analytics"&&(
        <div style={{ display:"grid", gap:14 }}>
          <div className="facil-analytics-row" style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
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

          <div className="facil-analytics-row" style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"repeat(auto-fit,minmax(260px,1fr))", gap:14 }}>
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
      {tab==="account"&&<AccountTab role="facilitator" />}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedProviderProfile, setSelectedProviderProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialSpecialty, setInitialSpecialty] = useState("");
  const [isProviderView, setIsProviderView] = useState(false);
  const [isFacilitatorView, setIsFacilitatorView] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [providerTab, setProviderTab] = useState("overview");
  const [facilitatorTab, setFacilitatorTab] = useState("overview");
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [showFacilitatorModal, setShowFacilitatorModal] = useState(false);
  const [facilitatorClinic, setFacilitatorClinic] = useState(null);
  const [branchPickerProvider, setBranchPickerProvider] = useState(null);

  const openProviderProfileSafe = (prov) => {
    if (prov.branches && prov.branches.length > 1) {
      setBranchPickerProvider(prov);
    } else {
      setSelectedProviderProfile(prov);
    }
  };

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Bookmarks state (array of provider IDs)
  const [bookmarks, setBookmarks] = useState([]);

  const toggleBookmark = (providerId) => {
    setBookmarks(prev =>
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  const handleLogin = () => setIsLoggedIn(true);

  const openProvider = (prov) => setSelectedProvider(prov);
  const closeProvider = () => setSelectedProvider(null);
  const openFacilitatorModal = (clinic=null) => { setFacilitatorClinic(clinic?.id ? clinic : null); setShowFacilitatorModal(true); };
  const closeFacilitatorModal = () => { setShowFacilitatorModal(false); setFacilitatorClinic(null); };

  return (
    <div style={{ fontFamily:"'DM Sans', sans-serif", minHeight:"100vh", background:C.offWhite, color:C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet"/>
      <style>{GLOBAL_CSS}</style>
      <Nav setPage={p=>{ setSelectedClinic(null); setSelectedProviderProfile(null); setShowUserProfile(false); setIsProviderView(false); setIsFacilitatorView(false); setPage(p); }} isProviderView={isProviderView} setIsProviderView={setIsProviderView} isFacilitatorView={isFacilitatorView} setIsFacilitatorView={setIsFacilitatorView} showUserProfile={showUserProfile} setShowUserProfile={setShowUserProfile} providerTab={providerTab} setProviderTab={setProviderTab} facilitatorTab={facilitatorTab} setFacilitatorTab={setFacilitatorTab}/>
      <FloatingViewSwitcher showUserProfile={showUserProfile} setShowUserProfile={setShowUserProfile} isProviderView={isProviderView} setIsProviderView={setIsProviderView} isFacilitatorView={isFacilitatorView} setIsFacilitatorView={setIsFacilitatorView} />
      {showUserProfile ? <UserProfilePage setPage={setPage} /> : isProviderView ? <ProviderDashboard tab={providerTab} setTab={setProviderTab}/> : isFacilitatorView ? <FacilitatorDashboard tab={facilitatorTab} setTab={setFacilitatorTab}/> : (
        <>
          {selectedProviderProfile ? (
            <ProviderProfilePage
              provider={selectedProviderProfile}
              onBack={()=>setSelectedProviderProfile(null)}
              bookmarks={bookmarks}
              toggleBookmark={toggleBookmark}
              isLoggedIn={isLoggedIn}
              setPage={p=>{setSelectedProviderProfile(null);setPage(p);}}
              setBookings={setBookings}
            />
          ) : selectedClinic ? (
            <InternationalClinicProfile
              clinic={selectedClinic}
              onBack={()=>setSelectedClinic(null)}
              openFacilitatorModal={openFacilitatorModal}
            />
          ) : (
            <>
              {page==="home"&&<HomePage setPage={setPage} setInitialQuery={setInitialQuery} setInitialSpecialty={setInitialSpecialty} openProviderProfile={openProviderProfileSafe} openClinicProfile={clinic=>setSelectedClinic(clinic)}/>}
              {page==="chat"&&<ChatPage setPage={setPage} setSelectedProvider={openProvider} openProviderProfile={openProviderProfileSafe} setSelectedClinic={setSelectedClinic} initialQuery={initialQuery} setInitialQuery={setInitialQuery} openFacilitatorModal={openFacilitatorModal} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn}/>}
              {page==="directory"&&<DirectoryPage setPage={setPage} setSelectedProvider={openProviderProfileSafe} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setInitialQuery={setInitialQuery} bookingsList={bookings} initialSpecialty={initialSpecialty} setInitialSpecialty={setInitialSpecialty}/>}
              {page==="facilitators"&&<FacilitatorsPage setPage={setPage} setSelectedProvider={openProvider}/>}
              {page==="international"&&<InternationalPage setSelectedClinic={setSelectedClinic} openFacilitatorModal={openFacilitatorModal}/>}
              {page==="login"&&<LoginPage setPage={setPage} onLogin={handleLogin}/>}
              {page==="signup"&&<SignupPage setPage={setPage} onLogin={handleLogin}/>}
              {page==="become-provider"&&<BecomeProviderPage setPage={setPage}/>}
            </>
          )}
        </>
      )}
      {selectedProvider && <ProviderModal provider={selectedProvider} onClose={closeProvider} setBookings={setBookings} bookmarks={bookmarks} toggleBookmark={toggleBookmark} isLoggedIn={isLoggedIn} setPage={setPage} openProviderProfile={prov=>{closeProvider();openProviderProfileSafe(prov);}}/>}
      {showFacilitatorModal && <FacilitatorModal onClose={closeFacilitatorModal} clinic={facilitatorClinic}/>}
      {branchPickerProvider && (
        <div onClick={e=>{if(e.target===e.currentTarget)setBranchPickerProvider(null);}} style={{ position:"fixed", inset:0, background:"rgba(10,20,30,.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:600, padding:16, backdropFilter:"blur(3px)" }}>
          <div className="fade-up" style={{ background:C.white, borderRadius:22, padding:"32px 28px", maxWidth:460, width:"100%", boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:20 }}>
              <ProviderAvatar provider={branchPickerProvider} size={52} radius={14} fontSize={17} />
              <div>
                <h3 style={{ fontWeight:800, fontSize:18, margin:0 }}>{branchPickerProvider.name}</h3>
                <p style={{ color:C.textSm, fontSize:13, marginTop:2 }}>{branchPickerProvider.branches.length} locations available</p>
              </div>
            </div>
            <p style={{ fontSize:13.5, color:C.textMd, marginBottom:16, lineHeight:1.5 }}>This provider has multiple locations. Choose a branch to view:</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {branchPickerProvider.branches.map(branch => (
                <button key={branch.id} onClick={()=>{
                  const merged = {...branchPickerProvider, ...branch, name:branch.name, address:branch.address, city:branch.city, phone:branch.phone, hours:branch.hours, rating:branch.rating, reviews:branch.reviews, parentName:branchPickerProvider.name};
                  setBranchPickerProvider(null);
                  setSelectedProviderProfile(merged);
                }}
                  style={{ display:"flex", gap:14, alignItems:"center", padding:"16px 18px", border:`1.5px solid ${C.border}`, borderRadius:14, background:C.white, cursor:"pointer", fontFamily:"inherit", textAlign:"left", transition:"all .15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.teal;e.currentTarget.style.background=C.tealLt;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}>
                  <div style={{ width:40, height:40, borderRadius:10, background:C.tealLt, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{branch.name}</div>
                    <div style={{ fontSize:12.5, color:C.textSm }}>{branch.address}, {branch.city}</div>
                    <div style={{ display:"flex", gap:8, marginTop:4, fontSize:12, color:C.textSm }}>
                      <span style={{ color:C.amber, fontWeight:600 }}>★ {branch.rating}</span>
                      <span>({branch.reviews} reviews)</span>
                      <span>· {branch.hours}</span>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.textSm} strokeWidth="2.5" style={{ flexShrink:0 }}><polyline points="9,18 15,12 9,6"/></svg>
                </button>
              ))}
            </div>
            <button onClick={()=>setBranchPickerProvider(null)} style={{ width:"100%", marginTop:14, padding:"11px", border:`1.5px solid ${C.border}`, borderRadius:12, background:C.white, color:C.textSm, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}