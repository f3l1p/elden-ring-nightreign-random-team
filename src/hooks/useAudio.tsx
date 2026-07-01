"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface AudioContextValue {
  muted: boolean;
  toggleMute: () => void;
  playSfx: (src: string) => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

const MUTE_KEY = "nightreign-muted";
const THEME_SRC = "/sounds/theme.mp3";

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(MUTE_KEY);
    if (stored) setMuted(stored === "true");
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const audio = new Audio(THEME_SRC);
    audio.loop = true;
    audio.volume = 0.35;
    musicRef.current = audio;

    return () => {
      audio.pause();
      musicRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const audio = musicRef.current;
    if (!audio) return;

    audio.muted = muted;
    window.localStorage.setItem(MUTE_KEY, String(muted));

    if (muted) return;

    // Browsers block autoplay-with-sound until the user interacts with the
    // page, so retry playback on the first click/keypress/touch.
    const tryPlay = () => audio.play().catch(() => {});
    tryPlay();

    document.addEventListener("click", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });
    document.addEventListener("touchstart", tryPlay, { once: true });

    return () => {
      document.removeEventListener("click", tryPlay);
      document.removeEventListener("keydown", tryPlay);
      document.removeEventListener("touchstart", tryPlay);
    };
  }, [isHydrated, muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  const playSfx = useCallback(
    (src: string) => {
      if (muted) return;
      const sfx = new Audio(src);
      sfx.volume = 0.6;
      sfx.play().catch(() => {});
    },
    [muted]
  );

  const value = useMemo(
    () => ({ muted, toggleMute, playSfx }),
    [muted, toggleMute, playSfx]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
