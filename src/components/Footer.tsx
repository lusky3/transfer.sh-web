import { Github, Mail } from 'lucide-react';
import { getConfig } from '../types/config';

export function Footer() {
  const config = getConfig();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} {config.hostname}. Easy file sharing from the command line.
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/dutchcoders/transfer.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            {config.emailContact && (
              <a
                href={`mailto:${config.emailContact}`}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
