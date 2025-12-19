import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface TerminalProps {
  children: React.ReactNode;
  title?: string;
}

export function Terminal({ children, title }: TerminalProps) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500" />
        <div className="terminal-dot bg-yellow-500" />
        <div className="terminal-dot bg-green-500" />
        {title && <span className="ml-2 text-gray-400 text-xs">{title}</span>}
      </div>
      <div className="terminal-body">
        {children}
      </div>
    </div>
  );
}

interface CodeLineProps {
  comment?: string;
  command?: string;
  output?: string;
}

export function CodeLine({ comment, command, output }: CodeLineProps) {
  return (
    <div className="mb-1 last:mb-0">
      {comment && <div className="code-comment"># {comment}</div>}
      {command && <div className="code-command">$ {command}</div>}
      {output && <div className="code-output">{output}</div>}
    </div>
  );
}

interface CopyableCodeProps {
  code: string;
  className?: string;
}

export function CopyableCode({ code, className = '' }: CopyableCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 pr-12 overflow-x-auto font-mono text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-gray-200 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </div>
  );
}
