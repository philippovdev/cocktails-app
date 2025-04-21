import { beforeEach, vi } from 'vitest';

export const ioInstances: Array<{
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  trigger: (entry: Partial<IntersectionObserverEntry>) => void;
}> = [];

beforeEach(() => {
  ioInstances.length = 0;

  global.IntersectionObserver = vi.fn((cb) => {
    const instance = {
      observe: vi.fn(() => {}),
      disconnect: vi.fn(),
      unobserve: vi.fn(() => {}),
      takeRecords: vi.fn(() => []),
      root: null,
      rootMargin: '0px',
      thresholds: [0],
      trigger: (entry: Partial<IntersectionObserverEntry>) => {
        cb(
          [entry as IntersectionObserverEntry],
          instance as IntersectionObserver
        );
      },
    };
    ioInstances.push(instance);
    return instance;
  });
});

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
