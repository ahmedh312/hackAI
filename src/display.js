import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, ReferenceLine } from "recharts";

/* ── palette — mirrors the landing page exactly ─────────── */


const C = {
  gold: "#A8742A", goldLight: "#C9943C", goldDim: "#7A5520",
}

export default function ProductReviewDisplay() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch list of products on mount
  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) setSelectedProductId(data[0].id); // Select first product by default
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  // Fetch selected product details
  useEffect(() => {
    if (!selectedProductId) return;
    
    setLoading(true);
    fetch(`http://localhost:3001/api/product/${selectedProductId}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Error fetching product:', err))
      .finally(() => setLoading(false));
  }, [selectedProductId]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Product Reviews</h1>

      {/* Product Dropdown */}
      <select 
        value={selectedProductId || ""}
        onChange={(e) => setSelectedProductId(parseInt(e.target.value))}
        style={{ padding: "8px", fontSize: "16px" }}
      >
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Loading State */}
      {loading && <p>Loading...</p>}

      {/* Product Info & Reviews */}
      {product && !loading && (
        <div>
          <h2>{product.name}</h2>
          <p>Showing {product.reviews.length} reviews:</p>

          {/* Reviews List */}
          <div>
            {product.reviews.map(review => (
              <div 
                key={review.id} 
                style={{
                  border: `1px solid ${C.goldDim}`,
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#f9f7f4",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{review.author}</strong>
                  <span style={{ color: C.gold }}>★ {review.rating}/5</span>
                </div>
                <p>{review.text}</p>
                <small style={{ color: "#999" }}>Helpful: {review.helpful} people</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}