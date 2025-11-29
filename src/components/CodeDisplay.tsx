import { useState, useMemo } from 'react';
import { Copy } from 'lucide-react';
import { highlightCode } from '../utils/syntaxHighlight';

interface CodeDisplayProps {
  code: string;
  className?: string;
  language?: string;
}

export default function CodeDisplay({ code, className, language }: CodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const tokens = useMemo(() => highlightCode(code), [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`relative bg-code-bg rounded-[5px] p-4 ${className}`}>
      <button
        onClick={handleCopy}
        className="absolute top-0 right-0 bg-transparent hover:text-primary-text text-secondary-text py-0.5 px-1 border border-secondary-text rounded-[5px] text-[10px]"
      >
        {isCopied ? (
          'Copied!'
        ) : (
          <div className="flex items-center">
            <Copy size={10} className="mr-1" />
            Copy
          </div>
        )}
      </button>
      <pre className="overflow-x-auto">
        <code className={language ? `language-${language}` : ''}>
          {tokens.map((token, index) => {
            if (token.type === 'plain') return token.content;
            return (
              <span key={index} className={`token-${token.type}`}>
                {token.content}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
