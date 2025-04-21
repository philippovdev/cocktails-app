import { onMounted, onUnmounted, ref } from 'vue';

export function useLazyLoad(rootMargin = '0px', threshold = 0) {
  const el = ref<HTMLElement | null>(null);
  const isVisible = ref(false);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    if (!el.value || !('IntersectionObserver' in window)) {
      isVisible.value = true;
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer!.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el.value);
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { el, isVisible };
}
