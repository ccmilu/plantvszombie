import type { EventBus } from '../engine/events/EventBus.ts'
import { GameEvent } from '../types/enums.ts'
import { AudioManager } from './AudioManager.ts'

/**
 * 将 EventBus 事件映射到 AudioManager 音效播放。
 * 返回清理函数，用于销毁时移除所有监听器。
 */
export function createSoundBridge(eventBus: EventBus): () => void {
  const audio = AudioManager.getInstance()

  const mappings: Array<{ event: string; handler: () => void }> = [
    { event: GameEvent.PLANT_PLACED, handler: () => audio.play('plantPlace') },
    { event: GameEvent.COLLECT_SUN, handler: () => audio.play('sunCollect') },
    { event: GameEvent.SHOVEL_USED, handler: () => audio.play('shovel') },
    {
      event: GameEvent.GAME_WON,
      handler: () => {
        audio.play('gameWon')
        audio.stopBGM()
      },
    },
    {
      event: GameEvent.GAME_LOST,
      handler: () => {
        audio.play('gameLost')
        audio.stopBGM()
      },
    },
    { event: GameEvent.PROJECTILE_FIRED, handler: () => audio.play('shoot') },
    { event: GameEvent.PROJECTILE_HIT, handler: () => audio.play('hit') },
    { event: GameEvent.EXPLOSION, handler: () => audio.play('explosion') },
    { event: GameEvent.ZOMBIE_DIED, handler: () => audio.play('zombieDie') },
    { event: GameEvent.ZOMBIE_BITE, handler: () => audio.play('zombieBite') },
    { event: GameEvent.ARMOR_BREAK, handler: () => audio.play('armorBreak') },
    { event: GameEvent.POLE_VAULT_JUMP, handler: () => audio.play('poleVault') },
    { event: GameEvent.LAWN_MOWER_ACTIVATED, handler: () => audio.play('lawnMower') },
    { event: GameEvent.SUN_PRODUCED, handler: () => audio.play('sunProduce') },
    { event: GameEvent.BUTTON_CLICK, handler: () => audio.play('buttonClick') },
  ]

  for (const { event, handler } of mappings) {
    eventBus.on(event, handler)
  }

  return () => {
    for (const { event, handler } of mappings) {
      eventBus.off(event, handler)
    }
  }
}
