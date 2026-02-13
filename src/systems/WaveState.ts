/** 波次状态，由 SpawnSystem 写入、WaveSystem 读取 */
export interface WaveState {
  waveIndex: number
  totalWaves: number
  allSpawned: boolean
  /** 当前波内已生成的僵尸数 */
  spawnedInWave: number
  /** 当前波的总僵尸数 */
  totalInWave: number
  /** 波次延迟计时器 */
  delayTimer: number
  /** 波内生成计时器 */
  spawnTimer: number
  /** 当前波内的僵尸组索引 */
  groupIndex: number
  /** 当前组内已生成数 */
  groupSpawned: number
}

export function createWaveState(totalWaves: number): WaveState {
  return {
    waveIndex: 0,
    totalWaves,
    allSpawned: false,
    spawnedInWave: 0,
    totalInWave: 0,
    delayTimer: 0,
    spawnTimer: 0,
    groupIndex: 0,
    groupSpawned: 0,
  }
}
