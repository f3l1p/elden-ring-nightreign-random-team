export interface Character {
  id: string;
  name: string;
  image: string;
  enabled: boolean;
}

export type SpinState = "idle" | "spinning" | "stopping" | "done";

export interface SlotColumnState {
  selectedCharacter: Character | null;
  isSpinning: boolean;
  hasStopped: boolean;
}
