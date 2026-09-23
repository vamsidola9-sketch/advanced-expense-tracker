import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { CATEGORIES, type ExpenseCategory, type NewExpense } from '@/lib/supabase';

interface ExpenseFormProps {
  onAdd: (expense: NewExpense) => Promise<void>;
}

export default function ExpenseForm({ onAdd }: ExpenseFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedName) {
      setError('Please enter an expense name');
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      await onAdd({ name: trimmedName, amount: parsedAmount, category });
      setName('');
      setAmount('');
      setCategory('Food');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-400">
          Expense Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Lunch at cafe"
          className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-neutral-100 placeholder-neutral-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-neutral-400">
            Amount
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              $
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-3 pl-8 pr-4 text-neutral-100 placeholder-neutral-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-1.5 block text-sm font-medium text-neutral-400">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full cursor-pointer rounded-xl border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-neutral-100 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-neutral-900 text-neutral-100">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-neutral-950 transition-all hover:bg-emerald-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Plus className="h-5 w-5" />
        )}
        {submitting ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}
