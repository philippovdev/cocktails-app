<script setup lang="ts">
import { ROUTES } from '@/application/core/domain/routes.ts';

defineOptions({ name: 'CocktailsShow' });
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import Spinner from '@/shared/ui/spinner/presentation/components/Spinner.vue';

import { useCocktailsController } from '../../domain/cocktails.controller.ts';
import { COCKTAILS, type CocktailSlug } from '../../domain/types.ts';
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
    <div v-if="store.isLoadingCocktail" :class="[s.wrapper, s.loaderWrapper]">
      <spinner />
      Loading...
    </div>
    <div
      v-else-if="!store.cocktails.length"
      :class="[s.wrapper, s.emptyWrapper]"
    >
      <span>
        No cocktails found with slug:
        <code>{{ route.params.slug }}</code>
      </span>
      <div :class="s.cocktailsWrapper">
        <span>Try one of these:</span>
        <ul :class="s.slugWrapper">
          <li v-for="slug in COCKTAILS" :key="slug">
            <RouterLink
              :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }"
            >
              {{ slug }}
            </RouterLink>
          </li>
        </ul>
      </div>
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
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.emptyWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
}

.cocktailsWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-small);
}

.loaderWrapper {
  gap: var(--spacing-small);
}

.slugWrapper {
  display: flex;
  list-style: none;
  gap: var(--spacing-small);
}

.item {
  list-style: none;
}

.item + .item {
  margin-top: var(--spacing-base);
  border-top: var(--border-width) solid var(--border-color);
}
</style>
