import type { World } from '../engine/World.ts'
import { EntityType, ZombieState, ZombieType } from '../types/enums.ts'
import { ZOMBIE_DYING_DURATION, CELL_WIDTH } from '../utils/constants.ts'
import { ZOMBIE_ATTACK_ANIMS, ZOMBIE_WALK_ANIMS } from '../data/animations.ts'
import type { AssetKey } from '../renderer/assets/AssetMap.ts'

/** 撑杆僵尸跳跃后的降速 */
const POLE_VAULT_POST_JUMP_SPEED = 15

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

      // 检查护甲掉落 -> 切换动画
      const health = zombie.get('health')
      if (health && health.maxArmor > 0 && health.armor <= 0) {
        const isArmoredType =
          zd.zombieType === ZombieType.CONE ||
          zd.zombieType === ZombieType.BUCKET ||
          zd.zombieType === ZombieType.FOOTBALL

        if (isArmoredType) {
          // 护甲耗尽：切换为普通僵尸外观
          const currentKey = anim.key as AssetKey
          const normalWalkAnims = ZOMBIE_WALK_ANIMS[ZombieType.NORMAL]
          const normalAttackAnim = ZOMBIE_ATTACK_ANIMS[ZombieType.NORMAL]
          const armoredWalkAnims = ZOMBIE_WALK_ANIMS[zd.zombieType]
          const armoredAttackAnim = ZOMBIE_ATTACK_ANIMS[zd.zombieType]

          // 只在还使用护甲版动画时切换
          if (armoredWalkAnims.includes(currentKey) || currentKey === armoredAttackAnim) {
            if (zd.state === ZombieState.ATTACKING) {
              anim.key = normalAttackAnim
            } else {
              const walkKey = normalWalkAnims[Math.floor(Math.random() * normalWalkAnims.length)]
              anim.key = walkKey as AssetKey
            }
            anim.frameIndex = 0
            anim.frameTimer = 0
          }
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
        // 撑杆僵尸跳跃逻辑
        if (zd.zombieType === ZombieType.POLE_VAULT && !zd.hasJumped) {
          zd.hasJumped = true
          const pt = targetPlant.get('transform')
          if (pt) {
            // 跳到植物后方一个格子宽度
            transform.x = pt.x - CELL_WIDTH
          }
          // 降速并切换为普通僵尸动画（撑杆丢掉了）
          if (movement) {
            movement.baseSpeed = POLE_VAULT_POST_JUMP_SPEED
            movement.speed = zd.slowTimer > 0 ? POLE_VAULT_POST_JUMP_SPEED * 0.5 : POLE_VAULT_POST_JUMP_SPEED
          }
          const walkKey = ZOMBIE_WALK_ANIMS[ZombieType.NORMAL][0]
          anim.key = walkKey as AssetKey
          anim.frameIndex = 0
          anim.frameTimer = 0
          // 继续行走，不进入攻击状态
          continue
        }

        // 切换到攻击状态
        if (zd.state !== ZombieState.ATTACKING) {
          zd.state = ZombieState.ATTACKING
          // 使用正确的攻击动画（考虑护甲掉落）
          let attackKey: AssetKey
          if (health && health.maxArmor > 0 && health.armor <= 0 &&
              (zd.zombieType === ZombieType.CONE || zd.zombieType === ZombieType.BUCKET || zd.zombieType === ZombieType.FOOTBALL)) {
            attackKey = ZOMBIE_ATTACK_ANIMS[ZombieType.NORMAL]
          } else if (zd.zombieType === ZombieType.POLE_VAULT && zd.hasJumped) {
            attackKey = ZOMBIE_ATTACK_ANIMS[ZombieType.NORMAL]
          } else {
            attackKey = ZOMBIE_ATTACK_ANIMS[zd.zombieType]
          }
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
          // 使用正确的行走动画（考虑护甲掉落和撑杆跳跃）
          let walkAnims: AssetKey[]
          if (health && health.maxArmor > 0 && health.armor <= 0 &&
              (zd.zombieType === ZombieType.CONE || zd.zombieType === ZombieType.BUCKET || zd.zombieType === ZombieType.FOOTBALL)) {
            walkAnims = ZOMBIE_WALK_ANIMS[ZombieType.NORMAL] as AssetKey[]
          } else if (zd.zombieType === ZombieType.POLE_VAULT && zd.hasJumped) {
            walkAnims = ZOMBIE_WALK_ANIMS[ZombieType.NORMAL] as AssetKey[]
          } else {
            walkAnims = ZOMBIE_WALK_ANIMS[zd.zombieType] as AssetKey[]
          }
          const walkKey = walkAnims[Math.floor(Math.random() * walkAnims.length)]
          anim.key = walkKey
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
