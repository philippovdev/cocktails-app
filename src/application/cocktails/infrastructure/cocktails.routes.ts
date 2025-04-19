import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@/application/core/domain/routes.ts';

import { COCKTAILS } from '../domain/types.ts';
import Cocktail from '../presentation/components/[slug].vue';

export const COCKTAILS_ROUTES: Readonly<RouteRecordRaw[]> = [
  {
    name: ROUTES.cocktails.name,
    path: ROUTES.cocktails.path,
    redirect: {
      name: ROUTES.cocktailsShow.name,
      params: { slug: COCKTAILS[0] },
    },
    children: [
      {
        name: ROUTES.cocktailsShow.name,
        path: ROUTES.cocktailsShow.path,
        component: Cocktail,
      },
    ],
  },
] as const;
