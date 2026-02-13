import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { EntityType, GameEvent } from '../types/enums.ts'
import { SUN_COLLECT_TARGET_X, SUN_COLLECT_TARGET_Y, SUN_COLLECT_SPEED } from '../utils/constants.ts'

export function createSunSystem(game: Game) {
  return (world: World, dt: number): void => {
    const suns = world.byType(EntityType.SUN)

    for (const sun of suns) {
      if (!sun.alive) continue
      const sunData = sun.get('sunData')
      const transform = sun.get('transform')
      if (!sunData || !transform) continue

      if (sunData.collected) {
        // 飞向左上角计数器
        const dx = SUN_COLLECT_TARGET_X - transform.x
        const dy = SUN_COLLECT_TARGET_Y - transform.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 10) {
          // 到达目标
          game.sun += sunData.value
          game.eventBus.emit(GameEvent.SUN_CHANGED, game.sun)
          sun.destroy()
        } else {
          const speed = SUN_COLLECT_SPEED
          const nx = dx / dist
          const ny = dy / dist
          transform.x += nx * speed * dt
          transform.y += ny * speed * dt
        }
        continue
      }

      // 未收集的阳光：倒计时
      sunData.lifetime -= dt
      if (sunData.lifetime <= 0) {
        sun.destroy()
      }
    }
  }
}
