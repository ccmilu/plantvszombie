import type { World } from '../engine/World.ts'
import type { LoadedAssets } from '../renderer/assets/AssetLoader.ts'
import type { AssetKey } from '../renderer/assets/AssetMap.ts'

export function createAnimationSystem(assets: LoadedAssets) {
  return (_world: World, dt: number): void => {
    const entities = _world.withComponents('animation')
    for (const entity of entities) {
      const anim = entity.get('animation')!
      anim.frameTimer += dt

      // 获取当前动画的总帧数
      const gifFrames = assets.gifs.get(anim.key as AssetKey)
      const totalFrames = gifFrames ? gifFrames.length : 1

      if (totalFrames <= 1) continue

      // 使用 GIF 内置帧延迟或默认值
      const frameDuration = gifFrames
        ? (gifFrames[anim.frameIndex % totalFrames].delay / 1000) || anim.frameDuration
        : anim.frameDuration

      if (anim.frameTimer >= frameDuration) {
        anim.frameTimer -= frameDuration
        anim.frameIndex = (anim.frameIndex + 1) % totalFrames
      }
    }
  }
}
