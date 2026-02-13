import React from 'react';
import { PlantType } from '../../types';
import { PLANT_DATA } from '../../data/plants';
import { PlantCard } from './PlantCard';
import { SunCounter } from './SunCounter';
import { ShovelButton } from './ShovelButton';
import { ProgressBar } from './ProgressBar';

interface ToolbarProps {
  availablePlants: PlantType[];
  sun: number;
  selectedPlant: PlantType | null;
  onSelectPlant: (type: PlantType | null) => void;
  shovelActive: boolean;
  onToggleShovel: () => void;
  waveProgress: { current: number; total: number };
  cooldowns: Map<PlantType, number>;
  onPause: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  availablePlants, sun, selectedPlant, onSelectPlant,
  shovelActive, onToggleShovel, waveProgress, cooldowns,
  onPause, muted, onToggleMute,
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      padding: '4px 8px',
      gap: '8px',
      background: 'linear-gradient(180deg, rgba(60,40,20,0.9) 0%, rgba(60,40,20,0.7) 100%)',
      zIndex: 10,
      overflowX: 'auto',
    }}>
      <SunCounter sun={sun} />

      <div style={{ display: 'flex', gap: '4px', flex: 1, overflowX: 'auto' }}>
        {availablePlants.map(type => {
          const data = PLANT_DATA[type];
          const cd = cooldowns.get(type) ?? 0;
          const cdProgress = cd > 0 ? cd / data.cooldown : 0;

          return (
            <PlantCard
              key={type}
              type={type}
              selected={selectedPlant === type}
              disabled={false}
              cooldownProgress={cdProgress}
              sun={sun}
              onClick={() => {
                if (selectedPlant === type) {
                  onSelectPlant(null);
                } else {
                  onSelectPlant(type);
                }
              }}
            />
          );
        })}
      </div>

      <ShovelButton
        active={shovelActive}
        onClick={() => {
          onToggleShovel();
          onSelectPlant(null);
        }}
      />

      <ProgressBar current={waveProgress.current} total={waveProgress.total} />

      <button
        onClick={onToggleMute}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '4px 8px',
          flexShrink: 0,
        }}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <button
        onClick={onPause}
        style={{
          background: 'none',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '4px 8px',
          fontFamily: 'monospace',
          flexShrink: 0,
        }}
      >
        ⏸
      </button>
    </div>
  );
};
