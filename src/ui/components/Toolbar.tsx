import type { PlantType } from '../../types/enums.ts'
import { SunCounter } from './SunCounter.tsx'
import { PlantCard } from './PlantCard.tsx'

interface ToolbarProps {
  sun: number
  availablePlants: PlantType[]
  cooldowns: Record<string, number>
  selectedPlant: PlantType | null
  onSelectPlant: (plantType: PlantType) => void
}

export function Toolbar({ sun, availablePlants, cooldowns, selectedPlant, onSelectPlant }: ToolbarProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '0px',
      left: '10px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      gap: '2px',
      zIndex: 10,
      backgroundImage: 'url(/images/Shop.png)',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      padding: '0 10px',
      minWidth: '300px',
      pointerEvents: 'auto',
    }}>
      <SunCounter sun={sun} />
      {availablePlants.map(pt => (
        <PlantCard
          key={pt}
          plantType={pt}
          sun={sun}
          cooldownRatio={cooldowns[pt] ?? 0}
          selected={selectedPlant === pt}
          onSelect={onSelectPlant}
        />
      ))}
    </div>
  )
}
