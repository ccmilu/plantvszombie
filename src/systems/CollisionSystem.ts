import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { EntityType, ZombieState, GameEvent } from '../types/enums.ts'
import { LAWN_MOWER_SPEED, LAWN_MOWER_TRIGGER_X, DESIGN_WIDTH } from '../utils/constants.ts'

export function createCollisionSystem(game: Game) {
  return (world: World, _dt: number): void => {
    const projectiles = world.byType(EntityType.PROJECTILE)
    const zombies = world.byType(EntityType.ZOMBIE)
    const lawnMowers = world.byType(EntityType.LAWN_MOWER)

    // 子弹 vs 僵尸 (按行匹配 + AABB)
    for (const proj of projectiles) {
      if (!proj.alive) continue
      const pt = proj.get('transform')
      const pg = proj.get('gridPosition')
      const pd = proj.get('projectileData')
      if (!pt || !pg || !pd) continue

      for (const zombie of zombies) {
        if (!zombie.alive) continue
        const zt = zombie.get('transform')
        const zg = zombie.get('gridPosition')
        const zd = zombie.get('zombieData')
        if (!zt || !zg || !zd) continue
        if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue
        if (zg.row !== pg.row) continue

        // AABB 碰撞
        const overlap =
          pt.x - pt.width / 2 < zt.x + zt.width / 2 &&
          pt.x + pt.width / 2 > zt.x - zt.width / 2 &&
          pt.y - pt.height / 2 < zt.y + zt.height / 2 &&
          pt.y + pt.height / 2 > zt.y - zt.height / 2

        if (overlap) {
          // 对僵尸造成伤害
          const zh = zombie.get('health')
          if (zh) {
            if (zh.armor > 0) {
              zh.armor -= pd.damage
              if (zh.armor < 0) {
                zh.current += zh.armor // 溢出伤害扣血
                zh.armor = 0
              }
            } else {
              zh.current -= pd.damage
            }
          }

          // 冰豌豆减速效果
          if (pd.slow && pd.slowDuration > 0) {
            zd.slowTimer = pd.slowDuration
            const zm = zombie.get('movement')
            if (zm) {
              zm.speed = zm.baseSpeed * 0.5
            }
          }

          // 销毁子弹
          game.eventBus.emit(GameEvent.PROJECTILE_HIT)
          proj.destroy()
          break
        }
      }
    }

    // 割草机 vs 僵尸
    for (const mower of lawnMowers) {
      if (!mower.alive) continue
      const mt = mower.get('transform')
      const mg = mower.get('gridPosition')
      const mm = mower.get('movement')
      if (!mt || !mg) continue

      // 已激活的割草机（有 movement 组件）
      if (mm) {
        // 超出屏幕销毁
        if (mt.x > DESIGN_WIDTH + 100) {
          mower.destroy()
          continue
        }

        // 秒杀同行所有僵尸
        for (const zombie of zombies) {
          if (!zombie.alive) continue
          const zt = zombie.get('transform')
          const zg = zombie.get('gridPosition')
          const zd = zombie.get('zombieData')
          if (!zt || !zg || !zd) continue
          if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue
          if (zg.row !== mg.row) continue

          // 碰撞检测
          const overlap = Math.abs(mt.x - zt.x) < (mt.width + zt.width) / 2
          if (overlap) {
            const zh = zombie.get('health')
            if (zh) {
              zh.current = 0
              zh.armor = 0
            }
          }
        }
        continue
      }

      // 未激活的割草机：检测同行僵尸是否到达触发位置
      for (const zombie of zombies) {
        if (!zombie.alive) continue
        const zt = zombie.get('transform')
        const zg = zombie.get('gridPosition')
        const zd = zombie.get('zombieData')
        if (!zt || !zg || !zd) continue
        if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue
        if (zg.row !== mg.row) continue

        if (zt.x <= mt.x + LAWN_MOWER_TRIGGER_X) {
          // 激活割草机
          game.eventBus.emit(GameEvent.LAWN_MOWER_ACTIVATED)
          mower.add('movement', { speed: LAWN_MOWER_SPEED, baseSpeed: LAWN_MOWER_SPEED, dx: 1 })
          break
        }
      }
    }
  }
}
