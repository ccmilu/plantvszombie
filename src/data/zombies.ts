import { ZombieType } from '../types/enums.ts'
import type { ZombieConfig } from '../types/index.ts'

export const ZOMBIE_CONFIGS: Record<ZombieType, ZombieConfig> = {
  [ZombieType.NORMAL]: {
    type: ZombieType.NORMAL,
    name: 'Zombie',
    hp: 200,
    armor: 0,
    speed: 15,
    damage: 40,
    attackInterval: 0.5,
  },
  [ZombieType.CONE]: {
    type: ZombieType.CONE,
    name: 'Conehead Zombie',
    hp: 200,
    armor: 370,
    speed: 15,
    damage: 40,
    attackInterval: 0.5,
  },
  [ZombieType.BUCKET]: {
    type: ZombieType.BUCKET,
    name: 'Buckethead Zombie',
    hp: 200,
    armor: 1100,
    speed: 15,
    damage: 40,
    attackInterval: 0.5,
  },
  [ZombieType.POLE_VAULT]: {
    type: ZombieType.POLE_VAULT,
    name: 'Pole Vaulting Zombie',
    hp: 335,
    armor: 0,
    speed: 30,
    damage: 40,
    attackInterval: 0.5,
  },
  [ZombieType.FOOTBALL]: {
    type: ZombieType.FOOTBALL,
    name: 'Football Zombie',
    hp: 200,
    armor: 1400,
    speed: 23,
    damage: 40,
    attackInterval: 0.5,
  },
}
