import React, { useRef, useEffect } from 'react';
import { PlantType } from '../../types';
import { PLANT_DATA } from '../../data/plants';
import { drawPlantIcon } from '../../renderer/sprites/PlantSprites';

interface PlantCardProps {
  type: PlantType;
  selected: boolean;
  disabled: boolean;
  cooldownProgress: number; // 0~1 (0 = ready)
  sun: number;
  onClick: () => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({
  type, selected, disabled, cooldownProgress, sun, onClick,
}) => {
  const data = PLANT_DATA[type];
  const canAfford = sun >= data.cost;
  const isDisabled = disabled || !canAfford || cooldownProgress > 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 50, 50);
    drawPlantIcon(ctx, type, 25, 30, 40);
  }, [type]);

  return (
    <div
      onClick={() => !isDisabled && onClick()}
      style={{
        width: '55px',
        height: '70px',
        border: selected ? '2px solid #FFEB3B' : '2px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        background: isDisabled ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.4)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px',
        position: 'relative',
        overflow: 'hidden',
        opacity: isDisabled ? 0.6 : 1,
        transition: 'border-color 0.15s',
        flexShrink: 0,
      }}
    >
      {/* Cooldown overlay */}
      {cooldownProgress > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: `${cooldownProgress * 100}%`,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 1,
          transition: 'height 0.1s',
        }} />
      )}

      <canvas
        ref={canvasRef}
        width={50}
        height={50}
        style={{ width: '50px', height: '50px' }}
      />

      <span style={{
        fontSize: '11px',
        color: canAfford ? '#FFEB3B' : '#EF5350',
        fontWeight: 'bold',
        fontFamily: 'monospace',
      }}>
        {data.cost}
      </span>
    </div>
  );
};
