// 设计分辨率（逻辑像素）
export const DESIGN_WIDTH = 900
export const DESIGN_HEIGHT = 600

// 游戏网格
export const GRID_ROWS = 5
export const GRID_COLS = 9

// 网格起始偏移（相对于设计分辨率）
export const GRID_OFFSET_X = 40
export const GRID_OFFSET_Y = 85

// 单元格尺寸
export const CELL_WIDTH = 82
export const CELL_HEIGHT = 100

// 工具栏高度
export const TOOLBAR_HEIGHT = 80

// 阳光相关
export const INITIAL_SUN = 50
export const SKY_SUN_INTERVAL = 10 // 天空阳光掉落间隔(秒)
export const SUN_VALUE = 25
export const SUN_FALL_SPEED = 60 // 像素/秒
export const SUN_LIFETIME = 8  // 阳光存活时间(秒)

// 割草机
export const LAWN_MOWER_SPEED = 300 // 像素/秒
export const LAWN_MOWER_X = 10 // 割草机起始 x 位置

// 僵尸出生 x 位置
export const ZOMBIE_SPAWN_X = DESIGN_WIDTH + 50

// 游戏失败判定线（僵尸走到此线即失败）
export const LOSE_LINE_X = -50

// 固定时间步长
export const FIXED_DT = 1 / 60

// 动画默认帧间隔
export const DEFAULT_FRAME_DURATION = 0.1 // 秒
