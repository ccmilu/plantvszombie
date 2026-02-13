import { useState, useCallback, useEffect } from 'react'
import { GameScreen } from './ui/screens/GameScreen.tsx'
import { MainMenu } from './ui/screens/MainMenu.tsx'
import { LevelSelect } from './ui/screens/LevelSelect.tsx'
import { AudioManager } from './audio/AudioManager.ts'
import type { PlantType } from './types/enums.ts'

type Screen =
  | { type: 'menu' }
  | { type: 'level_select' }
  | { type: 'game'; levelId: number; selectedPlants: PlantType[] }

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'menu' })

  // 首次用户交互时初始化 AudioManager（处理 autoplay 限制）
  useEffect(() => {
    let inited = false
    const initAudio = () => {
      if (inited) return
      inited = true
      AudioManager.getInstance().init()
      document.removeEventListener('click', initAudio, true)
      document.removeEventListener('touchstart', initAudio, true)
    }
    document.addEventListener('click', initAudio, true)
    document.addEventListener('touchstart', initAudio, true)
    return () => {
      document.removeEventListener('click', initAudio, true)
      document.removeEventListener('touchstart', initAudio, true)
    }
  }, [])

  // 全局按钮点击音效（capture phase，检测 button 元素）
  useEffect(() => {
    const onButtonClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button')) {
        AudioManager.getInstance().play('buttonClick')
      }
    }
    document.addEventListener('click', onButtonClick, true)
    return () => document.removeEventListener('click', onButtonClick, true)
  }, [])

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
