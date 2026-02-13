import { World } from './World.ts'
import { EventBus } from './events/EventBus.ts'
import { GameState, GameEvent } from '../types/enums.ts'
import { FIXED_DT } from '../utils/constants.ts'
import type { System } from '../types/index.ts'

export class Game {
  readonly world = new World()
  readonly eventBus: EventBus
  private systems: System[] = []
  private state: GameState = GameState.MENU
  private accumulator = 0
  private lastTime = 0
  private rafId = 0
  private running = false

  /** 插值因子，供渲染使用 */
  alpha = 0

  /** 当前阳光数 */
  sun = 50

  /** 当前关卡 ID */
  currentLevel = 0

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus
  }

  registerSystem(system: System): void {
    this.systems.push(system)
  }

  setState(newState: GameState): void {
    this.state = newState
    this.eventBus.emit(GameEvent.STATE_CHANGED, newState)
  }

  getState(): GameState {
    return this.state
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.loop(this.lastTime)
  }

  stop(): void {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  private loop = (now: number): void => {
    if (!this.running) return

    const frameTime = Math.min((now - this.lastTime) / 1000, 0.25) // 限制最大帧时间，防止螺旋
    this.lastTime = now
    this.accumulator += frameTime

    // 固定时间步长逻辑更新
    while (this.accumulator >= FIXED_DT) {
      if (this.state === GameState.PLAYING) {
        this.update(FIXED_DT)
      }
      this.accumulator -= FIXED_DT
    }

    // 插值因子
    this.alpha = this.accumulator / FIXED_DT

    // 渲染由外部 Renderer 在此帧后调用
    this.eventBus.emit('TICK', this.alpha)

    this.rafId = requestAnimationFrame(this.loop)
  }

  private update(dt: number): void {
    for (const system of this.systems) {
      system(this.world, dt)
    }
  }

  reset(): void {
    this.world.clear()
    this.systems.length = 0
    this.sun = 50
    this.accumulator = 0
    this.alpha = 0
  }

  destroy(): void {
    this.stop()
    this.world.clear()
    this.systems.length = 0
  }
}
