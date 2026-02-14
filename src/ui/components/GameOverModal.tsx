import { GameState } from '../../types/enums.ts'
import { LEVELS } from '../../data/levels.ts'
import { saveManager } from '../../save/SaveManager.ts'
import { useEffect, useRef } from 'react'

interface GameOverModalProps {
  gameState: GameState
  levelId: number
  onRestart: () => void
  onBackToMenu: () => void
  onNextLevel: () => void
}

export function GameOverModal({ gameState, levelId, onRestart, onBackToMenu, onNextLevel }: GameOverModalProps) {
  const savedRef = useRef(false)

  // Save progress when player wins
  useEffect(() => {
    if (gameState === GameState.WON && !savedRef.current) {
      savedRef.current = true
      saveManager.completeLevel(levelId)
    }
    if (gameState === GameState.PLAYING) {
      savedRef.current = false
    }
  }, [gameState, levelId])

  if (gameState !== GameState.WON && gameState !== GameState.LOST) return null

  const isLastLevel = levelId >= LEVELS.length

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
      zIndex: 20,
      pointerEvents: 'auto',
    }}>
      {gameState === GameState.WON ? (
        <div style={{
          fontSize: '48px',
          color: '#FFD700',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          marginBottom: '20px',
        }}>
          你赢了!
        </div>
      ) : (
        <img
          src="/images/ZombiesWon.png"
          alt="僵尸赢了"
          style={{
            width: '400px',
            maxWidth: '80%',
            marginBottom: '20px',
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {gameState === GameState.WON && !isLastLevel && (
          <button
            onClick={onNextLevel}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            下一关
          </button>
        )}

        {gameState === GameState.LOST && (
          <button
            onClick={onRestart}
            style={{
              padding: '12px 30px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#e67e22',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            再试一次
          </button>
        )}

        <button
          onClick={onBackToMenu}
          style={{
            padding: '12px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
          }}
        >
          选择关卡
        </button>
      </div>
    </div>
  )
}
