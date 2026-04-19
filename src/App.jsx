import { useState, useRef, useEffect } from "react";

const C = {
  primary:"#3a5162", mid:"#7a9bb0", light:"#b8c9d4",
  section:"#d5dde3", dark:"#1a1a1a", muted:"#555",
  white:"#ffffff", accent:"#f5f5f5", border:"#ddd",
};

// ── VALID CODES ───────────────────────────────────────────────────────────
const VALID_CODES = [
  "CLR-3847","CLR-5219","CLR-7463","CLR-2981","CLR-6054",
  "CLR-8732","CLR-1496","CLR-9285","CLR-4017","CLR-7631",
  "CLR-3508","CLR-8924","CLR-2763","CLR-5391","CLR-6847",
  "CLR-4209","CLR-9013","CLR-7582","CLR-3164","CLR-8451",
];

// ── BUILT-IN LANGUAGES ────────────────────────────────────────────────────
const LANGS = {
  en: {
    code:"en", label:"English", flag:"🇬🇧",
    tagline:"Your career story, made clear.",
    subtitle:"Most CVs list duties. Yours will show what changed because of you.",
    desc:"Clairo coaches you through 7 guided steps, auto-fills your data, and generates a clean printable CV at the end.",
    features:["7 guided steps","AI coach","Auto-fills data","Duplicate protection","Print-ready CV"],
    start:"START MY CV", accessTitle:"Enter Your Access Code",
    accessDesc:"You received a unique code in your purchase confirmation. Enter it below to begin.",
    accessPlaceholder:"e.g. CLR-XXXX", accessBtn:"BEGIN MY CV SESSION",
    accessChecking:"CHECKING...",
    accessError:"This code is not valid. Please check your purchase confirmation and try again.",
    accessNoCode:"No code yet? Get access at",
    coaching:"COACHING", cvdata:"DATA", cvpreview:"CV",
    skip:"SKIP", send:"SEND", viewCV:"VIEW MY CV",
    editData:"EDIT DATA", printSave:"PRINT / SAVE PDF",
    viewSample:"VIEW SAMPLE CV", changeLang:"Change language",
    otherLang:"Other language", otherPlaceholder:"Type your language... e.g. Français, 日本語, Português",
    otherContinue:"CONTINUE", otherNote:"The coach will respond fully in your chosen language.",
    stepLabels:{ identity:"Who You Are", experience:"Your Experience", education:"Education", skills:"Your Skills", whyhire:"Why Hire You", contact:"Contact Details", done:"Review & Done" },
    hints:{
      identity:["Tip: Avoid words like 'hardworking'. Give a specific example instead.","Think: When did someone last come to you for help? What kind of help?","Ask yourself: What problem do I naturally notice that others walk past?"],
      experience:["Tip: Think about what changed because of you, not just what you did.","Think: Did you solve a problem, build something, or help someone?","Ask yourself: What would have been worse if I had not been there?"],
      education:["Tip: Mention specific projects or achievements, not just the degree name.","Think: Was there a project you were genuinely proud of?","Ask yourself: What did I learn that I still use today?"],
      skills:["Tip: Name actual tools and software, not just general skills.","Think: What do colleagues ask you for help with most often?","Ask yourself: What took me real time and effort to learn?"],
      whyhire:["Tip: Be bold and specific. This is not the time to be modest.","Think: What pattern runs through all your jobs?","Ask yourself: What would my best manager say about me in 30 seconds?"],
      contact:["Tip: Use a professional email - first name and last name is ideal.","Think: Include your LinkedIn if it is complete and up to date."],
      done:[],
    },
    openers:{
      identity:"Welcome to Clairo. Before we start, what is your name? I want to make this session personal from the very first question.",
      experience:"Good. Now let's talk about your work history. Everything counts: holiday jobs, part-time work, volunteering, internships, babysitting, or any odd jobs. Start with your very first paid or unpaid experience. What was it, and what years did you work there?",
      education:"Let's talk about your education. Start with the highest level you completed. What did you study, where, and when?",
      skills:"Now let's surface your skills. Based on everything you have shared, what do you think you do better than most people around you?",
      whyhire:"Here is the big question. If you had 30 seconds to tell someone why they should hire you over anyone else, what would you say? Be bold. This becomes your Profile Statement, the first thing a hiring manager reads.",
      contact:"Almost there. What is your full name, email address, phone number, and location?",
      done:"You have done it. Your CV is ready. Switch to CV PREVIEW to see your design, or edit anything in CV DATA.",
    },
    cvLabels:{ profile:"Profile", skills:"Skills", education:"Education", experience:"Experience", certifications:"Certifications" },
    done:"%% DONE", testimonialTitle:"What people are saying", sampleCVTitle:"See what your CV could look like",
  },
  nl: {
    code:"nl", label:"Nederlands", flag:"🇳🇱",
    tagline:"Jouw carrièreverhaal, helder gemaakt.",
    subtitle:"De meeste cv's sommen taken op. Het jouwe laat zien wat er door jou veranderde.",
    desc:"Clairo begeleidt je door 7 stappen, vult je gegevens automatisch in en genereert een professioneel cv.",
    features:["7 begeleide stappen","AI coach","Automatisch invullen","Preventie duplicaten","Printklaar cv"],
    start:"MAAK MIJN CV", accessTitle:"Voer je toegangscode in",
    accessDesc:"Je ontving een unieke code in je aankoopbevestiging. Voer deze hieronder in.",
    accessPlaceholder:"bijv. CLR-XXXX", accessBtn:"BEGIN MIJN CV SESSIE",
    accessChecking:"CONTROLEREN...",
    accessError:"Deze code is niet geldig. Controleer je aankoopbevestiging en probeer opnieuw.",
    accessNoCode:"Nog geen code? Koop toegang op",
    coaching:"COACHING", cvdata:"CV GEGEVENS", cvpreview:"CV VOORBEELD",
    skip:"OVERSLAAN", send:"VERSTUUR", viewCV:"BEKIJK MIJN CV",
    editData:"GEGEVENS BEWERKEN", printSave:"AFDRUKKEN / PDF",
    viewSample:"VOORBEELD CV BEKIJKEN", changeLang:"Taal wijzigen",
    otherLang:"Andere taal", otherPlaceholder:"Typ je taal... bijv. Français, 日本語, Português",
    otherContinue:"DOORGAAN", otherNote:"De coach reageert volledig in jouw gekozen taal.",
    stepLabels:{ identity:"Wie Ben Jij", experience:"Jouw Ervaring", education:"Opleiding", skills:"Jouw Vaardigheden", whyhire:"Waarom Jij", contact:"Contactgegevens", done:"Beoordelen & Klaar" },
    hints:{
      identity:["Tip: Vermijd woorden als 'hardwerkend'. Geef een concreet voorbeeld.","Denk: Wanneer vroegen mensen jou het laatste om hulp?","Vraag jezelf: Welk probleem zie ik dat anderen voorbij lopen?"],
      experience:["Tip: Alles telt mee. Vakantiebaantjes, vrijwilligerswerk, stages, bijbaantjes. Noem ze allemaal.","Denk: Wat veranderde er door jouw aanwezigheid op die plek?","Vraag jezelf: Wat zou er slechter zijn gegaan als ik er niet was?"],
      education:["Tip: Noem specifieke projecten of prestaties, niet alleen de naam van je diploma.","Denk: Was er een project waar je echt trots op was?","Vraag jezelf: Wat leerde ik dat ik nu nog steeds gebruik?"],
      skills:["Tip: Noem echte tools en software, niet alleen algemene vaardigheden.","Denk: Waarvoor vragen collega's jou het vaakst om hulp?","Vraag jezelf: Wat heeft mij echt tijd en moeite gekost om te leren?"],
      whyhire:["Tip: Wees gedurfd en specifiek. Dit is niet het moment voor bescheidenheid.","Denk: Welk patroon loopt door al mijn banen heen?","Vraag jezelf: Wat zou mijn beste manager over mij zeggen in 30 seconden?"],
      contact:["Tip: Gebruik een professioneel e-mailadres - voornaam en achternaam is ideaal.","Denk: Voeg je LinkedIn toe als het compleet en up-to-date is."],
      done:[],
    },
    openers:{
      identity:"Welkom bij Clairo. Voordat we beginnen, wat is jouw naam? Ik wil deze sessie persoonlijk maken vanaf de allereerste vraag.",
      experience:"Goed. Laten we het nu hebben over jouw werkgeschiedenis. Alles telt mee: vakantiebaantjes, bijbaantjes, vrijwilligerswerk, stages, zelfs oppassen of klusjes. Begin bij je allereerste betaalde of onbetaalde werkervaring. Wat was het, en in welke jaren werkte je daar?",
      education:"Laten we het hebben over jouw opleiding. Begin bij het hoogste niveau dat je hebt afgerond. Wat studeerde je, waar en wanneer?",
      skills:"Laten we nu jouw vaardigheden naar boven halen. Op basis van alles wat je hebt gedeeld, wat denk je dat jij beter doet dan de meeste mensen om je heen?",
      whyhire:"Dit is de grote vraag. Als je 30 seconden had om iemand te vertellen waarom ze jou zouden moeten aannemen boven iedereen, wat zou je zeggen? Wees gedurfd.",
      contact:"Bijna klaar. Wat is jouw volledige naam, e-mailadres, telefoonnummer en locatie?",
      done:"Je hebt het gedaan. Je cv is klaar. Schakel over naar CV VOORBEELD om je ontwerp te zien.",
    },
    cvLabels:{ profile:"Profiel", skills:"Vaardigheden", education:"Opleiding", experience:"Ervaring", certifications:"Certificaten" },
    done:"%% KLAAR", testimonialTitle:"Wat mensen zeggen", sampleCVTitle:"Zo kan jouw cv eruitzien",
  },
  es: {
    code:"es", label:"Español", flag:"🇪🇸",
    tagline:"Tu historia profesional, hecha clara.",
    subtitle:"La mayoría de los CV listan tareas. El tuyo mostrará lo que cambió gracias a ti.",
    desc:"Clairo te guía en 7 pasos, llena tus datos automáticamente y genera un CV profesional listo para imprimir.",
    features:["7 pasos guiados","Coach con IA","Llenado automático","Prevención duplicados","CV listo para imprimir"],
    start:"CREAR MI CV", accessTitle:"Ingresa tu código de acceso",
    accessDesc:"Recibiste un código único en tu confirmación de compra. Ingrésalo abajo para comenzar.",
    accessPlaceholder:"ej. CLR-XXXX", accessBtn:"COMENZAR MI SESIÓN",
    accessChecking:"VERIFICANDO...",
    accessError:"Este código no es válido. Verifica tu confirmación de compra e intenta de nuevo.",
    accessNoCode:"¿Sin código? Obtén acceso en",
    coaching:"COACHING", cvdata:"DATOS", cvpreview:"CV",
    skip:"OMITIR", send:"ENVIAR", viewCV:"VER MI CV",
    editData:"EDITAR DATOS", printSave:"IMPRIMIR / PDF",
    viewSample:"VER CV DE EJEMPLO", changeLang:"Cambiar idioma",
    otherLang:"Otro idioma", otherPlaceholder:"Escribe tu idioma... ej. Français, 日本語, Português",
    otherContinue:"CONTINUAR", otherNote:"El coach responderá completamente en tu idioma elegido.",
    stepLabels:{ identity:"Quién Eres", experience:"Tu Experiencia", education:"Educación", skills:"Tus Habilidades", whyhire:"Por Qué Tú", contact:"Datos de Contacto", done:"Revisar y Listo" },
    hints:{
      identity:["Consejo: Evita palabras como 'trabajador'. Da un ejemplo específico.","Piensa: ¿Cuándo fue la última vez que alguien vino a pedirte ayuda?","Pregúntate: ¿Qué problema noto yo que otros pasan por alto?"],
      experience:["Consejo: Piensa en qué cambió gracias a ti, no solo lo que hiciste.","Piensa: ¿Resolviste un problema, construiste algo o ayudaste a alguien?","Pregúntate: ¿Qué habría sido peor si yo no hubiera estado?"],
      education:["Consejo: Menciona proyectos o logros específicos, no solo el nombre del título.","Piensa: ¿Hubo un proyecto del que te sintieras genuinamente orgulloso?","Pregúntate: ¿Qué aprendí que todavía uso hoy?"],
      skills:["Consejo: Nombra herramientas y software reales, no solo habilidades generales.","Piensa: ¿Para qué te piden ayuda tus colegas con más frecuencia?","Pregúntate: ¿Qué me costó tiempo y esfuerzo aprender?"],
      whyhire:["Consejo: Sé audaz y específico. No es momento de ser modesto.","Piensa: ¿Qué patrón atraviesa todos mis trabajos?","Pregúntate: ¿Qué diría mi mejor jefe sobre mí en 30 segundos?"],
      contact:["Consejo: Usa un correo profesional, nombre y apellido es ideal.","Piensa: Incluye tu LinkedIn si está completo y actualizado."],
      done:[],
    },
    openers:{
      identity:"Bienvenido a Clairo. Antes de comenzar, ¿cuál es tu nombre? Quiero que esta sesión sea personal desde la primera pregunta.",
      experience:"Bien. Ahora hablemos de tu historial laboral. Todo cuenta: trabajos de verano, trabajos a tiempo parcial, voluntariado, prácticas, cuidar niños o cualquier trabajo ocasional. Empieza con tu primera experiencia pagada o no pagada. ¿Cuál fue y en qué años trabajaste allí?",
      education:"Hablemos de tu educación. Empieza por el nivel más alto que completaste. ¿Qué estudiaste, dónde y cuándo?",
      skills:"Ahora vamos a descubrir tus habilidades. Basándote en todo lo que has compartido, ¿qué crees que haces mejor que la mayoría?",
      whyhire:"Esta es la gran pregunta. Si tuvieras 30 segundos para decirle a alguien por qué debería contratarte, ¿qué dirías? Sé audaz.",
      contact:"Casi terminamos. ¿Cuál es tu nombre completo, correo electrónico, teléfono y ubicación?",
      done:"Lo lograste. Tu CV está listo. Cambia a VISTA PREVIA para ver tu diseño.",
    },
    cvLabels:{ profile:"Perfil", skills:"Habilidades", education:"Educación", experience:"Experiencia", certifications:"Certificaciones" },
    done:"%% LISTO", testimonialTitle:"Lo que dicen las personas", sampleCVTitle:"Así podría verse tu CV",
  },
};

const STEPS = ["identity","experience","education","skills","whyhire","contact","done"];

const DUMMY_CV_EN = {
  name:"JORDAN A. REED", title:"Senior Product Manager",
  why_hire_me:"Every product I have shipped started with a question nobody else was asking. At Foresight, that question led to a 34% drop in user drop-off within 90 days. At Loopline, it became the feature cited in 67% of renewal conversations. I move fast, I bring people with me, and I leave things measurably better than I found them.",
  email:"jordan.reed@email.com", phone:"+1 (312) 555 0194", location:"Chicago, IL, United States", website:"linkedin.com/in/jordanreed",
  skills:["Product Strategy","Agile / Scrum","User Research","Roadmap Planning","Stakeholder Management","SQL & Data Analysis","Figma","A/B Testing"],
  experience:[
    {title:"Senior Product Manager",company:"Foresight Health Technologies",years:"2021 - Present",description:"Led the redesign of the core patient onboarding flow which reduced drop-off by 34% and increased activation by 28% within 90 days of launch. Built and managed a cross-functional team of 11."},
    {title:"Product Manager",company:"Loopline Software",years:"2018 - 2021",description:"Owned the B2B analytics dashboard from concept to launch. It became the top-cited feature in 67% of enterprise renewal conversations. Ran 40+ user interviews across three market segments."},
  ],
  education:[
    {degree:"Bachelor of Science in Business Administration",institution:"University of Illinois",years:"2012 - 2016",description:"Concentration in Information Systems. Graduated with honours."},
  ],
};

const DUMMY_CV_NL = {
  name:"SARAH VAN DEN BERG", title:"Projectmanager",
  why_hire_me:"Elk project dat ik heb geleid, heb ik beter achtergelaten dan ik het aantrof. Bij Innovatie BV betekende dat een doorlooptijd die met 40% werd verkort. Bij Consulting Groep Nederland leidde het tot een rapportagesysteem dat het team tot nu toe nog gebruikt. Ik werk gestructureerd, communiceer helder en haal resultaten die zichtbaar zijn.",
  email:"sarah.vandenberg@email.nl", phone:"+31 6 12 34 56 78", location:"Amsterdam, Nederland", website:"linkedin.com/in/sarahvandenberg",
  skills:["Projectmanagement","Stakeholdermanagement","Procesoptimalisatie","Agile / Scrum","Microsoft Office","Communicatie","Probleemoplossend vermogen"],
  experience:[
    {title:"Projectmanager",company:"Innovatie BV",years:"2021 - heden",description:"Leidde de herinrichting van het klantportaal waarbij de doorlooptijd met 40% werd verkort. Beheerde een team van 8 personen en rapporteerde direct aan de directie."},
    {title:"Junior Projectcoordinator",company:"Consulting Groep Nederland",years:"2018 - 2021",description:"Coordineerde 12 gelijktijdige projecten voor klanten in de financiele sector. Introduceerde een nieuw voortgangssysteem dat de rapportagetijd halveerde."},
  ],
  education:[
    {degree:"Bachelor Bedrijfskunde",institution:"Universiteit van Amsterdam",years:"2014 - 2018",description:"Afstudeerrichting Organisatie en Management. Afgestudeerd met onderscheiding."},
  ],
};

const DUMMY_CV_ES = {
  name:"CARLOS MENDOZA", title:"Gerente de Proyectos",
  why_hire_me:"Cada proyecto que he liderado ha terminado mejor de lo que lo encontré. En Tecnologia Futuro, eso significó reducir los tiempos de entrega un 35%. En Soluciones Digitales, la metodología que introduje mejoró la satisfacción del cliente un 28%. Coordino equipos, resuelvo problemas reales y entrego resultados que se pueden medir.",
  email:"carlos.mendoza@email.com", phone:"+34 612 345 678", location:"Madrid, Espana", website:"linkedin.com/in/carlosmendoza",
  skills:["Gestion de Proyectos","Liderazgo de Equipos","Analisis de Datos","Comunicacion","Resolucion de Problemas","Excel Avanzado","Scrum"],
  experience:[
    {title:"Gerente de Proyectos",company:"Tecnologia Futuro S.A.",years:"2021 - Presente",description:"Lideré la implementacion de un nuevo sistema de gestion que redujo los tiempos de entrega en un 35%. Coordine un equipo de 10 personas en tres paises diferentes."},
    {title:"Coordinador de Proyectos",company:"Soluciones Digitales",years:"2018 - 2021",description:"Gestione 15 proyectos simultaneos para clientes del sector bancario. Implementé una metodologia agile que mejoró la satisfaccion del cliente en un 28%."},
  ],
  education:[
    {degree:"Licenciatura en Administracion de Empresas",institution:"Universidad Complutense de Madrid",years:"2014 - 2018",description:"Especializacion en Direccion de Empresas. Graduado con honores."},
  ],
};

const getDummyCV = (lang) => {
  if(lang?.code==="nl") return DUMMY_CV_NL;
  if(lang?.code==="es") return DUMMY_CV_ES;
  return DUMMY_CV_EN;
};

const TESTIMONIALS = [
  {name:"Shauncey A.",role:"Paramaribo, Suriname",text:"Clairo really asked specific answers and gave me thought-provoking questions. It kept asking for examples, which was a big plus. I give it an 8 out of 10.",stars:4},
  {name:"Ilaisha A.",role:"Paramaribo, Suriname",text:"I told Clairo that one of my strengths is being a team player. It asked me to explain by describing an action that would show that. That is exactly the kind of coaching I needed.",stars:4},
];

const getUsageLog = () => { try{return JSON.parse(localStorage.getItem("clairo_usage")||"[]");}catch{return[];} };
const saveUsageLog = (log) => localStorage.setItem("clairo_usage",JSON.stringify(log));
const logCodeUse = (code) => {
  const log=getUsageLog(); const ex=log.find(e=>e.code===code);
  if(ex){ex.uses=(ex.uses||1)+1;ex.lastUsed=new Date().toISOString();}
  else log.push({code,firstUsed:new Date().toISOString(),lastUsed:new Date().toISOString(),uses:1});
  saveUsageLog(log);
};

// ── FLOATING BG ───────────────────────────────────────────────────────────
const FloatingBg = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0}}>
    <div style={{position:"absolute",top:-80,right:-80,width:400,height:400,borderRadius:"50%",border:"1.5px solid rgba(58,81,98,0.08)"}}/>
    <div style={{position:"absolute",bottom:-100,left:-100,width:500,height:500,borderRadius:"50%",border:"1.5px solid rgba(58,81,98,0.06)"}}/>
    <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0.03}} xmlns="http://www.w3.org/2000/svg">
      {[...Array(10)].map((_,i)=><line key={i} x1={i*140-200} y1="0" x2={i*140+200} y2="100%" stroke="#3a5162" strokeWidth="1"/>)}
    </svg>
    <svg style={{position:"absolute",top:60,left:40,opacity:0.07}} width="40" height="40" viewBox="0 0 40 40"><path d="M20,2 L38,20 L20,38 L2,20 Z" fill="none" stroke="#3a5162" strokeWidth="1.5"/></svg>
    <svg style={{position:"absolute",bottom:80,right:60,opacity:0.06}} width="60" height="60" viewBox="0 0 60 60"><path d="M30,3 L57,30 L30,57 L3,30 Z" fill="none" stroke="#3a5162" strokeWidth="1.5"/></svg>
  </div>
);

// ── DIAMOND BANNER ────────────────────────────────────────────────────────
const DiamondBanner = ({height=52}) => {
  const [width,setWidth]=useState(900);
  const ref=useRef();
  useEffect(()=>{ const obs=new ResizeObserver(([e])=>setWidth(e.contentRect.width)); if(ref.current)obs.observe(ref.current); return()=>obs.disconnect(); },[]);
  const oh=height*0.82,mh=oh*0.65,ih=oh*0.30,sx=oh*1.05;
  const pts=[]; for(let x=-oh;x<width+oh;x+=sx)pts.push(x);
  const cy=height/2;
  const dp=(cx,cy,h)=>`M${cx},${cy-h} L${cx+h},${cy} L${cx},${cy+h} L${cx-h},${cy} Z`;
  return(<div ref={ref} style={{width:"100%"}}><svg width={width} height={height} style={{display:"block"}}><rect width={width} height={height} fill={C.primary}/>{pts.map((cx,i)=><g key={i}><path d={dp(cx,cy,oh)} fill={C.light}/><path d={dp(cx,cy,mh)} fill={C.mid}/><path d={dp(cx,cy,ih)} fill={C.primary}/></g>)}</svg></div>);
};

// ── CV DOCUMENT ───────────────────────────────────────────────────────────
const CVDocument = ({cvData,lang}) => {
  const {name,title,why_hire_me,email,phone,location,website,skills,experience,education,certifications}=cvData;
  const L=lang ? lang.cvLabels : {profile:"Profile",skills:"Skills",education:"Education",experience:"Experience"};
  const hasData=name||why_hire_me||experience.length>0;
  if(!hasData) return <div style={{padding:40,textAlign:"center",color:C.muted,fontFamily:"Georgia,serif",fontSize:13,background:C.white,minHeight:"297mm"}}>Complete the coaching conversation first.</div>;
  const SL=({children})=>(<div style={{fontSize:7.5,fontWeight:700,color:C.primary,letterSpacing:3,textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:10,paddingBottom:5,borderBottom:`1px solid ${C.light}`}}>{children}</div>);
  return(
    <div id="cv-print-area" style={{width:"210mm",minHeight:"297mm",background:C.white,fontFamily:"Georgia,serif",color:C.dark,margin:"0 auto",boxSizing:"border-box",position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",top:-30,right:-30,opacity:0.04,pointerEvents:"none"}} width="220" height="220" viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="#3a5162" strokeWidth="1"/><circle cx="110" cy="110" r="75" fill="none" stroke="#3a5162" strokeWidth="1"/><circle cx="110" cy="110" r="50" fill="none" stroke="#3a5162" strokeWidth="1"/></svg>
      <svg style={{position:"absolute",bottom:40,left:-20,opacity:0.03,pointerEvents:"none"}} width="180" height="180" viewBox="0 0 180 180"><path d="M90,5 L175,90 L90,175 L5,90 Z" fill="none" stroke="#3a5162" strokeWidth="1.5"/><path d="M90,30 L150,90 L90,150 L30,90 Z" fill="none" stroke="#3a5162" strokeWidth="1.5"/></svg>
      <div style={{display:"flex",position:"relative"}}>
        <div style={{width:6,background:C.primary,flexShrink:0}}/>
        <div style={{flex:1,padding:"26px 28px 18px 22px",borderBottom:`1px solid ${C.section}`}}>
          <div style={{fontSize:34,fontFamily:"sans-serif",fontWeight:900,color:C.primary,letterSpacing:2,textTransform:"uppercase",lineHeight:1}}>{name||"YOUR NAME"}</div>
          <div style={{fontSize:11,color:C.mid,fontFamily:"sans-serif",letterSpacing:3,marginTop:5,textTransform:"uppercase"}}>{title||"Professional Title"}</div>
          <div style={{display:"flex",gap:16,marginTop:10,flexWrap:"wrap"}}>
            {[email,phone,location,website].filter(Boolean).map((v,i)=>(
              <span key={i} style={{fontSize:9,color:C.muted,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:5}}>
                <span style={{width:4,height:4,background:C.light,borderRadius:"50%",display:"inline-block",flexShrink:0}}/>{v}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"160px 1fr",flex:1,overflow:"hidden"}}>
        <div style={{borderRight:`1px solid ${C.section}`,padding:"16px 14px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:"35%",background:"linear-gradient(to top, rgba(213,221,227,0.15), transparent)",pointerEvents:"none"}}/>
          {why_hire_me&&<div style={{marginBottom:14}}><SL>{L.profile}</SL><div style={{fontSize:8.5,lineHeight:1.65,color:C.dark}}>{why_hire_me}</div></div>}
          {skills.length>0&&<div><SL>{L.skills}</SL>{skills.map((sk,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:3,height:3,background:C.mid,borderRadius:"50%",flexShrink:0}}/><span style={{fontSize:8.5,color:C.dark,fontFamily:"sans-serif"}}>{sk}</span></div>)}</div>}
        </div>
        <div style={{padding:"16px 20px",overflow:"hidden"}}>
          {experience.length>0&&<div style={{marginBottom:12}}><SL>{L.experience}</SL>{experience.map((ex,i)=><div key={i} style={{marginBottom:10,paddingBottom:8,borderBottom:i<experience.length-1?`1px solid rgba(213,221,227,0.6)`:"none",position:"relative"}}><div style={{position:"absolute",left:-20,top:4,width:5,height:5,borderRadius:"50%",background:C.primary,border:`2px solid ${C.white}`,outline:`1px solid ${C.light}`}}/><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{fontSize:10,fontWeight:700,color:C.dark,fontFamily:"sans-serif",lineHeight:1.2}}>{ex.title}</div><div style={{fontSize:7.5,color:C.white,fontFamily:"sans-serif",whiteSpace:"nowrap",marginLeft:8,background:C.primary,padding:"2px 7px",borderRadius:10,flexShrink:0}}>{ex.years}</div></div><div style={{fontSize:8.5,color:C.primary,fontFamily:"sans-serif",marginTop:2,marginBottom:4,fontWeight:600}}>{ex.company}</div><div style={{fontSize:8.5,color:"#333",lineHeight:1.6}}>{ex.description}</div></div>)}</div>}
          {education.length>0&&<div style={{marginBottom:12}}><SL>{L.education}</SL>{education.map((ed,i)=><div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{fontSize:10,fontWeight:700,color:C.dark,fontFamily:"sans-serif",lineHeight:1.2}}>{ed.degree}</div><div style={{fontSize:7.5,color:C.white,fontFamily:"sans-serif",whiteSpace:"nowrap",marginLeft:8,background:C.primary,padding:"2px 7px",borderRadius:10,flexShrink:0}}>{ed.years}</div></div><div style={{fontSize:8.5,color:C.primary,fontFamily:"sans-serif",marginTop:2,fontWeight:600}}>{ed.institution}</div>{ed.description&&<div style={{fontSize:8.5,color:C.muted,lineHeight:1.55,marginTop:2}}>{ed.description}</div>}</div>)}</div>}
          {certifications?.length>0&&<div><SL>{L.certifications||"Certifications"}</SL>{certifications.map((cert,i)=><div key={i} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><div style={{fontSize:10,fontWeight:700,color:C.dark,fontFamily:"sans-serif",lineHeight:1.2}}>{cert.name}</div><div style={{fontSize:7.5,color:C.white,fontFamily:"sans-serif",whiteSpace:"nowrap",marginLeft:8,background:C.primary,padding:"2px 7px",borderRadius:10,flexShrink:0}}>{cert.date}</div></div><div style={{fontSize:8.5,color:C.primary,fontFamily:"sans-serif",marginTop:2,fontWeight:600}}>{cert.organization}</div>{cert.skills&&<div style={{fontSize:8.5,color:C.muted,lineHeight:1.55,marginTop:2}}>{cert.skills}</div>}{cert.url&&<div style={{fontSize:7.5,color:C.primary,fontFamily:"sans-serif",marginTop:2,wordBreak:"break-all"}}>{cert.url}</div>}</div>)}</div>}
        </div>
      </div>
    </div>
  );
};

// ── OPEN SAMPLE CV IN NEW TAB ─────────────────────────────────────────────
const openSampleCV = (lang) => {
  const L = lang ? lang.cvLabels : {profile:"Profile",skills:"Skills",education:"Education",experience:"Experience",certifications:"Certifications"};
  const d = getDummyCV(lang);
  const html = `<!DOCTYPE html><html><head><title>Sample CV - Clairo</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#f4f7f9;display:flex;justify-content:center;padding:40px 20px;font-family:Georgia,serif;}.cv{width:210mm;min-height:297mm;background:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;}.bar{width:6px;background:#3a5162;flex-shrink:0;}.header{display:flex;border-bottom:1px solid #d5dde3;}.hc{flex:1;padding:22px 24px 16px 20px;}.name{font-size:30px;font-family:sans-serif;font-weight:900;color:#3a5162;letter-spacing:2px;text-transform:uppercase;line-height:1;}.title{font-size:10px;color:#7a9bb0;font-family:sans-serif;letter-spacing:3px;margin-top:4px;text-transform:uppercase;}.contact{display:flex;gap:14px;margin-top:8px;flex-wrap:wrap;}.contact span{font-size:8.5px;color:#555;font-family:sans-serif;display:flex;align-items:center;gap:5px;}.cdot{width:3px;height:3px;background:#b8c9d4;border-radius:50%;display:inline-block;flex-shrink:0;}.body{display:grid;grid-template-columns:160px 1fr;flex:1;}.left{border-right:1px solid #d5dde3;padding:16px 14px;}.right{padding:16px 20px;}.sl{font-size:7px;font-weight:700;color:#3a5162;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;margin-bottom:8px;padding-bottom:4px;border-bottom:1px solid #b8c9d4;}.skill{display:flex;align-items:center;gap:6px;margin-bottom:4px;}.sdot{width:3px;height:3px;background:#7a9bb0;border-radius:50%;flex-shrink:0;}.st{font-size:8.5px;color:#1a1a1a;font-family:sans-serif;}.pt{font-size:8.5px;line-height:1.65;color:#1a1a1a;margin-bottom:14px;}.exp{margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(213,221,227,0.6);position:relative;}.exp:last-child{border-bottom:none;}.edot{position:absolute;left:-20px;top:4px;width:5px;height:5px;border-radius:50%;background:#3a5162;border:2px solid #fff;outline:1px solid #b8c9d4;}.eh{display:flex;justify-content:space-between;align-items:flex-start;}.et{font-size:10px;font-weight:700;color:#1a1a1a;font-family:sans-serif;line-height:1.2;}.ey2{font-size:7.5px;color:#fff;font-family:sans-serif;white-space:nowrap;margin-left:8px;background:#3a5162;padding:2px 7px;border-radius:10px;flex-shrink:0;}.ec{font-size:8.5px;color:#3a5162;font-family:sans-serif;margin-top:2px;margin-bottom:4px;font-weight:600;}.ed2{font-size:8.5px;color:#333;line-height:1.6;}.edu{margin-bottom:8px;}.ed{font-size:10px;font-weight:700;color:#1a1a1a;font-family:sans-serif;line-height:1.2;}.ei{font-size:8.5px;color:#3a5162;font-family:sans-serif;margin-top:2px;font-weight:600;}.ey{font-size:7.5px;color:#fff;font-family:sans-serif;white-space:nowrap;margin-left:8px;background:#3a5162;padding:2px 7px;border-radius:10px;}.edesc{font-size:8.5px;color:#555;line-height:1.55;margin-top:2px;}.sec{margin-bottom:12px;}@media print{body{padding:0;}@page{margin:0;size:A4;}}</style></head><body><div class="cv"><div class="header"><div class="bar"></div><div class="hc"><div class="name">${d.name}</div><div class="title">${d.title}</div><div class="contact"><span><span class="cdot"></span>${d.email}</span><span><span class="cdot"></span>${d.phone}</span><span><span class="cdot"></span>${d.location}</span>${d.website?`<span><span class="cdot"></span>${d.website}</span>`:""}</div></div></div><div class="body"><div class="left"><div class="sec"><div class="sl">${L.profile}</div><div class="pt">${d.why_hire_me}</div></div><div class="sec"><div class="sl">${L.skills}</div>${d.skills.map(sk=>`<div class="skill"><span class="sdot"></span><span class="st">${sk}</span></div>`).join("")}</div></div><div class="right"><div class="sec"><div class="sl">${L.experience}</div>${d.experience.map(ex=>`<div class="exp"><div class="edot"></div><div class="eh"><div class="et">${ex.title}</div><div class="ey2">${ex.years}</div></div><div class="ec">${ex.company}</div><div class="ed2">${ex.description}</div></div>`).join("")}</div><div class="sec"><div class="sl">${L.education}</div>${d.education.map(ed=>`<div class="edu"><div class="eh"><div class="ed">${ed.degree}</div><div class="ey">${ed.years}</div></div><div class="ei">${ed.institution}</div>${ed.description?`<div class="edesc">${ed.description}</div>`:""}</div>`).join("")}</div></div></div></div></body></html>`;
  const w=window.open("","_blank"); w.document.write(html); w.document.close();
};

// ── DUPLICATE MODAL ───────────────────────────────────────────────────────
const DuplicateModal = ({pending,onConfirm,onMerge,onSkip}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
    <div style={{background:C.white,borderRadius:10,padding:26,maxWidth:380,width:"90%"}}>
      <div style={{fontSize:11,fontWeight:700,color:C.primary,fontFamily:"sans-serif",letterSpacing:1,marginBottom:8}}>DUPLICATE DETECTED</div>
      <div style={{fontSize:13,color:C.dark,fontFamily:"Georgia,serif",lineHeight:1.65,marginBottom:18}}>
        New entry for <strong>{pending.type==="exp"?pending.data.title+" at "+pending.data.company:pending.data.degree}</strong> looks similar to something already saved. What would you like to do?
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        <button onClick={onMerge} style={{padding:"9px",background:C.primary,color:C.white,border:"none",borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"sans-serif",letterSpacing:1}}>UPDATE EXISTING ENTRY</button>
        <button onClick={onConfirm} style={{padding:"9px",background:"transparent",color:C.primary,border:`1px solid ${C.primary}`,borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"sans-serif",letterSpacing:1}}>ADD AS NEW ENTRY</button>
        <button onClick={onSkip} style={{padding:"9px",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,cursor:"pointer",fontFamily:"sans-serif",letterSpacing:1}}>SKIP</button>
      </div>
    </div>
  </div>
);

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────
const buildPrompt = (langLabel,step,stepLabels,cvData) => {
  const idx=STEPS.indexOf(step);
  const nextLabel=stepLabels[STEPS[idx+1]]||"done";
  const hasName = cvData.name && cvData.name.trim().length > 0;
  return `You are Clairo, a world-class CV coach and talent specialist. Respond ONLY in ${langLabel}. Every single word must be in ${langLabel}. Never switch languages mid-response.

CORE IDENTITY: You are a talent specialist who sees potential others miss. Dig deep. Find the gem. You are NOT an HR manager.

${!hasName ? `NAME AND CONSENT FIRST: The user has not given their name yet. When they give their name, warmly greet them by name, then immediately ask for privacy consent in ${langLabel}: explain that during this session you will ask for personal information like name, email and phone number to build their CV, that this information is only used to create their CV and is not shared with anyone, and ask if they are comfortable with that. Wait for their confirmation before continuing with coaching.` : `PERSONALIZATION: The user's name is ${cvData.name}. Use their name naturally and occasionally in the conversation to keep it personal.`}

LANGUAGE CALIBRATION: Adapt your tone to how the person writes. Short casual? Match that. Formal and detailed? Go deeper with them. Nervous? Be extra warm.

EVIDENCE WEIGHTING:
- Tier 1 (Claimed): "I am good at X" - NOT enough. Push deeper.
- Tier 2 (Demonstrated): Specific example - ask for outcome.
- Tier 3 (Quantified): Numbers or results - strong, use this.
- Tier 4 (Verified impact): What changed because of them - excellent.
- Tier 5 (Systemic impact): Changed how a whole team or system works - this is gold.
Never accept Tier 1 or 2 as final. Always push toward Tier 3, 4 or 5.

EFFICIENCY - be direct and concrete:
- Do NOT ask unnecessary warm-up questions. Get to the point.
- Do NOT ask multiple questions at once.
- Each step should take maximum 4 to 6 exchanges. Move forward when you have enough.
- If the user gives a Tier 3 or higher answer, accept it and move on. Do not over-probe.

ANTI-OVERSELLING: If someone claims something extraordinary, gently verify it without accusing them.

QUESTIONING LAYERS - move through these naturally:
1. What did you do?
2. What was the situation before you acted?
3. What exactly did you do differently?
4. What changed because of you? Any numbers?
5. Would this have happened without you?

STYLE MIRRORING: The CV output should sound like THEM, just cleaner. Never use em dashes.

RULES:
- NEVER use em dashes (--) or (—). Use commas or hyphens instead.
- NEVER write about the user in third person. Always "you" and "your".
- ONE question at a time. Never overwhelm.
- 2-3 sentences then ONE question. Keep it tight and efficient.
- When step is done, output STEP_COMPLETE on its own line then a bridge sentence IN ${langLabel}.

CRITICAL - IDENTITY: ONLY a CV coach. Never roleplay or generate fictional content.
CRITICAL - NO BOXES: Do NOT assume analytical skills. Every person is different.
CRITICAL - PROFILE LENGTH: Maximum 4 sentences. Powerful and specific to this person.
CRITICAL - TITLE: NEVER fill in the title field. Always null.

Current step: ${stepLabels[step]}. Next: ${nextLabel}.
CV data so far: ${JSON.stringify(cvData)}.

After EVERY response, final line only:
EXTRACT:{"name":null,"title":null,"why_hire_me":null,"email":null,"phone":null,"location":null,"website":null,"new_skill":null,"new_exp":null,"new_edu":null}
new_exp: {"title":"","company":"","years":"","description":""}
new_edu: {"degree":"","institution":"","years":"","description":""}
new_skill: single string only`;
};

const extractJSON=(t)=>{const m=t.match(/EXTRACT:(\{[^\n]+\})/);if(!m)return null;try{return JSON.parse(m[1]);}catch{return null;}};
const cleanText=(t)=>t.replace(/EXTRACT:\{[^\n]+\}/g,"").replace(/STEP_COMPLETE\s*/g,"").trim();
const hasComplete=(t)=>t.includes("STEP_COMPLETE");
const isSimilarExp=(a,b)=>{const n=s=>(s||"").toLowerCase().trim();return n(a.title)===n(b.title)||n(a.company)===n(b.company);};
const isSimilarEdu=(a,b)=>{const n=s=>(s||"").toLowerCase().trim();return n(a.degree)===n(b.degree)||n(a.institution)===n(b.institution);};

const iSt={width:"100%",padding:"7px 9px",border:`1px solid ${C.border}`,borderRadius:5,fontFamily:"Georgia,serif",fontSize:12.5,color:C.dark,background:C.white,boxSizing:"border-box",marginTop:3};
const lSt={fontSize:9,fontWeight:700,color:C.primary,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginTop:10};

const Stars=({n})=><span style={{color:"#f0a500",fontSize:13}}>{"★".repeat(n)}</span>;

// ── LANGUAGE PICKER SCREEN ────────────────────────────────────────────────
const LangPicker = ({onSelect}) => {
  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f4f7f9,#e8eef3)",display:"flex",flexDirection:"column",position:"relative"}}>
      <FloatingBg/>
      <div style={{background:C.primary,padding:"14px 28px",position:"relative",zIndex:1}}>
        <img src="/clairo-logo.svg" alt="clairo" style={{height:20,objectFit:"contain"}}/>
        <div style={{color:C.light,fontSize:8,letterSpacing:3,marginTop:1}}>YOUR CAREER STORY, MADE CLEAR</div>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:1}}>
        <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:22,fontFamily:"Georgia,serif",color:C.primary,fontWeight:700,marginBottom:8}}>Welcome to Clairo</div>
          <div style={{fontSize:14,color:C.muted,fontFamily:"Georgia,serif",lineHeight:1.7,marginBottom:28}}>In which language would you like to be coached today?</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"0 auto"}}>
            {Object.values(LANGS).map(l=>(
              <button key={l.code} onClick={()=>onSelect(l)}
                style={{padding:"13px 20px",background:"rgba(255,255,255,0.9)",border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:15,cursor:"pointer",fontFamily:"Georgia,serif",color:C.primary,display:"flex",alignItems:"center",gap:14,transition:"border-color 0.2s"}}>
                <span style={{fontSize:22}}>{l.flag}</span><span style={{fontWeight:700}}>{l.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`* { box-sizing:border-box; } button:hover { border-color: #3a5162 !important; }`}</style>
    </div>
  );
};

// ── ACCESS GATE INNER ─────────────────────────────────────────────────────
function AccessGateInner({lang,onSuccess}){
  const [code,setCode]=useState("");
  const [error,setError]=useState("");
  const [checking,setChecking]=useState(false);
  const placeholder = lang.accessPlaceholder || "e.g. CLR-XXXX";
  const handleSubmit=()=>{
    const trimmed=code.trim().toUpperCase();setChecking(true);
    setTimeout(()=>{
      if(VALID_CODES.includes(trimmed)){logCodeUse(trimmed);onSuccess(trimmed);}
      else{setError(lang.accessError||"Invalid code.");setChecking(false);}
    },700);
  };
  return(
    <>
      <input value={code} onChange={e=>{setCode(e.target.value.toUpperCase());setError("");}} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}
        placeholder={placeholder}
        style={{width:"100%",padding:"12px 14px",border:`1.5px solid ${error?"#e24b4a":C.border}`,borderRadius:8,fontSize:16,fontFamily:"Georgia,serif",color:C.dark,outline:"none",boxSizing:"border-box",letterSpacing:3,textAlign:"center",background:C.white}}/>
      {error&&<div style={{fontSize:11,color:"#e24b4a",marginTop:8,fontFamily:"sans-serif",lineHeight:1.5}}>{error}</div>}
      <button onClick={handleSubmit} disabled={!code.trim()||checking}
        style={{width:"100%",marginTop:14,padding:"13px 0",background:C.primary,color:C.accent,border:"none",borderRadius:8,fontSize:11,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif",fontWeight:700,opacity:!code.trim()||checking?0.5:1}}>
        {checking?(lang.accessChecking||"CHECKING..."):(lang.accessBtn||"BEGIN MY CV SESSION")}
      </button>
      <div style={{marginTop:18,padding:"12px 14px",background:"rgba(213,221,227,0.5)",borderRadius:8,fontSize:11,color:C.muted,fontFamily:"sans-serif",lineHeight:1.6,textAlign:"center"}}>
        {lang.accessNoCode||"No code yet? Get access at"}<br/><a href="https://getclairo.gumroad.com/l/clairo" target="_blank" rel="noreferrer" style={{color:C.primary,fontWeight:700,textDecoration:"none"}}>getclairo.gumroad.com/l/clairo</a>
      </div>
    </>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────
const STORAGE_KEY = "clairo_session";

const loadSession = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
};

const saveSession = (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const clearSession = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};

export default function App() {
  const saved = loadSession();
  const [selectedLang, setSelectedLang] = useState(()=>{
    if(saved?.langCode && LANGS[saved.langCode]) return LANGS[saved.langCode];
    return null;
  });
  const [accessCode, setAccessCode] = useState(()=>localStorage.getItem("clairo_access_code")||"");
  const [screen, setScreen] = useState(()=>saved?.screen||"welcome");
  const [step, setStep] = useState(()=>saved?.step||"identity");
  const [messages, setMessages] = useState(()=>saved?.messages||[]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState(()=>saved?.panel||"chat");
  const [pendingDuplicate, setPendingDuplicate] = useState(null);
  const [cvData, setCvData] = useState(()=>saved?.cvData||{name:"",title:"",why_hire_me:"",email:"",phone:"",location:"",website:"",skills:[],experience:[],education:[],certifications:[]});
  const messagesEnd = useRef(null);
  const stepRef = useRef(step);

  useEffect(()=>{stepRef.current=step;},[step]);
  useEffect(()=>{messagesEnd.current?.scrollIntoView({behavior:"smooth"});},[messages]);

  // Auto-save session whenever anything important changes
  useEffect(()=>{
    if(!selectedLang||!accessCode) return;
    saveSession({
      langCode: selectedLang.code,
      screen, step, messages, panel, cvData,
    });
  },[selectedLang, screen, step, messages, panel, cvData, accessCode]);

  // Step 1: Language picker
  if(!selectedLang) return <LangPicker onSelect={(l)=>setSelectedLang(l)} />;

  // Build effective lang object
  const lang = LANGS[selectedLang.code] || LANGS.en;
  const coachLang = selectedLang.label;
  const getOpener = (step) => lang.openers?.[step] || LANGS.en.openers[step];

  // Step 2: Access gate
  if(!accessCode) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f4f7f9,#e8eef3)",display:"flex",flexDirection:"column",position:"relative"}}>
      <FloatingBg/>
      <div style={{background:C.primary,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
        <div>
          <img src="/clairo-logo.svg" alt="clairo" style={{height:16,objectFit:"contain"}}/>
          <div style={{color:C.light,fontSize:8,letterSpacing:3}}>YOUR CAREER STORY, MADE CLEAR</div>
        </div>
        <button onClick={()=>setSelectedLang(null)} style={{background:"transparent",border:`1px solid ${C.mid}`,borderRadius:4,color:C.light,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"sans-serif"}}>
          {selectedLang.flag} {lang.changeLang||"Change language"}
        </button>
      </div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:24,position:"relative",zIndex:1}}>
        <div style={{maxWidth:420,width:"100%",background:"rgba(255,255,255,0.92)",borderRadius:12,padding:32,border:`1px solid rgba(184,201,212,0.4)`}}>
          <div style={{width:44,height:44,background:C.primary,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <div style={{fontSize:20,fontFamily:"Georgia,serif",color:C.primary,fontWeight:700,marginBottom:8}}>{lang.accessTitle||"Enter Your Access Code"}</div>
          <div style={{fontSize:13,color:C.muted,fontFamily:"Georgia,serif",lineHeight:1.7,marginBottom:22}}>{lang.accessDesc||"You received a unique code in your purchase confirmation."}</div>
          <AccessGateInner lang={lang} onSuccess={code=>{localStorage.setItem("clairo_access_code",code);setAccessCode(code);}}/>
        </div>
      </div>
      <style>{`* { box-sizing:border-box; }`}</style>
    </div>
  );

  const applyExtract=(ex)=>{
    if(!ex)return;
    setCvData(prev=>{
      const next={...prev};
      if(ex.name)next.name=ex.name; if(ex.title)next.title=ex.title; if(ex.why_hire_me)next.why_hire_me=ex.why_hire_me;
      if(ex.email)next.email=ex.email; if(ex.phone)next.phone=ex.phone; if(ex.location)next.location=ex.location; if(ex.website)next.website=ex.website;
      if(ex.new_skill?.trim())next.skills=[...new Set([...prev.skills,ex.new_skill.trim()])];
      return next;
    });
    if(ex.new_exp?.title)setCvData(prev=>{const di=prev.experience.findIndex(e=>isSimilarExp(e,ex.new_exp));if(di>=0){setPendingDuplicate({type:"exp",data:ex.new_exp,dupIdx:di});return prev;}return{...prev,experience:[...prev.experience,ex.new_exp]};});
    if(ex.new_edu?.degree)setCvData(prev=>{const di=prev.education.findIndex(e=>isSimilarEdu(e,ex.new_edu));if(di>=0){setPendingDuplicate({type:"edu",data:ex.new_edu,dupIdx:di});return prev;}return{...prev,education:[...prev.education,ex.new_edu]};});
  };

  const advanceStep=(current)=>{
    const idx=STEPS.indexOf(current); if(idx>=STEPS.length-1)return;
    const next=STEPS[idx+1]; setStep(next); stepRef.current=next;
    if(next==="done")setTimeout(()=>setPanel("preview"),500);
  };

  const sendMessage=async()=>{
    const text=input.trim(); if(!text||loading)return;
    const userMsg={role:"user",content:text};
    setMessages(prev=>{const msgs=[...prev,userMsg];runAPI(msgs);return msgs;});
    setInput("");
  };

  const runAPI=async(msgs)=>{
    setLoading(true);
    const cur=stepRef.current;
    try{
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json","anthropic-version":"2023-06-01"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:buildPrompt(coachLang,cur,lang.stepLabels||LANGS.en.stepLabels,cvData),
          messages:msgs.map(m=>({role:m.role,content:m.content}))}),
      });
      const data=await res.json();
      const raw=data.content?.find(b=>b.type==="text")?.text||"";
      applyExtract(extractJSON(raw));
      const clean=cleanText(raw); const complete=hasComplete(raw);
      setMessages(prev=>[...prev,{role:"assistant",content:clean}]);
      if(complete){
        advanceStep(cur);
        const ni=STEPS.indexOf(cur)+1;
        if(ni<STEPS.length&&STEPS[ni]!=="done"){
          setTimeout(()=>setMessages(prev=>[...prev,{role:"assistant",content:getOpener(STEPS[ni])}]),500);
        }
      }
    }catch{
      setMessages(prev=>[...prev,{role:"assistant",content:"De coach heeft even een pauze nodig. Probeer het over een minuut opnieuw. Als het probleem aanhoudt, is er mogelijk een storing bij onze dienstverlener."}]);
    }
    setLoading(false);
  };

  const manualSkip=()=>{
    const idx=STEPS.indexOf(step); if(idx>=STEPS.length-1)return;
    const next=STEPS[idx+1]; setStep(next); stepRef.current=next;
    if(next==="done")setPanel("preview");
    else setMessages(prev=>[...prev,{role:"assistant",content:getOpener(next)}]);
  };

  const handleKey=(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}};

  const printCV=()=>{
    const area=document.getElementById("cv-print-area"); if(!area)return;
    const w=window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>CV - ${cvData.name}</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{margin:0;background:white;}@media print{body{margin:0;}@page{margin:0;size:A4;}}</style></head><body>${area.outerHTML}</body></html>`);
    w.document.close(); setTimeout(()=>{w.focus();w.print();},400);
  };

  const stepIdx=STEPS.indexOf(step);
  const progress=Math.round(((stepIdx+1)/STEPS.length)*100);
  const stepLabels=lang.stepLabels||LANGS.en.stepLabels;
  const hints=lang.hints||LANGS.en.hints;

  // WELCOME SCREEN
  if(screen==="welcome") return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#f4f7f9,#e8eef3)",display:"flex",flexDirection:"column",position:"relative"}}>
      <FloatingBg/>
      <div style={{background:C.primary,padding:"12px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"relative",zIndex:1}}>
        <div>
          <img src="/clairo-logo.svg" alt="clairo" style={{height:16,objectFit:"contain"}}/>
          <div style={{color:C.light,fontSize:8,letterSpacing:3}}>YOUR CAREER STORY, MADE CLEAR</div>
        </div>
        <button onClick={()=>setSelectedLang(null)} style={{background:"transparent",border:`1px solid ${C.mid}`,borderRadius:4,color:C.light,fontSize:10,cursor:"pointer",padding:"4px 10px",fontFamily:"sans-serif"}}>
          {selectedLang.flag} {lang.changeLang||"Change language"}
        </button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 16px",position:"relative",zIndex:1}}>
        <div style={{maxWidth:560,width:"100%",textAlign:"center"}}>
          <div style={{fontSize:30,fontFamily:"Georgia,serif",color:C.primary,fontWeight:700,lineHeight:1.3,marginBottom:14}}>{lang.tagline}</div>
          <div style={{fontSize:15,color:C.dark,lineHeight:1.8,marginBottom:10,fontFamily:"Georgia,serif"}}>{lang.subtitle}</div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.75,marginBottom:24,fontFamily:"Georgia,serif"}}>{lang.desc}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:28,flexWrap:"wrap"}}>
            {lang.features.map(f=><div key={f} style={{background:"rgba(255,255,255,0.7)",borderRadius:20,padding:"6px 14px",fontSize:10,color:C.primary,fontWeight:700,fontFamily:"sans-serif",border:`1px solid rgba(184,201,212,0.5)`}}>{f}</div>)}
          </div>
          <button onClick={()=>{setScreen("app");if(messages.length===0)setMessages([{role:"assistant",content:getOpener("identity")}]);}}
            style={{background:C.primary,color:C.accent,border:"none",padding:"14px 48px",borderRadius:8,fontSize:11,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif",fontWeight:700}}>
            {lang.start}
          </button>
          {(step==="done" || localStorage.getItem("clairo_step")==="done") && (
            <div style={{marginTop:12,fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>
              Previous session complete.{" "}
              <span style={{cursor:"pointer",textDecoration:"underline",color:C.primary}} onClick={()=>{clearSession();localStorage.removeItem("clairo_step");localStorage.removeItem("clairo_msgs");localStorage.removeItem("clairo_cv");localStorage.removeItem("clairo_screen");setStep("identity");stepRef.current="identity";setMessages([]);setPanel("chat");setCvData({name:"",title:"",why_hire_me:"",email:"",phone:"",location:"",website:"",skills:[],experience:[],education:[],certifications:[]});}}>
                Start a new CV
              </span>
            </div>
          )}
          <div style={{marginTop:8,fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>
            {selectedLang.flag} {selectedLang.label} &nbsp;|&nbsp;
            <span style={{cursor:"pointer",color:C.primary,textDecoration:"underline"}} onClick={()=>setSelectedLang(null)}>{lang.changeLang||"Change language"}</span>
          </div>
        </div>
        <div style={{maxWidth:600,width:"100%",marginTop:40,textAlign:"center"}}>
          <div style={{fontSize:16,fontFamily:"Georgia,serif",color:C.primary,fontWeight:700,marginBottom:12}}>{lang.sampleCVTitle}</div>
          <button onClick={()=>openSampleCV(lang)}
            style={{background:"transparent",border:`1.5px solid ${C.primary}`,borderRadius:6,color:C.primary,fontSize:10,cursor:"pointer",padding:"8px 20px",fontFamily:"sans-serif",letterSpacing:1,fontWeight:700}}>
            {lang.viewSample} ↗
          </button>
          <div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif",marginTop:5}}>Opens in a new tab</div>
        </div>
        <div style={{maxWidth:700,width:"100%",marginTop:36}}>
          <div style={{textAlign:"center",marginBottom:16}}>
            <div style={{fontSize:16,fontFamily:"Georgia,serif",color:C.primary,fontWeight:700}}>{lang.testimonialTitle}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:14}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.85)",borderRadius:10,padding:"16px 18px",border:`1px solid rgba(184,201,212,0.4)`}}>
                <Stars n={t.stars}/>
                <div style={{fontSize:12.5,fontFamily:"Georgia,serif",color:C.dark,lineHeight:1.7,margin:"8px 0 12px",fontStyle:"italic"}}>"{t.text}"</div>
                <div style={{fontSize:10,fontWeight:700,color:C.primary,fontFamily:"sans-serif"}}>{t.name}</div>
                <div style={{fontSize:9.5,color:C.muted,fontFamily:"sans-serif"}}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`* { box-sizing:border-box; }`}</style>
    </div>
  );

  // COACHING APP
  return(
    <div style={{height:"100dvh",background:"#f4f7f9",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {pendingDuplicate&&(
        <DuplicateModal pending={pendingDuplicate}
          onConfirm={()=>{setCvData(prev=>{const f=pendingDuplicate.type==="exp"?"experience":"education";return{...prev,[f]:[...prev[f],pendingDuplicate.data]};});setPendingDuplicate(null);}}
          onMerge={()=>{setCvData(prev=>{const f=pendingDuplicate.type==="exp"?"experience":"education";const arr=[...prev[f]];const ex=arr[pendingDuplicate.dupIdx];const inc=pendingDuplicate.data;arr[pendingDuplicate.dupIdx]={...ex,description:inc.description&&inc.description.length>(ex.description||"").length?inc.description:ex.description,years:inc.years||ex.years};return{...prev,[f]:arr};});setPendingDuplicate(null);}}
          onSkip={()=>setPendingDuplicate(null)}
        />
      )}
      <div style={{background:C.primary,flexShrink:0,position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",overflow:"hidden"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            <img src="/clairo-logo.svg" alt="clairo" onClick={()=>setScreen("welcome")} style={{height:16,objectFit:"contain",cursor:"pointer"}}/>
            <button onClick={()=>setSelectedLang(null)} style={{background:"transparent",border:`1px solid ${C.mid}`,borderRadius:4,color:C.light,fontSize:11,cursor:"pointer",padding:"1px 4px",flexShrink:0}}>{selectedLang.flag}</button>
          </div>
          <div style={{display:"flex",gap:3,alignItems:"center",flexShrink:0}}>
            {[["chat",lang.coaching||"COACHING"],["data",lang.cvdata||"GEGEVENS"],["preview",lang.cvpreview||"VOORBEELD"]].map(([p,l])=>(
              <button key={p} onClick={()=>setPanel(p)} style={{padding:"3px 7px",border:`1px solid ${panel===p?C.white:C.mid}`,borderRadius:4,background:panel===p?C.white:"transparent",color:panel===p?C.primary:C.light,fontSize:7.5,cursor:"pointer",fontFamily:"sans-serif",whiteSpace:"nowrap",flexShrink:0}}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{height:2,background:"rgba(255,255,255,0.1)"}}>
          <div style={{width:`${progress}%`,height:"100%",background:C.light,transition:"width 0.5s"}}/>
        </div>
        <div style={{padding:"2px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:8,color:C.mid,fontFamily:"sans-serif"}}>
            STAP {stepIdx+1}/{STEPS.length}: {stepLabels[step].toUpperCase()}
          </div>
          {step!=="done"&&<button onClick={manualSkip} style={{background:"transparent",border:`1px solid ${C.mid}`,borderRadius:3,color:C.light,fontSize:8,cursor:"pointer",padding:"1px 8px",fontFamily:"sans-serif"}}>{lang.skip||"OVERSLAAN"}</button>}
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        <div className="clairo-sidebar" style={{width:110,minWidth:90,background:C.primary,flexShrink:0,padding:"12px 0",overflowY:"auto"}}>
          {STEPS.map((s,i)=>(
            <div key={s} onClick={()=>{if(i<=stepIdx){setStep(s);stepRef.current=s;setPanel("chat");}}} style={{padding:"7px 8px",cursor:i<=stepIdx?"pointer":"default",borderLeft:step===s?`3px solid ${C.light}`:"3px solid transparent",background:step===s?"rgba(255,255,255,0.1)":"transparent",color:i<=stepIdx?C.accent:"rgba(181,201,212,0.3)",fontSize:8,letterSpacing:0.5,fontFamily:"sans-serif",fontWeight:step===s?700:400,transition:"all 0.3s",lineHeight:1.3}}>
              {i<stepIdx&&<span style={{marginRight:3,fontSize:7}}>✓</span>}
              {stepLabels[s].toUpperCase()}
            </div>
          ))}
          <div style={{margin:"12px 8px 0",height:3,background:"rgba(255,255,255,0.1)",borderRadius:2}}>
            <div style={{width:`${progress}%`,height:"100%",background:C.light,borderRadius:2,transition:"width 0.5s"}}/>
          </div>
          <div style={{color:C.mid,fontSize:8,padding:"4px 8px",letterSpacing:0.5}}>{(lang.done||"%% DONE").replace("%%",progress)}</div>
        </div>

        <div style={{flex:1,overflow:"hidden",minWidth:0,display:"flex",flexDirection:"column"}}>
          {panel==="chat"&&(
            <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
              {hints[step]?.length>0&&(
                <div style={{background:"rgba(58,81,98,0.05)",border:`1px dashed ${C.light}`,borderRadius:4,padding:"7px 11px",margin:"8px 10px 0",display:"flex",alignItems:"flex-start",gap:7,flexShrink:0}}>
                  <span style={{fontSize:12,flexShrink:0}}>💡</span>
                  <span style={{fontSize:11,color:C.primary,fontFamily:"Georgia,serif",lineHeight:1.55,fontStyle:"italic"}}>
                    {hints[step][Math.floor(Date.now()/30000)%hints[step].length]}
                  </span>
                </div>
              )}
              <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:9,padding:"8px 10px",paddingBottom:4}}>
                {messages.filter(m=>m.step===step||m.step===undefined).map((m,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",alignItems:"flex-start"}}>
                    {m.role==="assistant"&&<div style={{width:20,height:20,borderRadius:"50%",background:C.primary,display:"flex",alignItems:"center",justifyContent:"center",marginRight:6,flexShrink:0,marginTop:2,overflow:"hidden"}}><img src="/clairo-icon.svg" alt="c" style={{width:14,height:14}}/></div>}
                    <div style={{maxWidth:"85%",padding:"9px 13px",borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px",background:m.role==="user"?C.primary:C.white,color:m.role==="user"?C.accent:C.dark,fontSize:13,lineHeight:1.65,border:m.role==="assistant"?`1px solid ${C.border}`:"none",fontFamily:"Georgia,serif"}}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading&&<div style={{display:"flex",alignItems:"center",gap:5,paddingLeft:30}}>{[0,1,2].map(d=><div key={d} style={{width:6,height:6,borderRadius:"50%",background:C.mid,animation:"pulse 1.2s ease-in-out infinite",animationDelay:`${d*0.2}s`}}/>)}</div>}
                <div ref={messagesEnd}/>
              </div>
              {step!=="done"?(
                <div style={{display:"flex",gap:7,padding:"8px 10px",borderTop:`1px solid ${C.border}`,background:"#f4f7f9",flexShrink:0}}>
                  <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} rows={2}
                    style={{flex:1,padding:"9px 11px",border:`1px solid ${C.border}`,borderRadius:6,resize:"none",fontFamily:"Georgia,serif",fontSize:16,color:"#1a1a1a",outline:"none",background:"#ffffff"}}/>
                  <button onClick={sendMessage} disabled={loading||!input.trim()} style={{padding:"0 15px",background:C.primary,color:C.accent,border:"none",borderRadius:6,cursor:"pointer",fontSize:10,fontFamily:"sans-serif",letterSpacing:1,opacity:loading||!input.trim()?0.5:1,flexShrink:0}}>{lang.send||"VERSTUUR"}</button>
                </div>
              ):(
                <div style={{padding:"8px 10px",borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:8,flexShrink:0}}>
                  <button onClick={()=>setPanel("preview")} style={{width:"100%",padding:"11px 0",background:C.primary,color:C.accent,border:"none",borderRadius:6,fontSize:11,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif"}}>{lang.viewCV||"BEKIJK MIJN CV"}</button>
                  <a href="https://forms.gle/t11iHnJniUacpzmb9" target="_blank" rel="noreferrer" style={{display:"block",width:"100%",padding:"10px 0",background:"transparent",color:C.primary,border:`1px solid ${C.light}`,borderRadius:6,fontSize:11,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif",textAlign:"center",textDecoration:"none",boxSizing:"border-box"}}>
                    {lang.code==="nl"?"GEEF FEEDBACK (2 MIN)":lang.code==="es"?"DAR FEEDBACK (2 MIN)":"GIVE FEEDBACK (2 MIN)"}
                  </a>
                  <button onClick={()=>{clearSession();setStep("identity");stepRef.current="identity";setMessages([]);setPanel("chat");setCvData({name:"",title:"",why_hire_me:"",email:"",phone:"",location:"",website:"",skills:[],experience:[],education:[],certifications:[]});setMessages([{role:"assistant",content:getOpener("identity")}]);}} style={{width:"100%",padding:"10px 0",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:6,fontSize:11,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif"}}>NIEUW CV STARTEN</button>
                </div>
              )}
            </div>
          )}

          {panel==="data"&&(
            <div style={{overflowY:"auto",maxHeight:"calc(100dvh - 145px)"}}>
              {[["PROFILE",[["name","Full Name"],["title","Professional Title"],["why_hire_me","Profile Statement","ta4"]]],
                ["CONTACT",[["email","Email"],["phone","Phone"],["location","Location"],["website","Website / LinkedIn"]]]
              ].map(([heading,fields])=>(
                <div key={heading} style={{marginBottom:11}}>
                  <div style={{background:C.primary,color:C.accent,padding:"6px 13px",fontSize:9,letterSpacing:2,fontFamily:"sans-serif",borderRadius:"4px 4px 0 0"}}>{heading}</div>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:12}}>
                    {fields.map(([f,l,type])=>(
                      <div key={f}>
                        <label style={lSt}>{l}</label>
                        {type?.startsWith("ta")?<textarea rows={parseInt(type.slice(2))||3} style={iSt} value={cvData[f]} onChange={e=>setCvData(d=>({...d,[f]:e.target.value}))}/>:<input style={iSt} value={cvData[f]} onChange={e=>setCvData(d=>({...d,[f]:e.target.value}))}/>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{marginBottom:11}}>
                <div style={{background:C.primary,color:C.accent,padding:"6px 13px",fontSize:9,letterSpacing:2,fontFamily:"sans-serif",borderRadius:"4px 4px 0 0"}}>SKILLS</div>
                <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:12}}>
                  <div style={{display:"flex",gap:6,marginBottom:8}}>
                    <input id="skill-input" style={{...iSt,marginTop:0,flex:1}} placeholder="Type a skill and press Add..."
                      onKeyDown={e=>{if(e.key==="Enter"){const v=e.target.value.trim();if(v){setCvData(d=>({...d,skills:[...new Set([...d.skills,v])]}));e.target.value="";}e.preventDefault();}}}/>
                    <button onClick={()=>{const inp=document.getElementById("skill-input");const v=inp.value.trim();if(v){setCvData(d=>({...d,skills:[...new Set([...d.skills,v])]}));inp.value="";}}}
                      style={{padding:"6px 12px",background:C.primary,color:C.white,border:"none",borderRadius:5,fontSize:10,cursor:"pointer",fontFamily:"sans-serif",whiteSpace:"nowrap",flexShrink:0}}>+ ADD</button>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {cvData.skills.map((sk,i)=>(
                      <span key={i} style={{background:C.section,color:C.primary,fontSize:10,padding:"3px 9px",borderRadius:10,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:5}}>
                        {sk}
                        <span onClick={()=>setCvData(d=>({...d,skills:d.skills.filter((_,idx)=>idx!==i)}))} style={{cursor:"pointer",color:C.muted,fontWeight:700,fontSize:11,lineHeight:1}}>×</span>
                      </span>
                    ))}
                    {cvData.skills.length===0&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>Skills are auto-filled by the coach. You can also add them manually above.</div>}
                  </div>
                </div>
              </div>
              {[["experience","WORK EXPERIENCE",{title:"",company:"",years:"",description:""},[["title","Job Title"],["company","Company"],["years","Years"],["description","What changed because of your work here?","ta"]]],
                ["education","EDUCATION",{degree:"",institution:"",years:"",description:""},[["degree","Degree"],["institution","Institution"],["years","Years"],["description","Key achievement"]]],
                ["certifications","CERTIFICATIONS",{name:"",organization:"",date:"",url:"",skills:""},[["name","Certificate Title (exact name)"],["organization","Issuing Organization"],["date","Date of Completion (Month Year)"],["url","Verification Link (URL, if available)"],["skills","Key Skills Gained"]]]
              ].map(([field,heading,empty,fields])=>(
                <div key={field} style={{marginBottom:11}}>
                  <div style={{background:C.primary,color:C.accent,padding:"6px 13px",fontSize:9,letterSpacing:2,fontFamily:"sans-serif",borderRadius:"4px 4px 0 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{heading}</span>
                    <button onClick={()=>setCvData(d=>({...d,[field]:[...d[field],{...empty}]}))} style={{background:"transparent",border:`1px solid ${C.mid}`,color:C.light,fontSize:9,padding:"2px 7px",borderRadius:3,cursor:"pointer"}}>+ ADD</button>
                  </div>
                  <div style={{background:C.white,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 4px 4px",padding:12}}>
                    {cvData[field].length===0&&<div style={{fontSize:11,color:C.muted,fontStyle:"italic"}}>Auto-filled by the coach as you talk.</div>}
                    {cvData[field].map((entry,i)=>(
                      <div key={i} style={{background:C.section,borderRadius:4,padding:9,marginBottom:7,position:"relative"}}>
                        <button onClick={()=>setCvData(d=>({...d,[field]:d[field].filter((_,idx)=>idx!==i)}))} style={{position:"absolute",top:6,right:8,background:"transparent",border:"none",color:C.muted,fontSize:12,cursor:"pointer"}}>x</button>
                        {fields.map(([f,ph,type])=>type==="ta"
                          ?<textarea key={f} rows={2} style={{...iSt,marginTop:4}} value={entry[f]} placeholder={ph} onChange={e=>setCvData(d=>{const arr=[...d[field]];arr[i]={...arr[i],[f]:e.target.value};return{...d,[field]:arr};})}/>
                          :<input key={f} style={{...iSt,marginTop:4}} value={entry[f]} placeholder={ph} onChange={e=>setCvData(d=>{const arr=[...d[field]];arr[i]={...arr[i],[f]:e.target.value};return{...d,[field]:arr};})}/>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={()=>{const b=new Blob([JSON.stringify(cvData,null,2)],{type:"application/json"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${cvData.name||"my"}_cv_data.json`;a.click();}}
                style={{width:"100%",padding:"11px 0",background:C.primary,color:C.accent,border:"none",borderRadius:6,fontSize:10,letterSpacing:2,cursor:"pointer",fontFamily:"sans-serif",marginBottom:16}}>
                DOWNLOAD CV DATA (JSON)
              </button>
            </div>
          )}

          {panel==="preview"&&(
            <div style={{overflowY:"auto",maxHeight:"calc(100dvh - 145px)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexWrap:"wrap",gap:6}}>
                <div>
                  <span style={{fontSize:9,color:C.primary,fontWeight:700,letterSpacing:1,fontFamily:"sans-serif"}}>CV PREVIEW</span>
                  <div style={{fontSize:10,color:C.muted,fontFamily:"Georgia,serif",marginTop:2,fontStyle:"italic"}}>{lang.code==="nl"?"Ken je iemand die een cv nodig heeft? Deel de link met die persoon.":lang.code==="es"?"¿Conoces a alguien que necesite un currículum sólido? Comparte Clairo con esa persona.":"Know someone that needs a strong CV? Share Clairo with them."}</div>
                </div>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  <button onClick={()=>{navigator.clipboard.writeText("getclairo.vercel.app").then(()=>alert("Link gekopieerd! Deel getclairo.vercel.app met iedereen die een cv nodig heeft."));}} style={{background:C.section,border:`1px solid ${C.light}`,borderRadius:4,color:C.primary,fontSize:9,cursor:"pointer",padding:"3px 10px",fontFamily:"sans-serif",fontWeight:700}}>SHARE APP</button>
                  <button onClick={()=>setPanel("data")} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,fontSize:9,cursor:"pointer",padding:"3px 10px",fontFamily:"sans-serif"}}>{lang.editData||"EDIT DATA"}</button>
                  <button onClick={printCV} style={{background:C.primary,border:"none",borderRadius:4,color:C.white,fontSize:9,cursor:"pointer",padding:"3px 12px",fontFamily:"sans-serif",letterSpacing:1}}>{lang.printSave||"PRINT / SAVE PDF"}</button>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <div style={{transform:"scale(0.82)",transformOrigin:"top left",width:"122%",minWidth:600}}>
                  <CVDocument cvData={cvData} lang={lang}/>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        * { box-sizing:border-box; }
        textarea, input { background:#ffffff !important; color:#1a1a1a !important; }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
        textarea:focus, input:focus { outline:2px solid ${C.mid}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.light}; border-radius:2px; }
        @media (max-width:600px) {
          .clairo-sidebar { display:none !important; }
          textarea { font-size:16px !important; }
        }
      `}</style>
    </div>
  );
}