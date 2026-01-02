import React from "react";
import { generateFinancialReport } from "../utils/excelExport";

export default function Header({ app }) {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const dateNum = currentDate.getDate();

  const handleExport = () => {
    if (app && app.state) {
      generateFinancialReport(app.state, app);
    } else {
      alert("Please configure your budget settings before exporting.");
    }
  };

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-title-section">
          <h1>💰 Finance Tracker</h1>
          <p className="app-subtitle">Multi-income · Smart goals · Offline</p>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            onClick={handleExport}
            style={{
              padding: "8px 16px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#059669")}
            onMouseOut={(e) => (e.target.style.background = "#10b981")}
            title="Export comprehensive financial report to Excel"
          >
            📥 Export Report
          </button>
          <div className="header-date">
            <div className="date-badge">
              <span className="date-month">{monthName}</span>
              <span className="date-year">{year}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="header-status">
        <div className="status-item">
          <span className="status-icon">✓</span>
          <span className="status-text">Budget tracking active</span>
        </div>
      </div>
    </header>
  );
}
