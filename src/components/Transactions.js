import React, { useState, useMemo } from "react";
import MonthSelector from "./MonthSelector";

export default function Transactions({ app }) {
  const { state, addTransaction, deleteTransaction, setCurrentMonthKey } = app;
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

  // Get current month key
  function getCurrentMonthKey() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    return `${d.getFullYear()}-${m}`;
  }

  const currentMonthKey = state.currentMonthKey || getCurrentMonthKey();
  const transactionsForMonth = (state.transactions || []).filter(
    (t) => t.monthKey === currentMonthKey
  );

  const allCategories = [
    ...(state.savingsCategories || []).map((c) => ({ ...c, type: "saving" })),
    ...(state.expenseCategories || []).map((c) => ({ ...c, type: "expense" })),
    ...(state.bufferCategories || []).map((c) => ({ ...c, type: "buffer" })),
  ];

  // Calculate transaction type distribution
  const transactionStats = useMemo(() => {
    const stats = { savings: 0, expenses: 0, buffer: 0 };
    transactionsForMonth.forEach((t) => {
      if (t.type === "saving" || t.type === "savings") stats.savings++;
      else if (t.type === "expense") stats.expenses++;
      else if (t.type === "buffer") stats.buffer++;
    });
    return stats;
  }, [transactionsForMonth]);

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

  const getTypeEmoji = (type) => {
    switch (type) {
      case "saving":
        return "💚";
      case "expense":
        return "💸";
      case "buffer":
        return "📦";
      default:
        return "📝";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "saving":
        return "Savings";
      case "expense":
        return "Expense";
      case "buffer":
        return "Buffer";
      default:
        return "Unknown";
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
    setEditingId(null);
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
          <h2 style={{ margin: 0, marginBottom: "4px" }}>📝 Transactions</h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Track all your financial movements
          </p>
        </div>
      </div>

      {/* Transaction Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#ecfdf5",
            padding: "12px",
            borderRadius: "8px",
            borderLeft: "4px solid #10b981",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "2px",
            }}
          >
            SAVINGS
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#065f46" }}
          >
            {transactionStats.savings}
          </div>
          <div style={{ fontSize: "9px", color: "#047857", marginTop: "2px" }}>
            transactions
          </div>
        </div>

        <div
          style={{
            background: "#fee2e2",
            padding: "12px",
            borderRadius: "8px",
            borderLeft: "4px solid #ef4444",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "2px",
            }}
          >
            EXPENSES
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#991b1b" }}
          >
            {transactionStats.expenses}
          </div>
          <div style={{ fontSize: "9px", color: "#7f1d1d", marginTop: "2px" }}>
            transactions
          </div>
        </div>

        <div
          style={{
            background: "#fef3c7",
            padding: "12px",
            borderRadius: "8px",
            borderLeft: "4px solid #f59e0b",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "2px",
            }}
          >
            BUFFER
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#92400e" }}
          >
            {transactionStats.buffer}
          </div>
          <div style={{ fontSize: "9px", color: "#b45309", marginTop: "2px" }}>
            transactions
          </div>
        </div>

        <div
          style={{
            background: "#f3f4f6",
            padding: "12px",
            borderRadius: "8px",
            borderLeft: "4px solid #6b7280",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "2px",
            }}
          >
            TOTAL
          </div>
          <div
            style={{ fontSize: "20px", fontWeight: "700", color: "#374151" }}
          >
            {transactionsForMonth.length}
          </div>
          <div style={{ fontSize: "9px", color: "#6b7280", marginTop: "2px" }}>
            all transactions
          </div>
        </div>
      </div>

      {/* Transactions Table or Empty State */}
      {transactionsForMonth.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#111827",
            }}
          >
            No transactions yet
          </div>
          <div
            style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}
          >
            Add your first savings, expense, or buffer transaction to get
            started.
          </div>
          <button
            className="primary"
            onClick={() => setShowModal(true)}
            style={{ padding: "12px 24px", fontSize: "14px" }}
          >
            ➕ Add Transaction
          </button>
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}
            >
              {transactionsForMonth.length} Transactions
            </div>
            <button
              className="primary"
              onClick={() => setShowModal(true)}
              style={{ padding: "8px 16px", fontSize: "13px" }}
            >
              ➕ Add
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f9fafb",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Date
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Category
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: "14px",
                      textAlign: "center",
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactionsForMonth.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      background: idx % 2 === 0 ? "#fff" : "#f9fafb",
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      {editingId === t.id ? (
                        <input
                          type="date"
                          value={editForm.date || ""}
                          onChange={(e) =>
                            handleEditChange("date", e.target.value)
                          }
                          style={{
                            padding: "6px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#374151", fontWeight: "500" }}>
                          {t.date}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      {editingId === t.id ? (
                        <input
                          value={editForm.description || ""}
                          onChange={(e) =>
                            handleEditChange("description", e.target.value)
                          }
                          style={{
                            padding: "6px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px",
                            width: "100%",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#1f2937" }}>
                          {t.description}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: getTypeColor(t.type),
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "600",
                        }}
                      >
                        {getTypeEmoji(t.type)} {getTypeLabel(t.type)}
                      </span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      {editingId === t.id ? (
                        <select
                          value={editForm.categoryId || ""}
                          onChange={(e) =>
                            handleEditChange("categoryId", e.target.value)
                          }
                          style={{
                            padding: "6px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px",
                          }}
                        >
                          <option value="">Select category</option>
                          {allCategories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span style={{ color: "#6b7280" }}>
                          {getCategoryName(t.categoryId)}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px", textAlign: "right" }}>
                      {editingId === t.id ? (
                        <input
                          type="number"
                          value={editForm.amount || ""}
                          onChange={(e) =>
                            handleEditChange("amount", e.target.value)
                          }
                          style={{
                            padding: "6px",
                            border: "1px solid #d1d5db",
                            borderRadius: "4px",
                            fontSize: "12px",
                            width: "80px",
                            textAlign: "right",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: getTypeColor(t.type),
                            fontWeight: "700",
                            fontSize: "13px",
                          }}
                        >
                          ₹ {t.amount.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {editingId === t.id ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={handleEditSubmit}
                            style={{
                              padding: "6px 12px",
                              background: "#10b981",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            ✓ Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            style={{
                              padding: "6px 12px",
                              background: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "12px",
                              fontWeight: "600",
                            }}
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => startEdit(t)}
                            title="Edit"
                            style={{
                              padding: "6px 10px",
                              background: "#f0f9ff",
                              border: "1px solid #0ea5e9",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteTransaction(t.id)}
                            title="Delete"
                            style={{
                              padding: "6px 10px",
                              background: "#fee2e2",
                              border: "1px solid #ef4444",
                              borderRadius: "4px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
              width: "90%",
              maxWidth: "480px",
              maxHeight: "90vh",
              overflow: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
                ➕ Add Transaction
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#6b7280",
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <option value="saving">💚 Saving</option>
                  <option value="expense">💸 Expense</option>
                  <option value="buffer">📦 Buffer</option>
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => handleChange("categoryId", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                >
                  <option value="">Select category</option>
                  {getFilteredCategories().map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  Amount (₹)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "6px",
                    color: "#374151",
                  }}
                >
                  Description
                </label>
                <input
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="e.g. Monthly SIP, Grocery shopping"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    fontSize: "13px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "10px 20px",
                    background: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#374151",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="primary"
                  style={{
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
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
