import { Entity } from '../../engine/Entity';
import { EntityType, EffectType } from '../../types';
import { drawExplosion } from '../sprites/EffectSprites';

export function drawEffects(ctx: CanvasRenderingContext2D, entities: Entity[]): void {
  const effects = entities.filter(e => e.entityType === EntityType.EFFECT && e.alive);

  for (const effect of effects) {
    const transform = effect.get('transform');
    if (!transform) continue;

    const lifetime = effect.get('lifetime') ?? 0;
    // Effects have max lifetime of ~0.5s, so progress is calculated based on remaining time
    const maxLifetime = 0.5;
    const progress = 1 - (lifetime / maxLifetime);

    const entityType = effect.components.entityType;
    if (entityType === EntityType.EFFECT) {
      drawExplosion(ctx, transform.x, transform.y, 80, progress);
    }
  }
}
