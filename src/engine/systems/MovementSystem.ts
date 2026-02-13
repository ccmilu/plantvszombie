import { World } from '../World';
import { Game } from '../Game';
import { EntityType } from '../../types';
import { GRID_OFFSET_X, CELL_WIDTH, GRID_OFFSET_Y, CELL_HEIGHT } from '../../utils/constants';

export function MovementSystem(world: World, dt: number, game: Game): void {
  const entities = world.getAlive();

  for (const entity of entities) {
    const transform = entity.get('transform');
    const movement = entity.get('movement');
    if (!transform || !movement) continue;

    // Skip zombies that are eating
    if (entity.entityType === EntityType.ZOMBIE && entity.get('isEating')) {
      continue;
    }

    // Special handling for falling suns
    if (entity.entityType === EntityType.SUN) {
      const targetY = (entity.components as Record<string, unknown>).targetY as number | undefined;
      if (targetY !== undefined && transform.y < targetY) {
        transform.y += movement.speed * dt;
        if (transform.y >= targetY) {
          transform.y = targetY;
          movement.speed = 0;
        }
      }
      continue;
    }

    // Normal movement
    transform.x += movement.dx * movement.speed * dt;
    transform.y += movement.dy * movement.speed * dt;

    // Update grid position based on pixel position
    const gp = entity.get('gridPosition');
    if (gp) {
      gp.col = Math.floor((transform.x - GRID_OFFSET_X) / CELL_WIDTH);
      gp.row = Math.floor((transform.y - GRID_OFFSET_Y) / CELL_HEIGHT);
    }
  }
}
