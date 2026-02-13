import type { World } from '../engine/World.ts'
import { EntityType } from '../types/enums.ts'
import { DESIGN_WIDTH } from '../utils/constants.ts'

export function createProjectileSystem() {
  return (world: World, _dt: number): void => {
    const projectiles = world.byType(EntityType.PROJECTILE)
    for (const proj of projectiles) {
      const transform = proj.get('transform')
      if (!transform) continue

      // 出界销毁
      if (transform.x > DESIGN_WIDTH + 50 || transform.x < -50) {
        proj.destroy()
      }
    }
  }
}
