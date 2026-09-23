import { Trash2 } from 'lucide-react';
import { CATEGORY_COLORS, type Expense } from '@/lib/supabase';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/50">
          <span className="text-2xl text-neutral-600">~</span>
        </div>
        <p className="text-neutral-500">No expenses yet</p>
        <p className="text-sm text-neutral-600">Add your first expense above</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="group flex items-center gap-4 rounded-xl border border-neutral-800/50 bg-neutral-900/30 p-4 transition-all hover:border-neutral-700 hover:bg-neutral-900/60"
        >
          <div
            className="h-10 w-1 flex-shrink-0 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-neutral-100">{expense.name}</p>
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className="text-xs font-medium"
                style={{ color: CATEGORY_COLORS[expense.category] }}
              >
                {expense.category}
              </span>
              <span className="text-xs text-neutral-600">
                {formatRelativeTime(expense.created_at)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-100">
              ${expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(expense.id)}
              className="flex-shrink-0 rounded-lg p-2 text-neutral-600 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
              aria-label="Delete expense"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
