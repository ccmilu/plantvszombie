interface MainMenuProps {
  onPlay: () => void
}

export function MainMenu({ onPlay }: MainMenuProps) {
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
      <h1 style={{
        fontSize: '56px',
        color: '#fff',
        textShadow: '3px 3px 6px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
        marginBottom: '60px',
        letterSpacing: '2px',
      }}>
        Plants vs Zombies
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
        Adventure
      </button>
    </div>
  )
}
