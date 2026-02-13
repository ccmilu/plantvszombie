import { useState, useCallback } from 'react'
import type { PlantType } from '../../types/enums.ts'
import { PLANT_CONFIGS } from '../../data/plants.ts'
import { PLANT_CARD_MAP } from '../../data/animations.ts'
import { ASSET_MAP } from '../../renderer/assets/AssetMap.ts'

const MAX_PLANTS = 6

interface PlantSelectOverlayProps {
  levelName: string
  unlockedPlants: PlantType[]
  onStart: (selected: PlantType[]) => void
  onBack: () => void
}

export function PlantSelectOverlay({ levelName, unlockedPlants, onStart, onBack }: PlantSelectOverlayProps) {
  const [selected, setSelected] = useState<PlantType[]>([])

  const togglePlant = useCallback((pt: PlantType) => {
    setSelected(prev => {
      if (prev.includes(pt)) {
        return prev.filter(p => p !== pt)
      }
      if (prev.length >= MAX_PLANTS) return prev
      return [...prev, pt]
    })
  }, [])

  const canStart = selected.length >= 1

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 30,
      pointerEvents: 'auto',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        color: '#fff',
        fontSize: '32px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        marginBottom: '8px',
      }}>
        {levelName}
      </h2>

      <p style={{
        color: '#ccc',
        fontSize: '16px',
        marginBottom: '24px',
      }}>
        Choose your plants ({selected.length}/{MAX_PLANTS})
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        justifyContent: 'center',
        maxWidth: '500px',
        marginBottom: '30px',
      }}>
        {unlockedPlants.map(pt => {
          const config = PLANT_CONFIGS[pt]
          const cardKey = PLANT_CARD_MAP[pt]
          const cardSrc = ASSET_MAP[cardKey]
          const isSelected = selected.includes(pt)
          const isFull = selected.length >= MAX_PLANTS && !isSelected

          return (
            <div
              key={pt}
              onClick={() => !isFull && togglePlant(pt)}
              style={{
                width: '80px',
                height: '100px',
                backgroundColor: isSelected ? 'rgba(76, 175, 80, 0.9)' : 'rgba(60, 60, 60, 0.9)',
                border: isSelected ? '3px solid #FFD700' : '3px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                cursor: isFull ? 'not-allowed' : 'pointer',
                opacity: isFull ? 0.5 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                transition: 'all 0.15s',
              }}
            >
              <img
                src={cardSrc}
                alt={config.name}
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain',
                }}
              />
              <span style={{
                color: '#fff',
                fontSize: '11px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                {config.name}
              </span>
              <span style={{
                color: '#FFD700',
                fontSize: '10px',
              }}>
                {config.cost} sun
              </span>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '16px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Back
        </button>
        <button
          onClick={() => canStart && onStart(selected)}
          style={{
            padding: '10px 30px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: canStart ? '#4caf50' : '#666',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: canStart ? 'pointer' : 'not-allowed',
            opacity: canStart ? 1 : 0.5,
          }}
        >
          Start!
        </button>
      </div>
    </div>
  )
}
