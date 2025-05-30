'use client';

import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn('w-full', className)}>
      <ol className="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className="flex items-center">
              <span
                className={cn(
                  'flex items-center justify-center w-6 h-6 me-2 text-xs border rounded-full shrink-0',
                  {
                    'bg-blue-600 border-blue-600 text-white': isActive,
                    'bg-green-600 border-green-600 text-white': isCompleted,
                    'border-gray-500 text-gray-500 dark:border-gray-400':
                      !isActive && !isCompleted,
                  },
                )}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </span>
              <span
                className={cn('flex flex-col text-left', {
                  'text-blue-600 dark:text-blue-500': isActive,
                  'text-green-600 dark:text-green-500': isCompleted,
                })}
              >
                <span className="font-medium">{step.title}</span>
                {step.description && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </span>
                )}
              </span>
              {!isLast && (
                <ChevronRight className="w-4 h-4 ms-2 sm:ms-4 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
