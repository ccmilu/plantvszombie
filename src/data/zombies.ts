import { ZombieData, ZombieType } from '../types';

export const ZOMBIE_DATA: Record<ZombieType, ZombieData> = {
  [ZombieType.NORMAL]: {
    type: ZombieType.NORMAL,
    name: '普通僵尸',
    hp: 200,
    armor: 0,
    speed: 15,
    description: '普通的僵尸',
  },
  [ZombieType.CONEHEAD]: {
    type: ZombieType.CONEHEAD,
    name: '路障僵尸',
    hp: 200,
    armor: 370,
    speed: 15,
    description: '头戴路障的僵尸',
  },
  [ZombieType.BUCKETHEAD]: {
    type: ZombieType.BUCKETHEAD,
    name: '铁桶僵尸',
    hp: 200,
    armor: 1100,
    speed: 15,
    description: '头戴铁桶的僵尸',
  },
  [ZombieType.POLE_VAULTING]: {
    type: ZombieType.POLE_VAULTING,
    name: '撑杆僵尸',
    hp: 200,
    armor: 0,
    speed: 30,
    description: '能跳过植物的僵尸',
  },
  [ZombieType.NEWSPAPER]: {
    type: ZombieType.NEWSPAPER,
    name: '报纸僵尸',
    hp: 200,
    armor: 150,
    speed: 12,
    description: '报纸破后暴怒加速',
  },
};
