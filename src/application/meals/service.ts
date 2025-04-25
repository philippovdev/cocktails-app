import { useRequest } from '@/libs/Http/useRequest.ts';

import type { MealSlug, MealsResponse } from './types.ts';

export const useMealsService = () => {
  const client = useRequest(import.meta.env.VITE_API_MEALS_URL || '');

  function search(slug: MealSlug) {
    return client.get<MealsResponse>(
      '/search.php?' +
        new URLSearchParams({
          s: slug,
        }).toString()
    );
  }

  return { search };
};
