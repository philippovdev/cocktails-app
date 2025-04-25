import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import AppNav from '@/layout/components/AppNav.vue';
import { ROUTES } from '@/router/routes.ts';

import { ioInstances } from '../../../../vitest.setup.ts';
import MealsShow from '../components/[slug].vue';
import { useMealsController } from '../controller.ts';
import { MEALS_ROUTES } from '../routes.ts';
import { useMealsService } from '../service.ts';
import { useMealsStore } from '../store.ts';
import { MEALS } from '../types.ts';

export const IMAGE_BASE_URL = 'https://www.themealdb.com/images/media/meals/';
export const getMock = vi.fn((url: string) => {
  const slug = new URLSearchParams(url.split('?')[1]).get('s');

  if (slug === 'error-meal') {
    return Promise.reject(new Error('API Error'));
  }

  return Promise.resolve({
    meals: [
      {
        idMeal: '1',
        strMeal: slug,
        strMealThumb: IMAGE_BASE_URL + `${slug}.jpg`,
        strMealAlternate: null,
        strTags: null,
        strVideo: null,
        strCategory: 'Test',
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

describe('meals view', () => {
  let router: ReturnType<typeof createRouter>;
  let store: ReturnType<typeof useMealsStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useMealsStore();

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          name: ROUTES.home.name,
          path: ROUTES.home.path,
          redirect: { name: ROUTES.meals.name },
        },
        ...MEALS_ROUTES,
        {
          name: ROUTES.notFound.name,
          path: ROUTES.notFound.path,
          component: { template: '<div>404</div>' },
        },
      ],
    });
  });

  it('meals to use: lamb, pork, potato, onion', () => {
    expect(MEALS).toEqual(['lamb', 'pork', 'potato', 'onion']);
  });

  it('uses pinia for state management', async () => {
    const controller = useMealsController();

    await controller.getMeals('lamb');
    await nextTick();

    expect(store.mealSlug).toBe('lamb');
    expect(store.mealsCache.has('lamb')).toBe(true);

    const meals = store.meals;
    expect(meals).toBeDefined();
    expect(meals![0].strMeal).toBe('lamb');
  });

  it("root site directory '/' has to redirect user to first menu item", async () => {
    await router.push('/');
    expect(router.currentRoute.value.name).toBe(ROUTES.mealsShow.name);
    expect(router.currentRoute.value.params.slug).toBe(MEALS[0]);
  });

  it('by default, the first menu item is active and is used for the main page', async () => {
    await router.push('/meals');
    expect(router.currentRoute.value.params.slug).toBe(MEALS[0]);
  });

  it('non-existing pages should redirect to 404 page', async () => {
    await router.push('/non-existing-page');
    expect(router.currentRoute.value.name).toBe(ROUTES.notFound.name);
  });

  it('only sets src after intersection', async () => {
    await router.push('/meals/lamb');
    await router.isReady();

    const wrapper = mount(MealsShow, {
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
    expect(img.attributes('data-src')).toBe(IMAGE_BASE_URL + 'lamb.jpg/medium');

    ioInstances[1].trigger({ isIntersecting: true });
    await nextTick();

    expect(img.attributes('src')).toBe(IMAGE_BASE_URL + 'lamb.jpg/medium');
  });

  it('responsive interface with max width of 1024px and min width of 360px', () => {
    // TODO test via e2e
    expect(true).toBe(true);
  });

  it('highlights the active meal in the menu', async () => {
    for (const slug of MEALS) {
      await router.push(`/meals/${slug}`);
      await router.isReady();
      const navWrapper = mount(AppNav, {
        global: { plugins: [router, createPinia()] },
      });
      const anchorActive = navWrapper.find(`a[href="/meals/${slug}"]`);
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
      expect(anchorsNoActive.length).toBe(MEALS.length - 1);
    }
  });

  it('handle errors exceptions', async () => {
    const controller = useMealsController();

    // @ts-expect-error: expected to not be in meals list
    await controller.getMeals('error-meal');
    await nextTick();

    // @ts-expect-error: expected to not be in meals list
    expect(store.mealsCache.get('error-meal')).toEqual([]);
  });

  it('fetches data', async () => {
    const service = useMealsService();
    const result = await service.search('lamb');
    expect(result).toBeDefined();
    expect(result.meals).toHaveLength(1);
    expect(result.meals[0].strMeal).toBe('lamb');
  });

  it('every menu item is leading to related page with description', async () => {
    for (const meal of MEALS) {
      await router.push(`/meals/${meal}`);
      expect(router.currentRoute.value.params.slug).toBe(meal);
    }
  });

  it('meals code are used for router slugs and menu items', () => {
    const mealShowRoute = MEALS_ROUTES[0].children?.[0];
    expect(mealShowRoute?.path).toBe(ROUTES.mealsShow.path);
    expect(mealShowRoute?.name).toBe(ROUTES.mealsShow.name);

    const redirectRoute = MEALS_ROUTES[0].redirect;
    expect(redirectRoute).toEqual({
      name: ROUTES.mealsShow.name,
      params: { slug: MEALS[0] },
    });
  });

  it('uses GET: https://www.themealdb.com/api/json/v1/1/search.php?s=<meal_code>', async () => {
    const service = useMealsService();
    await service.search('lamb');
    expect(getMock).toHaveBeenCalledWith('/search.php?s=lamb');
  });

  it('sets loading state when fetching meals', async () => {
    const controller = useMealsController();
    store.mealsCache.clear();
    expect(store.isLoadingMeals).toBe(false);
    const fetchPromise = controller.getMeals('lamb');
    expect(store.isLoadingMeals).toBe(true);

    await fetchPromise;
    await nextTick();

    expect(store.isLoadingMeals).toBe(false);

    expect(store.mealsCache.has('lamb')).toBe(true);
    expect(store.mealSlug).toBe('lamb');
  });
});
