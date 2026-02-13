import { useRef, useState, useCallback } from 'react'
import { useGameEngine } from '../hooks/useGameEngine.ts'
import { useGameState } from '../hooks/useGameState.ts'
import { useCameraTransform } from '../hooks/useCameraTransform.ts'
import { GameHUD } from '../components/GameHUD.tsx'
import { PlantSelectOverlay } from '../components/PlantSelectOverlay.tsx'
import { LEVELS } from '../../data/levels.ts'
import { saveManager } from '../../save/SaveManager.ts'
import type { PlantType } from '../../types/enums.ts'

type GamePhase = 'plant_select' | 'playing' | 'paused' | 'result'

interface GameScreenProps {
  levelId: number
  selectedPlants: PlantType[]
  onBackToMenu: () => void
  onNextLevel: (nextLevelId: number, selectedPlants: PlantType[]) => void
}

export function GameScreen({ levelId, onBackToMenu, onNextLevel }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<GamePhase>('plant_select')
  const [activePlants, setActivePlants] = useState<PlantType[]>([])

  const { loading, loadProgress, handle, startLevel, restartLevel } = useGameEngine(canvasRef, levelId)

  const eventBus = handle?.eventBus ?? null
  const renderer = handle?.renderer ?? null
  const { sun, gameState, cooldowns, waveProgress } = useGameState(eventBus)
  const overlayStyle = useCameraTransform(renderer, canvasRef)

  const levelConfig = LEVELS.find(l => l.id === levelId)
  const levelName = levelConfig?.name ?? `Level ${levelId}`
  const unlockedPlants = saveManager.getUnlockedPlants()

  const handleStartPlaying = useCallback((selected: PlantType[]) => {
    setActivePlants(selected)
    startLevel(selected)
    setPhase('playing')
  }, [startLevel])

  const handleRestart = useCallback(() => {
    restartLevel(activePlants)
    setPhase('playing')
  }, [restartLevel, activePlants])

  const handleNextLevel = useCallback(() => {
    const nextId = levelId + 1
    if (nextId <= LEVELS.length) {
      onNextLevel(nextId, [])
    } else {
      onBackToMenu()
    }
  }, [levelId, onNextLevel, onBackToMenu])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          visibility: loading ? 'hidden' : 'visible',
        }}
      />

      {/* UI Overlay */}
      {!loading && (
        <div style={overlayStyle}>
          {phase !== 'plant_select' && (
            <GameHUD
              sun={sun}
              gameState={gameState}
              cooldowns={cooldowns}
              availablePlants={activePlants}
              eventBus={eventBus}
              waveProgress={waveProgress}
              levelId={levelId}
              onRestart={handleRestart}
              onBackToMenu={onBackToMenu}
              onNextLevel={handleNextLevel}
            />
          )}

          {phase === 'plant_select' && (
            <PlantSelectOverlay
              levelName={levelName}
              unlockedPlants={unlockedPlants}
              onStart={handleStartPlaying}
              onBack={onBackToMenu}
            />
          )}
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
