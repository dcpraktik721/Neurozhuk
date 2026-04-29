// ========================================
// Поймай Жука — Background Music Hook
// ========================================
// Manages an HTMLAudioElement for looping background music.
// Plays only when `enabled` AND `shouldPlay` are both true.
// Handles autoplay restrictions gracefully (silently ignores rejection).

'use client';

import { useEffect, useRef } from 'react';

interface UseBackgroundMusicOptions {
  /** Audio source URL (served from /public). */
  src: string;
  /** User-controlled toggle (e.g. from a UI button). */
  enabled: boolean;
  /** External condition — usually `gameState === 'playing' || 'paused'`. */
  shouldPlay: boolean;
  /** 0..1, default 0.4. */
  volume?: number;
}

export function useBackgroundMusic({
  src,
  enabled,
  shouldPlay,
  volume = 0.4,
}: UseBackgroundMusicOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialise audio element once per src change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Track volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [volume]);

  // Play / pause based on combined state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled && shouldPlay) {
      // play() returns a promise that may reject due to autoplay policy.
      // We trigger it from a user gesture (Start button), so it should succeed.
      audio.play().catch(() => {
        // Autoplay blocked — ignore silently. The music will start on the
        // next user-driven state change.
      });
    } else {
      audio.pause();
      // Reset position when stopping fully (not while paused mid-game)
      if (!shouldPlay) {
        audio.currentTime = 0;
      }
    }
  }, [enabled, shouldPlay]);
}
