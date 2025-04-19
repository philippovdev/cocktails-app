import { useRequest } from '@/libs/Http/domain/useRequest.ts';

import type { CocktailSlug, DrinksResponse } from './types.ts';

export const useCocktailsService = () => {
  const client = useRequest(import.meta.env.VITE_API_BASE_URL || '');

  function fetchCocktails(slug: CocktailSlug) {
    return client.get<DrinksResponse>(
      '/search.php?' +
        new URLSearchParams({
          s: slug,
        }).toString()
    );
  }

  return { fetchCocktails };
};
