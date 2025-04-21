<script setup lang="ts">
import { useRoute } from 'vue-router';

import { COCKTAILS } from '@/application/cocktails/domain/types.ts';
import { ROUTES } from '@/application/core/domain/routes.ts';
import AppFooter from '@/application/core/presentation/components/AppFooter.vue';

defineOptions({
  name: 'ErrorComponent',
});

const route = useRoute();
</script>

<template>
  <div :class="s.wrapper">
    <h1>Error 404: Page Not Found</h1>

    <p v-if="!route.params.pathMatch">
      There is no
      <code>{{ route.path }}</code>
      route
    </p>
    <p>Try one of these:</p>
    <ul :class="s.slugWrapper">
      <li v-for="slug in COCKTAILS" :key="slug">
        <RouterLink :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }">
          {{ slug }}
        </RouterLink>
      </li>
    </ul>

    <AppFooter />
  </div>
</template>

<style module="s">
.wrapper {
  display: flex;
  height: calc(100vh - var(--footer-height));
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  overflow: hidden;
}

.slugWrapper {
  display: flex;
  gap: var(--spacing-small);
  list-style-type: none;
}
</style>
