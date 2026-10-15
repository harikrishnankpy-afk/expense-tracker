import { Budget, Transaction } from '../types';

export const categories = [
  { id: 'food', name: 'Food', color: '#f97316' },
  { id: 'housing', name: 'Housing', color: '#3b82f6' },
  { id: 'transport', name: 'Transport', color: '#8b5cf6' },
  { id: 'utilities', name: 'Utilities', color: '#10b981' },
  { id: 'shopping', name: 'Shopping', color: '#ec4899' },
  { id: 'salary', name: 'Salary', color: '#22c55e' },
  { id: 'health', name: 'Health', color: '#ef4444' },
  { id: 'travel', name: 'Travel', color: '#f59e0b' },
];

export const demoTransactions: Transaction[] = [
  {
    id: 'txn-1',
    title: 'Groceries',
    amount: 82.45,
    type: 'expense',
    category: 'Food',
    date: '2026-10-12',
    notes: 'Weekly grocery run',
  },
  {
    id: 'txn-2',
    title: 'Monthly salary',
    amount: 3200,
    type: 'income',
    category: 'Salary',
    date: '2026-10-01',
    notes: 'Primary income',
  },
  {
    id: 'txn-3',
    title: 'Electric bill',
    amount: 112.6,
    type: 'expense',
    category: 'Utilities',
    date: '2026-10-08',
    notes: 'September bill',
  },
  {
    id: 'txn-4',
    title: 'Fuel',
    amount: 46.2,
    type: 'expense',
    category: 'Transport',
    date: '2026-10-06',
    notes: 'Commute',
  },
];

export const demoBudgets: Budget[] = [
  { id: 'budget-1', category: 'Food', limit: 600, spent: 280 },
  { id: 'budget-2', category: 'Housing', limit: 1500, spent: 1200 },
  { id: 'budget-3', category: 'Transport', limit: 250, spent: 140 },
];
