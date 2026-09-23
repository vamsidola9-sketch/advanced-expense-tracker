import { useState } from 'react';
import { Target, AlertTriangle } from 'lucide-react';

interface BudgetTrackerProps {
  budget: number;
  spent: number;
  onBudgetChange: (budget: number) => void;
}

export default function BudgetTracker({ budget, spent, onBudgetChange }: BudgetTrackerProps) {
  const [inputValue, setInputValue] = useState(budget > 0 ? String(budget) : '');

  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  const isOverBudget = budget > 0 && percentage >= 100;
  const isWarning = budget > 0 && percentage >= 50 && percentage < 100;
  const isGood = budget > 0 && percentage < 50;

  const barColor = isOverBudget
    ? '#ef4444'
    : isWarning
      ? '#f59e0b'
      : isGood
        ? '#10b981'
        : '#262626';

  const barWidth = Math.min(percentage, 100);

  const handleSetBudget = () => {
    const value = parseFloat(inputValue);
    if (!isNaN(value) && value >= 0) {
      onBudgetChange(value);
    }
  };

  const remaining = budget - spent;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
          <Target className="h-4 w-4 text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-200">Monthly Budget</h2>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSetBudget();
            }}
            placeholder="Set your monthly budget"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900/50 py-3 pl-8 pr-4 text-neutral-100 placeholder-neutral-600 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <button
          onClick={handleSetBudget}
          className="rounded-xl bg-emerald-500/90 px-5 py-3 font-semibold text-neutral-950 transition-all hover:bg-emerald-400 active:scale-[0.98]"
        >
          Set
        </button>
      </div>

      {budget > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-neutral-400">
              ${spent.toFixed(2)} of ${budget.toFixed(2)} spent
            </span>
            <span
              className="font-semibold"
              style={{ color: barColor }}
            >
              {percentage.toFixed(1)}%
            </span>
          </div>

          <div className="h-4 w-full overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${barWidth}%`,
                backgroundColor: barColor,
                boxShadow: isOverBudget ? `0 0 12px ${barColor}80` : 'none',
              }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-neutral-500">
              {remaining >= 0
                ? `$${remaining.toFixed(2)} remaining`
                : `$${Math.abs(remaining).toFixed(2)} over budget`}
            </span>

            {isOverBudget && (
              <span className="flex items-center gap-1.5 text-base font-bold text-red-400 animate-blink">
                <AlertTriangle className="h-4 w-4" />
                Budget Exceeded!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
