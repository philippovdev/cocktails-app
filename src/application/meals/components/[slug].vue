<script setup lang="ts">
import MealDetails from '@/application/meals/components/Show.vue';

defineOptions({ name: 'MealsShow' });
import { watch } from 'vue';
import { useRoute } from 'vue-router';

import { ROUTES } from '@/router/routes.ts';
import Spinner from '@/shared/ui/spinner/Spinner.vue';

import { useMealsController } from '../controller.ts';
import { useMealsStore } from '../store.ts';
import { MEALS, type MealSlug } from '../types.ts';

const route = useRoute<MealSlug>();
const controller = useMealsController();
const store = useMealsStore();

watch(
  () => route.params.slug,
  (slug) => {
    controller.getMeals(slug as MealSlug);
  },
  { immediate: true }
);
</script>

<template>
  <div>
    <div v-if="store.isLoadingMeals" :class="[s.wrapper, s.loaderWrapper]">
      <spinner />
      Loading...
    </div>
    <div v-else-if="!store.meals.length" :class="[s.wrapper, s.emptyWrapper]">
      <span>
        No meals found with slug:
        <code>{{ route.params.slug }}</code>
      </span>
      <div :class="s.mealsWrapper">
        <span>Try one of these:</span>
        <ul :class="s.slugWrapper">
          <li v-for="slug in MEALS" :key="slug">
            <RouterLink :to="{ name: ROUTES.mealsShow.name, params: { slug } }">
              {{ slug }}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <ul v-else>
      <li
        v-for="(cocktail, i) in store.meals"
        :key="cocktail.idMeal"
        :class="s.item"
      >
        <meal-details :cocktail="cocktail" :is-pivot="i === 0" />
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

.mealsWrapper {
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
  border-top: var(--border-width) solid var(--border-color);
}
</style>
