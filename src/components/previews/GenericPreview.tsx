import { FileIcon, FileText, FileArchive, FileSpreadsheet } from 'lucide-react';

interface GenericPreviewProps {
  readonly filename: string;
  readonly contentType: string;
}

function getFileIcon(contentType: string, filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase() || '';

  if (
    contentType.includes('zip') ||
    contentType.includes('tar') ||
    contentType.includes('rar') ||
    ['zip', 'tar', 'gz', 'rar', '7z', 'bz2'].includes(ext)
  ) {
    return FileArchive;
  }

  if (contentType.includes('spreadsheet') || ['xlsx', 'xls', 'csv'].includes(ext)) {
    return FileSpreadsheet;
  }

  if (contentType.includes('text') || contentType.includes('document')) {
    return FileText;
  }

  return FileIcon;
}

export function GenericPreview({ filename, contentType }: GenericPreviewProps) {
  const Icon = getFileIcon(contentType, filename);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-12">
      <div className="flex flex-col items-center gap-4">
        <Icon className="w-24 h-24 text-gray-400" />
        <p className="text-lg font-medium text-center break-all">{filename}</p>
        <p className="text-sm text-gray-500">{contentType}</p>
        <p className="text-sm text-gray-400">Preview not available for this file type</p>
      </div>
    </div>
  );
}
