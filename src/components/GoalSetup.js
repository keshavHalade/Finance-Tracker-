import React, { useState, useEffect } from "react";

export default function GoalSetup({ app }) {
  const {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    bufferTarget,
    setRatio,
    resetRatioToDefault,
  } = {
    ...app,
    ratio: app.state.ratio,
  };

  const [localRatio, setLocalRatio] = useState(state.ratio);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setLocalRatio(state.ratio);
  }, [state.ratio]);

  const handleRatioChange = (key, value) => {
    const num = Number(value) || 0;
    const updated = { ...localRatio, [key]: num };
    setLocalRatio(updated);
    setRatio(updated);
  };

  const ratioTotal =
    (localRatio.savings || 0) +
    (localRatio.expenses || 0) +
    (localRatio.buffer || 0);
  const isBalanced = ratioTotal === 100;
  const difference = 100 - ratioTotal;

  // Data analyst insights
  const savingsPercentage = localRatio.savings;
  const expensesPercentage = localRatio.expenses;
  const bufferPercentage = localRatio.buffer;

  const savingsHealthScore = Math.min(100, (savingsPercentage / 55) * 100);
  const allocationHealthScore = isBalanced
    ? 100
    : Math.max(0, 100 - Math.abs(difference) * 2);

  const monthlyBreakdown = {
    savings: savingsTarget,
    expenses: expensesTarget,
    buffer: bufferTarget,
  };

  const annualProjection = {
    savings: savingsTarget * 12,
    expenses: expensesTarget * 12,
    buffer: bufferTarget * 12,
  };

  return (
    <div>
      {/* Header - Compact */}
      <div className="goal-header-compact">
        <div className="goal-header-left">
          <h3 className="goal-section-title">🎯 Financial Goals</h3>
          <p className="goal-section-subtitle">
            Define your 55-40-5 allocation strategy
          </p>
        </div>
        <div className="goal-header-right">
          <div className="income-badge-goal">
            <span className="badge-label-goal">Monthly Income</span>
            <span className="badge-amount-goal">
              ₹{totalIncome.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Ratio Adjustment Card */}
      <div className="card goal-adjustment-card">
        <div className="card-title">💰 Allocation Ratio</div>
        <p className="card-subtitle">
          Adjust your 55-40-5 breakdown or use the default
        </p>

        <div className="ratio-grid">
          <div className="ratio-input-group">
            <label className="ratio-label">
              <span className="ratio-icon">💾</span>
              <span className="ratio-name">Savings</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={localRatio.savings}
              onChange={(e) => handleRatioChange("savings", e.target.value)}
              className="ratio-input"
            />
            <span className="ratio-percent">%</span>
          </div>

          <div className="ratio-input-group">
            <label className="ratio-label">
              <span className="ratio-icon">🛒</span>
              <span className="ratio-name">Expenses</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={localRatio.expenses}
              onChange={(e) => handleRatioChange("expenses", e.target.value)}
              className="ratio-input"
            />
            <span className="ratio-percent">%</span>
          </div>

          <div className="ratio-input-group">
            <label className="ratio-label">
              <span className="ratio-icon">🛡️</span>
              <span className="ratio-name">Buffer</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              value={localRatio.buffer}
              onChange={(e) => handleRatioChange("buffer", e.target.value)}
              className="ratio-input"
            />
            <span className="ratio-percent">%</span>
          </div>
        </div>

        {/* Ratio Total Status */}
        <div
          className={`ratio-status ${isBalanced ? "balanced" : "unbalanced"}`}
        >
          <div className="status-bar">
            <div
              className="status-fill"
              style={{ width: `${Math.min(ratioTotal, 100)}%` }}
            />
          </div>
          <div className="status-text">
            {isBalanced ? (
              <>✓ Perfect! Total = 100%</>
            ) : (
              <>
                ⚠️ Total: {ratioTotal}% (Need: {Math.abs(difference)}% more)
              </>
            )}
          </div>
        </div>

        <div className="button-group-right">
          <button className="btn-reset-ratio" onClick={resetRatioToDefault}>
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Monthly Targets */}
      <div className="card goal-targets-card">
        <div className="card-title">📊 Monthly Targets</div>
        <p className="card-subtitle">
          Based on ₹{totalIncome.toLocaleString("en-IN")} monthly income
        </p>

        <div className="targets-grid">
          <div className="target-box savings-target">
            <div className="target-icon">💾</div>
            <div className="target-info">
              <div className="target-label">Savings Target</div>
              <div className="target-amount">
                ₹{savingsTarget.toLocaleString("en-IN")}
              </div>
              <div className="target-percent">{localRatio.savings}%</div>
            </div>
            <div className="target-bar">
              <div
                className="target-fill"
                style={{ height: `${localRatio.savings}%` }}
              />
            </div>
          </div>

          <div className="target-box expenses-target">
            <div className="target-icon">🛒</div>
            <div className="target-info">
              <div className="target-label">Expenses Limit</div>
              <div className="target-amount">
                ₹{expensesTarget.toLocaleString("en-IN")}
              </div>
              <div className="target-percent">{localRatio.expenses}%</div>
            </div>
            <div className="target-bar">
              <div
                className="target-fill"
                style={{ height: `${localRatio.expenses}%` }}
              />
            </div>
          </div>

          <div className="target-box buffer-target">
            <div className="target-icon">🛡️</div>
            <div className="target-info">
              <div className="target-label">Buffer Amount</div>
              <div className="target-amount">
                ₹{bufferTarget.toLocaleString("en-IN")}
              </div>
              <div className="target-percent">{localRatio.buffer}%</div>
            </div>
            <div className="target-bar">
              <div
                className="target-fill"
                style={{ height: `${localRatio.buffer}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data Analyst Insights */}
      <div className="card goal-insights-card">
        <div className="card-title">🔍 Goal Analysis</div>

        <div className="insights-metrics">
          <div className="insight-metric">
            <div className="metric-icon">💪</div>
            <div className="metric-info">
              <div className="metric-label">Savings Health</div>
              <div className="metric-value">
                {Math.round(savingsHealthScore)}%
              </div>
              <div className="metric-desc">
                {savingsPercentage >= 55
                  ? "✓ Excellent savings focus"
                  : "⚠️ Below recommended 55%"}
              </div>
            </div>
          </div>

          <div className="insight-metric">
            <div className="metric-icon">⚖️</div>
            <div className="metric-info">
              <div className="metric-label">Allocation Health</div>
              <div className="metric-value">
                {Math.round(allocationHealthScore)}%
              </div>
              <div className="metric-desc">
                {isBalanced
                  ? "✓ Perfectly balanced"
                  : `⚠️ Adjust by ${Math.abs(difference)}%`}
              </div>
            </div>
          </div>

          <div className="insight-metric">
            <div className="metric-icon">📈</div>
            <div className="metric-info">
              <div className="metric-label">Annual Savings</div>
              <div className="metric-value">
                ₹{(Math.round(annualProjection.savings / 10000) * 10000) / 1000}
                k
              </div>
              <div className="metric-desc">
                At current {savingsPercentage}% allocation
              </div>
            </div>
          </div>

          <div className="insight-metric">
            <div className="metric-icon">🎯</div>
            <div className="metric-info">
              <div className="metric-label">Goal Type</div>
              <div className="metric-value">
                {savingsPercentage >= 60
                  ? "Aggressive"
                  : savingsPercentage >= 50
                  ? "Balanced"
                  : "Conservative"}
              </div>
              <div className="metric-desc">Your strategy classification</div>
            </div>
          </div>
        </div>

        <div className="button-group-right">
          <button
            className="btn-toggle-advanced"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? "▼" : "▶"} Projections
          </button>
        </div>

        {showAdvanced && (
          <div className="advanced-projections">
            <div className="projection-item">
              <span className="proj-label">
                📅 Annual Projection (12 months)
              </span>
              <div className="proj-grid">
                <div className="proj-box">
                  <div className="proj-title">Savings</div>
                  <div className="proj-amount">
                    ₹{annualProjection.savings.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="proj-box">
                  <div className="proj-title">Expenses</div>
                  <div className="proj-amount">
                    ₹{annualProjection.expenses.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="proj-box">
                  <div className="proj-title">Buffer</div>
                  <div className="proj-amount">
                    ₹{annualProjection.buffer.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            <div className="projection-item">
              <span className="proj-label">
                🎯 5-Year Accumulation (60 months)
              </span>
              <div className="proj-grid">
                <div className="proj-box">
                  <div className="proj-title">Total Savings</div>
                  <div className="proj-amount">
                    ₹{(annualProjection.savings * 5).toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="proj-box">
                  <div className="proj-title">Monthly Growth</div>
                  <div className="proj-amount">
                    ₹{savingsTarget.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div className="card goal-recommendations-card">
        <div className="card-title">💡 Smart Recommendations</div>

        <div className="recommendations-list">
          {savingsPercentage < 50 && (
            <div className="recommendation-item warning">
              <span className="rec-icon">⚠️</span>
              <div className="rec-content">
                <div className="rec-title">Increase Savings Target</div>
                <div className="rec-text">
                  Your savings allocation is below 50%. Consider increasing it
                  to build emergency funds.
                </div>
              </div>
            </div>
          )}

          {expensesPercentage > 50 && (
            <div className="recommendation-item warning">
              <span className="rec-icon">💸</span>
              <div className="rec-content">
                <div className="rec-title">Optimize Expenses</div>
                <div className="rec-text">
                  Expenses exceed 50%. Review and categorize to identify savings
                  opportunities.
                </div>
              </div>
            </div>
          )}

          {!isBalanced && (
            <div className="recommendation-item info">
              <span className="rec-icon">ℹ️</span>
              <div className="rec-content">
                <div className="rec-title">Adjust Allocation</div>
                <div className="rec-text">
                  Your ratio totals {ratioTotal}%. Adjust values to sum to 100%
                  for optimal tracking.
                </div>
              </div>
            </div>
          )}

          {isBalanced &&
            savingsPercentage >= 55 &&
            expensesPercentage <= 40 && (
              <div className="recommendation-item success">
                <span className="rec-icon">✓</span>
                <div className="rec-content">
                  <div className="rec-title">Perfect Allocation!</div>
                  <div className="rec-text">
                    Your 55-40-5 ratio is perfectly configured. Stay consistent
                    with this strategy.
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
