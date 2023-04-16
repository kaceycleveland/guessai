'use client';

import clsx from 'clsx';
import { Variants, motion } from 'framer-motion';

const variants: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const circleCommonClasses = 'h-2.5 w-2.5 bg-current rounded-full';

export interface LoadingProps {
  className?: string;
}

export const Loading = ({ className }: LoadingProps) => {
  return (
    <motion.div className="flex" initial="visible" animate="visible" exit="hidden" variants={variants}>
      <div className={clsx(`${circleCommonClasses} mr-1 animate-bounce`, className)}></div>
      <div className={clsx(`${circleCommonClasses} mr-1 animate-bounce200`, className)}></div>
      <div className={clsx(`${circleCommonClasses} animate-bounce400`, className)}></div>
    </motion.div>
  );
};
