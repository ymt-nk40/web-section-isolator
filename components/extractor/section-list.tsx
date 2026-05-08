'use client';

import { cn } from '@/lib/utils';
import type { Section } from '@/lib/css-extractor';

interface SectionListProps {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SectionList({ sections, selectedId, onSelect }: SectionListProps) {
  if (sections.length === 0) {
    return (
      <div 
        className="rounded-[24px] p-8 text-center animate-card-in"
        style={{ 
          background: 'rgb(22, 22, 22)', 
          border: '1px solid rgba(255,255,255,0.07)' 
        }}
      >
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          No sections with IDs found in the HTML file.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-[24px] p-5 animate-card-in"
      style={{ 
        background: 'rgb(22, 22, 22)', 
        border: '1px solid rgba(255,255,255,0.07)' 
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-serif italic text-xs mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Step 2
          </p>
          <h3 className="text-[15px] font-semibold tracking-[-0.02em]">Select Section</h3>
        </div>
        <span 
          className="px-3 py-1 rounded-full text-[11px] font-mono"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          {sections.length} found
        </span>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={cn(
              'w-full rounded-[12px] p-4 text-left transition-all',
              selectedId === section.id
                ? 'border-[rgba(255,255,255,0.12)]'
                : 'border-transparent hover:border-[rgba(255,255,255,0.12)]'
            )}
            style={{
              background: selectedId === section.id 
                ? 'rgba(255,255,255,0.08)' 
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selectedId === section.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-[10px] font-mono px-2 py-0.5 rounded"
                style={{ 
                  background: 'rgba(255,55,0,0.1)', 
                  color: '#ff3700' 
                }}
              >
                {`<${section.tag}>`}
              </span>
              <span className="font-mono text-sm" style={{ color: '#fff' }}>
                #{section.id}
              </span>
            </div>
            {section.preview && (
              <p className="truncate text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {section.preview}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
