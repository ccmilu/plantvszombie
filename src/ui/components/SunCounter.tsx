import React from 'react';

interface SunCounterProps {
  sun: number;
}

export const SunCounter: React.FC<SunCounterProps> = ({ sun }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      background: 'rgba(0,0,0,0.5)',
      borderRadius: '12px',
      color: '#FFEB3B',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'monospace',
    }}>
      <span style={{ fontSize: '22px' }}>☀</span>
      <span>{sun}</span>
    </div>
  );
};
