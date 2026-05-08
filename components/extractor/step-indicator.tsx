'use client';

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="h-2 w-2 rounded-full transition-all"
            style={{
              background: index === currentStep 
                ? '#ff3700' 
                : index < currentStep 
                  ? '#2ECC71' 
                  : 'rgba(255,255,255,0.1)',
              boxShadow: index === currentStep ? '0 0 8px rgba(255,55,0,0.5)' : 'none',
            }}
          />
          {index === currentStep && (
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {step.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
