"use client";

import { motion } from "framer-motion";

const variants = {
  visible: { scale: 1.0, y: "0%", opacity: 1 },
  hidden: { scale: 1.0, y: "200%", opacity: 0 },
};

export interface ClueProps {
  initial?: keyof typeof variants;
  state: keyof typeof variants;
  clueText: string;
}

export const Clue = ({ initial, state, clueText }: ClueProps) => {
  return (
    <motion.div
      className={
        `${state}-clue-state` +
        " p-4 bg-slate-950 bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md w-full"
      }
      initial={initial ?? "hidden"}
      variants={variants}
      animate={state}
    >
      {clueText}
    </motion.div>
  );
};

export default Clue;
