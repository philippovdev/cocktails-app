<script setup lang="ts">
import {
  COCKTAILS,
  type CocktailSlug,
} from '@/application/cocktails/domain/types.ts';
import uppercaseFirst from '@/shared/text/uppercaseFirst.ts';

import { ROUTES } from '../../domain/routes.ts';

const API_BASE = (import.meta.env.VITE_API_BASE_URL?.replace(/\/?$/, '/') ??
  '/') as string;

const prefetched = new Set<string>();

function buildUrl(slug: CocktailSlug) {
  return `${API_BASE}search.php?s=${encodeURIComponent(slug)}`;
}

function addPrefetch(slug: CocktailSlug) {
  if (typeof window === 'undefined') return;

  const url = buildUrl(slug);
  if (prefetched.has(url)) return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'fetch';
  link.href = url;
  link.crossOrigin = 'anonymous';

  const onError = () => {
    prefetched.delete(url);
    link.remove();
  };

  link.addEventListener('error', onError, { once: true });

  document.head.appendChild(link);
  prefetched.add(url);
}
</script>

<template>
  <nav :class="s.nav" aria-label="Cocktail list">
    <RouterLink
      v-for="slug in COCKTAILS"
      :key="slug"
      :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }"
      :class="s.item"
      :title="uppercaseFirst(slug)"
      @pointerenter="addPrefetch(slug)"
    >
      {{ uppercaseFirst(slug) }}
    </RouterLink>
  </nav>
</template>

<style module="s">
.nav {
  display: flex;
  flex-direction: column;
  padding: 30px 0;
}

.item {
  padding: var(--spacing-base) var(--spacing-item-y);
  font-size: var(--font-size-xl);
  border: var(--border-width) solid transparent;
  margin: calc(-1 * var(--border-width));
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(.router-link-active).item {
  color: var(--color-primary);
  background-color: var(--color-bg-primary--active);
  border-color: var(--border-color);
}

.item:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-primary--lighten);
}
</style>
