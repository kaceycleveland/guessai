import Clues from "./clues";
import GetClueButton from "./get-clue-button";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import GuessEntry from "./guess-entry";

export const revalidate = 0;

export default function Page() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl">
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full">
            <Loading className="bg-cyan-500" />
          </div>
        }
      >
        {/* @ts-ignore */}
        <Clues />
      </Suspense>
      <div className="sticky bottom-4 p-4 bg-slate-950 rounded bg-opacity-90 shadow-lg flex flex-col gap-4">
        <GetClueButton />
        <GuessEntry />
      </div>
    </div>
  );
}
