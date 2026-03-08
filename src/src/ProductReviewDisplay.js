import { useState, useEffect } from "react";

const C = {
  gold: "#A8742A", goldLight: "#C9943C", goldDim: "#7A5520",
  background: "#f9f7f4", text: "#333", border: "#ddd",
};

// Mock data for testing the UI
const MOCK_PRODUCTS = [
  { id: 1, name: "Espresso Machine Pro" },
  { id: 2, name: "Ceramic Coffee Mug" },
  { id: 3, name: "Grinder Deluxe" },
];

const MOCK_REVIEWS = {
  1: {
    id: 1,
    name: "Espresso Machine Pro",
    reviews: [
      { 
        id: 1, 
        author: "Sarah Chen", 
        rating: 5, 
        text: "Absolutely love this machine! Makes perfect espresso every time. Highly recommend.", 
        helpful: 24,
        sellerNote: "Customer is satisfied with heat consistency and extraction quality. Consider highlighting these features in marketing."
      },
      { 
        id: 2, 
        author: "John Smith", 
        rating: 4, 
        text: "Great build quality. Takes a bit to learn, but results are excellent.", 
        helpful: 18,
        sellerNote: "User found learning curve steep. Consider creating a tutorial video or quick-start guide to improve onboarding."
      },
      { 
        id: 3, 
        author: "Maria Garcia", 
        rating: 5, 
        text: "Best espresso machine I've owned. Fast heating and consistent shots.", 
        helpful: 31,
        sellerNote: "Fast heating is a key selling point. Ensure this feature is prominently mentioned in product descriptions."
      },
    ]
  },
  2: {
    id: 2,
    name: "Ceramic Coffee Mug",
    reviews: [
      { 
        id: 4, 
        author: "Chris Lee", 
        rating: 5, 
        text: "Beautiful design, keeps coffee hot for hours. Perfect gift!", 
        helpful: 12,
        sellerNote: "Design and insulation are key strengths. Market as an ideal gift option in seasonal campaigns."
      },
      { 
        id: 5, 
        author: "Emma Watson", 
        rating: 4, 
        text: "Love the aesthetic. Slightly heavier than expected but worth it.", 
        helpful: 8,
        sellerNote: "Weight is unexpected to some customers. Add weight specifications to product listing to manage expectations."
      },
    ]
  },
  3: {
    id: 3,
    name: "Grinder Deluxe",
    reviews: [
      { 
        id: 6, 
        author: "David Brown", 
        rating: 5, 
        text: "Grinds beans perfectly. Whisper-quiet and super durable.", 
        helpful: 42,
        sellerNote: "Noise level and durability are standout features. Emphasize these benefits to appeal to frequent users."
      },
    ]
  }
};

export default function ProductReviewDisplay() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  useEffect(() => {
    // For now, use mock data. Switch to fetch() when backend is ready.
    setProducts(MOCK_PRODUCTS);
    if (MOCK_PRODUCTS.length > 0) setSelectedProductId(MOCK_PRODUCTS[0].id);
    
    // Uncomment when backend is ready:
    // fetch('http://localhost:3001/api/products')
    //   .then(res => res.json())
    //   .then(data => {
    //     setProducts(data);
    //     if (data.length > 0) setSelectedProductId(data[0].id);
    //   })
    //   .catch(err => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => {
    if (!selectedProductId) return;
    
    setLoading(true);
    setExpandedNoteId(null); // Reset expanded note when product changes
    // Simulate API delay
    setTimeout(() => {
      setProduct(MOCK_REVIEWS[selectedProductId]);
      setLoading(false);
    }, 300);
    
    // Uncomment when backend is ready:
    // fetch(`http://localhost:3001/api/product/${selectedProductId}`)
    //   .then(res => res.json())
    //   .then(data => setProduct(data))
    //   .catch(err => console.error('Error fetching product:', err))
    //   .finally(() => setLoading(false));
  }, [selectedProductId]);

  return (
    <div style={{
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: C.background,
      minHeight: "100vh",
      color: C.text,
    }}>
      <h1 style={{
        textAlign: "center",
        color: C.gold,
        marginBottom: "30px",
        fontSize: "2.5rem",
        fontWeight: "300",
      }}>
        Product Reviews
      </h1>

      {/* Product Dropdown */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <select 
          value={selectedProductId || ""}
          onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
          style={{
            padding: "12px 20px",
            fontSize: "16px",
            border: `2px solid ${C.goldDim}`,
            borderRadius: "8px",
            backgroundColor: "white",
            cursor: "pointer",
            minWidth: "250px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ fontSize: "1.2rem", color: C.gold }}>Loading reviews...</p>
        </div>
      )}

      {/* Product Info & Reviews */}
      {product && !loading && (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{
            color: C.gold,
            marginBottom: "20px",
            fontSize: "2rem",
            textAlign: "center",
          }}>
            {product.name}
          </h2>

          {/* Reviews Section */}
          <div style={{ marginBottom: "20px" }}>
            <p style={{
              textAlign: "center",
              fontSize: "1.1rem",
              color: "#666",
              marginBottom: "30px",
            }}>
              Showing {product.reviews.length} customer reviews
            </p>

            {/* Reviews Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}>
              {product.reviews.map(review => (
                <div 
                  key={review.id} 
                  style={{
                    border: `1px solid ${C.border}`,
                    padding: "20px",
                    borderRadius: "10px",
                    backgroundColor: "white",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}>
                    <strong style={{ fontSize: "1.1rem" }}>{review.author}</strong>
                    <span style={{
                      color: C.gold,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}>
                      ★ {review.rating}/5
                    </span>
                  </div>
                  <p style={{
                    marginBottom: "15px",
                    lineHeight: "1.5",
                    color: "#555",
                  }}>
                    {review.text}
                  </p>
                  <small style={{
                    color: "#999",
                    fontSize: "0.9rem",
                    marginBottom: "15px",
                    display: "block",
                  }}>
                    Helpful: {review.helpful} people
                  </small>

                  {/* Seller Notes Button */}
                  <button
                    onClick={() => setExpandedNoteId(expandedNoteId === review.id ? null : review.id)}
                    style={{
                      backgroundColor: C.gold,
                      color: "white",
                      border: "none",
                      padding: "8px 15px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      transition: "background-color 0.2s",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = C.goldLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = C.gold;
                    }}
                  >
                    {expandedNoteId === review.id ? "Hide Seller Note" : "View Seller Note"}
                  </button>

                  {/* Expanded Seller Note */}
                  {expandedNoteId === review.id && (
                    <div style={{
                      marginTop: "15px",
                      padding: "12px",
                      backgroundColor: C.background,
                      borderLeft: `4px solid ${C.gold}`,
                      borderRadius: "4px",
                    }}>
                      <p style={{
                        margin: "0",
                        color: "#555",
                        fontSize: "0.95rem",
                        lineHeight: "1.5",
                      }}>
                        <strong style={{ color: C.goldDim }}>Seller Note:</strong> {review.sellerNote}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}