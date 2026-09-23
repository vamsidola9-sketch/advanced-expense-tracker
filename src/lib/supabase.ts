import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  created_at: string;
}

export interface NewExpense {
  name: string;
  amount: number;
  category: ExpenseCategory;
}

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#10b981',
  Transport: '#3b82f6',
  Entertainment: '#f59e0b',
  Shopping: '#ec4899',
  Bills: '#ef4444',
  Other: '#8b5cf6',
};
