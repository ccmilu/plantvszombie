import { World } from '../World';
import { Game } from '../Game';
import { EntityType, GameState } from '../../types';
import { ZOMBIE_WIN_X } from '../../utils/constants';
import { GameEvents } from '../events/EventBus';

export function WaveSystem(world: World, _dt: number, game: Game): void {
  if (!game.currentLevel) return;

  // Check lose condition: any zombie reached the house
  const zombies = world.getByType(EntityType.ZOMBIE);
  for (const zombie of zombies) {
    const transform = zombie.get('transform');
    if (transform && transform.x <= ZOMBIE_WIN_X) {
      game.state = GameState.LOST;
      game.eventBus.emit(GameEvents.GAME_LOST);
      game.eventBus.emit(GameEvents.STATE_CHANGED, game.state);
      return;
    }
  }

  // Check win condition: all waves spawned and no zombies left
  const level = game.currentLevel;
  if (game.waveIndex >= level.waves.length && zombies.length === 0) {
    game.state = GameState.WON;
    game.eventBus.emit(GameEvents.GAME_WON);
    game.eventBus.emit(GameEvents.STATE_CHANGED, game.state);
  }
}
