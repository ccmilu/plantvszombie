import React from 'react';

interface ResultScreenProps {
  won: boolean;
  levelId: number;
  onRetry: () => void;
  onNext: () => void;
  onMenu: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  won, levelId, onRetry, onNext, onMenu,
}) => {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: won
        ? 'linear-gradient(180deg, rgba(27,94,32,0.95) 0%, rgba(56,142,60,0.95) 100%)'
        : 'linear-gradient(180deg, rgba(183,28,28,0.95) 0%, rgba(211,47,47,0.95) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 30,
      fontFamily: 'monospace',
      color: '#fff',
    }}>
      <h1 style={{
        fontSize: 'clamp(32px, 8vw, 52px)',
        marginBottom: '8px',
        textShadow: '2px 2px 0 rgba(0,0,0,0.3)',
      }}>
        {won ? '胜利!' : '失败...'}
      </h1>

      <p style={{
        fontSize: '16px',
        color: 'rgba(255,255,255,0.7)',
        marginBottom: '30px',
      }}>
        {won ? '僵尸被击退了！' : '僵尸突破了防线！'}
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={onRetry}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          再试一次
        </button>

        {won && (
          <button
            onClick={onNext}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              background: '#FFEB3B',
              color: '#333',
              border: '2px solid #F9A825',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            下一关
          </button>
        )}

        <button
          onClick={onMenu}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            background: 'rgba(0,0,0,0.3)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          返回菜单
        </button>
      </div>
    </div>
  );
};
