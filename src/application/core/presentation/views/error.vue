<script setup lang="ts">
defineOptions({
  name: 'ErrorComponent',
});
import { useRoute } from 'vue-router';

import { COCKTAILS } from '@/application/cocktails/domain/types.ts';
import { ROUTES } from '@/application/core/domain/routes.ts';

const route = useRoute();
</script>

<template>
  <p>Error 404: Page Not Found</p>

  <p v-if="!route.params.pathMatch">
    There is no
    <code>{{ route.path }}</code>
    route
  </p>
  <p>Try one of these:</p>
  <ul>
    <li v-for="slug in COCKTAILS" :key="slug">
      <RouterLink :to="{ name: ROUTES.cocktailsShow.name, params: { slug } }">
        {{ slug }}
      </RouterLink>
    </li>
  </ul>
</template>
