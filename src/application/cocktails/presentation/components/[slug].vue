<script setup lang="ts">
defineOptions({ name: 'CocktailsShow' });
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import LazyImage from '@/shared/ui/image/presentation/components/LazyImage.vue';

import { useCocktailsController } from '../../domain/cocktails.controller.ts';
import type { CocktailSlug } from '../../domain/types.ts';
import { useCocktailsStore } from '../../infrastructure/cocktails.store.ts';

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
    <div v-if="store.isLoadingCocktail">Loading...</div>
    <ul v-else>
      <li
        v-for="cocktail in store.cocktails"
        :key="cocktail.idDrink"
        style="min-height: 1000px"
      >
        <LazyImage :src="cocktail.strDrinkThumb" :alt="cocktail.strDrink" />
      </li>
    </ul>
  </div>
</template>
