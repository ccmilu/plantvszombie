import {
  GRID_ROWS, GRID_COLS, GRID_OFFSET_X, GRID_OFFSET_Y,
  CELL_WIDTH, CELL_HEIGHT, GAME_WIDTH, GAME_HEIGHT
} from '../../utils/constants';

export function drawBackground(ctx: CanvasRenderingContext2D): void {
  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  skyGrad.addColorStop(0, '#87CEEB');
  skyGrad.addColorStop(0.6, '#B0E0E6');
  skyGrad.addColorStop(1, '#90EE90');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Grass area
  const grassTop = GRID_OFFSET_Y - 10;
  const grassGrad = ctx.createLinearGradient(0, grassTop, 0, GAME_HEIGHT);
  grassGrad.addColorStop(0, '#4CAF50');
  grassGrad.addColorStop(1, '#388E3C');
  ctx.fillStyle = grassGrad;
  ctx.fillRect(0, grassTop, GAME_WIDTH, GAME_HEIGHT - grassTop);

  // Draw grid cells with alternating colors
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const x = GRID_OFFSET_X + col * CELL_WIDTH;
      const y = GRID_OFFSET_Y + row * CELL_HEIGHT;

      const isLight = (row + col) % 2 === 0;
      ctx.fillStyle = isLight ? 'rgba(76, 175, 80, 0.3)' : 'rgba(56, 142, 60, 0.3)';
      ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);

      // Cell border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CELL_WIDTH, CELL_HEIGHT);
    }
  }

  // Draw path on the left side
  ctx.fillStyle = '#8D6E63';
  ctx.fillRect(0, grassTop, GRID_OFFSET_X, GAME_HEIGHT - grassTop);

  // House silhouette on the left
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(5, grassTop + 20, 55, GAME_HEIGHT - grassTop - 20);
  // Roof
  ctx.beginPath();
  ctx.moveTo(0, grassTop + 20);
  ctx.lineTo(32, grassTop - 10);
  ctx.lineTo(65, grassTop + 20);
  ctx.closePath();
  ctx.fillStyle = '#4E342E';
  ctx.fill();

  // Lawn mower area (left strip)
  for (let row = 0; row < GRID_ROWS; row++) {
    const y = GRID_OFFSET_Y + row * CELL_HEIGHT + CELL_HEIGHT / 2;
    // Simple lawnmower icon
    ctx.fillStyle = '#F44336';
    ctx.fillRect(15, y - 10, 25, 20);
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(15, y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40, y + 10, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}
