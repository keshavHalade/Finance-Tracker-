import React, { useState, useMemo } from "react";

function CategoryModal({ title, categories, onSave, onClose }) {
  const [local, setLocal] = useState(categories || []);

  const handleNameChange = (id, value) => {
    setLocal((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );
  };

  const handleAmountChange = (id, value) => {
    setLocal((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount: Number(value) || 0 } : c))
    );
  };

  const addCategory = () => {
    setLocal((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "New Category", amount: 0 },
    ]);
  };

  const removeCategory = (id) => {
    setLocal((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    onSave(local);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <button type="button" className="btn-close" onClick={onClose}>
          ✕
        </button>
        <div className="modal-title">{title}</div>
        <div className="modal-body">
          {local.map((c) => (
            <div key={c.id} className="modal-row">
              <input
                className="cell-input"
                placeholder="Category name"
                value={c.name}
                onChange={(e) => handleNameChange(c.id, e.target.value)}
              />
              <input
                className="cell-input"
                type="number"
                placeholder="Amount"
                value={c.amount || ""}
                onChange={(e) => handleAmountChange(c.id, e.target.value)}
              />
              <button
                type="button"
                className="btn-delete"
                onClick={() => removeCategory(c.id)}
              >
                🗑
              </button>
            </div>
          ))}
          <button
            type="button"
            className="primary"
            onClick={addCategory}
            style={{ width: "100%", marginTop: 8 }}
          >
            + Add Category
          </button>
        </div>
        <div className="modal-footer">
          <button type="button" className="primary" onClick={handleSave}>
            Save Changes
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SetupTab({ app }) {
  const {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    bufferTarget,
    setSavingsCategories,
    setExpenseCategories,
    setBufferCategories,
  } = app;
  const [modalType, setModalType] = useState(null);

  const savingsList = useMemo(
    () =>
      (state.savingsCategories || []).map((c) => ({
        id: c.id,
        name: c.name,
        amount: c.target || 0,
      })),
    [state.savingsCategories]
  );
  const expensesList = useMemo(
    () =>
      (state.expenseCategories || []).map((c) => ({
        id: c.id,
        name: c.name,
        amount: c.limit || 0,
      })),
    [state.expenseCategories]
  );
  const bufferList = useMemo(
    () =>
      (state.bufferCategories || []).map((c) => ({
        id: c.id,
        name: c.name,
        amount: c.amount || 0,
      })),
    [state.bufferCategories]
  );

  const savingsTotal = savingsList.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0
  );
  const expensesTotal = expensesList.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0
  );
  const bufferTotal = bufferList.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0
  );

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleSaveModal = (list) => {
    if (modalType === "savings") {
      setSavingsCategories(
        list.map((c) => ({
          id: c.id,
          name: c.name,
          target: c.amount,
          actual: 0,
        }))
      );
    } else if (modalType === "expenses") {
      setExpenseCategories(
        list.map((c) => ({
          id: c.id,
          name: c.name,
          limit: c.amount,
          actual: 0,
        }))
      );
    } else if (modalType === "buffer") {
      setBufferCategories(
        list.map((c) => ({ id: c.id, name: c.name, amount: c.amount, used: 0 }))
      );
    }
    closeModal();
  };

  const totalAllocation = savingsTotal + expensesTotal + bufferTotal;
  const exceedsIncome = totalAllocation > totalIncome && totalIncome > 0;
  const allocationPercent =
    totalIncome > 0 ? Math.round((totalAllocation / totalIncome) * 100) : 0;

  return (
    <div>
      {/* Income Overview Card */}
      <div className="card setup-income-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div className="card-title">💳 Total Monthly Income</div>
            <div className="card-subtitle">
              Your complete income allocation plan
            </div>
          </div>
          <div className="income-icon">💰</div>
        </div>
        <p
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#667eea",
            margin: "12px 0",
          }}
        >
          ₹ {totalIncome.toLocaleString("en-IN")}
        </p>

        {/* Allocation Progress */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>
              Budget Allocation
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#667eea" }}>
              {allocationPercent}%
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(allocationPercent, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="summary-row">
          <div className="summary-pill summary-pill--savings">
            <div className="summary-label">💾 Savings (55%)</div>
            <div className="summary-value">
              ₹ {savingsTarget.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--actual">
            <div className="summary-label">🛒 Expenses (40%)</div>
            <div className="summary-value">
              ₹ {expensesTarget.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="summary-pill summary-pill--net">
            <div className="summary-label">🛡️ Buffer (5%)</div>
            <div className="summary-value">
              ₹ {bufferTarget.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {exceedsIncome && (
          <div className="alert-strip alert-strip--danger">
            <span className="alert-emoji">⚠️</span>
            <span>
              Total allocation (₹{totalAllocation.toLocaleString("en-IN")})
              exceeds income!
            </span>
          </div>
        )}
        {!exceedsIncome && totalIncome > 0 && (
          <div className="alert-strip alert-strip--success">
            <span className="alert-emoji">✓</span>
            <span>Budget is perfectly balanced!</span>
          </div>
        )}
      </div>

      {/* Categories Grid */}
      <div className="card">
        <div className="setup-grid">
          {/* Savings Categories */}
          <div className="setup-section">
            <div className="setup-section-header">
              <h3 className="setup-section-title">💾 Savings Categories</h3>
              <button
                className="primary"
                type="button"
                onClick={() => openModal("savings")}
              >
                ✎ Edit
              </button>
            </div>
            <table className="data-table setup-table">
              <tbody>
                {savingsList.length > 0 ? (
                  <>
                    {savingsList.map((c) => (
                      <tr key={c.id} className="setup-table-row">
                        <td className="setup-table-name">{c.name}</td>
                        <td className="setup-table-amount">
                          ₹ {c.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    <tr className="setup-table-total">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          ₹ {savingsTotal.toLocaleString("en-IN")}
                        </strong>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        color: "#94a3b8",
                      }}
                    >
                      No categories added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Expenses Categories */}
          <div className="setup-section">
            <div className="setup-section-header">
              <h3 className="setup-section-title">🛒 Expense Categories</h3>
              <button
                className="primary"
                type="button"
                onClick={() => openModal("expenses")}
              >
                ✎ Edit
              </button>
            </div>
            <table className="data-table setup-table">
              <tbody>
                {expensesList.length > 0 ? (
                  <>
                    {expensesList.map((c) => (
                      <tr key={c.id} className="setup-table-row">
                        <td className="setup-table-name">{c.name}</td>
                        <td className="setup-table-amount">
                          ₹ {c.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                    <tr className="setup-table-total">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>
                          ₹ {expensesTotal.toLocaleString("en-IN")}
                        </strong>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      style={{
                        textAlign: "center",
                        padding: "16px",
                        color: "#94a3b8",
                      }}
                    >
                      No categories added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Buffer Categories - Full Width */}
        <div className="setup-section" style={{ marginTop: 16 }}>
          <div className="setup-section-header">
            <h3 className="setup-section-title">🛡️ Buffer Categories</h3>
            <button
              className="primary"
              type="button"
              onClick={() => openModal("buffer")}
            >
              ✎ Edit
            </button>
          </div>
          <table className="data-table setup-table">
            <tbody>
              {bufferList.length > 0 ? (
                <>
                  {bufferList.map((c) => (
                    <tr key={c.id} className="setup-table-row">
                      <td className="setup-table-name">{c.name}</td>
                      <td className="setup-table-amount">
                        ₹ {Number(c.amount || 0).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  <tr className="setup-table-total">
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td>
                      <strong>₹ {bufferTotal.toLocaleString("en-IN")}</strong>
                    </td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "center",
                      padding: "16px",
                      color: "#94a3b8",
                    }}
                  >
                    No categories added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && (
        <CategoryModal
          title={
            modalType === "savings"
              ? "Manage Savings Categories"
              : modalType === "expenses"
              ? "Manage Expense Categories"
              : "Manage Buffer Categories"
          }
          categories={
            modalType === "savings"
              ? savingsList
              : modalType === "expenses"
              ? expensesList
              : bufferList
          }
          onSave={handleSaveModal}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
