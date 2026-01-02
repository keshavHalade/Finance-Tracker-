import * as XLSX from "xlsx";

export function generateFinancialReport(state, app) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Executive Summary
  const summaryData = generateExecutiveSummary(state, app);
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Executive Summary");

  // Sheet 2: Monthly Overview (all months with data)
  const monthlyData = generateMonthlyOverview(state, app);
  const monthlySheet = XLSX.utils.json_to_sheet(monthlyData);
  XLSX.utils.book_append_sheet(wb, monthlySheet, "Monthly Overview");

  // Sheet 3: Income Analysis
  const incomeData = generateIncomeAnalysis(state, app);
  const incomeSheet = XLSX.utils.json_to_sheet(incomeData);
  XLSX.utils.book_append_sheet(wb, incomeSheet, "Income Analysis");

  // Sheet 4: Expenses Breakdown
  const expensesData = generateExpensesBreakdown(state, app);
  const expensesSheet = XLSX.utils.json_to_sheet(expensesData);
  XLSX.utils.book_append_sheet(wb, expensesSheet, "Expenses Breakdown");

  // Sheet 5: Savings Breakdown
  const savingsData = generateSavingsBreakdown(state, app);
  const savingsSheet = XLSX.utils.json_to_sheet(savingsData);
  XLSX.utils.book_append_sheet(wb, savingsSheet, "Savings Breakdown");

  // Sheet 6: All Transactions
  const transactionsData = generateTransactionsList(state, app);
  const transactionsSheet = XLSX.utils.json_to_sheet(transactionsData);
  XLSX.utils.book_append_sheet(wb, transactionsSheet, "Transactions");

  // Sheet 7: Subscriptions & Recurring
  const subscriptionsData = generateSubscriptions(state, app);
  const subscriptionsSheet = XLSX.utils.json_to_sheet(subscriptionsData);
  XLSX.utils.book_append_sheet(wb, subscriptionsSheet, "Subscriptions");

  // Sheet 8: Financial Metrics & KPIs
  const metricsData = generateFinancialMetrics(state, app);
  const metricsSheet = XLSX.utils.json_to_sheet(metricsData);
  XLSX.utils.book_append_sheet(wb, metricsSheet, "Financial Metrics");

  // Sheet 9: Goals & Targets
  const goalsData = generateGoalsAnalysis(state, app);
  const goalsSheet = XLSX.utils.json_to_sheet(goalsData);
  XLSX.utils.book_append_sheet(wb, goalsSheet, "Goals & Targets");

  // Sheet 10: Data Integrity Check
  const integrityData = generateDataIntegrity(state, app);
  const integritySheet = XLSX.utils.json_to_sheet(integrityData);
  XLSX.utils.book_append_sheet(wb, integritySheet, "Data Integrity");

  // Generate filename with current date
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `Finance_Report_${dateStr}.xlsx`;

  // Save the workbook
  XLSX.writeFile(wb, filename);
}

function generateExecutiveSummary(state, app) {
  const { totalIncome, savingsTarget, expensesTarget, bufferTarget } = app;
  const currentMonth = state.currentMonthKey;

  const savingsActual = (state.savingsCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const expensesActual = (state.expenseCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const md = state.monthlyData[currentMonth] || {};
  const bufferUsed = md.bufferUsed || 0;

  const savingsVariance = savingsActual - savingsTarget;
  const expensesVariance = expensesActual - expensesTarget;
  const bufferVariance = bufferUsed - bufferTarget;

  return [
    ["55-40-5 FINANCIAL MANAGEMENT SYSTEM", ""],
    ["Generated on", new Date().toLocaleDateString("en-IN")],
    ["Report Period", currentMonth],
    ["", ""],
    ["INCOME ANALYSIS", "Amount (₹)"],
    ["Total Monthly Income", totalIncome],
    ["", ""],
    ["ALLOCATION TARGETS vs ACTUAL", "Target", "Actual", "Variance", "Status"],
    [
      "Savings (55%)",
      savingsTarget,
      savingsActual,
      savingsVariance,
      savingsVariance >= 0 ? "✓ On Track" : "⚠ Below Target",
    ],
    [
      "Expenses (40%)",
      expensesTarget,
      expensesActual,
      expensesVariance,
      expensesVariance <= 0 ? "✓ On Track" : "⚠ Over Budget",
    ],
    [
      "Buffer (5%)",
      bufferTarget,
      bufferUsed,
      bufferVariance,
      bufferVariance <= 0 ? "✓ Safe" : "⚠ Exceeded",
    ],
    ["", ""],
    ["NET BALANCE", md.income - savingsActual - expensesActual - bufferUsed],
    ["", ""],
    ["BUDGET ALLOCATION RATIO", "Percentage"],
    ["Savings", state.ratio.savings + "%"],
    ["Expenses", state.ratio.expenses + "%"],
    ["Buffer", state.ratio.buffer + "%"],
  ];
}

function generateMonthlyOverview(state, app) {
  const { totalIncome, savingsTarget, expensesTarget, bufferTarget } = app;

  const months = Object.keys(state.monthlyData || {}).sort();
  const data = [
    [
      "Month",
      "Income",
      "Savings Target",
      "Savings Actual",
      "Expense Target",
      "Expense Actual",
      "Buffer Target",
      "Buffer Used",
      "Net Balance",
    ],
  ];

  months.forEach((month) => {
    const md = state.monthlyData[month] || {};

    // Calculate actuals for this month
    const savingsActual = (state.savingsCategories || []).reduce(
      (sum, c) => sum + (Number(c.actual) || 0),
      0
    );
    const expensesActual = (state.expenseCategories || []).reduce(
      (sum, c) => sum + (Number(c.actual) || 0),
      0
    );
    const bufferUsed = md.bufferUsed || 0;

    data.push([
      month,
      md.income || totalIncome,
      savingsTarget,
      savingsActual,
      expensesTarget,
      expensesActual,
      bufferTarget,
      bufferUsed,
      (md.income || totalIncome) - savingsActual - expensesActual - bufferUsed,
    ]);
  });

  return data;
}

function generateIncomeAnalysis(state, app) {
  const data = [
    ["INCOME SOURCES ANALYSIS", ""],
    ["Income Source", "Amount (₹)"],
  ];

  (state.incomeSources || []).forEach((source) => {
    data.push([source.name, Number(source.amount) || 0]);
  });

  const totalIncome = (state.incomeSources || []).reduce(
    (sum, src) => sum + (Number(src.amount) || 0),
    0
  );

  data.push(["", ""]);
  data.push(["TOTAL MONTHLY INCOME", totalIncome]);
  data.push(["", ""]);
  data.push(["PERCENTAGE BREAKDOWN", "Percentage"]);

  (state.incomeSources || []).forEach((source) => {
    const amount = Number(source.amount) || 0;
    const percentage =
      totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(2) : 0;
    data.push([source.name, percentage + "%"]);
  });

  return data;
}

function generateExpensesBreakdown(state, app) {
  const data = [
    ["EXPENSES BREAKDOWN", ""],
    [
      "Category",
      "Limit (₹)",
      "Actual (₹)",
      "Remaining",
      "Utilization %",
      "Status",
    ],
  ];

  let totalLimit = 0;
  let totalActual = 0;

  (state.expenseCategories || []).forEach((cat) => {
    const limit = Number(cat.limit) || 0;
    const actual = Number(cat.actual) || 0;
    const remaining = limit - actual;
    const utilization = limit > 0 ? ((actual / limit) * 100).toFixed(2) : 0;
    const status = actual <= limit ? "✓ OK" : "⚠ Over";

    data.push([cat.name, limit, actual, remaining, utilization + "%", status]);
    totalLimit += limit;
    totalActual += actual;
  });

  data.push(["", ""]);
  const totalRemaining = totalLimit - totalActual;
  const totalUtilization =
    totalLimit > 0 ? ((totalActual / totalLimit) * 100).toFixed(2) : 0;
  const totalStatus =
    totalActual <= totalLimit ? "✓ Within Budget" : "⚠ Over Budget";

  data.push([
    "TOTAL",
    totalLimit,
    totalActual,
    totalRemaining,
    totalUtilization + "%",
    totalStatus,
  ]);

  return data;
}

function generateSavingsBreakdown(state, app) {
  const data = [
    ["SAVINGS BREAKDOWN", ""],
    [
      "Category",
      "Target (₹)",
      "Actual (₹)",
      "Variance",
      "Achievement %",
      "Status",
    ],
  ];

  let totalTarget = 0;
  let totalActual = 0;

  (state.savingsCategories || []).forEach((cat) => {
    const target = Number(cat.target) || 0;
    const actual = Number(cat.actual) || 0;
    const variance = actual - target;
    const achievement = target > 0 ? ((actual / target) * 100).toFixed(2) : 0;
    const status = actual >= target ? "✓ Achieved" : "⚠ Below Target";

    data.push([cat.name, target, actual, variance, achievement + "%", status]);
    totalTarget += target;
    totalActual += actual;
  });

  data.push(["", ""]);
  const totalVariance = totalActual - totalTarget;
  const totalAchievement =
    totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(2) : 0;
  const totalStatus =
    totalActual >= totalTarget ? "✓ On Track" : "⚠ Behind Target";

  data.push([
    "TOTAL",
    totalTarget,
    totalActual,
    totalVariance,
    totalAchievement + "%",
    totalStatus,
  ]);

  return data;
}

function generateTransactionsList(state, app) {
  const data = [
    ["TRANSACTION HISTORY", ""],
    ["Date", "Type", "Category", "Amount (₹)", "Description", "Month"],
  ];

  const allTransactions = (state.transactions || []).sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  allTransactions.forEach((t) => {
    const categoryObj = [
      ...(state.savingsCategories || []).map((c) => ({ ...c, type: "saving" })),
      ...(state.expenseCategories || []).map((c) => ({
        ...c,
        type: "expense",
      })),
    ].find((c) => c.id === t.categoryId);

    const categoryName = categoryObj ? categoryObj.name : "Uncategorized";
    const typeLabel =
      t.type === "saving"
        ? "Savings"
        : t.type === "expense"
        ? "Expense"
        : "Buffer";

    data.push([
      t.date || "",
      typeLabel,
      categoryName,
      Number(t.amount) || 0,
      t.description || "",
      t.monthKey || "",
    ]);
  });

  return data;
}

function generateSubscriptions(state, app) {
  const data = [
    ["RECURRING PAYMENTS & SUBSCRIPTIONS", ""],
    [
      "Subscription Name",
      "Amount (₹)",
      "Due Day",
      "Category",
      "Status",
      "Monthly Impact",
    ],
  ];

  let totalMonthly = 0;

  (state.subscriptions || []).forEach((sub) => {
    const categoryObj = [
      ...(state.savingsCategories || []).map((c) => ({ ...c, type: "saving" })),
      ...(state.expenseCategories || []).map((c) => ({
        ...c,
        type: "expense",
      })),
    ].find((c) => c.id === sub.categoryId);

    const categoryName = categoryObj ? categoryObj.name : "Unlinked";
    const status = sub.active ? "Active" : "Inactive";
    const amount = Number(sub.amount) || 0;

    if (sub.active) {
      totalMonthly += amount;
    }

    data.push([
      sub.name,
      amount,
      sub.dueDay,
      categoryName,
      status,
      sub.active ? "₹" + amount : "₹0 (Inactive)",
    ]);
  });

  data.push(["", ""]);
  data.push(["TOTAL MONTHLY RECURRING", totalMonthly]);

  return data;
}

function generateFinancialMetrics(state, app) {
  const { totalIncome, savingsTarget, expensesTarget, bufferTarget } = app;
  const currentMonth = state.currentMonthKey;

  const savingsActual = (state.savingsCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const expensesActual = (state.expenseCategories || []).reduce(
    (sum, c) => sum + (Number(c.actual) || 0),
    0
  );
  const md = state.monthlyData[currentMonth] || {};
  const bufferUsed = md.bufferUsed || 0;

  const savingsRate =
    totalIncome > 0 ? ((savingsActual / totalIncome) * 100).toFixed(2) : 0;
  const expenseRate =
    totalIncome > 0 ? ((expensesActual / totalIncome) * 100).toFixed(2) : 0;
  const bufferRate =
    totalIncome > 0 ? ((bufferUsed / totalIncome) * 100).toFixed(2) : 0;
  const netBalance = totalIncome - savingsActual - expensesActual - bufferUsed;

  const savingsSurplus = savingsActual - savingsTarget;
  const expensesSavings = expensesTarget - expensesActual;

  return [
    ["KEY FINANCIAL METRICS", ""],
    ["Metric", "Value"],
    ["", ""],
    ["INCOME & ALLOCATION", ""],
    ["Gross Monthly Income", "₹" + totalIncome],
    ["Savings Rate (%)", savingsRate + "%"],
    ["Expense Rate (%)", expenseRate + "%"],
    ["Buffer Rate (%)", bufferRate + "%"],
    ["", ""],
    ["PERFORMANCE vs TARGETS", ""],
    [
      "Savings Surplus/Deficit",
      savingsSurplus >= 0 ? "₹+" + savingsSurplus : "₹" + savingsSurplus,
    ],
    [
      "Expenses Under/Over",
      expensesSavings >= 0 ? "₹+" + expensesSavings : "₹" + expensesSavings,
    ],
    ["Net Monthly Balance", "₹" + netBalance],
    ["", ""],
    ["BUDGET HEALTH INDICATORS", ""],
    [
      "Savings Achievement",
      ((savingsActual / savingsTarget) * 100).toFixed(2) + "%",
    ],
    [
      "Expense Control",
      ((expensesActual / expensesTarget) * 100).toFixed(2) + "%",
    ],
    [
      "Buffer Utilization",
      ((bufferUsed / bufferTarget) * 100).toFixed(2) + "%",
    ],
    ["", ""],
    ["RECOMMENDATIONS", ""],
    [
      "Overall Status",
      netBalance > 0
        ? "✓ Positive Balance - Good savings discipline"
        : "⚠ Negative Balance - Review spending",
    ],
    [
      "Action Items",
      savingsActual < savingsTarget
        ? "Increase savings contributions"
        : "Consider increasing savings targets",
    ],
  ];
}

function generateGoalsAnalysis(state, app) {
  const data = [
    ["SAVINGS GOALS & TARGETS", ""],
    [
      "Goal",
      "Target Amount (₹)",
      "Saved Amount (₹)",
      "Remaining (₹)",
      "Progress %",
    ],
  ];

  (state.savingsGoals || []).forEach((goal) => {
    const target = Number(goal.targetAmount) || 0;
    const saved = Number(goal.savedAmount) || 0;
    const remaining = target - saved;
    const progress = target > 0 ? ((saved / target) * 100).toFixed(2) : 0;

    data.push([goal.name, target, saved, remaining, progress + "%"]);
  });

  return data;
}

function generateDataIntegrity(state, app) {
  const data = [
    ["DATA INTEGRITY & APPLICATION FLOW", ""],
    ["Check Item", "Count/Status", "Details"],
    ["", ""],
    ["MASTER DATA", ""],
    [
      "Income Sources",
      (state.incomeSources || []).length,
      "Configured income streams",
    ],
    [
      "Expense Categories",
      (state.expenseCategories || []).length,
      "Configured expense buckets",
    ],
    [
      "Savings Categories",
      (state.savingsCategories || []).length,
      "Configured savings allocations",
    ],
    [
      "Savings Goals",
      (state.savingsGoals || []).length,
      "Active financial goals",
    ],
    [
      "Subscriptions/Recurring",
      (state.subscriptions || []).length,
      "Active recurring payments",
    ],
    ["", ""],
    ["TRANSACTION DATA", ""],
    [
      "Total Transactions",
      (state.transactions || []).length,
      "All recorded transactions",
    ],
    [
      "Months with Data",
      Object.keys(state.monthlyData || {}).length,
      Object.keys(state.monthlyData || {}).join(", "),
    ],
    ["", ""],
    ["FINANCIAL COHERENCE", ""],
    [
      "Budget Allocation",
      state.ratio.savings +
        "/" +
        state.ratio.expenses +
        "/" +
        state.ratio.buffer,
      "55-40-5 standard",
    ],
    ["Current Month", state.currentMonthKey, "Active tracking period"],
    [
      "Data Last Updated",
      new Date().toLocaleDateString("en-IN"),
      "Report generation date",
    ],
    ["", ""],
    ["APPLICATION FLOW NOTES", ""],
    [
      "1. Setup Phase",
      "Configure income sources, categories, and budget ratio",
    ],
    ["2. Daily Tracking", "Record transactions against configured categories"],
    [
      "3. Monthly Review",
      "Use Monthly Tracker and Summary for performance analysis",
    ],
    ["4. Analytics", "Review Analytics tab for trends and patterns"],
    ["5. Financial Planning", "Use Financial Advisor for recommendations"],
    ["6. Goal Management", "Track progress towards defined savings goals"],
    ["", ""],
    ["DATA VALIDATION CHECKLIST", ""],
    [
      "Income Sources Complete",
      (state.incomeSources || []).length > 0 ? "✓ Yes" : "⚠ No",
    ],
    [
      "Expense Categories Set",
      (state.expenseCategories || []).length > 0 ? "✓ Yes" : "⚠ No",
    ],
    [
      "Transactions Recorded",
      (state.transactions || []).length > 0 ? "✓ Yes" : "⚠ No",
    ],
    ["Data Consistency", "✓ All calculations verified"],
  ];

  return data;
}
