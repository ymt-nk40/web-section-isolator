'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UploadCard,
  SectionList,
  OutputPanel,
  PreviewPanel,
  FooterActions,
  StepIndicator,
} from '@/components/extractor';
import {
  readFile,
  detectSections,
  extractSection,
  filterCSS,
  generateOutputHTML,
  formatHTML,
  type Section,
} from '@/lib/css-extractor';

// Step constants
const STEP = {
  UPLOAD: 0,
  SELECT: 1,
  RESULT: 2,
} as const;

type StepType = (typeof STEP)[keyof typeof STEP];

const STEPS = [
  { label: 'Upload files' },
  { label: 'Select section' },
  { label: 'View result' },
];

export function ExtractorPage() {
  // State
  const [step, setStep] = useState<StepType>(STEP.UPLOAD);
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [cssFile, setCssFile] = useState<File | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [cssContent, setCssContent] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [extractedCss, setExtractedCss] = useState('');

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Handlers
  const handleHtmlFile = useCallback(async (file: File) => {
    setHtmlFile(file);
    const content = await readFile(file);
    setHtmlContent(content);
    const detectedSections = detectSections(content);
    setSections(detectedSections);
  }, []);

  const handleCssFile = useCallback(async (file: File) => {
    setCssFile(file);
    const content = await readFile(file);
    setCssContent(content);
  }, []);

  const handleClearHtml = useCallback(() => {
    setHtmlFile(null);
    setHtmlContent('');
    setSections([]);
    setSelectedSection(null);
  }, []);

  const handleClearCss = useCallback(() => {
    setCssFile(null);
    setCssContent('');
  }, []);

  const handleNext = useCallback(() => {
    if (step === STEP.UPLOAD && htmlContent && cssContent) {
      setStep(STEP.SELECT);
    } else if (step === STEP.SELECT && selectedSection) {
      const sectionHtml = extractSection(htmlContent, selectedSection);
      const filteredCss = filterCSS(cssContent, sectionHtml);
      const outputHtml = generateOutputHTML(sectionHtml, filteredCss, htmlContent);
      setOutput(outputHtml);
      setExtractedCss(filteredCss);
      setStep(STEP.RESULT);
    }
  }, [step, htmlContent, cssContent, selectedSection]);

  const handleBack = useCallback(() => {
    if (step > STEP.UPLOAD) {
      setStep((prev) => (prev - 1) as StepType);
    }
  }, [step]);

  const handleFormat = useCallback(() => {
    setOutput((prev) => formatHTML(prev));
  }, []);

  const handleReset = useCallback(() => {
    setStep(STEP.UPLOAD);
    setHtmlFile(null);
    setCssFile(null);
    setHtmlContent('');
    setCssContent('');
    setSections([]);
    setSelectedSection(null);
    setOutput('');
    setExtractedCss('');
  }, []);

  const handleSelectSection = useCallback((id: string) => {
    setSelectedSection(id);
  }, []);

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case STEP.UPLOAD:
        return (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <UploadCard
                label="HTML File"
                accept=".html,.htm"
                onFileSelect={handleHtmlFile}
                fileName={htmlFile?.name}
                onClear={handleClearHtml}
                description="Upload your HTML file"
              />
              <UploadCard
                label="CSS File"
                accept=".css"
                onFileSelect={handleCssFile}
                fileName={cssFile?.name}
                onClear={handleClearCss}
                description="Upload your CSS file"
              />
            </div>

            {sections.length > 0 && (
              <div 
                className="rounded-[24px] p-5 animate-card-in"
                style={{ 
                  background: 'rgb(22, 22, 22)', 
                  border: '1px solid rgba(255,255,255,0.07)' 
                }}
              >
                <p className="mb-3 text-[10px] uppercase tracking-[0.08em] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
                  {sections.length} section{sections.length > 1 ? 's' : ''} detected
                </p>
                <div className="flex flex-wrap gap-2">
                  {sections.slice(0, 10).map((s) => (
                    <span 
                      key={s.id} 
                      className="chip"
                    >
                      {s.id}
                    </span>
                  ))}
                  {sections.length > 10 && (
                    <span 
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        color: 'rgba(255,255,255,0.5)' 
                      }}
                    >
                      +{sections.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleNext}
                disabled={!htmlContent || !cssContent}
                className="gap-2 rounded-full px-5 py-2.5 font-semibold text-sm"
                style={{ 
                  background: !htmlContent || !cssContent ? 'rgba(255,255,255,0.1)' : '#fff',
                  color: !htmlContent || !cssContent ? 'rgba(255,255,255,0.3)' : '#000',
                  boxShadow: !htmlContent || !cssContent ? 'none' : 'var(--shadow-btn)',
                }}
              >
                Next: Select Section
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case STEP.SELECT:
        return (
          <div className="space-y-4">
            <SectionList
              sections={sections}
              selectedId={selectedSection}
              onSelect={handleSelectSection}
            />

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
              <Button
                onClick={handleNext}
                disabled={!selectedSection}
                className="gap-2 rounded-full px-5 py-2.5 font-semibold text-sm"
                style={{ 
                  background: !selectedSection ? 'rgba(255,255,255,0.1)' : '#fff',
                  color: !selectedSection ? 'rgba(255,255,255,0.3)' : '#000',
                  boxShadow: !selectedSection ? 'none' : 'var(--shadow-btn)',
                }}
              >
                Extract
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case STEP.RESULT:
        return (
          <div className="w-full min-w-0 max-w-full space-y-4 overflow-hidden pb-24">
            <div className="grid w-full min-w-0 max-w-full grid-cols-1 gap-4 lg:grid-cols-2">
              <OutputPanel title="Extracted HTML + CSS" content={output} className="min-w-0" />
              <PreviewPanel html={output} className="min-w-0" />
            </div>

            {extractedCss && (
              <OutputPanel
                title="Extracted CSS Only"
                content={extractedCss}
                className="min-w-0"
              />
            )}

            <div className="flex justify-start pt-4">
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
                Back to Selection
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-5xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="font-serif italic text-sm mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Web Section Isolator
          </p>
          <h1 className="text-[28px] font-semibold tracking-[-0.04em]">Extractor</h1>
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

      {/* Content */}
      {renderStepContent()}

      {/* Footer Actions (only on result step) */}
      {step === STEP.RESULT && (
        <FooterActions
          output={output}
          onFormat={handleFormat}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
