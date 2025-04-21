<script setup lang="ts">
defineOptions({
  name: 'SpinnerComponent',
});
</script>
<template>
  <div :class="s.spinner" />
</template>

<style module="s">
.spinner {
  width: 1rem;
  height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  border-top-color: var(--border-color--darken);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
