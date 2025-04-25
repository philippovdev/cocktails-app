import { beforeEach, vi } from 'vitest';

export const ioInstances: Array<{
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  trigger: (entry: Partial<IntersectionObserverEntry>) => void;
}> = [];

beforeEach(() => {
  ioInstances.length = 0;

  global.IntersectionObserver = vi.fn((cb) => {
    const instance = {
      observe: vi.fn(() => {}),
      disconnect: vi.fn(),
      unobserve: vi.fn(() => {}),
      takeRecords: vi.fn(() => []),
      root: null,
      rootMargin: '0px',
      thresholds: [0],
      trigger: (entry: Partial<IntersectionObserverEntry>) => {
        cb(
          [entry as IntersectionObserverEntry],
          instance as IntersectionObserver
        );
      },
    };
    ioInstances.push(instance);
    return instance;
  });
});
