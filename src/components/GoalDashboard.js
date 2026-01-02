import React from "react";
import MonthSelector from "./MonthSelector";

export default function GoalDashboard({ app }) {
  const { state, setCurrentMonthKey } = app;
  
  return (
    <div style={{ padding: "16px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header with Month Selector on Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, marginBottom: "4px", color: "#1f2937", fontSize: "24px", fontWeight: "700" }}>🎯 Goals</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Track your financial goals and targets
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector state={state} setCurrentMonthKey={setCurrentMonthKey} />
        </div>
      </div>

      <section style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <h3 style={{ color: "#6b7280" }}>Goal Dashboard</h3>
        <p style={{ color: "#9ca3af" }}>Placeholder for goal progress and management.</p>
      </section>
    </div>
  );
