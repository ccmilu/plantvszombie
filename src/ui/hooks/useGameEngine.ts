import { useEffect, useRef, useState } from 'react'
import { Game } from '../../engine/Game.ts'
import { EventBus } from '../../engine/events/EventBus.ts'
import { Renderer } from '../../renderer/Renderer.ts'
import { loadAllAssets, type LoadedAssets } from '../../renderer/assets/AssetLoader.ts'
import { setupLevel, type LevelHandle } from '../../systems/setupLevel.ts'
import { InputHandler } from '../../systems/InputHandler.ts'

export interface GameEngineHandle {
  game: Game
  renderer: Renderer
  eventBus: EventBus
  assets: LoadedAssets
  inputHandler: InputHandler | null
  levelHandle: LevelHandle | null
}

export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const [loading, setLoading] = useState(true)
  const [loadProgress, setLoadProgress] = useState(0)
  const [handle, setHandle] = useState<GameEngineHandle | null>(null)
  const handleRef = useRef<GameEngineHandle | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let destroyed = false
    const eventBus = new EventBus()
    const game = new Game(eventBus)
    const renderer = new Renderer(canvas)

    loadAllAssets((loaded, total) => {
      if (!destroyed) setLoadProgress(Math.round((loaded / total) * 100))
    }).then(assets => {
      if (destroyed) return

      renderer.init(assets)

      // 设置关卡
      const levelHandle = setupLevel(game, 1, assets)

      // 创建输入处理器
      const inputHandler = new InputHandler(game, renderer, canvas, levelHandle)

      const h: GameEngineHandle = { game, renderer, eventBus, assets, inputHandler, levelHandle }
      handleRef.current = h
      setHandle(h)

      // 暴露到 window 供调试/测试
      ;(window as any).__pvz = h

      eventBus.on('TICK', () => {
        renderer.ghostPlant = inputHandler.ghostPlant
        renderer.render(game.world)
      })

      game.start()
      setLoading(false)
    })

    // ResizeObserver 监听 canvas 尺寸变化
    const resizeObserver = new ResizeObserver(() => {
      renderer.resize()
    })
    resizeObserver.observe(canvas)

    return () => {
      destroyed = true
      resizeObserver.disconnect()
      if (handleRef.current?.inputHandler) {
        handleRef.current.inputHandler.destroy()
      }
      game.destroy()
      renderer.destroy()
      eventBus.clear()
      handleRef.current = null
    }
  }, [canvasRef])

  return { loading, loadProgress, handle, handleRef }
}
