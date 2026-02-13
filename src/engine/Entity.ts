import { ComponentMap, EntityType } from '../types';

let nextId = 1;

export class Entity {
  readonly id: number;
  readonly entityType: EntityType;
  components: ComponentMap;
  alive: boolean = true;

  constructor(entityType: EntityType, components: Partial<ComponentMap> = {}) {
    this.id = nextId++;
    this.entityType = entityType;
    this.components = { entityType, ...components };
  }

  get<K extends keyof ComponentMap>(key: K): ComponentMap[K] {
    return this.components[key];
  }

  set<K extends keyof ComponentMap>(key: K, value: ComponentMap[K]): void {
    this.components[key] = value;
  }

  has(key: keyof ComponentMap): boolean {
    return this.components[key] !== undefined;
  }

  destroy(): void {
    this.alive = false;
  }
}

export function resetEntityIds(): void {
  nextId = 1;
}
