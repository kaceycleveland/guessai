'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';

const variants = {
  visible: {
    y: '0%',
    opacity: 1,
    height: 'auto',
  },
  hidden: {
    y: '200%',
    opacity: 0,
    height: 0,
  },
};

export interface ClueProps {
  clueText: string;
  order: number;
  total: number;
}

export const Clue = forwardRef<HTMLDivElement, ClueProps>(({ clueText, order, total }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={'flex w-full rounded border border-slate-900 bg-slate-950/40 text-white shadow-md backdrop-blur-lg'}
      layout="size"
      initial="hidden"
      animate="visible"
      variants={variants}
      onAnimationComplete={() => {
        window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight });
      }}
    >
      <div className="flex-1 p-4">{clueText}</div>
      <div className="p-4">
        {order + 1}/{total}
      </div>
    </motion.div>
  );
});

Clue.displayName = 'Clue';

export default Clue;
