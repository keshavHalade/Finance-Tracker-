import React from 'react';

export default function Backup({ app }) {
  const { state } = app;

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `55-40-5-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        localStorage.setItem('finance_55_40_5_app_v1', JSON.stringify(imported));
        alert('Backup imported. Please refresh the page.');
      } catch (err) {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
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
      <div className="card">
        <div className="card-title">Export Backup (Save to File)</div>
        <p className="card-subtitle">
          Download your complete data as a JSON file and save it somewhere safe
          (Google Drive, local folder, etc.).
        </p>
        <button className="primary" onClick={handleExport}>
          ⬇️ Download Backup File (JSON)
        </button>
      </div>

      <div className="card">
        <div className="card-title">Import Backup (Restore from File)</div>
        <p className="card-subtitle">
          Choose a previously saved backup JSON file to restore your data on
          this device.
        </p>
        <label className="upload-label">
          📤 Upload Backup File
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </label>
      </div>

      {/* Mobile management tips */}
      <div className="card card-strip card-strip--warning">
        <div className="card-title">📱 Managing Data on Mobile</div>
        <ol className="tips-list">
          <li>Export backup regularly (weekly/monthly).</li>
          <li>Save backup file to a safe place (Google Drive, OneDrive).</li>
          <li>Do not “clear browser data” without exporting first.</li>
          <li>
            To move to a new phone: Export → Save to cloud → Import on new
            device.
          </li>
        </ol>
      </div>
    </div>
  );
}
