import { useCocktailsService } from './service.ts';
import { useCocktailsStore } from './store.ts';
import type { CocktailSlug } from './types.ts';

export const useCocktailsController = () => {
  const service = useCocktailsService();
  const store = useCocktailsStore();

  async function getCocktails(cocktailSlug: CocktailSlug) {
    if (!store.cocktailsCache.has(cocktailSlug)) {
      store.isLoadingCocktail = true;

      try {
        const response = await service.search(cocktailSlug);
        store.cocktailsCache.set(cocktailSlug, response?.drinks || []);
      } catch (error) {
        console.error('Error fetching cocktails:', error);
        store.cocktailsCache.set(cocktailSlug, []);
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
