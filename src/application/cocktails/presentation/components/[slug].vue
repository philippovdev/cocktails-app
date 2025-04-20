<script setup lang="ts">
defineOptions({ name: 'CocktailsShow' });
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import { useCocktailsController } from '../../domain/cocktails.controller.ts';
import type { CocktailSlug } from '../../domain/types.ts';
import { useCocktailsStore } from '../../infrastructure/cocktails.store.ts';
import CocktailDetails from './CocktailDetails.vue';

const route = useRoute<CocktailSlug>();
const controller = useCocktailsController();
const store = useCocktailsStore();

watch(
  () => route.params.slug,
  (slug) => {
    controller.getCocktails(slug as CocktailSlug);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="store.isLoadingCocktail" :class="s.loaderWrapper">
      <div :class="s.spinner" />
      Loading...
    </div>
    <ul v-else>
      <li
        v-for="cocktail in store.cocktails"
        :key="cocktail.idDrink"
        :class="s.item"
      >
        <cocktail-details :cocktail="cocktail" />
      </li>
    </ul>
  </div>
</template>

<style module="s">
.spinner {
  width: 1rem;
  height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
  border-radius: 50%;
  border: 2px solid #ccc;
  border-top-color: #333;
  animation: spin 1s linear infinite;
}

.loaderWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  min-height: 100%;
}

.item {
  list-style: none;
}

.item + .item {
  margin-top: 1rem;
  border-top: var(--border-width) solid var(--color-border);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
