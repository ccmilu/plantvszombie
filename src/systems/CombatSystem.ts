import type { World } from '../engine/World.ts'
import { EntityType, ZombieState } from '../types/enums.ts'
import { ZOMBIE_DIE_ANIMS } from '../data/animations.ts'
import { createZombieHead } from '../ecs/factories.ts'

export function createCombatSystem() {
  return (world: World, _dt: number): void => {
    // 植物死亡
    const plants = world.byType(EntityType.PLANT)
    for (const plant of plants) {
      const health = plant.get('health')
      if (!health) continue
      if (health.current <= 0) {
        plant.destroy()
      }
    }

    // 僵尸死亡
    const zombies = world.byType(EntityType.ZOMBIE)
    for (const zombie of zombies) {
      const health = zombie.get('health')
      const zd = zombie.get('zombieData')
      const anim = zombie.get('animation')
      const transform = zombie.get('transform')
      if (!health || !zd || !anim) continue
      if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue

      if (health.current <= 0 && health.armor <= 0) {
        // 切换到 DYING 状态
        zd.state = ZombieState.DYING
        const dieKey = ZOMBIE_DIE_ANIMS[zd.zombieType]
        anim.key = dieKey
        anim.frameIndex = 0
        anim.frameTimer = 0

        // 重置攻击计时器用作死亡计时
        const combat = zombie.get('combat')
        if (combat) combat.attackTimer = 0

        // 创建头部飞出特效
        if (transform) {
          const head = createZombieHead(transform.x, transform.y)
          world.add(head)
        }
      }
    }

    // 特效实体（如僵尸头部）超时销毁
    const effects = world.byType(EntityType.EFFECT)
    for (const effect of effects) {
      const ed = effect.get('effectData')
      if (!ed) continue
      // elapsed 由 effectData 管理
      // 这里不增加 elapsed —— 由专门逻辑处理
    }
  }
}
