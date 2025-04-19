<script setup lang="ts">
defineOptions({ name: 'CocktailsShow' });
import { watch } from 'vue';
import { useRoute } from 'vue-router';

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
  <div>{{ store.cocktail }}</div>
</template>
