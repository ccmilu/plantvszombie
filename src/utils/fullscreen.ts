/** 请求全屏（兼容各浏览器前缀） */
export function requestFullscreen(): void {
  const el = document.documentElement as HTMLElement & {
    webkitRequestFullscreen?: () => Promise<void>
  }
  if (el.requestFullscreen) {
    el.requestFullscreen().catch(() => {})
  } else if (el.webkitRequestFullscreen) {
    el.webkitRequestFullscreen()
  }
}

/** 退出全屏 */
export function exitFullscreen(): void {
  const doc = document as Document & {
    webkitExitFullscreen?: () => Promise<void>
  }
  if (doc.exitFullscreen) {
    doc.exitFullscreen().catch(() => {})
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen()
  }
}

/** 当前是否全屏 */
export function isFullscreen(): boolean {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null
  }
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement)
}

/** 切换全屏 */
export function toggleFullscreen(): void {
  if (isFullscreen()) {
    exitFullscreen()
  } else {
    requestFullscreen()
  }
}
