import { Download, Copy, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ImagePreview } from '../components/previews/ImagePreview';
import { VideoPreview } from '../components/previews/VideoPreview';
import { AudioPreview } from '../components/previews/AudioPreview';
import { CodePreview } from '../components/previews/CodePreview';
import { MarkdownPreview } from '../components/previews/MarkdownPreview';
import { GenericPreview } from '../components/previews/GenericPreview';
import { getConfig, type DownloadConfig } from '../types/config';
import { useTheme } from '../hooks/useTheme';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function DownloadPage() {
  useTheme();
  const config = getConfig<DownloadConfig>();
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionToken, setDeletionToken] = useState('');
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(config.downloadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!deletionToken) return;

    setDeleteStatus('loading');
    try {
      const response = await fetch(`${config.downloadUrl}/${deletionToken}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteStatus('success');
      } else {
        setDeleteStatus('error');
      }
    } catch {
      setDeleteStatus('error');
    }
  };

  const renderPreview = () => {
    switch (config.previewType) {
      case 'image':
        return <ImagePreview url={config.downloadUrl} filename={config.filename} />;
      case 'video':
        return <VideoPreview url={config.downloadUrl} contentType={config.contentType} />;
      case 'audio':
        return <AudioPreview url={config.downloadUrl} filename={config.filename} />;
      case 'code':
        return <CodePreview url={config.downloadUrl} filename={config.filename} />;
      case 'markdown':
        return <MarkdownPreview url={config.downloadUrl} />;
      case 'sandbox':
        return <GenericPreview filename={config.filename} contentType={config.contentType} />;
      default:
        return <GenericPreview filename={config.filename} contentType={config.contentType} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showUploadLink />

      <main id="main-content" className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* File Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 break-all">{config.filename}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{config.contentType}</span>
              <span>{formatBytes(Number.parseInt(config.contentLength, 10) || 0)}</span>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">{renderPreview()}</div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <a href={config.downloadUrl} download={config.filename} className="btn btn-primary">
              <Download className="w-4 h-4" />
              Download
            </a>

            <button onClick={handleCopy} className="btn btn-secondary">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-ghost text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Delete File</h2>

            {deleteStatus === 'success' ? (
              <div className="text-center py-4">
                <Check className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>File deleted successfully</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Enter the deletion token to permanently delete this file.
                </p>

                <input
                  type="text"
                  value={deletionToken}
                  onChange={(e) => setDeletionToken(e.target.value)}
                  placeholder="Deletion token"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 mb-4"
                />

                {deleteStatus === 'error' && (
                  <p className="text-red-500 text-sm mb-4">
                    Failed to delete file. Please check your deletion token.
                  </p>
                )}

                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={!deletionToken || deleteStatus === 'loading'}
                    className="btn bg-red-600 text-white hover:bg-red-700"
                  >
                    {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
