export function drawExplosion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  progress: number, // 0~1
): void {
  ctx.save();
  ctx.translate(x, y);

  const alpha = 1 - progress;
  const currentRadius = radius * (0.5 + progress * 0.5);

  // Outer ring
  ctx.fillStyle = `rgba(255, 87, 34, ${alpha * 0.3})`;
  ctx.beginPath();
  ctx.arc(0, 0, currentRadius * 1.3, 0, Math.PI * 2);
  ctx.fill();

  // Main explosion
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
  grad.addColorStop(0, `rgba(255, 235, 59, ${alpha})`);
  grad.addColorStop(0.4, `rgba(255, 152, 0, ${alpha})`);
  grad.addColorStop(0.7, `rgba(244, 67, 54, ${alpha * 0.8})`);
  grad.addColorStop(1, `rgba(244, 67, 54, 0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
  ctx.fill();

  // Particles
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + progress;
    const dist = currentRadius * 0.6 * (1 + progress);
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    ctx.fillStyle = `rgba(255, 193, 7, ${alpha * 0.7})`;
    ctx.beginPath();
    ctx.arc(px, py, 4 * (1 - progress), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

export function drawChompEffect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  progress: number,
): void {
  ctx.save();
  ctx.translate(x, y);

  const alpha = 1 - progress;

  // Stars/sparkles
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + progress * 3;
    const dist = 15 + progress * 20;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist - 15;

    ctx.fillStyle = `rgba(255, 235, 59, ${alpha})`;
    ctx.font = `${10 + progress * 5}px serif`;
    ctx.fillText('*', px, py);
  }

  ctx.restore();
}
