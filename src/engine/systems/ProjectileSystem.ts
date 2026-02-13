import { World } from '../World';
import { Game } from '../Game';
import { EntityType, ProjectileType } from '../../types';
import { GAME_WIDTH } from '../../utils/constants';
import { aabbOverlap } from '../../utils/collision';

export function ProjectileSystem(world: World, dt: number, game: Game): void {
  const projectiles = world.getByType(EntityType.PROJECTILE);

  for (const proj of projectiles) {
    if (!proj.alive) continue;

    const transform = proj.get('transform');
    if (!transform) continue;

    // Remove if off screen
    if (transform.x > GAME_WIDTH + 50 || transform.x < -50) {
      proj.destroy();
      continue;
    }

    // Check collision with zombies in same row
    const gp = proj.get('gridPosition');
    if (!gp) continue;

    const zombiesInRow = world.getZombiesInRow(gp.row);
    for (const zombie of zombiesInRow) {
      if (!zombie.alive) continue;
      const zt = zombie.get('transform');
      if (!zt) continue;

      if (aabbOverlap(transform, zt)) {
        const combat = proj.get('combat');
        const health = zombie.get('health');
        if (combat && health) {
          // Apply damage to armor first, then hp
          if (health.armor > 0) {
            health.armor -= combat.damage;
            if (health.armor < 0) {
              health.current += health.armor; // overflow goes to hp
              health.armor = 0;
            }
          } else {
            health.current -= combat.damage;
          }

          // Apply slow effect for snow peas
          if (proj.get('projectileType') === ProjectileType.SNOW_PEA) {
            zombie.set('slowEffect', {
              factor: 0.5,
              duration: 3,
              timer: 3,
            });
          }
        }

        proj.destroy();
        break;
      }
    }
  }
}
