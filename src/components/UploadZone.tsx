import { useState, useCallback, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileIcon, Loader2, Copy, Check } from 'lucide-react';
import { getConfig } from '../types/config';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  url?: string;
  deletionToken?: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface CopyButtonProps {
  readonly text: string;
  readonly label?: string;
  readonly className?: string;
}

function CopyButton({ text, label, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Copied!' : `Copy ${label || 'to clipboard'}`}
      className={`inline-flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${className}`}
    >
      {copied ? (
        <Check className="w-3 h-3 text-green-500" aria-hidden="true" />
      ) : (
        <Copy className="w-3 h-3" aria-hidden="true" />
      )}
    </button>
  );
}

interface UploadResult {
  url: string;
  deletionToken?: string;
}

function createFileUploader(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.onload = () => {
      if (xhr.status === 200) {
        const url = xhr.responseText.trim();
        const deletionToken = xhr.getResponseHeader('X-Url-Delete')?.split('/').pop();
        resolve({ url, deletionToken });
      } else {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };

    xhr.onerror = () => reject(new Error('Upload failed'));

    xhr.open('PUT', './' + file.name, true);
    xhr.send(file);
  });
}

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const config = getConfig();

  const updateFile = useCallback((id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      const id = crypto.randomUUID();
      const uploadedFile: UploadedFile = {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      };

      setFiles((prev) => [...prev, uploadedFile]);

      try {
        const result = await createFileUploader(file, (progress) => updateFile(id, { progress }));
        updateFile(id, {
          status: 'complete',
          url: result.url,
          deletionToken: result.deletionToken,
          progress: 100,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        updateFile(id, { status: 'error', error: message });
      }
    },
    [updateFile]
  );

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      Array.from(fileList).forEach(uploadFile);
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const completedFiles = files.filter(
    (f): f is UploadedFile & { url: string } => f.status === 'complete' && f.url !== undefined
  );
  const downloadAllBase =
    completedFiles.length > 1
      ? `${config.webAddress}(${completedFiles.map((f) => new URL(f.url).pathname).join(',')})`
      : null;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        aria-label="Upload files by dropping them here or clicking to browse"
        className={`
          relative w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          aria-label="File input"
        />

        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-primary-500' : 'text-gray-400'}`}
          aria-hidden="true"
        />

        <p className="text-lg font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or <span className="text-primary-600 dark:text-primary-400">browse</span> to upload
        </p>
      </button>

      {files.length > 0 && (
        <div className="space-y-2" role="list" aria-label="Uploaded files">
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {files.filter((f) => f.status === 'uploading').length > 0 &&
              `Uploading ${files.filter((f) => f.status === 'uploading').length} file(s)`}
            {files.filter((f) => f.status === 'complete').length > 0 &&
              `${files.filter((f) => f.status === 'complete').length} file(s) uploaded successfully`}
            {files.filter((f) => f.status === 'error').length > 0 &&
              `${files.filter((f) => f.status === 'error').length} file(s) failed to upload`}
          </div>
          {files.map((file) => (
            <div
              key={file.id}
              role="listitem"
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <FileIcon className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {file.status === 'complete' && file.url ? (
                    <>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium truncate text-primary-600 dark:text-primary-400 hover:underline"
                      >
                        {file.name}
                      </a>
                      <CopyButton text={file.url} label="link" className="text-gray-400" />
                    </>
                  ) : (
                    <span className="font-medium truncate">{file.name}</span>
                  )}
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatBytes(file.size)}
                  </span>
                </div>

                {file.status === 'uploading' && (
                  <div
                    className="mt-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    role="progressbar"
                    aria-valuenow={file.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Upload progress: ${file.progress}%`}
                  >
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {file.status === 'complete' && file.deletionToken && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    Deletion token:{' '}
                    <code className="bg-gray-200 dark:bg-gray-800 px-1 rounded">
                      {file.deletionToken}
                    </code>
                    <CopyButton text={file.deletionToken} label="deletion token" />
                  </p>
                )}

                {file.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{file.error}</p>
                )}
              </div>

              <div className="flex-shrink-0">
                {file.status === 'uploading' && (
                  <Loader2 className="w-5 h-5 text-primary-500 animate-spin" aria-hidden="true" />
                )}
                {file.status === 'complete' && (
                  <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" aria-hidden="true" />
                )}
              </div>

              <button
                onClick={() => removeFile(file.id)}
                aria-label="Remove file"
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          {downloadAllBase && (
            <div className="flex gap-2 pt-2">
              <a href={`${downloadAllBase}.zip`} className="btn btn-secondary text-sm">
                Download all as ZIP
              </a>
              <a href={`${downloadAllBase}.tar.gz`} className="btn btn-secondary text-sm">
                Download all as TAR.GZ
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
