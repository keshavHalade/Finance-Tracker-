import React, { useState, useMemo } from "react";

export default function Backup({ app }) {
  const { state } = app;
  const [backupHistory, setBackupHistory] = useState(() => {
    try {
      const history = localStorage.getItem("backup_history_55_40_5");
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  // Calculate data stats
  const dataStats = useMemo(() => {
    const jsonStr = JSON.stringify(state);
    const sizeInBytes = new Blob([jsonStr]).size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const transactions = (state.transactions || []).length;
    const categories =
      (state.savingsCategories || []).length +
      (state.expenseCategories || []).length;
    const goals = (state.savingsGoals || []).length;
    const subscriptions = (state.subscriptions || []).length;
    return {
      sizeInBytes,
      sizeInKB,
      transactions,
      categories,
      goals,
      subscriptions,
    };
  }, [state]);

  // Get last backup date
  const lastBackupDate = useMemo(() => {
    if (backupHistory.length === 0) return null;
    return backupHistory[backupHistory.length - 1].date;
  }, [backupHistory]);

  const handleExport = () => {
    const timestamp = new Date().toISOString();
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `55-40-5-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Record backup in history
    const newHistory = [
      ...backupHistory,
      { date: timestamp, size: dataStats.sizeInKB, type: "export" },
    ];
    setBackupHistory(newHistory);
    localStorage.setItem("backup_history_55_40_5", JSON.stringify(newHistory));
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        setPreviewData(imported);
        setShowPreview(true);
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const confirmImport = () => {
    if (!previewData) return;
    localStorage.setItem("finance_55_40_5_app_v1", JSON.stringify(previewData));
    const newHistory = [
      ...backupHistory,
      {
        date: new Date().toISOString(),
        size: (JSON.stringify(previewData).length / 1024).toFixed(2),
        type: "import",
      },
    ];
    setBackupHistory(newHistory);
    localStorage.setItem("backup_history_55_40_5", JSON.stringify(newHistory));
    setShowPreview(false);
    setPreviewData(null);
    alert(
      "✅ Backup imported successfully! Please refresh the page to see changes."
    );
  };

  const cancelImport = () => {
    setShowPreview(false);
    setPreviewData(null);
  };

  const handleClearAllData = () => {
    const confirmed = window.confirm(
      "⚠️ WARNING: This will DELETE ALL your financial data permanently!\n\n" +
        "Make sure you have exported a backup first.\n\n" +
        "Click OK only if you are absolutely sure."
    );
    if (confirmed) {
      const confirmed2 = window.confirm(
        "Last chance! This cannot be undone.\n\nClick OK to permanently delete all data."
      );
      if (confirmed2) {
        localStorage.removeItem("finance_55_40_5_app_v1");
        localStorage.removeItem("backup_history_55_40_5");
        alert("✅ All data has been cleared. Please refresh the page.");
      }
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={{ padding: "16px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Where data is stored */}
      <div className="card card-strip card-strip--info">
        <div className="card-title">💾 Data Backup & Storage</div>
        <p className="card-strip-text">
          All your financial data is stored <strong>locally</strong> in your
          browser (localStorage). No server, no cloud, works fully offline.
        </p>
        <ul className="tips-list">
          <li>✅ 100% private on your device.</li>
          <li>🌐 No internet required.</li>
          <li>📍 Device-specific: each browser has its own data.</li>
        </ul>
      </div>

      {/* Security & privacy strip */}
      <div className="card card-strip card-strip--neutral">
        <div className="card-title">🔐 Security & Privacy</div>
        <p className="card-strip-text">
          Data key: <code>finance_55_40_5_app_v1</code> in localStorage.
          Clearing browser data will remove it, so keep backups regularly.
        </p>
      </div>

      {/* Export / Import */}
      {/* Data Stats Overview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            📦 DATA SIZE
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
          >
            {dataStats.sizeInKB} KB
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            📝 TRANSACTIONS
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
          >
            {dataStats.transactions}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            📂 CATEGORIES
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
          >
            {dataStats.categories}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #ef4444",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              fontWeight: "600",
              marginBottom: "4px",
            }}
          >
            🎯 GOALS
          </div>
          <div
            style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
          >
            {dataStats.goals}
          </div>
        </div>
      </div>

      {/* Last Backup Status */}
      {lastBackupDate && (
        <div className="card card-strip card-strip--info">
          <div className="card-title">✅ Last Backup Status</div>
          <p className="card-strip-text">
            Your last backup was on{" "}
            <strong>{formatDate(lastBackupDate)}</strong>
          </p>
          <p
            style={{ fontSize: "12px", color: "#6b7280", margin: "8px 0 0 0" }}
          >
            Regular backups protect your data. Export at least once per week.
          </p>
        </div>
      )}

      {/* Where data is stored */}
      <div className="card">
        <div className="card-title">⬇️ Export Backup (Save to File)</div>
        <p className="card-subtitle">
          Download your complete data as a JSON file and save it somewhere safe
          (Google Drive, local folder, cloud storage, etc.). Keep multiple
          copies.
        </p>
        <button
          className="primary"
          onClick={handleExport}
          style={{
            padding: "12px 24px",
            fontSize: "14px",
            fontWeight: "600",
            width: "100%",
          }}
        >
          📥 Download Backup ({dataStats.sizeInKB} KB)
        </button>
      </div>

      <div className="card">
        <div className="card-title">⬆️ Import Backup (Restore from File)</div>
        <p className="card-subtitle">
          Choose a previously saved backup JSON file to restore your data on
          this device. You'll see a preview before importing.
        </p>
        <label
          className="upload-label"
          style={{
            display: "block",
            padding: "12px 24px",
            background: "#3b82f6",
            color: "#fff",
            borderRadius: "6px",
            cursor: "pointer",
            textAlign: "center",
            fontWeight: "600",
            transition: "background 0.2s",
          }}
        >
          📤 Choose Backup File
          <input
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={handleImport}
          />
        </label>
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <h2 style={{ margin: "0 0 16px 0", color: "#1f2937" }}>
              📋 Backup Preview
            </h2>
            <p style={{ color: "#6b7280", marginBottom: "16px" }}>
              This backup contains:
            </p>
            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              <p style={{ margin: "6px 0" }}>
                📝 <strong>{(previewData.transactions || []).length}</strong>{" "}
                transactions
              </p>
              <p style={{ margin: "6px 0" }}>
                📂{" "}
                <strong>
                  {(previewData.savingsCategories || []).length +
                    (previewData.expenseCategories || []).length}
                </strong>{" "}
                categories
              </p>
              <p style={{ margin: "6px 0" }}>
                🎯 <strong>{(previewData.savingsGoals || []).length}</strong>{" "}
                goals
              </p>
              <p style={{ margin: "6px 0" }}>
                🔄 <strong>{(previewData.subscriptions || []).length}</strong>{" "}
                subscriptions
              </p>
              <p style={{ margin: "6px 0" }}>
                💰 <strong>{(previewData.incomeSources || []).length}</strong>{" "}
                income sources
              </p>
            </div>
            <div
              style={{
                background: "#fef3c7",
                padding: "12px",
                borderRadius: "6px",
                marginBottom: "16px",
                borderLeft: "4px solid #f59e0b",
              }}
            >
              <strong style={{ color: "#92400e" }}>⚠️ Warning:</strong>{" "}
              Importing will replace your current data.
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={confirmImport}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#10b981",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ✅ Import This Backup
              </button>
              <button
                onClick={cancelImport}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Backup History */}
      {backupHistory.length > 0 && (
        <div className="card">
          <div className="card-title">📊 Backup History</div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              maxHeight: "200px",
              overflowY: "auto",
            }}
          >
            {backupHistory
              .slice()
              .reverse()
              .map((entry, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 0",
                    borderBottom: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {entry.type === "export" ? "⬇️ Exported" : "⬆️ Imported"} -{" "}
                    {formatDate(entry.date)}
                  </span>
                  <span style={{ color: "#9ca3af" }}>{entry.size} KB</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Mobile management tips */}
      <div className="card card-strip card-strip--warning">
        <div className="card-title">📱 Managing Data on Mobile</div>
        <ol className="tips-list">
          <li>Export backup regularly (at least weekly).</li>
          <li>Save backup file to cloud (Google Drive, OneDrive, Dropbox).</li>
          <li>
            <strong>Never</strong> clear browser data without exporting first.
          </li>
          <li>
            To move to a new phone: Export → Save to cloud → Import on new
            device.
          </li>
          <li>Keep at least 2-3 recent backups in different locations.</li>
        </ol>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          background: "#fee2e2",
          border: "2px solid #ef4444",
          borderRadius: "8px",
          padding: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            color: "#7f1d1d",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "8px",
          }}
        >
          ⚠️ Danger Zone
        </div>
        <p
          style={{
            color: "#991b1b",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          Clear all your financial data permanently. This action{" "}
          <strong>cannot be undone</strong>. Make sure you have a backup before
          proceeding.
        </p>
        <button
          onClick={handleClearAllData}
          style={{
            padding: "12px 24px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🗑️ Delete All Data
        </button>
      </div>
    </div>
  );
}
