import { useState, useCallback, useEffect } from 'react'
import { GameScreen } from './ui/screens/GameScreen.tsx'
import { MainMenu } from './ui/screens/MainMenu.tsx'
import { LevelSelect } from './ui/screens/LevelSelect.tsx'
import { AudioManager } from './audio/AudioManager.ts'
import { RotatePrompt } from './ui/components/RotatePrompt.tsx'
import type { PlantType } from './types/enums.ts'

// 尽早实例化 AudioManager，触发 BGM 预加载（不播放，仅缓冲）
const audioManager = AudioManager.getInstance()

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
      audioManager.init()
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

  let content
  if (screen.type === 'game') {
    content = (
      <GameScreen
        levelId={screen.levelId}
        selectedPlants={screen.selectedPlants}
        onBackToMenu={goToLevelSelect}
        onNextLevel={(nextLevelId, selectedPlants) => {
          startGame(nextLevelId, selectedPlants)
        }}
      />
    )
  } else if (screen.type === 'level_select') {
    content = (
      <LevelSelect
        onBack={goToMenu}
        onSelectLevel={(levelId) => {
          // Go to game screen - plant selection happens inside GameScreen
          startGame(levelId, [])
        }}
      />
    )
  } else {
    content = <MainMenu onPlay={goToLevelSelect} />
  }

  return (
    <>
      {content}
      <RotatePrompt />
    </>
  )
}

export default App
