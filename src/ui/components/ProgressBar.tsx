interface ProgressBarProps {
  currentWave: number
  totalWaves: number
}

export function ProgressBar({ currentWave, totalWaves }: ProgressBarProps) {
  if (totalWaves <= 0) return null

  const progress = Math.min(currentWave / totalWaves, 1)

  return (
    <div style={{
      position: 'absolute',
      bottom: '8px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      zIndex: 10,
      pointerEvents: 'none',
    }}>
      {/* Zombie head icon */}
      <span style={{ fontSize: '16px' }}>&#x1F9DF;</span>

      <div style={{
        width: '200px',
        height: '14px',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: '7px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.3)',
        position: 'relative',
      }}>
        {/* Fill */}
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          backgroundColor: '#4caf50',
          borderRadius: '7px',
          transition: 'width 0.5s ease',
        }} />

        {/* Wave text */}
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: '#fff',
          fontSize: '10px',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
          whiteSpace: 'nowrap',
        }}>
          第 {currentWave}/{totalWaves} 波
        </span>
      </div>

      {/* Flag icon */}
      <span style={{ fontSize: '14px' }}>&#x1F6A9;</span>
    </div>
  )
}
