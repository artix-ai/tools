
export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Kore_Male = 'Kore', // Mapping aliases for UI
  Zephyr = 'Zephyr',
  Fenrir = 'Fenrir'
}

export interface VoiceOption {
  id: VoiceName;
  name: string;
  gender: 'Male' | 'Female';
  description: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  audioUrl: string | null;
  optimizedScript: string | null;
}

export interface HinglishConfig {
  voice: VoiceName;
  tone: string;
  speed: number;
}
