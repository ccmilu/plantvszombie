import { GRID_OFFSET_X, GRID_OFFSET_Y, CELL_WIDTH, CELL_HEIGHT } from './constants.ts'

/** 网格坐标 -> 世界像素坐标（单元格中心） */
export function gridToWorld(row: number, col: number): { x: number; y: number } {
  return {
    x: GRID_OFFSET_X + col * CELL_WIDTH + CELL_WIDTH / 2,
    y: GRID_OFFSET_Y + row * CELL_HEIGHT + CELL_HEIGHT / 2,
  }
}

/** 世界像素坐标 -> 网格坐标，返回 null 表示超出范围 */
export function worldToGrid(x: number, y: number): { row: number; col: number } | null {
  const col = Math.floor((x - GRID_OFFSET_X) / CELL_WIDTH)
  const row = Math.floor((y - GRID_OFFSET_Y) / CELL_HEIGHT)
  if (row < 0 || row >= 5 || col < 0 || col >= 9) return null
  return { row, col }
}

/** 简单 AABB 碰撞检测 */
export function aabbOverlap(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by
}

/** 限制数值范围 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/** 线性插值 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}
