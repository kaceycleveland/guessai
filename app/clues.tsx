import ClueRender from "./clue-render";
import { OrderedClues } from "@/types/ordered-clues";

export const revalidate = 0;

interface CluesProps {
  clues: OrderedClues;
  total: number;
}

export default async function Clues({ clues, total }: CluesProps) {
  return (
    <div className="w-full px-2">
      <div className="relative w-full flex flex-col gap-4">
        <ClueRender body={clues} total={total} />
      </div>
    </div>
  );
}
