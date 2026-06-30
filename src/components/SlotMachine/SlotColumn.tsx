"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Character } from "@/types";

interface SlotColumnProps {
  result: Character | null;
  isSpinning: boolean;
  hasStopped: boolean;
  spinningCharacters: Character[];
  columnIndex: number;
  isDone: boolean;
}

const PLACEHOLDER_COLOR = ["#1a1509", "#1a150c", "#160f06"];

export function SlotColumn({
  result,
  isSpinning,
  hasStopped,
  spinningCharacters,
  columnIndex,
  isDone,
}: SlotColumnProps) {
  const [displayedChars, setDisplayedChars] = useState<Character[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isSpinning && !hasStopped && spinningCharacters.length > 0) {
      intervalRef.current = setInterval(() => {
        setDisplayedChars(() => {
          const shuffled = [...spinningCharacters].sort(() => Math.random() - 0.5);
          return shuffled.slice(0, 5);
        });
      }, 80);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSpinning, hasStopped, spinningCharacters]);

  const showResult = hasStopped && result;
  const bgColor = PLACEHOLDER_COLOR[columnIndex] ?? "#1a1509";

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ minWidth: 0 }}
    >
      {/* Column slot frame */}
      <div
        className={`relative overflow-hidden border-2 transition-all duration-500 ${
          isDone && showResult
            ? "border-[#d4a843] victory-glow"
            : "border-[rgba(197,146,26,0.35)]"
        }`}
        style={{
          width: "clamp(80px, 16vw, 160px)",
          height: "clamp(120px, 24vw, 240px)",
          background: `linear-gradient(180deg, ${bgColor} 0%, #0f0c07 40%, #0a0805 100%)`,
        }}
      >
        {/* Top/bottom vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, #0a0805 0%, transparent 25%, transparent 75%, #0a0805 100%)",
          }}
        />

        {/* Spinning state */}
        <AnimatePresence mode="popLayout">
          {isSpinning && !hasStopped ? (
            <motion.div
              key="spinning"
              className="absolute inset-0 flex flex-col"
              initial={{ y: 0 }}
              animate={{ y: ["0%", "-100%"] }}
              transition={{
                duration: 0.08,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {displayedChars.map((char, i) => (
                <div
                  key={`${char.id}-${i}`}
                  className="flex flex-col items-center justify-center flex-shrink-0"
                  style={{ height: "33.333%", padding: "8px" }}
                >
                  <div className="relative w-full h-full opacity-70">
                    <Image
                      src={char.image}
                      alt={char.name}
                      fill
                      className="object-contain"
                      unoptimized
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : showResult ? (
            <motion.div
              key="result"
              className="absolute inset-0 flex flex-col items-center justify-center p-4 z-20"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative w-full flex-1">
                <Image
                  src={result.image}
                  alt={result.name}
                  fill
                  className="object-contain drop-shadow-lg"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              className="absolute inset-0 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col items-center gap-3 opacity-20">
                <div
                  className="border border-[#d4a843] rounded-full"
                  style={{ width: 48, height: 48 }}
                />
                <div className="w-16 h-px bg-[#d4a843]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Character name label */}
      <motion.div
        className="mt-2 text-center overflow-hidden"
        style={{ minHeight: 22 }}
      >
        <AnimatePresence mode="wait">
          {showResult && (
            <motion.p
              key={result.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-cinzel text-sm font-semibold tracking-widest uppercase text-[#d4a843]"
              style={{
                textShadow:
                  isDone
                    ? "0 0 12px rgba(212,168,67,0.8)"
                    : "none",
              }}
            >
              {result.name}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Column number indicator */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 font-cinzel text-xs tracking-widest opacity-30 text-[#d4a843]"
      >
        {["I", "II", "III"][columnIndex]}
      </div>
    </div>
  );
}
