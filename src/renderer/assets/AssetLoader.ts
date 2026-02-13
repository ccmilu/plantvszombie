import { ASSET_MAP, type AssetKey } from './AssetMap.ts'
import { decodeGif, type GifFrame } from './GifDecoder.ts'

export interface LoadedAssets {
  images: Map<AssetKey, HTMLImageElement>
  gifs: Map<AssetKey, GifFrame[]>
}

/**
 * 预加载所有游戏素材。
 * PNG/JPG → HTMLImageElement
 * GIF → GifFrame[]（逐帧 ImageBitmap）
 */
export async function loadAllAssets(
  onProgress?: (loaded: number, total: number) => void,
): Promise<LoadedAssets> {
  const entries = Object.entries(ASSET_MAP) as [AssetKey, string][]
  const total = entries.length
  let loaded = 0

  const images = new Map<AssetKey, HTMLImageElement>()
  const gifs = new Map<AssetKey, GifFrame[]>()

  const promises = entries.map(async ([key, url]) => {
    try {
      if (url.endsWith('.gif')) {
        const frames = await decodeGif(url)
        gifs.set(key, frames)
      } else {
        const img = await loadImage(url)
        images.set(key, img)
      }
    } catch (err) {
      console.warn(`Failed to load asset: ${key} (${url})`, err)
    }
    loaded++
    onProgress?.(loaded, total)
  })

  await Promise.all(promises)
  return { images, gifs }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}
