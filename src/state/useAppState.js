// import { useEffect, useState } from "react";

// const STORAGE_KEY = "finance_55_40_5_app_v1";

// const defaultState = {
//   incomeSources: [], // {id, name, amount}
//   savingsCategories: [], // {id, name, target, actual}
//   expenseCategories: [], // {id, name, limit, actual}
//   ratio: { savings: 55, expenses: 40, buffer: 5 },
//   bufferTarget: 0,
//   monthlyData: {}, // { '2025-01': { income, savingsActual, expensesActual, bufferUsed, netBalance } }
//   transactions: [], // {id, date, description, amount, categoryId, type, monthKey}
//   subscriptions: [], // {id, name, amount, dueDay, categoryId, active}
//   savingsGoals: [], // {id, name, targetAmount, savedAmount}
//   insights: [],
//   currentMonthKey: "", // 'YYYY-MM'
// };

// function getCurrentMonthKey() {
//   const d = new Date();
//   const m = String(d.getMonth() + 1).padStart(2, "0");
//   return `${d.getFullYear()}-${m}`;
// }

// export default function useAppState() {
//   const [state, setState] = useState(() => {
//     try {
//       const raw = localStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         return {
//           ...defaultState,
//           ...parsed,
//           currentMonthKey: parsed.currentMonthKey || getCurrentMonthKey(),
//         };
//       }
//     } catch (e) {
//       console.error("Failed to load state", e);
//     }
//     return { ...defaultState, currentMonthKey: getCurrentMonthKey() };
//   });

//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//     } catch (e) {
//       console.error("Failed to save state", e);
//     }
//   }, [state]);

//   const totalIncome = state.incomeSources.reduce(
//     (sum, src) => sum + (Number(src.amount) || 0),
//     0
//   );

//   const savingsTarget = Math.round(
//     (totalIncome * (state.ratio.savings || 0)) / 100
//   );
//   const expensesTarget = Math.round(
//     (totalIncome * (state.ratio.expenses || 0)) / 100
//   );
//   const bufferTarget = Math.round(
//     (totalIncome * (state.ratio.buffer || 0)) / 100
//   );

//   const setIncomeSources = (incomeSources) => {
//     setState((prev) => ({
//       ...prev,
//       incomeSources,
//     }));
//   };

//   const setRatio = (ratio) => {
//     const normalized = {
//       savings: Number(ratio.savings) || 0,
//       expenses: Number(ratio.expenses) || 0,
//       buffer: Number(ratio.buffer) || 0,
//     };
//     setState((prev) => ({
//       ...prev,
//       ratio: normalized,
//     }));
//   };

//   const resetRatioToDefault = () => {
//     setState((prev) => ({
//       ...prev,
//       ratio: { savings: 55, expenses: 40, buffer: 5 },
//     }));
//   };

//   const setSavingsCategories = (categories) => {
//     setState((prev) => ({
//       ...prev,
//       savingsCategories: categories,
//     }));
//   };

//   const setExpenseCategories = (categories) => {
//     setState((prev) => ({
//       ...prev,
//       expenseCategories: categories,
//     }));
//   };

//   const setCurrentMonthKey = (monthKey) => {
//     setState((prev) => ({
//       ...prev,
//       currentMonthKey: monthKey,
//     }));
//   };

//   const addTransaction = (tx) => {
//     setState((prev) => {
//       const newTx = { ...tx, id: crypto.randomUUID() };
//       const monthKey = newTx.monthKey || getCurrentMonthKey();

//       // update monthlyData totals
//       const prevMonthly = prev.monthlyData || {};
//       const prevMonthSnapshot = prevMonthly[monthKey] || {};

//       const updatedMonth = { ...prevMonthSnapshot };
//       if (newTx.type === "income") {
//         updatedMonth.income =
//           (Number(prevMonthSnapshot.income) || 0) + Number(newTx.amount || 0);
//       } else if (newTx.type === "saving" || newTx.type === "savings") {
//         updatedMonth.savingsActual =
//           (Number(prevMonthSnapshot.savingsActual) || 0) +
//           Number(newTx.amount || 0);
//       } else if (newTx.type === "expense") {
//         updatedMonth.expensesActual =
//           (Number(prevMonthSnapshot.expensesActual) || 0) +
//           Number(newTx.amount || 0);
//       } else if (newTx.type === "buffer") {
//         updatedMonth.bufferUsed =
//           (Number(prevMonthSnapshot.bufferUsed) || 0) +
//           Number(newTx.amount || 0);
//       }

//       // update category actuals if categoryId is provided
//       let updatedSavingsCategories = prev.savingsCategories;
//       let updatedExpenseCategories = prev.expenseCategories;
//       if (newTx.categoryId) {
//         const catId = newTx.categoryId;
//         if (
//           prev.savingsCategories &&
//           prev.savingsCategories.some((c) => c.id === catId)
//         ) {
//           updatedSavingsCategories = (prev.savingsCategories || []).map((c) =>
//             c.id === catId
//               ? {
//                   ...c,
//                   actual: (Number(c.actual) || 0) + Number(newTx.amount || 0),
//                 }
//               : c
//           );
//         }
//         if (
//           prev.expenseCategories &&
//           prev.expenseCategories.some((c) => c.id === catId)
//         ) {
//           updatedExpenseCategories = (prev.expenseCategories || []).map((c) =>
//             c.id === catId
//               ? {
//                   ...c,
//                   actual: (Number(c.actual) || 0) + Number(newTx.amount || 0),
//                 }
//               : c
//           );
//         }
//       }

//       return {
//         ...prev,
//         transactions: [...prev.transactions, newTx],
//         monthlyData: {
//           ...prevMonthly,
//           [monthKey]: updatedMonth,
//         },
//         savingsCategories: updatedSavingsCategories,
//         expenseCategories: updatedExpenseCategories,
//       };
//     });
//   };

//   const deleteTransaction = (id) => {
//     setState((prev) => ({
//       ...prev,
//       transactions: prev.transactions.filter((t) => t.id !== id),
//     }));
//   };

//   const setSubscriptions = (subs) => {
//     setState((prev) => ({
//       ...prev,
//       subscriptions: subs,
//     }));
//   };

//   const setSavingsGoals = (goals) => {
//     setState((prev) => ({
//       ...prev,
//       savingsGoals: goals,
//     }));
//   };

//   const updateMonthlySnapshot = (monthKey, data) => {
//     setState((prev) => ({
//       ...prev,
//       monthlyData: {
//         ...prev.monthlyData,
//         [monthKey]: {
//           ...(prev.monthlyData[monthKey] || {}),
//           ...data,
//         },
//       },
//     }));
//   };

//   const value = {
//     state,
//     totalIncome,
//     savingsTarget,
//     expensesTarget,
//     bufferTarget,
//     setIncomeSources,
//     setRatio,
//     resetRatioToDefault,
//     setSavingsCategories,
//     setExpenseCategories,
//     setCurrentMonthKey,
//     addTransaction,
//     deleteTransaction,
//     setSubscriptions,
//     setSavingsGoals,
//     updateMonthlySnapshot,
//   };

//   return value;
// }

import { useEffect, useState } from "react";

const STORAGE_KEY = "finance_55_40_5_app_v1";

const defaultState = {
  incomeSources: [], // {id, name, amount}
  savingsCategories: [], // {id, name, target, actual}
  expenseCategories: [], // {id, name, limit, actual}
  bufferCategories: [], // ✅ ADDED {id, name, amount, used}
  ratio: { savings: 55, expenses: 40, buffer: 5 },
  monthlyData: {}, // { '2025-01': { income, savingsActual, expensesActual, bufferUsed, netBalance } }
  transactions: [], // {id, date, description, amount, categoryId, type, monthKey}
  subscriptions: [], // {id, name, amount, dueDay, categoryId, active}
  savingsGoals: [], // {id, name, targetAmount, savedAmount}
  insights: [],
  currentMonthKey: "", // 'YYYY-MM'
};

function getCurrentMonthKey() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${m}`;
}

export function useAppState() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaultState,
          ...parsed,
          currentMonthKey: parsed.currentMonthKey || getCurrentMonthKey(),
        };
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    return { ...defaultState, currentMonthKey: getCurrentMonthKey() };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [state]);

  const totalIncome = state.incomeSources.reduce(
    (sum, src) => sum + (Number(src.amount) || 0),
    0
  );

  const savingsTarget = Math.round(
    (totalIncome * (state.ratio.savings || 0)) / 100
  );
  const expensesTarget = Math.round(
    (totalIncome * (state.ratio.expenses || 0)) / 100
  );
  const bufferTarget = Math.round(
    (totalIncome * (state.ratio.buffer || 0)) / 100
  );

  const setIncomeSources = (incomeSources) => {
    setState((prev) => ({
      ...prev,
      incomeSources,
    }));
  };

  const setRatio = (ratio) => {
    const normalized = {
      savings: Number(ratio.savings) || 0,
      expenses: Number(ratio.expenses) || 0,
      buffer: Number(ratio.buffer) || 0,
    };
    setState((prev) => ({
      ...prev,
      ratio: normalized,
    }));
  };

  const resetRatioToDefault = () => {
    setState((prev) => ({
      ...prev,
      ratio: { savings: 55, expenses: 40, buffer: 5 },
    }));
  };

  const setSavingsCategories = (categories) => {
    setState((prev) => ({
      ...prev,
      savingsCategories: categories,
    }));
  };

  const setExpenseCategories = (categories) => {
    setState((prev) => ({
      ...prev,
      expenseCategories: categories,
    }));
  };

  // ✅ ADDED BUFFER CATEGORIES SETTER
  const setBufferCategories = (categories) => {
    setState((prev) => ({
      ...prev,
      bufferCategories: categories,
    }));
  };

  const setCurrentMonthKey = (monthKey) => {
    setState((prev) => ({
      ...prev,
      currentMonthKey: monthKey,
    }));
  };

  const addTransaction = (tx) => {
    setState((prev) => {
      const newTx = { ...tx, id: crypto.randomUUID() };
      const monthKey = newTx.monthKey || getCurrentMonthKey();

      // update monthlyData totals
      const prevMonthly = prev.monthlyData || {};
      const prevMonthSnapshot = prevMonthly[monthKey] || {};

      const updatedMonth = { ...prevMonthSnapshot };
      if (newTx.type === "income") {
        updatedMonth.income =
          (Number(prevMonthSnapshot.income) || 0) + Number(newTx.amount || 0);
      } else if (newTx.type === "saving" || newTx.type === "savings") {
        updatedMonth.savingsActual =
          (Number(prevMonthSnapshot.savingsActual) || 0) +
          Number(newTx.amount || 0);
      } else if (newTx.type === "expense") {
        updatedMonth.expensesActual =
          (Number(prevMonthSnapshot.expensesActual) || 0) +
          Number(newTx.amount || 0);
      } else if (newTx.type === "buffer") {
        updatedMonth.bufferUsed =
          (Number(prevMonthSnapshot.bufferUsed) || 0) +
          Number(newTx.amount || 0);
      }

      // update category actuals if categoryId is provided
      let updatedSavingsCategories = prev.savingsCategories;
      let updatedExpenseCategories = prev.expenseCategories;
      let updatedBufferCategories = prev.bufferCategories; // ✅ ADDED BUFFER

      if (newTx.categoryId) {
        const catId = newTx.categoryId;
        if (
          prev.savingsCategories &&
          prev.savingsCategories.some((c) => c.id === catId)
        ) {
          updatedSavingsCategories = (prev.savingsCategories || []).map((c) =>
            c.id === catId
              ? {
                  ...c,
                  actual: (Number(c.actual) || 0) + Number(newTx.amount || 0),
                }
              : c
          );
        }
        if (
          prev.expenseCategories &&
          prev.expenseCategories.some((c) => c.id === catId)
        ) {
          updatedExpenseCategories = (prev.expenseCategories || []).map((c) =>
            c.id === catId
              ? {
                  ...c,
                  actual: (Number(c.actual) || 0) + Number(newTx.amount || 0),
                }
              : c
          );
        }
        // ✅ ADDED BUFFER CATEGORY UPDATE
        if (
          prev.bufferCategories &&
          prev.bufferCategories.some((c) => c.id === catId)
        ) {
          updatedBufferCategories = (prev.bufferCategories || []).map((c) =>
            c.id === catId
              ? {
                  ...c,
                  used: (Number(c.used) || 0) + Number(newTx.amount || 0),
                }
              : c
          );
        }
      }

      return {
        ...prev,
        transactions: [...prev.transactions, newTx],
        monthlyData: {
          ...prevMonthly,
          [monthKey]: updatedMonth,
        },
        savingsCategories: updatedSavingsCategories,
        expenseCategories: updatedExpenseCategories,
        bufferCategories: updatedBufferCategories, // ✅ ADDED
      };
    });
  };

  const deleteTransaction = (id) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const updateTransaction = (id, updates) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  };

  const setSubscriptions = (subs) => {
    setState((prev) => ({
      ...prev,
      subscriptions: subs,
    }));
  };

  const setSavingsGoals = (goals) => {
    setState((prev) => ({
      ...prev,
      savingsGoals: goals,
    }));
  };

  const updateMonthlySnapshot = (monthKey, data) => {
    setState((prev) => ({
      ...prev,
      monthlyData: {
        ...prev.monthlyData,
        [monthKey]: {
          ...(prev.monthlyData[monthKey] || {}),
          ...data,
        },
      },
    }));
  };

  const value = {
    state,
    totalIncome,
    savingsTarget,
    expensesTarget,
    bufferTarget,
    setIncomeSources,
    setRatio,
    resetRatioToDefault,
    setSavingsCategories,
    setExpenseCategories,
    setBufferCategories, // ✅ ADDED
    setCurrentMonthKey,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    setSubscriptions,
    setSavingsGoals,
    updateMonthlySnapshot,
  };

  return value;
}
