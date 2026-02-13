import React, { useRef, useEffect } from 'react';
import { PlantType, LevelConfig } from '../../types';
import { PLANT_DATA } from '../../data/plants';
import { drawPlantIcon } from '../../renderer/sprites/PlantSprites';

interface PlantSelectProps {
  level: LevelConfig;
  onConfirm: () => void;
  onBack: () => void;
}

const PlantPreviewCard: React.FC<{ type: PlantType }> = ({ type }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = PLANT_DATA[type];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 60, 60);
    drawPlantIcon(ctx, type, 30, 35, 45);
  }, [type]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '6px',
    }}>
      <canvas
        ref={canvasRef}
        width={60}
        height={60}
        style={{ width: '60px', height: '60px', flexShrink: 0 }}
      />
      <div>
        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{data.name}</div>
        <div style={{ fontSize: '11px', color: '#C8E6C9' }}>{data.description}</div>
        <div style={{ fontSize: '11px', color: '#FFEB3B', marginTop: '2px' }}>
          费用: {data.cost} | 冷却: {data.cooldown}s
        </div>
      </div>
    </div>
  );
};

export const PlantSelect: React.FC<PlantSelectProps> = ({ level, onConfirm, onBack }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)',
      color: '#fff',
      fontFamily: 'monospace',
      padding: '20px',
      overflow: 'auto',
    }}>
      <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>{level.name}</h2>
      <p style={{ fontSize: '13px', color: '#A5D6A7', marginBottom: '20px' }}>
        {level.waves.length} 波僵尸 | 初始阳光: {level.initialSun}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '8px',
        maxWidth: '500px',
        width: '100%',
        marginBottom: '24px',
      }}>
        {level.availablePlants.map(type => (
          <PlantPreviewCard key={type} type={type} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '10px 24px',
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          返回
        </button>
        <button
          onClick={onConfirm}
          style={{
            padding: '10px 24px',
            background: '#F44336',
            color: '#fff',
            border: '2px solid #B71C1C',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          开始!
        </button>
      </div>
    </div>
  );
};
