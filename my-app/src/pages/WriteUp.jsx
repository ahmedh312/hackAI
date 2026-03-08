import { useNavigate } from "react-router-dom";

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

function Section({ label, title, children }) {
  return (
    <div style={{ marginBottom: "3.5rem" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.4rem" }}>{label}</div>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem", letterSpacing: "0.06em", color: C.text, marginBottom: "1.25rem" }}>{title}</h2>
      <div style={{ fontSize: "0.88rem", color: C.textDim, lineHeight: 1.9, display: "flex", flexDirection: "column", gap: "0.9rem" }}>{children}</div>
    </div>
  );
}

function Callout({ color = C.goldDim, children }) {
  return (
    <div style={{ background: `${color}12`, border: `1px solid ${color}44`, borderLeft: `3px solid ${color}`, padding: "0.9rem 1.25rem", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: C.text, letterSpacing: "0.04em", lineHeight: 1.7 }}>
      {children}
    </div>
  );
}

function Tag({ children, color = C.goldLight }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", padding: "0.2rem 0.55rem", borderRadius: 1, color, background: `${color}18`, border: `1px solid ${color}44`, marginRight: "0.4rem" }}>
      {children}
    </span>
  );
}

function MetricRow({ label, gemini, baseline, delta }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1px", background: C.border }}>
      <div style={{ background: C.surface, padding: "0.85rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.68rem", color: C.textDim, letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ background: C.surface, padding: "0.85rem 1rem", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: C.goldLight }}>{gemini}</div>
      <div style={{ background: C.surface, padding: "0.85rem 1rem", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: C.textDim }}>{baseline}</div>
      <div style={{ background: C.surface, padding: "0.85rem 1rem", fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.2rem", color: C.green }}>{delta}</div>
    </div>
  );
}

export default function WriteUp() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #FAF7F2; }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:#FAF7F2; }
        ::-webkit-scrollbar-thumb { background:#E0D5C4; border-radius:3px; }
      `}</style>

      <div style={{ background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh" }}>
        <TopBar />

        {/* Nav */}
        <nav style={{ padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, background: `${C.bg}F5`, backdropFilter: "blur(8px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div onClick={() => navigate("/")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.12em", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = C.textDim}
            >← HOME</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.9rem", letterSpacing: "0.15em", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>REVIEW SENSE</span>
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Technical Write-Up</div>
        </nav>

        {/* Hero */}
        <div style={{ padding: "5rem 3rem 3rem", borderBottom: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: `radial-gradient(ellipse, ${C.goldLight}22 0%, transparent 70%)`, zIndex: 0 }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 860 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "1rem" }}>
              HackAI 2026 · Track: Finding Signal in Noise: Applied NLP
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.8rem, 6vw, 5rem)", letterSpacing: "0.04em", lineHeight: 0.95, marginBottom: "1.25rem" }}>
              <span style={{ background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Review Sense:</span><br />
              Signal Intelligence Pipeline
            </h1>
            <p style={{ fontSize: "0.9rem", color: C.textDim, lineHeight: 1.8, maxWidth: 620, marginBottom: "1.5rem" }}>
              A full end-to-end NLP pipeline that ingests raw Amazon product reviews and produces a calibrated sentiment signal — enabling precise, threshold-driven escalation decisions at scale.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {["Gemini 3.1 Flash Lite", "Python", "React", "Flask", "Hugging Face", "SupaBase", "Baseline Comparison", "Live Dashboard"].map(t => <Tag key={t}>{t}</Tag>)}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "4rem 3rem" }}>

          <Section label="01 — Problem Statement" title="Too Much Text, Not Enough Signal">
            <p>Product review volume at scale is unmanageable by humans. A mid-size electronics seller on Amazon receives thousands of reviews per week. Most teams respond with one of two bad options: ignore them entirely, or pay people to read them. Neither converts text into a decision.</p>
            <p>The real question isn't "what do customers think?" — it's "which reviews require action right now?" A product quietly accumulating negative feedback about a hardware defect is a different problem than a product with mixed opinions about its price. Treating them the same wastes resources and misses the signal.</p>
            <Callout color={C.goldDim}>
              Goal: convert raw review text into a calibrated confidence-weighted signal that tells a team exactly which reviews need immediate human attention — and which don't.
            </Callout>
          </Section>

          <Section label="02 — Dataset" title="Amazon Electronics Reviews">
            <p>The RIQE track dataset was unavailable due to copyright restrictions at the time of the hackathon. We sourced a comparable substitute from HuggingFace: a large corpus of Amazon Electronics product reviews with star ratings, review text, ASIN identifiers, and timestamps.</p>
            <p>Loading the dataset was a challenge in itself — the raw files were several gigabytes, and naive loading approaches either ran out of memory or took prohibitively long. We resolved this by streaming the CSV row-by-row rather than loading it all into memory at once, and scraping only the fields relevant to our pipeline: text, rating, ASIN, and timestamp.</p>
            <p>Star ratings served as ground truth labels: 4–5 stars = positive, 1–2 stars = negative, 3 stars = neutral. This mapping is imperfect — sarcastic 5-star reviews exist — but holds reliably at scale. Timestamp ordering was respected throughout and no threshold tuning was performed on future data.</p>
            <p>A secondary labeled dataset was prepared by a teammate using a HuggingFace zero-shot transformer to tag reviews by complaint topic — charging, durability, performance, portability, and others. Finding a pretrained model suitable for this multi-label topic classification was one of the harder research problems of the hackathon. Most off-the-shelf sentiment models only output positive/negative — we needed something that could assign domain-specific complaint categories without fine-tuning on labeled data we didn't have. Zero-shot classification turned out to be the right fit, and working through that process gave the team hands-on experience with model selection, featurization, and extracting structured signals from transformer outputs.</p>
          </Section>

          <Section label="03 — Architecture" title="Text In. Signal Out.">
            <p>The pipeline has three layers. The ingestion layer reads timestamped reviews in chronological order from CSV. The analysis layer sends batches of 15 reviews per API call to Gemini Flash Lite, requesting a sentiment label, predicted star rating, confidence score, and topic per review. The serving layer exposes a Flask REST API that a React dashboard polls every 500ms.</p>
            <Callout color={C.neutral}>
              CSV → async Python processor (batch=15, concurrency=50) → Gemini API → results.jsonl → Flask API → React Dashboard
            </Callout>
            <p>Results stream to a <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", background: C.bg3, padding: "0.1rem 0.3rem" }}>results.jsonl</code> file in append mode, enabling resume on failure and real-time consumption without loading all results into memory. At peak throughput the pipeline processes approximately 88 reviews per second.</p>
          </Section>

          <Section label="04 — The Baseline" title="Why Not Just Use Keywords?">
            <p>Before claiming Gemini adds value, we needed to prove it. We built a parallel keyword classifier — a bag-of-words approach matching review text against curated positive and negative word lists — and ran every review through both classifiers simultaneously.</p>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden", marginTop: "0.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1px", background: C.border }}>
                {["Metric", "Gemini Pipeline", "Keyword Baseline", "Δ"].map(h => (
                  <div key={h} style={{ background: C.bg2, padding: "0.75rem 1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>{h}</div>
                ))}
              </div>
              <MetricRow label="Overall Accuracy" gemini="87%+" baseline="~61%" delta="+26pp" />
              <MetricRow label="Neutral Detection" gemini="Calibrated" baseline="Defaults neutral" delta="Major lift" />
              <MetricRow label="Confidence Score" gemini="0.65 – 0.99" baseline="None" delta="New signal" />
              <MetricRow label="Topic Classification" gemini="Per review" baseline="None" delta="New signal" />
            </div>
            <p>The keyword baseline collapses on neutral reviews — it defaults everything ambiguous to neutral, missing a large class of genuinely mixed sentiment. More critically, it produces no confidence score, which means it cannot power a threshold-based decision rule. Gemini provides both.</p>
          </Section>

          <Section label="05 — The Decision Rule" title="Making the Signal Actionable">
            <p>A classification model that outputs labels is not yet a decision system. The step that matters is converting model output into an action threshold — and being honest about the tradeoffs of where you set it.</p>
            <Callout color={C.red}>
              Rule: confidence ≥ 0.85 AND predicted label = NEGATIVE → escalate for immediate human review
            </Callout>
            <p>This rule targets the high-confidence tail of negative predictions. At 0.85 confidence, Gemini is significantly more accurate than average, which means the escalation queue is high-precision. A support team reads a small fraction of total volume to catch the vast majority of genuine product issues.</p>
            <p>The tradeoff is recall: some true negatives with lower confidence scores slip through. We consider this acceptable — the cost of a false alarm is a few seconds of human time, while the cost of missing a systematic hardware defect is far higher.</p>
          </Section>

          <Section label="06 — Failures" title="What Went Wrong">
            <p><strong style={{ color: C.text }}>Dataset access.</strong> The provided track dataset was unavailable due to copyright. We pivoted to HuggingFace within the first hour, but it means our results aren't directly comparable to teams using the official dataset.</p>
            <p><strong style={{ color: C.text }}>Data loading at scale.</strong> The raw dataset was several gigabytes. Initial attempts to load it fully into memory caused crashes and multi-minute delays. We rewrote the ingestion layer to stream row-by-row and filter to only the fields we needed, which resolved both the memory and speed issues.</p>
            <p><strong style={{ color: C.text }}>Finding the right pretrained model for topic labeling.</strong> Most off-the-shelf NLP models only do binary or coarse sentiment classification. Finding a model that could assign domain-specific complaint categories — without needing labeled training data we didn't have — took significant research time. Most candidates we evaluated were either too generic, required fine-tuning, or didn't support the multi-label format we needed. Zero-shot classification was the solution but it wasn't obvious upfront.</p>
            <p><strong style={{ color: C.text }}>CORS blocking DELETE requests.</strong> Flask-CORS only whitelists GET and POST by default. Our dashboard reset endpoint silently failed for several hours until we identified that DELETE needed to be explicitly allowed.</p>
            <p><strong style={{ color: C.text }}>Async Flask routes.</strong> Using <code style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", background: C.bg3, padding: "0.1rem 0.3rem" }}>async def</code> in plain Flask caused 500 errors. Flask requires a separate extension for async route support.</p>
            <p><strong style={{ color: C.text }}>Resume index drift.</strong> On pipeline restart, re-enumerating from zero caused index collisions with already-processed results. Fixed by offsetting new indices from the maximum already-written index.</p>
            <p><strong style={{ color: C.text }}>Reset not clearing pipeline state.</strong> Deleting results.jsonl without stopping the running pipeline meant the process kept appending from memory. Fixed by creating an empty file on reset so the resume logic sees a clean slate.</p>
          </Section>

          <Section label="07 — Hard Cases" title="Where the Model Struggles">
            <p><strong style={{ color: C.text }}>Sarcasm.</strong> "Oh great, another product that dies after a week" contains no negative keywords and reads as positive to a naive classifier. Gemini catches most of these but not all — sarcasm without strong contextual cues remains a genuine weak point.</p>
            <p><strong style={{ color: C.text }}>Qualified positives.</strong> "Great product but the packaging was destroyed on arrival" — the reviewer intends 4 stars but the text contains a negative clause. Gemini is occasionally over-cautious here, producing neutral predictions where positive would be correct.</p>
            <p><strong style={{ color: C.text }}>Very short reviews.</strong> Single-word entries like "Perfect!" or "Garbage" produce lower confidence and more frequent errors. The pipeline falls back to a 0.65 confidence floor for these, keeping them below the escalation threshold.</p>
          </Section>

          <Section label="08 — Accomplishments" title="What We're Proud Of">
            <p><strong style={{ color: C.text }}>Learning curve on NLP models.</strong> Coming into this hackathon, the team had limited hands-on experience with production NLP pipelines. Working through the problem of topic labeling — evaluating pretrained models, understanding featurization, learning how zero-shot classifiers extract signal without task-specific training data — was one of the most valuable parts of the experience. That knowledge directly shaped the final pipeline architecture.</p>
            <p><strong style={{ color: C.text }}>Taming a large dataset.</strong> Loading, filtering, and streaming several gigabytes of review data efficiently was a real engineering problem, not a toy exercise. Getting that ingestion layer right unlocked everything else — without it the pipeline couldn't run at scale.</p>
            <Callout color={C.green}>
              End-to-end in 24 hours: raw CSV → async Gemini pipeline → live React dashboard → actionable decision rule. Everything works.
            </Callout>
          </Section>

          <Section label="09 — What's Next" title="If We Had More Time">
            <p><strong style={{ color: C.text }}>Two-tier architecture.</strong> A fast local model handles bulk triage at near-zero cost. Gemini is reserved only for low-confidence borderline cases. Throughput increases dramatically while accuracy is preserved where it matters most.</p>
            <p><strong style={{ color: C.text }}>Calibration curves.</strong> A proper reliability diagram would verify that a confidence score of 0.85 actually corresponds to 85% empirical accuracy. Early results suggest the scores are well-behaved but this needs formal validation before production use.</p>
            <p><strong style={{ color: C.text }}>Signal decay tracking.</strong> Measuring whether early negative sentiment predicts later product failure rates would extend this from a classification tool into a genuine early-warning system — directly inspired by the quantitative finance signal validation framing of this track.</p>
            <p><strong style={{ color: C.text }}>Supabase persistence.</strong> Moving from a flat jsonl file to a proper database would enable multi-user querying, historical comparisons across product categories, and dashboard access without running a local Flask server.</p>
          </Section>

        </div>

        {/* Footer */}
        <footer style={{ padding: "2rem 3rem", borderTop: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.3rem", letterSpacing: "0.15em", background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold}, ${C.goldDim})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>REVIEW SENSE</div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.1em" }}>© 2026 REVIEW SENSE INTELLIGENCE · HACKAI SUBMISSION</div>
          <div onClick={() => navigate("/")} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.1em", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.gold}
            onMouseLeave={e => e.currentTarget.style.color = C.textDim}
          >← BACK TO HOME</div>
        </footer>
      </div>
    </>
  );
}