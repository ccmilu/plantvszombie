import { GameState } from '../../types/enums.ts'

interface GameOverModalProps {
  gameState: GameState
  onRestart: () => void
}

export function GameOverModal({ gameState, onRestart }: GameOverModalProps) {
  if (gameState !== GameState.WON && gameState !== GameState.LOST) return null

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
          YOU WIN!
        </div>
      ) : (
        <img
          src="/images/ZombiesWon.png"
          alt="Zombies Won"
          style={{
            width: '400px',
            maxWidth: '80%',
            marginBottom: '20px',
          }}
        />
      )}

      <button
        onClick={onRestart}
        style={{
          padding: '12px 40px',
          fontSize: '20px',
          fontWeight: 'bold',
          backgroundColor: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        Play Again
      </button>
    </div>
  )
}
