import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import { EntityType, PlantType, ZombieState } from '../types/enums.ts'
import { createProjectile, createPlantSun } from '../ecs/factories.ts'
import { DESIGN_WIDTH } from '../utils/constants.ts'

export function createPlantBehaviorSystem(game: Game) {
  return (world: World, dt: number): void => {
    const plants = world.byType(EntityType.PLANT)
    const zombies = world.byType(EntityType.ZOMBIE)

    for (const plant of plants) {
      const plantData = plant.get('plantData')
      const transform = plant.get('transform')
      const gridPos = plant.get('gridPosition')
      if (!plantData || !transform || !gridPos) continue

      plantData.actionTimer += dt

      if (plantData.plantType === PlantType.SUNFLOWER) {
        // 向日葵：每 actionInterval 秒产阳光
        if (plantData.actionTimer >= plantData.actionInterval) {
          plantData.actionTimer = 0
          const sun = createPlantSun(transform.x, transform.y)
          world.add(sun)
        }
      } else if (plantData.plantType === PlantType.PEASHOOTER) {
        // 豌豆射手：同行有活僵尸才射击
        if (plantData.actionTimer >= plantData.actionInterval) {
          const hasZombieInRow = zombies.some(z => {
            const zt = z.get('transform')
            const zg = z.get('gridPosition')
            const zd = z.get('zombieData')
            if (!zt || !zg || !zd) return false
            if (zd.state === ZombieState.DYING || zd.state === ZombieState.DEAD) return false
            return zg.row === gridPos.row && zt.x > transform.x && zt.x < DESIGN_WIDTH + 100
          })

          if (hasZombieInRow) {
            plantData.actionTimer = 0
            const pea = createProjectile(
              transform.x + transform.width / 2,
              transform.y,
              gridPos.row,
              20,
            )
            world.add(pea)
          }
        }
      }
    }
  }
}
