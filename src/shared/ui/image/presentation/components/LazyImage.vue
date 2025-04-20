<script setup lang="ts">
import type { LazyImageProps } from '@/shared/ui/image/domain/types.ts';

import { useLazyImage } from '../../domain/useLazyImage';

defineOptions({ name: 'LazyImage' });

const props = defineProps<LazyImageProps>();
const { realSrc, imgEl, originalSrc } = useLazyImage(props.src);
</script>

<template>
  <img
    ref="imgEl"
    :src="realSrc"
    :data-src="originalSrc"
    :alt="props.alt"
    loading="lazy"
    class=""
  />
</template>
