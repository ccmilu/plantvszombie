import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
  onQuit: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onQuit }) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 20,
      fontFamily: 'monospace',
      color: '#fff',
    }}>
      <h2 style={{ fontSize: '36px', marginBottom: '30px' }}>暂停</h2>

      <button
        onClick={onResume}
        style={{
          padding: '12px 40px',
          fontSize: '18px',
          background: '#4CAF50',
          color: '#fff',
          border: '2px solid #2E7D32',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          marginBottom: '12px',
        }}
      >
        继续
      </button>

      <button
        onClick={onQuit}
        style={{
          padding: '10px 30px',
          fontSize: '14px',
          background: 'rgba(244, 67, 54, 0.6)',
          color: '#fff',
          border: '1px solid #B71C1C',
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: 'monospace',
        }}
      >
        退出关卡
      </button>
    </div>
  );
};
