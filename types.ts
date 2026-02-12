
export type AICategory = 
  | 'All'
  | 'Favorites'
  | 'Large Language Models'
  | 'Image Generation'
  | 'Video & Motion'
  | 'Audio & Music'
  | 'Coding & Development'
  | 'Marketing & SEO'
  | 'Business & Productivity'
  | 'Design & UI'
  | 'Research & Data'
  | 'Social Media'
  | 'Gaming'
  | 'Legal & Compliance';

export interface AITool {
  name: string;
  description: string;
  category: AICategory;
  url: string;
  isPremium?: boolean;
}

// Added missing Thumbnail Generator related types and enums
export enum ThumbnailStyle {
  VIRAL = 'viral',
  CINEMATIC = 'cinematic'
}

export enum Niche {
  TECH = 'tech',
  FINANCE = 'finance',
  GAMING = 'gaming',
  LIFESTYLE = 'lifestyle',
  EDUCATION = 'education',
  CRIME = 'true-crime'
}

export enum Expression {
  SHOCKED = 'shocked',
  CONFIDENT = 'confident',
  ANGRY = 'angry',
  HAPPY = 'happy',
  SAD = 'sad',
  SCARED = 'scared'
}

export interface ThumbnailConfig {
  headline: string;
  niche: Niche;
  expression: Expression;
  style: ThumbnailStyle;
  includeArrows: boolean;
  includeMoney: boolean;
  includeParticles: boolean;
  includeStamp: boolean;
}
