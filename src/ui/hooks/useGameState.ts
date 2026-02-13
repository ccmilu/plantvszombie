import { useState, useEffect } from 'react'
import type { EventBus } from '../../engine/events/EventBus.ts'
import { GameEvent, GameState } from '../../types/enums.ts'

export function useGameState(eventBus: EventBus | null) {
  const [sun, setSun] = useState(50)
  const [gameState, setGameState] = useState<GameState>(GameState.MENU)
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({})
  const [waveProgress, setWaveProgress] = useState({ current: 0, total: 0 })

  useEffect(() => {
    if (!eventBus) return

    const onSunChanged = (value: number) => setSun(value as number)
    const onStateChanged = (state: GameState) => setGameState(state as GameState)
    const onCooldownUpdate = (data: Record<string, number>) => setCooldowns({ ...data } as Record<string, number>)
    const onWaveProgress = (current: number, total: number) => setWaveProgress({ current: current as number, total: total as number })

    eventBus.on(GameEvent.SUN_CHANGED, onSunChanged as (...args: unknown[]) => void)
    eventBus.on(GameEvent.STATE_CHANGED, onStateChanged as (...args: unknown[]) => void)
    eventBus.on(GameEvent.COOLDOWN_UPDATE, onCooldownUpdate as (...args: unknown[]) => void)
    eventBus.on(GameEvent.WAVE_PROGRESS, onWaveProgress as (...args: unknown[]) => void)

    return () => {
      eventBus.off(GameEvent.SUN_CHANGED, onSunChanged as (...args: unknown[]) => void)
      eventBus.off(GameEvent.STATE_CHANGED, onStateChanged as (...args: unknown[]) => void)
      eventBus.off(GameEvent.COOLDOWN_UPDATE, onCooldownUpdate as (...args: unknown[]) => void)
      eventBus.off(GameEvent.WAVE_PROGRESS, onWaveProgress as (...args: unknown[]) => void)
    }
  }, [eventBus])

  return { sun, gameState, cooldowns, waveProgress }
}
