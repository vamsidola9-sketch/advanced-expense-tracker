import { useCallback, useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import {
  type Expense,
  type NewExpense,
  type ExpenseCategory,
} from '@/lib/supabase';
import {
  loadFromStorage,
  saveToStorage,
  type StoredData,
} from '@/lib/storage';
import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import PieChart from '@/components/PieChart';
import TotalSpent from '@/components/TotalSpent';
import BudgetTracker from '@/components/BudgetTracker';
import CategoryFilterDropdown, {
  type CategoryFilter,
} from '@/components/CategoryFilterDropdown';

function generateId(): string {
  return crypto.randomUUID();
}

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');

  useEffect(() => {
    const stored = loadFromStorage();
    setExpenses(stored.expenses);
    setMonthlyBudget(stored.monthlyBudget);
    setLoading(false);
  }, []);

  const persist = useCallback(
    (nextExpenses: Expense[], nextBudget: number) => {
      const data: StoredData = {
        expenses: nextExpenses,
        monthlyBudget: nextBudget,
      };
      saveToStorage(data);
    },
    []
  );

  const handleAdd = async (newExpense: NewExpense) => {
    const expense: Expense = {
      id: generateId(),
      name: newExpense.name,
      amount: newExpense.amount,
      category: newExpense.category as ExpenseCategory,
      created_at: new Date().toISOString(),
    };
    const nextExpenses = [expense, ...expenses];
    setExpenses(nextExpenses);
    persist(nextExpenses, monthlyBudget);
  };

  const handleDelete = async (id: string) => {
    const nextExpenses = expenses.filter((e) => e.id !== id);
    setExpenses(nextExpenses);
    persist(nextExpenses, monthlyBudget);
  };

  const handleBudgetChange = (budget: number) => {
    setMonthlyBudget(budget);
    persist(expenses, budget);
  };

  const filteredExpenses =
    categoryFilter === 'All'
      ? expenses
      : expenses.filter((e) => e.category === categoryFilter);

  const totalSpent = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
        <header className="mb-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
            <Wallet className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Expense Tracker
            </h1>
            <p className="text-sm text-neutral-500">Track your spending with ease</p>
          </div>
        </header>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-500" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <BudgetTracker
                budget={monthlyBudget}
                spent={totalSpent}
                onBudgetChange={handleBudgetChange}
              />

              <TotalSpent total={totalSpent} count={filteredExpenses.length} />

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-200">
                  Add Expense
                </h2>
                <ExpenseForm onAdd={handleAdd} />
              </div>
            </div>

            <div className="space-y-6 lg:col-span-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5 sm:p-6">
                <h2 className="mb-4 text-lg font-semibold text-neutral-200">
                  Breakdown
                </h2>
                <PieChart expenses={expenses} />
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5 sm:p-6">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold text-neutral-200">
                    Recent Expenses
                  </h2>
                  <CategoryFilterDropdown
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                  />
                </div>
                <ExpenseList expenses={filteredExpenses} onDelete={handleDelete} />
              </div>
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-xs text-neutral-700">
          Your data is saved locally in your browser and persists across refreshes.
        </footer>
      </div>
    </div>
  );
}
