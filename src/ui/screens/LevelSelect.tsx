import { LEVELS } from '../../data/levels.ts'
import { saveManager } from '../../save/SaveManager.ts'

interface LevelSelectProps {
  onBack: () => void
  onSelectLevel: (levelId: number) => void
}

export function LevelSelect({ onBack, onSelectLevel }: LevelSelectProps) {
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundImage: 'url(/images/Background.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        fontSize: '42px',
        color: '#fff',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        marginBottom: '40px',
      }}>
        Choose a Level
      </h2>

      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '600px',
      }}>
        {LEVELS.map(level => {
          const unlocked = saveManager.isLevelUnlocked(level.id)
          const completed = saveManager.isLevelCompleted(level.id)

          return (
            <button
              key={level.id}
              onClick={() => unlocked && onSelectLevel(level.id)}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '12px',
                border: completed ? '3px solid #FFD700' : '3px solid rgba(255,255,255,0.3)',
                backgroundColor: unlocked ? 'rgba(76, 175, 80, 0.85)' : 'rgba(100, 100, 100, 0.85)',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={e => { if (unlocked) (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
            >
              {!unlocked && (
                <span style={{ fontSize: '28px' }}>&#x1F512;</span>
              )}
              <span style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
              }}>
                {level.name}
              </span>
              {completed && (
                <span style={{ fontSize: '14px', color: '#FFD700' }}>&#x2605;</span>
              )}
            </button>
          )
        })}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: '40px',
          backgroundImage: 'url(/images/Button.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'transparent',
          border: 'none',
          width: '160px',
          height: '48px',
          cursor: 'pointer',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Back
      </button>
    </div>
  )
}
