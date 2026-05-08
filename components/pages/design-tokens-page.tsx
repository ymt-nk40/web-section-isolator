'use client';

import { Palette, Sparkles } from 'lucide-react';

export function DesignTokensPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <p className="font-serif italic text-sm mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Coming soon
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em]">Design Tokens</h1>
      </div>

      {/* Coming Soon Card */}
      <div 
        className="rounded-[24px] p-6 animate-card-in"
        style={{ 
          background: 'rgb(22, 22, 22)', 
          border: '1px solid rgba(255,255,255,0.07)' 
        }}
      >
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <Palette className="w-8 h-8" style={{ color: '#ff3700' }} />
          </div>
          
          <h2 className="text-xl font-semibold mb-3">Design Token Extractor</h2>
          <p className="text-sm max-w-md mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Extract design tokens from CSS files including colors, typography, spacing, and shadows. 
            Export to JSON, CSS variables, or Tailwind config.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {['Colors', 'Typography', 'Spacing', 'Shadows', 'Radius'].map((token) => (
              <span 
                key={token}
                className="px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.5)'
                }}
              >
                {token}
              </span>
            ))}
          </div>
          
          <div 
            className="mt-10 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ 
              background: 'rgba(255,55,0,0.1)', 
              border: '1px solid rgba(255,55,0,0.2)' 
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: '#ff3700' }} />
            <span className="text-sm font-medium" style={{ color: '#ff3700' }}>
              In Development
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
