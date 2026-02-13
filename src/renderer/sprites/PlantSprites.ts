import { PlantType } from '../../types';

export function drawPlant(
  ctx: CanvasRenderingContext2D,
  type: PlantType,
  x: number,
  y: number,
  hp?: number,
  maxHp?: number,
  animTimer?: number,
  isActive?: boolean,
  chompTimer?: number,
): void {
  ctx.save();
  ctx.translate(x, y);

  const sway = animTimer ? Math.sin(animTimer * 2) * 2 : 0;

  switch (type) {
    case PlantType.SUNFLOWER:
      drawSunflower(ctx, sway);
      break;
    case PlantType.PEASHOOTER:
      drawPeashooter(ctx, sway);
      break;
    case PlantType.WALLNUT:
      drawWallnut(ctx, hp, maxHp);
      break;
    case PlantType.SNOW_PEA:
      drawSnowPea(ctx, sway);
      break;
    case PlantType.CHERRY_BOMB:
      drawCherryBomb(ctx);
      break;
    case PlantType.REPEATER:
      drawRepeater(ctx, sway);
      break;
    case PlantType.POTATO_MINE:
      drawPotatoMine(ctx, isActive);
      break;
    case PlantType.CHOMPER:
      drawChomper(ctx, sway, chompTimer);
      break;
  }

  ctx.restore();
}

function drawSunflower(ctx: CanvasRenderingContext2D, sway: number): void {
  // Stem
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(sway, 0, 0, -10);
  ctx.stroke();

  // Leaves
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.ellipse(-10, 10, 8, 4, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(10, 5, 8, 4, 0.5, 0, Math.PI * 2);
  ctx.fill();

  // Petals
  const petalCount = 10;
  ctx.fillStyle = '#FDD835';
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const px = Math.cos(angle) * 15;
    const py = -20 + Math.sin(angle) * 15;
    ctx.beginPath();
    ctx.ellipse(px, py, 7, 4, angle, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center face
  ctx.fillStyle = '#F9A825';
  ctx.beginPath();
  ctx.arc(0, -20, 10, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-4, -22, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(4, -22, 2, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, -18, 5, 0.1, Math.PI - 0.1);
  ctx.stroke();
}

function drawPeashooter(ctx: CanvasRenderingContext2D, sway: number): void {
  // Stem
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(sway, 5, 0, -5);
  ctx.stroke();

  // Leaves
  ctx.fillStyle = '#4CAF50';
  ctx.beginPath();
  ctx.ellipse(-10, 10, 8, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#66BB6A';
  ctx.beginPath();
  ctx.arc(0, -15, 16, 0, Math.PI * 2);
  ctx.fill();

  // Mouth/barrel
  ctx.fillStyle = '#43A047';
  ctx.fillRect(10, -20, 15, 12);
  ctx.fillStyle = '#2E7D32';
  ctx.fillRect(20, -22, 8, 16);

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-4, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-3, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawWallnut(ctx: CanvasRenderingContext2D, hp?: number, maxHp?: number): void {
  const ratio = hp && maxHp ? hp / maxHp : 1;

  // Body
  ctx.fillStyle = '#D2691E';
  ctx.beginPath();
  ctx.ellipse(0, -5, 22, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Shell texture
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -33);
  ctx.lineTo(0, 23);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-22, -5);
  ctx.lineTo(22, -5);
  ctx.stroke();

  // Damage cracks
  if (ratio < 0.66) {
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -20);
    ctx.lineTo(-3, -10);
    ctx.lineTo(-10, 0);
    ctx.stroke();
  }
  if (ratio < 0.33) {
    ctx.beginPath();
    ctx.moveTo(5, -15);
    ctx.lineTo(10, -5);
    ctx.lineTo(3, 5);
    ctx.lineTo(8, 15);
    ctx.stroke();
    // Missing chunk
    ctx.fillStyle = '#A0522D';
    ctx.beginPath();
    ctx.arc(-10, 5, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Face
  const eyeY = ratio < 0.33 ? -10 : -8;
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-7, eyeY, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, eyeY, 3, 0, Math.PI * 2);
  ctx.fill();

  // Expression based on damage
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (ratio > 0.66) {
    // Happy
    ctx.arc(0, -2, 6, 0.1, Math.PI - 0.1);
  } else if (ratio > 0.33) {
    // Worried
    ctx.moveTo(-6, 2);
    ctx.lineTo(6, 2);
  } else {
    // Pained
    ctx.arc(0, 5, 6, Math.PI + 0.1, -0.1);
  }
  ctx.stroke();
}

function drawSnowPea(ctx: CanvasRenderingContext2D, sway: number): void {
  // Stem
  ctx.strokeStyle = '#1B5E20';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(sway, 5, 0, -5);
  ctx.stroke();

  // Head (bluish)
  ctx.fillStyle = '#4FC3F7';
  ctx.beginPath();
  ctx.arc(0, -15, 16, 0, Math.PI * 2);
  ctx.fill();

  // Mouth/barrel
  ctx.fillStyle = '#29B6F6';
  ctx.fillRect(10, -20, 15, 12);
  ctx.fillStyle = '#0288D1';
  ctx.fillRect(20, -22, 8, 16);

  // Ice crystals on head
  ctx.strokeStyle = '#E1F5FE';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    const angle = -0.8 + i * 0.5;
    const cx = Math.cos(angle) * 12;
    const cy = -15 + Math.sin(angle) * 12;
    ctx.beginPath();
    ctx.moveTo(cx - 3, cy);
    ctx.lineTo(cx + 3, cy);
    ctx.moveTo(cx, cy - 3);
    ctx.lineTo(cx, cy + 3);
    ctx.stroke();
  }

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-4, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0D47A1';
  ctx.beginPath();
  ctx.arc(-3, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCherryBomb(ctx: CanvasRenderingContext2D): void {
  // Two cherries
  // Stems
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-10, -30);
  ctx.quadraticCurveTo(0, -40, 0, -35);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(10, -30);
  ctx.quadraticCurveTo(0, -40, 0, -35);
  ctx.stroke();

  // Left cherry
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.arc(-10, -15, 15, 0, Math.PI * 2);
  ctx.fill();

  // Right cherry
  ctx.fillStyle = '#F44336';
  ctx.beginPath();
  ctx.arc(10, -12, 14, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyes on left
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-14, -18, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-6, -18, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-14, -18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-6, -18, 2, 0, Math.PI * 2);
  ctx.fill();

  // Angry eyebrows
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, -24);
  ctx.lineTo(-12, -22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-2, -24);
  ctx.lineTo(-8, -22);
  ctx.stroke();

  // Fuse on top
  ctx.strokeStyle = '#795548';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -35);
  ctx.quadraticCurveTo(5, -42, 3, -45);
  ctx.stroke();
  // Spark
  ctx.fillStyle = '#FFD54F';
  ctx.beginPath();
  ctx.arc(3, -46, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawRepeater(ctx: CanvasRenderingContext2D, sway: number): void {
  // Stem
  ctx.strokeStyle = '#2E7D32';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(sway, 5, 0, -5);
  ctx.stroke();

  // Head (darker green)
  ctx.fillStyle = '#388E3C';
  ctx.beginPath();
  ctx.arc(0, -15, 16, 0, Math.PI * 2);
  ctx.fill();

  // Double barrel
  ctx.fillStyle = '#2E7D32';
  ctx.fillRect(10, -22, 18, 6);
  ctx.fillRect(10, -14, 18, 6);
  ctx.fillStyle = '#1B5E20';
  ctx.fillRect(24, -24, 6, 10);
  ctx.fillRect(24, -16, 6, 10);

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-4, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -18, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.arc(-3, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -18, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Determined eyebrows
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, -25);
  ctx.lineTo(-1, -24);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(3, -24);
  ctx.lineTo(10, -25);
  ctx.stroke();
}

function drawPotatoMine(ctx: CanvasRenderingContext2D, isActive?: boolean): void {
  if (!isActive) {
    // Underground state - just a dirt mound
    ctx.fillStyle = '#8D6E63';
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 8, 0, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.ellipse(0, 10, 12, 5, 0, Math.PI, 0);
    ctx.fill();
    return;
  }

  // Active state - angry potato
  ctx.fillStyle = '#8D6E63';
  ctx.beginPath();
  ctx.ellipse(0, -5, 18, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(-6, -10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#D32F2F';
  ctx.beginPath();
  ctx.arc(-5, -10, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(7, -10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Angry mouth
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 2, 8, Math.PI + 0.3, -0.3);
  ctx.stroke();
}

function drawChomper(ctx: CanvasRenderingContext2D, sway: number, chompTimer?: number): void {
  const isChomping = chompTimer && chompTimer > 0;

  // Stem
  ctx.strokeStyle = '#7B1FA2';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 20);
  ctx.quadraticCurveTo(sway * 1.5, 0, 0, -10);
  ctx.stroke();

  // Leaf
  ctx.fillStyle = '#9C27B0';
  ctx.beginPath();
  ctx.ellipse(-12, 8, 10, 5, -0.3, 0, Math.PI * 2);
  ctx.fill();

  if (isChomping) {
    // Closed mouth - chewing
    ctx.fillStyle = '#7B1FA2';
    ctx.beginPath();
    ctx.ellipse(0, -22, 18, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bulge
    ctx.fillStyle = '#6A1B9A';
    ctx.beginPath();
    ctx.ellipse(0, -18, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Squinted eyes
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -28);
    ctx.lineTo(-2, -26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(2, -26);
    ctx.lineTo(8, -28);
    ctx.stroke();
  } else {
    // Open mouth
    // Lower jaw
    ctx.fillStyle = '#7B1FA2';
    ctx.beginPath();
    ctx.ellipse(5, -15, 18, 10, 0.2, 0, Math.PI);
    ctx.fill();

    // Upper head
    ctx.fillStyle = '#9C27B0';
    ctx.beginPath();
    ctx.ellipse(5, -25, 18, 12, 0.2, Math.PI, 0);
    ctx.fill();

    // Teeth
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(-8 + i * 8, -15);
      ctx.lineTo(-5 + i * 8, -20);
      ctx.lineTo(-2 + i * 8, -15);
      ctx.closePath();
      ctx.fill();
    }

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-2, -30, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(10, -30, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(-1, -30, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(11, -30, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Draw a plant card icon (smaller version for toolbar) */
export function drawPlantIcon(
  ctx: CanvasRenderingContext2D,
  type: PlantType,
  x: number,
  y: number,
  size: number,
): void {
  ctx.save();
  ctx.translate(x, y);
  const scale = size / 60;
  ctx.scale(scale, scale);

  switch (type) {
    case PlantType.SUNFLOWER:
      drawSunflower(ctx, 0);
      break;
    case PlantType.PEASHOOTER:
      drawPeashooter(ctx, 0);
      break;
    case PlantType.WALLNUT:
      drawWallnut(ctx, 4000, 4000);
      break;
    case PlantType.SNOW_PEA:
      drawSnowPea(ctx, 0);
      break;
    case PlantType.CHERRY_BOMB:
      drawCherryBomb(ctx);
      break;
    case PlantType.REPEATER:
      drawRepeater(ctx, 0);
      break;
    case PlantType.POTATO_MINE:
      drawPotatoMine(ctx, true);
      break;
    case PlantType.CHOMPER:
      drawChomper(ctx, 0, 0);
      break;
  }

  ctx.restore();
}
