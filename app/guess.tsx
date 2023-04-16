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

interface GuessProps {
  correct?: boolean;
  guess: string;
}

export const Guess = forwardRef<HTMLDivElement, GuessProps>(({ correct, guess }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={clsx('rounded border border-slate-900 bg-opacity-40 text-white shadow-md backdrop-blur-lg', {
        'bg-green-900': correct,
        'bg-cyan-900': !correct,
      })}
      layout="size"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      onAnimationComplete={() => {
        window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
      }}
    >
      <div className="px-4 py-2">{guess}</div>
    </motion.div>
  );
});

Guess.displayName = 'Guess';

export default Guess;
