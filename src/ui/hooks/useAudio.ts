import { useState, useCallback } from 'react';
import { AudioManager } from '../../audio/AudioManager';

export function useAudio(audio: AudioManager) {
  const [muted, setMuted] = useState(false);

  const toggleMute = useCallback(() => {
    const newMuted = !muted;
    setMuted(newMuted);
    audio.setMuted(newMuted);
  }, [muted, audio]);

  return { muted, toggleMute };
}
