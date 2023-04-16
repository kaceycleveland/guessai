import clsx from 'clsx';
import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react';

interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const primaryClassNames = 'bg-cyan-600 hover:bg-cyan-500';
const secondaryClassNames = 'bg-violet-600 hover:bg-violet-500';

export const Button = ({ className, variant = 'primary', ...rest }: ButtonProps) => {
  return (
    <button
      className={clsx(
        className,
        'rounded p-2 font-semibold text-white focus:outline focus:outline-1 transition-colors disabled:pointer-events-none disabled:opacity-60',
        {
          [primaryClassNames]: variant === 'primary',
          [secondaryClassNames]: variant === 'secondary',
        }
      )}
      {...rest}
    />
  );
};
