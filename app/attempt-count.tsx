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

interface AttemptCountProps {
  maxAttempts: number;
  attempts: number;
}

export const AttemptCount = forwardRef<HTMLDivElement, AttemptCountProps>(
  ({ maxAttempts, attempts }, ref) => {
    const maxed = maxAttempts === attempts;
    return (
      <motion.div
        ref={ref}
        className={clsx(
          "bg-opacity-40 border border-slate-900 backdrop-blur-lg rounded text-white shadow-md",
          { "bg-violet-900": maxed, "bg-violet-800": !maxed }
        )}
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
  }
);

AttemptCount.displayName = "Guess";

export default AttemptCount;