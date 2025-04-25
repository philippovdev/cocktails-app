import { acceptHMRUpdate, defineStore } from 'pinia';
import type { ComputedRef } from 'vue';
import { computed, ref, shallowReactive, shallowRef } from 'vue';

import type {
  Cocktail,
  CocktailSlug,
  CocktailWithIngredients,
} from './types.ts';

export const useCocktailsStore = defineStore('cocktails', () => {
  const cocktailsCache = shallowReactive(new Map<CocktailSlug, Cocktail[]>());
  const cocktailSlug = shallowRef<CocktailSlug>();
  const cocktails = computed(
    () => (cocktailSlug.value && cocktailsCache.get(cocktailSlug.value)) || []
  );
  const isLoadingCocktail = ref(false);

  const cocktailsWithIngredients: ComputedRef<{
    [key: Cocktail['idDrink']]: CocktailWithIngredients;
  }> = computed(() => {
    return cocktails.value.reduce(
      (acc: { [key: Cocktail['idDrink']]: CocktailWithIngredients }, next) => {
        acc[next.idDrink] = {
          ...next,
          ingredients: collectIngredients(next),
        };
        return acc;
      },
      {}
    );
  });

  function collectIngredients(cocktail: Cocktail) {
    const list: { ingredient: string; measure: string }[] = [];

    for (const key in cocktail) {
      if (!key.startsWith('strIngredient')) continue;
      if (!isCocktailKey(cocktail, key)) continue;
      const index = +key.replace('strIngredient', '');
      const measureKey = `strMeasure${index}`;
      if (!isCocktailKey(cocktail, measureKey)) continue;

      const ingredient = cocktail[key];
      const measure = cocktail[measureKey] || 'by hand';

      if (typeof ingredient === 'string' && ingredient.trim().length) {
        list.push({ ingredient, measure });
      }
    }

    return list;
  }

  function isCocktailKey(
    cocktail: Cocktail,
    key: string
  ): key is keyof Cocktail {
    return key in cocktail;
  }

  return {
    cocktailSlug,
    cocktailsCache,
    cocktails,
    cocktailsWithIngredients,
    isLoadingCocktail,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCocktailsStore, import.meta.hot));
}
