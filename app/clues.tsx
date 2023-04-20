import { OrderedClues } from '@/types/ordered-clues';

import ClueRender from './clue-render';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface CluesProps {
  clues: OrderedClues;
  total: number;
}

export default async function Clues({ clues, total }: CluesProps) {
  return (
    <div className="flex w-full flex-1 flex-col justify-end px-2">
      <ClueRender body={clues} total={total} />
    </div>
  );
}
