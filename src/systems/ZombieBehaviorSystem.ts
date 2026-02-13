import type { World } from '../engine/World.ts'
import { EntityType, ZombieState } from '../types/enums.ts'
import { ZOMBIE_DYING_DURATION } from '../utils/constants.ts'
import { ZOMBIE_ATTACK_ANIMS, ZOMBIE_DIE_ANIMS, ZOMBIE_WALK_ANIMS } from '../data/animations.ts'
import type { AssetKey } from '../renderer/assets/AssetMap.ts'

export function createZombieBehaviorSystem() {
  return (world: World, dt: number): void => {
    const zombies = world.byType(EntityType.ZOMBIE)
    const plants = world.byType(EntityType.PLANT)

    for (const zombie of zombies) {
      const zd = zombie.get('zombieData')
      const transform = zombie.get('transform')
      const movement = zombie.get('movement')
      const combat = zombie.get('combat')
      const anim = zombie.get('animation')
      if (!zd || !transform || !combat || !anim) continue

      // DEAD 状态，等待清理
      if (zd.state === ZombieState.DEAD) continue

      // DYING 状态，播放死亡动画后标记为 DEAD
      if (zd.state === ZombieState.DYING) {
        combat.attackTimer += dt
        if (combat.attackTimer >= ZOMBIE_DYING_DURATION) {
          zd.state = ZombieState.DEAD
          zombie.destroy()
        }
        // 停止移动
        if (movement) movement.speed = 0
        continue
      }

      // 减速计时器
      if (zd.slowTimer > 0) {
        zd.slowTimer -= dt
        if (zd.slowTimer <= 0) {
          zd.slowTimer = 0
          if (movement) movement.speed = movement.baseSpeed
        }
      }

      // 检查是否有植物在攻击范围内
      const gridPos = zombie.get('gridPosition')
      let targetPlant: typeof plants[0] | null = null

      for (const plant of plants) {
        const pt = plant.get('transform')
        const pg = plant.get('gridPosition')
        if (!pt || !pg) continue
        if (pg.row !== gridPos?.row) continue

        // 僵尸碰到植物（x距离小于阈值）
        const dx = transform.x - pt.x
        if (dx > 0 && dx < transform.width / 2 + pt.width / 2) {
          targetPlant = plant
          break
        }
      }

      if (targetPlant) {
        // 切换到攻击状态
        if (zd.state !== ZombieState.ATTACKING) {
          zd.state = ZombieState.ATTACKING
          const attackKey = ZOMBIE_ATTACK_ANIMS[zd.zombieType]
          if (anim.key !== attackKey) {
            anim.key = attackKey
            anim.frameIndex = 0
            anim.frameTimer = 0
          }
          if (movement) movement.speed = 0
        }

        // 攻击计时
        combat.attackTimer += dt
        if (combat.attackTimer >= combat.attackInterval) {
          combat.attackTimer = 0
          const ph = targetPlant.get('health')
          if (ph) {
            ph.current -= combat.damage
          }
        }
      } else {
        // 无植物可攻击 -> 恢复行走
        if (zd.state === ZombieState.ATTACKING) {
          zd.state = ZombieState.WALKING
          const walkAnims = ZOMBIE_WALK_ANIMS[zd.zombieType]
          const walkKey = walkAnims[Math.floor(Math.random() * walkAnims.length)]
          anim.key = walkKey as AssetKey
          anim.frameIndex = 0
          anim.frameTimer = 0
          if (movement) {
            movement.speed = zd.slowTimer > 0 ? movement.baseSpeed * 0.5 : movement.baseSpeed
          }
        }
      }
    }
  }
}
