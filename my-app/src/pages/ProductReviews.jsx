import { useState, useEffect } from "react";
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

const MOCK_PRODUCTS = [
  { id: 1, name: "Espresso Machine Pro" },
  { id: 2, name: "Ceramic Coffee Mug" },
  { id: 3, name: "Grinder Deluxe" },
];

const MOCK_REVIEWS = {
  1: {
    id: 1, name: "Espresso Machine Pro",
    reviews: [
      { id: 1, author: "Sarah Chen", rating: 5, text: "Absolutely love this machine! Makes perfect espresso every time. Highly recommend.", helpful: 24, sellerNote: "Customer is satisfied with heat consistency and extraction quality. Consider highlighting these features in marketing." },
      { id: 2, author: "John Smith", rating: 4, text: "Great build quality. Takes a bit to learn, but results are excellent.", helpful: 18, sellerNote: "User found learning curve steep. Consider creating a tutorial video or quick-start guide to improve onboarding." },
      { id: 3, author: "Maria Garcia", rating: 5, text: "Best espresso machine I've owned. Fast heating and consistent shots.", helpful: 31, sellerNote: "Fast heating is a key selling point. Ensure this feature is prominently mentioned in product descriptions." },
    ]
  },
  2: {
    id: 2, name: "Ceramic Coffee Mug",
    reviews: [
      { id: 4, author: "Chris Lee", rating: 5, text: "Beautiful design, keeps coffee hot for hours. Perfect gift!", helpful: 12, sellerNote: "Design and insulation are key strengths. Market as an ideal gift option in seasonal campaigns." },
      { id: 5, author: "Emma Watson", rating: 4, text: "Love the aesthetic. Slightly heavier than expected but worth it.", helpful: 8, sellerNote: "Weight is unexpected to some customers. Add weight specifications to product listing to manage expectations." },
    ]
  },
  3: {
    id: 3, name: "Grinder Deluxe",
    reviews: [
      { id: 6, author: "David Brown", rating: 5, text: "Grinds beans perfectly. Whisper-quiet and super durable.", helpful: 42, sellerNote: "Noise level and durability are standout features. Emphasize these benefits to appeal to frequent users." },
    ]
  }
};

function Stars({ n }) {
  return (
    <span style={{ color: C.gold, fontSize: "0.9rem", letterSpacing: 1 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

export default function ProductReviews() {
  const navigate = useNavigate();
  const [products] = useState(MOCK_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0].id);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  useEffect(() => {
    if (!selectedProductId) return;
    setLoading(true);
    setExpandedNoteId(null);
    setTimeout(() => {
      setProduct(MOCK_REVIEWS[selectedProductId]);
      setLoading(false);
    }, 250);
  }, [selectedProductId]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background: #FAF7F2; }
        @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
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
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>Product Reviews</div>
        </nav>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 3rem" }}>

          {/* Header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.58rem", color: C.textDim, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Seller Intelligence</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem", letterSpacing: "0.06em", color: C.text, marginBottom: "1.5rem" }}>Product Reviews</h1>

            {/* Product selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.1em" }}>SELECT PRODUCT</div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {products.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProductId(p.id)}
                    style={{
                      fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.1em",
                      padding: "0.45rem 1rem", border: `1px solid ${selectedProductId === p.id ? C.gold : C.border}`,
                      background: selectedProductId === p.id ? `${C.gold}18` : C.surface,
                      color: selectedProductId === p.id ? C.gold : C.textDim,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { if (selectedProductId !== p.id) { e.currentTarget.style.borderColor = C.goldDim; e.currentTarget.style.color = C.goldDim; }}}
                    onMouseLeave={e => { if (selectedProductId !== p.id) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textDim; }}}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "4rem", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: C.textDim, letterSpacing: "0.2em" }}>
              LOADING REVIEWS...
            </div>
          )}

          {/* Reviews */}
          {product && !loading && (
            <>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: C.textDim, letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
                {product.reviews.length} CUSTOMER REVIEW{product.reviews.length !== 1 ? "S" : ""}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1px", background: C.border }}>
                {product.reviews.map((review, i) => (
                  <div
                    key={review.id}
                    style={{ background: C.surface, padding: "1.75rem", animation: `fadeUp 0.4s ease ${i * 0.07}s both`, display: "flex", flexDirection: "column", gap: "1rem" }}
                  >
                    {/* Author + rating */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: C.text, letterSpacing: "0.06em" }}>{review.author}</div>
                      <Stars n={review.rating} />
                    </div>

                    {/* Review text */}
                    <p style={{ fontSize: "0.88rem", color: C.textDim, lineHeight: 1.75 }}>{review.text}</p>

                    {/* Helpful */}
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: C.textDim, letterSpacing: "0.1em" }}>
                      {review.helpful} PEOPLE FOUND THIS HELPFUL
                    </div>

                    {/* Seller note toggle */}
                    <button
                      onClick={() => setExpandedNoteId(expandedNoteId === review.id ? null : review.id)}
                      style={{
                        fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em",
                        textTransform: "uppercase", padding: "0.55rem 1rem", cursor: "pointer",
                        border: `1px solid ${C.goldDim}44`, background: expandedNoteId === review.id ? `${C.gold}18` : "transparent",
                        color: C.gold, transition: "all 0.2s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = `${C.gold}18`}
                      onMouseLeave={e => { if (expandedNoteId !== review.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      {expandedNoteId === review.id ? "▲ Hide Seller Note" : "▼ View Seller Note"}
                    </button>

                    {/* Seller note */}
                    {expandedNoteId === review.id && (
                      <div style={{ background: C.bg2, borderLeft: `3px solid ${C.gold}`, padding: "0.9rem 1.1rem", animation: "fadeUp 0.2s ease both" }}>
                        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: C.goldDim, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.4rem" }}>Seller Note</div>
                        <p style={{ fontSize: "0.82rem", color: C.text, lineHeight: 1.7 }}>{review.sellerNote}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}