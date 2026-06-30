"use client";

import { AnimatePresence } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { CharacterCard } from "./CharacterCard";
import { AddCharacterForm } from "./AddCharacterForm";
import type { Character } from "@/types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: Character[];
  onToggle: (id: string) => void;
  onAdd: (character: Character) => void;
  onDelete: (id: string) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  characters,
  onToggle,
  onAdd,
  onDelete,
  onEnableAll,
  onDisableAll,
}: SettingsModalProps) {
  const enabledCount = characters.filter((c) => c.enabled).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[rgba(197,146,26,0.5)] tracking-widest uppercase font-cinzel">
          {enabledCount} / {characters.length} enabled
        </p>
        <div className="flex gap-2">
          <button
            onClick={onEnableAll}
            className="text-xs text-[rgba(197,146,26,0.5)] hover:text-[#d4a843] transition-colors tracking-widest uppercase font-cinzel cursor-pointer"
          >
            All
          </button>
          <span className="text-[rgba(197,146,26,0.2)]">·</span>
          <button
            onClick={onDisableAll}
            className="text-xs text-[rgba(197,146,26,0.5)] hover:text-[#d4a843] transition-colors tracking-widest uppercase font-cinzel cursor-pointer"
          >
            None
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[rgba(197,146,26,0.3)] to-transparent mb-4" />

      {/* Character list */}
      <div className="space-y-2">
        <AnimatePresence>
          {characters.map((char) => (
            <CharacterCard
              key={char.id}
              character={char}
              onToggle={onToggle}
              onDelete={char.custom ? onDelete : undefined}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add custom character */}
      <AddCharacterForm onAdd={onAdd} />

      {/* Bottom note */}
      <p className="mt-5 text-[10px] text-[rgba(197,146,26,0.25)] tracking-widest uppercase text-center font-cinzel">
        Place images in /public/characters · Sounds in /public/sounds
      </p>
    </Modal>
  );
}
