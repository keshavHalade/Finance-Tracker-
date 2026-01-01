import React, { useMemo } from "react";
import "../Style/Analytics.css";
import MonthSelector from "./MonthSelector";

export default function ExpensesDashboard({ app }) {
  const { state, expensesTarget, setCurrentMonthKey } = {
    ...app,
    expensesTarget: app.expensesTarget,
    setCurrentMonthKey: app.setCurrentMonthKey,
  };

  // Get current month key
  function getCurrentMonthKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
  }

  const currentMonthKey = state.currentMonthKey || getCurrentMonthKey();

  // Calculate actual values from CURRENT MONTH transactions only
  const expensesActualByCategory = useMemo(() => {
    const result = {};
    (state.expenseCategories || []).forEach((cat) => {
      result[cat.id] = 0;
    });

    // Filter transactions for current month only
    (state.transactions || []).forEach((tx) => {
      const txMonthKey = tx.monthKey || getCurrentMonthKey();

      // Only include transactions from current month
      if (txMonthKey === currentMonthKey && tx.type === "expense") {
        if (tx.categoryId && result.hasOwnProperty(tx.categoryId)) {
          result[tx.categoryId] += Number(tx.amount || 0);
        }
      }
    });

    return result;
  }, [state.transactions, state.expenseCategories, currentMonthKey]);

  const totalActual = Object.values(expensesActualByCategory).reduce(
    (sum, val) => sum + val,
    0
  );

  const variance = (expensesTarget || 0) - totalActual;
  const overLimit = totalActual > expensesTarget && expensesTarget > 0;

  // Analytical insights
  const insights = useMemo(() => {
    if (!state.expenseCategories || state.expenseCategories.length === 0) {
      return { averageCompletion: 0, overBudgetCount: 0, categoryRanking: [] };
    }

    const categoryStats = (state.expenseCategories || []).map((cat) => {
      const actual = expensesActualByCategory[cat.id] || 0;
      const pct = cat.limit ? Math.round((actual / cat.limit) * 100) : 0;
      return { ...cat, actual, pct, over: pct > 100 };
    });

    const overBudgetCount = categoryStats.filter((c) => c.over).length;
    const totalCount = categoryStats.length;
    const averageCompletion = Math.round(
      Math.min(
        categoryStats.reduce((sum, c) => sum + c.pct, 0) / totalCount,
        100
      )
    );

    return {
      averageCompletion,
      overBudgetCount,
      totalCount,
      categoryRanking: categoryStats.sort((a, b) => b.pct - a.pct),
    };
  }, [state.expenseCategories, expensesActualByCategory]);

  // Data analyst insights
  const spendingTrends = useMemo(() => {
    const monthKeys = new Set();
    (state.transactions || []).forEach((tx) => {
      if (tx.type === "expense") {
        monthKeys.add(tx.monthKey || getCurrentMonthKey());
      }
    });

    const trends = {};
    monthKeys.forEach((month) => {
      let monthTotal = 0;
      (state.transactions || []).forEach((tx) => {
        if (tx.type === "expense" && tx.monthKey === month) {
          monthTotal += Number(tx.amount || 0);
        }
      });
      trends[month] = monthTotal;
    });

    return Object.entries(trends)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-3);
  }, [state.transactions]);

  const getMonthName = (monthKey) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleString("en-IN", { month: "short", year: "numeric" });
  };

  const statusColor = (pct) => {
    if (pct <= 50) return "#10b981";
    if (pct <= 90) return "#f97316";
    return "#ef4444";
  };

  const statusLabel = (pct) => {
    if (pct <= 50) return "On Track";
    if (pct <= 90) return "Caution";
    return "Over Budget";
  };

  const transactionCount = (state.transactions || []).filter(
    (tx) =>
      tx.type === "expense" &&
      (tx.monthKey || getCurrentMonthKey()) === currentMonthKey
  ).length;

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
            💳 Expenses
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Track your 40% spending allocation
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
      </div>

      {/* Summary Pills */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
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
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            BUDGET LIMIT
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#1f2937" }}
          >
            ₹{(expensesTarget || 0).toFixed(2)}
          </div>
          <div style={{ fontSize: "11px", color: "#9ca3af", marginTop: "4px" }}>
            40% allocation
          </div>
        </div>

        <div
          style={{
            background: overLimit ? "#fee2e2" : "#ecfdf5",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: `4px solid ${overLimit ? "#ef4444" : "#10b981"}`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            SPENT THIS MONTH
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: overLimit ? "#991b1b" : "#065f46",
            }}
          >
            ₹{totalActual.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: overLimit ? "#7f1d1d" : "#047857",
              marginTop: "4px",
            }}
          >
            {overLimit ? "Over budget!" : "Within budget"}
          </div>
        </div>

        <div
          style={{
            background: variance >= 0 ? "#ecfdf5" : "#fee2e2",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: `4px solid ${variance >= 0 ? "#10b981" : "#ef4444"}`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            REMAINING BUDGET
          </div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "700",
              color: variance >= 0 ? "#065f46" : "#991b1b",
            }}
          >
            ₹{Math.max(variance, 0).toFixed(2)}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: variance >= 0 ? "#047857" : "#7f1d1d",
              marginTop: "4px",
            }}
          >
            {variance >= 0
              ? `${Math.round((variance / expensesTarget) * 100)}% left`
              : "Over limit"}
          </div>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: `4px solid #f97316`,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#6b7280",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            UTILIZATION
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#92400e" }}
          >
            {expensesTarget > 0
              ? Math.min(Math.round((totalActual / expensesTarget) * 100), 100)
              : 0}
            %
          </div>
          <div style={{ fontSize: "11px", color: "#b45309", marginTop: "4px" }}>
            {statusLabel(
              expensesTarget > 0
                ? Math.round((totalActual / expensesTarget) * 100)
                : 0
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}
          >
            Budget Progress
          </div>
          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            ₹{totalActual.toFixed(2)} / ₹{(expensesTarget || 0).toFixed(2)}
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "16px",
            background: "#e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min((totalActual / expensesTarget) * 100, 100)}%`,
              height: "100%",
              background: statusColor((totalActual / expensesTarget) * 100),
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Category Status */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#1f2937",
          }}
        >
          📊 Category Status
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {insights.categoryRanking.map((cat) => (
            <div
              key={cat.id}
              style={{
                background: "#fff",
                padding: "10px 14px",
                borderRadius: "8px",
                border: `2px solid ${statusColor(cat.pct)}`,
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              <div style={{ color: "#1f2937" }}>{cat.name}</div>
              <div style={{ color: statusColor(cat.pct), marginTop: "2px" }}>
                ₹{cat.actual.toFixed(0)} / ₹{(cat.limit || 0).toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Table */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "#1f2937",
          }}
        >
          🔍 Category Breakdown
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f9fafb",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th
                  style={{
                    padding: "18px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Category
                </th>
                <th
                  style={{
                    padding: "18px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Limit
                </th>
                <th
                  style={{
                    padding: "18px",
                    textAlign: "right",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Spent
                </th>
                <th
                  style={{
                    padding: "18px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  % Used
                </th>
                <th
                  style={{
                    padding: "18px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {insights.categoryRanking.map((cat) => (
                <tr
                  key={cat.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    background: cat.pct > 100 ? "#fef2f2" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "18px",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "#1f2937",
                    }}
                  >
                    {cat.name}
                  </td>
                  <td
                    style={{
                      padding: "18px",
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    ₹{(cat.limit || 0).toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "18px",
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#1f2937",
                    }}
                  >
                    ₹{cat.actual.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "18px",
                      textAlign: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: statusColor(cat.pct),
                    }}
                  >
                    {cat.pct}%
                  </td>
                  <td style={{ padding: "18px", textAlign: "center" }}>
                    <span
                      style={{
                        background:
                          cat.pct > 100
                            ? "#fee2e2"
                            : cat.pct > 90
                            ? "#fef3c7"
                            : "#ecfdf5",
                        color:
                          cat.pct > 100
                            ? "#991b1b"
                            : cat.pct > 90
                            ? "#92400e"
                            : "#065f46",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      {statusLabel(cat.pct)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spending Trends */}
      {spendingTrends.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#1f2937",
            }}
          >
            📈 Recent Spending Trends
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "12px",
            }}
          >
            {spendingTrends.map(([month, amount]) => (
              <div
                key={month}
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
                  }}
                >
                  {getMonthName(month)}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    color: "#1f2937",
                    marginTop: "4px",
                  }}
                >
                  ₹{amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Analyst Tips */}
      <div
        style={{
          background: "#f0f9ff",
          padding: "16px",
          borderRadius: "8px",
          borderLeft: "4px solid #0ea5e9",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#0369a1",
            marginBottom: "8px",
          }}
        >
          💡 Data Insights
        </div>
        <ul
          style={{
            margin: 0,
            paddingLeft: "20px",
            fontSize: "12px",
            color: "#0c4a6e",
            lineHeight: "1.6",
          }}
        >
          <li>
            {insights.overBudgetCount > 0
              ? `${insights.overBudgetCount} category(ies) exceeding budget limits - review spending patterns`
              : "All expense categories within budget limits ✓"}
          </li>
          <li>
            Overall budget utilization at{" "}
            {Math.round((totalActual / expensesTarget) * 100)}% -
            {totalActual > expensesTarget * 0.8
              ? " approaching limit, consider optimizing"
              : " room for planned expenses"}
          </li>
          <li>
            {insights.categoryRanking[0]?.name} is your highest spending
            category at {insights.categoryRanking[0]?.pct}% of its limit
          </li>
        </ul>
      </div>
    </div>
  );
}
