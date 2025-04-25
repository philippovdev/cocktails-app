import type { RouteRecordRaw } from 'vue-router';

import { MEALS } from '@/application/meals/types.ts';
import { ROUTES } from '@/router/routes.ts';

export const MEALS_ROUTES: Readonly<RouteRecordRaw[]> = [
  {
    name: ROUTES.meals.name,
    path: ROUTES.meals.path,
    redirect: {
      name: ROUTES.mealsShow.name,
      params: { slug: MEALS[0] },
    },
    children: [
      {
        name: ROUTES.mealsShow.name,
        path: ROUTES.mealsShow.path,
        component: () => import('./components/[slug].vue'),
      },
    ],
  },
] as const;
