import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, ref, shallowReactive, shallowRef } from 'vue';

import type {
  Cocktail,
  CocktailSlug,
} from '@/application/cocktails/domain/types.ts';

export const useCocktailsStore = defineStore('cocktails', () => {
  const cocktailCache = shallowReactive(new Map<CocktailSlug, Cocktail[]>());
  const cocktailSlug = shallowRef<CocktailSlug>();
  const cocktails = computed(
    () => (cocktailSlug.value && cocktailCache.get(cocktailSlug.value)) || []
  );
  const isLoadingCocktail = ref(false);

  return {
    cocktailSlug,
    cocktailCache,
    cocktails,
    isLoadingCocktail,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCocktailsStore, import.meta.hot));
}
