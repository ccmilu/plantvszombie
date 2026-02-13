import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { EntityType, PlantType, PlantState, ZombieState, GameEvent } from '../types/enums.ts'
import { createProjectile, createPlantSun, createSnowProjectile, createExplosionEffect } from '../ecs/factories.ts'
import { DESIGN_WIDTH, CELL_WIDTH, CELL_HEIGHT, POTATO_MINE_ARM_TIME, CHERRY_BOMB_DELAY, REPEATER_SECOND_PEA_DELAY } from '../utils/constants.ts'

export function createPlantBehaviorSystem(game: Game) {
  // 双发射手第二颗子弹的待发射队列: { timer, x, y, row, damage }
  const pendingPeas: Array<{ timer: number; x: number; y: number; row: number; damage: number }> = []

  return (world: World, dt: number): void => {
    const plants = world.byType(EntityType.PLANT)
    const zombies = world.byType(EntityType.ZOMBIE)

    // 处理待发射的第二颗豌豆（双发射手）
    for (let i = pendingPeas.length - 1; i >= 0; i--) {
      const pp = pendingPeas[i]
      pp.timer -= dt
      if (pp.timer <= 0) {
        const pea = createProjectile(pp.x, pp.y, pp.row, pp.damage)
        world.add(pea)
        pendingPeas.splice(i, 1)
      }
    }

    for (const plant of plants) {
      const plantData = plant.get('plantData')
      const transform = plant.get('transform')
      const gridPos = plant.get('gridPosition')
      const health = plant.get('health')
      const anim = plant.get('animation')
      if (!plantData || !transform || !gridPos) continue

      plantData.actionTimer += dt

      switch (plantData.plantType) {
        case PlantType.SUNFLOWER: {
          // 向日葵：每 actionInterval 秒产阳光
          if (plantData.actionTimer >= plantData.actionInterval) {
            plantData.actionTimer = 0
            const sun = createPlantSun(transform.x, transform.y)
            world.add(sun)
            game.eventBus.emit(GameEvent.SUN_PRODUCED)
          }
          break
        }

        case PlantType.PEASHOOTER: {
          // 豌豆射手：同行有活僵尸才射击
          if (plantData.actionTimer >= plantData.actionInterval) {
            const hasZombieInRow = hasZombieAhead(zombies, gridPos.row, transform.x)
            if (hasZombieInRow) {
              plantData.actionTimer = 0
              const pea = createProjectile(
                transform.x + transform.width / 2,
                transform.y,
                gridPos.row,
                20,
              )
              world.add(pea)
              game.eventBus.emit(GameEvent.PROJECTILE_FIRED)
            }
          }
          break
        }

        case PlantType.WALLNUT: {
          // 坚果墙：纯肉盾，根据血量切换破损动画
          if (health && anim) {
            const hpRatio = health.current / health.max
            if (hpRatio > 0.67) {
              if (anim.key !== 'wallnutAnim') {
                anim.key = 'wallnutAnim'
                anim.frameIndex = 0
                anim.frameTimer = 0
              }
            } else if (hpRatio > 0.33) {
              if (anim.key !== 'wallnut1Anim') {
                anim.key = 'wallnut1Anim'
                anim.frameIndex = 0
                anim.frameTimer = 0
              }
            } else {
              if (anim.key !== 'wallnut2Anim') {
                anim.key = 'wallnut2Anim'
                anim.frameIndex = 0
                anim.frameTimer = 0
              }
            }
          }
          break
        }

        case PlantType.SNOW_PEA: {
          // 寒冰射手：同行有活僵尸才射击，发射冰豌豆
          if (plantData.actionTimer >= plantData.actionInterval) {
            const hasZombieInRow = hasZombieAhead(zombies, gridPos.row, transform.x)
            if (hasZombieInRow) {
              plantData.actionTimer = 0
              const snowPea = createSnowProjectile(
                transform.x + transform.width / 2,
                transform.y,
                gridPos.row,
                20,
              )
              world.add(snowPea)
              game.eventBus.emit(GameEvent.PROJECTILE_FIRED)
            }
          }
          break
        }

        case PlantType.CHERRY_BOMB: {
          // 樱桃炸弹：放置后短暂延迟引爆，3x3 范围 1800 伤害
          if (plantData.state === PlantState.IDLE) {
            // 进入引爆倒计时
            plantData.state = PlantState.EXPLODING
            plantData.actionTimer = 0
          }

          if (plantData.state === PlantState.EXPLODING) {
            if (plantData.actionTimer >= CHERRY_BOMB_DELAY) {
              // 爆炸！对 3x3 范围内的僵尸造成伤害
              for (const zombie of zombies) {
                const zt = zombie.get('transform')
                const zd = zombie.get('zombieData')
                if (!zt || !zd) continue
                if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue

                // 3x3 范围：中心植物格子 ± 1 行 ± 1 列的世界范围
                const dx = Math.abs(zt.x - transform.x)
                const dy = Math.abs(zt.y - transform.y)
                if (dx < CELL_WIDTH * 1.5 && dy < CELL_HEIGHT * 1.5) {
                  const zh = zombie.get('health')
                  if (zh) {
                    zh.armor = 0
                    zh.current -= 1800
                  }
                }
              }

              // 创建爆炸特效
              const effect = createExplosionEffect(transform.x, transform.y, 'boom')
              world.add(effect)
              game.eventBus.emit(GameEvent.EXPLOSION)

              // 释放网格并自毁
              game.eventBus.emit(GameEvent.PLANT_REMOVED, gridPos.row, gridPos.col)
              plant.destroy()
            }
          }
          break
        }

        case PlantType.REPEATER: {
          // 双发射手：每次发射 2 颗豌豆
          if (plantData.actionTimer >= plantData.actionInterval) {
            const hasZombieInRow = hasZombieAhead(zombies, gridPos.row, transform.x)
            if (hasZombieInRow) {
              plantData.actionTimer = 0
              // 第一颗豌豆立即发射
              const pea1 = createProjectile(
                transform.x + transform.width / 2,
                transform.y,
                gridPos.row,
                20,
              )
              world.add(pea1)
              game.eventBus.emit(GameEvent.PROJECTILE_FIRED)

              // 第二颗豌豆延迟发射
              pendingPeas.push({
                timer: REPEATER_SECOND_PEA_DELAY,
                x: transform.x + transform.width / 2,
                y: transform.y,
                row: gridPos.row,
                damage: 20,
              })
            }
          }
          break
        }

        case PlantType.POTATO_MINE: {
          // 土豆地雷：15秒激活，触碰后爆炸
          if (plantData.state === PlantState.IDLE) {
            // 开始准备阶段
            plantData.state = PlantState.ARMING
            plantData.actionTimer = 0
            // 设置未激活动画
            if (anim) {
              anim.key = 'potatoMine1Anim'
              anim.frameIndex = 0
              anim.frameTimer = 0
            }
          }

          if (plantData.state === PlantState.ARMING) {
            if (plantData.actionTimer >= POTATO_MINE_ARM_TIME) {
              plantData.state = PlantState.ARMED
              // 切换到激活动画
              if (anim) {
                anim.key = 'potatoMineAnim'
                anim.frameIndex = 0
                anim.frameTimer = 0
              }
            }
          }

          if (plantData.state === PlantState.ARMED) {
            // 检测是否有僵尸踩上来
            for (const zombie of zombies) {
              const zt = zombie.get('transform')
              const zg = zombie.get('gridPosition')
              const zd = zombie.get('zombieData')
              if (!zt || !zg || !zd) continue
              if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) continue
              if (zg.row !== gridPos.row) continue

              const dx = Math.abs(zt.x - transform.x)
              if (dx < (transform.width + zt.width) / 2) {
                // 爆炸！对踩上来的僵尸及附近僵尸造成伤害
                for (const z2 of zombies) {
                  const z2t = z2.get('transform')
                  const z2g = z2.get('gridPosition')
                  const z2d = z2.get('zombieData')
                  if (!z2t || !z2g || !z2d) continue
                  if (z2d.state === ZombieState.DYING || z2d.state === ZombieState.DEAD) continue
                  if (z2g.row !== gridPos.row) continue

                  const dist = Math.abs(z2t.x - transform.x)
                  if (dist < CELL_WIDTH) {
                    const zh = z2.get('health')
                    if (zh) {
                      zh.armor = 0
                      zh.current -= 1800
                    }
                  }
                }

                // 创建爆炸特效
                const effect = createExplosionEffect(transform.x, transform.y, 'boom')
                world.add(effect)
                game.eventBus.emit(GameEvent.EXPLOSION)

                // 释放网格并自毁
                game.eventBus.emit(GameEvent.PLANT_REMOVED, gridPos.row, gridPos.col)
                plant.destroy()
                break
              }
            }
          }
          break
        }
      }
    }
  }
}

/** 检查指定行中植物前方是否有活着的僵尸 */
function hasZombieAhead(zombies: import('../engine/Entity.ts').Entity[], row: number, plantX: number): boolean {
  return zombies.some(z => {
    const zt = z.get('transform')
    const zg = z.get('gridPosition')
    const zd = z.get('zombieData')
    if (!zt || !zg || !zd) return false
    if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) return false
    return zg.row === row && zt.x > plantX && zt.x < DESIGN_WIDTH + 100
  })
}
