'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Copy, Check } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { StepIndicator, ClassChips } from '@/components/extractor';
import { extractCSSForClasses, parseClassNames, copyToClipboard } from '@/lib/css-extractor';

// Step constants
const STEP = {
  CLASSES: 0,
  CSS: 1,
  RESULT: 2,
} as const;

type StepType = (typeof STEP)[keyof typeof STEP];

const STEPS = [
  { label: 'Enter class names' },
  { label: 'Paste CSS' },
  { label: 'View result' },
];

export function CSSClassExtractorPage() {
  const [step, setStep] = useState<StepType>(STEP.CLASSES);
  const [classInput, setClassInput] = useState('');
  const [cssInput, setCssInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [classNames, setClassNames] = useState<string[]>([]);

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const parsedClasses = parseClassNames(classInput);

  const handleClassSubmit = useCallback(() => {
    if (!parsedClasses.length) return;
    setClassNames(parsedClasses);
    setStep(STEP.CSS);
  }, [parsedClasses]);

  const handleExtract = useCallback(() => {
    const result = extractCSSForClasses(cssInput, classNames);
    setOutput(result || '/* No matching rules found */');
    setStep(STEP.RESULT);
  }, [cssInput, classNames]);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [output]);

  const handleReset = useCallback(() => {
    setStep(STEP.CLASSES);
    setClassInput('');
    setCssInput('');
    setOutput('');
    setClassNames([]);
  }, []);

  const handleBack = useCallback(() => {
    if (step > STEP.CLASSES) {
      setStep((prev) => (prev - 1) as StepType);
    }
  }, [step]);

  return (
    <div className="mx-auto max-w-4xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="font-serif italic text-sm mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Web Section Isolator
          </p>
          <h1 className="text-[28px] font-semibold tracking-[-0.04em]">CSS Class Extractor</h1>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span 
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono"
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.25)'
            }}
          >
            {currentDate}
          </span>
        </div>
      </div>

      {/* Step Indicator */}
      <StepIndicator steps={STEPS} currentStep={step} />

      {/* Step 0: Class Names */}
      {step === STEP.CLASSES && (
        <div className="space-y-4">
          <div 
            className="rounded-[24px] p-5 animate-card-in"
            style={{ 
              background: 'rgb(22, 22, 22)', 
              border: '1px solid rgba(255,255,255,0.07)' 
            }}
          >
            <label className="block mb-3 text-[10px] uppercase tracking-[0.08em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Class Names
            </label>
            <Textarea
              className="min-h-[200px] font-mono text-sm rounded-[12px] p-4"
              style={{
                background: 'rgb(18, 18, 18)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#fff',
              }}
              placeholder={`Enter class names — space, comma, or newline separated

Example:
  navbar
  .btn-primary, hero-section
  card-wrapper footer-nav`}
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              autoFocus
            />
          </div>

          {parsedClasses.length > 0 && (
            <div 
              className="rounded-[24px] p-5 animate-card-in"
              style={{ 
                background: 'rgb(22, 22, 22)', 
                border: '1px solid rgba(255,255,255,0.07)' 
              }}
            >
              <span className="text-[10px] uppercase tracking-[0.08em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {parsedClasses.length} class{parsedClasses.length > 1 ? 'es' : ''} detected
              </span>
              <ClassChips classes={parsedClasses} />
            </div>
          )}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleClassSubmit}
              disabled={!parsedClasses.length}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm transition-all"
              style={{ 
                background: !parsedClasses.length ? 'rgba(255,255,255,0.1)' : '#fff',
                color: !parsedClasses.length ? 'rgba(255,255,255,0.3)' : '#000',
                boxShadow: !parsedClasses.length ? 'none' : 'var(--shadow-btn)',
                cursor: !parsedClasses.length ? 'not-allowed' : 'pointer',
              }}
            >
              Next: Paste CSS
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 1: CSS Input */}
      {step === STEP.CSS && (
        <div className="space-y-4">
          <div 
            className="rounded-[24px] p-5 animate-card-in"
            style={{ 
              background: 'rgb(22, 22, 22)', 
              border: '1px solid rgba(255,255,255,0.07)' 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <label className="text-[10px] uppercase tracking-[0.08em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Main CSS File
              </label>
              <div className="flex items-center gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-mono"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.5)'
                  }}
                >
                  {classNames.length} classes
                </span>
                <button
                  onClick={handleBack}
                  className="text-xs font-medium flex items-center gap-1"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  <ArrowLeft className="h-3 w-3" />
                  Edit classes
                </button>
              </div>
            </div>

            <ClassChips classes={classNames} maxDisplay={10} />

            <Textarea
              className="min-h-[300px] font-mono text-sm rounded-[12px] p-4 mt-4"
              style={{
                background: 'rgb(18, 18, 18)',
                border: '1px solid rgba(255,255,255,0.05)',
                color: '#fff',
              }}
              placeholder="Paste your main CSS file content here..."
              value={cssInput}
              onChange={(e) => setCssInput(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex justify-between pt-4">
            <button 
              onClick={handleBack} 
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ 
                background: 'none', 
                border: '1px solid rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.5)'
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={handleExtract}
              disabled={!cssInput.trim()}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm transition-all"
              style={{ 
                background: !cssInput.trim() ? 'rgba(255,255,255,0.1)' : '#fff',
                color: !cssInput.trim() ? 'rgba(255,255,255,0.3)' : '#000',
                boxShadow: !cssInput.trim() ? 'none' : 'var(--shadow-btn)',
                cursor: !cssInput.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              Extract
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Result */}
      {step === STEP.RESULT && (
        <div className="space-y-4">
          <div 
            className="rounded-[24px] p-5 animate-card-in"
            style={{ 
              background: 'rgb(22, 22, 22)', 
              border: '1px solid rgba(255,255,255,0.07)' 
            }}
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-[15px] font-semibold">Extracted CSS</h3>
                <span 
                  className="px-3 py-1 rounded-full text-[11px] font-mono"
                  style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.5)'
                  }}
                >
                  {classNames.length} classes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ 
                    background: 'none', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: copied ? '#2ECC71' : 'rgba(255,255,255,0.5)'
                  }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ 
                    background: 'none', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.5)'
                  }}
                >
                  <ArrowLeft className="h-3 w-3" />
                  Edit CSS
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{ 
                    background: 'none', 
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.5)'
                  }}
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>
            </div>
            
            <ClassChips classes={classNames} maxDisplay={10} />
            
            <div 
              className="rounded-[12px] p-4 overflow-auto max-h-[400px] font-mono text-[13px] leading-[1.7] mt-4"
              style={{ 
                background: 'rgb(18, 18, 18)', 
                border: '1px solid rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.1) transparent',
              }}
            >
              <pre className="whitespace-pre-wrap break-words">{output}</pre>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {output.split('\n').length} lines
              </span>
              <span className="text-[11px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                {output.length.toLocaleString()} chars
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
