
import { VoiceName, VoiceOption } from './types';

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: VoiceName.Kore, name: 'Kore', gender: 'Female', description: 'Clear, professional, and soothing. Ideal for educational content.' },
  { id: VoiceName.Puck, name: 'Puck', gender: 'Male', description: 'Youthful and energetic. Great for social media and ads.' },
  { id: VoiceName.Charon, name: 'Charon', gender: 'Male', description: 'Deep, authoritative, and cinematic. Perfect for narration.' },
  { id: VoiceName.Zephyr, name: 'Zephyr', gender: 'Female', description: 'Friendly and conversational. Best for tutorials.' },
  { id: VoiceName.Fenrir, name: 'Fenrir', gender: 'Male', description: 'Warm and trustworthy. Excellent for storytelling.' },
];

export const TONE_OPTIONS = [
  'Professional',
  'Excited',
  'Empathetic',
  'Authoritative',
  'Casual',
  'Urgent',
  'Storytelling'
];
