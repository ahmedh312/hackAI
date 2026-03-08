import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from "recharts";

/* ── palette — mirrors the landing page exactly ─────────── */
const C = {
  gold: "#A8742A", goldLight: "#C9943C", goldDim: "#7A5520",
  bg: "#FAF7F2", bg2: "#F3EDE3", bg3: "#EDE4D6",
  surface: "#FFFFFF", border: "#E0D5C4",
  text: "#2A2218", textDim: "#9A8E7A",
  green: "#2E8A56", red: "#B8392E", neutral: "#4A6290",
};

function TopBar() {
  return <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.goldLight}, ${C.gold}, transparent)`, animation: "shimmer 3s ease-in-out infinite" }} />;
}

function LiveDot({ color = C.green, active = true }) {
  const [on, setOn] = useState(true);
  useEffect(() => { if (!active) return; const id = setInterval(() => setOn(v => !v), 750); return () => clearInterval(id); }, [active]);
  return <div style={{ width: 7, height: 7, borderRadius: "50%", background: active ? color : C.textDim, opacity: active ? (on ? 1 : 0.3) : 0.4, transform: on ? "scale(1)" : "scale(0.7)", transition: "opacity 0.3s, transform 0.3s", flexShrink: 0 }} />;
}

function Badge({ children, color = C.green, active = true }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: active ? color : C.textDim, letterSpacing: "0.14em", border: `1px solid ${active ? color : C.border}44`, padding: "0.3rem 0.7rem", borderRadius: 2, transition: "all 0.3s" }}>
      <LiveDot color={color} active={active} />
      {children}
    </div>
  );
}

function SentimentPill({ label }) {
  const map = {
    POSITIVE: { bg: "rgba(46,138,86,0.12)", color: C.green, border: "rgba(46,138,86,0.3)" },
    NEGATIVE: { bg: "rgba(184,57,46,0.12)", color: C.red, border: "rgba(184,57,46,0.3)" },
    NEUTRAL:  { bg: "rgba(74,98,144,0.12)", color: C.neutral, border: "rgba(74,98,144,0.3)" },
  };
  const s = map[label] || map.NEUTRAL;
  return <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.1em", padding: "0.18rem 0.5rem", borderRadius: 1, color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>{label}</span>;
}

function Stars({ n, size = "0.72rem" }) {
  const count = Math.min(5, Math.max(0, Math.round(n || 0)));
  return <span style={{ color: C.gold, fontSize: size, letterSpacing: 1 }}>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

function Nav({ running, total }) {
  return (
    <nav style={{ padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, background: `${C.bg}F5`, backdropFilter: "blur(8px)", boxShadow: "0 1px 0 #E0D5C4" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.7rem" }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.15em", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>REVIEW SENSE</span>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Pipeline Dashboard</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {total > 0 && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: C.textDim, letterSpacing: "0.1em" }}>{total.toLocaleString()} REVIEWS PROCESSED</span>}
        <Badge active={running}>{running ? "● PIPELINE RUNNING" : total > 0 ? "◼ PIPELINE STOPPED" : "○ PIPELINE IDLE"}</Badge>
      </div>
    </nav>
  );
}

function StatCard({ label, value, sub, color, animate }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem 2rem", flex: 1, minWidth: 140, animation: animate ? "fadeUp 0.5s ease both" : "none", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color || C.gold}, transparent)` }} />
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.6rem" }}>{label}</div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.8rem", color: color || C.goldLight, lineHeight: 1, letterSpacing: "0.03em" }}>{value}</div>
      {sub && <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, marginTop: "0.4rem", letterSpacing: "0.08em" }}>{sub}</div>}
    </div>
  );
}

function ConfusionMatrix({ matrix }) {
  const labels = ["POSITIVE", "NEUTRAL", "NEGATIVE"];
  const short = { POSITIVE: "POS", NEUTRAL: "NEU", NEGATIVE: "NEG" };
  const lc = { POSITIVE: C.green, NEUTRAL: C.neutral, NEGATIVE: C.red };
  const maxVal = Math.max(...labels.flatMap(a => labels.map(p => matrix[a]?.[p] || 0)), 1);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1.25rem" }}>Confusion Matrix</div>
      <div style={{ display: "grid", gridTemplateColumns: "44px repeat(3, 1fr)", gap: 5 }}>
        <div />
        {labels.map(l => <div key={l} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: lc[l], letterSpacing: "0.1em", textAlign: "center", paddingBottom: 4, fontWeight: 600 }}>{short[l]}</div>)}
        {labels.map(actual => (
          <>
            <div key={actual + "_r"} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.56rem", color: lc[actual], display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6, fontWeight: 600 }}>{short[actual]}</div>
            {labels.map(pred => {
              const v = matrix[actual]?.[pred] || 0;
              const intensity = v / maxVal;
              const isDiag = actual === pred;
              return (
                <div key={pred} style={{ aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", background: isDiag ? `rgba(46,138,86,${0.08 + intensity * 0.55})` : `rgba(184,57,46,${intensity * 0.35})`, border: isDiag ? `1px solid rgba(46,138,86,${0.2 + intensity * 0.4})` : `1px solid ${C.border}`, color: v > 0 ? (isDiag ? C.green : C.red) : C.border, borderRadius: 2, minHeight: 42, transition: "all 0.4s ease" }}>
                  {v || "·"}
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, marginTop: "0.85rem", textAlign: "center", letterSpacing: "0.1em" }}>ROWS = ACTUAL · COLS = PREDICTED</div>
    </div>
  );
}

function AccuracyTrend({ history }) {
  if (history.length < 3) return null;
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Accuracy Over Time</div>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={history}>
          <XAxis dataKey="n" tick={{ fill: C.textDim, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: C.textDim, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
          <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2, fontFamily: "'DM Mono', monospace", fontSize: 11 }} formatter={v => [`${v.toFixed(1)}%`, "Accuracy"]} />
          <ReferenceLine y={80} stroke={C.goldDim} strokeDasharray="3 3" strokeWidth={1} />
          <Line type="monotone" dataKey="acc" stroke={C.goldLight} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.gold }} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, marginTop: "0.5rem", letterSpacing: "0.08em" }}>— DASHED = 80% TARGET THRESHOLD</div>
    </div>
  );
}

function DistributionChart({ results }) {
  const c = (key) => ({
    POSITIVE: results.filter(r => r[key] === "POSITIVE").length,
    NEUTRAL:  results.filter(r => r[key] === "NEUTRAL").length,
    NEGATIVE: results.filter(r => r[key] === "NEGATIVE").length,
  });
  const actual = c("actual_label");
  const pred   = c("predicted_label");
  const data = [
    { label: "Positive", actual: actual.POSITIVE, predicted: pred.POSITIVE },
    { label: "Neutral",  actual: actual.NEUTRAL,  predicted: pred.NEUTRAL  },
    { label: "Negative", actual: actual.NEGATIVE, predicted: pred.NEGATIVE },
  ];
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Predicted vs Actual Distribution</div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={data} barGap={3} barCategoryGap="30%">
          <XAxis dataKey="label" tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.textDim, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} width={24} />
          <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2, fontFamily: "'DM Mono', monospace", fontSize: 11 }} />
          <Bar dataKey="actual" name="Actual" fill={C.bg3} radius={[3, 3, 0, 0]} />
          <Bar dataKey="predicted" name="Predicted" radius={[3, 3, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={[C.green, C.neutral, C.red][i]} fillOpacity={0.8} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
        {[{ color: C.bg3, border: C.border, label: "ACTUAL" }, { color: C.gold, label: "PREDICTED" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, background: l.color, border: l.border ? `1px solid ${l.border}` : "none", borderRadius: 1 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.1em" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConfidenceChart({ results }) {
  const buckets = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}–${(i + 1) * 10}`,
    count:   results.filter(r => r.confidence >= i * 0.1 && r.confidence < (i + 1) * 0.1).length,
    correct: results.filter(r => r.confidence >= i * 0.1 && r.confidence < (i + 1) * 0.1 && r.correct).length,
  }));
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>Confidence Distribution</div>
      <ResponsiveContainer width="100%" height={150}>
        <BarChart data={buckets} barGap={2} barCategoryGap="15%">
          <XAxis dataKey="range" tick={{ fill: C.textDim, fontSize: 8, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: C.textDim, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} width={24} />
          <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2, fontFamily: "'DM Mono', monospace", fontSize: 11 }} />
          <Bar dataKey="count"   name="Total"   fill={`${C.goldDim}55`} radius={[2, 2, 0, 0]} />
          <Bar dataKey="correct" name="Correct" fill={C.goldLight} fillOpacity={0.85} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.75rem" }}>
        {[{ color: `${C.goldDim}55`, label: "TOTAL" }, { color: C.goldLight, label: "CORRECT" }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, background: l.color, borderRadius: 1 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.1em" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BaselineComparison({ results }) {
  if (results.length === 0) return null;
  const total = results.length;
  const geminiCorrect   = results.filter(r => r.correct).length;
  const baselineCorrect = results.filter(r => r.baseline_correct).length;
  const geminiAcc   = geminiCorrect   / total * 100;
  const baselineAcc = baselineCorrect / total * 100;
  const delta = geminiAcc - baselineAcc;

  const data = [
    { name: "Keyword Baseline", acc: parseFloat(baselineAcc.toFixed(1)), fill: C.textDim },
    { name: "Gemini Pipeline",  acc: parseFloat(geminiAcc.toFixed(1)),   fill: C.goldLight },
  ];

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${C.goldLight}, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Baseline Comparison</div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: delta >= 0 ? C.green : C.red, letterSpacing: "0.05em" }}>
          {delta >= 0 ? "+" : ""}{delta.toFixed(1)}pp
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, marginLeft: 6, letterSpacing: "0.1em" }}>vs keyword rules</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
        {[
          { label: "Keyword Baseline", acc: baselineAcc, color: C.textDim },
          { label: "Gemini Pipeline",  acc: geminiAcc,   color: C.goldLight },
        ].map(({ label, acc, color }) => (
          <div key={label} style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, padding: "1rem 1.25rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2.2rem", color, lineHeight: 1 }}>{acc.toFixed(1)}%</div>
            <div style={{ marginTop: "0.5rem", height: 4, background: C.border, borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${acc}%`, background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
            </div>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barCategoryGap="40%">
          <XAxis dataKey="name" tick={{ fill: C.textDim, fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: C.textDim, fontSize: 9, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} width={32} tickFormatter={v => `${v}%`} />
          <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 2, fontFamily: "'DM Mono', monospace", fontSize: 11 }} formatter={v => [`${v}%`, "Accuracy"]} />
          <ReferenceLine y={80} stroke={C.goldDim} strokeDasharray="3 3" strokeWidth={1} />
          <Bar dataKey="acc" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.textDim, marginTop: "0.85rem", letterSpacing: "0.08em", textAlign: "center" }}>
        GEMINI CORRECTLY CLASSIFIES {Math.max(0, Math.round(delta / 100 * total)).toLocaleString()} MORE REVIEWS THAN KEYWORD RULES
      </div>
    </div>
  );
}

function LiveFeed({ items }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [items]);
  const cols = "80px 1fr 90px 90px 100px 60px";
  const headers = ["ASIN", "EXCERPT", "ACTUAL", "PREDICTED", "STARS ↑ACT ↓PRED", "CONF"];
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: "1.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Live Signal Feed</div>
        <Badge active={items.length > 0}>● STREAMING PREDICTIONS</Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: "0.5rem", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${C.border}`, marginBottom: "0.25rem" }}>
        {headers.map(h => <div key={h} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, letterSpacing: "0.1em" }}>{h}</div>)}
      </div>
      <div ref={ref} style={{ height: 300, overflowY: "auto" }}>
        {items.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.textDim, letterSpacing: "0.12em" }}>AWAITING PIPELINE START</div>
        )}
        {items.slice(-50).map((item, i) => (
          <div key={i}
            style={{ display: "grid", gridTemplateColumns: cols, gap: "0.5rem", padding: "0.65rem 0.75rem", background: item.correct ? "transparent" : "rgba(184,57,46,0.04)", borderBottom: `1px solid ${C.border}33`, borderLeft: `2px solid ${item.correct ? C.green : C.red}`, animation: "fadeUp 0.25s ease both", transition: "background 0.2s", cursor: "default" }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg3}
            onMouseLeave={e => e.currentTarget.style.background = item.correct ? "transparent" : "rgba(184,57,46,0.04)"}
          >
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.gold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.asin}</div>
            <div style={{ fontSize: "0.72rem", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.text_snippet}</div>
            <div><SentimentPill label={item.actual_label} /></div>
            <div><SentimentPill label={item.predicted_label} /></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* ✅ Fixed: was item.actual_stars (undefined) — pipeline outputs actual_rating */}
              <Stars n={item.actual_rating} size="0.6rem" />
              <Stars n={item.predicted_stars} size="0.6rem" />
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: item.confidence > 0.8 ? C.green : item.confidence > 0.6 ? C.gold : C.textDim }}>
              {((item.confidence || 0) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [results, setResults]       = useState([]);
  const [running, setRunning]       = useState(false);
  const [accHistory, setAccHistory] = useState([]);

  const intervalRef    = useRef(null);
  const prevLengthRef  = useRef(0);

  const total   = results.length;
  const correct = results.filter(r => r.correct).length;
  const accuracy = total > 0 ? (correct / total * 100) : 0;
  const avgConf  = total > 0 ? results.reduce((s, r) => s + (r.confidence || 0), 0) / total : 0;
  const avgErr   = total > 0 ? results.reduce((s, r) => s + (r.star_error || 0), 0) / total : 0;

  const matrix = {
    POSITIVE: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 },
    NEUTRAL:  { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 },
    NEGATIVE: { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 },
  };
  results.forEach(r => { if (matrix[r.actual_label]) matrix[r.actual_label][r.predicted_label]++; });

  const start = useCallback(() => {
    setResults([]);
    setAccHistory([]);
    prevLengthRef.current = 0;
    setRunning(true);

    intervalRef.current = setInterval(async () => {
      try {
        const res  = await fetch("http://localhost:8000/results");
        const data = await res.json();

        const normalized = data.map(r => ({
          ...r,
          actual_label:     (r.actual_label    || "neutral").toUpperCase(),
          predicted_label:  (r.predicted_label || "neutral").toUpperCase(),
          baseline_label:   (r.baseline_label  || "neutral").toUpperCase(),
          correct:          (r.predicted_label || "").toLowerCase() === (r.actual_label || "").toLowerCase(),
          baseline_correct: (r.baseline_label  || "").toLowerCase() === (r.actual_label || "").toLowerCase(),
        }));

        setResults(normalized);

        if (normalized.length > 0 && normalized.length - prevLengthRef.current >= 50) {
          prevLengthRef.current = normalized.length;
          const c = normalized.filter(r => r.correct).length;
          setAccHistory(h => [...h, {
            n:   normalized.length,
            acc: parseFloat((c / normalized.length * 100).toFixed(1)),
          }]);
        }
      } catch (e) {
        console.error("API not reachable — is api.py running?", e);
      }
    }, 500);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
    setRunning(false);
  }, []);

  // ✅ Fixed: reset now calls DELETE /results on the server to clear results.jsonl
  //    so the pipeline doesn't resume from old data on next run
  const reset = useCallback(async () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setResults([]);
    setAccHistory([]);
    prevLengthRef.current = 0;
    try {
      await fetch("http://localhost:8000/results", { method: "DELETE" });
    } catch (e) {
      console.error("Could not reset server results:", e);
    }
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const accColor = accuracy >= 80 ? C.green : accuracy >= 60 ? C.goldLight : C.red;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #FAF7F2; }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #F3EDE3; }
        ::-webkit-scrollbar-thumb { background: #E0D5C4; border-radius: 3px; }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
        <TopBar />
        <Nav running={running} total={total} />

        <main style={{ padding: "2.5rem 3rem", maxWidth: 1300, margin: "0 auto" }}>

          {/* header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                Gemini 2.0 Flash Lite · Live Analysis
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "0.05em", color: C.text, lineHeight: 1 }}>
                <span style={{ background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Signal</span>{" "}Intelligence Pipeline
              </h1>
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {!running
                ? <div onClick={start} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, color: "#FFF", padding: "0.65rem 1.75rem", borderRadius: 2 }}>▶ Run Pipeline</div>
                : <div onClick={stop}  style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", background: "rgba(184,57,46,0.1)", border: `1px solid rgba(184,57,46,0.3)`, color: C.red, padding: "0.65rem 1.75rem", borderRadius: 2 }}>■ Stop</div>
              }
              {total > 0 && !running && (
                <div onClick={reset} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer", background: C.bg3, border: `1px solid ${C.border}`, color: C.textDim, padding: "0.65rem 1.25rem", borderRadius: 2 }}>↺ Reset</div>
              )}
            </div>
          </div>

          {/* Decision Rule Banner */}
          <div style={{ background: "rgba(184,57,46,0.06)", border: `1px solid rgba(184,57,46,0.25)`, borderLeft: `3px solid ${C.red}`, padding: "0.9rem 1.5rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Decision Rule</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.78rem", color: C.text, letterSpacing: "0.05em" }}>
                confidence <span style={{ color: C.goldLight }}>≥ 0.85</span> + predicted <span style={{ color: C.red }}>NEGATIVE</span> → <span style={{ color: C.red, fontWeight: 600 }}>escalate for review</span>
              </span>
            </div>
            {total > 0 && (() => {
              const escalated = results.filter(r => r.confidence >= 0.85 && r.predicted_label === "NEGATIVE");
              const trueEscalations = escalated.filter(r => r.actual_label === "NEGATIVE");
              const precision = escalated.length > 0 ? (trueEscalations.length / escalated.length * 100).toFixed(0) : 0;
              return (
                <div style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: C.red, lineHeight: 1 }}>{escalated.length.toLocaleString()}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, letterSpacing: "0.1em" }}>ESCALATED</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: C.green, lineHeight: 1 }}>{precision}%</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, letterSpacing: "0.1em" }}>PRECISION</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", color: C.textDim, lineHeight: 1 }}>{(escalated.length / total * 100).toFixed(1)}%</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.52rem", color: C.textDim, letterSpacing: "0.1em" }}>OF VOLUME</div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* stat strip */}
          <div style={{ display: "flex", gap: "1px", background: C.border, marginBottom: "1.5rem" }}>
            <StatCard label="Accuracy"       value={total > 0 ? `${accuracy.toFixed(1)}%` : "—"} sub={total > 0 ? `${correct} of ${total} correct` : "no data yet"} color={accColor} animate={total > 0} />
            <StatCard label="Avg Confidence" value={total > 0 ? `${(avgConf * 100).toFixed(1)}%` : "—"} sub="mean gemini certainty" color={C.neutral} animate={total > 0} />
            <StatCard label="Avg Star Error" value={total > 0 ? `±${avgErr.toFixed(2)}` : "—"} sub="stars off per prediction" color={C.goldLight} animate={total > 0} />
            <StatCard label="Processed"      value={total > 0 ? total.toLocaleString() : "—"} sub={running ? "polling every 0.5s" : total > 0 ? "pipeline complete" : "idle"} color={C.goldDim} animate={total > 0} />
          </div>

          {/* charts */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 270px", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <DistributionChart results={results} />
            <ConfidenceChart   results={results} />
            <ConfusionMatrix   matrix={matrix}   />
          </div>

          {total > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <BaselineComparison results={results} />
            </div>
          )}

          {accHistory.length > 2 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <AccuracyTrend history={accHistory} />
            </div>
          )}

          <LiveFeed items={results} />

          {total === 0 && !running && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", color: C.textDim }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "5rem", color: C.border, letterSpacing: "0.1em", lineHeight: 1 }}>◎</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "1rem" }}>
                Start api.py and gemini_analysis.py, then press Run Pipeline
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}