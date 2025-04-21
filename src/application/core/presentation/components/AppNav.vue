<script setup lang="ts">
defineOptions({
  name: 'AppNav',
});
import {
  COCKTAILS,
  type CocktailSlug,
} from '@/application/cocktails/domain/types.ts';
import uppercaseFirst from '@/shared/text/uppercaseFirst.ts';

import { ROUTES } from '../../domain/routes.ts';

function createPreconnectLink(slug: CocktailSlug) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = `${import.meta.env.VITE_API_BASE_URL}search.php?s=${slug}`;
  return link;
}

function onMouseEnter(slug: CocktailSlug) {
  document.head.querySelector('link[rel="preconnect"]')?.remove();
  document.head.appendChild(createPreconnectLink(slug));
}
</script>

<template>
  <nav :class="s.nav">
    <RouterLink
      v-for="slug in COCKTAILS"
      :key="slug"
      :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }"
      :class="s.item"
      :title="uppercaseFirst(slug)"
      @mouseenter="onMouseEnter(slug)"
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

.item:global(.router-link-active) {
  color: var(--color-primary);
  background-color: var(--color-bg-primary--active);
  border: var(--border-width) solid var(--border-color);
}

.item:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-primary--lighten);
}
</style>
