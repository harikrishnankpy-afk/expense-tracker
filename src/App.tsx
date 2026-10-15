import { useEffect, useMemo, useState } from 'react';
import { categories, demoBudgets, demoTransactions } from './data/demo';
import { loadBudgets, loadTransactions, saveBudgets, saveTransactions } from './lib/storage';
import { Budget, Transaction } from './types';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense' as 'expense' | 'income',
    category: 'Food',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  useEffect(() => {
    const storedTransactions = loadTransactions();
    const storedBudgets = loadBudgets();

    setTransactions(storedTransactions.length ? storedTransactions : demoTransactions);
    setBudgets(storedBudgets.length ? storedBudgets : demoBudgets);
  }, []);

  useEffect(() => {
    if (transactions.length) {
      saveTransactions(transactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (budgets.length) {
      saveBudgets(budgets);
    }
  }, [budgets]);

  const summary = useMemo(() => {
    const income = transactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const monthlyExpenses = transactions
      .filter((transaction) => transaction.type === 'expense' && transaction.date.startsWith('2026-10'))
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = income - expenses;

    return { income, expenses, monthlyExpenses, balance };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenseMap = new Map<string, number>();

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const current = expenseMap.get(transaction.category) ?? 0;
        expenseMap.set(transaction.category, current + transaction.amount);
      });

    return [...expenseMap.entries()].map(([name, total]) => ({
      name,
      total,
      color: categories.find((category) => category.name === name)?.color ?? '#64748b',
    }));
  }, [transactions]);

  const handleAddTransaction = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title || !form.amount) {
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      title: form.title,
      amount: Number(form.amount),
      type: form.type,
      category: form.category,
      date: form.date,
      notes: form.notes,
    };

    setTransactions((currentTransactions) => [transaction, ...currentTransactions]);

    setForm({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  };

  const addBudget = () => {
    const category = 'Food';
    const nextBudget: Budget = {
      id: crypto.randomUUID(),
      category,
      limit: 500,
      spent: 0,
    };

    setBudgets((current) => [nextBudget, ...current]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Expense Tracker</p>
            <h1 className="text-2xl font-bold">Budget dashboard</h1>
          </div>

          <div className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            Local demo mode
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Balance" value={currencyFormatter.format(summary.balance)} tone="emerald" />
          <StatCard label="Income" value={currencyFormatter.format(summary.income)} tone="blue" />
          <StatCard label="Expenses" value={currencyFormatter.format(summary.expenses)} tone="rose" />
          <StatCard label="This month" value={currencyFormatter.format(summary.monthlyExpenses)} tone="amber" />
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_2fr]">
          <section className="rounded-2xl bg-white p-6 shadow-soft">
            <h2 className="mb-5 text-xl font-semibold">Add transaction</h2>

            <form className="space-y-4" onSubmit={handleAddTransaction}>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-sky-400 focus:bg-white"
                  placeholder="Groceries, rent, salary..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={(event) => setForm({ ...form, amount: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-400 focus:bg-white"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Type</label>
                  <select
                    value={form.type}
                    onChange={(event) => setForm({ ...form, type: event.target.value as 'expense' | 'income' })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-400 focus:bg-white"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={form.category}
                    onChange={(event) => setForm({ ...form, category: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-400 focus:bg-white"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => setForm({ ...form, date: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-400 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-400 focus:bg-white"
                  placeholder="Optional notes"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-sky-600 px-4 py-3 font-semibold text-white transition hover:bg-sky-500"
              >
                Save transaction
              </button>
            </form>
          </section>

          <div className="space-y-8">
            <section className="rounded-2xl bg-white p-6 shadow-soft">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent transactions</h2>
                <span className="text-sm text-slate-500">{transactions.length} total</span>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2.5 w-2.5 rounded-full ${
                            transaction.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        />
                        <p className="font-semibold text-slate-800">{transaction.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {transaction.category} · {transaction.date}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <p
                        className={`text-right font-semibold ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {currencyFormatter.format(transaction.amount)}
                      </p>
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-sm font-medium text-slate-500 hover:text-red-500"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
              <section className="rounded-2xl bg-white p-6 shadow-soft">
                <h2 className="mb-5 text-xl font-semibold">Category breakdown</h2>

                <div className="space-y-4">
                  {categoryBreakdown.map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                        <span>{item.name}</span>
                        <span>{currencyFormatter.format(item.total)}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((item.total / Math.max(summary.expenses, 1)) * 100, 100)}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl bg-white p-6 shadow-soft">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Budgets</h2>
                  <button
                    type="button"
                    onClick={addBudget}
                    className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const progress = Math.min((budget.spent / budget.limit) * 100, 100);
                    return (
                      <div key={budget.id} className="rounded-xl border border-slate-200 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="font-medium text-slate-800">{budget.category}</p>
                          <span className="text-sm text-slate-500">
                            {currencyFormatter.format(budget.spent)} / {currencyFormatter.format(budget.limit)}
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  tone: 'emerald' | 'blue' | 'rose' | 'amber';
};

function StatCard({ label, value, tone }: StatCardProps) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-sky-50 text-sky-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className={`rounded-2xl p-5 shadow-soft ${tones[tone]}`}>
      <p className="text-sm font-medium uppercase tracking-[0.15em] opacity-80">{label}</p>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default App;
