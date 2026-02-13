import { useState, useCallback, useEffect } from 'react'
import type { EventBus } from '../../engine/events/EventBus.ts'
import type { PlantType } from '../../types/enums.ts'
import { GameEvent, GameState } from '../../types/enums.ts'
import { Toolbar } from './Toolbar.tsx'
import { GameOverModal } from './GameOverModal.tsx'
import { PauseOverlay } from './PauseOverlay.tsx'
import { ProgressBar } from './ProgressBar.tsx'

interface GameHUDProps {
  sun: number
  gameState: GameState
  cooldowns: Record<string, number>
  availablePlants: PlantType[]
  eventBus: EventBus | null
  waveProgress: { current: number; total: number }
  levelId: number
  onRestart: () => void
  onBackToMenu: () => void
  onNextLevel: () => void
}

export function GameHUD({ sun, gameState, cooldowns, availablePlants, eventBus, onRestart, onBackToMenu, onNextLevel, levelId, waveProgress }: GameHUDProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null)
  const [shovelActive, setShovelActive] = useState(false)

  const handleSelectPlant = useCallback((plantType: PlantType) => {
    // Deactivate shovel when selecting a plant
    if (shovelActive) {
      setShovelActive(false)
      eventBus?.emit(GameEvent.TOGGLE_SHOVEL)
    }

    if (selectedPlant === plantType) {
      setSelectedPlant(null)
      eventBus?.emit(GameEvent.DESELECT_PLANT)
    } else {
      setSelectedPlant(plantType)
      eventBus?.emit(GameEvent.SELECT_PLANT, plantType)
    }
  }, [selectedPlant, shovelActive, eventBus])

  const handleToggleShovel = useCallback(() => {
    // Deselect plant when toggling shovel
    if (selectedPlant) {
      setSelectedPlant(null)
      eventBus?.emit(GameEvent.DESELECT_PLANT)
    }

    setShovelActive(prev => {
      eventBus?.emit(GameEvent.TOGGLE_SHOVEL)
      return !prev
    })
  }, [selectedPlant, eventBus])

  const handlePauseToggle = useCallback(() => {
    eventBus?.emit(GameEvent.PAUSE_TOGGLED)
  }, [eventBus])

  const handleResume = useCallback(() => {
    eventBus?.emit(GameEvent.PAUSE_TOGGLED)
  }, [eventBus])

  // Listen for Esc key to toggle pause
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        eventBus?.emit(GameEvent.PAUSE_TOGGLED)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [eventBus])

  // 监听 PLANT_PLACED 事件来清除选择
  useEffect(() => {
    if (!eventBus) return
    const onPlantPlaced = () => setSelectedPlant(null)
    eventBus.on(GameEvent.PLANT_PLACED, onPlantPlaced)
    return () => eventBus.off(GameEvent.PLANT_PLACED, onPlantPlaced)
  }, [eventBus])

  return (
    <>
      <Toolbar
        sun={sun}
        availablePlants={availablePlants}
        cooldowns={cooldowns}
        selectedPlant={selectedPlant}
        shovelActive={shovelActive}
        onSelectPlant={handleSelectPlant}
        onToggleShovel={handleToggleShovel}
      />

      {/* Pause button - top right */}
      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
        <button
          onClick={handlePauseToggle}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '8px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            pointerEvents: 'auto',
          }}
        >
          {gameState === GameState.PAUSED ? '\u25B6' : '\u275A\u275A'}
        </button>
      )}

      {gameState === GameState.PAUSED && (
        <PauseOverlay
          onResume={handleResume}
          onRestart={onRestart}
          onBackToMenu={onBackToMenu}
        />
      )}

      {/* Wave progress bar */}
      {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
        <ProgressBar
          currentWave={waveProgress.current}
          totalWaves={waveProgress.total}
        />
      )}

      <GameOverModal
        gameState={gameState}
        levelId={levelId}
        onRestart={onRestart}
        onBackToMenu={onBackToMenu}
        onNextLevel={onNextLevel}
      />
    </>
  )
}
