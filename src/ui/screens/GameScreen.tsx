import { useRef, useCallback } from 'react'
import { useGameEngine } from '../hooks/useGameEngine.ts'
import { useGameState } from '../hooks/useGameState.ts'
import { useCameraTransform } from '../hooks/useCameraTransform.ts'
import { GameHUD } from '../components/GameHUD.tsx'
import { LEVELS } from '../../data/levels.ts'
import { setupLevel } from '../../systems/setupLevel.ts'
import { InputHandler } from '../../systems/InputHandler.ts'

export function GameScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { loading, loadProgress, handleRef } = useGameEngine(canvasRef)

  const eventBus = handleRef.current?.eventBus ?? null
  const renderer = handleRef.current?.renderer ?? null
  const { sun, gameState, cooldowns } = useGameState(eventBus)
  const overlayStyle = useCameraTransform(renderer)

  const availablePlants = LEVELS[0]?.availablePlants ?? []

  const handleRestart = useCallback(() => {
    const handle = handleRef.current
    if (!handle) return

    // 销毁旧的输入处理器
    handle.inputHandler?.destroy()

    // 重新设置关卡
    const levelHandle = setupLevel(handle.game, 1, handle.assets)
    const inputHandler = new InputHandler(handle.game, handle.renderer, canvasRef.current!, levelHandle)

    handle.inputHandler = inputHandler
    handle.levelHandle = levelHandle

    handle.game.start()
  }, [handleRef, canvasRef])

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          visibility: loading ? 'hidden' : 'visible',
        }}
      />

      {/* UI Overlay - 使用 camera transform 对齐 canvas */}
      {!loading && (
        <div style={overlayStyle}>
          <GameHUD
            sun={sun}
            gameState={gameState}
            cooldowns={cooldowns}
            availablePlants={availablePlants}
            eventBus={eventBus}
            onRestart={handleRestart}
          />
        </div>
      )}

      {loading && (
        <div style={{
          position: 'absolute',
          color: '#fff',
          fontSize: '24px',
          textAlign: 'center',
        }}>
          <div>Loading...</div>
          <div style={{
            width: '300px',
            height: '20px',
            backgroundColor: '#333',
            borderRadius: '10px',
            marginTop: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              borderRadius: '10px',
              transition: 'width 0.2s',
            }} />
          </div>
          <div style={{ fontSize: '16px', marginTop: '5px' }}>{loadProgress}%</div>
        </div>
      )}
    </div>
  )
}
