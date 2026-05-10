'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadCardProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  fileName?: string;
  onClear?: () => void;
  description?: string;
}

export function UploadCard({
  label,
  accept,
  onFileSelect,
  fileName,
  onClear,
  description,
}: UploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div
      className="group rounded-[28px] p-5 animate-card-in transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.14)]"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025)), rgb(22, 22, 22)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.22)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.08em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          {label}
        </span>
        {fileName && onClear && (
          <button
            onClick={onClear}
            className="h-6 w-6 rounded-md flex items-center justify-center transition-colors"
            style={{ 
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)'
            }}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {fileName ? (
        <div 
          className="flex items-center gap-3 rounded-[12px] p-4"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.07)' 
          }}
        >
          <div 
            className="w-9 h-9 rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(46,204,113,0.12)' }}
          >
            <FileText className="h-4 w-4" style={{ color: '#2ECC71' }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block truncate text-sm font-medium">{fileName}</span>
            <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>Ready</span>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'upload-zone min-h-[220px] flex flex-col items-center justify-center gap-3 py-8 cursor-pointer'
          )}
          style={{
            borderColor: isDragOver ? '#ff3700' : 'rgba(255,255,255,0.12)',
            background: isDragOver ? 'rgba(255,55,0,0.05)' : 'transparent',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-[18px] transition-transform duration-300 group-hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <Upload className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.5)' }} />
          </div>
          <div className="text-center">
            <span className="block text-sm font-medium mb-1">
              Drop file here or click to upload
            </span>
            {description && (
              <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {description}
              </span>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
