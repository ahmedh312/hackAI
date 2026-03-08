import { useState, useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import WriteUp from "./pages/WriteUp";


/* ── palette (light mode) ─────────────────────────────────── */
const C = {
  gold: "#A8742A", goldLight: "#C9943C", goldDim: "#7A5520",
  bg: "#FAF7F2", bg2: "#F3EDE3", bg3: "#EDE4D6",
  surface: "#FFFFFF", border: "#E0D5C4",
  text: "#2A2218", textDim: "#9A8E7A",
  green: "#2E8A56", red: "#B8392E", neutral: "#4A6290",
};

/* ── sample review feed ──────────────────────────────────── */
const REVIEWS = [
  { stars: 5, sentiment: "POSITIVE", confidence: 0.94, score: 4.8, excerpt: "Absolutely life-changing product. Works exactly as described and arrived two days early.", category: "Electronics", asin: "B09XR44V7K" },
  { stars: 1, sentiment: "NEGATIVE", confidence: 0.91, score: 1.1, excerpt: "Complete waste of money. Broke after three uses and customer support was useless.", category: "Home & Kitchen", asin: "B07ZB2ZXQP" },
  { stars: 4, sentiment: "POSITIVE", confidence: 0.76, score: 3.9, excerpt: "Good quality overall, minor packaging issue but the product itself is solid.", category: "Sports", asin: "B08K3VCMQT" },
  { stars: 2, sentiment: "NEGATIVE", confidence: 0.83, score: 1.8, excerpt: "Not what the photos show. Material feels cheap and sizing runs very small.", category: "Clothing", asin: "B0BN3FX9WP" },
  { stars: 5, sentiment: "POSITIVE", confidence: 0.97, score: 4.9, excerpt: "Best purchase I've made this year. Exceptional build quality and fast shipping.", category: "Tools", asin: "B0C8MNJP2R" },
];

const STATS = [
  { value: "50K+", label: "Reviews Analyzed" },
  { value: "80%+", label: "Prediction Accuracy" },
  { value: "0.74", label: "Avg Confidence" },
  { value: "142ms", label: "Avg Inference Time" },
];

const FEATURES = [
  {
    icon: "◈",
    title: "Sentiment Classification",
    desc: "Deep NLP model trained on 50K verified Amazon reviews. Classifies positive, negative, and mixed signals with sub-150ms latency.",
  },
  {
    icon: "◉",
    title: "Star Score Prediction",
    desc: "Predicts the exact star rating a review conveys before it's submitted — enabling proactive customer success intervention.",
  },
  {
    icon: "◫",
    title: "Category Intelligence",
    desc: "Sector-aware models fine-tuned per Amazon category. Electronics sentiment differs fundamentally from Clothing or Food.",
  },
  {
    icon: "◧",
    title: "Batch API",
    desc: "Process thousands of reviews in parallel via our streaming REST API. Built for seller dashboards and brand monitoring tools.",
  },
];

/* ── hooks ───────────────────────────────────────────────── */
function useTypewriter(text, speed = 38, startDelay = 300) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text]);
  return { displayed, done };
}

/* ── micro components ────────────────────────────────────── */
function TopBar() {
  return (
    <div style={{
      height: 2,
      background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.goldLight}, ${C.gold}, transparent)`,
      animation: "shimmer 3s ease-in-out infinite"
    }} />
  );
}

function LiveDot({ color = C.green }) {
  const [on, setOn] = useState(true);
  useEffect(() => { const id = setInterval(() => setOn(v => !v), 750); return () => clearInterval(id); }, []);
  return (
    <div style={{
      width: 7, height: 7, borderRadius: "50%", background: color,
      opacity: on ? 1 : 0.3, transform: on ? "scale(1)" : "scale(0.7)",
      transition: "opacity 0.3s, transform 0.3s", flexShrink: 0
    }} />
  );
}

function Badge({ children, color = C.green }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "0.45rem",
      fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
      color, letterSpacing: "0.14em",
      border: `1px solid ${color}44`, padding: "0.3rem 0.7rem", borderRadius: 2
    }}>
      <LiveDot color={color} />
      {children}
    </div>
  );
}

function SentimentPill({ sentiment }) {
  const map = {
    POSITIVE: { bg: "rgba(76,175,122,0.13)", color: C.green, border: "rgba(76,175,122,0.3)" },
    NEGATIVE: { bg: "rgba(201,90,76,0.13)", color: C.red, border: "rgba(201,90,76,0.3)" },
    MIXED:    { bg: "rgba(122,140,175,0.13)", color: C.neutral, border: "rgba(122,140,175,0.3)" },
  };
  const s = map[sentiment] || map.MIXED;
  return (
    <span style={{
      fontFamily: "'DM Mono', monospace", fontSize: "0.63rem",
      letterSpacing: "0.1em", padding: "0.18rem 0.55rem", borderRadius: 1,
      color: s.color, background: s.bg, border: `1px solid ${s.border}`
    }}>{sentiment}</span>
  );
}

function Stars({ n }) {
  return (
    <span style={{ color: C.gold, fontSize: "0.75rem", letterSpacing: 1 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

/* ── nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <nav style={{
      padding: "1.5rem 3rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.border}`,
      position: "sticky", top: 0, zIndex: 100,
      background: `${C.bg}F5`, backdropFilter: "blur(8px)",
      boxShadow: "0 1px 0 #E0D5C4"
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem",
          letterSpacing: "0.15em",
          background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
        }}>REVIEW SENSE</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Review Intelligence
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        {["Product", "Docs", "Pricing", "About"].map(l => (
          <span key={l} style={{
            fontFamily: "'DM Mono', monospace", fontSize: "0.7rem",
            color: C.textDim, letterSpacing: "0.12em", cursor: "pointer",
            textTransform: "uppercase", transition: "color 0.2s"
          }}
          onMouseEnter={e => e.target.style.color = C.gold}
          onMouseLeave={e => e.target.style.color = C.textDim}
          >{l}</span>
        ))}
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.68rem",
          color: "#FFF", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
          padding: "0.45rem 1.1rem", borderRadius: 2, cursor: "pointer",
          letterSpacing: "0.12em", textTransform: "uppercase"
        }}>Get API Key</div>
      </div>
    </nav>
  );
}

/* ── hero ────────────────────────────────────────────────── */
function Hero() {
  const navigate = useNavigate();
  const tagline = "The reviews are talking. We translate.";
  const { displayed, done } = useTypewriter(tagline, 36, 400);

  return (
    <section style={{
      padding: "6rem 3rem 4rem",
      position: "relative", overflow: "hidden",
      borderBottom: `1px solid ${C.border}`
    }}>
      {/* bg grid */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(${C.border} 1px, transparent 1px),
          linear-gradient(90deg, ${C.border} 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)"
      }} />
      {/* glow */}
      <div style={{
        position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 300, borderRadius: "50%",
        background: `radial-gradient(ellipse, ${C.goldLight}33 0%, transparent 70%)`,
        zIndex: 0
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 820 }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Badge>GEMINI 2.0 Flash Lite · LIVE</Badge>
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(3.2rem, 7vw, 6.5rem)",
          letterSpacing: "0.04em", lineHeight: 0.95,
          color: C.text, marginBottom: "1rem"
        }}>
          <span style={{
            background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>Amazon Review</span>
          <br />
          <span>Signal Intelligence</span>
        </h1>

        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: "0.95rem",
          color: C.gold, letterSpacing: "0.04em", lineHeight: 1.7,
          minHeight: "1.7em", marginBottom: "2.5rem"
        }}>
          {displayed}
          {!done && <span style={{ opacity: 0.6, animation: "blink 0.8s step-end infinite" }}>|</span>}
        </p>

        <p style={{
          fontSize: "0.9rem", color: C.textDim, lineHeight: 1.8,
          maxWidth: 560, marginBottom: "3rem"
        }}>
          REVIEW SENSE reads raw review text and instantly classifies sentiment, predicts star ratings, and surfaces product risk signals — before they surface in your metrics.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div
            onClick={() => navigate("/dashboard")}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
              color: "#FFF", padding: "0.7rem 1.8rem", borderRadius: 2, cursor: "pointer"
            }}>Try the Demo →</div>
          <div
            onClick={() => navigate("/writeup")}
            style={{
              fontFamily: "'DM Mono', monospace", fontSize: "0.75rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: C.gold, padding: "0.7rem 1.8rem", borderRadius: 2,
              border: `1px solid ${C.goldDim}`, cursor: "pointer"
            }}>Write Up</div>
        </div>
      </div>
    </section>
  );
}

/* ── live demo widget ────────────────────────────────────── */
const SAMPLE_TEXTS = [
  "This vacuum cleaner is absolutely fantastic! Picks up everything, easy to empty, and it's whisper quiet. Arrived in perfect condition.",
  "Terrible quality. The zipper broke on the first use and the stitching is already coming apart. Total disappointment for the price.",
  "Decent product for the price point. Not as durable as the photos suggest but it does the job for light use.",
];

function DemoWidget() {
  const [text, setText] = useState(SAMPLE_TEXTS[0]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));

    const lower = text.toLowerCase();
    const posWords = ["fantastic", "great", "love", "perfect", "excellent", "amazing", "best", "awesome"];
    const negWords = ["terrible", "broke", "bad", "worst", "awful", "disappointed", "cheap", "useless"];
    const posCount = posWords.filter(w => lower.includes(w)).length;
    const negCount = negWords.filter(w => lower.includes(w)).length;

    let sentiment, stars, conf;
    if (posCount > negCount) {
      sentiment = "POSITIVE"; stars = Math.min(5, 4 + posCount); conf = 0.75 + posCount * 0.04;
    } else if (negCount > posCount) {
      sentiment = "NEGATIVE"; stars = Math.max(1, 2 - negCount); conf = 0.72 + negCount * 0.04;
    } else {
      sentiment = "MIXED"; stars = 3; conf = 0.58 + Math.random() * 0.12;
    }
    conf = Math.min(0.99, conf);
    setResult({ sentiment, stars, conf: conf.toFixed(2) });
    setLoading(false);
  };

  return (
    <section style={{ padding: "4rem 3rem", borderBottom: `1px solid ${C.border}`, background: C.bg2 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Interactive Demo</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", letterSpacing: "0.06em", color: C.text, marginBottom: "2rem" }}>Paste a Review. Get a Signal.</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>Review Text Input</div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={6} style={{ background: C.bg3, border: `1px solid ${C.border}`, color: C.text, fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", lineHeight: 1.7, padding: "0.85rem", borderRadius: 2, resize: "vertical", outline: "none" }} />
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {SAMPLE_TEXTS.map((s, i) => (
                <div key={i} onClick={() => setText(s)} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, border: `1px solid ${C.border}`, padding: "0.2rem 0.5rem", borderRadius: 1, cursor: "pointer", letterSpacing: "0.1em", transition: "color 0.2s, border-color 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.borderColor = C.goldDim; }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.textDim; e.currentTarget.style.borderColor = C.border; }}
                >SAMPLE {i + 1}</div>
              ))}
            </div>
            <div onClick={analyze} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", background: loading ? C.bg3 : `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, color: loading ? C.textDim : "#FFF", padding: "0.65rem", textAlign: "center", borderRadius: 2, cursor: loading ? "default" : "pointer", transition: "background 0.3s" }}>{loading ? "ANALYZING ···" : "ANALYZE REVIEW →"}</div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative", overflow: "hidden" }}>
            {result && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: result.sentiment === "POSITIVE" ? `linear-gradient(90deg, ${C.green}, transparent)` : result.sentiment === "NEGATIVE" ? `linear-gradient(90deg, ${C.red}, transparent)` : `linear-gradient(90deg, ${C.neutral}, transparent)` }} />}
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>Prediction Output</div>
            {!result && !loading && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.textDim, fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", border: `1px dashed ${C.border}`, borderRadius: 2, minHeight: 160 }}>Awaiting Input</div>}
            {loading && <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: C.gold, fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.12em", animation: "pulse 1s ease-in-out infinite", minHeight: 160 }}>PROCESSING···</div>}
            {result && !loading && (
              <>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3.8rem", letterSpacing: "0.05em", lineHeight: 1, color: result.sentiment === "POSITIVE" ? C.green : result.sentiment === "NEGATIVE" ? C.red : C.neutral, marginBottom: "0.5rem" }}>{result.sentiment}</div>
                  <SentimentPill sentiment={result.sentiment} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ background: C.bg3, padding: "0.85rem", borderRadius: 2 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Predicted Stars</div>
                    <Stars n={result.stars} />
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: C.goldLight, marginTop: "0.2rem" }}>{result.stars}.0 / 5.0</div>
                  </div>
                  <div style={{ background: C.bg3, padding: "0.85rem", borderRadius: 2 }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Confidence</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: C.goldLight }}>{result.conf}</div>
                    <div style={{ height: 3, background: C.bg2, borderRadius: 2, marginTop: "0.4rem" }}>
                      <div style={{ height: "100%", width: `${result.conf * 100}%`, background: `linear-gradient(90deg, ${C.goldDim}, ${C.goldLight})`, borderRadius: 2 }} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── stats bar ───────────────────────────────────────────── */
function StatsBar() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "3rem", borderBottom: `1px solid ${C.border}`, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: C.border }}>
      {STATS.map((s, i) => (
        <div key={s.label} style={{ background: C.surface, padding: "1.75rem 2rem", animation: visible ? `fadeUp 0.5s ease ${i * 0.1}s both` : "none" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.6rem", color: C.goldLight, letterSpacing: "0.04em", lineHeight: 1, marginBottom: "0.3rem" }}>{s.value}</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{s.label}</div>
        </div>
      ))}
    </section>
  );
}

/* ── features ────────────────────────────────────────────── */
function Features() {
  return (
    <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Core Capabilities</div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", letterSpacing: "0.06em", color: C.text }}>Intelligence at Every Layer</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: C.border }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{ background: C.surface, padding: "2.25rem", transition: "background 0.2s", cursor: "default", animation: `fadeUp 0.5s ease ${0.1 + i * 0.1}s both` }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg2}
              onMouseLeave={e => e.currentTarget.style.background = C.surface}
            >
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem", color: C.gold, marginBottom: "1rem" }}>{f.icon}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.08em", color: C.goldLight, marginBottom: "0.75rem" }}>{f.title}</div>
              <p style={{ fontSize: "0.82rem", color: C.textDim, lineHeight: 1.8 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── live replay feed ────────────────────────────────────── */
function ReplayFeed() {
  const [rows, setRows] = useState(REVIEWS.slice(0, 3));
  const [idx, setIdx] = useState(3);
  useEffect(() => {
    const id = setInterval(() => {
      setRows(prev => [...prev.slice(-4), REVIEWS[idx % REVIEWS.length]]);
      setIdx(i => i + 1);
    }, 2800);
    return () => clearInterval(id);
  }, [idx]);

  return (
    <section style={{ padding: "5rem 3rem", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Live Signal Feed</div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.4rem", letterSpacing: "0.06em", color: C.text }}>Review Signals, In Real Time</h2>
          </div>
          <Badge>● STREAMING PREDICTIONS</Badge>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["ASIN", "Category", "Review Excerpt", "Sentiment", "Stars", "Confidence"].map(h => (
                <th key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "left", padding: "0.9rem 1rem", borderBottom: `1px solid ${C.border}` }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}44`, transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg3}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "0.85rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.gold }}>{r.asin}</td>
                  <td style={{ padding: "0.85rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim }}>{r.category}</td>
                  <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: C.text, maxWidth: 280 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.excerpt}</div></td>
                  <td style={{ padding: "0.85rem 1rem" }}><SentimentPill sentiment={r.sentiment} /></td>
                  <td style={{ padding: "0.85rem 1rem" }}><Stars n={r.stars} /></td>
                  <td style={{ padding: "0.85rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.gold }}>{r.confidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ─────────────────────────────────────────────────── */
function CTA() {
  return (
    <section style={{ padding: "6rem 3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 700, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.goldLight}25 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Get Started Today</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.05em", color: C.text, marginBottom: "1.2rem", lineHeight: 1 }}>
          Know Your Reviews<br />
          <span style={{ background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Before They Go Live.</span>
        </h2>
        <p style={{ fontSize: "0.88rem", color: C.textDim, lineHeight: 1.8, maxWidth: 500, margin: "0 auto 2.5rem" }}>Join 1,200+ Amazon sellers and brand managers using REVIEW SENSE to proactively manage customer sentiment.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, color: "#FFF", padding: "0.8rem 2.2rem", borderRadius: 2, cursor: "pointer" }}>Start Free Trial →</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.gold, padding: "0.8rem 2.2rem", borderRadius: 2, border: `1px solid ${C.goldDim}`, cursor: "pointer" }}>View API Docs</div>
        </div>
      </div>
    </section>
  );
}

/* ── footer ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding: "2rem 3rem", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.15em", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>REVIEW SENSE</div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.1em" }}>© 2026 REVIEW SENSE INTELLIGENCE · ALL RIGHTS RESERVED</div>
      <div style={{ display: "flex", gap: "1.5rem" }}>
        {["Privacy", "Terms", "Status"].map(l => (
          <span key={l} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = C.gold}
            onMouseLeave={e => e.target.style.color = C.textDim}
          >{l}</span>
        ))}
      </div>
    </footer>
  );
}

/* ── root ────────────────────────────────────────────────── */
function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #FAF7F2; scroll-behavior: smooth; }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        textarea:focus { border-color: #A8742A !important; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#FAF7F2; }
        ::-webkit-scrollbar-thumb { background:#E0D5C4; border-radius:3px; }
      `}</style>
      <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
        <TopBar />
        <Nav />
        <Hero />
        <DemoWidget />
        <StatsBar />
        <Features />
        <ReplayFeed />
        <CTA />
        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/writeup" element={<WriteUp />} />
    </Routes>
  );
}