import { useState, useEffect } from 'react'
import type { Renderer } from '../../renderer/Renderer.ts'

export function useCameraTransform(
  renderer: Renderer | null,
  canvasRef?: React.RefObject<HTMLCanvasElement | null>,
): React.CSSProperties {
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (!renderer) return

    const update = () => {
      const cam = renderer.camera
      const dpr = window.devicePixelRatio || 1
      setStyle({
        position: 'absolute',
        left: 0,
        top: 0,
        width: '900px',
        height: '600px',
        transformOrigin: '0 0',
        transform: `translate(${cam.offsetX / dpr}px, ${cam.offsetY / dpr}px) scale(${cam.scale / dpr})`,
        pointerEvents: 'none',
      })
    }

    // 初始计算
    update()

    // 监听 canvas 尺寸变化
    const canvas = canvasRef?.current ?? document.querySelector('canvas')
    let observer: ResizeObserver | null = null
    if (canvas) {
      observer = new ResizeObserver(() => {
        // 延迟一帧确保 renderer.resize() 已执行
        requestAnimationFrame(update)
      })
      observer.observe(canvas)
    }

    return () => {
      observer?.disconnect()
    }
  }, [renderer, canvasRef])

  return style
}
