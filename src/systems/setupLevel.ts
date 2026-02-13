import type { Game } from '../engine/Game.ts'
import type { LoadedAssets } from '../renderer/assets/AssetLoader.ts'
import { GameState, GameEvent, PlantType } from '../types/enums.ts'
import { LEVELS } from '../data/levels.ts'
import { PLANT_CONFIGS } from '../data/plants.ts'
import { GRID_ROWS } from '../utils/constants.ts'
import { createLawnMower, createPlant } from '../ecs/factories.ts'
import { createWaveState } from './WaveState.ts'
import { createSpawnSystem } from './SpawnSystem.ts'
import { createWaveSystem } from './WaveSystem.ts'
import { createPlantBehaviorSystem } from './PlantBehaviorSystem.ts'
import { createZombieBehaviorSystem } from './ZombieBehaviorSystem.ts'
import { createProjectileSystem } from './ProjectileSystem.ts'
import { createMovementSystem } from './MovementSystem.ts'
import { createCollisionSystem } from './CollisionSystem.ts'
import { createCombatSystem } from './CombatSystem.ts'
import { createSunSystem } from './SunSystem.ts'
import { createAnimationSystem } from './AnimationSystem.ts'
import { createCooldownSystem, createCooldownState, type CooldownState } from './CooldownSystem.ts'
import { createCleanupSystem } from './CleanupSystem.ts'
import { createEffectSystem } from './EffectSystem.ts'

export interface LevelHandle {
  cooldownState: CooldownState
  /** 网格占用表 [row][col] */
  grid: (boolean)[][]
  /** 玩家选择的植物列表 */
  selectedPlants: PlantType[]
  /** 清理事件监听器 */
  destroy: () => void
}

export function setupLevel(game: Game, levelId: number, assets: LoadedAssets, selectedPlants?: PlantType[]): LevelHandle {
  const levelConfig = LEVELS.find(l => l.id === levelId)
  if (!levelConfig) throw new Error(`Level ${levelId} not found`)

  // 重置游戏状态
  game.reset()
  game.sun = levelConfig.initialSun
  game.currentLevel = levelId

  // 使用玩家选择的植物，否则使用关卡默认配置
  const plants = selectedPlants && selectedPlants.length > 0
    ? selectedPlants
    : levelConfig.availablePlants

  // 初始化网格占用表
  const grid: boolean[][] = []
  for (let r = 0; r < GRID_ROWS; r++) {
    grid.push(new Array(9).fill(false))
  }

  // 创建波次状态
  const waveState = createWaveState(levelConfig.waves.length)

  // 创建冷却状态
  const cooldownState = createCooldownState()

  // 创建割草机（每行一台）
  for (let row = 0; row < GRID_ROWS; row++) {
    const mower = createLawnMower(row)
    game.world.add(mower)
  }

  // 注册系统（按执行顺序）
  game.registerSystem(createSpawnSystem(game, levelConfig, waveState))
  game.registerSystem(createWaveSystem(game, waveState))
  game.registerSystem(createPlantBehaviorSystem(game))
  game.registerSystem(createZombieBehaviorSystem())
  game.registerSystem(createProjectileSystem())
  game.registerSystem(createMovementSystem())
  game.registerSystem(createCollisionSystem())
  game.registerSystem(createCombatSystem(game))
  game.registerSystem(createSunSystem(game))
  game.registerSystem(createEffectSystem())
  game.registerSystem(createAnimationSystem(assets))
  game.registerSystem(createCooldownSystem(game, cooldownState))
  game.registerSystem(createCleanupSystem())

  // 监听放置植物事件
  const onPlacePlant = (plantType: PlantType, row: number, col: number) => {
    const config = PLANT_CONFIGS[plantType]
    if (!config) return
    if (game.sun < config.cost) return
    if (grid[row][col]) return

    // 放置植物
    const plant = createPlant(plantType, row, col)
    game.world.add(plant)
    grid[row][col] = true

    // 扣阳光
    game.sun -= config.cost
    game.eventBus.emit(GameEvent.SUN_CHANGED, game.sun)

    // 启动冷却
    cooldownState.cooldowns.set(plantType, {
      remaining: config.cooldown,
      total: config.cooldown,
    })

    game.eventBus.emit(GameEvent.PLANT_PLACED, plantType, row, col)
  }

  // 监听收集阳光事件
  const onCollectSun = (sunEntityId: number) => {
    const sun = game.world.get(sunEntityId)
    if (!sun || !sun.alive) return
    const sunData = sun.get('sunData')
    if (!sunData || sunData.collected) return
    sunData.collected = true
  }

  // 监听植物被移除（被僵尸吃掉）
  const onPlantRemoved = (row: number, col: number) => {
    if (row >= 0 && row < GRID_ROWS && col >= 0 && col < 9) {
      grid[row][col] = false
    }
  }

  game.eventBus.on(GameEvent.PLACE_PLANT, onPlacePlant as (...args: unknown[]) => void)
  game.eventBus.on(GameEvent.COLLECT_SUN, onCollectSun as (...args: unknown[]) => void)
  game.eventBus.on(GameEvent.PLANT_REMOVED, onPlantRemoved as (...args: unknown[]) => void)

  // 启动游戏
  game.setState(GameState.PLAYING)
  game.eventBus.emit(GameEvent.SUN_CHANGED, game.sun)

  const destroy = () => {
    game.eventBus.off(GameEvent.PLACE_PLANT, onPlacePlant as (...args: unknown[]) => void)
    game.eventBus.off(GameEvent.COLLECT_SUN, onCollectSun as (...args: unknown[]) => void)
    game.eventBus.off(GameEvent.PLANT_REMOVED, onPlantRemoved as (...args: unknown[]) => void)
  }

  return { cooldownState, grid, selectedPlants: plants, destroy }
}
