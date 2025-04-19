<script setup lang="ts">
defineOptions({
  name: 'AppFooter',
});
const yearCurrent = new Date().getFullYear();
const yearStart = '2025';
const strYear =
  yearStart === '2025' ? yearCurrent : `${yearStart} - ${yearCurrent}`;
</script>
<template>
  <footer :class="s.footer">
    <span>💚</span>
    <span>|</span>
    © PhilippovDev {{ strYear }}
    <span>|</span>
    <span>💚</span>
  </footer>
</template>

<style module="s">
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background-color: white;
  height: var(--footer-height);
  max-width: var(--max-width);
}
</style>
