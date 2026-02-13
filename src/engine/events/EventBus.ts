type Callback = (...args: unknown[]) => void

export class EventBus {
  private listeners = new Map<string, Set<Callback>>()

  on(event: string, callback: Callback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: Callback): void {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach(cb => cb(...args))
  }

  clear(): void {
    this.listeners.clear()
  }
}

// 全局单例
export const eventBus = new EventBus()
