import type { Game } from '../engine/Game.ts'
import type { Renderer } from '../renderer/Renderer.ts'
import type { LevelHandle } from './setupLevel.ts'
import { GameEvent, EntityType, GameState } from '../types/enums.ts'
import type { PlantType } from '../types/enums.ts'
import { worldToGrid, gridToWorld } from '../utils/math.ts'
import { PLANT_CONFIGS } from '../data/plants.ts'
import { PLANT_ANIM_MAP } from '../data/animations.ts'

export interface GhostPlant {
  key: string
  x: number
  y: number
  width: number
  height: number
  valid: boolean
}

export class InputHandler {
  private selectedPlant: PlantType | null = null
  private shovelMode = false
  private game: Game
  private renderer: Renderer
  private canvas: HTMLCanvasElement
  private levelHandle: LevelHandle

  // ghost plant 状态
  ghostPlant: GhostPlant | null = null

  // 触屏拖拽状态
  private isDragging = false
  private dragPlantType: PlantType | null = null

  constructor(game: Game, renderer: Renderer, canvas: HTMLCanvasElement, levelHandle: LevelHandle) {
    this.game = game
    this.renderer = renderer
    this.canvas = canvas
    this.levelHandle = levelHandle

    // 监听植物选择事件
    game.eventBus.on(GameEvent.SELECT_PLANT, this.onSelectPlant as (...args: unknown[]) => void)
    game.eventBus.on(GameEvent.DESELECT_PLANT, this.onDeselectPlant as (...args: unknown[]) => void)
    game.eventBus.on(GameEvent.TOGGLE_SHOVEL, this.onToggleShovel as (...args: unknown[]) => void)

    // 监听触屏拖拽开始事件（来自 PlantCard onTouchStart）
    game.eventBus.on(GameEvent.DRAG_START, this.onDragStart as (...args: unknown[]) => void)

    // 绑定 canvas 事件（鼠标）
    canvas.addEventListener('click', this.onClick)
    canvas.addEventListener('mousemove', this.onMouseMove)
    canvas.addEventListener('contextmenu', this.onRightClick)

    // 绑定触屏事件
    canvas.addEventListener('touchstart', this.onCanvasTouchStart, { passive: false })
    document.addEventListener('touchmove', this.onTouchMove, { passive: false })
    document.addEventListener('touchend', this.onTouchEnd)
    document.addEventListener('touchcancel', this.onTouchCancel)
  }

  private onSelectPlant = (plantType: PlantType) => {
    this.selectedPlant = plantType
    this.shovelMode = false
    this.canvas.style.cursor = 'default'
  }

  private onDeselectPlant = () => {
    this.selectedPlant = null
    this.ghostPlant = null
    this.isDragging = false
    this.dragPlantType = null
  }

  private onToggleShovel = () => {
    this.shovelMode = !this.shovelMode
    if (this.shovelMode) {
      this.selectedPlant = null
      this.ghostPlant = null
      this.canvas.style.cursor = 'pointer'
    } else {
      this.canvas.style.cursor = 'default'
    }
  }

  private screenToWorld(clientX: number, clientY: number) {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    const screenX = (clientX - rect.left) * dpr
    const screenY = (clientY - rect.top) * dpr
    return this.renderer.camera.screenToWorld(screenX, screenY)
  }

  // ==================== 鼠标事件 ====================

  private onClick = (e: MouseEvent) => {
    if (this.game.getState() !== GameState.PLAYING) return

    const world = this.screenToWorld(e.clientX, e.clientY)

    // Shovel mode: remove plant at clicked grid cell
    if (this.shovelMode) {
      const gridPos = worldToGrid(world.x, world.y)
      if (!gridPos) return

      if (this.levelHandle.grid[gridPos.row][gridPos.col]) {
        // Find and destroy the plant entity at this grid position
        const plants = this.game.world.byType(EntityType.PLANT)
        for (const plant of plants) {
          const gp = plant.get('gridPosition')
          if (gp && gp.row === gridPos.row && gp.col === gridPos.col) {
            plant.alive = false
            this.game.eventBus.emit(GameEvent.PLANT_REMOVED, gridPos.row, gridPos.col)
            this.game.eventBus.emit(GameEvent.SHOVEL_USED)
            break
          }
        }
      }
      return
    }

    // 先检查是否点击了阳光
    const suns = this.game.world.byType(EntityType.SUN)
    for (const sun of suns) {
      const transform = sun.get('transform')
      const sunData = sun.get('sunData')
      if (!transform || !sunData || sunData.collected) continue

      const dx = world.x - transform.x
      const dy = world.y - transform.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < transform.width) {
        this.game.eventBus.emit(GameEvent.COLLECT_SUN, sun.id)
        return
      }
    }

    // 放置植物
    if (this.selectedPlant) {
      const gridPos = worldToGrid(world.x, world.y)
      if (!gridPos) return

      const config = PLANT_CONFIGS[this.selectedPlant]
      if (!config) return
      if (this.game.sun < config.cost) return
      if (this.levelHandle.grid[gridPos.row][gridPos.col]) return

      // 检查冷却
      const cd = this.levelHandle.cooldownState.cooldowns.get(this.selectedPlant)
      if (cd && cd.remaining > 0) return

      this.game.eventBus.emit(GameEvent.PLACE_PLANT, this.selectedPlant, gridPos.row, gridPos.col)

      // 放置后取消选择
      this.selectedPlant = null
      this.ghostPlant = null
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    if (this.shovelMode) {
      this.ghostPlant = null
      return
    }

    if (!this.selectedPlant) {
      this.ghostPlant = null
      return
    }

    const world = this.screenToWorld(e.clientX, e.clientY)
    const gridPos = worldToGrid(world.x, world.y)

    if (!gridPos) {
      this.ghostPlant = null
      return
    }

    const animKey = PLANT_ANIM_MAP[this.selectedPlant]
    const cellCenter = gridToWorld(gridPos.row, gridPos.col)

    const config = PLANT_CONFIGS[this.selectedPlant]
    const occupied = this.levelHandle.grid[gridPos.row][gridPos.col]
    const affordable = this.game.sun >= config.cost
    const cd = this.levelHandle.cooldownState.cooldowns.get(this.selectedPlant)
    const cooledDown = !cd || cd.remaining <= 0

    this.ghostPlant = {
      key: animKey,
      x: cellCenter.x,
      y: cellCenter.y,
      width: 70,
      height: 80,
      valid: !occupied && affordable && cooledDown,
    }
  }

  private onRightClick = (e: MouseEvent) => {
    e.preventDefault()
    this.selectedPlant = null
    this.ghostPlant = null
    if (this.shovelMode) {
      this.shovelMode = false
      this.canvas.style.cursor = 'default'
    }
  }

  // ==================== 触屏事件 ====================

  /** PlantCard 的 onTouchStart 通过 eventBus 触发 */
  private onDragStart = (plantType: PlantType) => {
    this.isDragging = true
    this.dragPlantType = plantType
  }

  /** canvas 上的 touchstart — 处理阳光收集和铲子 */
  private onCanvasTouchStart = (e: TouchEvent) => {
    if (this.game.getState() !== GameState.PLAYING) return
    // 如果正在拖拽中，不处理 canvas touchstart
    if (this.isDragging) return

    const touch = e.touches[0]
    if (!touch) return

    const world = this.screenToWorld(touch.clientX, touch.clientY)

    // 铲子模式
    if (this.shovelMode) {
      e.preventDefault()
      const gridPos = worldToGrid(world.x, world.y)
      if (!gridPos) return

      if (this.levelHandle.grid[gridPos.row][gridPos.col]) {
        const plants = this.game.world.byType(EntityType.PLANT)
        for (const plant of plants) {
          const gp = plant.get('gridPosition')
          if (gp && gp.row === gridPos.row && gp.col === gridPos.col) {
            plant.alive = false
            this.game.eventBus.emit(GameEvent.PLANT_REMOVED, gridPos.row, gridPos.col)
            this.game.eventBus.emit(GameEvent.SHOVEL_USED)
            break
          }
        }
      }
      return
    }

    // 阳光收集（扩大命中半径 × 1.5）
    const suns = this.game.world.byType(EntityType.SUN)
    for (const sun of suns) {
      const transform = sun.get('transform')
      const sunData = sun.get('sunData')
      if (!transform || !sunData || sunData.collected) continue

      const dx = world.x - transform.x
      const dy = world.y - transform.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < transform.width * 1.5) {
        e.preventDefault()
        this.game.eventBus.emit(GameEvent.COLLECT_SUN, sun.id)
        return
      }
    }
  }

  /** 手指移动 — 更新 ghostPlant 预览 */
  private onTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || !this.dragPlantType) return
    e.preventDefault()

    const touch = e.touches[0]
    if (!touch) return

    const world = this.screenToWorld(touch.clientX, touch.clientY)
    const gridPos = worldToGrid(world.x, world.y)

    const animKey = PLANT_ANIM_MAP[this.dragPlantType]
    const config = PLANT_CONFIGS[this.dragPlantType]

    if (gridPos) {
      // 在网格内 — 吸附到格子中心
      const cellCenter = gridToWorld(gridPos.row, gridPos.col)
      const occupied = this.levelHandle.grid[gridPos.row][gridPos.col]
      const affordable = this.game.sun >= config.cost
      const cd = this.levelHandle.cooldownState.cooldowns.get(this.dragPlantType)
      const cooledDown = !cd || cd.remaining <= 0

      this.ghostPlant = {
        key: animKey,
        x: cellCenter.x,
        y: cellCenter.y,
        width: 70,
        height: 80,
        valid: !occupied && affordable && cooledDown,
      }
    } else {
      // 网格外 — 跟随手指
      this.ghostPlant = {
        key: animKey,
        x: world.x,
        y: world.y,
        width: 70,
        height: 80,
        valid: false,
      }
    }
  }

  /** 手指抬起 — 放置或取消 */
  private onTouchEnd = (e: TouchEvent) => {
    if (!this.isDragging || !this.dragPlantType) return

    // 使用 changedTouches 获取最后的触点位置
    const touch = e.changedTouches[0]
    if (touch) {
      const world = this.screenToWorld(touch.clientX, touch.clientY)
      const gridPos = worldToGrid(world.x, world.y)

      if (gridPos && this.ghostPlant?.valid) {
        const config = PLANT_CONFIGS[this.dragPlantType]
        if (config && this.game.sun >= config.cost && !this.levelHandle.grid[gridPos.row][gridPos.col]) {
          const cd = this.levelHandle.cooldownState.cooldowns.get(this.dragPlantType)
          if (!cd || cd.remaining <= 0) {
            this.game.eventBus.emit(GameEvent.PLACE_PLANT, this.dragPlantType, gridPos.row, gridPos.col)
          }
        }
      }
    }

    // 清理拖拽状态
    this.isDragging = false
    this.dragPlantType = null
    this.ghostPlant = null
    this.selectedPlant = null
  }

  /** 触摸取消 */
  private onTouchCancel = () => {
    this.isDragging = false
    this.dragPlantType = null
    this.ghostPlant = null
  }

  destroy(): void {
    // 鼠标事件
    this.canvas.removeEventListener('click', this.onClick)
    this.canvas.removeEventListener('mousemove', this.onMouseMove)
    this.canvas.removeEventListener('contextmenu', this.onRightClick)

    // 触屏事件
    this.canvas.removeEventListener('touchstart', this.onCanvasTouchStart)
    document.removeEventListener('touchmove', this.onTouchMove)
    document.removeEventListener('touchend', this.onTouchEnd)
    document.removeEventListener('touchcancel', this.onTouchCancel)

    // eventBus 事件
    this.game.eventBus.off(GameEvent.SELECT_PLANT, this.onSelectPlant as (...args: unknown[]) => void)
    this.game.eventBus.off(GameEvent.DESELECT_PLANT, this.onDeselectPlant as (...args: unknown[]) => void)
    this.game.eventBus.off(GameEvent.TOGGLE_SHOVEL, this.onToggleShovel as (...args: unknown[]) => void)
    this.game.eventBus.off(GameEvent.DRAG_START, this.onDragStart as (...args: unknown[]) => void)

    this.canvas.style.cursor = 'default'
  }
}
