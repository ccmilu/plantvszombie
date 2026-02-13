import { PlantType, ZombieType, ProjectileType, EntityType } from './enums';

export interface GridPosition {
  row: number;
  col: number;
}

export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Health {
  current: number;
  max: number;
  armor: number;
  maxArmor: number;
}

export interface Movement {
  speed: number;
  baseSpeed: number;
  dx: number;
  dy: number;
}

export interface Combat {
  damage: number;
  attackInterval: number;
  attackTimer: number;
  range: number;
}

export interface SlowEffect {
  factor: number;
  duration: number;
  timer: number;
}

export interface PlantData {
  type: PlantType;
  name: string;
  cost: number;
  cooldown: number;
  hp: number;
  description: string;
}

export interface ZombieData {
  type: ZombieType;
  name: string;
  hp: number;
  armor: number;
  speed: number;
  description: string;
}

export interface WaveConfig {
  zombies: Array<{
    type: ZombieType;
    count: number;
    startDelay: number;
    interval: number;
    row?: number;
  }>;
}

export interface LevelConfig {
  id: number;
  name: string;
  availablePlants: PlantType[];
  waves: WaveConfig[];
  initialSun: number;
}

export interface SaveData {
  unlockedLevel: number;
}

export interface ComponentMap {
  transform?: Transform;
  gridPosition?: GridPosition;
  health?: Health;
  movement?: Movement;
  combat?: Combat;
  slowEffect?: SlowEffect;
  plantType?: PlantType;
  zombieType?: ZombieType;
  projectileType?: ProjectileType;
  entityType?: EntityType;
  sunValue?: number;
  sunTimer?: number;
  cooldownTimer?: number;
  isActive?: boolean;
  isEating?: boolean;
  eatTimer?: number;
  targetEntityId?: number;
  hasJumped?: boolean;
  isEnraged?: boolean;
  animTimer?: number;
  lifetime?: number;
  chompTimer?: number;
  armedTimer?: number;
  fallingSpeed?: number;
  collectible?: boolean;
}

export * from './enums';
