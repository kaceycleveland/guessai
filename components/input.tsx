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
      <div className="w-full relative">
        {labelProps && <FormLabel {...labelProps} />}
        <input
          ref={ref}
          className={clsx(
            className,
            'w-full text-white font-semibold bg-slate-800 rounded placeholder:text-slate-400 border focus:outline-slate-700 focus:outline-1 border-transparent',
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
          <div className="absolute inset-0 flex justify-end items-center pr-2 text-slate-600 font-semibold pointer-events-none">
            {endContent}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
