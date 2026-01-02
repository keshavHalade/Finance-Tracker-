import React, { useState } from "react";
import MonthSelector from "./MonthSelector";

export default function Transactions({ app }) {
  const {
    state,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setCurrentMonthKey,
  } = app;
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    type: "expense",
    categoryId: "",
    date: "",
    amount: "",
    description: "",
  });

  const currentMonthKey = state.currentMonthKey;
  const transactionsForMonth = (state.transactions || []).filter(
    (t) => t.monthKey === currentMonthKey
  );

  const allCategories = [
    ...(state.savingsCategories || []).map((c) => ({ ...c, type: "saving" })),
    ...(state.expenseCategories || []).map((c) => ({ ...c, type: "expense" })),
    ...(state.bufferCategories || []).map((c) => ({ ...c, type: "buffer" })),
  ];

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const handleEditChange = (key, value) =>
    setEditForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.categoryId) return;

    const amount = Number(form.amount) || 0;
    const cat = allCategories.find((c) => c.id === form.categoryId);

    addTransaction({
      date: form.date || new Date().toISOString().slice(0, 10),
      description: form.description.trim() || cat?.name || "Transaction",
      amount,
      categoryId: form.categoryId,
      type: form.type,
      monthKey: currentMonthKey,
    });

    setForm({
      type: "expense",
      categoryId: "",
      date: "",
      amount: "",
      description: "",
    });
    setShowModal(false);
  };

  const getCategoryName = (id) =>
    allCategories.find((c) => c.id === id)?.name || "Unknown";
  const getTypeColor = (type) => {
    switch (type) {
      case "saving":
        return "#10b981";
      case "expense":
        return "#ef4444";
      case "buffer":
        return "#f59e0b";
      default:
        return "#6b7280";
    }
  };

  const getFilteredCategories = () =>
    allCategories.filter((c) => c.type === form.type);

  const startEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      description: transaction.description,
      amount: transaction.amount.toString(),
      categoryId: transaction.categoryId || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditSubmit = () => {
    if (!editForm.amount || !editForm.categoryId) {
      alert("Please fill in amount and category");
      return;
    }

    // Find the original transaction to preserve type and monthKey
    const originalTransaction = (state.transactions || []).find(
      (t) => t.id === editingId
    );

    if (!originalTransaction) {
      alert("Transaction not found");
      return;
    }

    const updates = {
      date: editForm.date || "",
      description: (editForm.description || "").trim(),
      amount: parseFloat(editForm.amount) || 0,
      categoryId: editForm.categoryId || "",
      type: originalTransaction.type, // Preserve original type
      monthKey: originalTransaction.monthKey, // Preserve original monthKey
      id: originalTransaction.id, // Preserve ID
    };

    updateTransaction(editingId, updates);
    setEditingId(null);
    setEditForm({});
  };

  return (
    <div style={{ padding: "16px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Month Selector */}
      <MonthSelector state={state} setCurrentMonthKey={setCurrentMonthKey} />

      {transactionsForMonth.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            No transactions yet
          </div>
          <div
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}
          >
            Add your first savings, expense, or buffer transaction.
          </div>
          <button
            className="primary"
            onClick={() => setShowModal(true)}
            style={{ padding: "12px 24px" }}
          >
            ➕ Add Transaction
          </button>
        </div>
      ) : (
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            <span>Transactions ({currentMonthKey})</span>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {transactionsForMonth.length} transactions
            </span>
            <button className="primary" onClick={() => setShowModal(true)}>
              ➕ Add
            </button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Date</th>
                  <th style={{ width: "35%" }}>Description</th>
                  <th style={{ width: "15%", textAlign: "right" }}>Amount</th>
                  <th style={{ width: "20%" }}>Category</th>
                  <th style={{ width: "15%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactionsForMonth.map((t) => (
                  <tr key={t.id}>
                    <td>
                      {editingId === t.id ? (
                        <input
                          type="date"
                          value={editForm.date || ""}
                          onChange={(e) =>
                            handleEditChange("date", e.target.value)
                          }
                          className="cell-input"
                        />
                      ) : (
                        t.date
                      )}
                    </td>
                    <td>
                      {editingId === t.id ? (
                        <input
                          value={editForm.description || ""}
                          onChange={(e) =>
                            handleEditChange("description", e.target.value)
                          }
                          className="cell-input"
                        />
                      ) : (
                        t.description
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {editingId === t.id ? (
                        <input
                          type="number"
                          value={editForm.amount || ""}
                          onChange={(e) =>
                            handleEditChange("amount", e.target.value)
                          }
                          className="cell-input"
                          style={{ textAlign: "right" }}
                        />
                      ) : (
                        <span
                          style={{
                            color: getTypeColor(t.type),
                            fontWeight: "600",
                            fontSize: "14px",
                          }}
                        >
                          ₹ {t.amount.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td>
                      {editingId === t.id ? (
                        <select
                          value={editForm.categoryId || ""}
                          onChange={(e) =>
                            handleEditChange("categoryId", e.target.value)
                          }
                          className="cell-input"
                        >
                          <option value="">Select category</option>
                          {allCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        getCategoryName(t.categoryId)
                      )}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {editingId === t.id ? (
                        <>
                          <button
                            className="btn-edit-small"
                            onClick={handleEditSubmit}
                            style={{
                              marginRight: "6px",
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          >
                            ✓ Save
                          </button>
                          <button
                            className="btn-cancel-small"
                            onClick={cancelEdit}
                            style={{ padding: "4px 8px", fontSize: "12px" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => startEdit(t)}
                            title="Edit"
                            style={{ marginRight: "6px", padding: "4px 8px" }}
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteTransaction(t.id)}
                            title="Delete"
                            style={{ padding: "4px 8px" }}
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card transaction-modal">
            <div className="modal-title">
              ➕ Add Transaction
              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <label>
                Type
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="saving">Saving</option>
                  <option value="expense">Expense</option>
                  <option value="buffer">Buffer</option>
                </select>
              </label>
              <label>
                Category
                <select
                  value={form.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                >
                  <option value="">Select category</option>
                  {getFilteredCategories().map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </label>
              <label>
                Amount (₹)
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0"
                />
              </label>
              <label>
                Description
                <input
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="e.g. Monthly SIP, Grocery shopping"
                />
              </label>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
