import type { World } from '../engine/World.ts'
import { EntityType } from '../types/enums.ts'

/** 管理特效实体的生命周期 */
export function createEffectSystem() {
  return (world: World, dt: number): void => {
    const effects = world.byType(EntityType.EFFECT)
    for (const effect of effects) {
      const ed = effect.get('effectData')
      if (!ed) continue
      ed.elapsed += dt
      if (ed.elapsed >= ed.duration) {
        effect.destroy()
      }
    }
  }
}
