"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import Clue, { ClueProps } from "./clue";

const clues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export default function Clues() {
  const [clueIndex, setClueIndex] = useState(0);
  const prevClueIndex = useMemo(() => Math.max(clueIndex - 1, 0), [clueIndex]);
  const nextClueIndex = useMemo(
    () => Math.min(clueIndex + 1, clues.length - 1),
    [clueIndex]
  );
  const prevClue = useCallback(
    () => setClueIndex(prevClueIndex),
    [prevClueIndex]
  );
  const nextClue = useCallback(
    () => setClueIndex(nextClueIndex),
    [nextClueIndex]
  );
  console.log("clueIndex", clueIndex);
  return (
    <div className="w-full">
      <button onClick={prevClue}>Prev Clue</button>
      <button onClick={nextClue}>Next Clue</button>
      <div className="relative w-full h-52 overflow-visible">
        {clues.map((clue, index) => {
          let state: ClueProps["state"] = "nextHidden";
          if (index === clueIndex) state = "current";
          else if (index === prevClueIndex) state = "previous";
          else if (index === nextClueIndex) state = "next";
          else if (index < clueIndex) state = "previousHidden";
          else if (index > clueIndex) state = "nextHidden";
          console.log(clue, state);
          return <Clue key={index} state={state} />;
        })}
      </div>
    </div>
  );
}
