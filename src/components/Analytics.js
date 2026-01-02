import React, { useMemo } from "react";
import "../Style/Analytics.css";
import MonthSelector from "./MonthSelector";

export default function Analytics({ app }) {
  const {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    setCurrentMonthKey,
  } = app;

  // Get current month key
  function getCurrentMonthKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
  }

  const currentMonthKey = state.currentMonthKey || getCurrentMonthKey();

  // Category-wise spending for current month
  const categorySpending = useMemo(() => {
    const map = {};
    (state.transactions || []).forEach((t) => {
      const txMonthKey = t.monthKey || getCurrentMonthKey();
      if (t.type !== "expense" || txMonthKey !== currentMonthKey) return;

      const cat =
        (state.expenseCategories || []).find((c) => c.id === t.categoryId) ||
        {};
      const name = cat.name || "Uncategorized";
      map[name] = (map[name] || 0) + (t.amount || 0);
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions, state.expenseCategories, currentMonthKey]);

  // Savings category breakdown for current month
  const savingsCategoryBreakdown = useMemo(() => {
    const map = {};
    (state.transactions || []).forEach((t) => {
      const txMonthKey = t.monthKey || getCurrentMonthKey();
      if (
        (t.type !== "saving" && t.type !== "savings") ||
        txMonthKey !== currentMonthKey
      )
        return;

      const cat =
        (state.savingsCategories || []).find((c) => c.id === t.categoryId) ||
        {};
      const name = cat.name || "Uncategorized";
      map[name] = (map[name] || 0) + (t.amount || 0);
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [state.transactions, state.savingsCategories, currentMonthKey]);

  // Monthly trend analysis
  const monthlyTrends = useMemo(() => {
    const months = {};
    (state.transactions || []).forEach((t) => {
      const monthKey = t.monthKey || getCurrentMonthKey();
      if (!months[monthKey]) {
        months[monthKey] = { income: 0, savings: 0, expenses: 0, buffer: 0 };
      }
      if (t.type === "saving" || t.type === "savings") {
        months[monthKey].savings += Number(t.amount || 0);
      } else if (t.type === "expense") {
        months[monthKey].expenses += Number(t.amount || 0);
      } else if (t.type === "buffer") {
        months[monthKey].buffer += Number(t.amount || 0);
      }
    });

    return Object.entries(months)
      .map(([key, data]) => ({ monthKey: key, ...data }))
      .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
      .slice(-6);
  }, [state.transactions]);

  const getMonthName = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString("en-IN", { month: "short", year: "numeric" });
  };

  // Calculate current month totals
  const currentMonthTotals = useMemo(() => {
    let savings = 0,
      expenses = 0,
      buffer = 0;
    (state.transactions || []).forEach((t) => {
      const txMonthKey = t.monthKey || getCurrentMonthKey();
      if (txMonthKey !== currentMonthKey) return;

      if (t.type === "saving" || t.type === "savings") {
        savings += Number(t.amount || 0);
      } else if (t.type === "expense") {
        expenses += Number(t.amount || 0);
      } else if (t.type === "buffer") {
        buffer += Number(t.amount || 0);
      }
    });

    return { savings, expenses, buffer, total: savings + expenses + buffer };
  }, [state.transactions, currentMonthKey]);

  // Data analyst insights
  const dataInsights = useMemo(() => {
    const insights = [];

    const savingsRate =
      totalIncome > 0 ? (currentMonthTotals.savings / totalIncome) * 100 : 0;
    const expensesRate =
      totalIncome > 0 ? (currentMonthTotals.expenses / totalIncome) * 100 : 0;

    if (savingsRate >= 55) {
      insights.push({
        type: "success",
        text: `✓ Excellent! You're saving ${Math.round(
          savingsRate
        )}% (Target: 55%)`,
      });
    } else if (savingsRate >= 50) {
      insights.push({
        type: "warning",
        text: `→ Good savings rate of ${Math.round(
          savingsRate
        )}% (Target: 55%)`,
      });
    } else {
      insights.push({
        type: "danger",
        text: `⚠ Savings at ${Math.round(savingsRate)}% - aim for 55% target`,
      });
    }

    if (expensesRate <= 40) {
      insights.push({
        type: "success",
        text: `✓ Excellent! Expenses at ${Math.round(
          expensesRate
        )}% (Limit: 40%)`,
      });
    } else if (expensesRate <= 45) {
      insights.push({
        type: "warning",
        text: `→ Expenses at ${Math.round(expensesRate)}% (Limit: 40%)`,
      });
    } else {
      insights.push({
        type: "danger",
        text: `⚠ Expenses at ${Math.round(expensesRate)}% - exceeds 40% limit`,
      });
    }

    if (categorySpending.length > 0) {
      const topCategory = categorySpending[0];
      if (topCategory.amount > expensesTarget * 0.3) {
        insights.push({
          type: "info",
          text: `📌 ${topCategory.name} is your top expense (${Math.round(
            (topCategory.amount / currentMonthTotals.expenses) * 100
          )}% of expenses)`,
        });
      }
    }

    if (savingsCategoryBreakdown.length > 0) {
      const topSavings = savingsCategoryBreakdown[0];
      insights.push({
        type: "info",
        text: `🎯 Top savings goal: ${
          topSavings.name
        } at ₹${topSavings.amount.toFixed(2)}`,
      });
    }

    return insights;
  }, [
    currentMonthTotals,
    categorySpending,
    savingsCategoryBreakdown,
    totalIncome,
    expensesTarget,
  ]);

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
            📊 Analytics
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Financial insights for {getMonthName(currentMonthKey)}
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
      </div>

      {/* Current Month Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#ecfdf5",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            SAVINGS
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "700", color: "#065f46" }}
          >
            ₹{currentMonthTotals.savings.toFixed(2)}
          </div>
          <div style={{ fontSize: "10px", color: "#047857", marginTop: "4px" }}>
            55% target
          </div>
        </div>

        <div
          style={{
            background: "#fee2e2",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #ef4444",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            EXPENSES
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "700", color: "#991b1b" }}
          >
            ₹{currentMonthTotals.expenses.toFixed(2)}
          </div>
          <div style={{ fontSize: "10px", color: "#7f1d1d", marginTop: "4px" }}>
            40% limit
          </div>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #f97316",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            BUFFER
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "700", color: "#92400e" }}
          >
            ₹{currentMonthTotals.buffer.toFixed(2)}
          </div>
          <div style={{ fontSize: "10px", color: "#b45309", marginTop: "4px" }}>
            5% reserve
          </div>
        </div>

        <div
          style={{
            background: "#ede9fe",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #a855f7",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            TOTAL
          </div>
          <div
            style={{ fontSize: "18px", fontWeight: "700", color: "#6b21a8" }}
          >
            ₹{currentMonthTotals.total.toFixed(2)}
          </div>
          <div style={{ fontSize: "10px", color: "#7e22ce", marginTop: "4px" }}>
            100% of income
          </div>
        </div>
      </div>

      {/* Data Analyst Insights */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#1f2937",
          }}
        >
          💡 Data Analyst Insights
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {dataInsights.map((insight, idx) => (
            <div
              key={idx}
              style={{
                background:
                  insight.type === "success"
                    ? "#ecfdf5"
                    : insight.type === "warning"
                    ? "#fef3c7"
                    : insight.type === "danger"
                    ? "#fee2e2"
                    : "#f0f9ff",
                borderLeft: `4px solid ${
                  insight.type === "success"
                    ? "#10b981"
                    : insight.type === "warning"
                    ? "#f97316"
                    : insight.type === "danger"
                    ? "#ef4444"
                    : "#0ea5e9"
                }`,
                padding: "12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {insight.text}
            </div>
          ))}
        </div>
      </div>

      {/* Expense Category Breakdown */}
      {categorySpending.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1f2937",
            }}
          >
            💸 Expense Categories
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {categorySpending.map((cat, idx) => {
              const pct =
                currentMonthTotals.expenses > 0
                  ? Math.round((cat.amount / currentMonthTotals.expenses) * 100)
                  : 0;
              return (
                <div
                  key={cat.name}
                  style={{
                    padding: "16px",
                    borderBottom:
                      idx < categorySpending.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      {pct}% of expenses
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1f2937",
                      }}
                    >
                      ₹{cat.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Savings Category Breakdown */}
      {savingsCategoryBreakdown.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1f2937",
            }}
          >
            💰 Savings Breakdown
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}
          >
            {savingsCategoryBreakdown.map((cat, idx) => {
              const pct =
                currentMonthTotals.savings > 0
                  ? Math.round((cat.amount / currentMonthTotals.savings) * 100)
                  : 0;
              return (
                <div
                  key={cat.name}
                  style={{
                    padding: "16px",
                    borderBottom:
                      idx < savingsCategoryBreakdown.length - 1
                        ? "1px solid #e5e7eb"
                        : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#1f2937",
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      {pct}% of savings
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#1f2937",
                      }}
                    >
                      ₹{cat.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      {monthlyTrends.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1f2937",
            }}
          >
            📈 Last 6 Months Trend
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
            }}
          >
            {monthlyTrends.map((month) => (
              <div
                key={month.monthKey}
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    fontWeight: "600",
                    marginBottom: "8px",
                  }}
                >
                  {getMonthName(month.monthKey)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#047857",
                    marginBottom: "4px",
                  }}
                >
                  💚 Saved: ₹{month.savings.toFixed(0)}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#7f1d1d",
                    marginBottom: "4px",
                  }}
                >
                  💸 Spent: ₹{month.expenses.toFixed(0)}
                </div>
                <div style={{ fontSize: "11px", color: "#b45309" }}>
                  📦 Buffer: ₹{month.buffer.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      <div
        style={{
          background: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#1f2937",
          }}
        >
          💯 Financial Health Checklist
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "12px",
            color: "#1f2937",
            lineHeight: "1.8",
          }}
        >
          <li
            style={{
              color:
                currentMonthTotals.savings >= savingsTarget * 0.95
                  ? "#065f46"
                  : "#6b7280",
            }}
          >
            {currentMonthTotals.savings >= savingsTarget * 0.95 ? "✓" : "○"}{" "}
            Savings on track (₹{currentMonthTotals.savings.toFixed(0)} / ₹
            {savingsTarget.toFixed(0)})
          </li>
          <li
            style={{
              color:
                currentMonthTotals.expenses <= expensesTarget
                  ? "#065f46"
                  : "#991b1b",
            }}
          >
            {currentMonthTotals.expenses <= expensesTarget ? "✓" : "⚠"} Expenses
            within limit (₹{currentMonthTotals.expenses.toFixed(0)} / ₹
            {expensesTarget.toFixed(0)})
          </li>
          <li
            style={{
              color:
                categorySpending.length > 0 &&
                categorySpending[0].amount < expensesTarget * 0.4
                  ? "#065f46"
                  : "#6b7280",
            }}
          >
            {categorySpending.length > 0 &&
            categorySpending[0].amount < expensesTarget * 0.4
              ? "✓"
              : "○"}{" "}
            No single category dominates
          </li>
          <li
            style={{
              color:
                savingsCategoryBreakdown.length >= 2 ? "#065f46" : "#6b7280",
            }}
          >
            {savingsCategoryBreakdown.length >= 2 ? "✓" : "○"} Diversified
            savings goals ({savingsCategoryBreakdown.length} categories)
          </li>
        </ul>
      </div>
    </div>
  );
}
