import { Upload } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { getConfig } from '../types/config';

interface HeaderProps {
  showUploadLink?: boolean;
}

export function Header({ showUploadLink = false }: HeaderProps) {
  const config = getConfig();

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="/" className="flex items-center gap-2 text-xl font-semibold">
            <Upload className="w-6 h-6 text-primary-600" />
            <span>{config.hostname}</span>
          </a>
          
          <div className="flex items-center gap-4">
            {showUploadLink && (
              <a href="/" className="btn btn-ghost text-sm">
                Upload Files
              </a>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
