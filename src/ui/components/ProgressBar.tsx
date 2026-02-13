import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = total > 0 ? current / total : 0;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <span style={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
        波次 {current}/{total}
      </span>
      <div style={{
        width: '80px',
        height: '8px',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: progress >= 1 ? '#4CAF50' : '#FF9800',
          borderRadius: '4px',
          transition: 'width 0.3s',
        }} />
      </div>
    </div>
  );
};
