import React, { useMemo } from "react";
import "../Style/Analytics.css";
import MonthSelector from "./MonthSelector";

export default function SavingsDashboard({ app }) {
  const { state, savingsTarget, setCurrentMonthKey } = {
    ...app,
    savingsTarget: app.savingsTarget,
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
  const savingsActualByCategory = useMemo(() => {
    const result = {};
    (state.savingsCategories || []).forEach((cat) => {
      result[cat.id] = 0;
    });

    // Filter transactions for current month only
    (state.transactions || []).forEach((tx) => {
      const txMonthKey = tx.monthKey || getCurrentMonthKey();

      // Only include transactions from current month
      if (
        txMonthKey === currentMonthKey &&
        (tx.type === "saving" || tx.type === "savings")
      ) {
        if (tx.categoryId && result.hasOwnProperty(tx.categoryId)) {
          result[tx.categoryId] += Number(tx.amount || 0);
        }
      }
    });

    return result;
  }, [state.transactions, state.savingsCategories, currentMonthKey]);

  const totalActual = Object.values(savingsActualByCategory).reduce(
    (sum, val) => sum + val,
    0
  );

  const variance = (savingsTarget || 0) - totalActual;

  // Analytical insights
  const insights = useMemo(() => {
    if (!state.savingsCategories || state.savingsCategories.length === 0) {
      return { averageCompletion: 0, onTrackCount: 0, categoryRanking: [] };
    }

    const categoryStats = (state.savingsCategories || []).map((cat) => {
      const actual = savingsActualByCategory[cat.id] || 0;
      const pct = cat.target ? Math.round((actual / cat.target) * 100) : 0;
      return { ...cat, actual, pct, behind: pct < 100 };
    });

    const onTrackCount = categoryStats.filter((c) => !c.behind).length;
    const totalCount = categoryStats.length;
    const averageCompletion = Math.round(
      categoryStats.reduce((sum, c) => sum + c.pct, 0) / totalCount
    );

    return {
      averageCompletion,
      onTrackCount,
      totalCount,
      categoryRanking: categoryStats.sort((a, b) => b.pct - a.pct),
    };
  }, [state.savingsCategories, savingsActualByCategory]);

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
            🏦 Savings
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Track your 55% savings allocation
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
      </div>

      {/* Header card like screenshot */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div>
            <div className="card-title">Savings Progress</div>
            <div className="card-subtitle">
              Track each savings category against your 55-40-5 savings goal.
            </div>
          </div>
          <div
            style={{
              textAlign: "right",
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 600,
            }}
          >
            <div>Month: {currentMonthKey}</div>
            <div style={{ fontSize: "11px", marginTop: "4px" }}>
              {
                (state.transactions || []).filter(
                  (t) =>
                    t.monthKey === currentMonthKey &&
                    (t.type === "saving" || t.type === "savings")
                ).length
              }{" "}
              transactions
            </div>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-pill summary-pill--income">
            <div className="summary-label">Total Income</div>
            <div className="summary-value">
              ₹ {app.totalIncome.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--savings">
            <div className="summary-label">Savings Goal (55%)</div>
            <div className="summary-value">
              ₹ {savingsTarget.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--actual">
            <div className="summary-label">Savings Actual (This Month)</div>
            <div className="summary-value">
              ₹ {totalActual.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--net">
            <div className="summary-label">Variance</div>
            <div className="summary-value">
              {variance >= 0 ? "₹ " : "−₹ "}
              {Math.abs(variance).toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      </div>

      {/* Savings table */}
      <div className="card">
        <div className="table-header">
          <span>Savings Progress by Category</span>
          <div className="table-header-stats">
            <span className="stat-badge">
              {insights.onTrackCount}/{insights.totalCount} On Track
            </span>
            <span className="stat-badge stat-badge--alt">
              Avg: {insights.averageCompletion}%
            </span>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Category</th>
                <th style={{ width: "12%" }}>Target</th>
                <th style={{ width: "12%" }}>Actual</th>
                <th style={{ width: "28%" }}>Progress</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "8%" }}>Gap</th>
              </tr>
            </thead>
            <tbody>
              {(state.savingsCategories || []).map((c) => {
                const actual = savingsActualByCategory[c.id] || 0;
                const pct = c.target
                  ? Math.round((actual / c.target) * 100)
                  : 0;
                const behind = pct < 100;
                const gap = (c.target || 0) - actual;

                // Calculate days remaining in current month
                const today = new Date();
                const lastDayOfMonth = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  0
                );
                const daysLeft = Math.ceil(
                  (lastDayOfMonth - today) / (1000 * 60 * 60 * 24)
                );

                return (
                  <tr
                    key={c.id}
                    className={behind ? "row-behind" : "row-ontrack"}
                  >
                    <td className="category-cell">
                      <div className="category-name">{c.name}</div>
                      <div className="category-meta">
                        {behind && daysLeft > 0 && (
                          <span className="days-left">
                            {daysLeft} days left
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="amount-cell">
                      ₹ {Number(c.target || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="amount-cell">
                      <span className="actual-amount">
                        ₹ {Number(actual).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <div className="progress-row">
                        <div className="progress-track">
                          <div
                            className={`progress-fill ${
                              behind
                                ? "progress-fill--behind"
                                : "progress-fill--ontrack"
                            }`}
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                            }}
                          />
                        </div>
                        <span className="progress-text">{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={
                          "status-badge " +
                          (behind ? "status-badge--danger" : "status-badge--ok")
                        }
                      >
                        {behind ? "Behind" : "✓ Done"}
                      </span>
                    </td>
                    <td className="gap-cell">
                      <span
                        className={`gap-amount ${
                          gap > 0 ? "negative" : "positive"
                        }`}
                      >
                        {gap > 0 ? "₹ " + gap.toLocaleString("en-IN") : "Over"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {(!state.savingsCategories ||
                state.savingsCategories.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", fontSize: 12 }}>
                    No savings categories yet. Add some in Goal Setup to see
                    progress.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analytics & Insights */}
      <div className="card analytics-card">
        <div className="card-title">📊 Performance Insights</div>
        <div className="insights-grid">
          <div className="insight-box insight-box--primary">
            <div className="insight-label">Portfolio Health</div>
            <div className="insight-value">{insights.averageCompletion}%</div>
            <div className="insight-meta">
              Average completion across all categories
            </div>
          </div>
          <div className="insight-box insight-box--success">
            <div className="insight-label">Categories On Track</div>
            <div className="insight-value">
              {insights.onTrackCount}/{insights.totalCount}
            </div>
            <div className="insight-meta">
              {insights.totalCount - insights.onTrackCount} need attention
            </div>
          </div>
          <div className="insight-box insight-box--warning">
            <div className="insight-label">Savings Pace</div>
            <div className="insight-value">
              {totalActual > 0
                ? Math.round((totalActual / savingsTarget) * 100)
                : 0}
              %
            </div>
            <div className="insight-meta">
              {variance >= 0 ? "On pace" : "Behind pace"}
            </div>
          </div>
          <div className="insight-box insight-box--info">
            <div className="insight-label">Remaining Gap</div>
            <div className="insight-value">
              ₹ {Math.abs(variance).toLocaleString("en-IN")}
            </div>
            <div className="insight-meta">
              {variance >= 0 ? "Surplus" : "To reach goal"}
            </div>
          </div>
        </div>

        {insights.categoryRanking && insights.categoryRanking.length > 0 && (
          <div className="ranking-section">
            <div className="ranking-title">Category Performance Ranking</div>
            <div className="ranking-list">
              {insights.categoryRanking.map((cat, idx) => (
                <div
                  key={cat.id}
                  className={`ranking-item ranking-${
                    idx === 0 ? "first" : idx === 1 ? "second" : "other"
                  }`}
                >
                  <div className="ranking-position">
                    <span className="position-number">#{idx + 1}</span>
                  </div>
                  <div className="ranking-info">
                    <span className="ranking-name">{cat.name}</span>
                    <span className="ranking-completion">
                      {cat.pct}% Complete
                    </span>
                  </div>
                  <div className="ranking-bar">
                    <div
                      className="ranking-fill"
                      style={{ width: `${cat.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tips & insights with emojis */}
      <div className="card tips-container">
        <div className="card-title tips-title">💡 Financial Health Tips</div>
        <ul className="tips-list">
          <li className="tips-item">
            🧯 <strong>Emergency Fund:</strong> Aim for 3–6 months of expenses.
          </li>
          <li className="tips-item">
            📈 <strong>Investment Tip:</strong> Consider topping up SIP when
            markets dip (if within your risk profile).
          </li>
          <li className="tips-item">
            🎯 <strong>Goal Review:</strong> Revisit your 55-40-5 split every
            quarter.
          </li>
          <li className="tips-item">
            📊 <strong>Audit:</strong> Check which categories are always
            "Behind" and adjust.
          </li>
        </ul>
      </div>
    </div>
  );
}
