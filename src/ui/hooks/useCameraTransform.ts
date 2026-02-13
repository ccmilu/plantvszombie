import { useState, useEffect } from 'react'
import type { Renderer } from '../../renderer/Renderer.ts'

export function useCameraTransform(renderer: Renderer | null) {
  const [style, setStyle] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (!renderer) return

    const update = () => {
      const cam = renderer.camera
      setStyle({
        position: 'absolute' as const,
        left: 0,
        top: 0,
        width: '900px',
        height: '600px',
        transformOrigin: '0 0',
        transform: `translate(${cam.offsetX / (window.devicePixelRatio || 1)}px, ${cam.offsetY / (window.devicePixelRatio || 1)}px) scale(${cam.scale / (window.devicePixelRatio || 1)})`,
        pointerEvents: 'none' as const,
      })
    }

    update()
    // 监听 resize
    const observer = new ResizeObserver(update)
    const canvas = renderer.camera.canvasWidth > 0 ? document.querySelector('canvas') : null
    if (canvas) observer.observe(canvas)

    return () => {
      observer.disconnect()
    }
  }, [renderer])

  return style
}
