import { useState, useEffect } from 'react'

function isMobilePortrait(): boolean {
  return (
    'ontouchstart' in window &&
    window.innerWidth < 1024 &&
    window.innerHeight > window.innerWidth
  )
}

export function RotatePrompt() {
  const [show, setShow] = useState(isMobilePortrait)

  useEffect(() => {
    const check = () => setShow(isMobilePortrait())
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a2e',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
    }}>
      <div
        className="rotate-hint-icon"
        style={{
          fontSize: '80px',
          marginBottom: '24px',
        }}
      >
        {'\uD83D\uDCF1'}
      </div>
      <div style={{
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '12px',
      }}>
        Please Rotate Your Device
      </div>
      <div style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.7)',
      }}>
        This game is best played in landscape mode
      </div>
    </div>
  )
}
