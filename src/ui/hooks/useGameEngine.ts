import { useEffect, useRef, useState, useCallback } from 'react';
import { Game } from '../../engine/Game';
import { Renderer } from '../../renderer/Renderer';
import { EventBus, GameEvents } from '../../engine/events/EventBus';
import { AudioManager } from '../../audio/AudioManager';
import { LevelConfig, PlantType, GameState } from '../../types';
import { Entity } from '../../engine/Entity';
import { EntityType } from '../../types';
import { PLANT_DATA } from '../../data/plants';
import { gridToPixel, pixelToGrid, CELL_WIDTH, CELL_HEIGHT } from '../../utils/constants';
import { resetSpawnState } from '../../engine/systems/SpawnSystem';

// Systems
import { SpawnSystem } from '../../engine/systems/SpawnSystem';
import { WaveSystem } from '../../engine/systems/WaveSystem';
import { PlantBehaviorSystem } from '../../engine/systems/PlantBehaviorSystem';
import { ZombieBehaviorSystem } from '../../engine/systems/ZombieBehaviorSystem';
import { ProjectileSystem } from '../../engine/systems/ProjectileSystem';
import { MovementSystem } from '../../engine/systems/MovementSystem';
import { CollisionSystem } from '../../engine/systems/CollisionSystem';
import { CombatSystem } from '../../engine/systems/CombatSystem';
import { SunSystem } from '../../engine/systems/SunSystem';
import { CleanupSystem } from '../../engine/systems/CleanupSystem';

interface UseGameEngineReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  game: Game | null;
  eventBus: EventBus;
  audio: AudioManager;
  sun: number;
  gameState: GameState;
  waveProgress: { current: number; total: number };
  selectedPlant: PlantType | null;
  setSelectedPlant: (p: PlantType | null) => void;
  shovelActive: boolean;
  setShovelActive: (s: boolean) => void;
  startLevel: (level: LevelConfig) => void;
  togglePause: () => void;
  cooldowns: Map<PlantType, number>;
}

export function useGameEngine(): UseGameEngineReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const eventBusRef = useRef(new EventBus());
  const audioRef = useRef(new AudioManager());

  const [sun, setSun] = useState(50);
  const [gameState, setGameState] = useState(GameState.MENU);
  const [waveProgress, setWaveProgress] = useState({ current: 0, total: 0 });
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [shovelActive, setShovelActive] = useState(false);
  const [cooldowns, setCooldowns] = useState<Map<PlantType, number>>(new Map());

  const eventBus = eventBusRef.current;
  const audio = audioRef.current;

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new Renderer(canvas);
    rendererRef.current = renderer;

    const game = new Game(eventBus);
    gameRef.current = game;

    game.registerSystems([
      SpawnSystem,
      WaveSystem,
      PlantBehaviorSystem,
      ZombieBehaviorSystem,
      ProjectileSystem,
      MovementSystem,
      CollisionSystem,
      CombatSystem,
      SunSystem,
      CleanupSystem,
    ]);

    game.setRenderCallback((interpolation) => {
      renderer.render(game.world, interpolation);
    });

    // Event listeners
    eventBus.on(GameEvents.SUN_CHANGED, (value: unknown) => {
      setSun(value as number);
    });

    eventBus.on(GameEvents.STATE_CHANGED, (state: unknown) => {
      setGameState(state as GameState);
    });

    eventBus.on(GameEvents.WAVE_PROGRESS, (current: unknown, total: unknown) => {
      setWaveProgress({ current: current as number, total: total as number });
    });

    eventBus.on(GameEvents.GAME_WON, () => {
      audio.playWin();
    });

    eventBus.on(GameEvents.GAME_LOST, () => {
      audio.playLose();
    });

    // Resize
    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        renderer.resize(rect.width, rect.height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    game.start();

    return () => {
      window.removeEventListener('resize', handleResize);
      game.destroy();
    };
  }, []);

  // Handle canvas clicks
  useEffect(() => {
    const canvas = canvasRef.current;
    const game = gameRef.current;
    const renderer = rendererRef.current;
    if (!canvas || !game || !renderer) return;

    const handleClick = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      let clientX: number, clientY: number;

      if ('touches' in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;
      const { x, y } = renderer.camera.screenToGame(screenX, screenY);

      // Try collecting sun
      const suns = game.world.getByType(EntityType.SUN);
      for (const sun of suns) {
        const t = sun.get('transform');
        if (!t) continue;
        const dx = x - t.x;
        const dy = y - t.y;
        if (dx * dx + dy * dy < 30 * 30) {
          const value = sun.get('sunValue') ?? 25;
          game.addSun(value);
          sun.destroy();
          audio.playSunCollect();
          return;
        }
      }

      // Try placing plant or using shovel
      const grid = pixelToGrid(x, y);
      if (!grid) return;

      if (shovelActive) {
        const plant = game.world.getPlantAt(grid.row, grid.col);
        if (plant) {
          plant.destroy();
          setShovelActive(false);
        }
        return;
      }

      if (selectedPlant && game.state === GameState.PLAYING) {
        const data = PLANT_DATA[selectedPlant];

        // Check if can afford
        if (game.sun < data.cost) return;

        // Check if cell is empty
        if (game.world.getPlantAt(grid.row, grid.col)) return;

        // Check cooldown
        const cd = game.cooldowns.get(selectedPlant);
        if (cd && cd > 0) return;

        // Place plant
        const pos = gridToPixel(grid.row, grid.col);
        const entity = new Entity(EntityType.PLANT, {
          transform: { x: pos.x, y: pos.y, width: CELL_WIDTH * 0.8, height: CELL_HEIGHT * 0.8 },
          gridPosition: { row: grid.row, col: grid.col },
          health: { current: data.hp, max: data.hp, armor: 0, maxArmor: 0 },
          plantType: selectedPlant,
          animTimer: 0,
          sunTimer: 24,
          cooldownTimer: 0,
          isActive: selectedPlant !== PlantType.POTATO_MINE,
          armedTimer: selectedPlant === PlantType.POTATO_MINE ? 15 : 0,
          chompTimer: 0,
        });

        game.spawnEntity(entity);
        game.spendSun(data.cost);
        game.cooldowns.set(selectedPlant, data.cooldown);
        audio.playPlant();

        setSelectedPlant(null);
        eventBus.emit(GameEvents.PLANT_PLACED, selectedPlant);
      }
    };

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleClick, { passive: false });

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [selectedPlant, shovelActive]);

  // Update cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      const game = gameRef.current;
      if (!game || game.state !== GameState.PLAYING) return;

      const dt = 0.1; // Update every 100ms
      let changed = false;
      game.cooldowns.forEach((value, key) => {
        if (value > 0) {
          game.cooldowns.set(key, Math.max(0, value - dt));
          changed = true;
        }
      });
      if (changed) {
        setCooldowns(new Map(game.cooldowns));
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const startLevel = useCallback((level: LevelConfig) => {
    const game = gameRef.current;
    if (!game) return;
    resetSpawnState();
    game.startLevel(level);
    setSelectedPlant(null);
    setShovelActive(false);
  }, []);

  const togglePause = useCallback(() => {
    eventBus.emit(GameEvents.PAUSE_TOGGLED);
  }, [eventBus]);

  return {
    canvasRef,
    game: gameRef.current,
    eventBus,
    audio,
    sun,
    gameState,
    waveProgress,
    selectedPlant,
    setSelectedPlant,
    shovelActive,
    setShovelActive,
    startLevel,
    togglePause,
    cooldowns,
  };
}
