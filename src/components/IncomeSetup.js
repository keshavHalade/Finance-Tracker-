import React, { useState } from "react";

export default function IncomeSetup({ app }) {
  const { state, setIncomeSources, totalIncome } = app;
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Common income sources for quick add
  const suggestedSources = [
    { icon: "💼", name: "Salary" },
    { icon: "💻", name: "Freelance" },
    { icon: "🏠", name: "Rent Income" },
    { icon: "📈", name: "Investments" },
    { icon: "🛍️", name: "Side Business" },
    { icon: "💳", name: "Bonuses" },
  ];

  const addIncomeSource = () => {
    if (!name.trim() || !amount) return;

    if (editingId) {
      // Update existing
      const updated = state.incomeSources.map((src) =>
        src.id === editingId
          ? { ...src, name: name.trim(), amount: Number(amount) || 0 }
          : src
      );
      setIncomeSources(updated);
      setEditingId(null);
    } else {
      // Add new
      const newSource = {
        id: crypto.randomUUID(),
        name: name.trim(),
        amount: Number(amount) || 0,
      };
      setIncomeSources([...state.incomeSources, newSource]);
    }

    setName("");
    setAmount("");
    setShowForm(false);
  };

  const addSuggestedSource = (sourceName) => {
    setName(sourceName);
    setShowForm(true);
    setEditingId(null);
  };

  const removeSource = (id) => {
    setIncomeSources(state.incomeSources.filter((src) => src.id !== id));
  };

  const editSource = (src) => {
    setEditingId(src.id);
    setName(src.name);
    setAmount(src.amount);
    setShowForm(true);
  };

  // Calculate percentages
  const getSourcePercentage = (amount) => {
    return totalIncome ? Math.round((amount / totalIncome) * 100) : 0;
  };

  // Sort sources by amount (highest first)
  const sortedSources = [...state.incomeSources].sort(
    (a, b) => b.amount - a.amount
  );

  // Analytics calculations
  const avgIncome =
    sortedSources.length > 0
      ? Math.round(totalIncome / sortedSources.length)
      : 0;
  const largestSource = sortedSources[0]?.amount || 0;
  const smallestSource =
    sortedSources.length > 0
      ? sortedSources[sortedSources.length - 1].amount
      : 0;
  const incomeStability =
    sortedSources.length > 1
      ? Math.round(
          ((totalIncome - Math.max(...sortedSources.map((s) => s.amount))) /
            totalIncome) *
            100
        )
      : 100;

  return (
    <div>
      {/* Header Section - Compact */}
      <div className="income-header-compact">
        <div className="income-header-left">
          <h3 className="income-section-title">💰 Income Sources</h3>
          <p className="income-section-subtitle">Manage your income streams</p>
        </div>
        <div className="income-header-right">
          <div className="income-total-mini">
            <span className="total-label">Monthly Income</span>
            <span className="total-amount">
              ₹{totalIncome.toLocaleString("en-IN")}
            </span>
          </div>
          <button
            className="btn-add-mini"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setName("");
              setAmount("");
            }}
          >
            ➕
          </button>
        </div>
      </div>

      {/* Quick Suggestions - Only show if no sources */}
      {state.incomeSources.length === 0 && (
        <div className="card suggestions-card">
          <div className="card-title">🎯 Quick Start</div>
          <div className="suggestions-grid">
            {suggestedSources.map((source) => (
              <button
                key={source.name}
                className="suggestion-btn"
                onClick={() => addSuggestedSource(source.name)}
              >
                <span className="suggestion-icon">{source.icon}</span>
                <div className="suggestion-text">{source.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal Popup Form */}
      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowForm(false);
            setName("");
            setAmount("");
            setEditingId(null);
          }}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4 className="modal-title">
                {editingId ? "✏️ Edit Income" : "➕ Add Income Source"}
              </h4>
              <button
                className="btn-modal-close"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setAmount("");
                  setEditingId(null);
                }}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <label className="form-label">
                <span className="label-text">Income Name</span>
                <input
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Salary, Freelance"
                  onKeyPress={(e) => e.key === "Enter" && addIncomeSource()}
                  autoFocus
                />
              </label>

              <label className="form-label">
                <span className="label-text">Amount (₹)</span>
                <input
                  className="form-input"
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  onKeyPress={(e) => e.key === "Enter" && addIncomeSource()}
                />
              </label>
            </div>

            <div className="modal-actions">
              <button className="btn-primary" onClick={addIncomeSource}>
                {editingId ? "Update" : "Add"} Income
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setName("");
                  setAmount("");
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Income Sources Grid */}
      {sortedSources.length > 0 && (
        <div className="income-sources-grid">
          <div className="grid-header">
            <h4 className="grid-title">📋 Income Sources</h4>
            <span className="source-count">{sortedSources.length}</span>
          </div>

          <div className="sources-grid-container">
            {sortedSources.map((src) => (
              <div key={src.id} className="income-card-compact">
                <div className="card-top">
                  <div className="card-info">
                    <div className="card-name">{src.name}</div>
                    <div className="card-amount">
                      ₹{src.amount.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="card-percent">
                    {getSourcePercentage(src.amount)}%
                  </div>
                </div>

                <div className="card-bar">
                  <div
                    className="card-fill"
                    style={{
                      width: `${Math.min(
                        (src.amount / totalIncome) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <div className="card-actions">
                  <button
                    className="btn-edit-small"
                    onClick={() => editSource(src)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-delete-small"
                    onClick={() => removeSource(src.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Analyst Insights */}
      {sortedSources.length > 0 && (
        <div className="card income-insights-card">
          <div className="card-title">📊 Income Insights</div>

          <div className="insights-grid">
            <div className="insight-box">
              <div className="insight-icon">💰</div>
              <div className="insight-label">Total Monthly</div>
              <div className="insight-value">
                ₹{totalIncome.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="insight-box">
              <div className="insight-icon">📈</div>
              <div className="insight-label">Average Source</div>
              <div className="insight-value">
                ₹{avgIncome.toLocaleString("en-IN")}
              </div>
            </div>

            <div className="insight-box">
              <div className="insight-icon">🎯</div>
              <div className="insight-label">Largest Source</div>
              <div className="insight-value">
                {sortedSources[0]?.name || "N/A"}
              </div>
            </div>

            <div className="insight-box">
              <div className="insight-icon">🛡️</div>
              <div className="insight-label">Income Stability</div>
              <div className="insight-value">{incomeStability}%</div>
            </div>
          </div>

          {/* Income Distribution Breakdown */}
          <div className="distribution-section">
            <div className="distribution-title">Distribution Breakdown</div>
            {sortedSources.map((src) => (
              <div key={src.id} className="distribution-row">
                <div className="dist-label">{src.name}</div>
                <div className="dist-bar">
                  <div
                    className="dist-fill"
                    style={{ width: `${getSourcePercentage(src.amount)}%` }}
                  />
                </div>
                <div className="dist-percent">
                  {getSourcePercentage(src.amount)}%
                </div>
              </div>
            ))}
          </div>

          {/* Smart Insights */}
          {sortedSources.length > 1 && (
            <div className="insights-alerts">
              {largestSource > avgIncome * 1.5 && (
                <div className="insight-alert warning">
                  ⚠️ {sortedSources[0].name} dominates your income (
                  {getSourcePercentage(largestSource)}%). Consider diversifying.
                </div>
              )}
              {sortedSources.length >= 3 && (
                <div className="insight-alert success">
                  ✓ Great income diversification with {sortedSources.length}{" "}
                  sources!
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
