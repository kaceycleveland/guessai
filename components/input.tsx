import clsx from 'clsx';
import { ReactNode, forwardRef } from 'react';
import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

import { FormLabel, FormLabelProps } from './form-label';

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  variant?: 'sm' | 'md' | 'lg';
  labelProps?: FormLabelProps;
  error?: string;
  endContent?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'md', labelProps, error, endContent, ...rest }, ref) => {
    return (
      <div className="relative w-full">
        {labelProps && <FormLabel {...labelProps} />}
        <input
          ref={ref}
          className={clsx(
            className,
            'w-full rounded border border-transparent bg-slate-800 font-semibold text-white placeholder:text-slate-400 focus:outline-1 focus:outline-slate-700',
            {
              'p-3': variant === 'lg',
              'p-2': variant === 'md',
              'p-1': variant === 'sm',
              'border-red-500 focus:border-red-700 focus:outline-0': error,
            }
          )}
          {...rest}
        />
        {endContent && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-2 font-semibold text-slate-600">
            {endContent}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
