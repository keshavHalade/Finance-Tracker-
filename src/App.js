import React, { useState } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import { useAppState } from "./state/useAppState";
import Dashboard from "./components/Dashboard";
import IncomeSetup from "./components/IncomeSetup";
import SetupTab from "./components/SetupTab";
import GoalSetup from "./components/GoalSetup";
import SavingsDashboard from "./components/SavingsDashboard";
import ExpensesDashboard from "./components/ExpensesDashboard";
import MonthlyTracker from "./components/MonthlyTracker";
import TransactionsNew from "./components/TransactionsNew";
import Subscriptions from "./components/Subscriptions";
import Analytics from "./components/Analytics";
import Backup from "./components/Backup";
import MonthlySummary from "./components/MonthlySummary";
import FinancialAdvisor from "./components/FinancialAdvisor";

// Import all CSS files
import "./Style/base.css";
import "./Style/Header.css";
import "./Style/Card.css";
import "./Style/Form.css";
import "./Style/Button.css";
import "./Style/Table.css";
import "./Style/Modal.css";
import "./Style/Dashboard.css";
import "./Style/Summary.css";
import "./Style/Progress.css";
import "./Style/Badge.css";
import "./Style/Alert.css";
import "./Style/CardStrip.css";
import "./Style/Setup.css";
import "./Style/SetupTab.css";
import "./Style/EmptyState.css";
import "./Style/Tips.css";
import "./Style/BottomNav.css";
import "./Style/dashboardStyle.css";
import "./Style/DashboardEnhanced.css";
import "./Style/DashboardAnalytics.css";
import "./Style/IncomeSetup.css";
import "./Style/IncomeSetupNew.css";
import "./Style/GoalSetup.css";

function App() {
  const [tab, setTab] = useState("setup");
  const app = useAppState();

  const renderTab = () => {
    switch (tab) {
      case "setup":
        return <SetupTab app={app} />;
      case "income":
        return <IncomeSetup app={app} />;
      case "goals":
        return <GoalSetup app={app} />;
      case "savings":
        return <SavingsDashboard app={app} />;
      case "expenses":
        return <ExpensesDashboard app={app} />;
      case "monthly":
        return <MonthlyTracker app={app} />;
      case "tx":
        return <TransactionsNew app={app} />;
      case "subs":
        return <Subscriptions app={app} />;
      case "advisor":
        return <FinancialAdvisor app={app} />;
      case "analytics":
        return <Analytics app={app} />;
      case "backup":
        return <Backup app={app} />;
      case "summary":
        return <MonthlySummary app={app} />;
      case "setup":
        return <IncomeSetup app={app} />;
      case "dashboard":
        return <Dashboard app={app} />;
      default:
    }
  };

  return (
    <div className="app-root">
      <Header />
      <main className="app-main">{renderTab()}</main>
      <BottomNav activeTab={tab} onChange={setTab} />
    </div>
  );
}

export default App;
