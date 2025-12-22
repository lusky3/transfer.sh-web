import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useFetchContent } from '../../hooks/useFetchContent';
import { PreviewLoading, PreviewError, PreviewContainer } from './PreviewContainer';

interface MarkdownPreviewProps {
  readonly url: string;
}

// Simple markdown parser - handles basic formatting
function parseMarkdown(md: string): string {
  let html = md
    // Escape HTML
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-8 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto my-4"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">$1</code>')
    // Images (must come before links)
    .replace(/!\[([^\]]{0,500})\]\(([^)\s]{1,2000})\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
    // Links
    .replace(/\[([^\]]{1,500})\]\(([^)\s]{1,2000})\)/g, '<a href="$2" class="text-primary-600 dark:text-primary-400 hover:underline" target="_blank" rel="noopener">$1</a>')
    // Blockquotes
    .replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4">$1</blockquote>')
    // Horizontal rules
    .replace(/^---$/gim, '<hr class="my-8 border-gray-200 dark:border-gray-700" />')
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    // Line breaks
    .replaceAll('\n\n', '</p><p class="my-4">')
    .replaceAll('\n', '<br />');

  return `<p class="my-4">${html}</p>`;
}

export function MarkdownPreview({ url }: MarkdownPreviewProps) {
  const { data: rawContent, loading, error } = useFetchContent(url);
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (rawContent) {
      setContent(DOMPurify.sanitize(parseMarkdown(rawContent)));
    }
  }, [rawContent]);

  if (loading) return <PreviewLoading variant="bordered" />;
  if (error) return <PreviewError message={error} variant="bordered" />;

  return (
    <PreviewContainer variant="bordered" className="p-8 max-h-[70vh] overflow-auto">
      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </PreviewContainer>
  );
}
