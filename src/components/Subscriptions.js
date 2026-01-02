import React, { useState } from "react";
import MonthSelector from "./MonthSelector";

export default function Subscriptions({ app }) {
  const { state, setSubscriptions, setCurrentMonthKey } = {
    ...app,
    setSubscriptions: app.setSubscriptions,
    setCurrentMonthKey: app.setCurrentMonthKey,
  };

  const [form, setForm] = useState({
    name: "",
    amount: "",
    dueDay: "",
    categoryId: "",
    active: true,
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount || !form.dueDay) return;

    const newSub = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      amount: Number(form.amount) || 0,
      dueDay: Number(form.dueDay) || 1,
      categoryId: form.categoryId || "",
      active: form.active,
    };

    setSubscriptions([...(state.subscriptions || []), newSub]);
    setForm({
      name: "",
      amount: "",
      dueDay: "",
      categoryId: "",
      active: true,
    });
  };

  const toggleActive = (id) => {
    const updated = (state.subscriptions || []).map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    );
    setSubscriptions(updated);
  };

  const removeSub = (id) => {
    setSubscriptions((state.subscriptions || []).filter((s) => s.id !== id));
  };

  const today = new Date();
  const todayDay = today.getDate();

  const getAlertText = (sub) => {
    if (!sub.active) return "";
    const diff = sub.dueDay - todayDay;
    if (diff === 0) return "Due today";
    if (diff === 1) return "Due tomorrow";
    if (diff === 3) return "Due in 3 days";
    return "";
  };

  const getCategoryName = (id) => {
    const cat =
      (state.expenseCategories || []).find((c) => c.id === id) ||
      (state.savingsCategories || []).find((c) => c.id === id);
    return cat ? cat.name : "Unlinked";
  };

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
            🔄 Subscriptions
          </h2>
          <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
            Track recurring payments and subscriptions
          </p>
        </div>
        <div style={{ minWidth: "140px" }}>
          <MonthSelector
            state={state}
            setCurrentMonthKey={setCurrentMonthKey}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-title">Subscriptions & Recurring Payments</div>
        <div className="card-subtitle">
          Track Netflix, EMI, rent, phone bills, etc. Alerts show around due
          dates.
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Rent, Netflix, EMI"
            />
          </label>
          <label>
            Amount (₹)
            <input
              type="number"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </label>
          <label>
            Due day (1–31)
            <input
              type="number"
              inputMode="decimal"
              value={form.dueDay}
              onChange={(e) => handleChange("dueDay", e.target.value)}
            />
          </label>
          <label>
            Link to category (optional)
            <select
              value={form.categoryId}
              onChange={(e) => handleChange("categoryId", e.target.value)}
            >
              <option value="">None</option>
              <optgroup label="Expenses">
                {(state.expenseCategories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Savings">
                {(state.savingsCategories || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <button className="primary" type="submit">
            Add Subscription
          </button>
        </form>
      </div>

      {(state.subscriptions || []).map((s) => {
        const alert = getAlertText(s);
        return (
          <div key={s.id} className="card">
            <div className="card-title">
              {s.name}{" "}
              <span style={{ fontSize: 11, opacity: 0.8 }}>
                ({s.active ? "Active" : "Paused"})
              </span>
            </div>
            <p style={{ fontSize: 12 }}>
              Amount: ₹ {s.amount.toLocaleString("en-IN")} · Due day: {s.dueDay}
            </p>
            <p style={{ fontSize: 12 }}>
              Category: {getCategoryName(s.categoryId)}
            </p>
            {alert && (
              <p style={{ fontSize: 12, color: "#fde68a" }}>⚠ {alert}</p>
            )}
            <button className="primary" onClick={() => toggleActive(s.id)}>
              {s.active ? "Pause" : "Resume"}
            </button>{" "}
            <button className="danger" onClick={() => removeSub(s.id)}>
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}
