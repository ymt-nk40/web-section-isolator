'use client';

interface OutputPanelProps {
  title: string;
  content: string;
  className?: string;
}

export function OutputPanel({ title, content, className }: OutputPanelProps) {
  const lines = content.split('\n').length;
  const chars = content.length;

  return (
    <div 
      className={`rounded-[24px] p-5 animate-card-in ${className || ''}`}
      style={{ 
        background: 'rgb(22, 22, 22)', 
        border: '1px solid rgba(255,255,255,0.07)' 
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold tracking-[-0.02em]">{title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {lines} lines
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {chars.toLocaleString()} chars
          </span>
        </div>
      </div>
      <div 
        className="rounded-[12px] p-4 overflow-auto max-h-[400px] font-mono text-[13px] leading-[1.7]"
        style={{ 
          background: 'rgb(18, 18, 18)', 
          border: '1px solid rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.7)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        <pre className="whitespace-pre-wrap break-words">{content}</pre>
      </div>
    </div>
  );
}
