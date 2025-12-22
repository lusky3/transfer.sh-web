import { Music } from 'lucide-react';

interface AudioPreviewProps {
  readonly url: string;
  readonly filename: string;
}

export function AudioPreview({ url, filename }: AudioPreviewProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-8">
      <div className="flex flex-col items-center gap-6">
        <div className="w-32 h-32 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <Music className="w-16 h-16 text-gray-400" />
        </div>

        <p className="font-medium text-center break-all">{filename}</p>

        <audio controls className="w-full max-w-md">
          <source src={url} />
          <track kind="captions" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
