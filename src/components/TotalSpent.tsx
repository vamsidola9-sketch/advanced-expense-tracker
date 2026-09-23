import { TrendingUp } from 'lucide-react';

interface TotalSpentProps {
  total: number;
  count: number;
}

export default function TotalSpent({ total, count }: TotalSpentProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 to-neutral-900/50 p-6 sm:p-8">
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="relative">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <span className="text-sm font-medium uppercase tracking-wider text-neutral-500">
            Total Spent
          </span>
        </div>
        <p className="text-4xl font-bold tracking-tight text-emerald-400 sm:text-5xl">
          ${total.toFixed(2)}
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          {count === 0
            ? 'No expenses tracked yet'
            : `Across ${count} ${count === 1 ? 'expense' : 'expenses'}`}
        </p>
      </div>
    </div>
  );
}
