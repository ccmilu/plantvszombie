import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { EntityType, ZombieState, GameEvent } from '../types/enums.ts'
import { ZOMBIE_DIE_ANIMS } from '../data/animations.ts'
import { createZombieHead } from '../ecs/factories.ts'

export function createCombatSystem(game: Game) {
  return (world: World, _dt: number): void => {
    // 植物死亡
    const plants = world.byType(EntityType.PLANT)
    for (const plant of plants) {
      const health = plant.get('health')
      if (!health) continue
      if (health.current <= 0) {
        const gridPos = plant.get('gridPosition')
        plant.destroy()

        // 通知网格释放
        if (gridPos) {
          game.eventBus.emit(GameEvent.PLANT_REMOVED, gridPos.row, gridPos.col)
        }
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
        zd.state = ZombieState.DYING
        game.eventBus.emit(GameEvent.ZOMBIE_DIED)
        const dieKey = ZOMBIE_DIE_ANIMS[zd.zombieType]
        anim.key = dieKey
        anim.frameIndex = 0
        anim.frameTimer = 0

        const combat = zombie.get('combat')
        if (combat) combat.attackTimer = 0

        if (transform) {
          const head = createZombieHead(transform.x, transform.y)
          world.add(head)
        }
      }
    }
  }
}
