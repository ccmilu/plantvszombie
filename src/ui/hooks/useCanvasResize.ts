import { useEffect, RefObject } from 'react';

export function useCanvasResize(
  containerRef: RefObject<HTMLDivElement | null>,
  onResize: (width: number, height: number) => void,
): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        onResize(width, height);
      }
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [containerRef, onResize]);
}
