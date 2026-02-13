import { World } from '../World';
import { Game } from '../Game';
import { EntityType } from '../../types';

export function CleanupSystem(world: World, _dt: number, game: Game): void {
  const entities = world.getAll();

  for (const entity of entities) {
    if (!entity.alive) {
      if (entity.entityType === EntityType.ZOMBIE) {
        game.onZombieDied();
      }
      world.remove(entity.id);
      continue;
    }

    // Remove dead entities based on health
    const health = entity.get('health');
    if (health && health.current <= 0) {
      entity.destroy();
      // Will be cleaned up next frame
    }

    // Remove expired effects
    if (entity.entityType === EntityType.EFFECT) {
      const lifetime = entity.get('lifetime') ?? 0;
      if (lifetime <= 0) {
        entity.destroy();
      } else {
        entity.set('lifetime', lifetime - (1 / 60)); // Approximate
      }
    }
  }
}
