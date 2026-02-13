import { useState } from 'react'
import { GameScreen } from './ui/screens/GameScreen.tsx'

type Screen = 'menu' | 'game'

function App() {
  const [screen, setScreen] = useState<Screen>('menu')

  if (screen === 'game') {
    return <GameScreen />
  }

  // 主菜单（后续阶段完善）
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2d5a1b',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
        Plants vs Zombies
      </h1>
      <button
        onClick={() => setScreen('game')}
        style={{
          padding: '15px 40px',
          fontSize: '24px',
          backgroundColor: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        }}
      >
        Start Game
      </button>
    </div>
  )
}

export default App
