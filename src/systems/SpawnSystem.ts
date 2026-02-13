import type { Game } from '../engine/Game.ts'
import type { World } from '../engine/World.ts'
import type { LevelConfig } from '../types/index.ts'
import type { WaveState } from './WaveState.ts'
import { GameEvent } from '../types/enums.ts'
import { createZombie, createSkySun } from '../ecs/factories.ts'
import { SKY_SUN_INTERVAL, GRID_ROWS } from '../utils/constants.ts'

export function createSpawnSystem(game: Game, levelConfig: LevelConfig, waveState: WaveState) {
  let skySunTimer = 10 // 首个天空阳光在10秒后

  return (world: World, dt: number): void => {
    // 天空阳光生成
    skySunTimer -= dt
    if (skySunTimer <= 0) {
      skySunTimer = SKY_SUN_INTERVAL
      const sun = createSkySun()
      world.add(sun)
    }

    // 僵尸波次生成
    if (waveState.allSpawned) return

    const waves = levelConfig.waves
    if (waveState.waveIndex >= waves.length) {
      waveState.allSpawned = true
      return
    }

    const currentWave = waves[waveState.waveIndex]

    // 波次延迟计时
    if (waveState.delayTimer < currentWave.delay) {
      waveState.delayTimer += dt
      return
    }

    // 计算当前波的僵尸组
    const groups = currentWave.zombies
    if (waveState.groupIndex >= groups.length) {
      // 当前波所有组都已生成完毕
      waveState.waveIndex++
      waveState.delayTimer = 0
      waveState.spawnTimer = 0
      waveState.groupIndex = 0
      waveState.groupSpawned = 0
      waveState.spawnedInWave = 0

      game.eventBus.emit(GameEvent.WAVE_PROGRESS, waveState.waveIndex, waveState.totalWaves)
      return
    }

    const group = groups[waveState.groupIndex]

    // 生成计时：首个僵尸立即生成，后续按间隔
    waveState.spawnTimer += dt
    const shouldSpawn = waveState.groupSpawned === 0 || waveState.spawnTimer >= group.interval
    if (shouldSpawn) {
      waveState.spawnTimer = 0

      const row = Math.floor(Math.random() * GRID_ROWS)
      const zombie = createZombie(group.type, row)
      world.add(zombie)

      waveState.groupSpawned++
      waveState.spawnedInWave++

      if (waveState.groupSpawned >= group.count) {
        waveState.groupIndex++
        waveState.groupSpawned = 0
        waveState.spawnTimer = 0
      }
    }
  }
}
