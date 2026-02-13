import { World } from './World';
import { EventBus, GameEvents } from './events/EventBus';
import { Entity } from './Entity';
import { LevelConfig, EntityType, PlantType, GameState } from '../types';
import { FIXED_TIMESTEP } from '../utils/constants';

// System function signature
export type SystemFn = (world: World, dt: number, game: Game) => void;

export class Game {
  world: World;
  eventBus: EventBus;
  systems: SystemFn[] = [];
  state: GameState = GameState.MENU;

  sun: number = 50;
  currentLevel: LevelConfig | null = null;
  waveIndex: number = 0;
  waveTimer: number = 0;
  totalZombiesSpawned: number = 0;
  totalZombiesToSpawn: number = 0;
  zombiesAlive: number = 0;

  // Sky sun
  skySunTimer: number = 10;

  // Cooldowns per plant type
  cooldowns: Map<PlantType, number> = new Map();

  // Timing
  private accumulator: number = 0;
  private lastTime: number = 0;
  private animFrameId: number = 0;
  private running: boolean = false;

  // Render callback
  private renderCallback: ((interpolation: number) => void) | null = null;

  constructor(eventBus: EventBus) {
    this.world = new World();
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on(GameEvents.PAUSE_TOGGLED, () => {
      if (this.state === GameState.PLAYING) {
        this.state = GameState.PAUSED;
        this.eventBus.emit(GameEvents.STATE_CHANGED, this.state);
      } else if (this.state === GameState.PAUSED) {
        this.state = GameState.PLAYING;
        this.lastTime = performance.now();
        this.eventBus.emit(GameEvents.STATE_CHANGED, this.state);
      }
    });
  }

  registerSystems(systems: SystemFn[]): void {
    this.systems = systems;
  }

  setRenderCallback(cb: (interpolation: number) => void): void {
    this.renderCallback = cb;
  }

  startLevel(level: LevelConfig): void {
    this.world.clear();
    this.currentLevel = level;
    this.sun = level.initialSun;
    this.waveIndex = 0;
    this.waveTimer = 0;
    this.totalZombiesSpawned = 0;
    this.skySunTimer = 10;
    this.cooldowns.clear();
    this.state = GameState.PLAYING;

    // Calculate total zombies
    this.totalZombiesToSpawn = 0;
    for (const wave of level.waves) {
      for (const zg of wave.zombies) {
        this.totalZombiesToSpawn += zg.count;
      }
    }
    this.zombiesAlive = 0;

    this.eventBus.emit(GameEvents.SUN_CHANGED, this.sun);
    this.eventBus.emit(GameEvents.STATE_CHANGED, this.state);
    this.eventBus.emit(GameEvents.WAVE_PROGRESS, 0, level.waves.length);
  }

  addSun(amount: number): void {
    this.sun += amount;
    this.eventBus.emit(GameEvents.SUN_CHANGED, this.sun);
  }

  spendSun(amount: number): boolean {
    if (this.sun >= amount) {
      this.sun -= amount;
      this.eventBus.emit(GameEvents.SUN_CHANGED, this.sun);
      return true;
    }
    return false;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;
    this.loop(this.lastTime);
  }

  stop(): void {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }

  private loop = (now: number): void => {
    if (!this.running) return;

    const frameTime = Math.min(now - this.lastTime, 250); // cap to avoid spiral
    this.lastTime = now;

    if (this.state === GameState.PLAYING) {
      this.accumulator += frameTime;

      while (this.accumulator >= FIXED_TIMESTEP) {
        this.update(FIXED_TIMESTEP / 1000); // pass dt in seconds
        this.accumulator -= FIXED_TIMESTEP;
      }
    }

    const interpolation = this.accumulator / FIXED_TIMESTEP;
    if (this.renderCallback) {
      this.renderCallback(interpolation);
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    for (const system of this.systems) {
      system(this.world, dt, this);
    }
  }

  spawnEntity(entity: Entity): Entity {
    this.world.add(entity);
    if (entity.entityType === EntityType.ZOMBIE) {
      this.zombiesAlive++;
    }
    return entity;
  }

  onZombieDied(): void {
    this.zombiesAlive--;
    this.eventBus.emit(GameEvents.ZOMBIE_KILLED);
  }

  destroy(): void {
    this.stop();
    this.eventBus.clear();
    this.world.clear();
  }
}
