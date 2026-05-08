'use client';

import { useState } from 'react';
import { Copy, Download, Code, RotateCcw, Check } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/css-extractor';

interface FooterActionsProps {
  output: string;
  onFormat: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function FooterActions({
  output,
  onFormat,
  onReset,
  disabled = false,
}: FooterActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, 'extracted-section.html', 'text/html');
  };

  const buttonBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '500',
    transition: 'all 0.2s',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const outlineButtonStyle = {
    ...buttonBaseStyle,
    background: 'none',
    border: '1px solid rgba(255,255,255,0.07)',
    color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
  };

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    background: disabled || !output ? 'rgba(255,255,255,0.1)' : '#fff',
    border: 'none',
    color: disabled || !output ? 'rgba(255,255,255,0.3)' : '#000',
    boxShadow: disabled || !output ? 'none' : 'var(--shadow-btn)',
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 md:left-[240px]"
      style={{ 
        background: 'rgba(14, 14, 14, 0.95)', 
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center justify-between gap-4 p-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            disabled={disabled}
            style={outlineButtonStyle}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onFormat}
            disabled={disabled || !output}
            style={outlineButtonStyle}
          >
            <Code className="h-4 w-4" />
            <span className="hidden sm:inline">Format</span>
          </button>
          <button
            onClick={handleCopy}
            disabled={disabled || !output}
            style={outlineButtonStyle}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" style={{ color: '#2ECC71' }} />
                <span className="hidden sm:inline" style={{ color: '#2ECC71' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            disabled={disabled || !output}
            style={primaryButtonStyle}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </div>
    </div>
  );
}
