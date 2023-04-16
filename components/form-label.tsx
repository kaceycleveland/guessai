import clsx from 'clsx';
import { DetailedHTMLProps, LabelHTMLAttributes } from 'react';

export interface FormLabelProps extends DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> {}

export const FormLabel = ({ className, ...rest }: FormLabelProps) => {
  return <label className={clsx(className, 'pl-1 font-medium')} {...rest} />;
};
