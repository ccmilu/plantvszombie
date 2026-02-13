import { World } from '../World';
import { Game } from '../Game';
import { Entity } from '../Entity';
import { EntityType, PlantType, ProjectileType } from '../../types';
import { gridToPixel, CELL_WIDTH, CELL_HEIGHT, GRID_OFFSET_X, GRID_OFFSET_Y, GRID_ROWS, GRID_COLS } from '../../utils/constants';

export function PlantBehaviorSystem(world: World, dt: number, game: Game): void {
  const plants = world.getByType(EntityType.PLANT);

  for (const plant of plants) {
    if (!plant.alive) continue;

    const plantType = plant.get('plantType');
    if (!plantType) continue;

    // Update animation timer
    plant.set('animTimer', (plant.get('animTimer') ?? 0) + dt);

    switch (plantType) {
      case PlantType.SUNFLOWER:
        updateSunflower(plant, dt, game);
        break;
      case PlantType.PEASHOOTER:
        updateShooter(plant, dt, game, world, false, false);
        break;
      case PlantType.SNOW_PEA:
        updateShooter(plant, dt, game, world, true, false);
        break;
      case PlantType.REPEATER:
        updateShooter(plant, dt, game, world, false, true);
        break;
      case PlantType.CHERRY_BOMB:
        updateCherryBomb(plant, world, game);
        break;
      case PlantType.POTATO_MINE:
        updatePotatoMine(plant, dt, world, game);
        break;
      case PlantType.CHOMPER:
        updateChomper(plant, dt, world, game);
        break;
      // WALLNUT: no behavior, just absorbs damage
    }
  }
}

function updateSunflower(plant: Entity, dt: number, game: Game): void {
  let timer = plant.get('sunTimer') ?? 24;
  timer -= dt;
  if (timer <= 0) {
    timer = 24;
    // Spawn sun near the sunflower
    const transform = plant.get('transform');
    if (transform) {
      const sun = new Entity(EntityType.SUN, {
        transform: {
          x: transform.x + (Math.random() - 0.5) * 20,
          y: transform.y - 30,
          width: 40,
          height: 40,
        },
        sunValue: 25,
        lifetime: 8,
        collectible: true,
        movement: { speed: 30, baseSpeed: 30, dx: 0, dy: 1 },
      });
      (sun.components as Record<string, unknown>).targetY = transform.y + 20;
      game.spawnEntity(sun);
    }
  }
  plant.set('sunTimer', timer);
}

function updateShooter(
  plant: Entity, dt: number, game: Game, world: World,
  isSnow: boolean, isDouble: boolean,
): void {
  const gp = plant.get('gridPosition');
  if (!gp) return;

  // Check if any zombie is in this row ahead of this plant
  const zombiesInRow = world.getZombiesInRow(gp.row);
  const transform = plant.get('transform');
  if (!transform) return;

  const hasTarget = zombiesInRow.some(z => {
    const zt = z.get('transform');
    return zt && zt.x > transform.x;
  });

  if (!hasTarget) return;

  let timer = plant.get('cooldownTimer') ?? 0;
  timer -= dt;
  if (timer <= 0) {
    timer = 1.4;
    // Shoot
    shootPea(game, transform.x + 25, transform.y - 15, gp.row, isSnow);
    if (isDouble) {
      // Second pea slightly delayed by offset
      shootPea(game, transform.x + 15, transform.y - 15, gp.row, false);
    }
  }
  plant.set('cooldownTimer', timer);
}

function shootPea(game: Game, x: number, y: number, row: number, isSnow: boolean): void {
  const pea = new Entity(EntityType.PROJECTILE, {
    transform: { x, y, width: 14, height: 14 },
    gridPosition: { row, col: -1 },
    projectileType: isSnow ? ProjectileType.SNOW_PEA : ProjectileType.PEA,
    movement: { speed: 300, baseSpeed: 300, dx: 1, dy: 0 },
    combat: { damage: 20, attackInterval: 0, attackTimer: 0, range: 0 },
  });
  game.spawnEntity(pea);
}

function updateCherryBomb(plant: Entity, world: World, game: Game): void {
  // Cherry bomb explodes immediately when placed
  const gp = plant.get('gridPosition');
  const transform = plant.get('transform');
  if (!gp || !transform) return;

  // Damage all zombies in 3x3 area
  const zombies = world.getByType(EntityType.ZOMBIE);
  for (const zombie of zombies) {
    const zgp = zombie.get('gridPosition');
    const zt = zombie.get('transform');
    if (!zgp || !zt) continue;

    const rowDiff = Math.abs(zgp.row - gp.row);
    // Also check x proximity for zombies between columns
    const xDist = Math.abs(zt.x - transform.x);
    if (rowDiff <= 1 && xDist <= CELL_WIDTH * 1.5) {
      const health = zombie.get('health');
      if (health) {
        health.armor = 0;
        health.current -= 1800;
      }
    }
  }

  // Spawn explosion effect
  const effect = new Entity(EntityType.EFFECT, {
    transform: { x: transform.x, y: transform.y, width: CELL_WIDTH * 3, height: CELL_HEIGHT * 3 },
    lifetime: 0.5,
  });
  game.spawnEntity(effect);

  // Destroy the plant
  plant.destroy();
}

function updatePotatoMine(plant: Entity, dt: number, world: World, game: Game): void {
  if (!plant.get('isActive')) {
    // Arming timer
    let timer = plant.get('armedTimer') ?? 15;
    timer -= dt;
    if (timer <= 0) {
      plant.set('isActive', true);
    }
    plant.set('armedTimer', timer);
    return;
  }

  // Check collision with zombies in the same cell
  const gp = plant.get('gridPosition');
  const transform = plant.get('transform');
  if (!gp || !transform) return;

  const zombies = world.getZombiesInRow(gp.row);
  for (const zombie of zombies) {
    const zt = zombie.get('transform');
    if (!zt) continue;
    if (Math.abs(zt.x - transform.x) < CELL_WIDTH * 0.6) {
      // BOOM
      const health = zombie.get('health');
      if (health) {
        health.armor = 0;
        health.current -= 1800;
      }

      // Effect
      const effect = new Entity(EntityType.EFFECT, {
        transform: { x: transform.x, y: transform.y, width: 80, height: 80 },
        lifetime: 0.5,
      });
      game.spawnEntity(effect);

      plant.destroy();
      return;
    }
  }
}

function updateChomper(plant: Entity, dt: number, world: World, game: Game): void {
  const chompTimer = plant.get('chompTimer') ?? 0;

  if (chompTimer > 0) {
    // Currently chewing
    plant.set('chompTimer', chompTimer - dt);
    return;
  }

  // Look for zombies in the cell directly ahead
  const gp = plant.get('gridPosition');
  const transform = plant.get('transform');
  if (!gp || !transform) return;

  const zombies = world.getZombiesInRow(gp.row);
  for (const zombie of zombies) {
    const zt = zombie.get('transform');
    if (!zt) continue;
    // Chomp range: the next cell
    if (zt.x > transform.x && zt.x - transform.x < CELL_WIDTH * 1.2) {
      // Instant kill
      const health = zombie.get('health');
      if (health) {
        health.armor = 0;
        health.current = 0;
      }
      plant.set('chompTimer', 42);
      return;
    }
  }
}
