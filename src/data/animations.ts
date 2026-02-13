import { PlantType, ZombieType } from '../types/enums.ts'
import type { AssetKey } from '../renderer/assets/AssetMap.ts'

/** 植物类型 -> 动画素材 key */
export const PLANT_ANIM_MAP: Record<PlantType, AssetKey> = {
  [PlantType.SUNFLOWER]: 'sunflowerAnim',
  [PlantType.PEASHOOTER]: 'peashooterAnim',
  [PlantType.WALLNUT]: 'wallnutAnim',
  [PlantType.SNOW_PEA]: 'snowpeaAnim',
  [PlantType.CHERRY_BOMB]: 'cherryBombAnim',
  [PlantType.REPEATER]: 'repeaterAnim',
  [PlantType.POTATO_MINE]: 'potatoMineAnim',
}

/** 植物类型 -> 卡面素材 key */
export const PLANT_CARD_MAP: Record<PlantType, AssetKey> = {
  [PlantType.SUNFLOWER]: 'sunflowerCard',
  [PlantType.PEASHOOTER]: 'peashooterCard',
  [PlantType.WALLNUT]: 'wallnutCard',
  [PlantType.SNOW_PEA]: 'snowpeaCard',
  [PlantType.CHERRY_BOMB]: 'cherryBombCard',
  [PlantType.REPEATER]: 'repeaterCard',
  [PlantType.POTATO_MINE]: 'potatoMineCard',
}

/** 僵尸类型 -> 行走动画 key (随机选择) */
export const ZOMBIE_WALK_ANIMS: Record<ZombieType, AssetKey[]> = {
  [ZombieType.NORMAL]: ['zombieWalk1', 'zombieWalk2'],
  [ZombieType.CONE]: ['coneZombieWalk'],
  [ZombieType.BUCKET]: ['bucketZombieWalk'],
  [ZombieType.POLE_VAULT]: ['screenZombieWalk'],
  [ZombieType.FOOTBALL]: ['footballZombieWalk'],
}

/** 僵尸类型 -> 攻击动画 key */
export const ZOMBIE_ATTACK_ANIMS: Record<ZombieType, AssetKey> = {
  [ZombieType.NORMAL]: 'zombieAttack',
  [ZombieType.CONE]: 'coneZombieAttack',
  [ZombieType.BUCKET]: 'bucketZombieAttack',
  [ZombieType.POLE_VAULT]: 'screenZombieAttack',
  [ZombieType.FOOTBALL]: 'footballZombieAttack',
}

/** 僵尸类型 -> 死亡动画 key */
export const ZOMBIE_DIE_ANIMS: Record<ZombieType, AssetKey> = {
  [ZombieType.NORMAL]: 'zombieDie',
  [ZombieType.CONE]: 'zombieDie',
  [ZombieType.BUCKET]: 'zombieDie',
  [ZombieType.POLE_VAULT]: 'zombieDie',
  [ZombieType.FOOTBALL]: 'footballZombieDie',
}
