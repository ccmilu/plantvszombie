export const GameState = {
  MENU: 'MENU',
  LEVEL_SELECT: 'LEVEL_SELECT',
  PLANT_SELECT: 'PLANT_SELECT',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  WON: 'WON',
  LOST: 'LOST',
} as const
export type GameState = (typeof GameState)[keyof typeof GameState]

export const EntityType = {
  PLANT: 'PLANT',
  ZOMBIE: 'ZOMBIE',
  PROJECTILE: 'PROJECTILE',
  SUN: 'SUN',
  LAWN_MOWER: 'LAWN_MOWER',
  EFFECT: 'EFFECT',
} as const
export type EntityType = (typeof EntityType)[keyof typeof EntityType]

export const PlantType = {
  SUNFLOWER: 'SUNFLOWER',
  PEASHOOTER: 'PEASHOOTER',
  WALLNUT: 'WALLNUT',
  SNOW_PEA: 'SNOW_PEA',
  CHERRY_BOMB: 'CHERRY_BOMB',
  REPEATER: 'REPEATER',
  POTATO_MINE: 'POTATO_MINE',
} as const
export type PlantType = (typeof PlantType)[keyof typeof PlantType]

export const ZombieType = {
  NORMAL: 'NORMAL',
  CONE: 'CONE',
  BUCKET: 'BUCKET',
  POLE_VAULT: 'POLE_VAULT',
  FOOTBALL: 'FOOTBALL',
} as const
export type ZombieType = (typeof ZombieType)[keyof typeof ZombieType]

export const ProjectileType = {
  PEA: 'PEA',
  SNOW_PEA: 'SNOW_PEA',
} as const
export type ProjectileType = (typeof ProjectileType)[keyof typeof ProjectileType]

export const ZombieState = {
  WALKING: 'WALKING',
  ATTACKING: 'ATTACKING',
  DYING: 'DYING',
  DEAD: 'DEAD',
} as const
export type ZombieState = (typeof ZombieState)[keyof typeof ZombieState]

export const PlantState = {
  IDLE: 'IDLE',
  ARMING: 'ARMING',
  ARMED: 'ARMED',
  EXPLODING: 'EXPLODING',
} as const
export type PlantState = (typeof PlantState)[keyof typeof PlantState]

export const GameEvent = {
  // Engine -> React
  SUN_CHANGED: 'SUN_CHANGED',
  STATE_CHANGED: 'STATE_CHANGED',
  WAVE_PROGRESS: 'WAVE_PROGRESS',
  GAME_WON: 'GAME_WON',
  GAME_LOST: 'GAME_LOST',
  PLANT_PLACED: 'PLANT_PLACED',
  PLANT_REMOVED: 'PLANT_REMOVED',
  COOLDOWN_UPDATE: 'COOLDOWN_UPDATE',

  // React -> Engine
  PLACE_PLANT: 'PLACE_PLANT',
  COLLECT_SUN: 'COLLECT_SUN',
  REMOVE_PLANT: 'REMOVE_PLANT',
  PAUSE_TOGGLED: 'PAUSE_TOGGLED',
  START_LEVEL: 'START_LEVEL',

  // Plant selection
  SELECT_PLANT: 'SELECT_PLANT',
  DESELECT_PLANT: 'DESELECT_PLANT',

  // Shovel
  TOGGLE_SHOVEL: 'TOGGLE_SHOVEL',

  // Audio events
  PROJECTILE_FIRED: 'PROJECTILE_FIRED',
  PROJECTILE_HIT: 'PROJECTILE_HIT',
  EXPLOSION: 'EXPLOSION',
  ZOMBIE_DIED: 'ZOMBIE_DIED',
  ZOMBIE_BITE: 'ZOMBIE_BITE',
  ARMOR_BREAK: 'ARMOR_BREAK',
  POLE_VAULT_JUMP: 'POLE_VAULT_JUMP',
  LAWN_MOWER_ACTIVATED: 'LAWN_MOWER_ACTIVATED',
  SUN_PRODUCED: 'SUN_PRODUCED',
  SHOVEL_USED: 'SHOVEL_USED',
  BUTTON_CLICK: 'BUTTON_CLICK',
  DRAG_START: 'DRAG_START',
} as const
export type GameEvent = (typeof GameEvent)[keyof typeof GameEvent]
