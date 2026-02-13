import { ProjectileType } from '../../types';

export function drawProjectile(
  ctx: CanvasRenderingContext2D,
  type: ProjectileType,
  x: number,
  y: number,
): void {
  ctx.save();
  ctx.translate(x, y);

  switch (type) {
    case ProjectileType.PEA:
      drawPea(ctx);
      break;
    case ProjectileType.SNOW_PEA:
      drawSnowPea(ctx);
      break;
  }

  ctx.restore();
}

function drawPea(ctx: CanvasRenderingContext2D): void {
  // Green pea
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = '#A5D6A7';
  ctx.beginPath();
  ctx.arc(-2, -2, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnowPea(ctx: CanvasRenderingContext2D): void {
  // Blue pea
  ctx.fillStyle = '#42A5F5';
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0, Math.PI * 2);
  ctx.fill();

  // Ice crystal highlight
  ctx.fillStyle = '#E3F2FD';
  ctx.beginPath();
  ctx.arc(-2, -2, 3, 0, Math.PI * 2);
  ctx.fill();

  // Ice particles around
  ctx.fillStyle = 'rgba(227, 242, 253, 0.6)';
  ctx.beginPath();
  ctx.arc(5, -5, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-5, 4, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

export function drawSun(ctx: CanvasRenderingContext2D, x: number, y: number, size: number = 20): void {
  ctx.save();
  ctx.translate(x, y);

  // Glow
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
  glow.addColorStop(0, 'rgba(255, 235, 59, 0.3)');
  glow.addColorStop(1, 'rgba(255, 235, 59, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Rays
  ctx.fillStyle = '#FDD835';
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle - 0.2) * size * 0.6,
      Math.sin(angle - 0.2) * size * 0.6,
    );
    ctx.lineTo(
      Math.cos(angle) * size * 1.2,
      Math.sin(angle) * size * 1.2,
    );
    ctx.lineTo(
      Math.cos(angle + 0.2) * size * 0.6,
      Math.sin(angle + 0.2) * size * 0.6,
    );
    ctx.closePath();
    ctx.fill();
  }

  // Sun body
  ctx.fillStyle = '#FFEB3B';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2);
  ctx.fill();

  // Face
  ctx.fillStyle = '#F9A825';
  ctx.beginPath();
  ctx.arc(-3, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#F9A825';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 2, 3, 0.1, Math.PI - 0.1);
  ctx.stroke();

  ctx.restore();
}
