import { World } from '../World';
import { Game } from '../Game';

// Collision detection is handled inline by ProjectileSystem and ZombieBehaviorSystem
// This system is reserved for any additional collision checks needed
export function CollisionSystem(_world: World, _dt: number, _game: Game): void {
  // Currently handled by ProjectileSystem and ZombieBehaviorSystem
}
