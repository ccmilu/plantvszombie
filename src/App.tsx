import { useState, useCallback } from 'react';
import { GameState, LevelConfig } from './types';
import { LEVELS } from './data/levels';
import { SaveManager } from './save/SaveManager';
import { useGameEngine } from './ui/hooks/useGameEngine';
import { useAudio } from './ui/hooks/useAudio';
import { MainMenu } from './ui/screens/MainMenu';
import { LevelSelect } from './ui/screens/LevelSelect';
import { PlantSelect } from './ui/screens/PlantSelect';
import { GameScreen } from './ui/screens/GameScreen';
import { PauseOverlay } from './ui/screens/PauseOverlay';
import { ResultScreen } from './ui/screens/ResultScreen';

type Screen = 'menu' | 'levelSelect' | 'plantSelect' | 'playing';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  const [unlockedLevel, setUnlockedLevel] = useState(() => SaveManager.load().unlockedLevel);

  const {
    canvasRef, game, eventBus, audio,
    sun, gameState, waveProgress,
    selectedPlant, setSelectedPlant,
    shovelActive, setShovelActive,
    startLevel, togglePause, cooldowns,
  } = useGameEngine();

  const { muted, toggleMute } = useAudio(audio);

  const handleStartGame = useCallback(() => {
    setScreen('levelSelect');
    audio.playClick();
  }, [audio]);

  const handleSelectLevel = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level) {
      setSelectedLevel(level);
      setScreen('plantSelect');
      audio.playClick();
    }
  }, [audio]);

  const handleConfirmStart = useCallback(() => {
    if (selectedLevel) {
      setScreen('playing');
      startLevel(selectedLevel);
      audio.playClick();
    }
  }, [selectedLevel, startLevel, audio]);

  const handleQuitToMenu = useCallback(() => {
    if (game) {
      game.state = GameState.MENU;
    }
    setScreen('menu');
    setSelectedLevel(null);
  }, [game]);

  const handleRetry = useCallback(() => {
    if (selectedLevel) {
      startLevel(selectedLevel);
    }
  }, [selectedLevel, startLevel]);

  const handleNextLevel = useCallback(() => {
    if (!selectedLevel) return;
    const nextId = selectedLevel.id + 1;
    const nextLevel = LEVELS.find(l => l.id === nextId);
    if (nextLevel) {
      setSelectedLevel(nextLevel);
      startLevel(nextLevel);
    } else {
      handleQuitToMenu();
    }
  }, [selectedLevel, startLevel, handleQuitToMenu]);

  // Handle win - unlock next level
  const handleWin = useCallback(() => {
    if (selectedLevel) {
      SaveManager.unlockNextLevel(selectedLevel.id);
      setUnlockedLevel(Math.max(unlockedLevel, selectedLevel.id + 1));
    }
  }, [selectedLevel, unlockedLevel]);

  // Check if we should show result
  if (gameState === GameState.WON && screen === 'playing') {
    handleWin();
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
      position: 'relative',
    }}>
      {screen === 'menu' && (
        <MainMenu onStart={handleStartGame} />
      )}

      {screen === 'levelSelect' && (
        <LevelSelect
          unlockedLevel={unlockedLevel}
          onSelect={handleSelectLevel}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'plantSelect' && selectedLevel && (
        <PlantSelect
          level={selectedLevel}
          onConfirm={handleConfirmStart}
          onBack={() => setScreen('levelSelect')}
        />
      )}

      {screen === 'playing' && selectedLevel && (
        <>
          <GameScreen
            canvasRef={canvasRef}
            sun={sun}
            availablePlants={selectedLevel.availablePlants}
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
            shovelActive={shovelActive}
            onToggleShovel={() => setShovelActive(!shovelActive)}
            waveProgress={waveProgress}
            cooldowns={cooldowns}
            onPause={togglePause}
            muted={muted}
            onToggleMute={toggleMute}
          />

          {gameState === GameState.PAUSED && (
            <PauseOverlay
              onResume={togglePause}
              onQuit={handleQuitToMenu}
            />
          )}

          {(gameState === GameState.WON || gameState === GameState.LOST) && (
            <ResultScreen
              won={gameState === GameState.WON}
              levelId={selectedLevel.id}
              onRetry={handleRetry}
              onNext={handleNextLevel}
              onMenu={handleQuitToMenu}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
