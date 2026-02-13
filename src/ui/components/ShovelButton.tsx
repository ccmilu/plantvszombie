import React from 'react';

interface ShovelButtonProps {
  active: boolean;
  onClick: () => void;
}

export const ShovelButton: React.FC<ShovelButtonProps> = ({ active, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '45px',
        height: '45px',
        border: active ? '2px solid #FFEB3B' : '2px solid rgba(255,255,255,0.3)',
        borderRadius: '6px',
        background: active ? 'rgba(244, 67, 54, 0.5)' : 'rgba(0,0,0,0.4)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        flexShrink: 0,
      }}
      title="铲子 - 移除植物"
    >
      🪏
    </div>
  );
};
