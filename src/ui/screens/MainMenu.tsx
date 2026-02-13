import React from 'react';

interface MainMenuProps {
  onStart: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: 'linear-gradient(180deg, #1B5E20 0%, #388E3C 50%, #4CAF50 100%)',
      color: '#fff',
      fontFamily: 'monospace',
    }}>
      <h1 style={{
        fontSize: 'clamp(28px, 6vw, 56px)',
        textShadow: '3px 3px 0 #1B5E20, -1px -1px 0 #000',
        marginBottom: '8px',
        textAlign: 'center',
      }}>
        植物大战僵尸
      </h1>

      <p style={{
        fontSize: 'clamp(12px, 2vw, 18px)',
        color: '#C8E6C9',
        marginBottom: '40px',
      }}>
        Plants vs. Zombies
      </p>

      {/* Simple pixel art scene */}
      <div style={{
        width: '200px',
        height: '100px',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '40px',
          height: '60px',
          background: '#FFEB3B',
          borderRadius: '50% 50% 0 0',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '15px',
            width: '10px',
            height: '20px',
            background: '#4CAF50',
          }} />
        </div>
        <div style={{
          fontSize: '48px',
          lineHeight: 1,
        }}>
          vs
        </div>
        <div style={{
          width: '35px',
          height: '55px',
          background: '#78909C',
          borderRadius: '50% 50% 5px 5px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '5px',
            width: '8px',
            height: '8px',
            background: '#D32F2F',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '5px',
            width: '8px',
            height: '8px',
            background: '#D32F2F',
            borderRadius: '50%',
          }} />
        </div>
      </div>

      <button
        onClick={onStart}
        style={{
          padding: '14px 48px',
          fontSize: '22px',
          background: '#F44336',
          color: '#fff',
          border: '3px solid #B71C1C',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '1px 1px 0 #B71C1C',
          transition: 'transform 0.1s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        开始游戏
      </button>
    </div>
  );
};
