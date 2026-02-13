interface SunCounterProps {
  sun: number
}

export function SunCounter({ sun }: SunCounterProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '70px',
      position: 'relative',
    }}>
      <img
        src="/images/Sun.gif"
        alt="sun"
        style={{ width: '32px', height: '32px' }}
      />
      <span style={{
        color: '#000',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: '0 0 2px rgba(255,255,255,0.8)',
        marginTop: '2px',
      }}>
        {sun}
      </span>
    </div>
  )
}
