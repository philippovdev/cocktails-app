import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, shallowReactive, shallowRef } from 'vue';

import type {
  Cocktail,
  CocktailSlug,
} from '@/application/cocktails/domain/types.ts';

export const useCocktailsStore = defineStore('cocktails', () => {
  const cocktailCache = shallowReactive(new Map<CocktailSlug, Cocktail[]>());
  const cocktailId = shallowRef<CocktailSlug>();
  const cocktail = computed(
    () => cocktailId.value && cocktailCache.get(cocktailId.value)
  );
  const isLoadingCocktail = ref(false);

  return {
    cocktailId,
    cocktailCache,
    cocktail,
    isLoadingCocktail,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCocktailsStore, import.meta.hot));
}
