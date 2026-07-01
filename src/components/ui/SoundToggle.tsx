"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

export function SoundToggle() {
  const { muted, toggleMute } = useAudio();

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      aria-pressed={muted}
      className="fixed top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(197,146,26,0.3)] bg-[rgba(15,12,7,0.7)] text-[#d4a843] backdrop-blur-sm transition-all duration-200 hover:border-[#d4a843] hover:bg-[rgba(197,146,26,0.1)] cursor-pointer"
    >
      {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
    </button>
  );
}
