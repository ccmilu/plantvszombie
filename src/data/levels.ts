import { PlantType, ZombieType } from '../types/enums.ts'
import type { LevelConfig } from '../types/index.ts'

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: '第1-1关',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER],
    newPlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER],
    initialSun: 50,
    waves: [
      {
        delay: 20,
        zombies: [
          { type: ZombieType.NORMAL, count: 3, interval: 8 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 5, interval: 6 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 8, interval: 4 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: '第1-2关',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT, PlantType.SNOW_PEA],
    newPlants: [PlantType.WALLNUT, PlantType.SNOW_PEA],
    initialSun: 100,
    waves: [
      {
        delay: 20,
        zombies: [
          { type: ZombieType.NORMAL, count: 3, interval: 8 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 4, interval: 6 },
          { type: ZombieType.CONE, count: 2, interval: 8 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 5, interval: 5 },
          { type: ZombieType.CONE, count: 3, interval: 6 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 6, interval: 4 },
          { type: ZombieType.CONE, count: 4, interval: 5 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: '第1-3关',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT, PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE],
    newPlants: [PlantType.CHERRY_BOMB, PlantType.POTATO_MINE],
    initialSun: 150,
    waves: [
      {
        delay: 18,
        zombies: [
          { type: ZombieType.NORMAL, count: 4, interval: 7 },
          { type: ZombieType.CONE, count: 2, interval: 8 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 5, interval: 5 },
          { type: ZombieType.CONE, count: 3, interval: 6 },
          { type: ZombieType.BUCKET, count: 1, interval: 10 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 6, interval: 4 },
          { type: ZombieType.CONE, count: 4, interval: 5 },
          { type: ZombieType.BUCKET, count: 2, interval: 8 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 8, interval: 3 },
          { type: ZombieType.CONE, count: 5, interval: 4 },
          { type: ZombieType.BUCKET, count: 3, interval: 6 },
        ],
      },
      {
        delay: 6,
        zombies: [
          { type: ZombieType.NORMAL, count: 10, interval: 3 },
          { type: ZombieType.BUCKET, count: 4, interval: 5 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: '第1-4关',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT, PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE, PlantType.REPEATER],
    newPlants: [PlantType.REPEATER],
    initialSun: 200,
    waves: [
      {
        delay: 15,
        zombies: [
          { type: ZombieType.NORMAL, count: 5, interval: 6 },
          { type: ZombieType.CONE, count: 3, interval: 7 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 6, interval: 5 },
          { type: ZombieType.CONE, count: 4, interval: 5 },
          { type: ZombieType.POLE_VAULT, count: 2, interval: 10 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 5, interval: 4 },
          { type: ZombieType.BUCKET, count: 3, interval: 6 },
          { type: ZombieType.POLE_VAULT, count: 3, interval: 7 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 8, interval: 3 },
          { type: ZombieType.CONE, count: 5, interval: 4 },
          { type: ZombieType.BUCKET, count: 3, interval: 5 },
          { type: ZombieType.POLE_VAULT, count: 3, interval: 6 },
        ],
      },
      {
        delay: 6,
        zombies: [
          { type: ZombieType.NORMAL, count: 10, interval: 2 },
          { type: ZombieType.CONE, count: 6, interval: 3 },
          { type: ZombieType.BUCKET, count: 4, interval: 5 },
          { type: ZombieType.POLE_VAULT, count: 4, interval: 5 },
        ],
      },
      {
        delay: 5,
        zombies: [
          { type: ZombieType.NORMAL, count: 12, interval: 2 },
          { type: ZombieType.BUCKET, count: 5, interval: 4 },
          { type: ZombieType.POLE_VAULT, count: 5, interval: 4 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: '第1-5关',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER, PlantType.WALLNUT, PlantType.SNOW_PEA, PlantType.CHERRY_BOMB, PlantType.POTATO_MINE, PlantType.REPEATER],
    newPlants: [],
    initialSun: 250,
    waves: [
      {
        delay: 15,
        zombies: [
          { type: ZombieType.NORMAL, count: 6, interval: 5 },
          { type: ZombieType.CONE, count: 4, interval: 6 },
        ],
      },
      {
        delay: 10,
        zombies: [
          { type: ZombieType.NORMAL, count: 8, interval: 4 },
          { type: ZombieType.CONE, count: 5, interval: 5 },
          { type: ZombieType.BUCKET, count: 2, interval: 8 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 6, interval: 4 },
          { type: ZombieType.BUCKET, count: 3, interval: 6 },
          { type: ZombieType.POLE_VAULT, count: 3, interval: 7 },
          { type: ZombieType.FOOTBALL, count: 1, interval: 12 },
        ],
      },
      {
        delay: 8,
        zombies: [
          { type: ZombieType.NORMAL, count: 8, interval: 3 },
          { type: ZombieType.CONE, count: 5, interval: 4 },
          { type: ZombieType.BUCKET, count: 4, interval: 5 },
          { type: ZombieType.FOOTBALL, count: 2, interval: 8 },
        ],
      },
      {
        delay: 6,
        zombies: [
          { type: ZombieType.NORMAL, count: 10, interval: 2 },
          { type: ZombieType.CONE, count: 6, interval: 3 },
          { type: ZombieType.BUCKET, count: 4, interval: 4 },
          { type: ZombieType.POLE_VAULT, count: 4, interval: 5 },
          { type: ZombieType.FOOTBALL, count: 2, interval: 7 },
        ],
      },
      {
        delay: 6,
        zombies: [
          { type: ZombieType.NORMAL, count: 12, interval: 2 },
          { type: ZombieType.BUCKET, count: 5, interval: 4 },
          { type: ZombieType.FOOTBALL, count: 3, interval: 6 },
        ],
      },
      {
        delay: 5,
        zombies: [
          { type: ZombieType.NORMAL, count: 15, interval: 1.5 },
          { type: ZombieType.CONE, count: 8, interval: 2 },
          { type: ZombieType.BUCKET, count: 5, interval: 3 },
          { type: ZombieType.POLE_VAULT, count: 4, interval: 4 },
          { type: ZombieType.FOOTBALL, count: 3, interval: 5 },
        ],
      },
      {
        delay: 3,
        zombies: [
          { type: ZombieType.NORMAL, count: 20, interval: 1 },
          { type: ZombieType.CONE, count: 10, interval: 1.5 },
          { type: ZombieType.BUCKET, count: 6, interval: 3 },
          { type: ZombieType.FOOTBALL, count: 5, interval: 4 },
        ],
      },
    ],
  },
]
