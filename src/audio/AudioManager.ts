export class AudioManager {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15): void {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Ignore audio errors
    }
  }

  playShoot(): void {
    this.playTone(800, 0.1, 'square', 0.08);
  }

  playExplosion(): void {
    if (this.muted) return;
    try {
      const ctx = this.getContext();
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {
      // Ignore
    }
  }

  playSunCollect(): void {
    this.playTone(600, 0.05, 'sine', 0.1);
    setTimeout(() => this.playTone(800, 0.05, 'sine', 0.1), 50);
    setTimeout(() => this.playTone(1000, 0.1, 'sine', 0.1), 100);
  }

  playPlant(): void {
    this.playTone(400, 0.1, 'triangle', 0.1);
  }

  playChomp(): void {
    this.playTone(200, 0.15, 'sawtooth', 0.08);
  }

  playWin(): void {
    [523, 659, 784, 1047].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sine', 0.12), i * 150);
    });
  }

  playLose(): void {
    [400, 350, 300, 250].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.4, 'sawtooth', 0.1), i * 200);
    });
  }

  playClick(): void {
    this.playTone(500, 0.05, 'square', 0.06);
  }

  destroy(): void {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}
