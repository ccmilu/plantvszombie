/**
 * 轻量 GIF 解码器：将 GIF 文件解析为逐帧 ImageBitmap 数组。
 *
 * 原理：利用 <img> 标签加载 GIF，然后通过一个临时 canvas 逐帧绘制。
 * 这里采用更简单的方案：使用 ImageDecoder API（如可用）或回退到
 * 将 GIF 绘制到 canvas 通过手动解析 GIF 二进制来提取帧。
 *
 * 为了浏览器兼容性，使用手动解析 GIF87a/89a 格式的方式。
 */

export interface GifFrame {
  image: ImageBitmap
  delay: number // 毫秒
}

/**
 * 解码 GIF 文件为帧数组
 * 优先使用 WebCodecs ImageDecoder API，回退到手动解析
 */
export async function decodeGif(url: string): Promise<GifFrame[]> {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // 尝试使用 ImageDecoder API（Chrome 94+）
  if ('ImageDecoder' in window) {
    try {
      return await decodeWithImageDecoder(buffer)
    } catch {
      // 回退到手动解析
    }
  }

  // 手动解析 GIF
  return decodeManually(bytes)
}

async function decodeWithImageDecoder(buffer: ArrayBuffer): Promise<GifFrame[]> {
  const ImageDecoderCtor = (window as unknown as Record<string, unknown>).ImageDecoder as new (
    init: { type: string; data: ArrayBuffer }
  ) => {
    tracks: { ready: Promise<void>; selectedTrack: { frameCount: number } }
    decode(opts: { frameIndex: number }): Promise<{
      image: VideoFrame
      complete: boolean
    }>
    close(): void
  }

  const decoder = new ImageDecoderCtor({
    type: 'image/gif',
    data: buffer,
  })

  await decoder.tracks.ready
  const frameCount = decoder.tracks.selectedTrack.frameCount
  const frames: GifFrame[] = []

  for (let i = 0; i < frameCount; i++) {
    const result = await decoder.decode({ frameIndex: i })
    const videoFrame = result.image
    const bitmap = await createImageBitmap(videoFrame)
    frames.push({
      image: bitmap,
      delay: (videoFrame as unknown as { duration: number }).duration
        ? (videoFrame as unknown as { duration: number }).duration / 1000
        : 100,
    })
    videoFrame.close()
  }

  decoder.close()
  return frames
}

/**
 * 手动解析 GIF 二进制格式
 * 支持 GIF87a 和 GIF89a
 */
function decodeManually(bytes: Uint8Array): Promise<GifFrame[]> {
  return new Promise((resolve, reject) => {
    try {
      const parsed = parseGif(bytes)
      const frames = renderGifFrames(parsed)
      resolve(frames)
    } catch (e) {
      reject(e)
    }
  })
}

// ---------- GIF 二进制解析 ----------

interface GifData {
  width: number
  height: number
  globalColorTable: Uint8Array | null
  globalColorTableSize: number
  bgColorIndex: number
  frames: ParsedFrame[]
}

interface ParsedFrame {
  left: number
  top: number
  width: number
  height: number
  localColorTable: Uint8Array | null
  interlaced: boolean
  disposalMethod: number
  delay: number // 毫秒
  transparentIndex: number
  pixels: Uint8Array // 解压后的像素索引数据
}

class BitReader {
  private data: Uint8Array
  private pos = 0
  private bitBuf = 0
  private bitCount = 0

  constructor(data: Uint8Array) {
    this.data = data
  }

  readBits(n: number): number {
    while (this.bitCount < n) {
      if (this.pos >= this.data.length) return -1
      this.bitBuf |= this.data[this.pos++] << this.bitCount
      this.bitCount += 8
    }
    const val = this.bitBuf & ((1 << n) - 1)
    this.bitBuf >>= n
    this.bitCount -= n
    return val
  }
}

function parseGif(bytes: Uint8Array): GifData {
  let offset = 0

  const read = (n: number) => {
    const slice = bytes.subarray(offset, offset + n)
    offset += n
    return slice
  }
  const readU8 = () => bytes[offset++]
  const readU16 = () => {
    const val = bytes[offset] | (bytes[offset + 1] << 8)
    offset += 2
    return val
  }

  // Header
  const sig = String.fromCharCode(...read(6))
  if (sig !== 'GIF87a' && sig !== 'GIF89a') {
    throw new Error('Not a valid GIF file')
  }

  // Logical Screen Descriptor
  const width = readU16()
  const height = readU16()
  const packed = readU8()
  const bgColorIndex = readU8()
  readU8() // pixel aspect ratio

  const hasGCT = (packed >> 7) & 1
  const gctSize = 2 << (packed & 7)

  let globalColorTable: Uint8Array | null = null
  if (hasGCT) {
    globalColorTable = new Uint8Array(read(gctSize * 3))
  }

  const frames: ParsedFrame[] = []
  let disposalMethod = 0
  let delay = 100
  let transparentIndex = -1

  while (offset < bytes.length) {
    const introducer = readU8()

    if (introducer === 0x3b) {
      // Trailer
      break
    }

    if (introducer === 0x21) {
      // Extension
      const label = readU8()

      if (label === 0xf9) {
        // Graphics Control Extension
        readU8() // block size (always 4)
        const gcPacked = readU8()
        disposalMethod = (gcPacked >> 2) & 7
        const hasTransparent = gcPacked & 1
        delay = readU16() * 10 // 转为毫秒
        if (delay === 0) delay = 100
        transparentIndex = hasTransparent ? readU8() : (readU8(), -1)
        readU8() // block terminator
      } else {
        // 跳过其他扩展块
        while (true) {
          const blockSize = readU8()
          if (blockSize === 0) break
          offset += blockSize
        }
      }
      continue
    }

    if (introducer === 0x2c) {
      // Image Descriptor
      const left = readU16()
      const top = readU16()
      const w = readU16()
      const h = readU16()
      const imgPacked = readU8()
      const hasLCT = (imgPacked >> 7) & 1
      const interlaced = ((imgPacked >> 6) & 1) === 1
      const lctSize = hasLCT ? 2 << (imgPacked & 7) : 0

      let localColorTable: Uint8Array | null = null
      if (hasLCT) {
        localColorTable = new Uint8Array(read(lctSize * 3))
      }

      // LZW 解压
      const minCodeSize = readU8()
      const compressedData: number[] = []
      while (true) {
        const blockSize = readU8()
        if (blockSize === 0) break
        for (let i = 0; i < blockSize; i++) {
          compressedData.push(readU8())
        }
      }

      const pixels = lzwDecode(minCodeSize, new Uint8Array(compressedData), w * h)

      frames.push({
        left,
        top,
        width: w,
        height: h,
        localColorTable,
        interlaced,
        disposalMethod,
        delay,
        transparentIndex,
        pixels,
      })

      // 重置 GCE 参数
      disposalMethod = 0
      delay = 100
      transparentIndex = -1
      continue
    }

    // 未知块，跳过
  }

  return { width, height, globalColorTable, globalColorTableSize: gctSize, bgColorIndex, frames }
}

function lzwDecode(minCodeSize: number, compressed: Uint8Array, pixelCount: number): Uint8Array {
  const clearCode = 1 << minCodeSize
  const eoiCode = clearCode + 1
  const output = new Uint8Array(pixelCount)
  let outPos = 0

  let codeSize = minCodeSize + 1
  let nextCode = eoiCode + 1
  const maxTableSize = 4096

  // 码表：每项存储为 [前缀码, 后缀字节]
  const prefix = new Int32Array(maxTableSize)
  const suffix = new Uint8Array(maxTableSize)
  const lengths = new Uint16Array(maxTableSize)

  // 初始化码表
  const initTable = () => {
    codeSize = minCodeSize + 1
    nextCode = eoiCode + 1
    for (let i = 0; i < clearCode; i++) {
      prefix[i] = -1
      suffix[i] = i
      lengths[i] = 1
    }
  }

  // 将码解压到输出的临时栈
  const tempStack = new Uint8Array(maxTableSize)

  const outputCode = (code: number) => {
    let c = code
    let stackPos = 0
    while (c >= clearCode) {
      tempStack[stackPos++] = suffix[c]
      c = prefix[c]
    }
    tempStack[stackPos++] = suffix[c]
    // 逆序写入输出
    for (let i = stackPos - 1; i >= 0 && outPos < pixelCount; i--) {
      output[outPos++] = tempStack[i]
    }
  }

  const reader = new BitReader(compressed)
  initTable()

  let oldCode = -1

  while (outPos < pixelCount) {
    const code = reader.readBits(codeSize)
    if (code === -1 || code === eoiCode) break

    if (code === clearCode) {
      initTable()
      oldCode = -1
      continue
    }

    if (oldCode === -1) {
      outputCode(code)
      oldCode = code
      continue
    }

    if (code < nextCode) {
      outputCode(code)
      if (nextCode < maxTableSize) {
        // 添加新码表项
        let c = code
        while (c >= clearCode) c = prefix[c]
        prefix[nextCode] = oldCode
        suffix[nextCode] = suffix[c]
        lengths[nextCode] = lengths[oldCode] + 1
        nextCode++
      }
    } else {
      // code === nextCode
      let c = oldCode
      while (c >= clearCode) c = prefix[c]
      if (nextCode < maxTableSize) {
        prefix[nextCode] = oldCode
        suffix[nextCode] = suffix[c]
        lengths[nextCode] = lengths[oldCode] + 1
        nextCode++
      }
      outputCode(code)
    }

    if (nextCode >= (1 << codeSize) && codeSize < 12) {
      codeSize++
    }

    oldCode = code
  }

  return output
}

function deinterlace(pixels: Uint8Array, width: number, height: number): Uint8Array {
  const result = new Uint8Array(width * height)
  const passes = [
    { start: 0, step: 8 },
    { start: 4, step: 8 },
    { start: 2, step: 4 },
    { start: 1, step: 2 },
  ]
  let srcRow = 0
  for (const pass of passes) {
    for (let y = pass.start; y < height; y += pass.step) {
      result.set(pixels.subarray(srcRow * width, (srcRow + 1) * width), y * width)
      srcRow++
    }
  }
  return result
}

function renderGifFrames(gif: GifData): GifFrame[] {
  const { width, height, globalColorTable, frames: parsedFrames } = gif
  const results: GifFrame[] = []

  // 使用 OffscreenCanvas 合成帧
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!

  // 前一帧备份（用于 disposal method 3）
  let previousImageData: ImageData | null = null

  for (const frame of parsedFrames) {
    const colorTable = frame.localColorTable ?? globalColorTable
    if (!colorTable) continue

    let pixels = frame.pixels
    if (frame.interlaced) {
      pixels = deinterlace(pixels, frame.width, frame.height)
    }

    // 处理 disposal method（在绘制当前帧之前）
    if (frame.disposalMethod === 3 && previousImageData) {
      // Restore to previous
      ctx.putImageData(previousImageData, 0, 0)
    }

    // 备份当前状态（disposal method 3 需要）
    if (frame.disposalMethod === 3) {
      previousImageData = ctx.getImageData(0, 0, width, height)
    }

    if (frame.disposalMethod === 2) {
      // Restore to background
      ctx.clearRect(frame.left, frame.top, frame.width, frame.height)
    }

    // 绘制当前帧像素
    const imageData = ctx.getImageData(frame.left, frame.top, frame.width, frame.height)
    const data = imageData.data

    for (let i = 0; i < pixels.length; i++) {
      const colorIndex = pixels[i]
      if (colorIndex === frame.transparentIndex) continue
      const r = colorTable[colorIndex * 3]
      const g = colorTable[colorIndex * 3 + 1]
      const b = colorTable[colorIndex * 3 + 2]
      data[i * 4] = r
      data[i * 4 + 1] = g
      data[i * 4 + 2] = b
      data[i * 4 + 3] = 255
    }
    ctx.putImageData(imageData, frame.left, frame.top)

    // 创建 ImageBitmap
    const bitmap = canvas.transferToImageBitmap()
    results.push({ image: bitmap, delay: frame.delay })

    // 重新绘制到 canvas（transferToImageBitmap 会清空 canvas）
    ctx.drawImage(bitmap, 0, 0)
  }

  return results
}
