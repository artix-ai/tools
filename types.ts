
export interface CaptionSegment {
  startTime: number; // In seconds
  endTime: number;   // In seconds
  text: string;
}

export interface TranscriptionResult {
  segments: CaptionSegment[];
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
