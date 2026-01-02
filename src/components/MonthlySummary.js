import React from "react";
import MonthSelector from "./MonthSelector";

export default function MonthlySummary({ app }) {
  const {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    bufferTarget,
    setCurrentMonthKey,
  } = app;
  const monthKey = state.currentMonthKey;
  const md = state.monthlyData[monthKey] || {};

  const savingsActual = (state.savingsCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const expensesActual = (state.expenseCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const bufferUsed = md.bufferUsed || 0;
  const netBalance =
    (md.income || totalIncome) - savingsActual - expensesActual - bufferUsed;

  const savingsGap = (savingsTarget || 0) - savingsActual;
  const expenseRoom = (expensesTarget || 0) - expensesActual;

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
          <h2
            style={{
              margin: 0,
              marginBottom: "4px",
              color: "#1f2937",
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            📋 Monthly Summary
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Period: {monthKey}
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
      </div>

      {/* top stat row */}
      <div className="card">
        <div className="card-title">Monthly Overview</div>

        <div className="summary-row">
          <div className="summary-pill summary-pill--income">
            <div className="summary-label">Total Income</div>
            <div className="summary-value">
              ₹ {(md.income || totalIncome).toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--savings">
            <div className="summary-label">Savings</div>
            <div className="summary-value">
              ₹ {savingsActual.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--actual">
            <div className="summary-label">Expenses</div>
            <div className="summary-value">
              ₹ {expensesActual.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--net">
            <div className="summary-label">Net Balance</div>
            <div className="summary-value">
              ₹ {netBalance.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* alert strips */}
      <div className="card">
        <div className="card-title">Smart Insights & Tips</div>

        <div className="alert-strip alert-strip--warning">
          <span className="alert-emoji">⚠️</span>
          <span>
            {savingsGap > 0
              ? `You are behind on savings by ₹ ${savingsGap.toLocaleString(
                  "en-IN"
                )}. Consider reducing lifestyle expenses.`
              : "Your savings are on track for this month."}
          </span>
        </div>

        <div className="alert-strip alert-strip--success">
          <span className="alert-emoji">✅</span>
          <span>
            {expenseRoom >= 0
              ? "Excellent expense control! You have room in your budget."
              : `Expenses have exceeded the 40% limit by ₹ ${Math.abs(
                  expenseRoom
                ).toLocaleString("en-IN")}.`}
          </span>
        </div>

        <div className="card-subtitle" style={{ marginTop: 10 }}>
          Financial Health Tips
        </div>
        <ul className="tips-list">
          <li>🧯 Build 3–6 months of expenses as an emergency fund.</li>
          <li>📅 Review subscriptions and recurring payments monthly.</li>
          <li>🎯 Rebalance your 55-40-5 plan every quarter.</li>
        </ul>
      </div>

      {/* Detailed breakdown like table */}
      <div className="card">
        <div className="card-title">Detailed Breakdown</div>
        <table className="data-table">
          <tbody>
            <tr>
              <td>Income Sources</td>
              <td>₹ {totalIncome.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Savings Goal (55%)</td>
              <td>₹ {savingsTarget.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Savings Actual</td>
              <td>₹ {savingsActual.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Expenses Limit (40%)</td>
              <td>₹ {expensesTarget.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Expenses Actual</td>
              <td>₹ {expensesActual.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Buffer (5%)</td>
              <td>₹ {bufferTarget.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Buffer Used</td>
              <td>₹ {bufferUsed.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td>Net Balance</td>
              <td>₹ {netBalance.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
