<template>
  <div ref="el" :class="s.wrapper">
    <slot v-if="isVisible" />
    <spinner v-else />
  </div>
</template>

<script setup lang="ts">
import Spinner from '@/shared/ui/spinner/Spinner.vue';

import { useLazyLoad } from '../lazy/useLazyLoad';

const { el, isVisible } = useLazyLoad('0px', 0);
</script>

<style module="s">
.wrapper {
  position: relative;
  min-height: 100px;
}
</style>
