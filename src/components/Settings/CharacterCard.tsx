"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Character } from "@/types";

interface CharacterCardProps {
  character: Character;
  onToggle: (id: string) => void;
}

export function CharacterCard({ character, onToggle }: CharacterCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative flex items-center gap-3 p-3 border transition-all duration-200 cursor-pointer ${
        character.enabled
          ? "border-[rgba(197,146,26,0.5)] bg-[rgba(197,146,26,0.05)]"
          : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] opacity-50"
      }`}
      onClick={() => onToggle(character.id)}
    >
      {/* Image */}
      <div
        className="relative flex-shrink-0 border border-[rgba(197,146,26,0.2)] overflow-hidden bg-[#0a0805]"
        style={{ width: 56, height: 56 }}
      >
        <Image
          src={character.image}
          alt={character.name}
          fill
          className="object-contain p-1"
          unoptimized
          onError={(e) => {
            const el = e.currentTarget.parentElement;
            if (el) {
              el.innerHTML = `<span style="font-family:var(--font-cinzel,serif);color:rgba(197,146,26,0.4);font-size:18px;display:flex;align-items:center;justify-content:center;height:100%">${character.name[0]}</span>`;
            }
          }}
        />
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-cinzel text-sm font-semibold tracking-wider uppercase truncate ${
            character.enabled ? "text-[#d4a843]" : "text-[rgba(197,146,26,0.4)]"
          }`}
        >
          {character.name}
        </p>
      </div>

      {/* Toggle */}
      <div
        className={`flex-shrink-0 w-10 h-6 rounded-full border transition-all duration-300 relative ${
          character.enabled
            ? "bg-[rgba(197,146,26,0.2)] border-[#c5921a]"
            : "bg-transparent border-[rgba(255,255,255,0.15)]"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
            character.enabled
              ? "left-4 bg-[#d4a843]"
              : "left-0.5 bg-[rgba(255,255,255,0.25)]"
          }`}
        />
      </div>
    </motion.div>
  );
}
