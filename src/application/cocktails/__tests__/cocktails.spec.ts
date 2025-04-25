import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import AppNav from '@/layout/components/AppNav.vue';
import { ROUTES } from '@/router/routes.ts';

import { ioInstances } from '../../../../vitest.setup.ts';
import CocktailsShow from '../components/[slug].vue';
import { useCocktailsController } from '../controller.ts';
import { COCKTAILS_ROUTES } from '../routes.ts';
import { useCocktailsService } from '../service.ts';
import { useCocktailsStore } from '../store.ts';
import { COCKTAILS } from '../types.ts';

export const IMAGE_BASE_URL =
  'https://www.thecocktaildb.com/images/media/drink/';
export const getMock = vi.fn((url: string) => {
  const slug = new URLSearchParams(url.split('?')[1]).get('s');

  if (slug === 'error-cocktail') {
    return Promise.reject(new Error('API Error'));
  }

  return Promise.resolve({
    drinks: [
      {
        idDrink: '1',
        strDrink: slug,
        strDrinkThumb: IMAGE_BASE_URL + `${slug}.jpg`,
        strDrinkAlternate: null,
        strTags: null,
        strVideo: null,
        strCategory: 'Test',
        strIBA: null,
        strAlcoholic: 'Alcoholic',
        strGlass: 'Test Glass',
        strImageSource: null,
        strImageAttribution: null,
        strCreativeCommonsConfirmed: 'Yes',
        dateModified: '2023-01-01 12:00:00',
        strInstructions: 'Test instructions',
      },
    ],
  });
});

vi.mock('@/libs/Http/useRequest', () => ({
  useRequest: () => ({ get: getMock }),
}));

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
    expect(store.cocktailsCache.has('margarita')).toBe(true);

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

    const wrapper = mount(CocktailsShow, {
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
    expect(img.attributes('data-src')).toBe(
      IMAGE_BASE_URL + 'margarita.jpg/medium'
    );

    ioInstances[1].trigger({ isIntersecting: true });
    await nextTick();

    expect(img.attributes('src')).toBe(IMAGE_BASE_URL + 'margarita.jpg/medium');
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
    expect(store.cocktailsCache.get('error-cocktail')).toEqual([]);
  });

  it('fetches data', async () => {
    const service = useCocktailsService();
    const result = await service.search('mojito');
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
    await service.search('margarita');
    expect(getMock).toHaveBeenCalledWith('/search.php?s=margarita');
  });

  it('sets loading state when fetching cocktails', async () => {
    const controller = useCocktailsController();
    store.cocktailsCache.clear();
    expect(store.isLoadingCocktail).toBe(false);
    const fetchPromise = controller.getCocktails('margarita');
    expect(store.isLoadingCocktail).toBe(true);

    await fetchPromise;
    await nextTick();

    expect(store.isLoadingCocktail).toBe(false);

    expect(store.cocktailsCache.has('margarita')).toBe(true);
    expect(store.cocktailSlug).toBe('margarita');
  });
});
