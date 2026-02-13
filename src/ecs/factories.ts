import { Entity } from '../engine/Entity.ts'
import { EntityType, PlantType, PlantState, ZombieState } from '../types/enums.ts'
import type { ZombieType } from '../types/enums.ts'
import { PLANT_CONFIGS } from '../data/plants.ts'
import { ZOMBIE_CONFIGS } from '../data/zombies.ts'
import { PLANT_ANIM_MAP, ZOMBIE_WALK_ANIMS } from '../data/animations.ts'
import { gridToWorld } from '../utils/math.ts'
import {
  PLANT_WIDTH, PLANT_HEIGHT,
  ZOMBIE_WIDTH, ZOMBIE_HEIGHT,
  PEA_WIDTH, PEA_HEIGHT, PEA_SPEED,
  SUN_WIDTH, SUN_HEIGHT, SUN_FALL_SPEED,
  LAWN_MOWER_WIDTH, LAWN_MOWER_HEIGHT, LAWN_MOWER_X,
  ZOMBIE_HEAD_WIDTH, ZOMBIE_HEAD_HEIGHT, ZOMBIE_HEAD_DURATION,
  ZOMBIE_SPAWN_X, SUN_VALUE, SUN_LIFETIME,
  DESIGN_WIDTH, DEFAULT_FRAME_DURATION,
} from '../utils/constants.ts'

export function createPlant(plantType: PlantType, row: number, col: number): Entity {
  const config = PLANT_CONFIGS[plantType]
  const { x, y } = gridToWorld(row, col)
  const animKey = PLANT_ANIM_MAP[plantType]

  const entity = new Entity(EntityType.PLANT)
  entity.add('transform', { x, y, width: PLANT_WIDTH, height: PLANT_HEIGHT })
  entity.add('gridPosition', { row, col })
  entity.add('health', { current: config.hp, max: config.hp, armor: 0, maxArmor: 0 })
  entity.add('plantData', {
    plantType,
    state: PlantState.IDLE,
    actionTimer: 0,
    actionInterval: config.attackInterval,
    cooldownKey: plantType,
  })
  entity.add('animation', {
    key: animKey,
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  return entity
}

export function createZombie(zombieType: ZombieType, row: number): Entity {
  const config = ZOMBIE_CONFIGS[zombieType]
  const { y } = gridToWorld(row, 0)
  const walkAnims = ZOMBIE_WALK_ANIMS[zombieType]
  const animKey = walkAnims[Math.floor(Math.random() * walkAnims.length)]

  const entity = new Entity(EntityType.ZOMBIE)
  entity.add('transform', { x: ZOMBIE_SPAWN_X, y, width: ZOMBIE_WIDTH, height: ZOMBIE_HEIGHT })
  entity.add('gridPosition', { row, col: 9 })
  entity.add('health', { current: config.hp, max: config.hp, armor: config.armor, maxArmor: config.armor })
  entity.add('movement', { speed: config.speed, baseSpeed: config.speed, dx: -1 })
  entity.add('combat', { damage: config.damage, attackInterval: config.attackInterval, attackTimer: 0, range: 0 })
  entity.add('zombieData', {
    zombieType,
    state: ZombieState.WALKING,
    hasJumped: false,
    slowTimer: 0,
  })
  entity.add('animation', {
    key: animKey,
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  return entity
}

export function createProjectile(x: number, y: number, row: number, damage: number): Entity {
  const entity = new Entity(EntityType.PROJECTILE)
  entity.add('transform', { x, y, width: PEA_WIDTH, height: PEA_HEIGHT })
  entity.add('gridPosition', { row, col: -1 })
  entity.add('movement', { speed: PEA_SPEED, baseSpeed: PEA_SPEED, dx: 1 })
  entity.add('projectileData', {
    projectileType: 'PEA',
    damage,
    slow: false,
    slowDuration: 0,
  })
  entity.add('animation', {
    key: 'pea',
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  return entity
}

export function createSun(x: number, y: number, fromSky: boolean, targetY?: number): Entity {
  const entity = new Entity(EntityType.SUN)
  entity.add('transform', { x, y, width: SUN_WIDTH, height: SUN_HEIGHT })
  entity.add('sunData', {
    value: SUN_VALUE,
    lifetime: SUN_LIFETIME,
    collected: false,
    fromSky,
    targetY: targetY ?? y,
  })
  entity.add('animation', {
    key: 'sun',
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  if (fromSky) {
    entity.add('movement', { speed: SUN_FALL_SPEED, baseSpeed: SUN_FALL_SPEED, dx: 0 })
  }

  return entity
}

export function createLawnMower(row: number): Entity {
  const { y } = gridToWorld(row, 0)

  const entity = new Entity(EntityType.LAWN_MOWER)
  entity.add('transform', { x: LAWN_MOWER_X, y, width: LAWN_MOWER_WIDTH, height: LAWN_MOWER_HEIGHT })
  entity.add('gridPosition', { row, col: -1 })
  entity.add('animation', {
    key: 'lawnMower',
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  return entity
}

export function createZombieHead(x: number, y: number): Entity {
  const entity = new Entity(EntityType.EFFECT)
  entity.add('transform', { x, y: y - 30, width: ZOMBIE_HEAD_WIDTH, height: ZOMBIE_HEAD_HEIGHT })
  entity.add('movement', { speed: 80, baseSpeed: 80, dx: 0 })
  entity.add('effectData', { duration: ZOMBIE_HEAD_DURATION, elapsed: 0 })
  entity.add('animation', {
    key: 'zombieHead',
    frameIndex: 0,
    frameTimer: 0,
    frameDuration: DEFAULT_FRAME_DURATION,
  })

  return entity
}

/** 获取阳光产生的位置（在植物上方偏移） */
export function createPlantSun(plantX: number, plantY: number): Entity {
  const offsetX = (Math.random() - 0.5) * 40
  const offsetY = -20
  return createSun(plantX + offsetX, plantY + offsetY, false)
}

/** 创建天空阳光 - 随机x位置，从顶部落下 */
export function createSkySun(): Entity {
  const x = 100 + Math.random() * (DESIGN_WIDTH - 200)
  const startY = -20
  const targetY = 100 + Math.random() * 400
  return createSun(x, startY, true, targetY)
}
