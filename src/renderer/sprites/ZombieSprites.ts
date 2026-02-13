import { ZombieType } from '../../types';

export function drawZombie(
  ctx: CanvasRenderingContext2D,
  type: ZombieType,
  x: number,
  y: number,
  armor?: number,
  maxArmor?: number,
  isEnraged?: boolean,
  hasJumped?: boolean,
  animTimer?: number,
): void {
  ctx.save();
  ctx.translate(x, y);

  const walkCycle = animTimer ? Math.sin(animTimer * 4) * 3 : 0;

  // Base zombie body
  drawZombieBody(ctx, walkCycle, isEnraged);

  // Type-specific decorations
  switch (type) {
    case ZombieType.CONEHEAD:
      if (armor && armor > 0) drawCone(ctx, armor, maxArmor || 370);
      break;
    case ZombieType.BUCKETHEAD:
      if (armor && armor > 0) drawBucket(ctx, armor, maxArmor || 1100);
      break;
    case ZombieType.POLE_VAULTING:
      drawPoleVaulter(ctx, hasJumped);
      break;
    case ZombieType.NEWSPAPER:
      if (armor && armor > 0) drawNewspaper(ctx, armor, maxArmor || 150);
      break;
  }

  ctx.restore();
}

function drawZombieBody(ctx: CanvasRenderingContext2D, walkCycle: number, isEnraged?: boolean): void {
  // Legs
  ctx.fillStyle = '#546E7A';
  ctx.fillRect(-8, 10 + walkCycle, 6, 25);
  ctx.fillRect(2, 10 - walkCycle, 6, 25);

  // Shoes
  ctx.fillStyle = '#333';
  ctx.fillRect(-10, 32 + walkCycle, 10, 5);
  ctx.fillRect(0, 32 - walkCycle, 10, 5);

  // Body (suit)
  ctx.fillStyle = '#455A64';
  ctx.fillRect(-12, -15, 24, 28);

  // Tie
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(-3, -5);
  ctx.lineTo(0, 0);
  ctx.lineTo(3, -5);
  ctx.closePath();
  ctx.fill();

  // Arms
  ctx.fillStyle = '#78909C';
  // Left arm reaching forward
  ctx.save();
  ctx.translate(-12, -8);
  ctx.rotate(-0.3 + walkCycle * 0.02);
  ctx.fillRect(-4, 0, 6, 20);
  // Hand
  ctx.fillStyle = '#A5D6A7';
  ctx.fillRect(-5, 18, 8, 6);
  ctx.restore();

  // Right arm
  ctx.save();
  ctx.fillStyle = '#78909C';
  ctx.translate(12, -8);
  ctx.rotate(0.3 - walkCycle * 0.02);
  ctx.fillRect(-2, 0, 6, 20);
  ctx.fillStyle = '#A5D6A7';
  ctx.fillRect(-3, 18, 8, 6);
  ctx.restore();

  // Head
  ctx.fillStyle = isEnraged ? '#C8E6C9' : '#A5D6A7';
  ctx.beginPath();
  ctx.arc(0, -25, 14, 0, Math.PI * 2);
  ctx.fill();

  // Hair (messy)
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.ellipse(-5, -38, 8, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(5, -36, 6, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-5, -27, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(5, -27, 4, 0, Math.PI * 2);
  ctx.fill();

  // Pupils (look left - toward plants)
  ctx.fillStyle = isEnraged ? '#D32F2F' : '#333';
  ctx.beginPath();
  ctx.arc(-7, -27, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -27, 2, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.fillStyle = '#333';
  ctx.beginPath();
  if (isEnraged) {
    // Open angry mouth
    ctx.ellipse(0, -17, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    // Teeth
    ctx.fillStyle = '#fff';
    ctx.fillRect(-4, -19, 3, 3);
    ctx.fillRect(1, -19, 3, 3);
  } else {
    ctx.arc(0, -18, 4, 0, Math.PI);
    ctx.fill();
  }
}

function drawCone(ctx: CanvasRenderingContext2D, armor: number, maxArmor: number): void {
  const ratio = armor / maxArmor;
  ctx.fillStyle = ratio > 0.5 ? '#FF8F00' : '#F57F17';

  // Cone shape
  ctx.beginPath();
  ctx.moveTo(-10, -32);
  ctx.lineTo(0, -55);
  ctx.lineTo(10, -32);
  ctx.closePath();
  ctx.fill();

  // Cone stripes
  ctx.strokeStyle = '#E65100';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, -43);
  ctx.lineTo(5, -43);
  ctx.stroke();

  if (ratio < 0.5) {
    // Damaged cone - dent
    ctx.fillStyle = '#BF360C';
    ctx.beginPath();
    ctx.arc(3, -40, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBucket(ctx: CanvasRenderingContext2D, armor: number, maxArmor: number): void {
  const ratio = armor / maxArmor;
  ctx.fillStyle = ratio > 0.5 ? '#78909C' : ratio > 0.25 ? '#607D8B' : '#546E7A';

  // Bucket shape
  ctx.beginPath();
  ctx.moveTo(-12, -25);
  ctx.lineTo(-10, -48);
  ctx.lineTo(10, -48);
  ctx.lineTo(12, -25);
  ctx.closePath();
  ctx.fill();

  // Bucket rim
  ctx.fillStyle = '#90A4AE';
  ctx.fillRect(-12, -48, 24, 4);

  // Handle
  ctx.strokeStyle = '#90A4AE';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -48, 8, Math.PI, 0);
  ctx.stroke();

  // Dents for damage
  if (ratio < 0.66) {
    ctx.fillStyle = '#455A64';
    ctx.beginPath();
    ctx.ellipse(-5, -38, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (ratio < 0.33) {
    ctx.fillStyle = '#37474F';
    ctx.beginPath();
    ctx.ellipse(5, -32, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPoleVaulter(ctx: CanvasRenderingContext2D, hasJumped?: boolean): void {
  if (!hasJumped) {
    // Carrying pole
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, -10);
    ctx.lineTo(20, -40);
    ctx.stroke();

    // Headband
    ctx.fillStyle = '#F44336';
    ctx.fillRect(-12, -34, 24, 4);
  } else {
    // Headband only (pole discarded)
    ctx.fillStyle = '#F44336';
    ctx.fillRect(-12, -34, 24, 4);
  }
}

function drawNewspaper(ctx: CanvasRenderingContext2D, armor: number, maxArmor: number): void {
  const ratio = armor / maxArmor;

  // Newspaper in front
  ctx.fillStyle = ratio > 0.5 ? '#EFEBE9' : '#D7CCC8';
  ctx.fillRect(-15, -20, 20, 30);

  // Text lines on newspaper
  ctx.fillStyle = '#333';
  ctx.fillRect(-13, -17, 16, 2);
  ctx.fillRect(-13, -12, 12, 1);
  ctx.fillRect(-13, -9, 14, 1);
  ctx.fillRect(-13, -6, 10, 1);
  ctx.fillRect(-13, -3, 14, 1);

  if (ratio < 0.5) {
    // Torn newspaper
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-10, -20);
    ctx.lineTo(-5, -10);
    ctx.lineTo(-12, 0);
    ctx.stroke();
  }
}
