import { useEffect, useRef, useState } from 'react'
import { Game } from '../../engine/Game.ts'
import { EventBus } from '../../engine/events/EventBus.ts'
import { Renderer } from '../../renderer/Renderer.ts'
import { loadAllAssets, type LoadedAssets } from '../../renderer/assets/AssetLoader.ts'
import { GameState } from '../../types/enums.ts'

export interface GameEngineHandle {
  game: Game
  renderer: Renderer
  eventBus: EventBus
  assets: LoadedAssets
}

export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const handleRef = useRef<GameEngineHandle | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let destroyed = false
    const eventBus = new EventBus()
    const game = new Game(eventBus)
    const renderer = new Renderer(canvas)

    // 加载素材
    loadAllAssets((loaded, total) => {
      if (!destroyed) setLoadProgress(Math.round((loaded / total) * 100))
    }).then(assets => {
      if (destroyed) return

      renderer.init(assets)
      renderer.resize()

      handleRef.current = { game, renderer, eventBus, assets }

      // 监听 TICK 事件进行渲染
      eventBus.on('TICK', () => {
        renderer.render(game.world)
      })

      // 窗口 resize
      const onResize = () => renderer.resize()
      window.addEventListener('resize', onResize)

      // 设为 PLAYING 并启动（暂时，后续会有菜单流程）
      game.setState(GameState.PLAYING)
      game.start()

      setLoading(false)

      // 保存清理函数引用
      ;(game as unknown as Record<string, unknown>).__resizeHandler = onResize
    })

    return () => {
      destroyed = true
      const onResize = (game as unknown as Record<string, unknown>).__resizeHandler as (() => void) | undefined
      if (onResize) window.removeEventListener('resize', onResize)
      game.destroy()
      renderer.destroy()
      eventBus.clear()
      handleRef.current = null
    }
  }, [canvasRef])

  return { loading, loadProgress, handleRef }
}
