import { World } from '../World';
import { Game } from '../Game';
import { Entity } from '../Entity';
import { EntityType, ZombieType } from '../../types';
import { ZOMBIE_DATA } from '../../data/zombies';
import {
  ZOMBIE_SPAWN_X, GRID_OFFSET_Y, CELL_HEIGHT,
  SUN_SPAWN_INTERVAL, SUN_VALUE_SKY, SUN_FALL_SPEED,
  GAME_WIDTH, GRID_ROWS,
} from '../../utils/constants';
import { randomInt, randomRange } from '../../utils/math';

interface ZombieSpawnTracker {
  type: ZombieType;
  count: number;
  spawned: number;
  timer: number;
  interval: number;
}

// State maintained across updates
let currentWaveSpawners: ZombieSpawnTracker[] = [];
let waveStarted = false;
let waveDelay = 0;

export function resetSpawnState(): void {
  currentWaveSpawners = [];
  waveStarted = false;
  waveDelay = 0;
}

export function SpawnSystem(world: World, dt: number, game: Game): void {
  if (!game.currentLevel) return;

  // --- Sky Sun Spawning ---
  game.skySunTimer -= dt;
  if (game.skySunTimer <= 0) {
    game.skySunTimer = SUN_SPAWN_INTERVAL;
    spawnSkySun(game);
  }

  // --- Zombie Wave Spawning ---
  const level = game.currentLevel;
  if (game.waveIndex >= level.waves.length) return;

  const wave = level.waves[game.waveIndex];

  if (!waveStarted) {
    // Initialize spawners for this wave
    currentWaveSpawners = wave.zombies.map(zg => ({
      type: zg.type,
      count: zg.count,
      spawned: 0,
      timer: zg.startDelay,
      interval: zg.interval,
    }));
    waveStarted = true;
    waveDelay = 0;
  }

  // Update spawners
  let allDone = true;
  for (const spawner of currentWaveSpawners) {
    if (spawner.spawned >= spawner.count) continue;
    allDone = false;

    spawner.timer -= dt;
    if (spawner.timer <= 0) {
      spawnZombie(game, spawner.type, spawner);
      spawner.spawned++;
      spawner.timer = spawner.interval;
    }
  }

  // Check if wave is complete (all spawned AND all dead)
  if (allDone) {
    const zombiesAlive = world.getByType(EntityType.ZOMBIE).length;
    if (zombiesAlive === 0) {
      game.waveIndex++;
      waveStarted = false;
      game.eventBus.emit('WAVE_PROGRESS', game.waveIndex, level.waves.length);
    }
  }
}

function spawnSkySun(game: Game): void {
  const x = randomRange(100, GAME_WIDTH - 100);
  const targetY = randomRange(200, 500);
  const entity = new Entity(EntityType.SUN, {
    transform: { x, y: -20, width: 40, height: 40 },
    sunValue: SUN_VALUE_SKY,
    lifetime: 8,
    fallingSpeed: SUN_FALL_SPEED,
    collectible: true,
    movement: { speed: SUN_FALL_SPEED, baseSpeed: SUN_FALL_SPEED, dx: 0, dy: 1 },
  });
  // Store target Y in a component
  (entity.components as Record<string, unknown>).targetY = targetY;
  game.spawnEntity(entity);
}

function spawnZombie(game: Game, type: ZombieType, spawner: ZombieSpawnTracker): void {
  const data = ZOMBIE_DATA[type];
  const row = randomInt(0, GRID_ROWS - 1);
  const y = GRID_OFFSET_Y + row * CELL_HEIGHT + CELL_HEIGHT / 2;

  const entity = new Entity(EntityType.ZOMBIE, {
    transform: { x: ZOMBIE_SPAWN_X, y, width: 30, height: 60 },
    gridPosition: { row, col: 9 },
    health: { current: data.hp, max: data.hp, armor: data.armor, maxArmor: data.armor },
    movement: { speed: data.speed, baseSpeed: data.speed, dx: -1, dy: 0 },
    zombieType: type,
    isEating: false,
    animTimer: Math.random() * 10,
    hasJumped: false,
    isEnraged: false,
  });

  game.spawnEntity(entity);
  game.totalZombiesSpawned++;
}
