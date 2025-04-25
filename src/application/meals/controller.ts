import { useMealsService } from './service.ts';
import { useMealsStore } from './store.ts';
import type { MealSlug } from './types.ts';

export const useMealsController = () => {
  const service = useMealsService();
  const store = useMealsStore();

  async function getMeals(mealSlug: MealSlug) {
    if (!store.mealsCache.has(mealSlug)) {
      store.isLoadingMeals = true;

      try {
        const response = await service.search(mealSlug);
        store.mealsCache.set(mealSlug, response?.meals || []);
      } catch (error) {
        console.error('Error fetching meals:', error);
        store.mealsCache.set(mealSlug, []);
      } finally {
        store.mealSlug = mealSlug;
        store.isLoadingMeals = false;
      }
    } else {
      store.mealSlug = mealSlug;
    }
  }

  return { getMeals };
};
