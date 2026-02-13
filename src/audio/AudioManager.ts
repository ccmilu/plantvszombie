export type SfxName =
  | 'plantPlace'
  | 'shoot'
  | 'explosion'
  | 'sunCollect'
  | 'sunProduce'
  | 'zombieBite'
  | 'zombieDie'
  | 'armorBreak'
  | 'poleVault'
  | 'lawnMower'
  | 'hit'
  | 'gameWon'
  | 'gameLost'
  | 'buttonClick'
  | 'shovel'
  | 'dragStart'

type WaveType = OscillatorType

export class AudioManager {
  private static instance: AudioManager

  private ctx: AudioContext | null = null
  private bgm: HTMLAudioElement | null = null
  private _muted: boolean
  private initialized = false

  /** 节流：记录每个音效上次播放时间 */
  private lastPlayTime = new Map<SfxName, number>()
  private static THROTTLE_MS = 50

  private constructor() {
    this._muted = localStorage.getItem('pvz_muted') === 'true'
    // 立即预加载 BGM，让浏览器在用户交互前就开始缓冲
    this.bgm = new Audio('/Grazy Dave.mp3')
    this.bgm.preload = 'auto'
    this.bgm.loop = true
    this.bgm.volume = this._muted ? 0 : 0.3
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager()
    }
    return AudioManager.instance
  }

  get muted(): boolean {
    return this._muted
  }

  /** 首次用户交互后调用 */
  init(): void {
    if (this.initialized) return
    this.initialized = true

    this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    // BGM 已在构造函数中预加载，直接播放
    this.playBGM()
  }

  // ==================== BGM ====================

  playBGM(): void {
    if (!this.bgm) return
    this.bgm.volume = this._muted ? 0 : 0.3
    this.bgm.play().catch(() => {
      // autoplay blocked, will retry on next interaction
    })
  }

  stopBGM(): void {
    if (!this.bgm) return
    this.bgm.pause()
    this.bgm.currentTime = 0
  }

  // ==================== Mute ====================

  toggleMute(): boolean {
    this._muted = !this._muted
    localStorage.setItem('pvz_muted', String(this._muted))

    if (this.bgm) {
      this.bgm.volume = this._muted ? 0 : 0.3
    }

    return this._muted
  }

  // ==================== Tone Synthesis ====================

  private playTone(
    freq: number,
    duration: number,
    wave: WaveType = 'square',
    volume: number = 0.15,
    freqEnd?: number,
    delay: number = 0,
  ): void {
    if (this._muted || !this.ctx) return

    const now = this.ctx.currentTime + delay
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = wave
    osc.frequency.setValueAtTime(freq, now)
    if (freqEnd !== undefined) {
      osc.frequency.linearRampToValueAtTime(freqEnd, now + duration)
    }

    gain.gain.setValueAtTime(volume, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + duration)
  }

  // ==================== SFX Definitions ====================

  play(sfx: SfxName): void {
    if (this._muted || !this.ctx) return

    // 节流
    const now = performance.now()
    const last = this.lastPlayTime.get(sfx) ?? 0
    if (now - last < AudioManager.THROTTLE_MS) return
    this.lastPlayTime.set(sfx, now)

    switch (sfx) {
      case 'plantPlace':
        // 短促"咚"声
        this.playTone(200, 0.12, 'triangle', 0.2, 80)
        break

      case 'shoot':
        // 豌豆射击 - 快速"噗"
        this.playTone(600, 0.06, 'square', 0.08, 200)
        break

      case 'explosion':
        // 爆炸 - 低频噪声般
        this.playTone(100, 0.4, 'sawtooth', 0.25, 30)
        this.playTone(200, 0.2, 'square', 0.15, 50, 0.05)
        break

      case 'sunCollect':
        // 收集阳光 - 上扬的叮
        this.playTone(800, 0.08, 'sine', 0.15)
        this.playTone(1200, 0.1, 'sine', 0.12, 1400, 0.08)
        break

      case 'sunProduce':
        // 产出阳光 - 柔和叮
        this.playTone(600, 0.1, 'sine', 0.08)
        this.playTone(900, 0.12, 'sine', 0.06, 1000, 0.1)
        break

      case 'zombieBite':
        // 咬 - 低沉咔嚓
        this.playTone(150, 0.1, 'sawtooth', 0.12, 80)
        break

      case 'zombieDie':
        // 僵尸死亡 - 下降的呻吟
        this.playTone(300, 0.3, 'sawtooth', 0.15, 60)
        this.playTone(200, 0.2, 'square', 0.08, 40, 0.1)
        break

      case 'armorBreak':
        // 护甲碎裂 - 金属感
        this.playTone(800, 0.06, 'square', 0.2, 200)
        this.playTone(600, 0.08, 'sawtooth', 0.15, 100, 0.06)
        this.playTone(400, 0.1, 'square', 0.1, 80, 0.12)
        break

      case 'poleVault':
        // 撑杆跳 - 弹跳上扬
        this.playTone(200, 0.15, 'triangle', 0.15, 800)
        this.playTone(400, 0.1, 'sine', 0.1, 600, 0.1)
        break

      case 'lawnMower':
        // 割草机 - 引擎轰鸣
        this.playTone(80, 0.5, 'sawtooth', 0.2, 120)
        this.playTone(100, 0.4, 'square', 0.1, 150, 0.1)
        break

      case 'hit':
        // 子弹命中 - 短促闷击
        this.playTone(400, 0.05, 'square', 0.1, 150)
        break

      case 'gameWon':
        // 胜利 - 8-bit 凯旋旋律
        this.playTone(523, 0.15, 'square', 0.15) // C5
        this.playTone(659, 0.15, 'square', 0.15, undefined, 0.15) // E5
        this.playTone(784, 0.15, 'square', 0.15, undefined, 0.3) // G5
        this.playTone(1047, 0.3, 'square', 0.2, undefined, 0.45) // C6
        break

      case 'gameLost':
        // 失败 - 下行暗调
        this.playTone(400, 0.2, 'sawtooth', 0.15)
        this.playTone(300, 0.2, 'sawtooth', 0.15, undefined, 0.2)
        this.playTone(200, 0.3, 'sawtooth', 0.2, 100, 0.4)
        break

      case 'buttonClick':
        // 按钮点击 - 清脆的"嘀"
        this.playTone(1000, 0.04, 'square', 0.08, 800)
        break

      case 'shovel':
        // 铲子 - 挖掘声
        this.playTone(300, 0.08, 'triangle', 0.12, 500)
        this.playTone(150, 0.1, 'sawtooth', 0.08, 80, 0.08)
        break

      case 'dragStart':
        // 拖拽开始 - 轻微提示音
        this.playTone(700, 0.05, 'sine', 0.08)
        break
    }
  }
}
