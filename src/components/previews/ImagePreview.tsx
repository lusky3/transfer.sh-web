import { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface ImagePreviewProps {
  readonly url: string;
  readonly filename: string;
}

export function ImagePreview({ url, filename }: ImagePreviewProps) {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const zoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  const rotate = () => setRotation(r => (r + 90) % 360);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button onClick={zoomOut} className="btn btn-ghost p-2" title="Zoom out">
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-sm text-gray-500">{Math.round(scale * 100)}%</span>
        <button onClick={zoomIn} className="btn btn-ghost p-2" title="Zoom in">
          <ZoomIn className="w-4 h-4" />
        </button>
        <button onClick={rotate} className="btn btn-ghost p-2" title="Rotate">
          <RotateCw className="w-4 h-4" />
        </button>
      </div>
      
      <div className="overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-[70vh]">
        <div className="flex items-center justify-center min-h-[200px]">
          <img
            src={url}
            alt={filename}
            className="max-w-full transition-transform duration-200"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
