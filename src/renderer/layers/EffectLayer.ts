import type { World } from '../../engine/World.ts'
import type { LoadedAssets } from '../assets/AssetLoader.ts'

export class EffectLayer {
  private assets: LoadedAssets | null = null

  init(assets: LoadedAssets): void {
    this.assets = assets
  }

  render(_ctx: CanvasRenderingContext2D, _world: World): void {
    // 特效渲染在后续阶段实现
    // 目前特效实体通过 EntityLayer 统一渲染
    void this.assets // suppress unused warning
  }
}
