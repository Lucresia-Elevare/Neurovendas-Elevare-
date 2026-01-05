interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  steps: Step[];
  projectId?: string;
}

export default function ProgressStepper({ currentStep, steps, projectId }: ProgressStepperProps) {
  return (
    <div className="w-full py-8">
      {projectId && (
        <div className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-center">
          Editando projeto: {projectId}
        </div>
      )}
      
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step.number === currentStep
                    ? "bg-indigo-600 text-white scale-110 shadow-lg"
                    : step.number < currentStep
                    ? "bg-green-500 text-white"
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
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-500 max-w-[100px]">
                  {step.description}
                </div>
              </div>
            </div>

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
    </div>
  );
}
