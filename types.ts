
export type AppView = 'upload' | 'studio' | 'export';

export interface ImageAdjustment {
  brightness: number;
  contrast: number;
  exposure: number;
  saturation: number;
  sharpness: number;
}

export interface TextLayer {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number;
  color: string;
  opacity: number;
}

export interface ManualCropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SmartCropSettings {
  aspectRatio: string;
  focus: 'face' | 'upper' | 'full' | 'object' | 'none' | 'manual';
}
