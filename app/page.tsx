import Clues from "./clues";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import GuessBox from "./guess-box";

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
      <GuessBox />
    </div>
  );
}
