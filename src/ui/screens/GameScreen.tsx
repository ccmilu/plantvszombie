import React from 'react';
import { PlantType, GameState, LevelConfig } from '../../types';
import { Toolbar } from '../components/Toolbar';

interface GameScreenProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  sun: number;
  availablePlants: PlantType[];
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

export const GameScreen: React.FC<GameScreenProps> = ({
  canvasRef, sun, availablePlants, selectedPlant, onSelectPlant,
  shovelActive, onToggleShovel, waveProgress, cooldowns,
  onPause, muted, onToggleMute,
}) => {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: selectedPlant ? 'crosshair' : shovelActive ? 'not-allowed' : 'default',
        }}
      />

      <Toolbar
        availablePlants={availablePlants}
        sun={sun}
        selectedPlant={selectedPlant}
        onSelectPlant={onSelectPlant}
        shovelActive={shovelActive}
        onToggleShovel={() => {
          onToggleShovel();
          onSelectPlant(null);
        }}
        waveProgress={waveProgress}
        cooldowns={cooldowns}
        onPause={onPause}
        muted={muted}
        onToggleMute={onToggleMute}
      />
    </div>
  );
};
