import { useState, useEffect } from 'react'
import { toggleFullscreen, isFullscreen } from '../../utils/fullscreen.ts'

const BLINK_KEYFRAMES = `
@keyframes fullscreen-hint-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
`

interface MainMenuProps {
  onPlay: () => void
}

export function MainMenu({ onPlay }: MainMenuProps) {
  const [full, setFull] = useState(isFullscreen)

  useEffect(() => {
    const onFsChange = () => setFull(isFullscreen())
    document.addEventListener('fullscreenchange', onFsChange)
    document.addEventListener('webkitfullscreenchange', onFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      document.removeEventListener('webkitfullscreenchange', onFsChange)
    }
  }, [])

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
      position: 'relative',
    }}>
      {/* Inject blink keyframes */}
      <style>{BLINK_KEYFRAMES}</style>

      {/* Fullscreen button + hint */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {!full && (
          <span
            style={{
              color: '#ff2020',
              fontSize: '18px',
              fontWeight: 'bold',
              textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
              animation: 'fullscreen-hint-blink 1.5s ease-in-out infinite',
            }}
          >
            建议全屏游玩 →
          </span>
        )}
        <button
          onClick={() => toggleFullscreen()}
          style={{
            width: '44px',
            height: '44px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: '8px',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {full ? '\u2716' : '\u26F6'}
        </button>
      </div>

      <h1 style={{
        fontSize: '56px',
        color: '#fff',
        textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
        marginBottom: '60px',
        letterSpacing: '2px',
      }}>
        植物大战僵尸
      </h1>

      <button
        onClick={onPlay}
        style={{
          backgroundImage: 'url(/images/Button.png)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'transparent',
          border: 'none',
          width: '200px',
          height: '56px',
          cursor: 'pointer',
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        冒险模式
      </button>
    </div>
  )
}
