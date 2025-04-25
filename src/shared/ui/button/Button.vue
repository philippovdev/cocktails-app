<script setup lang="ts">
defineOptions({ name: 'ButtonComponent' });
defineProps<{ active?: boolean }>();
</script>

<template>
  <button v-bind="$attrs" :class="[active && s.active]">
    <slot />
  </button>
</template>

<style module="s">
button {
  padding: var(--spacing-base);
  border-radius: var(--border-radius);
  border: none;
  font-size: var(--font-size-regular);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary--active);
  cursor: pointer;
  transition:
    background-color var(--transition-duration),
    color var(--transition-duration);

  &:hover {
    background-color: var(--color-bg-primary--darken);
  }
}

.active {
  background-color: var(--color-bg-primary--active);
}
</style>
