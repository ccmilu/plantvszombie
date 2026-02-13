import type { EventBus } from '../../engine/events/EventBus.ts'
import type { PlantType } from '../../types/enums.ts'
import { GameEvent } from '../../types/enums.ts'
import { PLANT_CONFIGS } from '../../data/plants.ts'
import { PLANT_CARD_MAP } from '../../data/animations.ts'
import { ASSET_MAP } from '../../renderer/assets/AssetMap.ts'

interface PlantCardProps {
  plantType: PlantType
  sun: number
  cooldownRatio: number // 0 = ready, 1 = full cooldown
  selected: boolean
  onSelect: (plantType: PlantType) => void
  eventBus: EventBus | null
}

export function PlantCard({ plantType, sun, cooldownRatio, selected, onSelect, eventBus }: PlantCardProps) {
  const config = PLANT_CONFIGS[plantType]
  const cardKey = PLANT_CARD_MAP[plantType]
  const cardSrc = ASSET_MAP[cardKey]
  const affordable = sun >= config.cost
  const ready = cooldownRatio <= 0
  const canUse = affordable && ready

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!canUse || !eventBus) return
    e.preventDefault()
    onSelect(plantType)
    eventBus.emit(GameEvent.DRAG_START, plantType)
  }

  return (
    <div
      onClick={() => canUse && onSelect(plantType)}
      onTouchStart={handleTouchStart}
      style={{
        position: 'relative',
        width: '55px',
        height: '70px',
        backgroundImage: `url(/images/Card.png)`,
        backgroundSize: 'cover',
        cursor: canUse ? 'pointer' : 'not-allowed',
        opacity: canUse ? 1 : 0.6,
        border: selected ? '2px solid #FFD700' : '2px solid transparent',
        borderRadius: '4px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* 植物卡面图 */}
      <img
        src={cardSrc}
        alt={config.name}
        style={{
          width: '40px',
          height: '40px',
          objectFit: 'contain',
          position: 'absolute',
          top: '4px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      {/* 费用 */}
      <span style={{
        position: 'absolute',
        bottom: '4px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: affordable ? '#000' : '#f00',
        fontSize: '11px',
        fontWeight: 'bold',
        textShadow: '0 0 2px rgba(255,255,255,0.8)',
      }}>
        {config.cost}
      </span>

      {/* 冷却遮罩 */}
      {cooldownRatio > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: `${cooldownRatio * 100}%`,
          backgroundColor: 'rgba(0,0,0,0.5)',
          pointerEvents: 'none',
        }} />
      )}
    </div>
  )
}
