<script lang="ts" setup>
defineOptions({
  name: 'LayoutComponent',
});
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <main :key="route.meta.layout || 'default'">
    <component :is="route.meta.resolvedLayout" />
  </main>
</template>
