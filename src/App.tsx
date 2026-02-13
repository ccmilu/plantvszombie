import { useState, useCallback } from 'react'
import { GameScreen } from './ui/screens/GameScreen.tsx'
import { MainMenu } from './ui/screens/MainMenu.tsx'
import { LevelSelect } from './ui/screens/LevelSelect.tsx'
import type { PlantType } from './types/enums.ts'

type Screen =
  | { type: 'menu' }
  | { type: 'level_select' }
  | { type: 'game'; levelId: number; selectedPlants: PlantType[] }

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'menu' })

  const goToMenu = useCallback(() => setScreen({ type: 'menu' }), [])
  const goToLevelSelect = useCallback(() => setScreen({ type: 'level_select' }), [])

  const startGame = useCallback((levelId: number, selectedPlants: PlantType[]) => {
    setScreen({ type: 'game', levelId, selectedPlants })
  }, [])

  if (screen.type === 'game') {
    return (
      <GameScreen
        levelId={screen.levelId}
        selectedPlants={screen.selectedPlants}
        onBackToMenu={goToLevelSelect}
        onNextLevel={(nextLevelId, selectedPlants) => {
          startGame(nextLevelId, selectedPlants)
        }}
      />
    )
  }

  if (screen.type === 'level_select') {
    return (
      <LevelSelect
        onBack={goToMenu}
        onSelectLevel={(levelId) => {
          // Go to game screen - plant selection happens inside GameScreen
          startGame(levelId, [])
        }}
      />
    )
  }

  return <MainMenu onPlay={goToLevelSelect} />
}

export default App
