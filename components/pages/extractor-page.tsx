'use client';

import { useState, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Calendar, Eye, FileCode2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const WORKFLOW_STATS = [
  { label: 'Private', value: 'Browser-only', icon: ShieldCheck },
  { label: 'Output', value: 'Standalone code', icon: FileCode2 },
  { label: 'Preview', value: 'Responsive iframe', icon: Eye },
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
          <div className="space-y-5">
            <div className="rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.035)] p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(255,255,255,0.32)' }}>
                    Extraction workspace
                  </p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.04em]">Drop in your exported files</h2>
                </div>
                <p className="max-w-md text-sm leading-6" style={{ color: 'rgba(255,255,255,0.46)' }}>
                  Upload one HTML file and one CSS file, then pick the section you want to isolate.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-4 md:grid-cols-2">
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
    <div className="mx-auto w-full min-w-0 max-w-7xl overflow-hidden">
      {/* Top Bar */}
      <div className="mb-6 overflow-hidden rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-serif mb-1 text-sm italic" style={{ color: 'rgba(255,255,255,0.34)' }}>
              Web Section Isolator
            </p>
            <h1 className="text-[34px] font-semibold tracking-[-0.055em] sm:text-[44px]">Extractor Studio</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 sm:text-[15px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              A focused workspace for turning exported pages into reusable standalone HTML sections with only the CSS they need.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px]"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.42)'
              }}
            >
              <Calendar className="h-3.5 w-3.5" />
              {currentDate}
            </span>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {WORKFLOW_STATS.map((item) => (
            <div
              key={item.label}
              className="flex min-w-0 items-center gap-3 rounded-[18px] border border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.16)] p-3"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[13px] bg-[rgba(255,55,0,0.12)]">
                <item.icon className="h-4 w-4" style={{ color: '#ff3700' }} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {item.label}
                </span>
                <span className="block truncate text-sm font-semibold">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Indicator */}
      <div className="mb-6 rounded-[22px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.035)] px-4 py-3">
        <StepIndicator steps={STEPS} currentStep={step} />
      </div>

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
