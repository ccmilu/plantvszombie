import { useEffect, useRef, useState, useCallback } from 'react'
import { Game } from '../../engine/Game.ts'
import { EventBus } from '../../engine/events/EventBus.ts'
import { Renderer } from '../../renderer/Renderer.ts'
import { loadAllAssets, type LoadedAssets } from '../../renderer/assets/AssetLoader.ts'
import { setupLevel, type LevelHandle } from '../../systems/setupLevel.ts'
import { InputHandler } from '../../systems/InputHandler.ts'
import type { PlantType } from '../../types/enums.ts'

export interface GameEngineHandle {
  game: Game
  renderer: Renderer
  eventBus: EventBus
  assets: LoadedAssets
  inputHandler: InputHandler | null
  levelHandle: LevelHandle | null
}

export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement | null>, levelId: number) {
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

      const h: GameEngineHandle = { game, renderer, eventBus, assets, inputHandler: null, levelHandle: null }
      handleRef.current = h
      setHandle(h)

      // Expose for debugging/testing
      ;(window as any).__pvz = h

      eventBus.on('TICK', () => {
        renderer.ghostPlant = h.inputHandler?.ghostPlant ?? null
        renderer.render(game.world)
      })

      // Start RAF loop for rendering (background), but don't start level yet
      game.start()
      setLoading(false)
    })

    // ResizeObserver to watch canvas size changes
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
      if (handleRef.current?.levelHandle) {
        handleRef.current.levelHandle.destroy()
      }
      game.destroy()
      renderer.destroy()
      eventBus.clear()
      handleRef.current = null
    }
  }, [canvasRef, levelId])

  const startLevel = useCallback((selectedPlants: PlantType[]) => {
    const h = handleRef.current
    if (!h) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Clean up previous level if any
    h.inputHandler?.destroy()
    h.levelHandle?.destroy()

    const levelHandle = setupLevel(h.game, levelId, h.assets, selectedPlants)
    const inputHandler = new InputHandler(h.game, h.renderer, canvas, levelHandle)

    h.inputHandler = inputHandler
    h.levelHandle = levelHandle
  }, [canvasRef, levelId])

  const restartLevel = useCallback((selectedPlants: PlantType[]) => {
    const h = handleRef.current
    if (!h) return
    const canvas = canvasRef.current
    if (!canvas) return

    h.inputHandler?.destroy()
    h.levelHandle?.destroy()

    const levelHandle = setupLevel(h.game, levelId, h.assets, selectedPlants)
    const inputHandler = new InputHandler(h.game, h.renderer, canvas, levelHandle)

    h.inputHandler = inputHandler
    h.levelHandle = levelHandle
  }, [canvasRef, levelId])

  return { loading, loadProgress, handle, handleRef, startLevel, restartLevel }
}
