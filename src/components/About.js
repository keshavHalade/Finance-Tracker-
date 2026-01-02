import React from "react";

export default function About() {
  return (
    <div style={{ padding: "16px", background: "#f9fafb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2
          style={{
            margin: 0,
            marginBottom: "8px",
            color: "#1f2937",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          💰 About Finance Tracker
        </h2>
        <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
          Version 1.0 | January 2026
        </p>
      </div>

      {/* Main Content */}
      <div style={{ display: "grid", gap: "20px" }}>
        {/* What is this app */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #10b981",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            🎯 What is Finance Tracker?
          </h3>
          <p
            style={{ margin: "0 0 8px 0", color: "#374151", fontSize: "14px" }}
          >
            Finance Tracker is a smart personal financial management application
            built on the proven <strong>55-40-5 budgeting rule</strong>. It
            helps you allocate your monthly income intelligently:
          </p>
          <ul
            style={{
              margin: "12px 0 0 0",
              paddingLeft: "20px",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            <li>55% for Savings (long-term financial goals)</li>
            <li>40% for Expenses (living costs and necessities)</li>
            <li>5% for Buffer (emergencies and unexpected costs)</li>
          </ul>
        </div>

        {/* Key Features */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #3b82f6",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            ✨ Key Features
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#f0f9ff",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #0ea5e9",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                💼 Multi-Income Support
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Track multiple income sources and their contributions
              </div>
            </div>

            <div
              style={{
                background: "#fef3c7",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #f59e0b",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                📊 Real-Time Analytics
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Visual dashboards showing targets vs actual spending
              </div>
            </div>

            <div
              style={{
                background: "#ecfdf5",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #10b981",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                💾 Auto-Save
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                All data saved locally to your browser automatically
              </div>
            </div>

            <div
              style={{
                background: "#fee2e2",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #ef4444",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                🎯 Goal Tracking
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Set and monitor savings goals with progress tracking
              </div>
            </div>

            <div
              style={{
                background: "#f3e8ff",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #a855f7",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                📋 Subscription Management
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Track recurring payments and identify cost-saving opportunities
              </div>
            </div>

            <div
              style={{
                background: "#e0e7ff",
                padding: "12px",
                borderRadius: "6px",
                borderLeft: "3px solid #6366f1",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "4px",
                }}
              >
                📥 Excel Export
              </div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                Export comprehensive reports with 10+ detailed sheets
              </div>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #8b5cf6",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            🚀 How to Get Started
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  background: "#667eea",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                1
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Setup Tab: Configure Your Budget
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Define your expense categories, savings allocations, and
                  buffer amounts. You can adjust the 55-40-5 ratio to match your
                  needs.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  background: "#667eea",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                2
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Income Tab: Add Your Income Sources
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Enter all your monthly income sources (salary, freelance,
                  investments, etc.). Track multiple income streams to see the
                  total picture.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  background: "#667eea",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                3
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Dashboard: View Your Budget Overview
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  See target vs actual allocation at a glance. Visual donut
                  charts make it easy to understand your spending distribution.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  background: "#667eea",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                4
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Transactions Tab: Record All Spending
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Add daily transactions for expenses, savings, and buffer
                  usage. Edit or delete entries as needed. All changes save
                  automatically.
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  background: "#667eea",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                5
              </div>
              <div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#1f2937",
                    marginBottom: "4px",
                  }}
                >
                  Analytics & Reports: Analyze Your Spending
                </div>
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Review detailed analytics, trends, and insights. Export
                  comprehensive Excel reports for deeper analysis.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* App Tabs Overview */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #06b6d4",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            📱 App Sections Overview
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                ⚙️ Setup
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Configure expense/savings/buffer categories and budget ratio
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                💰 Income
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Add and manage all your monthly income sources
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                📊 Dashboard
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                View 55-40-5 budget allocation with visual charts
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                💾 Savings
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Track savings by category against targets
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                💸 Expenses
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Monitor expense categories and spending limits
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                📝 Transactions
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Record, edit, and manage all financial transactions
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                🔄 Subscriptions
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Track recurring payments and monthly commitments
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                📊 Analytics
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Detailed financial insights and spending patterns
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                🤖 Advisor
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                AI-powered financial recommendations and guidance
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                📅 Tracker
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Year-to-date monthly performance overview
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                📋 Summary
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Monthly summary and balance snapshot
              </div>
            </div>

            <div
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                🎯 Goals
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                Set and monitor long-term financial goals
              </div>
            </div>
          </div>
        </div>

        {/* Data Privacy & Security */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #ec4899",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            🔒 Privacy & Security
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <strong>100% Offline:</strong> All data stored locally in your
              browser
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>No Server Transmission:</strong> Your financial data never
              leaves your device
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>No Tracking:</strong> No analytics, no user tracking,
              completely private
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Browser Storage:</strong> Uses browser's localStorage for
              persistence
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Data Backup:</strong> Manually export data using the Excel
              export feature
            </li>
            <li>
              <strong>Clear Cache:</strong> Clearing browser cache will reset
              all data
            </li>
          </ul>
        </div>

        {/* Tips & Best Practices */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #f59e0b",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            💡 Tips & Best Practices
          </h3>
          <ul
            style={{
              margin: 0,
              paddingLeft: "20px",
              color: "#374151",
              fontSize: "14px",
            }}
          >
            <li style={{ marginBottom: "8px" }}>
              <strong>Set Up Complete:</strong> Fully configure categories
              before adding transactions
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Monthly Review:</strong> Check Dashboard every month to
              track progress
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Category Discipline:</strong> Assign every transaction to
              appropriate category
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Regular Updates:</strong> Add transactions as they happen,
              not in bulk later
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Monitor Subscriptions:</strong> Review recurring payments
              quarterly
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Export Reports:</strong> Export monthly for backup and
              deeper analysis
            </li>
            <li style={{ marginBottom: "8px" }}>
              <strong>Goal Setting:</strong> Define specific, measurable
              financial goals
            </li>
            <li>
              <strong>Adjust Ratios:</strong> Fine-tune the 55-40-5 ratio based
              on your lifestyle
            </li>
          </ul>
        </div>

        {/* Technology Stack */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #14b8a6",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            🛠️ Technology Stack
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                Frontend
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                <li>React 18.2.0</li>
                <li>Modern JavaScript (ES6+)</li>
                <li>CSS3 with Flexbox & Grid</li>
                <li>No external UI frameworks</li>
              </ul>
            </div>
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "6px",
                }}
              >
                Data & Build
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                <li>localStorage API</li>
                <li>Webpack 5</li>
                <li>Babel for transpilation</li>
                <li>XLSX for Excel export</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #06b6d4",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px 0",
              color: "#1f2937",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            ❓ Frequently Asked Questions
          </h3>
          <div style={{ display: "grid", gap: "12px" }}>
            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                Is my data secure?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Yes! All data is stored locally in your browser using
                localStorage. No data is sent to any server. Your financial
                information stays completely private on your device.
              </p>
            </details>

            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                Can I access this on multiple devices?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Currently, data is stored per device. You can export data from
                one device (Excel) and manually manage across devices. Syncing
                features may be added in future versions.
              </p>
            </details>

            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                What if I clear my browser cache?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Clearing browser cache will delete all stored data. Regular
                exports to Excel are recommended as backups.
              </p>
            </details>

            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                Can I change the 55-40-5 ratio?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Yes! Go to the Setup tab and adjust the allocation percentages.
                You can create a custom ratio that works better for your
                lifestyle (e.g., 60-30-10).
              </p>
            </details>

            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                How do I export my data?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Click the "📥 Export Report" button in the header (available on
                all pages). This generates a comprehensive Excel file with 10+
                sheets containing all your financial data and analysis.
              </p>
            </details>

            <details
              style={{
                background: "#f9fafb",
                padding: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <summary style={{ fontWeight: "600", color: "#1f2937" }}>
                What's the 55-40-5 rule?
              </summary>
              <p
                style={{
                  margin: "8px 0 0 0",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                It's a budgeting framework: 55% of income goes to savings/goals,
                40% to necessary expenses, 5% to buffer/emergency. This promotes
                financial growth while maintaining security.
              </p>
            </details>
          </div>
        </div>

        {/* Contact & Support */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px",
            padding: "24px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            🚀 Ready to Take Control of Your Finances?
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            Start using Finance Tracker today. Set up your budget, track
            transactions, and achieve your financial goals with the proven
            55-40-5 methodology.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#6b7280",
            fontSize: "12px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p style={{ margin: 0, marginBottom: "8px" }}>
            Finance Tracker v1.0 • Built with React 18 • 100% Open & Offline
          </p>
          <p style={{ margin: 0 }}>
            Your financial data is yours alone. No tracking. No cloud. No
            compromises.
          </p>
        </div>
      </div>
    </div>
  );
}
