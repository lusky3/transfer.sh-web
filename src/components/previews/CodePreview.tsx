import { useState, useEffect } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';

interface CodePreviewProps {
  url: string;
  filename: string;
}

function getLanguage(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'jsx',
    ts: 'typescript',
    tsx: 'tsx',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    cs: 'csharp',
    php: 'php',
    swift: 'swift',
    kt: 'kotlin',
    scala: 'scala',
    sh: 'bash',
    bash: 'bash',
    zsh: 'bash',
    fish: 'bash',
    ps1: 'powershell',
    sql: 'sql',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    json: 'json',
    xml: 'xml',
    yaml: 'yaml',
    yml: 'yaml',
    toml: 'toml',
    md: 'markdown',
    dockerfile: 'docker',
    makefile: 'makefile',
  };
  return languageMap[ext] || 'text';
}

export function CodePreview({ url, filename }: CodePreviewProps) {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const language = getLanguage(filename);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load file');
        return res.text();
      })
      .then(setCode)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-gray-300" />
        )}
      </button>
      
      <div className="bg-gray-900 rounded-lg overflow-hidden max-h-[70vh] overflow-auto">
        <Highlight theme={themes.nightOwl} code={code} language={language}>
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={`${className} p-4 text-sm font-mono`} style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell pr-4 text-gray-500 select-none text-right w-12">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
}
