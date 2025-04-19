# Project Guidelines for Cocktails App

## Project Overview
This is a Vue 3 application for displaying cocktail information fetched from TheCocktailDB API. The application follows a domain-driven design architecture with clear separation of concerns.

### Key Features
- Cocktail data fetching from TheCocktailDB API
- State management using Pinia
- Routing with Vue Router
- Responsive design (360px to 1024px)
- Error handling
- Lazy loading for images

### Cocktails Used
- margarita
- mojito
- a1
- kir

## Project Structure
```
src/
├── application/
│   ├── FeatureName/ # domain
│   │   ├── domain/ # domain logic
│   │   │   ├── featureName.service.ts # API communication
│   │   │   └── featureName.controller.ts # business logic
│   │   ├── infrastructure/
│   │   │   ├── featureName.store.ts # Pinia store
│   │   │   └── featureName.router.ts # routing
│   │   └── presentation/ # UI components
│   │       ├── components/ # feature-specific components
│   │       └── views/ # feature views
├── assets/ # static assets
├── shared/ # shared utilities
├── libs/ # external services
├── App.vue
└── main.ts
```

## Testing Guidelines
- Unit tests should be run using Vitest: `pnpm test:unit`
- E2E tests should be run using Playwright: `pnpm test:e2e`
- When implementing solutions, ensure all tests pass before submitting

## Build Process
- Development server: `pnpm dev`
- Production build: `pnpm build`
- Type checking is enforced during the build process

## Code Style Guidelines
- TypeScript is used throughout the project
- Follow ESLint and Prettier configurations
- Run linting before submitting: `pnpm lint`
- Maintain the domain-driven architecture pattern
- Keep components focused on a single responsibility

## API Integration
- Use the TheCocktailDB API: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=<cocktail_code>`
- Handle API errors gracefully
- Implement proper loading states
