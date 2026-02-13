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

// 豌豆子弹速度
export const PEA_SPEED = 300 // 像素/秒

// 植物尺寸（相对于格子）
export const PLANT_WIDTH = 70
export const PLANT_HEIGHT = 80

// 僵尸尺寸
export const ZOMBIE_WIDTH = 56
export const ZOMBIE_HEIGHT = 100

// 子弹尺寸
export const PEA_WIDTH = 20
export const PEA_HEIGHT = 20

// 阳光尺寸
export const SUN_WIDTH = 45
export const SUN_HEIGHT = 45

// 割草机尺寸
export const LAWN_MOWER_WIDTH = 56
export const LAWN_MOWER_HEIGHT = 56

// 阳光收集飞向的目标位置（左上角阳光计数器）
export const SUN_COLLECT_TARGET_X = 45
export const SUN_COLLECT_TARGET_Y = 40

// 阳光飞行速度
export const SUN_COLLECT_SPEED = 400 // 像素/秒

// 僵尸头部特效尺寸和持续时间
export const ZOMBIE_HEAD_WIDTH = 40
export const ZOMBIE_HEAD_HEIGHT = 40
export const ZOMBIE_HEAD_DURATION = 1.5 // 秒

// 僵尸死亡动画持续时间
export const ZOMBIE_DYING_DURATION = 1.5 // 秒

// 割草机触发阈值
export const LAWN_MOWER_TRIGGER_X = 50

// 土豆地雷激活时间
export const POTATO_MINE_ARM_TIME = 15 // 秒

// 樱桃炸弹引爆延迟
export const CHERRY_BOMB_DELAY = 1.0 // 秒

// 樱桃炸弹爆炸特效持续时间
export const CHERRY_BOMB_EFFECT_DURATION = 0.8 // 秒

// 双发射手第二颗子弹延迟
export const REPEATER_SECOND_PEA_DELAY = 0.15 // 秒
