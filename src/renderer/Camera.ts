import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../utils/constants.ts'

/**
 * Camera 负责将设计分辨率映射到实际 canvas 尺寸。
 * 使用 letterbox 策略保持宽高比。
 */
export class Camera {
  /** 缩放比例 */
  scale = 1
  /** letterbox 偏移 */
  offsetX = 0
  offsetY = 0
  /** canvas 实际尺寸 */
  canvasWidth = DESIGN_WIDTH
  canvasHeight = DESIGN_HEIGHT

  /** 根据 canvas 实际尺寸重算缩放 */
  resize(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    const scaleX = canvasWidth / DESIGN_WIDTH
    const scaleY = canvasHeight / DESIGN_HEIGHT
    this.scale = Math.min(scaleX, scaleY)
    this.offsetX = (canvasWidth - DESIGN_WIDTH * this.scale) / 2
    this.offsetY = (canvasHeight - DESIGN_HEIGHT * this.scale) / 2
  }

  /** 应用到 canvas context（在每帧渲染开头调用） */
  apply(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(this.scale, 0, 0, this.scale, this.offsetX, this.offsetY)
  }

  /** 将屏幕坐标（如鼠标位置）转换为设计坐标 */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.offsetX) / this.scale,
      y: (screenY - this.offsetY) / this.scale,
    }
  }
}
