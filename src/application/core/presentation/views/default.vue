<script setup lang="ts">
defineOptions({
  name: 'LayoutDefault',
});
import AppFooter from '../components/AppFooter.vue';
import AppNav from '../components/AppNav.vue';
</script>
<template>
  <app-nav />

  <RouterView v-slot="{ Component, route }">
    <Transition name="fade-down" mode="out-in" appear>
      <component :key="route.fullPath" :is="Component" class="grow" />
    </Transition>
  </RouterView>

  <hr />

  <AppFooter />
</template>

<style>
:root {
  --transition-duration: 200ms;
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition:
    var(--transition-duration) ease-out opacity,
    var(--transition-duration) ease-out transform;
}

.fade-down-enter-from,
.fade-down-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
