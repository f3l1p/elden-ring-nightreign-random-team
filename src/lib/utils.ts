import type { Character } from "@/types";

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getEnabledCharacters(characters: Character[]): Character[] {
  return characters.filter((c) => c.enabled);
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
