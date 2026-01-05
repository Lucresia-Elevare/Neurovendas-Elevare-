import { useLocation } from "wouter";

interface Step {
  number: number;
  title: string;
  description: string;
  href?: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
  projectId?: string;
  allowBackNavigation?: boolean;
}

export default function ProgressStepper({ 
  currentStep, 
  steps, 
  projectId,
  allowBackNavigation = true 
}: ProgressStepperProps) {
  const [, setLocation] = useLocation();

  const handleStepClick = (step: Step) => {
    // Only allow navigation to completed steps or current step
    if (!allowBackNavigation || step.number > currentStep) {
      return;
    }

    // Navigate to the step with projectId if available
    if (step.href && projectId) {
      setLocation(`${step.href}?projectId=${projectId}`);
    } else if (step.href) {
      setLocation(step.href);
    }
  };

  return (
    <div className="w-full py-8">
      {projectId && (
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-center">
          Editando projeto: <span className="font-mono font-semibold">{projectId}</span>
        </div>
      )}
      
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <button
              onClick={() => handleStepClick(step)}
              disabled={step.number > currentStep || !allowBackNavigation}
              className={`flex flex-col items-center ${
                step.number <= currentStep && allowBackNavigation
                  ? "cursor-pointer hover:scale-105 transition-transform"
                  : step.number > currentStep
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-default"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step.number === currentStep
                    ? "bg-indigo-600 text-white scale-110 shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-900"
                    : step.number < currentStep
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                }`}
              >
                {step.number < currentStep ? "✓" : step.number}
              </div>
              <div className="mt-2 text-center">
                <div
                  className={`text-sm font-medium ${
                    step.number === currentStep
                      ? "text-indigo-600 dark:text-indigo-400"
                      : step.number < currentStep
                      ? "text-green-600 dark:text-green-400"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 max-w-[100px]">
                  {step.description}
                </div>
              </div>
            </button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-all ${
                  step.number < currentStep
                    ? "bg-green-500"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile view - Vertical compact */}
      <div className="md:hidden space-y-2 max-w-sm mx-auto">
        {steps.map((step) => (
          <button
            key={step.number}
            onClick={() => handleStepClick(step)}
            disabled={step.number > currentStep || !allowBackNavigation}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
              step.number === currentStep
                ? "bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-600"
                : step.number < currentStep
                ? "bg-green-50 dark:bg-green-900/20 border border-green-300"
                : "bg-slate-100 dark:bg-slate-800 border border-slate-300"
            } ${
              step.number <= currentStep && allowBackNavigation
                ? "cursor-pointer"
                : "cursor-not-allowed opacity-50"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step.number === currentStep
                  ? "bg-indigo-600 text-white"
                  : step.number < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-slate-300 text-slate-600"
              }`}
            >
              {step.number < currentStep ? "✓" : step.number}
            </div>
            <div className="flex-1 text-left">
              <div
                className={`font-medium text-sm ${
                  step.number === currentStep
                    ? "text-indigo-700 dark:text-indigo-300"
                    : step.number < currentStep
                    ? "text-green-700 dark:text-green-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {step.title}
              </div>
              {step.number === currentStep && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {step.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
