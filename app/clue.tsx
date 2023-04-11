"use client";

import { motion } from "framer-motion";

const variants = {
  previousHidden: { scale: 0, y: "-120%", opacity: 0 },
  previous: { scale: 0.5, y: "-80%", opacity: 0.5 },
  current: { scale: 1.0, y: "0%", opacity: 1 },
  next: { scale: 0.9, y: "110%", opacity: 0.2 },
  nextHidden: { scale: 1.0, y: "200%", opacity: 0 },
};

export interface ClueProps {
  state: keyof typeof variants;
}

export const Clue = ({ state }: ClueProps) => {
  return (
    <motion.div
      className={
        `${state}-clue-state` +
        " p-4 bg-slate-950 bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md absolute top-0 left-0 w-full"
      }
      variants={variants}
      animate={state}
    >
      The meaning behind any given term can change over time depending on
      cultural context and usage patterns; however, knowing what something meant
      when it first came into existence gives insight into why people chose
      those particular sounds/letters/syllables etc., for their name at all! In
      other words: understanding early meanings sheds light on later ones too!
    </motion.div>
  );
};

export default Clue;
