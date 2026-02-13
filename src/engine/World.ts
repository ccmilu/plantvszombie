import { Entity } from './Entity';
import { EntityType } from '../types';

export class World {
  private entities: Map<number, Entity> = new Map();

  add(entity: Entity): Entity {
    this.entities.set(entity.id, entity);
    return entity;
  }

  remove(id: number): void {
    this.entities.delete(id);
  }

  get(id: number): Entity | undefined {
    return this.entities.get(id);
  }

  getAll(): Entity[] {
    return Array.from(this.entities.values());
  }

  getByType(type: EntityType): Entity[] {
    return this.getAll().filter(e => e.entityType === type && e.alive);
  }

  getAlive(): Entity[] {
    return this.getAll().filter(e => e.alive);
  }

  /** Get all plants at a specific grid position */
  getPlantAt(row: number, col: number): Entity | undefined {
    return this.getByType(EntityType.PLANT).find(e => {
      const gp = e.get('gridPosition');
      return gp && gp.row === row && gp.col === col;
    });
  }

  /** Get zombies in a specific row */
  getZombiesInRow(row: number): Entity[] {
    return this.getByType(EntityType.ZOMBIE).filter(e => {
      const gp = e.get('gridPosition');
      return gp && gp.row === row;
    });
  }

  /** Get plants in a specific row */
  getPlantsInRow(row: number): Entity[] {
    return this.getByType(EntityType.PLANT).filter(e => {
      const gp = e.get('gridPosition');
      return gp && gp.row === row;
    });
  }

  clear(): void {
    this.entities.clear();
  }

  get size(): number {
    return this.entities.size;
  }
}
