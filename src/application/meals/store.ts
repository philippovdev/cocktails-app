import { acceptHMRUpdate, defineStore } from 'pinia';
import type { ComputedRef } from 'vue';
import { computed, ref, shallowReactive, shallowRef } from 'vue';

import type { Meal, MealSlug, MealWithIngredients } from './types.ts';

export const useMealsStore = defineStore('meals', () => {
  const mealsCache = shallowReactive(new Map<MealSlug, Meal[]>());
  const mealSlug = shallowRef<MealSlug>();
  const meals = computed(
    () => (mealSlug.value && mealsCache.get(mealSlug.value)) || []
  );
  const isLoadingMeals = ref(false);

  const mealsWithIngredients: ComputedRef<{
    [key: Meal['idMeal']]: MealWithIngredients;
  }> = computed(() => {
    return meals.value.reduce(
      (acc: { [key: Meal['idMeal']]: MealWithIngredients }, next) => {
        acc[next.idMeal] = {
          ...next,
          ingredients: collectIngredients(next),
        };
        return acc;
      },
      {}
    );
  });

  function collectIngredients(meal: Meal) {
    const list: { ingredient: string; measure: string }[] = [];

    for (const key in meal) {
      if (!key.startsWith('strIngredient')) continue;
      if (!isMealKey(meal, key)) continue;
      const index = +key.replace('strIngredient', '');
      const measureKey = `strMeasure${index}`;
      if (!isMealKey(meal, measureKey)) continue;

      const ingredient = meal[key];
      const measure = meal[measureKey] || 'by hand';

      if (typeof ingredient === 'string' && ingredient.trim().length) {
        list.push({ ingredient, measure });
      }
    }

    return list;
  }

  function isMealKey(meal: Meal, key: string): key is keyof Meal {
    return key in meal;
  }

  return {
    mealSlug,
    mealsCache,
    meals,
    mealsWithIngredients,
    isLoadingMeals,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMealsStore, import.meta.hot));
}
