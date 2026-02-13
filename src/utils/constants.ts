// 游戏逻辑使用的虚拟画布尺寸
export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 600;

// 网格参数
export const GRID_ROWS = 5;
export const GRID_COLS = 9;
export const GRID_OFFSET_X = 70;
export const GRID_OFFSET_Y = 100;
export const CELL_WIDTH = 80;
export const CELL_HEIGHT = 95;

// 工具栏高度
export const TOOLBAR_HEIGHT = 90;

// 游戏逻辑
export const FIXED_TIMESTEP = 1000 / 60; // 60Hz
export const SUN_FALL_SPEED = 50; // px/s
export const SUN_SPAWN_INTERVAL = 10; // seconds
export const SUN_LIFETIME = 8; // seconds
export const SUN_VALUE_SKY = 25;

// 植物放置区域
export const LAWN_LEFT = GRID_OFFSET_X;
export const LAWN_RIGHT = GRID_OFFSET_X + GRID_COLS * CELL_WIDTH;
export const LAWN_TOP = GRID_OFFSET_Y;
export const LAWN_BOTTOM = GRID_OFFSET_Y + GRID_ROWS * CELL_HEIGHT;

// 僵尸生成位置
export const ZOMBIE_SPAWN_X = GAME_WIDTH + 20;
// 僵尸到达此位置则失败
export const ZOMBIE_WIN_X = 10;

// 子弹
export const PEA_SPEED = 300; // px/s
export const PEA_DAMAGE = 20;

export function gridToPixel(row: number, col: number): { x: number; y: number } {
  return {
    x: GRID_OFFSET_X + col * CELL_WIDTH + CELL_WIDTH / 2,
    y: GRID_OFFSET_Y + row * CELL_HEIGHT + CELL_HEIGHT / 2,
  };
}

export function pixelToGrid(x: number, y: number): { row: number; col: number } | null {
  const col = Math.floor((x - GRID_OFFSET_X) / CELL_WIDTH);
  const row = Math.floor((y - GRID_OFFSET_Y) / CELL_HEIGHT);
  if (row >= 0 && row < GRID_ROWS && col >= 0 && col < GRID_COLS) {
    return { row, col };
  }
  return null;
}
