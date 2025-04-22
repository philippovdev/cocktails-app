import type { Component, TransitionProps } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

import { COCKTAILS_ROUTES } from '@/application/cocktails/infrastructure/cocktails.routes.ts';
import { ROUTES } from '@/application/core/domain/routes.ts';

export function _createRouter() {
  const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      {
        name: ROUTES.home.name,
        path: ROUTES.home.path,
        redirect: { name: ROUTES.cocktails.name },
      },
      ...COCKTAILS_ROUTES,
      {
        name: ROUTES.notFound.name,
        path: ROUTES.notFound.path,
        meta: { layout: 'error' },
        children: [],
      },
    ],
    scrollBehavior() {
      return { top: 0 };
    },
  });

  const resolvedLayouts = new Map<string, Component>();
  router.beforeResolve(async (to) => {
    const layout = to.meta.layout || 'default';

    if (!resolvedLayouts.has(layout)) {
      resolvedLayouts.set(
        layout,
        (await import(`../presentation/views/${layout}.vue`)).default
      );
    }

    to.meta.resolvedLayout = resolvedLayouts.get(layout)!;
  });

  return router;
}

export const coreRouter = _createRouter();

// layout system
// TS extensions

declare module 'vue-router' {
  export interface RouteMeta {
    /**
     * Possible layouts for a route. Should correspond to an existing .vue file in the src/layouts folder.
     */
    layout?: 'default' | 'error';

    /**
     * Component of the layout to be used. Used by Layout.vue.
     */
    resolvedLayout?: Component;

    /**
     * Transition to apply for the entering or leaving view.
     */
    transition?: string | TransitionProps;
  }
}
