import { Budget, Transaction } from '../types';

const STORAGE_KEYS = {
  transactions: 'expense-tracker-transactions',
  budgets: 'expense-tracker-budgets',
};

export const loadTransactions = (): Transaction[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.transactions);
  return raw ? (JSON.parse(raw) as Transaction[]) : [];
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
};

export const loadBudgets = (): Budget[] => {
  const raw = localStorage.getItem(STORAGE_KEYS.budgets);
  return raw ? (JSON.parse(raw) as Budget[]) : [];
};

export const saveBudgets = (budgets: Budget[]) => {
  localStorage.setItem(STORAGE_KEYS.budgets, JSON.stringify(budgets));
};
