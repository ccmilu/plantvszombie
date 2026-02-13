import { DESIGN_WIDTH, DESIGN_HEIGHT } from '../../utils/constants.ts'
import type { LoadedAssets } from '../assets/AssetLoader.ts'

export class BackgroundLayer {
  private bgImage: HTMLImageElement | null = null

  init(assets: LoadedAssets): void {
    this.bgImage = assets.images.get('background') ?? null
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.bgImage) {
      ctx.drawImage(this.bgImage, -50, 0, 1050, DESIGN_HEIGHT)
    } else {
      // 无背景图时使用纯色
      ctx.fillStyle = '#4a7c10'
      ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
    }
  }
}
