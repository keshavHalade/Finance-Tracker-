import React from "react";
import "../Style/BottomNav.css";

const TABS = [
  { id: "setup", label: "Setup", icon: "⚙️" },
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "income", label: "Income", icon: "💰" },
  { id: "goals", label: "Goals", icon: "🎯" },
  { id: "savings", label: "Savings", icon: "🏦" },
  { id: "expenses", label: "Expenses", icon: "💳" },
  { id: "monthly", label: "Monthly", icon: "📅" },
  { id: "tx", label: "Txns", icon: "📝" },
  { id: "subs", label: "Subs", icon: "🔄" },
  { id: "advisor", label: "Advisor", icon: "🤖" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "backup", label: "Backup", icon: "💾" },
  { id: "about", label: "About", icon: "ℹ️" },
];

export default function BottomNav({ activeTab, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={
            "bottom-nav-item" + (activeTab === tab.id ? " active" : "")
          }
          onClick={() => onChange(tab.id)}
          title={tab.label}
        >
          <span className="nav-icon">{tab.icon}</span>
          <span className="nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
