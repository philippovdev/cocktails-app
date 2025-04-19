<script setup lang="ts">
defineOptions({
  name: 'AppNav',
});
import { COCKTAILS } from '@/application/cocktails/domain/types.ts';

import { ROUTES } from '../../domain/routes.ts';
</script>

<template>
  <nav :class="s.nav">
    <RouterLink
      v-for="slug in COCKTAILS"
      :key="slug"
      :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }"
    >
      {{ slug }}
    </RouterLink>
  </nav>
</template>

<style module="s">
.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
