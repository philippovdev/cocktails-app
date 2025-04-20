import { onMounted, onUnmounted, ref } from 'vue';

export function useLazyImage(src: string) {
  const realSrc = ref<string>('');
  const imgEl = ref<HTMLImageElement | null>(null);
  let observer: IntersectionObserver;

  onMounted(() => {
    if (!imgEl.value) return;

    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        realSrc.value = src;
        observer.disconnect();
      }
    });
    observer.observe(imgEl.value);
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  return { realSrc, imgEl, originalSrc: src };
}
