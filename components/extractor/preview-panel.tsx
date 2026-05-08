'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';

type Viewport = 'mobile' | 'tablet' | 'desktop';

interface PreviewPanelProps {
  html: string;
  className?: string;
}

const viewportConfig: Record<Viewport, { width: string; icon: React.ReactNode; label: string }> = {
  mobile: { width: '375px', icon: <Smartphone className="h-4 w-4" />, label: 'Mobile' },
  tablet: { width: '768px', icon: <Tablet className="h-4 w-4" />, label: 'Tablet' },
  desktop: { width: '100%', icon: <Monitor className="h-4 w-4" />, label: 'Desktop' },
};

export function PreviewPanel({ html, className }: PreviewPanelProps) {
  const [viewport, setViewport] = useState<Viewport>('desktop');
  const [key, setKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleRefresh = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html, key]);

  return (
    <div 
      className={`rounded-[24px] p-5 animate-card-in ${className || ''}`}
      style={{ 
        background: 'rgb(22, 22, 22)', 
        border: '1px solid rgba(255,255,255,0.07)' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold tracking-[-0.02em]">Live Preview</h3>
        <div className="flex items-center gap-1">
          {(Object.keys(viewportConfig) as Viewport[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              title={viewportConfig[v].label}
              className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all"
              style={{
                background: viewport === v ? 'rgba(255,255,255,0.08)' : 'transparent',
                border: viewport === v ? '1px solid rgba(255,255,255,0.12)' : '1px solid transparent',
                color: viewport === v ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {viewportConfig[v].icon}
            </button>
          ))}
          <div className="mx-2 h-4 w-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
          <button
            onClick={handleRefresh}
            title="Refresh preview"
            className="w-8 h-8 rounded-[8px] flex items-center justify-center transition-all"
            style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div 
        className="rounded-[12px] overflow-hidden"
        style={{ background: '#fff' }}
      >
        <div
          className="mx-auto min-h-[400px] transition-all duration-300"
          style={{ width: viewportConfig[viewport].width }}
        >
          <iframe
            ref={iframeRef}
            key={key}
            className="h-[400px] w-full border-0"
            title="Preview"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
}
