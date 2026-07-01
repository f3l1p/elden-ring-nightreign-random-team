"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlotColumn } from "./SlotColumn";
import { Button } from "@/components/ui/Button";
import { useSlotMachine } from "@/hooks/useSlotMachine";
import { useAudio } from "@/hooks/useAudio";
import type { Character } from "@/types";
import { getEnabledCharacters } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface SlotMachineProps {
  characters: Character[];
  onOpenSettings: () => void;
}

export function SlotMachine({ characters, onOpenSettings }: SlotMachineProps) {
  const enabledCharacters = getEnabledCharacters(characters);
  const { playSfx } = useAudio();

  const {
    spin,
    reset,
    results,
    stoppedColumns,
    isSpinning,
    isDone,
  } = useSlotMachine(enabledCharacters);

  const handleSpin = useCallback(() => {
    if (isDone) {
      reset();
      return;
    }
    playSfx("/sounds/grace.mp3");
    spin();
  }, [isDone, reset, spin, playSfx]);

  const canSpin = enabledCharacters.length >= 1 && !isSpinning;
  const noCharacters = enabledCharacters.length === 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:gap-6 w-full">
      {/* Machine frame */}
      <div className="relative">
        {/* Decorative top bar */}
        <div className="flex items-center justify-center gap-4 mb-7">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(197,146,26,0.6)]" />
          <div className="flex items-center gap-2">
            <span className="text-[#d4a843] opacity-60 text-xs">✦</span>
            <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#d4a843] opacity-70">
              Nightfarers
            </span>
            <span className="text-[#d4a843] opacity-60 text-xs">✦</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(197,146,26,0.6)]" />
        </div>

        {/* Three columns */}
        <div className="flex items-end justify-center gap-2 sm:gap-6">
          {([0, 1, 2] as const).map((i) => (
            <SlotColumn
              key={i}
              columnIndex={i}
              result={results[i]}
              isSpinning={isSpinning}
              hasStopped={stoppedColumns[i]}
              spinningCharacters={enabledCharacters}
              isDone={isDone}
            />
          ))}
        </div>

        {/* Decorative bottom bar */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(197,146,26,0.4)]" />
          <div className="w-2 h-2 rotate-45 border border-[rgba(197,146,26,0.5)]" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(197,146,26,0.4)]" />
        </div>
      </div>

      {/* Warning if no characters */}
      <AnimatePresence>
        {noCharacters && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="font-cinzel text-xs tracking-widest text-[#8a5e10] uppercase"
          >
            Enable at least one character in Settings
          </motion.p>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex flex-col items-center gap-3">
        {/* Spin button */}
        <motion.div
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.1 }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleSpin}
            disabled={!canSpin}
            className="min-w-[200px]"
            style={{
              letterSpacing: "0.25em",
              fontFamily: "var(--font-cinzel)",
            }}
          >
            {isDone ? (
              <>
                <RefreshCw size={18} className="shrink-0" />
                Reset
              </>
            ) : isSpinning ? (
              <>
                <SpinIndicator />
                Spinning...
              </>
            ) : (
              "Spin"
            )}
          </Button>
        </motion.div>

        {/* Settings button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenSettings}
          className="tracking-[0.2em]"
        >
          <GearIcon />
          Settings
        </Button>
      </div>

      {/* Victory shimmer particles */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            key="particles"
            className="absolute inset-0 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#d4a843]"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [-20, -80],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpinIndicator() {
  return (
    <motion.div
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    />
  );
}

function GearIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
