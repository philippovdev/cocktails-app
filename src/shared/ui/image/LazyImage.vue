<script setup lang="ts">
defineOptions({ name: 'LazyImage' });
import { useLazyImage } from './useLazyImage';

type LazyImageProps = { src: string; alt?: string };
const props = defineProps<LazyImageProps>();
const { realSrc, imgEl, originalSrc } = useLazyImage(props.src);
</script>

<template>
  <img
    v-bind="$attrs"
    ref="imgEl"
    :src="realSrc"
    :data-src="originalSrc"
    :alt="props.alt"
    loading="lazy"
    :class="s.image"
  />
</template>

<style module="s">
.image {
  max-width: 100%;
  height: auto;
}
</style>
