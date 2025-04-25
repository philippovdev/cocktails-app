import { useRequest } from '@/libs/Http/useRequest.ts';

import type { CocktailSlug, DrinksResponse } from './types.ts';

export const useCocktailsService = () => {
  const client = useRequest(import.meta.env.VITE_API_DRINKS_URL || '');

  function search(slug: CocktailSlug) {
    return client.get<DrinksResponse>(
      '/search.php?' +
        new URLSearchParams({
          s: slug,
        }).toString()
    );
  }

  return { search };
};
