import { useState, useCallback, useEffect } from 'react'
import type { EventBus } from '../../engine/events/EventBus.ts'
import type { PlantType } from '../../types/enums.ts'
import { GameEvent } from '../../types/enums.ts'
import type { GameState } from '../../types/enums.ts'
import { Toolbar } from './Toolbar.tsx'
import { GameOverModal } from './GameOverModal.tsx'

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

  const handleSelectPlant = useCallback((plantType: PlantType) => {
    if (selectedPlant === plantType) {
      setSelectedPlant(null)
      eventBus?.emit(GameEvent.DESELECT_PLANT)
    } else {
      setSelectedPlant(plantType)
      eventBus?.emit(GameEvent.SELECT_PLANT, plantType)
    }
  }, [selectedPlant, eventBus])

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
        onSelectPlant={handleSelectPlant}
      />
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
