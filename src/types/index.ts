import type { EntityType, PlantType, ZombieType, ProjectileType, PlantState, ZombieState } from './enums.ts'

// ---------- Components ----------

export interface Transform {
  x: number
  y: number
  width: number
  height: number
}

export interface GridPosition {
  row: number
  col: number
}

export interface Health {
  current: number
  max: number
  armor: number
  maxArmor: number
}

export interface Movement {
  speed: number
  baseSpeed: number
  dx: number // direction x (-1 = left, 0 = none)
}

export interface Combat {
  damage: number
  attackInterval: number // seconds between attacks
  attackTimer: number
  range: number
}

export interface PlantData {
  plantType: PlantType
  state: PlantState
  actionTimer: number
  actionInterval: number
  cooldownKey: string
}

export interface ZombieData {
  zombieType: ZombieType
  state: ZombieState
  hasJumped: boolean // 撑杆僵尸
  slowTimer: number  // 冰冻减速剩余时间
}

export interface ProjectileData {
  projectileType: ProjectileType
  damage: number
  slow: boolean
  slowDuration: number
}

export interface SunData {
  value: number
  lifetime: number
  collected: boolean
  fromSky: boolean
  targetY: number
}

export interface EffectData {
  duration: number
  elapsed: number
}

export interface AnimationData {
  key: string           // 当前动画素材 key
  frameIndex: number
  frameTimer: number
  frameDuration: number // 每帧持续时间(秒)
}

// ---------- Component Map ----------

export interface ComponentMap {
  transform: Transform
  gridPosition: GridPosition
  health: Health
  movement: Movement
  combat: Combat
  plantData: PlantData
  zombieData: ZombieData
  projectileData: ProjectileData
  sunData: SunData
  effectData: EffectData
  animation: AnimationData
}

export type ComponentKey = keyof ComponentMap

// ---------- Entity ----------

export interface EntityConfig {
  type: EntityType
  components: Partial<ComponentMap>
}

// ---------- Static Data ----------

export interface PlantConfig {
  type: PlantType
  name: string
  cost: number
  hp: number
  cooldown: number // seconds
  attackInterval: number
  damage: number
  range: number
  description: string
}

export interface ZombieConfig {
  type: ZombieType
  name: string
  hp: number
  armor: number
  speed: number
  damage: number
  attackInterval: number
}

export interface WaveConfig {
  delay: number // 该波开始的延迟(秒)
  zombies: Array<{
    type: ZombieType
    count: number
    interval: number // 每只僵尸之间的间隔(秒)
  }>
}

export interface LevelConfig {
  id: number
  name: string
  availablePlants: PlantType[]
  waves: WaveConfig[]
  initialSun: number
}

// ---------- System ----------

export type System = (world: import('../engine/World.ts').World, dt: number) => void
