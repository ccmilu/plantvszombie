interface ShovelButtonProps {
  active: boolean
  onToggle: () => void
}

export function ShovelButton({ active, onToggle }: ShovelButtonProps) {
  return (
    <div
      onClick={onToggle}
      style={{
        position: 'relative',
        width: '55px',
        height: '70px',
        backgroundImage: 'url(/images/ShovelBank.png)',
        backgroundSize: 'cover',
        cursor: 'pointer',
        border: active ? '2px solid #FFD700' : '2px solid transparent',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <img
        src="/images/Shovel.png"
        alt="Shovel"
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
