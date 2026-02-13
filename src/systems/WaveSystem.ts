import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import type { WaveState } from './WaveState.ts'
import { EntityType, GameState, GameEvent, ZombieState } from '../types/enums.ts'
import { LOSE_LINE_X } from '../utils/constants.ts'

export function createWaveSystem(game: Game, waveState: WaveState) {
  return (world: World, _dt: number): void => {
    if (game.getState() !== GameState.PLAYING) return

    const zombies = world.byType(EntityType.ZOMBIE)

    // 失败判定：僵尸过线
    for (const zombie of zombies) {
      const transform = zombie.get('transform')
      const zd = zombie.get('zombieData')
      if (!transform || !zd) continue
      if (zd.state === ZombieState.DEAD || zd.state === ZombieState.DYING) continue

      if (transform.x < LOSE_LINE_X) {
        game.setState(GameState.LOST)
        game.eventBus.emit(GameEvent.GAME_LOST)
        return
      }
    }

    // 胜利判定：所有僵尸波次完成且场上无活僵尸
    if (waveState.allSpawned) {
      const aliveZombies = zombies.filter(z => {
        const zd = z.get('zombieData')
        return zd && zd.state !== ZombieState.DEAD
      })
      if (aliveZombies.length === 0) {
        game.setState(GameState.WON)
        game.eventBus.emit(GameEvent.GAME_WON)
      }
    }
  }
}
