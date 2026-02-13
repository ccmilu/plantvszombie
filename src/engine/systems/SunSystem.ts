import { World } from '../World';
import { Game } from '../Game';
import { EntityType } from '../../types';

export function SunSystem(world: World, dt: number, game: Game): void {
  const suns = world.getByType(EntityType.SUN);

  for (const sun of suns) {
    if (!sun.alive) continue;

    // Decrease lifetime
    let lifetime = sun.get('lifetime') ?? 0;
    lifetime -= dt;
    if (lifetime <= 0) {
      sun.destroy();
      continue;
    }
    sun.set('lifetime', lifetime);
  }
}
