// ========================================
// Поймай Жука — Background Music Hook
// ========================================
// Manages an HTMLAudioElement for looping background music.
// Plays only when `enabled` AND `shouldPlay` are both true.
// Handles autoplay restrictions gracefully (silently ignores rejection).

'use client';

import { useCallback, useEffect, useRef } from 'react';

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

interface UseBackgroundMusicControls {
  playNow: () => void;
  pauseNow: (reset?: boolean) => void;
}

function attemptPlay(audio: HTMLAudioElement) {
  return audio.play().catch(() => {
    // Autoplay blocked — ignore silently. The next direct user gesture
    // (start/resume/toggle) will attempt playback again.
  });
}

export function useBackgroundMusic({
  src,
  enabled,
  shouldPlay,
  volume = 0.4,
}: UseBackgroundMusicOptions): UseBackgroundMusicControls {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cleanupAudioRef = useRef<(() => void) | null>(null);
  const pendingPlayRef = useRef(false);
  const latestStateRef = useRef({ enabled, shouldPlay, volume });

  useEffect(() => {
    latestStateRef.current = { enabled, shouldPlay, volume };
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, [enabled, shouldPlay, volume]);

  const playAudio = useCallback((audio: HTMLAudioElement) => {
    if (!latestStateRef.current.enabled) return;
    pendingPlayRef.current = true;
    void attemptPlay(audio).finally(() => {
      pendingPlayRef.current = false;
    });
  }, []);

  const ensureAudio = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = Math.max(0, Math.min(1, latestStateRef.current.volume));

    const handleCanPlayThrough = () => {
      if (
        pendingPlayRef.current &&
        latestStateRef.current.enabled &&
        latestStateRef.current.shouldPlay
      ) {
        playAudio(audio);
      }
    };

    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.load();
    audioRef.current = audio;
    cleanupAudioRef.current = () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
    };

    return audio;
  }, [playAudio, src]);

  // Initialise audio element once per src change so the first Start click
  // does not have to create and fetch the MP3 from scratch.
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    return () => {
      cleanupAudioRef.current?.();
      cleanupAudioRef.current = null;
      audio.pause();
      audio.src = '';
      audio.load();
      audioRef.current = null;
    };
  }, [ensureAudio]);

  // Play / pause based on combined state
  useEffect(() => {
    const audio = ensureAudio();
    if (!audio) return;

    if (enabled && shouldPlay) {
      playAudio(audio);
    } else {
      audio.pause();
      // Reset position when stopping fully (not while paused mid-game)
      if (!shouldPlay) {
        audio.currentTime = 0;
      }
    }
  }, [enabled, ensureAudio, playAudio, shouldPlay]);

  return {
    playNow() {
      const audio = ensureAudio();
      if (!audio || !enabled) return;
      playAudio(audio);
    },
    pauseNow(reset = false) {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      if (reset) {
        audio.currentTime = 0;
      }
    },
  };
}
