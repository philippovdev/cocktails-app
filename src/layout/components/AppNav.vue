<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { COCKTAILS } from '@/application/cocktails/types.ts';
import { MEALS } from '@/application/meals/types.ts';
import { useCommonStore } from '@/application/servingType/store.ts';
import { ROUTES } from '@/router/routes.ts';
import uppercaseFirst from '@/shared/text/uppercaseFirst.ts';
import ButtonComponent from '@/shared/ui/button/Button.vue';

const route = useRoute();
const store = useCommonStore();
const router = useRouter();

const currentDetailsRoute = computed(() => {
  return (store.servingType.value +
    'Show') as `${typeof store.servingType.value}Show`;
});

function onClick(type: 'meals' | 'cocktails') {
  store.setServingType(type);
  router.push({ name: ROUTES[type].name });
}

function onUpdateServingType(val: string) {
  return val.includes('cocktails')
    ? store.setServingType('cocktails')
    : store.setServingType('meals');
}

watch(() => route.fullPath, onUpdateServingType, { immediate: true });
</script>

<template>
  <div>
    <div :class="s.buttons">
      <button-component
        :active="store.servingType.value === 'cocktails'"
        @click="onClick('cocktails')"
      >
        Cocktails
      </button-component>
      <button-component
        :active="store.servingType.value === 'meals'"
        @click="onClick('meals')"
      >
        Meals
      </button-component>
    </div>
    <nav :class="s.nav" aria-label="Cocktail list">
      <RouterLink
        v-for="slug in store.servingType.value === 'meals' ? MEALS : COCKTAILS"
        :key="slug + '-' + store.servingType.value"
        :to="{
          name: ROUTES[currentDetailsRoute].name,
          params: { slug },
        }"
        :class="s.item"
        :title="uppercaseFirst(slug)"
      >
        {{ uppercaseFirst(slug) }}
      </RouterLink>
    </nav>
  </div>
</template>

<style module="s">
.buttons {
  padding: var(--spacing-base);
  display: flex;
  gap: var(--spacing-base);
  flex-wrap: wrap;
}

.nav {
  display: flex;
  flex-direction: column;
  padding: 0 0 30px 0;
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
  color: var(--color-text-primary--active);
  background-color: var(--color-bg-primary--active);
  border-color: var(--border-color);

  &:hover {
    color: var(--color-text-primary);
  }
}

:not(:global(.router-link-active)).item:hover {
  color: var(--color-primary);
  background-color: var(--color-bg-primary--lighten);
}
</style>
