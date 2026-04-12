import { useState, useRef, useEffect, useCallback } from "react";

const C = {
  primary: "#3a5162", mid: "#7a9bb0", light: "#b8c9d4",
  section: "#d5dde3", dark: "#1a1a1a", muted: "#555",
  white: "#ffffff", accent: "#f5f5f5", border: "#ddd",
};

// ── DIAMOND BANNER (MJM branding, coach UI only) ──────────────────────────
const DiamondBanner = ({ height = 56 }) => {
  const [width, setWidth] = useState(900);
  const ref = useRef();
  useEffect(() => {
    const obs = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const oh = height * 0.82, mh = oh * 0.65, ih = oh * 0.30, sx = oh * 1.05;
  const pts = [];
  for (let x = -oh; x < width + oh; x += sx) pts.push(x);
  const cy = height / 2;
  const d = (cx, cy, h) => `M${cx},${cy-h} L${cx+h},${cy} L${cx},${cy+h} L${cx-h},${cy} Z`;
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={width} height={height} style={{ display: "block" }}>
        <rect width={width} height={height} fill={C.primary} />
        {pts.map((cx, i) => (
          <g key={i}>
            <path d={d(cx,cy,oh)} fill={C.light} />
            <path d={d(cx,cy,mh)} fill={C.mid} />
            <path d={d(cx,cy,ih)} fill={C.primary} />
          </g>
        ))}
      </svg>
    </div>
  );
};

// ── GENERIC CLEAN CV DESIGN (print-ready, no personal branding) ───────────
const CVDocument = ({ cvData }) => {
  const { name, title, why_hire_me, email, phone, location, website, skills, experience, education } = cvData;
  return (
    <div id="cv-print-area" style={{
      width: "210mm", minHeight: "297mm", background: C.white,
      fontFamily: "'Georgia', serif", color: C.dark,
      margin: "0 auto", boxSizing: "border-box",
    }}>
      {/* NAME HEADER */}
      <div style={{ background: C.dark, padding: "22px 28px 18px", borderBottom: `4px solid ${C.mid}` }}>
        <div style={{ fontSize: 30, fontFamily: "sans-serif", fontWeight: 900, color: C.white, letterSpacing: 3, textTransform: "uppercase" }}>
          {name || "YOUR NAME"}
        </div>
        <div style={{ fontSize: 12, color: C.light, fontFamily: "sans-serif", letterSpacing: 2, marginTop: 4, textTransform: "uppercase" }}>
          {title || "Professional Title"}
        </div>
        <div style={{ display: "flex", gap: 18, marginTop: 10, flexWrap: "wrap" }}>
          {[email, phone, location, website].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: 10, color: C.light, fontFamily: "sans-serif" }}>{v}</span>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0, minHeight: "calc(297mm - 90px)" }}>
        {/* LEFT COLUMN */}
        <div style={{ background: "#f8f9fa", borderRight: `1px solid ${C.border}`, padding: "18px 16px" }}>

          {/* PROFILE */}
          {why_hire_me && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.mid, letterSpacing: 2, textTransform: "uppercase", borderBottom: `2px solid ${C.mid}`, paddingBottom: 4, marginBottom: 8, fontFamily: "sans-serif" }}>
                PROFILE
              </div>
              <div style={{ fontSize: 10.5, lineHeight: 1.7, color: C.dark }}>{why_hire_me}</div>
            </div>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.mid, letterSpacing: 2, textTransform: "uppercase", borderBottom: `2px solid ${C.mid}`, paddingBottom: 4, marginBottom: 8, fontFamily: "sans-serif" }}>
                SKILLS
              </div>
              {skills.map((sk, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                  <span style={{ width: 4, height: 4, background: C.mid, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 10.5, color: C.dark, fontFamily: "sans-serif" }}>{sk}</span>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.mid, letterSpacing: 2, textTransform: "uppercase", borderBottom: `2px solid ${C.mid}`, paddingBottom: 4, marginBottom: 8, fontFamily: "sans-serif" }}>
                EDUCATION
              </div>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.dark, fontFamily: "sans-serif" }}>{ed.degree}</div>
                  <div style={{ fontSize: 10, color: C.muted, fontFamily: "sans-serif" }}>{ed.institution}</div>
                  <div style={{ fontSize: 9, color: C.mid, fontFamily: "sans-serif", marginBottom: 3 }}>{ed.years}</div>
                  {ed.description && <div style={{ fontSize: 10, color: C.dark, lineHeight: 1.5 }}>{ed.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ padding: "18px 20px" }}>
          {experience.length > 0 && (
            <div>
              <div style={{ fontSize: 9, fontWeight: 700, color: C.mid, letterSpacing: 2, textTransform: "uppercase", borderBottom: `2px solid ${C.mid}`, paddingBottom: 4, marginBottom: 10, fontFamily: "sans-serif" }}>
                EXPERIENCE
              </div>
              {experience.map((ex, i) => (
                <div key={i} style={{ marginBottom: 16, paddingBottom: 14, borderBottom: i < experience.length - 1 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, fontFamily: "sans-serif" }}>{ex.title}</div>
                    <div style={{ fontSize: 9, color: C.mid, fontFamily: "sans-serif", whiteSpace: "nowrap", marginLeft: 8 }}>{ex.years}</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.mid, fontFamily: "sans-serif", marginBottom: 5 }}>{ex.company}</div>
                  <div style={{ fontSize: 10.5, color: C.dark, lineHeight: 1.65 }}>{ex.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── DUPLICATE CONFIRMATION MODAL ──────────────────────────────────────────
const DuplicateModal = ({ pending, onConfirm, onMerge, onSkip }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
    <div style={{ background: C.white, borderRadius: 8, padding: 24, maxWidth: 400, width: "90%", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, fontFamily: "sans-serif", letterSpacing: 1, marginBottom: 8 }}>DUPLICATE DETECTED</div>
      <div style={{ fontSize: 13, color: C.dark, fontFamily: "Georgia, serif", lineHeight: 1.6, marginBottom: 16 }}>
        The coach found a new entry for <strong>{pending.type === "exp" ? pending.data.title + " at " + pending.data.company : pending.data.degree}</strong>. This looks similar to something already in your CV. What would you like to do?
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={onMerge} style={{ padding: "9px 14px", background: C.primary, color: C.white, border: "none", borderRadius: 5, fontSize: 11, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1 }}>
          UPDATE EXISTING ENTRY
        </button>
        <button onClick={onConfirm} style={{ padding: "9px 14px", background: "transparent", color: C.primary, border: `1px solid ${C.primary}`, borderRadius: 5, fontSize: 11, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1 }}>
          ADD AS NEW ENTRY
        </button>
        <button onClick={onSkip} style={{ padding: "9px 14px", background: "transparent", color: C.muted, border: `1px solid ${C.border}`, borderRadius: 5, fontSize: 11, cursor: "pointer", fontFamily: "sans-serif", letterSpacing: 1 }}>
          SKIP / IGNORE
        </button>
      </div>
    </div>
  </div>
);

// ── STEPS + PROMPTS ───────────────────────────────────────────────────────
const STEPS = ["identity","experience","education","skills","whyhire","contact","done"];
const STEP_LABELS = { identity:"Who You Are", experience:"Your Experience", education:"Education", skills:"Your Skills", whyhire:"Why Hire You", contact:"Contact Details", done:"Review & Done" };
const OPENERS = {
  identity: "Welcome. I'm your CV Coach. My job is to dig deep and pull out the real story of who you are. No templates, no boxes to tick. Let's start: forget job titles for a moment. How would you describe yourself as a person? What drives you?",
  experience: "Good. Now let's talk about your work history. Start with your very first job, even if it feels small or unrelated. What was it, and what years did you work there?",
  education: "Let's talk about your education. Start with the highest level you completed. What did you study, where, and when?",
  skills: "Now let's surface your skills. Based on everything you have shared, what do you think you do better than most people around you?",
  whyhire: "Here is the big question. If you had 30 seconds to tell someone why they should hire you over anyone else, what would you say? Be bold.",
  contact: "Almost there. What is your full name and the job title you are targeting?",
  done: "You have done it. Your CV is ready. Switch to CV PREVIEW to see your design, or edit anything in CV DATA.",
};

const SYSTEM_BASE = `You are a warm, sharp CV coach and talent specialist. You see potential in people.

Rules:
- Never use em dashes. Use commas, hyphens, or periods only.
- One question at a time. Never overwhelm.
- Mirror back: "So what I'm hearing is..."
- Reframe negatives as strengths.
- Push for specifics and quantified impact.
- Keep responses to 2-4 sentences then ONE follow-up question.
- Be warm, direct, coaching.
- When this step is fully done, output STEP_COMPLETE on its own line, then one sentence bridging to next topic.

After EVERY response, on the final line output ONLY this (fill what you learned NOW, null for rest):
EXTRACT:{"name":null,"title":null,"why_hire_me":null,"email":null,"phone":null,"location":null,"website":null,"new_skill":null,"new_exp":null,"new_edu":null}

new_exp: {"title":"","company":"","years":"","description":""}
new_edu: {"degree":"","institution":"","years":"","description":""}
new_skill: single string only`;

const extractJSON = (text) => {
  const m = text.match(/EXTRACT:(\{[^\n]+\})/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
};
const cleanText = (t) => t.replace(/EXTRACT:\{[^\n]+\}/g,"").replace(/STEP_COMPLETE\s*/g,"").trim();
const hasComplete = (t) => t.includes("STEP_COMPLETE");

const isSimilarExp = (a, b) => {
  const norm = s => (s||"").toLowerCase().trim();
  return norm(a.title) === norm(b.title) || norm(a.company) === norm(b.company);
};
const isSimilarEdu = (a, b) => {
  const norm = s => (s||"").toLowerCase().trim();
  return norm(a.degree) === norm(b.degree) || norm(a.institution) === norm(b.institution);
};

const iStyle = { width:"100%", padding:"7px 9px", border:`1px solid ${C.border}`, borderRadius:5, fontFamily:"Georgia,serif", fontSize:12.5, color:C.dark, background:C.white, boxSizing:"border-box", marginTop:3 };
const lStyle = { fontSize:9, fontWeight:700, color:C.primary, textTransform:"uppercase", letterSpacing:1.2, display:"block", marginTop:10 };

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [step, setStep] = useState("identity");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panel, setPanel] = useState("chat");
  const [pendingDuplicate, setPendingDuplicate] = useState(null);
  const [cvData, setCvData] = useState({
    name:"", title:"", why_hire_me:"",
    email:"", phone:"", location:"", website:"",
    skills:[], experience:[], education:[],
  });
  const messagesEnd = useRef(null);
  const stepRef = useRef("identity");

  useEffect(() => { stepRef.current = step; }, [step]);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  const applyExtract = useCallback((ex) => {
    if (!ex) return;
    setCvData((prev) => {
      const next = { ...prev };
      if (ex.name) next.name = ex.name;
      if (ex.title) next.title = ex.title;
      if (ex.why_hire_me) next.why_hire_me = ex.why_hire_me;
      if (ex.email) next.email = ex.email;
      if (ex.phone) next.phone = ex.phone;
      if (ex.location) next.location = ex.location;
      if (ex.website) next.website = ex.website;
      if (ex.new_skill && ex.new_skill.trim()) {
        next.skills = [...new Set([...prev.skills, ex.new_skill.trim()])];
      }
      return next;
    });

    // Handle experience with duplicate check
    if (ex.new_exp && ex.new_exp.title) {
      setCvData((prev) => {
        const dupIdx = prev.experience.findIndex(e => isSimilarExp(e, ex.new_exp));
        if (dupIdx >= 0) {
          setPendingDuplicate({ type:"exp", data: ex.new_exp, dupIdx });
          return prev;
        }
        return { ...prev, experience: [...prev.experience, ex.new_exp] };
      });
    }

    // Handle education with duplicate check
    if (ex.new_edu && ex.new_edu.degree) {
      setCvData((prev) => {
        const dupIdx = prev.education.findIndex(e => isSimilarEdu(e, ex.new_edu));
        if (dupIdx >= 0) {
          setPendingDuplicate({ type:"edu", data: ex.new_edu, dupIdx });
          return prev;
        }
        return { ...prev, education: [...prev.education, ex.new_edu] };
      });
    }
  }, []);

  const advanceStep = useCallback((current) => {
    const idx = STEPS.indexOf(current);
    if (idx >= STEPS.length - 1) return;
    const next = STEPS[idx + 1];
    setStep(next);
    stepRef.current = next;
    if (next === "done") setTimeout(() => setPanel("preview"), 500);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg = { role:"user", content:text };
    setMessages(prev => { const msgs = [...prev, userMsg]; runAPI(msgs); return msgs; });
    setInput("");
  };

  const runAPI = async (msgs) => {
    setLoading(true);
    const cur = stepRef.current;
    const idx = STEPS.indexOf(cur);
    const ctx = `Current step: ${STEP_LABELS[cur]}. Next: ${STEP_LABELS[STEPS[idx+1]]||"done"}. Coach through THIS step only. Say STEP_COMPLETE when ready to move on.`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system: SYSTEM_BASE + "\n\n" + ctx,
          messages: msgs.map(m => ({ role:m.role, content:m.content })),
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type==="text")?.text || "";
      applyExtract(extractJSON(raw));
      const clean = cleanText(raw);
      const complete = hasComplete(raw);
      setMessages(prev => [...prev, { role:"assistant", content:clean }]);
      if (complete) {
        advanceStep(cur);
        const nextIdx = STEPS.indexOf(cur) + 1;
        if (nextIdx < STEPS.length && STEPS[nextIdx] !== "done") {
          setTimeout(() => {
            setMessages(prev => [...prev, { role:"assistant", content:OPENERS[STEPS[nextIdx]] }]);
          }, 500);
        }
      }
    } catch {
      setMessages(prev => [...prev, { role:"assistant", content:"Something went wrong. Please try again." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const manualSkip = () => {
    const idx = STEPS.indexOf(step);
    if (idx >= STEPS.length - 1) return;
    const next = STEPS[idx+1];
    setStep(next); stepRef.current = next;
    if (next === "done") setPanel("preview");
    else setMessages(prev => [...prev, { role:"assistant", content:OPENERS[next] }]);
  };

  const printCV = () => {
    const area = document.getElementById("cv-print-area");
    if (!area) return;
    const w = window.open("","_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>CV - ${cvData.name}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { margin: 0; background: white; }
      @media print { body { margin: 0; } @page { margin: 0; size: A4; } }
    </style></head><body>${area.outerHTML}</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 400);
  };

  const stepIdx = STEPS.indexOf(step);
  const progress = Math.round(((stepIdx+1)/STEPS.length)*100);

  // ── WELCOME ──
  if (screen === "welcome") return (
    <div style={{ minHeight:"100vh", background:"#f4f7f9", display:"flex", flexDirection:"column" }}>
      <DiamondBanner height={80} />
      <div style={{ background:C.primary, padding:"14px 28px" }}>
        <div style={{ color:C.accent, fontSize:22, fontFamily:"Impact,sans-serif", letterSpacing:4 }}>MJM CV WRITER</div>
        <div style={{ color:C.light, fontSize:9, letterSpacing:3, marginTop:2 }}>PROBLEM-SOLVING CV COACH</div>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
        <div style={{ maxWidth:480, textAlign:"center" }}>
          <div style={{ fontSize:26, fontFamily:"Georgia,serif", color:C.primary, fontWeight:700, lineHeight:1.35, marginBottom:14 }}>Your CV should tell your real story.</div>
          <div style={{ fontSize:14, color:C.dark, lineHeight:1.8, marginBottom:10, fontFamily:"Georgia,serif" }}>Most CVs list duties. Yours will show what changed because of you.</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.75, marginBottom:28, fontFamily:"Georgia,serif" }}>A coach asks the questions that make you think, auto-fills your data, prevents duplicates, and generates a clean printable CV at the end.</div>
          <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
            {["7 guided steps","AI coach","Auto-fills data","Duplicate protection","Print-ready CV"].map(f => (
              <div key={f} style={{ background:C.section, borderRadius:6, padding:"6px 11px", fontSize:9, color:C.primary, fontWeight:700, letterSpacing:0.5, fontFamily:"sans-serif" }}>{f}</div>
            ))}
          </div>
          <button onClick={() => { setScreen("app"); setMessages([{ role:"assistant", content:OPENERS.identity }]); }}
            style={{ background:C.primary, color:C.accent, border:"none", padding:"13px 40px", borderRadius:6, fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"sans-serif", fontWeight:700 }}>
            START MY CV
          </button>
        </div>
      </div>
      <style>{`* { box-sizing:border-box; }`}</style>
    </div>
  );

  // ── MAIN APP ──
  return (
    <div style={{ minHeight:"100vh", background:"#f4f7f9", display:"flex", flexDirection:"column" }}>
      {pendingDuplicate && (
        <DuplicateModal
          pending={pendingDuplicate}
          onConfirm={() => {
            setCvData(prev => ({
              ...prev,
              [pendingDuplicate.type==="exp"?"experience":"education"]: [
                ...prev[pendingDuplicate.type==="exp"?"experience":"education"],
                pendingDuplicate.data
              ]
            }));
            setPendingDuplicate(null);
          }}
          onMerge={() => {
            setCvData(prev => {
              const field = pendingDuplicate.type==="exp"?"experience":"education";
              const arr = [...prev[field]];
              const existing = arr[pendingDuplicate.dupIdx];
              const incoming = pendingDuplicate.data;
              arr[pendingDuplicate.dupIdx] = {
                ...existing,
                description: incoming.description && incoming.description.length > (existing.description||"").length
                  ? incoming.description : existing.description,
                years: incoming.years || existing.years,
              };
              return { ...prev, [field]: arr };
            });
            setPendingDuplicate(null);
          }}
          onSkip={() => setPendingDuplicate(null)}
        />
      )}

      <DiamondBanner height={52} />
      <div style={{ background:C.primary, padding:"7px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ color:C.accent, fontSize:15, fontFamily:"Impact,sans-serif", letterSpacing:3 }}>MJM CV WRITER</div>
        <div style={{ display:"flex", gap:5 }}>
          {[["chat","COACHING"],["data","CV DATA"],["preview","CV PREVIEW"]].map(([p,l]) => (
            <button key={p} onClick={() => setPanel(p)} style={{ padding:"3px 10px", border:`1px solid ${panel===p?C.white:C.mid}`, borderRadius:4, background:panel===p?C.white:"transparent", color:panel===p?C.primary:C.light, fontSize:9, cursor:"pointer", fontFamily:"sans-serif", letterSpacing:1 }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", flex:1 }}>
        {/* SIDEBAR */}
        <div style={{ width:150, background:C.primary, flexShrink:0, padding:"12px 0" }}>
          {STEPS.map((s,i) => (
            <div key={s} style={{ padding:"8px 11px", borderLeft:step===s?`3px solid ${C.light}`:"3px solid transparent", background:step===s?"rgba(255,255,255,0.1)":"transparent", color:i<=stepIdx?C.accent:"rgba(181,201,212,0.3)", fontSize:9, letterSpacing:0.8, fontFamily:"sans-serif", fontWeight:step===s?700:400, transition:"all 0.3s" }}>
              {i < stepIdx && <span style={{ marginRight:4, fontSize:8 }}>✓</span>}
              {STEP_LABELS[s].toUpperCase()}
            </div>
          ))}
          <div style={{ margin:"12px 11px 0", height:3, background:"rgba(255,255,255,0.1)", borderRadius:2 }}>
            <div style={{ width:`${progress}%`, height:"100%", background:C.light, borderRadius:2, transition:"width 0.5s" }} />
          </div>
          <div style={{ color:C.mid, fontSize:9, padding:"4px 11px", letterSpacing:1 }}>{progress}% DONE</div>
        </div>

        {/* PANELS */}
        <div style={{ flex:1, padding:13, overflow:"hidden" }}>

          {/* COACHING */}
          {panel==="chat" && (
            <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 162px)" }}>
              <div style={{ background:C.section, borderRadius:4, padding:"6px 11px", marginBottom:8, borderLeft:`3px solid ${C.primary}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:9, color:C.primary, fontWeight:700, letterSpacing:1 }}>STEP {stepIdx+1}/{STEPS.length}: {STEP_LABELS[step].toUpperCase()}</span>
                <button onClick={manualSkip} style={{ background:"transparent", border:`1px solid ${C.light}`, borderRadius:3, color:C.muted, fontSize:9, cursor:"pointer", padding:"2px 8px", fontFamily:"sans-serif" }}>SKIP</button>
              </div>
              <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column", gap:9, paddingBottom:8 }}>
                {messages.map((m,i) => (
                  <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-start" }}>
                    {m.role==="assistant" && <div style={{ width:24, height:24, borderRadius:"50%", background:C.primary, color:C.accent, fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginRight:6, flexShrink:0, marginTop:2 }}>C</div>}
                    <div style={{ maxWidth:"76%", padding:"9px 13px", borderRadius:m.role==="user"?"12px 12px 2px 12px":"12px 12px 12px 2px", background:m.role==="user"?C.primary:C.white, color:m.role==="user"?C.accent:C.dark, fontSize:13, lineHeight:1.65, border:m.role==="assistant"?`1px solid ${C.border}`:"none", fontFamily:"Georgia,serif" }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display:"flex", alignItems:"center", gap:5, paddingLeft:30 }}>
                    {[0,1,2].map(d => <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:C.mid, animation:"pulse 1.2s ease-in-out infinite", animationDelay:`${d*0.2}s` }} />)}
                  </div>
                )}
                <div ref={messagesEnd} />
              </div>
              {step!=="done" ? (
                <div style={{ display:"flex", gap:7, marginTop:7 }}>
                  <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Type your answer... (Enter to send)" rows={2}
                    style={{ flex:1, padding:"9px 11px", border:`1px solid ${C.border}`, borderRadius:6, resize:"none", fontFamily:"Georgia,serif", fontSize:13, color:C.dark, outline:"none" }} />
                  <button onClick={sendMessage} disabled={loading||!input.trim()} style={{ padding:"0 15px", background:C.primary, color:C.accent, border:"none", borderRadius:6, cursor:"pointer", fontSize:10, fontFamily:"sans-serif", letterSpacing:1, opacity:loading||!input.trim()?0.5:1 }}>SEND</button>
                </div>
              ) : (
                <button onClick={() => setPanel("preview")} style={{ marginTop:10, width:"100%", padding:"11px 0", background:C.primary, color:C.accent, border:"none", borderRadius:6, fontSize:11, letterSpacing:2, cursor:"pointer", fontFamily:"sans-serif" }}>VIEW MY CV</button>
              )}
            </div>
          )}

          {/* CV DATA */}
          {panel==="data" && (
            <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 148px)" }}>
              {[["PROFILE",[["name","Full Name"],["title","Professional Title"],["why_hire_me","Why Should Someone Hire You?","ta4"]]],
                ["CONTACT",[["email","Email"],["phone","Phone"],["location","Location"],["website","Website / LinkedIn"]]],
              ].map(([heading, fields]) => (
                <div key={heading} style={{ marginBottom:11 }}>
                  <div style={{ background:C.primary, color:C.accent, padding:"6px 13px", fontSize:9, letterSpacing:2, fontFamily:"sans-serif", borderRadius:"4px 4px 0 0" }}>{heading}</div>
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderTop:"none", borderRadius:"0 0 4px 4px", padding:12 }}>
                    {fields.map(([f,l,type]) => (
                      <div key={f}>
                        <label style={lStyle}>{l}</label>
                        {type?.startsWith("ta")
                          ? <textarea rows={parseInt(type.slice(2))||3} style={iStyle} value={cvData[f]} onChange={e=>setCvData(d=>({...d,[f]:e.target.value}))} />
                          : <input style={iStyle} value={cvData[f]} onChange={e=>setCvData(d=>({...d,[f]:e.target.value}))} />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div style={{ marginBottom:11 }}>
                <div style={{ background:C.primary, color:C.accent, padding:"6px 13px", fontSize:9, letterSpacing:2, fontFamily:"sans-serif", borderRadius:"4px 4px 0 0" }}>SKILLS</div>
                <div style={{ background:C.white, border:`1px solid ${C.border}`, borderTop:"none", borderRadius:"0 0 4px 4px", padding:12 }}>
                  <input style={iStyle} value={cvData.skills.join(", ")} onChange={e=>setCvData(d=>({...d,skills:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)}))} placeholder="Power BI, SQL, Excel..." />
                  <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginTop:7 }}>
                    {cvData.skills.map((sk,i) => <span key={i} style={{ background:C.section, color:C.primary, fontSize:10, padding:"3px 9px", borderRadius:10, fontFamily:"sans-serif" }}>{sk}</span>)}
                  </div>
                </div>
              </div>

              {[["experience","WORK EXPERIENCE",{title:"",company:"",years:"",description:""},[["title","Job Title"],["company","Company"],["years","Years"],["description","What changed because of your work here?","ta"]]],
                ["education","EDUCATION",{degree:"",institution:"",years:"",description:""},[["degree","Degree"],["institution","Institution"],["years","Years"],["description","Key achievement"]]],
              ].map(([field,heading,empty,fields]) => (
                <div key={field} style={{ marginBottom:11 }}>
                  <div style={{ background:C.primary, color:C.accent, padding:"6px 13px", fontSize:9, letterSpacing:2, fontFamily:"sans-serif", borderRadius:"4px 4px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span>{heading}</span>
                    <button onClick={() => setCvData(d=>({...d,[field]:[...d[field],{...empty}]}))} style={{ background:"transparent", border:`1px solid ${C.mid}`, color:C.light, fontSize:9, padding:"2px 7px", borderRadius:3, cursor:"pointer" }}>+ ADD</button>
                  </div>
                  <div style={{ background:C.white, border:`1px solid ${C.border}`, borderTop:"none", borderRadius:"0 0 4px 4px", padding:12 }}>
                    {cvData[field].length===0 && <div style={{ fontSize:11, color:C.muted, fontStyle:"italic" }}>Auto-filled by the coach as you talk.</div>}
                    {cvData[field].map((entry,i) => (
                      <div key={i} style={{ background:C.section, borderRadius:4, padding:9, marginBottom:7, position:"relative" }}>
                        <button onClick={() => setCvData(d=>({...d,[field]:d[field].filter((_,idx)=>idx!==i)}))} style={{ position:"absolute", top:6, right:8, background:"transparent", border:"none", color:C.muted, fontSize:12, cursor:"pointer", lineHeight:1 }}>x</button>
                        {fields.map(([f,ph,type]) =>
                          type==="ta"
                            ? <textarea key={f} rows={2} style={{...iStyle,marginTop:4}} value={entry[f]} placeholder={ph} onChange={e=>setCvData(d=>{const arr=[...d[field]];arr[i]={...arr[i],[f]:e.target.value};return{...d,[field]:arr};})} />
                            : <input key={f} style={{...iStyle,marginTop:4}} value={entry[f]} placeholder={ph} onChange={e=>setCvData(d=>{const arr=[...d[field]];arr[i]={...arr[i],[f]:e.target.value};return{...d,[field]:arr};})} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <button onClick={() => { const b=new Blob([JSON.stringify(cvData,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`${cvData.name||"my"}_cv_data.json`; a.click(); }}
                style={{ width:"100%", padding:"11px 0", background:C.primary, color:C.accent, border:"none", borderRadius:6, fontSize:10, letterSpacing:2, cursor:"pointer", fontFamily:"sans-serif", marginBottom:16 }}>
                DOWNLOAD CV DATA (JSON)
              </button>
            </div>
          )}

          {/* CV PREVIEW */}
          {panel==="preview" && (
            <div style={{ overflowY:"auto", maxHeight:"calc(100vh - 148px)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:9, color:C.primary, fontWeight:700, letterSpacing:1, fontFamily:"sans-serif" }}>CV PREVIEW</span>
                <div style={{ display:"flex", gap:7 }}>
                  <button onClick={() => setPanel("data")} style={{ background:"transparent", border:`1px solid ${C.border}`, borderRadius:4, color:C.muted, fontSize:9, cursor:"pointer", padding:"3px 10px", fontFamily:"sans-serif" }}>EDIT DATA</button>
                  <button onClick={printCV} style={{ background:C.primary, border:"none", borderRadius:4, color:C.white, fontSize:9, cursor:"pointer", padding:"3px 12px", fontFamily:"sans-serif", letterSpacing:1 }}>PRINT / SAVE PDF</button>
                </div>
              </div>
              <div style={{ transform:"scale(0.85)", transformOrigin:"top left", width:"117%" }}>
                <CVDocument cvData={cvData} />
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
        textarea:focus, input:focus { outline:2px solid ${C.mid}; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:${C.light}; border-radius:2px; }
      `}</style>
    </div>
  );
}
