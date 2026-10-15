export type TransactionType = 'expense' | 'income';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes?: string;
};

export type Budget = {
  id: string;
  category: string;
  limit: number;
  spent: number;
};
