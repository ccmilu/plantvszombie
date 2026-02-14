interface PauseOverlayProps {
  onResume: () => void
  onRestart: () => void
  onBackToMenu: () => void
  muted: boolean
  onToggleMute: () => void
}

export function PauseOverlay({ onResume, onRestart, onBackToMenu, muted, onToggleMute }: PauseOverlayProps) {
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
      zIndex: 25,
      pointerEvents: 'auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        fontSize: '48px',
        color: '#fff',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        marginBottom: '30px',
      }}>
        已暂停
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={onResume}
          style={{
            padding: '12px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          继续
        </button>
        <button
          onClick={onRestart}
          style={{
            padding: '12px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#e67e22',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          重新开始
        </button>
        <button
          onClick={onToggleMute}
          style={{
            padding: '12px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: muted ? '#9b59b6' : '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          {muted ? '取消静音' : '静音'}
        </button>
        <button
          onClick={onBackToMenu}
          style={{
            padding: '12px 40px',
            fontSize: '20px',
            fontWeight: 'bold',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            minWidth: '180px',
          }}
        >
          返回菜单
        </button>
      </div>
    </div>
  )
}
