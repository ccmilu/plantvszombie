import type { World } from '../engine/World.ts'
import { EntityType } from '../types/enums.ts'

export function createMovementSystem() {
  return (world: World, dt: number): void => {
    const entities = world.withComponents('transform', 'movement')
    for (const entity of entities) {
      const transform = entity.get('transform')!
      const movement = entity.get('movement')!

      // 阳光下落特殊处理
      if (entity.type === EntityType.SUN) {
        const sunData = entity.get('sunData')
        if (sunData) {
          if (sunData.collected) {
            // 收集飞行由 SunSystem 处理
            continue
          }
          if (sunData.fromSky && transform.y < sunData.targetY) {
            transform.y += movement.speed * dt
            if (transform.y >= sunData.targetY) {
              transform.y = sunData.targetY
            }
            continue
          }
          // 已到达目标位置，不再移动
          if (sunData.fromSky) continue
          // 植物产生的阳光不移动
          continue
        }
      }

      // 效果实体（如僵尸头部）特殊：向上飞
      if (entity.type === EntityType.EFFECT) {
        const effectData = entity.get('effectData')
        if (effectData) {
          transform.y -= movement.speed * dt
          continue
        }
      }

      // 通用移动
      transform.x += movement.speed * movement.dx * dt
    }
  }
}
