import React from "react";
import MonthSelector from "./MonthSelector";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthlyTracker({ app }) {
  const {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    bufferTarget,
    setCurrentMonthKey,
  } = app;

  const year = new Date().getFullYear();

  const handleSelectMonth = (monthIndex) => {
    const m = String(monthIndex + 1).padStart(2, "0");
    const key = `${year}-${m}`;
    setCurrentMonthKey(key);
  };

  const getMonthData = (monthIndex) => {
    const m = String(monthIndex + 1).padStart(2, "0");
    const key = `${year}-${m}`;

    // Fetch from transactions + monthlyData
    const md = state.monthlyData?.[key] || {};
    const transactions =
      state.transactions?.filter((t) => t.monthKey === key) || [];

    const savingsActual = transactions
      .filter((t) => t.type === "saving")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const expensesActual = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const bufferUsed =
      transactions
        .filter((t) => t.type === "buffer")
        .reduce((sum, t) => sum + (t.amount || 0), 0) ||
      md.bufferUsed ||
      0;

    const income = Number(md.income) || totalIncome || 0;
    const netBalance = income - savingsActual - expensesActual - bufferUsed;

    const savingsPct = savingsTarget
      ? Math.round((savingsActual / savingsTarget) * 100)
      : 0;
    const expensesPct = expensesTarget
      ? Math.round((expensesActual / expensesTarget) * 100)
      : 0;
    const bufferPct = bufferTarget
      ? Math.round((bufferUsed / bufferTarget) * 100)
      : 0;

    return {
      key,
      income,
      savingsActual,
      expensesActual,
      bufferUsed,
      netBalance,
      savingsPct,
      expensesPct,
      bufferPct,
    };
  };

  const containerStyle = {
    padding: "16px 0",
  };

  const headerStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
  };

  const tableWrapperStyle = {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "auto",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    minWidth: "600px",
  };

  const thStyle = {
    textAlign: "center",
    padding: "16px 12px",
    fontWeight: "700",
    color: "#374151",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "12px",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    textAlign: "center",
    padding: "16px 12px",
    borderBottom: "1px solid #f3f4f6",
    verticalAlign: "middle",
    fontSize: "13px",
  };

  const activeTdStyle = {
    ...tdStyle,
    background: "#f0fdf4",
    borderLeft: "4px solid #10b981",
    fontWeight: "600",
  };

  const amountStyle = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  };

  const greenAmountStyle = {
    ...amountStyle,
    color: "#10b981",
  };

  const redAmountStyle = {
    ...amountStyle,
    color: "#ef4444",
  };

  const pctStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
  };

  return (
    <div style={containerStyle}>
      {/* Header with Month Selector on Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          padding: "0 16px",
        }}
      >
        <div style={{ minWidth: "120px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
        <div>
          <h2 style={{ margin: 0, marginBottom: "4px" }}>📅 Monthly Tracker</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Year-to-date performance overview ({year})
          </p>
        </div>
      </div>

      <div style={headerStyle}>
        <div style={titleStyle}>Monthly Performance</div>
      </div>

      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              <th style={thStyle}>Income</th>
              <th style={thStyle}>Savings</th>
              <th style={thStyle}>Expenses</th>
              <th style={thStyle}>Buffer</th>
              <th style={thStyle}>Net Balance</th>
            </tr>
          </thead>
          <tbody>
            {MONTH_LABELS.map((label, idx) => {
              const {
                key,
                income,
                savingsActual,
                expensesActual,
                bufferUsed,
                netBalance,
                savingsPct,
                expensesPct,
                bufferPct,
              } = getMonthData(idx);

              const isActive = state.currentMonthKey === key;
              const cellStyle = isActive ? activeTdStyle : tdStyle;

              return (
                <tr
                  key={key}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectMonth(idx)}
                >
                  <td style={cellStyle}>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        color: isActive ? "#10b981" : "#111827",
                      }}
                    >
                      {label}
                    </div>
                  </td>

                  <td style={cellStyle}>
                    <div style={greenAmountStyle}>
                      ₹{income.toLocaleString("en-IN")}
                    </div>
                  </td>

                  <td style={cellStyle}>
                    <div style={greenAmountStyle}>
                      ₹{savingsActual.toLocaleString("en-IN")}
                    </div>
                    <div style={pctStyle}>{savingsPct}%</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={redAmountStyle}>
                      ₹{expensesActual.toLocaleString("en-IN")}
                    </div>
                    <div style={pctStyle}>{expensesPct}%</div>
                  </td>

                  <td style={cellStyle}>
                    <div style={amountStyle}>
                      ₹{bufferUsed.toLocaleString("en-IN")}
                    </div>
                    <div style={pctStyle}>{bufferPct}%</div>
                  </td>

                  <td style={cellStyle}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: netBalance >= 0 ? "#10b981" : "#ef4444",
                      }}
                    >
                      ₹{netBalance.toLocaleString("en-IN")}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
