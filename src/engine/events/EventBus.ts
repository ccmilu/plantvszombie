export type EventCallback = (...args: unknown[]) => void;

export class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: EventCallback): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, ...args: unknown[]): void {
    const set = this.listeners.get(event);
    if (set) {
      for (const callback of set) {
        callback(...args);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

// Event name constants
export const GameEvents = {
  // Engine → React
  SUN_CHANGED: 'SUN_CHANGED',
  STATE_CHANGED: 'STATE_CHANGED',
  WAVE_PROGRESS: 'WAVE_PROGRESS',
  GAME_WON: 'GAME_WON',
  GAME_LOST: 'GAME_LOST',
  PLANT_PLACED: 'PLANT_PLACED',
  ZOMBIE_KILLED: 'ZOMBIE_KILLED',
  COOLDOWN_UPDATE: 'COOLDOWN_UPDATE',

  // React → Engine
  PLACE_PLANT: 'PLACE_PLANT',
  COLLECT_SUN: 'COLLECT_SUN',
  PAUSE_TOGGLED: 'PAUSE_TOGGLED',
  REMOVE_PLANT: 'REMOVE_PLANT',
  START_LEVEL: 'START_LEVEL',
  CANVAS_CLICK: 'CANVAS_CLICK',
} as const;
