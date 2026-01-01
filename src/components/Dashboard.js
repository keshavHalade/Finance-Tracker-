import React from "react";
import MonthSelector from "./MonthSelector";
import "../Style/dashboardStyle.css";

// Donut Chart component - renders segments as circles with stroke-dasharray
function DonutChart({ segments, size = 160 }) {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const circles = segments.map((segment, idx) => {
    const { color, percent } = segment;
    const segmentLength = (circumference * percent) / 100;

    const element = (
      <circle
        key={idx}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke={color}
        strokeWidth="20"
        strokeDasharray={`${segmentLength} ${circumference}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: `${size / 2}px ${size / 2}px`,
          transition: "stroke-dasharray 0.3s",
        }}
      />
    );

    offset += segmentLength;
    return element;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ maxWidth: "100%" }}
    >
      <circle
        r={radius}
        cx={size / 2}
        cy={size / 2}
        fill="transparent"
        stroke="#f3f4f6"
        strokeWidth="16"
      />
      {circles}
    </svg>
  );
}

export default function Dashboard({ app }) {
  const { totalIncome, savingsTarget, expensesTarget, bufferTarget, state } =
    app;

  // TARGET pie chart data (55-40-5)
  const savingsPct = totalIncome
    ? Math.round((savingsTarget / totalIncome) * 100)
    : 0;
  const expensesPct = totalIncome
    ? Math.round((expensesTarget / totalIncome) * 100)
    : 0;
  const bufferPct = totalIncome
    ? Math.round((bufferTarget / totalIncome) * 100)
    : 0;

  // ACTUAL transaction data from current month
  const currentMonthTransactions = (state.transactions || []).filter(
    (t) => t.monthKey === state.currentMonthKey
  );
  const savingsActual = currentMonthTransactions
    .filter((t) => t.type === "saving")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const expensesActual = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0);
  const bufferUsed = currentMonthTransactions
    .filter((t) => t.type === "buffer")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const netBalance =
    (totalIncome || 0) - savingsActual - expensesActual - bufferUsed;

  // Transaction pie chart data
  const totalActual = savingsActual + expensesActual + bufferUsed;
  const sActualPct = totalActual
    ? Math.round((savingsActual / totalActual) * 100)
    : 0;
  const eActualPct = totalActual
    ? Math.round((expensesActual / totalActual) * 100)
    : 0;
  const bActualPct = totalActual
    ? Math.round((bufferUsed / totalActual) * 100)
    : 0;

  // Prepare donut segments
  const targetSegments = [
    { color: "#10b981", percent: savingsPct || 0 },
    { color: "#ef4444", percent: expensesPct || 0 },
    { color: "#f59e0b", percent: bufferPct || 0 },
  ];

  const actualSegments = [
    { color: "#10b981", percent: sActualPct || 0 },
    { color: "#ef4444", percent: eActualPct || 0 },
    { color: "#f59e0b", percent: bActualPct || 0 },
  ];

  // safe percent helper to avoid NaN/Infinity when totalIncome is zero
  const safePercentOfIncome = (value) => {
    if (!totalIncome) return 0;
    return Math.min(Math.max((value / totalIncome) * 100, -100), 100);
  };
  const balancePct = safePercentOfIncome(netBalance);

  // ==== DATA ANALYST FEATURES ====
  // 1. Variance Analysis (Target vs Actual)
  const savingsVariance = savingsActual - savingsTarget;
  const expensesVariance = expensesActual - expensesTarget;
  const bufferVariance = bufferUsed - bufferTarget;

  // 2. Goal Achievement Percentage
  const savingsAchievement = savingsTarget
    ? Math.round((savingsActual / savingsTarget) * 100)
    : 0;
  const expensesAchievement = expensesTarget
    ? Math.round((expensesActual / expensesTarget) * 100)
    : 0;
  const bufferAchievement = bufferTarget
    ? Math.round((bufferUsed / bufferTarget) * 100)
    : 0;

  // 3. Category Breakdown Analysis - LIVE from transactions
  // Get all categories for lookup
  const allCats = [
    ...(state.savingsCategories || []),
    ...(state.expenseCategories || []),
    ...(state.bufferCategories || []),
  ];

  const getCategoryName = (categoryId) => {
    const cat = allCats.find((c) => c.id === categoryId);
    return cat?.name || "Unknown";
  };

  // Group transactions by category
  const savingsByCategory = {};
  const expensesByCategory = {};
  const bufferByCategory = {};

  currentMonthTransactions.forEach((t) => {
    const catName = getCategoryName(t.categoryId);
    if (t.type === "saving" && t.categoryId) {
      savingsByCategory[catName] =
        (savingsByCategory[catName] || 0) + (t.amount || 0);
    } else if (t.type === "expense" && t.categoryId) {
      expensesByCategory[catName] =
        (expensesByCategory[catName] || 0) + (t.amount || 0);
    } else if (t.type === "buffer" && t.categoryId) {
      bufferByCategory[catName] =
        (bufferByCategory[catName] || 0) + (t.amount || 0);
    }
  });

  const categorySavings = Object.entries(savingsByCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: savingsTarget ? (amount / savingsTarget) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryExpenses = Object.entries(expensesByCategory)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: expensesTarget ? (amount / expensesTarget) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // 4. Budget Efficiency Score
  const efficiencyScore = Math.max(
    0,
    100 -
      ((Math.abs(savingsVariance) +
        Math.abs(expensesVariance) +
        Math.abs(bufferVariance)) /
        totalIncome) *
        100
  );

  // 5. Overspending Alert
  const isOverspending = expensesActual > expensesTarget && expensesTarget > 0;
  const underspendingSavings =
    savingsActual < savingsTarget && savingsTarget > 0;

  // 6. Days elapsed in month (approximate)
  const monthStart = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1
  );
  const today = new Date();
  const daysElapsed = Math.floor((today - monthStart) / (1000 * 60 * 60 * 24));
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const monthProgress = Math.round((daysElapsed / daysInMonth) * 100);

  return (
    <div className="dashboard-container">
      {/* Header with Month Selector on Right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          padding: "0 16px",
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
            📊 Dashboard
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Your 55-40-5 budget allocation overview
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={app.setCurrentMonthKey}
          />
        </div>
      </div>

      {/* Two Charts Side by Side - Target vs Actual */}
      <div className="dashboard-charts-comparison">
        {/* Target Budget (55-40-5 Rule) */}
        <div className="dashboard-card dashboard-chart-card-half">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">🎯 Target Budget</div>
            <div className="badge-label">55-40-5 Rule</div>
          </div>
          <div className="chart-wrapper">
            <DonutChart segments={targetSegments} size={200} />
            <div className="chart-legend">
              <div className="legend-item-small">
                <div className="legend-color savings"></div>
                <div className="legend-content">
                  <span>Savings</span>
                  <strong>{savingsPct}%</strong>
                </div>
                <span className="amount">
                  ₹{savingsTarget.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="legend-item-small">
                <div className="legend-color expenses"></div>
                <div className="legend-content">
                  <span>Expenses</span>
                  <strong>{expensesPct}%</strong>
                </div>
                <span className="amount">
                  ₹{expensesTarget.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="legend-item-small">
                <div className="legend-color buffer"></div>
                <div className="legend-content">
                  <span>Buffer</span>
                  <strong>{bufferPct}%</strong>
                </div>
                <span className="amount">
                  ₹{bufferTarget.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actual Transactions */}
        <div className="dashboard-card dashboard-chart-card-half">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">📈 Actual Spending</div>
            <div className="badge-label">{state.currentMonthKey}</div>
          </div>
          <div className="chart-wrapper">
            <DonutChart segments={actualSegments} size={200} />
            <div className="chart-legend">
              <div className="legend-item-small">
                <div className="legend-color savings"></div>
                <div className="legend-content">
                  <span>Savings</span>
                  <strong>{sActualPct}%</strong>
                </div>
                <span className="amount">
                  ₹{savingsActual.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="legend-item-small">
                <div className="legend-color expenses"></div>
                <div className="legend-content">
                  <span>Expenses</span>
                  <strong>{eActualPct}%</strong>
                </div>
                <span className="amount">
                  ₹{expensesActual.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="legend-item-small">
                <div className="legend-color buffer"></div>
                <div className="legend-content">
                  <span>Buffer</span>
                  <strong>{bActualPct}%</strong>
                </div>
                <span className="amount">
                  ₹{bufferUsed.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Net Balance Card */}
      <div className="dashboard-card dashboard-balance-card">
        <div className="balance-header">
          <div className="dashboard-card-title">💳 Net Balance</div>
          <div
            className={`balance-badge ${
              netBalance >= 0 ? "positive" : "negative"
            }`}
          >
            {netBalance >= 0 ? "✓ On Track" : "⚠ Behind Target"}
          </div>
        </div>
        <div
          className={`balance-amount ${
            netBalance >= 0 ? "positive" : "negative"
          }`}
        >
          ₹{netBalance.toLocaleString("en-IN")}
        </div>
        <div className="balance-status">
          {netBalance >= 0 ? "On Track" : "Behind Target"}
        </div>
        <div className="balance-progress">
          <div
            className="balance-fill"
            style={{
              width: `${Math.min(
                Math.max((netBalance / totalIncome) * 100, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Performance Metrics & Summary - 2 Column Grid */}
      <div className="dashboard-metrics-summary-grid">
        {/* Variance Analysis & Insights */}
        <div className="dashboard-card dashboard-metrics-card">
          <div className="dashboard-card-title">📊 Variance Analysis</div>

          <div className="metrics-section">
            <div className="metric-item metric-savings">
              <div className="metric-icon">💾</div>
              <div className="metric-content">
                <div className="metric-label">Savings Variance</div>
                <div className="metric-value-large">
                  {savingsVariance >= 0 ? "+" : ""}₹
                  {Math.abs(savingsVariance).toLocaleString("en-IN")}
                </div>
                <div className="metric-progress">
                  Target: ₹{savingsTarget.toLocaleString("en-IN")} | Actual: ₹
                  {savingsActual.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="metric-item metric-expenses">
              <div className="metric-icon">🛒</div>
              <div className="metric-content">
                <div className="metric-label">Expense Variance</div>
                <div className="metric-value-large">
                  {expensesVariance >= 0 ? "+" : ""}₹
                  {Math.abs(expensesVariance).toLocaleString("en-IN")}
                </div>
                <div className="metric-progress">
                  Target: ₹{expensesTarget.toLocaleString("en-IN")} | Actual: ₹
                  {expensesActual.toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="metric-item metric-buffer">
              <div className="metric-icon">🛡️</div>
              <div className="metric-content">
                <div className="metric-label">Buffer Variance</div>
                <div className="metric-value-large">
                  {bufferVariance >= 0 ? "+" : ""}₹
                  {Math.abs(bufferVariance).toLocaleString("en-IN")}
                </div>
                <div className="metric-progress">
                  Target: ₹{bufferTarget.toLocaleString("en-IN")} | Actual: ₹
                  {bufferUsed.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Health & Efficiency */}
        <div className="dashboard-card dashboard-summary-card">
          <div className="dashboard-card-title">⚡ Budget Health Score</div>

          <div className="health-score-display">
            <div className="score-circle">
              <div className="score-value">{Math.round(efficiencyScore)}%</div>
              <div className="score-label">Efficiency</div>
            </div>
            <div className="health-indicators">
              <div
                className={`health-item ${
                  savingsAchievement >= 100 ? "positive" : "warning"
                }`}
              >
                <span>💾</span>
                <div>
                  <div className="indicator-label">Savings Achievement</div>
                  <div className="indicator-value">{savingsAchievement}%</div>
                </div>
              </div>

              <div
                className={`health-item ${
                  isOverspending ? "danger" : "positive"
                }`}
              >
                <span>🛒</span>
                <div>
                  <div className="indicator-label">Expense Status</div>
                  <div className="indicator-value">{expensesAchievement}%</div>
                </div>
              </div>

              <div
                className={`health-item ${
                  bufferAchievement >= 50 ? "positive" : "warning"
                }`}
              >
                <span>🛡️</span>
                <div>
                  <div className="indicator-label">Buffer Usage</div>
                  <div className="indicator-value">{bufferAchievement}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Analysis */}
      <div className="dashboard-category-breakdown">
        {categorySavings.length > 0 ? (
          <div className="dashboard-card category-card">
            <div className="dashboard-card-title">💾 Savings Breakdown</div>
            <div className="category-list">
              {categorySavings.slice(0, 5).map((cat) => (
                <div key={cat.name} className="category-item">
                  <div className="category-name">{cat.name}</div>
                  <div className="category-bar">
                    <div
                      className="category-fill savings-fill"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="category-value">
                    ₹{cat.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard-card category-card">
            <div className="dashboard-card-title">💾 Savings Breakdown</div>
            <div
              style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}
            >
              No savings transactions yet. Add savings transactions to see
              breakdown.
            </div>
          </div>
        )}

        {categoryExpenses.length > 0 ? (
          <div className="dashboard-card category-card">
            <div className="dashboard-card-title">🛒 Expense Breakdown</div>
            <div className="category-list">
              {categoryExpenses.slice(0, 5).map((cat) => (
                <div key={cat.name} className="category-item">
                  <div className="category-name">{cat.name}</div>
                  <div className="category-bar">
                    <div
                      className="category-fill expense-fill"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="category-value">
                    ₹{cat.amount.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dashboard-card category-card">
            <div className="dashboard-card-title">🛒 Expense Breakdown</div>
            <div
              style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}
            >
              No expense transactions yet. Add expense transactions to see
              breakdown.
            </div>
          </div>
        )}
      </div>

      {/* Month Progress & Alerts */}
      <div className="dashboard-progress-alerts">
        <div className="dashboard-card progress-card">
          <div className="dashboard-card-title">📈 Month Progress</div>
          <div className="progress-wrapper">
            <div className="progress-info">
              <span className="progress-label">Days Elapsed</span>
              <span className="progress-percentage">{monthProgress}%</span>
            </div>
            <div className="progress-bar-large">
              <div
                className="progress-fill-large"
                style={{ width: `${monthProgress}%` }}
              />
            </div>
            <div className="progress-detail">
              {daysElapsed} of {daysInMonth} days completed
            </div>
          </div>
        </div>

        <div className="dashboard-card alerts-card">
          <div className="dashboard-card-title">🎯 Quick Insights</div>
          <div className="alerts-list">
            {isOverspending && (
              <div className="alert-item alert-danger">
                <span className="alert-icon">⚠️</span>
                <div>
                  <div className="alert-title">Overspending Alert</div>
                  <div className="alert-text">
                    Expenses exceed budget by ₹
                    {Math.abs(expensesVariance).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            )}

            {underspendingSavings && (
              <div className="alert-item alert-warning">
                <span className="alert-icon">💡</span>
                <div>
                  <div className="alert-title">Savings Gap</div>
                  <div className="alert-text">
                    Behind savings target by ₹
                    {Math.abs(savingsVariance).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            )}

            {!isOverspending && !underspendingSavings && (
              <div className="alert-item alert-success">
                <span className="alert-icon">✅</span>
                <div>
                  <div className="alert-title">On Track</div>
                  <div className="alert-text">
                    Your budget allocation is healthy. Keep up the good work!
                  </div>
                </div>
              </div>
            )}

            <div className="alert-item alert-info">
              <span className="alert-icon">ℹ️</span>
              <div>
                <div className="alert-title">Month Timeline</div>
                <div className="alert-text">
                  {monthProgress}% through the month with{" "}
                  {daysInMonth - daysElapsed} days remaining
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
