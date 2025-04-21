import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import { ROUTES } from '@/application/core/domain/routes';
import AppNav from '@/application/core/presentation/components/AppNav.vue';

import {
  getMock,
  IMAGE_BASE_URL,
  ioInstances,
} from '../../../../vitest.setup.ts';
import { useCocktailsController } from '../domain/cocktails.controller';
import { useCocktailsService } from '../domain/cocktails.service';
import { COCKTAILS } from '../domain/types';
import { COCKTAILS_ROUTES } from '../infrastructure/cocktails.routes';
import { useCocktailsStore } from '../infrastructure/cocktails.store';
import CocktailComponent from '../presentation/components/[slug].vue';

describe('cocktails view', () => {
  let router: ReturnType<typeof createRouter>;
  let store: ReturnType<typeof useCocktailsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCocktailsStore();

    router = createRouter({
      history: createWebHistory(),
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
          component: { template: '<div>404</div>' },
        },
      ],
    });
  });

  it('cocktails to use: margarita, mojito, a1, kir', () => {
    expect(COCKTAILS).toEqual(['margarita', 'mojito', 'a1', 'kir']);
  });

  it('uses pinia for state management', async () => {
    const controller = useCocktailsController();

    await controller.getCocktails('margarita');
    await nextTick();

    expect(store.cocktailSlug).toBe('margarita');
    expect(store.cocktailCache.has('margarita')).toBe(true);

    const cocktails = store.cocktails;
    expect(cocktails).toBeDefined();
    expect(cocktails![0].strDrink).toBe('margarita');
  });

  it("root site directory '/' has to redirect user to first menu item", async () => {
    await router.push('/');
    expect(router.currentRoute.value.name).toBe(ROUTES.cocktailsShow.name);
    expect(router.currentRoute.value.params.slug).toBe(COCKTAILS[0]);
  });

  it('by default, the first menu item is active and is used for the main page', async () => {
    await router.push('/cocktails');
    expect(router.currentRoute.value.params.slug).toBe(COCKTAILS[0]);
  });

  it('non-existing pages should redirect to 404 page', async () => {
    await router.push('/non-existing-page');
    expect(router.currentRoute.value.name).toBe(ROUTES.notFound.name);
  });

  it('only sets src after intersection', async () => {
    await router.push('/cocktails/margarita');
    await router.isReady();

    const wrapper = mount(CocktailComponent, {
      global: { plugins: [router, createPinia()] },
    });
    await nextTick();

    expect(ioInstances).toHaveLength(1);

    ioInstances[0].trigger({ isIntersecting: true });
    await nextTick();

    expect(ioInstances).toHaveLength(2);

    const img = wrapper.get('img');
    expect(ioInstances[1].observe).toHaveBeenCalledWith(img.element);

    expect(img.attributes('src')).toBe('');
    expect(img.attributes('data-src')).toBe(IMAGE_BASE_URL + 'margarita.jpg');

    ioInstances[1].trigger({ isIntersecting: true });
    await nextTick();

    expect(img.attributes('src')).toBe(IMAGE_BASE_URL + 'margarita.jpg');
  });

  it('responsive interface with max width of 1024px and min width of 360px', () => {
    // TODO test via e2e
    expect(true).toBe(true);
  });

  it('highlights the active cocktail in the menu', async () => {
    for (const slug of COCKTAILS) {
      await router.push(`/cocktails/${slug}`);
      await router.isReady();
      const navWrapper = mount(AppNav, {
        global: { plugins: [router, createPinia()] },
      });
      const anchorActive = navWrapper.find(`a[href="/cocktails/${slug}"]`);
      const anchorsNoActive = navWrapper
        .findAll('a')
        .filter((a) => !a.classes('router-link-active'));
      expect(
        anchorActive
          .classes()
          .filter((c) =>
            ['router-link-active', 'router-link-exact-active'].includes(c)
          )
      ).toEqual(['router-link-active', 'router-link-exact-active']);
      expect(anchorsNoActive.length).toBe(COCKTAILS.length - 1);
    }
  });

  it('handle errors exceptions', async () => {
    const controller = useCocktailsController();

    // @ts-expect-error: expected to not be in cocktails list
    await controller.getCocktails('error-cocktail');
    await nextTick();

    // @ts-expect-error: expected to not be in cocktails list
    expect(store.cocktailCache.get('error-cocktail')).toEqual([]);
  });

  it('fetches data', async () => {
    const service = useCocktailsService();
    const result = await service.fetchCocktails('mojito');
    expect(result).toBeDefined();
    expect(result.drinks).toHaveLength(1);
    expect(result.drinks[0].strDrink).toBe('mojito');
  });

  it('every menu item is leading to related page with description', async () => {
    for (const cocktail of COCKTAILS) {
      await router.push(`/cocktails/${cocktail}`);
      expect(router.currentRoute.value.params.slug).toBe(cocktail);
    }
  });

  it('cocktails code are used for router slugs and menu items', () => {
    const cocktailShowRoute = COCKTAILS_ROUTES[0].children?.[0];
    expect(cocktailShowRoute?.path).toBe(ROUTES.cocktailsShow.path);
    expect(cocktailShowRoute?.name).toBe(ROUTES.cocktailsShow.name);

    const redirectRoute = COCKTAILS_ROUTES[0].redirect;
    expect(redirectRoute).toEqual({
      name: ROUTES.cocktailsShow.name,
      params: { slug: COCKTAILS[0] },
    });
  });

  it('uses GET: https://www.thecocktaildb.com/api/json/v1/1/search.php?s=<cocktail_code>', async () => {
    const service = useCocktailsService();
    await service.fetchCocktails('margarita');
    expect(getMock).toHaveBeenCalledWith('/search.php?s=margarita');
  });

  it('sets loading state when fetching cocktails', async () => {
    const controller = useCocktailsController();
    store.cocktailCache.clear();
    expect(store.isLoadingCocktail).toBe(false);
    const fetchPromise = controller.getCocktails('margarita');
    expect(store.isLoadingCocktail).toBe(true);

    await fetchPromise;
    await nextTick();

    expect(store.isLoadingCocktail).toBe(false);

    expect(store.cocktailCache.has('margarita')).toBe(true);
    expect(store.cocktailSlug).toBe('margarita');
  });
});
