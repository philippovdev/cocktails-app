export const ROUTES = {
  home: {
    name: 'home',
    path: '/',
  },
  cocktails: {
    name: 'cocktails',
    path: '/cocktails',
  },
  cocktailsShow: {
    name: 'cocktails//[:slug]',
    path: ':slug',
  },
} as const;
