
import { CaptionSegment } from "../types";

const formatTime = (seconds: number): string => {
  const date = new Date(0);
  date.setSeconds(seconds);
  const hh = date.getUTCHours().toString().padStart(2, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
  return `${hh}:${mm}:${ss},${ms}`;
};

export const convertToSRT = (segments: CaptionSegment[]): string => {
  return segments
    .map((segment, index) => {
      const start = formatTime(segment.startTime);
      const end = formatTime(segment.endTime);
      return `${index + 1}\n${start} --> ${end}\n${segment.text}\n`;
    })
    .join('\n');
};

export const downloadSRT = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.srt') ? filename : `${filename}.srt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
