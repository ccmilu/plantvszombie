import { World } from '../World';
import { Game } from '../Game';
import { EntityType, ZombieType } from '../../types';
import { CELL_WIDTH } from '../../utils/constants';
import { aabbOverlap } from '../../utils/collision';

export function ZombieBehaviorSystem(world: World, dt: number, game: Game): void {
  const zombies = world.getByType(EntityType.ZOMBIE);

  for (const zombie of zombies) {
    if (!zombie.alive) continue;

    const transform = zombie.get('transform');
    const movement = zombie.get('movement');
    const health = zombie.get('health');
    const zombieType = zombie.get('zombieType');
    if (!transform || !movement || !health) continue;

    // Update animation timer
    zombie.set('animTimer', (zombie.get('animTimer') ?? 0) + dt);

    // Apply slow effect
    const slow = zombie.get('slowEffect');
    if (slow) {
      slow.timer -= dt;
      if (slow.timer <= 0) {
        zombie.set('slowEffect', undefined);
        movement.speed = movement.baseSpeed;
      } else {
        movement.speed = movement.baseSpeed * slow.factor;
      }
    }

    // Type-specific behaviors
    if (zombieType === ZombieType.POLE_VAULTING && !zombie.get('hasJumped')) {
      // Check if approaching a plant
      const gp = zombie.get('gridPosition');
      if (gp) {
        const plantsInRow = world.getPlantsInRow(gp.row);
        for (const plant of plantsInRow) {
          const pt = plant.get('transform');
          if (pt && transform.x - pt.x < CELL_WIDTH * 0.8 && transform.x > pt.x) {
            // Jump over!
            transform.x = pt.x - CELL_WIDTH * 0.5;
            zombie.set('hasJumped', true);
            movement.speed = 15; // Slow down after jumping
            movement.baseSpeed = 15;
            break;
          }
        }
      }
    }

    if (zombieType === ZombieType.NEWSPAPER) {
      // Check if newspaper (armor) just broke
      if (health.armor <= 0 && !zombie.get('isEnraged')) {
        zombie.set('isEnraged', true);
        movement.baseSpeed = 40;
        movement.speed = 40;
      }
    }

    // Check if eating a plant
    const isEating = zombie.get('isEating');
    if (isEating) {
      // Already handled in CombatSystem
      continue;
    }

    // Check collision with plants in same row
    const gp = zombie.get('gridPosition');
    if (!gp) continue;

    const plantsInRow = world.getPlantsInRow(gp.row);
    let eating = false;
    for (const plant of plantsInRow) {
      const pt = plant.get('transform');
      if (!pt) continue;
      if (aabbOverlap(transform, pt)) {
        zombie.set('isEating', true);
        zombie.set('targetEntityId', plant.id);
        eating = true;
        break;
      }
    }

    if (!eating) {
      zombie.set('isEating', false);
    }
  }
}
