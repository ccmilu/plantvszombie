import { Entity } from '../../engine/Entity';
import { EntityType, PlantType, ZombieType, ProjectileType } from '../../types';
import { drawPlant } from '../sprites/PlantSprites';
import { drawZombie } from '../sprites/ZombieSprites';
import { drawProjectile, drawSun } from '../sprites/ProjectileSprites';

export function drawEntities(ctx: CanvasRenderingContext2D, entities: Entity[]): void {
  // Sort by y position for proper layering
  const sorted = [...entities].sort((a, b) => {
    const ay = a.get('transform')?.y ?? 0;
    const by = b.get('transform')?.y ?? 0;
    return ay - by;
  });

  for (const entity of sorted) {
    if (!entity.alive) continue;
    const transform = entity.get('transform');
    if (!transform) continue;

    switch (entity.entityType) {
      case EntityType.PLANT: {
        const plantType = entity.get('plantType');
        const health = entity.get('health');
        if (plantType) {
          drawPlant(
            ctx,
            plantType,
            transform.x,
            transform.y,
            health?.current,
            health?.max,
            entity.get('animTimer') ?? 0,
            entity.get('isActive'),
            entity.get('chompTimer'),
          );
        }
        break;
      }
      case EntityType.ZOMBIE: {
        const zombieType = entity.get('zombieType');
        const health = entity.get('health');
        if (zombieType) {
          drawZombie(
            ctx,
            zombieType,
            transform.x,
            transform.y,
            health?.armor,
            health?.maxArmor,
            entity.get('isEnraged'),
            entity.get('hasJumped'),
            entity.get('animTimer') ?? 0,
          );
        }
        break;
      }
      case EntityType.PROJECTILE: {
        const projType = entity.get('projectileType');
        if (projType) {
          drawProjectile(ctx, projType, transform.x, transform.y);
        }
        break;
      }
      case EntityType.SUN: {
        drawSun(ctx, transform.x, transform.y);
        break;
      }
    }
  }
}
