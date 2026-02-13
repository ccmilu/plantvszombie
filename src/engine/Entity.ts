import type { EntityType } from '../types/enums.ts'
import type { ComponentMap, ComponentKey } from '../types/index.ts'

let nextId = 0

export class Entity {
  readonly id: number
  readonly type: EntityType
  private components = new Map<string, unknown>()
  alive = true

  constructor(type: EntityType) {
    this.id = nextId++
    this.type = type
  }

  add<K extends ComponentKey>(key: K, component: ComponentMap[K]): this {
    this.components.set(key, component)
    return this
  }

  get<K extends ComponentKey>(key: K): ComponentMap[K] | undefined {
    return this.components.get(key) as ComponentMap[K] | undefined
  }

  has(key: ComponentKey): boolean {
    return this.components.has(key)
  }

  remove(key: ComponentKey): void {
    this.components.delete(key)
  }

  destroy(): void {
    this.alive = false
  }
}
