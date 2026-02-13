import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { GameEvent } from '../types/enums.ts'

export interface CooldownState {
  cooldowns: Map<string, { remaining: number; total: number }>
}

export function createCooldownState(): CooldownState {
  return {
    cooldowns: new Map(),
  }
}

export function createCooldownSystem(game: Game, cooldownState: CooldownState) {
  let emitTimer = 0

  return (_world: World, dt: number): void => {
    let anyChanged = false

    for (const [key, cd] of cooldownState.cooldowns) {
      if (cd.remaining > 0) {
        cd.remaining -= dt
        if (cd.remaining < 0) cd.remaining = 0
        anyChanged = true
      }
    }

    // 每0.1秒发送一次冷却更新
    emitTimer += dt
    if (emitTimer >= 0.1 && anyChanged) {
      emitTimer = 0
      const data: Record<string, number> = {}
      for (const [key, cd] of cooldownState.cooldowns) {
        data[key] = cd.total > 0 ? cd.remaining / cd.total : 0
      }
      game.eventBus.emit(GameEvent.COOLDOWN_UPDATE, data)
    }
  }
}
