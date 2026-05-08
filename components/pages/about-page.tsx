'use client';

import { Code, Zap, Layers, Shield } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'CSS Extraction',
    description: 'Extract CSS rules by class name with full support for nested rules and media queries.',
  },
  {
    icon: Layers,
    title: 'Section Extraction',
    description: 'Extract HTML sections with their associated CSS, preserving the complete styling.',
  },
  {
    icon: Zap,
    title: 'Live Preview',
    description: 'Preview extracted content in real-time with responsive viewport switching.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All processing happens in your browser. No data is sent to any server.',
  },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="font-serif italic text-sm mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Learn more
        </p>
        <h1 className="text-[28px] font-semibold tracking-[-0.04em]">About</h1>
      </div>

      {/* Description Card */}
      <div 
        className="rounded-[24px] p-6 mb-4 animate-card-in"
        style={{ 
          background: 'rgb(22, 22, 22)', 
          border: '1px solid rgba(255,255,255,0.07)' 
        }}
      >
        <h2 className="text-xl font-semibold mb-3">Web Section Isolator</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          A professional tool for extracting CSS rules and HTML sections from your stylesheets. 
          Perfect for component isolation, debugging, and creating standalone snippets.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        {features.map((feature, index) => (
          <div 
            key={feature.title} 
            className="rounded-[24px] p-5 animate-card-in"
            style={{ 
              background: 'rgb(22, 22, 22)', 
              border: '1px solid rgba(255,255,255,0.07)',
              animationDelay: `${0.1 + index * 0.05}s`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <feature.icon className="h-5 w-5" style={{ color: '#ff3700' }} />
              </div>
              <h3 className="text-[15px] font-semibold">{feature.title}</h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How to Use */}
      <div 
        className="rounded-[24px] p-6 mb-6 animate-card-in"
        style={{ 
          background: 'rgb(22, 22, 22)', 
          border: '1px solid rgba(255,255,255,0.07)',
          animationDelay: '0.35s',
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-serif italic text-xs mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Getting started
            </p>
            <h3 className="text-[15px] font-semibold">How to Use</h3>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
                style={{ background: 'rgba(255,55,0,0.1)', color: '#ff3700' }}
              >
                1
              </span>
              Section Extractor
            </h4>
            <ol className="list-inside space-y-2 text-xs ml-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <li>Upload your HTML and CSS files</li>
              <li>Select a section by its ID</li>
              <li>Get the extracted HTML with filtered CSS</li>
              <li>Preview, copy, or download the result</li>
            </ol>
          </div>
          
          <div 
            className="h-px w-full" 
            style={{ background: 'rgba(255,255,255,0.07)' }} 
          />

          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
                style={{ background: 'rgba(255,55,0,0.1)', color: '#ff3700' }}
              >
                2
              </span>
              CSS Class Extractor
            </h4>
            <ol className="list-inside space-y-2 text-xs ml-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <li>Enter the CSS class names you want to extract</li>
              <li>Paste your CSS file content</li>
              <li>Get only the CSS rules that match your classes</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Web Section Isolator v0.1.0
        </p>
        <p className="text-[11px] font-mono mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
          Built with Next.js + TypeScript
        </p>
      </div>
    </div>
  );
}
