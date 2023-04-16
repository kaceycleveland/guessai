"use client";

import { Variants, motion } from "framer-motion";
import Clue from "./clue";
import { OrderedClues } from "@/types/ordered-clues";
import Guess from "./guess";
import AttemptCount from "./attempt-count";
import { Fragment } from "react";

const variants: Variants = {
  visible: {
    opacity: 1,
    transition: {
      delay: 0,
      when: "beforeChildren",
      staggerChildren: 0.2,
      staggerDirection: -1,
    },
  },
  hidden: { opacity: 0 },
};

interface ClueRenderProps {
  body?: OrderedClues;
  total: number;
}

export default function ClueRender({ body, total }: ClueRenderProps) {
  console.log(body);
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4"
      layout="size"
    >
      {body?.map((entry, index) => {
        return (
          <Fragment key={index}>
            <Clue
              clueText={entry.clue.clue ?? ""}
              order={entry.clue.sort_order}
              total={total}
            />
            {entry.guesses?.length ? (
              <motion.div layout="size" className="flex gap-2 flex-wrap">
                {entry.guesses.map(({ guess, correct }, key) => (
                  <Guess key={key} correct={correct} guess={guess} />
                ))}
                <AttemptCount
                  attempts={entry.guesses.length}
                  maxAttempts={entry.clue.max_attempts}
                />
              </motion.div>
            ) : undefined}
          </Fragment>
        );
      })}
    </motion.div>
  );
}
