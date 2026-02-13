import { SaveData } from '../types';

const SAVE_KEY = 'pvz_save';

export class SaveManager {
  static load(): SaveData {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        return JSON.parse(raw) as SaveData;
      }
    } catch {
      // Ignore parse errors
    }
    return { unlockedLevel: 1 };
  }

  static save(data: SaveData): void {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  }

  static unlockNextLevel(currentLevel: number): void {
    const data = SaveManager.load();
    if (currentLevel >= data.unlockedLevel) {
      data.unlockedLevel = currentLevel + 1;
      SaveManager.save(data);
    }
  }

  static reset(): void {
    localStorage.removeItem(SAVE_KEY);
  }
}
