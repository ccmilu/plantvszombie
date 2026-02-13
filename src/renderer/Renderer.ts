import { Camera } from './Camera.ts'
import { BackgroundLayer } from './layers/BackgroundLayer.ts'
import { EntityLayer } from './layers/EntityLayer.ts'
import { EffectLayer } from './layers/EffectLayer.ts'
import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../utils/constants.ts'
import type { LoadedAssets } from './assets/AssetLoader.ts'
import type { World } from '../engine/World.ts'

export class Renderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  readonly camera = new Camera()
  private backgroundLayer = new BackgroundLayer()
  private entityLayer = new EntityLayer()
  private effectLayer = new EffectLayer()
  private ready = false

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Cannot get 2d context')
    this.ctx = ctx
    ctx.imageSmoothingEnabled = false
  }

  init(assets: LoadedAssets): void {
    this.backgroundLayer.init(assets)
    this.entityLayer.init(assets)
    this.effectLayer.init(assets)
    this.ready = true
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.camera.resize(this.canvas.width, this.canvas.height)
    this.ctx.imageSmoothingEnabled = false
  }

  render(world: World): void {
    if (!this.ready) return

    const { ctx } = this
    // 清空
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // 应用 camera 变换
    this.camera.apply(ctx)

    // 裁剪到设计区域
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
    ctx.clip()

    // 分层渲染
    this.backgroundLayer.render(ctx)
    this.entityLayer.render(ctx, world)
    this.effectLayer.render(ctx, world)

    ctx.restore()
  }

  destroy(): void {
    this.ready = false
  }
}
