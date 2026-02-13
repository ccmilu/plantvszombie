import { World } from '../World';
import { Game } from '../Game';
import { EntityType } from '../../types';

const ZOMBIE_BITE_DAMAGE = 100; // per second
const ZOMBIE_BITE_INTERVAL = 0.5; // seconds between bites

export function CombatSystem(world: World, dt: number, game: Game): void {
  const zombies = world.getByType(EntityType.ZOMBIE);

  for (const zombie of zombies) {
    if (!zombie.alive || !zombie.get('isEating')) continue;

    const targetId = zombie.get('targetEntityId');
    if (targetId === undefined) {
      zombie.set('isEating', false);
      continue;
    }

    const target = world.get(targetId);
    if (!target || !target.alive) {
      zombie.set('isEating', false);
      zombie.set('targetEntityId', undefined);
      continue;
    }

    // Bite timer
    let timer = zombie.get('cooldownTimer') ?? ZOMBIE_BITE_INTERVAL;
    timer -= dt;
    if (timer <= 0) {
      timer = ZOMBIE_BITE_INTERVAL;
      const health = target.get('health');
      if (health) {
        health.current -= ZOMBIE_BITE_DAMAGE * ZOMBIE_BITE_INTERVAL;
        if (health.current <= 0) {
          target.destroy();
          zombie.set('isEating', false);
          zombie.set('targetEntityId', undefined);
        }
      }
    }
    zombie.set('cooldownTimer', timer);
  }
}
