import React from 'react';
import { LEVELS } from '../../data/levels';

interface LevelSelectProps {
  unlockedLevel: number;
  onSelect: (levelId: number) => void;
  onBack: () => void;
}

export const LevelSelect: React.FC<LevelSelectProps> = ({ unlockedLevel, onSelect, onBack }) => {
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
    }}>
      <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>选择关卡</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '16px',
        maxWidth: '600px',
        width: '100%',
      }}>
        {LEVELS.map(level => {
          const locked = level.id > unlockedLevel;
          return (
            <button
              key={level.id}
              onClick={() => !locked && onSelect(level.id)}
              disabled={locked}
              style={{
                padding: '16px',
                fontSize: '16px',
                background: locked ? 'rgba(0,0,0,0.5)' : 'rgba(76,175,80,0.6)',
                color: locked ? '#666' : '#fff',
                border: locked ? '2px solid #555' : '2px solid #81C784',
                borderRadius: '8px',
                cursor: locked ? 'not-allowed' : 'pointer',
                fontFamily: 'monospace',
                transition: 'transform 0.1s',
              }}
              onMouseEnter={e => {
                if (!locked) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>
                {locked ? '🔒' : `${level.id}`}
              </div>
              <div style={{ fontSize: '12px' }}>{level.name}</div>
              <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
                {level.waves.length} 波
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onBack}
        style={{
          marginTop: '30px',
          padding: '10px 30px',
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
    </div>
  );
};
