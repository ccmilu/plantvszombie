import { PlantType } from '../types/enums.ts'
import { LEVELS } from '../data/levels.ts'

interface SaveData {
  unlockedLevel: number
  unlockedPlants: PlantType[]
  levelStats: Record<number, { completed: boolean }>
}

const SAVE_KEY = 'pvz_save'

const DEFAULT_SAVE: SaveData = {
  unlockedLevel: 1,
  unlockedPlants: [PlantType.SUNFLOWER, PlantType.PEASHOOTER],
  levelStats: {},
}

class SaveManager {
  private data: SaveData

  constructor() {
    this.data = this.load()
  }

  private load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as SaveData
        if (parsed.unlockedLevel && Array.isArray(parsed.unlockedPlants)) {
          return parsed
        }
      }
    } catch {
      // ignore parse errors
    }
    return { ...DEFAULT_SAVE, unlockedPlants: [...DEFAULT_SAVE.unlockedPlants], levelStats: {} }
  }

  private save(): void {
    localStorage.setItem(SAVE_KEY, JSON.stringify(this.data))
  }

  isLevelUnlocked(id: number): boolean {
    return id <= this.data.unlockedLevel
  }

  getUnlockedLevel(): number {
    return this.data.unlockedLevel
  }

  getUnlockedPlants(): PlantType[] {
    return [...this.data.unlockedPlants]
  }

  completeLevel(id: number): void {
    this.data.levelStats[id] = { completed: true }

    // Unlock next level
    if (id >= this.data.unlockedLevel && id < LEVELS.length) {
      this.data.unlockedLevel = id + 1

      // Unlock new plants from the next level
      const nextLevel = LEVELS.find(l => l.id === id + 1)
      if (nextLevel?.newPlants) {
        for (const plant of nextLevel.newPlants) {
          if (!this.data.unlockedPlants.includes(plant)) {
            this.data.unlockedPlants.push(plant)
          }
        }
      }
    }

    this.save()
  }

  isLevelCompleted(id: number): boolean {
    return this.data.levelStats[id]?.completed ?? false
  }

  resetProgress(): void {
    this.data = { ...DEFAULT_SAVE, unlockedPlants: [...DEFAULT_SAVE.unlockedPlants], levelStats: {} }
    this.save()
  }
}

export const saveManager = new SaveManager()
