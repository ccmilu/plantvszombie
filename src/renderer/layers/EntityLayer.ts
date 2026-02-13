import type { World } from '../../engine/World.ts'
import type { LoadedAssets } from '../assets/AssetLoader.ts'
import type { GifFrame } from '../assets/GifDecoder.ts'
import type { AssetKey } from '../assets/AssetMap.ts'
import { EntityType } from '../../types/enums.ts'

export class EntityLayer {
  private assets: LoadedAssets | null = null

  init(assets: LoadedAssets): void {
    this.assets = assets
  }

  render(ctx: CanvasRenderingContext2D, world: World): void {
    if (!this.assets) return

    // 按类型分组渲染（控制 z-order）
    const order: EntityType[] = [
      EntityType.LAWN_MOWER,
      EntityType.PLANT,
      EntityType.ZOMBIE,
      EntityType.PROJECTILE,
      EntityType.SUN,
      EntityType.EFFECT,
    ]

    for (const type of order) {
      const entities = world.byType(type)
      for (const entity of entities) {
        const transform = entity.get('transform')
        const animation = entity.get('animation')
        if (!transform) continue

        if (animation) {
          this.renderAnimated(ctx, animation.key as AssetKey, animation.frameIndex, transform.x, transform.y, transform.width, transform.height)
        }
      }
    }
  }

  private renderAnimated(
    ctx: CanvasRenderingContext2D,
    key: AssetKey,
    frameIndex: number,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    if (!this.assets) return

    const gifFrames = this.assets.gifs.get(key)
    if (gifFrames && gifFrames.length > 0) {
      const frame = gifFrames[frameIndex % gifFrames.length]
      this.drawFrame(ctx, frame, x, y, width, height)
      return
    }

    // 尝试作为静态图片
    const img = this.assets.images.get(key)
    if (img) {
      ctx.drawImage(img, x - width / 2, y - height / 2, width, height)
    }
  }

  private drawFrame(
    ctx: CanvasRenderingContext2D,
    frame: GifFrame,
    x: number,
    y: number,
    width: number,
    height: number,
  ): void {
    ctx.drawImage(frame.image, x - width / 2, y - height / 2, width, height)
  }
}
