import { useRef } from 'react'
import { useGameEngine } from '../hooks/useGameEngine.ts'
import { useCanvasResize } from '../hooks/useCanvasResize.ts'

export function GameScreen() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { loading, loadProgress } = useGameEngine(canvasRef)
  useCanvasResize(containerRef, canvasRef)

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: loading ? 'none' : 'block' }}
      />
      {loading && (
        <div style={{
          color: '#fff',
          fontSize: '24px',
          textAlign: 'center',
        }}>
          <div>Loading...</div>
          <div style={{
            width: '300px',
            height: '20px',
            backgroundColor: '#333',
            borderRadius: '10px',
            marginTop: '10px',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              borderRadius: '10px',
              transition: 'width 0.2s',
            }} />
          </div>
          <div style={{ fontSize: '16px', marginTop: '5px' }}>{loadProgress}%</div>
        </div>
      )}
    </div>
  )
}
