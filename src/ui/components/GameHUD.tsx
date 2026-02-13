import { useState, useCallback } from 'react'
import type { EventBus } from '../../engine/events/EventBus.ts'
import type { PlantType } from '../../types/enums.ts'
import { GameEvent, GameState } from '../../types/enums.ts'
import { Toolbar } from './Toolbar.tsx'
import { GameOverModal } from './GameOverModal.tsx'

interface GameHUDProps {
  sun: number
  gameState: GameState
  cooldowns: Record<string, number>
  availablePlants: PlantType[]
  eventBus: EventBus | null
  onRestart: () => void
}

export function GameHUD({ sun, gameState, cooldowns, availablePlants, eventBus, onRestart }: GameHUDProps) {
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null)

  const handleSelectPlant = useCallback((plantType: PlantType) => {
    if (selectedPlant === plantType) {
      // 取消选择
      setSelectedPlant(null)
      eventBus?.emit(GameEvent.DESELECT_PLANT)
    } else {
      setSelectedPlant(plantType)
      eventBus?.emit(GameEvent.SELECT_PLANT, plantType)
    }
  }, [selectedPlant, eventBus])

  // 放置植物后自动取消选择
  const handlePlantPlaced = useCallback(() => {
    setSelectedPlant(null)
  }, [])

  // 监听 PLANT_PLACED 事件来清除选择
  if (eventBus) {
    // 使用简单方式，不重复注册 —— GameHUD 层面在每次 render 不会重复
  }

  return (
    <>
      <Toolbar
        sun={sun}
        availablePlants={availablePlants}
        cooldowns={cooldowns}
        selectedPlant={selectedPlant}
        onSelectPlant={handleSelectPlant}
      />
      <GameOverModal gameState={gameState} onRestart={onRestart} />
    </>
  )
}
