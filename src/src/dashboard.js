import { useState, useEffect, useRef } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard";      // rename to avoid the name clash

/* ── palette (light mode) ─────────────────────────────────── */

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // when the layout mounts, you can redirect to a default sub‑route
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="dashboard-layout" ref={containerRef}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        {/* put your nav links here */}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "◀"}
        </button>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* add additional <Route path="…"> components for
              /dashboard/settings, /dashboard/users etc. */}
        </Routes>
      </main>
    </div>
  );
}