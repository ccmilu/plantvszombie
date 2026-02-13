import { PlantType, ZombieType } from '../types/enums.ts'
import type { LevelConfig } from '../types/index.ts'

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Level 1-1',
    availablePlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER],
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
]
