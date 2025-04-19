import type { CocktailSlug } from '@/application/cocktails/domain/types.ts';

import { useCocktailsStore } from '../infrastructure/cocktails.store.ts';
import { useCocktailsService } from './cocktails.service.ts';

export const useCocktailsController = () => {
  const service = useCocktailsService();
  const store = useCocktailsStore();

  async function getCocktails(cocktailSlug: CocktailSlug) {
    if (!store.cocktailCache.has(cocktailSlug)) {
      store.isLoadingCocktail = true;
      store.cocktailCache.set(
        cocktailSlug,
        (await service.fetchCocktails(cocktailSlug))?.drinks || []
      );
      store.cocktailId = cocktailSlug;
      store.isLoadingCocktail = false;
    } else {
      store.cocktailId = cocktailSlug;
    }
  }

  return { getCocktails };
};
