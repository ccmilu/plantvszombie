import { LevelConfig, PlantType, ZombieType } from '../types';

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '第一关：初识僵尸',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER],
    initialSun: 50,
    waves: [
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 2, startDelay: 15, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 3, startDelay: 5, interval: 4 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 5, interval: 3 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '第二关：路障来袭',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT, PlantType.SNOW_PEA],
    initialSun: 100,
    waves: [
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 3, startDelay: 15, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 3, startDelay: 5, interval: 4 },
          { type: ZombieType.CONEHEAD, count: 1, startDelay: 8, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 3, interval: 3 },
          { type: ZombieType.CONEHEAD, count: 2, startDelay: 5, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 3, interval: 2.5 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 5, interval: 4 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '第三关：铁桶难题',
    availablePlants: [
      PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT,
      PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE,
    ],
    initialSun: 150,
    waves: [
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 3, startDelay: 12, interval: 4 },
          { type: ZombieType.CONEHEAD, count: 1, startDelay: 15, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 3, interval: 3 },
          { type: ZombieType.CONEHEAD, count: 2, startDelay: 5, interval: 4 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 3, startDelay: 3, interval: 3 },
          { type: ZombieType.CONEHEAD, count: 2, startDelay: 5, interval: 4 },
          { type: ZombieType.BUCKETHEAD, count: 1, startDelay: 10, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 2, interval: 2.5 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.BUCKETHEAD, count: 2, startDelay: 8, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 6, startDelay: 2, interval: 2 },
          { type: ZombieType.CONEHEAD, count: 4, startDelay: 3, interval: 3 },
          { type: ZombieType.BUCKETHEAD, count: 3, startDelay: 5, interval: 4 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '第四关：跳跃高手',
    availablePlants: [
      PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT,
      PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE,
      PlantType.REPEATER,
    ],
    initialSun: 150,
    waves: [
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 12, interval: 4 },
          { type: ZombieType.CONEHEAD, count: 2, startDelay: 15, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 3, interval: 3 },
          { type: ZombieType.POLE_VAULTING, count: 2, startDelay: 5, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 2, interval: 2.5 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 4, interval: 3 },
          { type: ZombieType.POLE_VAULTING, count: 2, startDelay: 8, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 2, interval: 2 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 3, interval: 3 },
          { type: ZombieType.BUCKETHEAD, count: 2, startDelay: 8, interval: 5 },
          { type: ZombieType.POLE_VAULTING, count: 3, startDelay: 5, interval: 4 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 6, startDelay: 2, interval: 2 },
          { type: ZombieType.CONEHEAD, count: 4, startDelay: 3, interval: 2.5 },
          { type: ZombieType.BUCKETHEAD, count: 3, startDelay: 5, interval: 4 },
          { type: ZombieType.POLE_VAULTING, count: 3, startDelay: 5, interval: 3 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 8, startDelay: 1, interval: 1.5 },
          { type: ZombieType.CONEHEAD, count: 5, startDelay: 3, interval: 2 },
          { type: ZombieType.BUCKETHEAD, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.POLE_VAULTING, count: 4, startDelay: 5, interval: 3 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: '第五关：最终大战',
    availablePlants: [
      PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT,
      PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE,
      PlantType.REPEATER, PlantType.CHOMPER,
    ],
    initialSun: 200,
    waves: [
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 4, startDelay: 12, interval: 3 },
          { type: ZombieType.CONEHEAD, count: 2, startDelay: 15, interval: 4 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 3, interval: 2.5 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.NEWSPAPER, count: 2, startDelay: 8, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 5, startDelay: 2, interval: 2 },
          { type: ZombieType.CONEHEAD, count: 3, startDelay: 3, interval: 3 },
          { type: ZombieType.BUCKETHEAD, count: 2, startDelay: 8, interval: 5 },
          { type: ZombieType.NEWSPAPER, count: 2, startDelay: 6, interval: 4 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 6, startDelay: 2, interval: 2 },
          { type: ZombieType.CONEHEAD, count: 4, startDelay: 3, interval: 2.5 },
          { type: ZombieType.POLE_VAULTING, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.NEWSPAPER, count: 2, startDelay: 8, interval: 5 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 7, startDelay: 2, interval: 1.5 },
          { type: ZombieType.CONEHEAD, count: 4, startDelay: 3, interval: 2.5 },
          { type: ZombieType.BUCKETHEAD, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.POLE_VAULTING, count: 3, startDelay: 5, interval: 3 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 8, startDelay: 1, interval: 1.5 },
          { type: ZombieType.CONEHEAD, count: 5, startDelay: 2, interval: 2 },
          { type: ZombieType.BUCKETHEAD, count: 3, startDelay: 5, interval: 3 },
          { type: ZombieType.NEWSPAPER, count: 3, startDelay: 5, interval: 3 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 10, startDelay: 1, interval: 1 },
          { type: ZombieType.CONEHEAD, count: 5, startDelay: 2, interval: 2 },
          { type: ZombieType.BUCKETHEAD, count: 4, startDelay: 3, interval: 2.5 },
          { type: ZombieType.POLE_VAULTING, count: 4, startDelay: 3, interval: 2.5 },
          { type: ZombieType.NEWSPAPER, count: 3, startDelay: 5, interval: 3 },
        ],
      },
      {
        zombies: [
          { type: ZombieType.NORMAL, count: 12, startDelay: 0.5, interval: 1 },
          { type: ZombieType.CONEHEAD, count: 6, startDelay: 2, interval: 1.5 },
          { type: ZombieType.BUCKETHEAD, count: 5, startDelay: 3, interval: 2 },
          { type: ZombieType.POLE_VAULTING, count: 5, startDelay: 3, interval: 2 },
          { type: ZombieType.NEWSPAPER, count: 4, startDelay: 3, interval: 2 },
        ],
      },
    ],
  },
];
