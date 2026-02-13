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

  // 追踪上一帧是否还有冷却中的植物，用于检测冷却刚归零的时刻
  let hadActive = false

  return (_world: World, dt: number): void => {
    let anyActive = false

    for (const [_key, cd] of cooldownState.cooldowns) {
      if (cd.remaining > 0) {
        cd.remaining -= dt
        if (cd.remaining < 0) cd.remaining = 0
        anyActive = true
      }
    }

    // 冷却刚归零时（hadActive → !anyActive）强制立即发送一次最终更新
    const justFinished = hadActive && !anyActive

    emitTimer += dt
    if ((emitTimer >= 0.1 && anyActive) || justFinished) {
      emitTimer = 0
      const data: Record<string, number> = {}
      for (const [key, cd] of cooldownState.cooldowns) {
        data[key] = cd.total > 0 ? cd.remaining / cd.total : 0
      }
      game.eventBus.emit(GameEvent.COOLDOWN_UPDATE, data)
    }

    hadActive = anyActive
  }
}
