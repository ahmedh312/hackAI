const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Mock product data with reviews
const products = [
  {
    id: 1,
    name: "Smartphone X",
    reviews: [
      { id: 1, author: "John D.", rating: 5, text: "Amazing battery life! Lasts all day.", helpful: 245 },
      { id: 2, author: "Sarah M.", rating: 4, text: "Great camera, but screen could be brighter.", helpful: 128 },
      { id: 3, author: "Mike T.", rating: 3, text: "Good performance, occasional lag.", helpful: 95 },
    ],
  },
  {
    id: 2,
    name: "Laptop Pro",
    reviews: [
      { id: 4, author: "Alice K.", rating: 5, text: "Excellent build quality and speed.", helpful: 310 },
      { id: 5, author: "Bob L.", rating: 2, text: "Heat issues, runs hot under load.", helpful: 203 },
    ],
  },
];

app.get('/api/product/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  
  res.json({
    ...product,
    reviews: product.reviews.slice(0, 10),
  });
});

app.get('/api/products', (req, res) => {
  res.json(products.map(p => ({ id: p.id, name: p.name })));
});

app.listen(3001, () => console.log('Server running on port 3001'));