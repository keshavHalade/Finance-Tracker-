import React, { useMemo } from "react";
import MonthSelector from "./MonthSelector";

export default function FinancialAdvisor({ app }) {
  const { state, savingsTarget, setCurrentMonthKey } = app;
  const currentMonthKey = state.currentMonthKey;

  // Calculate analytics
  const analytics = useMemo(() => {
    const monthTransactions = (state.transactions || []).filter(
      (t) => t.monthKey === currentMonthKey
    );

    const savingsTransactions = monthTransactions.filter(
      (t) => t.type === "saving" || t.type === "savings"
    );
    const expenseTransactions = monthTransactions.filter(
      (t) => t.type === "expense"
    );
    const bufferTransactions = monthTransactions.filter(
      (t) => t.type === "buffer"
    );

    const totalSavings = savingsTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    const totalExpenses = expenseTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    const totalBuffer = bufferTransactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );
    const totalIncome = app.totalIncome;

    const savingsRate = totalIncome
      ? Math.round((totalSavings / totalIncome) * 100)
      : 0;
    const expenseRate = totalIncome
      ? Math.round((totalExpenses / totalIncome) * 100)
      : 0;

    return {
      savingsRate,
      expenseRate,
      totalSavings,
      totalExpenses,
      totalBuffer,
      totalIncome,
      isSavingsGoalMet: totalSavings >= savingsTarget,
      savingsGap: Math.max(0, savingsTarget - totalSavings),
    };
  }, [
    state.transactions,
    state.savingsCategories,
    currentMonthKey,
    savingsTarget,
    app.totalIncome,
  ]);

  // Generate recommendations
  const recommendations = useMemo(() => {
    const recs = [];

    if (analytics.savingsRate < 55) {
      recs.push({
        type: "warning",
        icon: "⚠️",
        title: "Savings Below Target",
        message: `You're saving ${
          analytics.savingsRate
        }% of income. Target is 55%. Increase savings by ₹${analytics.savingsGap.toLocaleString(
          "en-IN"
        )} to meet your goal.`,
      });
    }

    if (analytics.expenseRate > 40) {
      recs.push({
        type: "danger",
        icon: "🚨",
        title: "Expenses Exceeding Budget",
        message: `Expenses are ${analytics.expenseRate}% of income (limit: 40%). Review spending to reduce costs.`,
      });
    }

    if (analytics.savingsRate >= 55) {
      recs.push({
        type: "success",
        icon: "✨",
        title: "Savings Goal Met!",
        message: `Excellent! You've saved ₹${analytics.totalSavings.toLocaleString(
          "en-IN"
        )} this month. Keep it up!`,
      });
    }

    if (analytics.totalBuffer === 0) {
      recs.push({
        type: "info",
        icon: "💡",
        title: "Build Your Buffer",
        message:
          "No buffer savings this month. Allocate 5% of income (₹" +
          Math.round((analytics.totalIncome * 5) / 100).toLocaleString(
            "en-IN"
          ) +
          ") for emergencies.",
      });
    }

    if (analytics.expenseRate < 30) {
      recs.push({
        type: "success",
        icon: "🎯",
        title: "Efficient Spending",
        message: `Your expenses are only ${analytics.expenseRate}% of income. Well managed!`,
      });
    }

    return recs;
  }, [analytics]);

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e8eef7",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
    marginBottom: "12px",
  };

  const titleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "16px",
    letterSpacing: "-0.3px",
  };

  const recStyle = (type) => {
    const baseStyle = {
      padding: "14px 16px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    };

    const typeStyles = {
      success: {
        ...baseStyle,
        background: "#d1fae5",
        borderColor: "#6ee7b7",
      },
      warning: {
        ...baseStyle,
        background: "#fef3c7",
        borderColor: "#fcd34d",
      },
      danger: {
        ...baseStyle,
        background: "#fee2e2",
        borderColor: "#fca5a5",
      },
      info: {
        ...baseStyle,
        background: "#dbeafe",
        borderColor: "#93c5fd",
      },
    };

    return typeStyles[type] || typeStyles.info;
  };

  const iconStyle = {
    fontSize: "20px",
    minWidth: "24px",
  };

  const contentStyle = {
    flex: 1,
  };

  const recTitleStyle = {
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "4px",
  };

  const recMessageStyle = {
    fontSize: "12px",
    lineHeight: "1.5",
  };

  const metricsStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    marginBottom: "16px",
  };

  const metricBoxStyle = {
    padding: "12px",
    borderRadius: "8px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    textAlign: "center",
  };

  const metricLabelStyle = {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "6px",
  };

  const metricValueStyle = {
    fontSize: "18px",
    fontWeight: "800",
    color: "#1a202c",
  };

  return (
    <div style={{ padding: "16px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header with Month Selector on Left */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ minWidth: "120px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
        <div>
          <h2 style={{ margin: 0, marginBottom: "4px" }}>
            🤖 Financial Advisor
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            AI-powered financial insights and recommendations
          </p>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>📊 Financial Health Summary</div>

        <div style={metricsStyle}>
          <div style={metricBoxStyle}>
            <div style={metricLabelStyle}>Savings Rate</div>
            <div style={metricValueStyle}>{analytics.savingsRate}%</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricLabelStyle}>Expenses Rate</div>
            <div style={metricValueStyle}>{analytics.expenseRate}%</div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricLabelStyle}>Total Savings</div>
            <div style={metricValueStyle}>
              ₹{(analytics.totalSavings / 1000).toFixed(1)}K
            </div>
          </div>
          <div style={metricBoxStyle}>
            <div style={metricLabelStyle}>Buffer Fund</div>
            <div style={metricValueStyle}>
              ₹{(analytics.totalBuffer / 1000).toFixed(1)}K
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>💡 Smart Recommendations</div>

        {recommendations.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            No recommendations at this time. You're doing great! 🎉
          </div>
        ) : (
          recommendations.map((rec, idx) => (
            <div key={idx} style={recStyle(rec.type)}>
              <div style={iconStyle}>{rec.icon}</div>
              <div style={contentStyle}>
                <div style={recTitleStyle} className={`rec-title-${rec.type}`}>
                  {rec.title}
                </div>
                <div style={recMessageStyle}>{rec.message}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={cardStyle}>
        <div style={titleStyle}>🎯 Monthly Goals</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "12px",
              background: "#f0fdf4",
              borderRadius: "8px",
              border: "1px solid #bbf7d0",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#15803d",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              55% Savings Goal
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}
            >
              ₹{analytics.totalSavings.toLocaleString("en-IN")} / ₹
              {savingsTarget.toLocaleString("en-IN")}
            </div>
            <div
              style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}
            >
              {analytics.isSavingsGoalMet
                ? "✅ Goal Met!"
                : `₹${analytics.savingsGap.toLocaleString("en-IN")} to go`}
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              background: "#fef3c7",
              borderRadius: "8px",
              border: "1px solid #fde047",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#92400e",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              40% Expenses Budget
            </div>
            <div
              style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}
            >
              ₹{analytics.totalExpenses.toLocaleString("en-IN")} / ₹
              {Math.round((app.totalIncome * 40) / 100).toLocaleString("en-IN")}
            </div>
            <div
              style={{ fontSize: "11px", color: "#6b7280", marginTop: "4px" }}
            >
              {analytics.expenseRate > 40
                ? "⚠️ Over budget"
                : "✅ Within budget"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
