
import React, { useState, useEffect, useRef } from 'react';
import { ImageAdjustment, TextLayer, ManualCropArea } from '../types';

interface ImageCanvasProps {
  imageUrl: string | null;
  adjustments: ImageAdjustment;
  zoom?: number;
  textLayers?: TextLayer[];
  setTextLayers?: React.Dispatch<React.SetStateAction<TextLayer[]>>;
  manualCropArea?: ManualCropArea | null;
  setManualCropArea?: (area: ManualCropArea | null) => void;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ 
  imageUrl, 
  adjustments, 
  zoom = 100, 
  textLayers = [], 
  setTextLayers,
  manualCropArea, 
  setManualCropArea 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [dragState, setDragState] = useState<{ 
    type: 'text' | 'crop-move' | 'crop-resize'; 
    id?: string; 
    handle?: string;
    startX: number; 
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth?: number;
    initialHeight?: number;
  } | null>(null);

  if (!imageUrl) return null;

  const filterStyle = {
    filter: `
      brightness(${adjustments.brightness}%) 
      contrast(${adjustments.contrast}%) 
      saturate(${adjustments.saturation}%) 
      opacity(${adjustments.exposure / 100})
    `,
    transition: 'filter 0.15s ease-out',
  };

  const containerStyle = {
    transform: `scale(${zoom / 100})`,
    transformOrigin: 'top left',
  };

  const handleMouseDown = (e: React.MouseEvent, type: 'text' | 'crop-move' | 'crop-resize', id?: string, handle?: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    let initialX = 0;
    let initialY = 0;
    let initialWidth = 0;
    let initialHeight = 0;

    if (type === 'text' && id) {
      const layer = textLayers.find(l => l.id === id);
      if (layer) {
        initialX = layer.x;
        initialY = layer.y;
      }
    } else if (manualCropArea) {
      initialX = manualCropArea.x;
      initialY = manualCropArea.y;
      initialWidth = manualCropArea.width;
      initialHeight = manualCropArea.height;
    }

    setDragState({
      type,
      id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialX,
      initialY,
      initialWidth,
      initialHeight
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState || !imageRef.current) return;

      const rect = imageRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragState.startX) / rect.width) * 100;
      const deltaY = ((e.clientY - dragState.startY) / rect.height) * 100;

      if (dragState.type === 'text' && dragState.id && setTextLayers) {
        setTextLayers(prev => prev.map(l => l.id === dragState.id ? {
          ...l,
          x: Math.min(100, Math.max(0, dragState.initialX + deltaX)),
          y: Math.min(100, Math.max(0, dragState.initialY + deltaY))
        } : l));
      }

      if (manualCropArea && setManualCropArea) {
        if (dragState.type === 'crop-move') {
          setManualCropArea({
            ...manualCropArea,
            x: Math.min(100 - manualCropArea.width, Math.max(0, dragState.initialX + deltaX)),
            y: Math.min(100 - manualCropArea.height, Math.max(0, dragState.initialY + deltaY))
          });
        } else if (dragState.type === 'crop-resize') {
          let newX = manualCropArea.x;
          let newY = manualCropArea.y;
          let newW = manualCropArea.width;
          let newH = manualCropArea.height;

          const h = dragState.handle;
          if (h?.includes('right')) newW = Math.max(5, (dragState.initialWidth || 0) + deltaX);
          if (h?.includes('bottom')) newH = Math.max(5, (dragState.initialHeight || 0) + deltaY);
          if (h?.includes('left')) {
            const shiftX = Math.min(deltaX, (dragState.initialWidth || 0) - 5);
            newX = Math.max(0, dragState.initialX + shiftX);
            newW = (dragState.initialWidth || 0) - (newX - dragState.initialX);
          }
          if (h?.includes('top')) {
            const shiftY = Math.min(deltaY, (dragState.initialHeight || 0) - 5);
            newY = Math.max(0, dragState.initialY + shiftY);
            newH = (dragState.initialHeight || 0) - (newY - dragState.initialY);
          }

          setManualCropArea({ x: newX, y: newY, width: newW, height: newH });
        }
      }
    };

    const handleMouseUp = () => setDragState(null);

    if (dragState) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, textLayers, manualCropArea, setTextLayers, setManualCropArea]);

  return (
    <div style={containerStyle} className="transition-transform duration-100 ease-out" ref={containerRef}>
      <div className="relative">
        <img 
          ref={imageRef}
          src={imageUrl} 
          alt="ARTIX Workspace" 
          className="max-w-none h-auto block pointer-events-none"
          style={filterStyle}
        />
        
        {/* Manual Crop Overlay */}
        {manualCropArea && (
          <div 
            className="absolute border-2 border-rose-600 shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-40 cursor-grab active:cursor-grabbing"
            style={{
              left: `${manualCropArea.x}%`,
              top: `${manualCropArea.y}%`,
              width: `${manualCropArea.width}%`,
              height: `${manualCropArea.height}%`
            }}
            onMouseDown={(e) => handleMouseDown(e, 'crop-move')}
          >
            {/* Corner Handles */}
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'top-left')} className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-rose-600 cursor-nw-resize rounded-full z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'top-right')} className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-rose-600 cursor-ne-resize rounded-full z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'bottom-left')} className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white border-2 border-rose-600 cursor-sw-resize rounded-full z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'bottom-right')} className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-white border-2 border-rose-600 cursor-se-resize rounded-full z-50" />
            
            {/* Edge Handles */}
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'top')} className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 cursor-n-resize rounded-full hover:bg-white z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'bottom')} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 cursor-s-resize rounded-full hover:bg-white z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/50 cursor-w-resize rounded-full hover:bg-white z-50" />
            <div onMouseDown={(e) => handleMouseDown(e, 'crop-resize', undefined, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white/50 cursor-e-resize rounded-full hover:bg-white z-50" />

            <div className="absolute inset-0 border border-white/20 pointer-events-none" />
            <div className="absolute top-1/3 left-0 right-0 border-t border-white/10 pointer-events-none" />
            <div className="absolute top-2/3 left-0 right-0 border-t border-white/10 pointer-events-none" />
            <div className="absolute left-1/3 top-0 bottom-0 border-l border-white/10 pointer-events-none" />
            <div className="absolute left-2/3 top-0 bottom-0 border-l border-white/10 pointer-events-none" />
          </div>
        )}

        {/* Render Text Layers */}
        <div className="absolute inset-0 pointer-events-none">
          {textLayers.map(layer => (
            <div
              key={layer.id}
              className="absolute pointer-events-auto cursor-move select-none active:scale-95 transition-transform"
              onMouseDown={(e) => handleMouseDown(e, 'text', layer.id)}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                color: layer.color,
                fontSize: `${layer.fontSize}px`,
                fontWeight: '900',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'nowrap',
                textShadow: '0 4px 15px rgba(0,0,0,0.4)',
                transform: 'translate(-50%, -50%)',
                opacity: layer.opacity / 100
              }}
            >
              {layer.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageCanvas;
