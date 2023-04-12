"use client";

import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import Clue, { ClueProps } from "./clue";

const clues: string[] = [
  "Test clue 1",
  "Test clue 2",
  "Test clue 3",
  "Test clue 4",
  "Test clue 5",
  "Test clue 1",
  "Test clue 2",
  "Test clue 3",
  "Test clue 4",
  "Test clue 5",
  "Test clue 1",
  "Test clue 2",
  "Test clue 3",
  "Test clue 4",
  "Test clue 5",
  "Test clue 1",
  "Test clue 2",
  "Test clue 3",
  "Test clue 4",
  "Test clue 5",
];
export default function Clues() {
  const [clueIndex, setClueIndex] = useState(0);
  const [visibleClues, setVisibleClues] = useState([clues[0]]);
  const prevClueIndex = useMemo(() => Math.max(clueIndex - 1, 0), [clueIndex]);
  const nextClueIndex = useMemo(
    () => Math.min(clueIndex + 1, clues.length - 1),
    [clueIndex]
  );
  const prevClue = useCallback(() => {
    if (!visibleClues[prevClueIndex]) {
      const newClues = [...visibleClues];
      newClues[prevClueIndex] = clues[prevClueIndex];
      setVisibleClues(newClues);
    }
    setClueIndex(prevClueIndex);
  }, [visibleClues, prevClueIndex]);
  const nextClue = useCallback(() => {
    if (!visibleClues[nextClueIndex]) {
      const newClues = [...visibleClues];
      newClues[nextClueIndex] = clues[nextClueIndex];
      setVisibleClues(newClues);
    }
    setClueIndex(nextClueIndex);
  }, [visibleClues, nextClueIndex]);
  console.log("clueIndex", clueIndex);
  return (
    <div className="w-full px-2">
      <button onClick={prevClue}>Prev Clue</button>
      <button onClick={nextClue}>Next Clue</button>
      <div className="relative w-full flex flex-col gap-4">
        {visibleClues.map((clue, index) => {
          return (
            <Clue
              key={index}
              initial={index === 0 ? "visible" : "hidden"}
              clueText={clue}
              state="visible"
            />
          );
        })}
      </div>
    </div>
  );
}
