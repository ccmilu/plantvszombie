import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class Camera {
  scaleX: number = 1;
  scaleY: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;
  canvasWidth: number = GAME_WIDTH;
  canvasHeight: number = GAME_HEIGHT;

  resize(canvasWidth: number, canvasHeight: number): void {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Fit game into canvas while maintaining aspect ratio
    const gameAspect = GAME_WIDTH / GAME_HEIGHT;
    const canvasAspect = canvasWidth / canvasHeight;

    if (canvasAspect > gameAspect) {
      // Canvas is wider - fit by height
      this.scaleY = canvasHeight / GAME_HEIGHT;
      this.scaleX = this.scaleY;
      this.offsetX = (canvasWidth - GAME_WIDTH * this.scaleX) / 2;
      this.offsetY = 0;
    } else {
      // Canvas is taller - fit by width
      this.scaleX = canvasWidth / GAME_WIDTH;
      this.scaleY = this.scaleX;
      this.offsetX = 0;
      this.offsetY = (canvasHeight - GAME_HEIGHT * this.scaleY) / 2;
    }
  }

  /** Convert screen coords to game coords */
  screenToGame(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.offsetX) / this.scaleX,
      y: (screenY - this.offsetY) / this.scaleY,
    };
  }

  /** Apply camera transform to context */
  apply(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(this.scaleX, 0, 0, this.scaleY, this.offsetX, this.offsetY);
  }

  /** Reset context transform */
  reset(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 0, 0, 0);
  }
}
