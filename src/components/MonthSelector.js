import React from "react";

export default function MonthSelector({ state, setCurrentMonthKey }) {
  const currentMonthKey = state.currentMonthKey;

  // Get all unique months from transactions
  const getAllMonths = () => {
    const months = new Set();
    (state.transactions || []).forEach((tx) => {
      if (tx.monthKey) months.add(tx.monthKey);
    });

    // Also add current month
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${d.getFullYear()}-${m}`;
    months.add(currentMonth);

    return Array.from(months).sort().reverse();
  };

  const months = getAllMonths();

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString("en-IN", { month: "long", year: "numeric" });
  };

  const selectorStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "linear-gradient(135deg, #f0f4ff 0%, #f8faff 100%)",
    borderRadius: "10px",
    border: "2px solid #dbeafe",
    marginBottom: "16px",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const selectStyle = {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1.5px solid #cbd5e1",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    background: "#ffffff",
    color: "#1e293b",
    transition: "all 0.2s ease",
  };

  return (
    <div style={selectorStyle}>
      <label style={labelStyle}>📅 View Month:</label>
      <select
        value={currentMonthKey}
        onChange={(e) => setCurrentMonthKey(e.target.value)}
        style={selectStyle}
      >
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonth(month)}
          </option>
        ))}
      </select>
      <span
        style={{
          fontSize: "12px",
          color: "#94a3b8",
          fontWeight: "500",
          marginLeft: "auto",
        }}
      >
        Showing data for selected month only
      </span>
    </div>
  );
}
