import { Filter } from 'lucide-react';
import { CATEGORIES, type ExpenseCategory } from '@/lib/supabase';

export type CategoryFilter = 'All' | ExpenseCategory;

interface CategoryFilterDropdownProps {
  value: CategoryFilter;
  onChange: (value: CategoryFilter) => void;
}

export default function CategoryFilterDropdown({
  value,
  onChange,
}: CategoryFilterDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <Filter className="h-4 w-4 text-neutral-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as CategoryFilter)}
        className="cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-neutral-200 outline-none transition-all focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
      >
        <option value="All" className="bg-neutral-900 text-neutral-100">
          All Categories
        </option>
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat} className="bg-neutral-900 text-neutral-100">
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
