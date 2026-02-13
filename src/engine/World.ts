import { Entity } from './Entity.ts'
import type { EntityType } from '../types/enums.ts'
import type { ComponentKey } from '../types/index.ts'

export class World {
  private entities = new Map<number, Entity>()

  add(entity: Entity): void {
    this.entities.set(entity.id, entity)
  }

  remove(id: number): void {
    this.entities.delete(id)
  }

  get(id: number): Entity | undefined {
    return this.entities.get(id)
  }

  /** 获取所有存活实体 */
  all(): Entity[] {
    return Array.from(this.entities.values()).filter(e => e.alive)
  }

  /** 按实体类型查询 */
  byType(type: EntityType): Entity[] {
    return this.all().filter(e => e.type === type)
  }

  /** 按组件查询（拥有所有指定组件的实体） */
  withComponents(...keys: ComponentKey[]): Entity[] {
    return this.all().filter(e => keys.every(k => e.has(k)))
  }

  /** 清除所有已死亡实体 */
  cleanup(): void {
    for (const [id, entity] of this.entities) {
      if (!entity.alive) {
        this.entities.delete(id)
      }
    }
  }

  /** 清空世界 */
  clear(): void {
    this.entities.clear()
  }

  get size(): number {
    return this.entities.size
  }
}
