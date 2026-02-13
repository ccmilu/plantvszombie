import { Camera } from './Camera';
import { World } from '../engine/World';
import { drawBackground } from './layers/BackgroundLayer';
import { drawEntities } from './layers/EntityLayer';
import { drawEffects } from './layers/EffectLayer';
import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  camera: Camera;

  // Cache background to offscreen canvas
  private bgCanvas: HTMLCanvasElement | null = null;
  private bgDirty: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.camera = new Camera();
  }

  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.camera.resize(width, height);
    this.bgDirty = true;
  }

  private ensureBgCache(): void {
    if (this.bgDirty || !this.bgCanvas) {
      this.bgCanvas = document.createElement('canvas');
      this.bgCanvas.width = GAME_WIDTH;
      this.bgCanvas.height = GAME_HEIGHT;
      const bgCtx = this.bgCanvas.getContext('2d')!;
      drawBackground(bgCtx);
      this.bgDirty = false;
    }
  }

  render(world: World, _interpolation: number): void {
    const ctx = this.ctx;

    // Clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply camera transform
    this.camera.apply(ctx);

    // Background
    this.ensureBgCache();
    if (this.bgCanvas) {
      ctx.drawImage(this.bgCanvas, 0, 0);
    }

    // Entities
    const allEntities = world.getAlive();
    drawEntities(ctx, allEntities);

    // Effects overlay
    drawEffects(ctx, allEntities);

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }
}
