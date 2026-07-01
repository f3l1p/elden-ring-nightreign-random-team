"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { SlotMachine } from "@/components/SlotMachine/SlotMachine";
import { SettingsModal } from "@/components/Settings/SettingsModal";
import { SoundToggle } from "@/components/ui/SoundToggle";
import { AudioProvider } from "@/hooks/useAudio";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { DEFAULT_CHARACTERS } from "@/data/characters";
import type { Character } from "@/types";

export default function Home() {
  const [characters, setCharacters, isHydrated] = useLocalStorage<Character[]>(
    "nightreign-characters",
    DEFAULT_CHARACTERS
  );
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;
    const defaultsById = new Map(DEFAULT_CHARACTERS.map((c) => [c.id, c]));
    let needsUpdate = false;

    const reconciled = characters.map((c) => {
      const def = defaultsById.get(c.id);
      if (def && (def.image !== c.image || def.name !== c.name)) {
        needsUpdate = true;
        return { ...c, image: def.image, name: def.name };
      }
      return c;
    });

    const existingIds = new Set(characters.map((c) => c.id));
    const missing = DEFAULT_CHARACTERS.filter((c) => !existingIds.has(c.id));
    if (missing.length > 0) needsUpdate = true;

    if (needsUpdate) {
      setCharacters([...reconciled, ...missing]);
    }
  }, [isHydrated, characters, setCharacters]);

  const handleToggle = useCallback(
    (id: string) => {
      setCharacters((prev) =>
        prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
      );
    },
    [setCharacters]
  );

  const handleEnableAll = useCallback(() => {
    setCharacters((prev) => prev.map((c) => ({ ...c, enabled: true })));
  }, [setCharacters]);

  const handleDisableAll = useCallback(() => {
    setCharacters((prev) => prev.map((c) => ({ ...c, enabled: false })));
  }, [setCharacters]);

  return (
    <AudioProvider>
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-texture py-6 sm:py-8">
      <SoundToggle />

      {/* Ambient background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(197,146,26,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Vertical ornament lines */}
      <div
        className="absolute left-0 top-0 h-full w-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(197,146,26,0.15) 30%, rgba(197,146,26,0.15) 70%, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full w-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent, rgba(197,146,26,0.15) 30%, rgba(197,146,26,0.15) 70%, transparent)",
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 px-4 w-full max-w-4xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Title */}
        <div className="text-center">
          <motion.p
            className="font-cinzel text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[rgba(197,146,26,0.5)] mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Elden Ring
          </motion.p>
          <motion.h1
            className="font-cinzel font-black text-3xl sm:text-4xl tracking-[0.1em] uppercase leading-none"
            style={{
              background:
                "linear-gradient(180deg, #f5e6c0 0%, #d4a843 50%, #8a5e10 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(197,146,26,0.5))",
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Nightreign
          </motion.h1>
          <motion.p
            className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-[rgba(197,146,26,0.4)] mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Team Generator
          </motion.p>
        </div>

        {/* Horizontal divider */}
        <motion.div
          className="w-full max-w-xs flex items-center gap-3"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[rgba(197,146,26,0.5)]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[rgba(197,146,26,0.5)]" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[rgba(197,146,26,0.5)]" />
        </motion.div>

        {/* Slot Machine */}
        {isHydrated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="relative w-full"
          >
            <SlotMachine
              characters={characters}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        characters={characters}
        onToggle={handleToggle}
        onEnableAll={handleEnableAll}
        onDisableAll={handleDisableAll}
      />
    </main>
    </AudioProvider>
  );
}
