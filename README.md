# Cocktails app

---

### Demo project requirements:

---

#### == _Functional_ == 

---

- draft interface implementation
- data fetching
- no boilerplate of any kind
- api reference up to `GET: https://www.thecocktaildb.com/api/json/v1/1/search.php?s=<cocktail_code>`
- cocktails to use: `margarita`, `mojito`, `a1`, `kir`
- use Pinia state management
- handle errors exceptions
- cocktails code are used for router slugs and menu items
- every menu item is leading to related page with description
- active menu item is highlighted
- by default, the first menu item is active and is used for the main page
- root site directory '/' has to redirect user to first menu item
- non-existing pages should redirect to 404 page
- responsive interface with max width of 1024px and min width of 360px
- adaptive interface for chrome and safari
- should use lazy loading for images
---

#### == _Non-Functional_ ==

- scalable architecture. Must be structured in a way, that it's easily extendable and modifiable
- quality gates (up to 5). Must contain instruments to guaranty code quality

---


### Stack:

- [Vue III](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [TypeScript](https://www.typescriptlang.org/)

### Arcitecture:

```shell
src/
├── application/
│   ├── FeatureName/ # domain
│   │   ├── domain/ # this directory contains the domain logic
│   │   │   ├── featureName.service.ts # communicates with api, returns promises
│   │   │   └── featureName.controller.ts # contains domain business logic, consumes service. Used within components
│   │   ├── infrastructure/
│   │   │   ├── featureName.store.ts # state management (pinia store)
│   │   │   └── featureName.router.ts # related router file
│   │   └── presentation/ # contains the UI
│   │       ├── components/ # components directory stores components used within feature views
│   │       │   ├── ComponentName.vue # used within given view
│   │       │   └── ComponentName2.vue # used within given view
│   │       └── views/ # may be recursively filled with other "internal" features, preserving the same structure as above
│   │           └── FeatureNameRoot.vue # orchestrates the feature UI
├── assets/ # contains assets, which ***vite will add hash to file names***
│   ├── css/
│   ├── icons/
│   ├── img/
│   └── etc/ # could be anything we need to add hash to
├── shared/ # shared code (read utilities), but split by domain for clear separation
│   ├── Browser/ # BOW related APIs
│   ├── Date/ # some date utils
│   ├── String/ # could be string utils
│   ├── UI/ # mostly components
│   └── etc/ # could be anything shared, clearly separated by domain
├── libs/ # none project services
│   ├── Http/ # http client
│   └── etc/ # could be anything shared, clearly separated by domain
├── App.vue
└── main.ts
```

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
