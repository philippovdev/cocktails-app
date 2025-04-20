import type { CocktailSlug } from '@/application/cocktails/domain/types.ts';

import { useCocktailsStore } from '../infrastructure/cocktails.store.ts';
import { useCocktailsService } from './cocktails.service.ts';

export const useCocktailsController = () => {
  const service = useCocktailsService();
  const store = useCocktailsStore();

  async function getCocktails(cocktailSlug: CocktailSlug) {
    if (!store.cocktailCache.has(cocktailSlug)) {
      store.isLoadingCocktail = true;

      try {
        const response = await service.fetchCocktails(cocktailSlug);
        store.cocktailCache.set(cocktailSlug, response?.drinks || []);
      } catch (error) {
        console.error('Error fetching cocktails:', error);
        store.cocktailCache.set(cocktailSlug, []);
      } finally {
        store.cocktailSlug = cocktailSlug;
        store.isLoadingCocktail = false;
      }
    } else {
      store.cocktailSlug = cocktailSlug;
    }
  }

  return { getCocktails };
};
