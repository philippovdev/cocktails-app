<script setup lang="ts">
defineOptions({
  name: 'LayoutDefault',
});
import AppFooter from '../components/AppFooter.vue';
import AppNav from '../components/AppNav.vue';
</script>
<template>
  <div :class="s.wrapper">
    <div :class="s.navWrapper">
      <app-nav :class="s.navInner" />
    </div>

    <RouterView v-slot="{ Component, route }">
      <Transition name="fade-down" mode="out-in" appear>
        <component :key="route.fullPath" :is="Component" :class="s.content" />
      </Transition>
    </RouterView>
  </div>

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

<style module="s">
.wrapper {
  display: flex;
  min-height: calc(100vh - var(--footer-height));
  border: var(--border-width) solid var(--border-color);
  margin: calc(-1 * var(--border-width)) 0;
}

.navWrapper {
  width: 35%;
  max-width: 35%;
  border-right: var(--border-width) solid var(--border-color);
}

.navInner {
  position: sticky;
  top: 0;
}

.content {
  width: 65%;
  max-width: 65%;
}
</style>
