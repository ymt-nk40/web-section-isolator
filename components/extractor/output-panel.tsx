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
      className={`w-full min-w-0 max-w-full overflow-hidden rounded-[24px] p-5 animate-card-in ${className || ''}`}
      style={{ 
        background: 'rgb(22, 22, 22)', 
        border: '1px solid rgba(255,255,255,0.07)' 
      }}
    >
      <div className="mb-4 flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="min-w-0 truncate text-[15px] font-semibold tracking-[-0.02em]">{title}</h3>
        <div className="flex flex-shrink-0 items-center gap-4">
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {lines} lines
          </span>
          <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {chars.toLocaleString()} chars
          </span>
        </div>
      </div>
      <div 
        className="max-h-[400px] w-full min-w-0 max-w-full overflow-x-auto overflow-y-auto rounded-[12px] p-4 font-mono text-[13px] leading-[1.7]"
        style={{ 
          background: 'rgb(18, 18, 18)', 
          border: '1px solid rgba(255,255,255,0.05)',
          color: 'rgba(255,255,255,0.7)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        <pre className="min-w-max whitespace-pre break-normal"><code>{content}</code></pre>
      </div>
    </div>
  );
}
