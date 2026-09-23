import type { Expense } from './supabase';

const STORAGE_KEY = 'expense-tracker-data';

export interface StoredData {
  expenses: Expense[];
  monthlyBudget: number;
}

export function loadFromStorage(): StoredData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { expenses: [], monthlyBudget: 0 };
    const parsed = JSON.parse(raw) as StoredData;
    return {
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      monthlyBudget: typeof parsed.monthlyBudget === 'number' ? parsed.monthlyBudget : 0,
    };
  } catch {
    return { expenses: [], monthlyBudget: 0 };
  }
}

export function saveToStorage(data: StoredData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}
