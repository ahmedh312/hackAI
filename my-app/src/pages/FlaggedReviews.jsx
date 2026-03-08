import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  gold: "#A8742A", goldLight: "#C9943C", goldDim: "#7A5520",
  bg: "#FAF7F2", bg2: "#F3EDE3", bg3: "#EDE4D6",
  surface: "#FFFFFF", border: "#E0D5C4",
  text: "#2A2218", textDim: "#9A8E7A",
  green: "#2E8A56", red: "#B8392E", neutral: "#4A6290",
};

function TopBar() {
  return <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${C.red}, #D4594A, ${C.red}, transparent)`, animation: "shimmer 3s ease-in-out infinite" }} />;
}

function LiveDot() {
  const [on, setOn] = useState(true);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), 750); return () => clearInterval(id); }, []);
  return <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.red, opacity: on ? 1 : 0.3, transition: "opacity 0.3s", flexShrink: 0 }} />;
}

export default function FlaggedReviews() {
  const navigate = useNavigate();
  const [flagged, setFlagged] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem("dismissed_flags") || "[]")); }
    catch { return new Set(); }
  });
  const intervalRef = useRef(null);

  const fetchFlagged = async () => {
    try {
      const res = await fetch("http://localhost:8000/results");
      const data = await res.json();
      const flags = data.filter(r =>
        (r.predicted_label || "").toLowerCase() === "negative" &&
        r.confidence >= 0.85
      );
      setFlagged(flags);
    } catch {}
  };

  useEffect(() => {
    fetchFlagged();
    intervalRef.current = setInterval(fetchFlagged, 2000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const dismiss = (index) => {
    const next = new Set(dismissed);
    next.add(index);
    setDismissed(next);
    try { localStorage.setItem("dismissed_flags", JSON.stringify([...next])); } catch {}
  };

  const visible = flagged.filter(r => !dismissed.has(r.index));
  const dismissedCount = flagged.length - visible.length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #FAF7F2; }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#FAF7F2; }
        ::-webkit-scrollbar-thumb { background:#E0D5C4; border-radius:3px; }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
        <TopBar />

        {/* Nav */}
        <nav style={{ padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, background: `${C.bg}F5`, backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div onClick={() => navigate("/dashboard")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.12em", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.textDim}
            >← DASHBOARD</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.15em", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>REVIEW SENSE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.red, letterSpacing: "0.2em", border: `1px solid ${C.red}44`, padding: "0.3rem 0.75rem" }}>
            <LiveDot />
            ESCALATION QUEUE
          </div>
        </nav>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 3rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              Decision Rule · confidence ≥ 0.85 · predicted = NEGATIVE
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", letterSpacing: "0.06em", color: C.text, marginBottom: "0.75rem" }}>
              Flagged Reviews
            </h1>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.red }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", marginRight: "0.4rem" }}>{visible.length}</span>
                AWAITING REVIEW
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.green }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", marginRight: "0.4rem" }}>{dismissedCount}</span>
                REVIEWED
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.textDim }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", marginRight: "0.4rem" }}>{flagged.length}</span>
                TOTAL FLAGGED
              </div>
            </div>
          </div>

          {/* Empty state */}
          {visible.length === 0 && (
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "4rem", textAlign: "center" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem", color: C.textDim, letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                {flagged.length === 0 ? "No Flagged Reviews Yet" : "All Reviews Marked as Reviewed"}
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: C.textDim }}>
                {flagged.length === 0
                  ? "Reviews with confidence ≥ 0.85 and NEGATIVE sentiment will appear here"
                  : `${dismissedCount} review${dismissedCount !== 1 ? "s" : ""} marked as reviewed`}
              </div>
            </div>
          )}

          {/* Flagged cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: C.border }}>
            {visible.map((r, i) => (
              <div key={r.index} style={{ background: C.surface, padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start", animation: "slideIn 0.3s ease both", animationDelay: `${i * 0.04}s` }}>

                <div>
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.gold, letterSpacing: "0.1em" }}>
                      {r.asin || "—"}
                    </div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", background: `${C.red}18`, border: `1px solid ${C.red}44`, color: C.red, padding: "0.15rem 0.5rem", letterSpacing: "0.1em" }}>
                      NEGATIVE
                    </div>
                    {r.topic && r.topic !== "unknown" && (
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", background: `${C.neutral}18`, border: `1px solid ${C.neutral}44`, color: C.neutral, padding: "0.15rem 0.5rem", letterSpacing: "0.1em", textTransform: "capitalize" }}>
                        {r.topic}
                      </div>
                    )}
                  </div>

                  {/* Review text */}
                  <p style={{ fontSize: "0.88rem", color: C.text, lineHeight: 1.7, marginBottom: "1rem" }}>
                    "{r.text_snippet}{r.text_snippet?.length >= 60 ? "…" : ""}"
                  </p>

                  {/* Metrics */}
                  <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Confidence</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: C.red }}>{(r.confidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Actual Rating</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: C.goldLight }}>{r.actual_rating}★</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.2rem" }}>Review #</div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: C.textDim }}>#{r.index}</div>
                    </div>
                  </div>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={() => dismiss(r.index)}
                  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: C.green, background: `${C.green}12`, border: `1px solid ${C.green}44`, padding: "0.6rem 1.2rem", cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${C.green}22`; e.currentTarget.style.borderColor = C.green; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${C.green}12`; e.currentTarget.style.borderColor = `${C.green}44`; }}
                >
                  ✓ Mark Reviewed
                </button>

              </div>
            ))}
          </div>

          {/* Restore dismissed */}
          {dismissedCount > 0 && (
            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <button
                onClick={() => { setDismissed(new Set()); try { localStorage.removeItem("dismissed_flags"); } catch {} }}
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: C.textDim, background: "transparent", border: `1px solid ${C.border}`, padding: "0.5rem 1.2rem", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.gold}
                onMouseLeave={e => e.currentTarget.style.color = C.textDim}
              >
                Restore {dismissedCount} dismissed review{dismissedCount !== 1 ? "s" : ""}
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}