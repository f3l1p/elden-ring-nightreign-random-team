"use client";

import { useState, useCallback, useRef } from "react";
import type { Character, SpinState } from "@/types";
import { pickRandom } from "@/lib/utils";

const SPIN_DURATION = 2000;
const STOP_DELAY = 600;

export function useSlotMachine(enabledCharacters: Character[]) {
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [results, setResults] = useState<[Character | null, Character | null, Character | null]>([null, null, null]);
  const [stoppedColumns, setStoppedColumns] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const spin = useCallback(() => {
    if (enabledCharacters.length < 1) return;
    if (spinState === "spinning" || spinState === "stopping") return;

    clearTimeouts();

    const picked: [Character, Character, Character] = [
      pickRandom(enabledCharacters),
      pickRandom(enabledCharacters),
      pickRandom(enabledCharacters),
    ];

    setResults([null, null, null]);
    setStoppedColumns([false, false, false]);
    setSpinState("spinning");

    for (let i = 0; i < 3; i++) {
      const delay = SPIN_DURATION + i * STOP_DELAY;
      const t = setTimeout(() => {
        setResults((prev) => {
          const next = [...prev] as [Character | null, Character | null, Character | null];
          next[i] = picked[i];
          return next;
        });
        setStoppedColumns((prev) => {
          const next = [...prev] as [boolean, boolean, boolean];
          next[i] = true;
          return next;
        });

        if (i === 2) {
          const doneT = setTimeout(() => setSpinState("done"), 300);
          timeoutsRef.current.push(doneT);
        } else {
          setSpinState("stopping");
        }
      }, delay);
      timeoutsRef.current.push(t);
    }
  }, [enabledCharacters, spinState]);

  const reset = useCallback(() => {
    clearTimeouts();
    setSpinState("idle");
    setResults([null, null, null]);
    setStoppedColumns([false, false, false]);
  }, []);

  const isSpinning = spinState === "spinning" || spinState === "stopping";
  const isDone = spinState === "done";

  return {
    spin,
    reset,
    results,
    stoppedColumns,
    isSpinning,
    isDone,
    spinState,
  };
}
