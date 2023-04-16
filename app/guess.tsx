"use client";

import { GuessWord } from "@/types/guess-word";
import clsx from "clsx";
import { motion } from "framer-motion";
import { forwardRef } from "react";

const variants = {
  visible: {
    x: "0%",
    opacity: 1,
    height: "auto",
  },
  hidden: {
    x: "200%",
    opacity: 0,
    height: 0,
  },
};

interface GuessProps {
  correct?: boolean;
  guess: string;
}

export const Guess = forwardRef<HTMLDivElement, GuessProps>(
  ({ correct, guess }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={clsx(
          "bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md",
          { "bg-green-900": correct, "bg-cyan-900": !correct }
        )}
        layout="size"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={variants}
      >
        <div className="px-4 py-2">{guess}</div>
      </motion.div>
    );
  }
);

Guess.displayName = "Guess";

export default Guess;
