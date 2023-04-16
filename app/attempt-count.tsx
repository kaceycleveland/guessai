'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';

import { GuessWord } from '@/types/guess-word';

const variants = {
  visible: {
    x: '0%',
    opacity: 1,
    height: 'auto',
  },
  hidden: {
    x: '200%',
    opacity: 0,
    height: 0,
  },
};

interface AttemptCountProps {
  maxAttempts: number;
  attempts: number;
}

export const AttemptCount = forwardRef<HTMLDivElement, AttemptCountProps>(({ maxAttempts, attempts }, ref) => {
  const maxed = maxAttempts === attempts;
  return (
    <motion.div
      ref={ref}
      className={clsx('rounded border border-slate-900 bg-opacity-40 text-white shadow-md backdrop-blur-lg', {
        'bg-violet-900': maxed,
        'bg-violet-800': !maxed,
      })}
      layout="size"
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className="px-4 py-2">
        {attempts}/{maxAttempts}
      </div>
    </motion.div>
  );
});

AttemptCount.displayName = 'Guess';

export default AttemptCount;
