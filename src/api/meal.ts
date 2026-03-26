import { client } from './client';

export interface DayMeal {
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
}

export interface MealsResponse {
  meals: DayMeal[];
}

export function extractKcal(items: string[]): { menu: string[]; kcal: string | null } {
  const idx = items.findIndex(s => /\d+\.?\d*\s*Kcal/i.test(s));
  if (idx >= 0) return { menu: items.slice(0, idx), kcal: items[idx] };
  return { menu: items, kcal: null };
}

export const mealApi = {
  // Returns all meals for the month containing the given date
  fetchMeals(date: string) {
    return client.get<MealsResponse>(`/meals/${date}`);
  },
};
