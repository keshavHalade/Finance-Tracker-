import React from "react";

export default function Header() {
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const dateNum = currentDate.getDate();

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-title-section">
          <h1>💰 Finance Tracker</h1>
          <p className="app-subtitle">Multi-income · Smart goals · Offline</p>
        </div>
        <div className="header-date">
          <div className="date-badge">
            <span className="date-month">{monthName}</span>
            <span className="date-year">{year}</span>
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
