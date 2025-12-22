import { FileQuestion } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

export function NotFoundPage() {
  useTheme();

  return (
    <div className="min-h-screen flex flex-col">
      <Header showUploadLink />

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center px-4">
          <FileQuestion className="w-24 h-24 mx-auto mb-6 text-gray-300 dark:text-gray-700" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">File not found</p>
          <a href="/" className="btn btn-primary">
            Upload a file
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
