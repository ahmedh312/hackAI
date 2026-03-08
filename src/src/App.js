// filepath: c:\Users\ameri\.vscode\hackai\src\App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./dashboard";
import ProductReviewDisplay from "./ProductReviewDisplay";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="dashboard/*" element={<DashboardLayout />} />
        <Route path="/" element={<ProductReviewDisplay />} />
      </Routes>
    </BrowserRouter>
  );
}