import type { RouteRecordRaw } from 'vue-router';

import { ROUTES } from '@/router/routes.ts';

import { COCKTAILS } from './types.ts';

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
        component: () => import('./components/[slug].vue'),
      },
    ],
  },
] as const;
