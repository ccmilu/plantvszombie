import type { World } from '../engine/World.ts'

export function createCleanupSystem() {
  return (world: World, _dt: number): void => {
    world.cleanup()
  }
}
