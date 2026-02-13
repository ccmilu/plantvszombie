import { useEffect } from 'react'

/**
 * 监听容器尺寸变化，自动更新 canvas CSS 尺寸
 */
export function useCanvasResize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
): void {
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver(() => {
      canvas.style.width = `${container.clientWidth}px`
      canvas.style.height = `${container.clientHeight}px`
    })

    observer.observe(container)

    // 初始化尺寸
    canvas.style.width = `${container.clientWidth}px`
    canvas.style.height = `${container.clientHeight}px`

    return () => observer.disconnect()
  }, [containerRef, canvasRef])
}
