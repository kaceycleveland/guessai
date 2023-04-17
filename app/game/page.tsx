import { CheckCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { cookies, headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { Database } from '@/lib/database.types';
import { SupabaseAdminClient } from '@/lib/supabase-admin-client';
import { parseToDate } from '@/lib/utils/date-format';
import { getCurrentDate } from '@/lib/utils/get-current-date';
import { narrowItems } from '@/lib/utils/narrow-items';

export const revalidate = 60;

export default async function GameHistoryPage() {
  const supabase = createServerComponentSupabaseClient<Database>({
    headers,
    cookies,
  });
  const initData = await Promise.all([getCurrentDate(), supabase.auth.getUser()]);
  const { data: currentDate } = initData[0];
  const { data: userData } = initData[1];
  const userId = userData.user?.id;

  if (!userId) notFound();

  const getGamesQuery = await SupabaseAdminClient.from('game')
    .select(
      `
  id,
  date,
  created_at,
  given_clues ( id ),
  guesses ( id, correct ),
  words ( word, clues ( id, max_attempts ) )`
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (getGamesQuery.error) notFound();

  const gamesNarrowed = getGamesQuery.data
    .map((game) => {
      const narrowedWords = narrowItems(game.words);
      const narrowedClues = narrowedWords.map((wordBody) => narrowItems(wordBody.clues)).flat();
      const narrowedGuesses = narrowItems(game.guesses);
      const maxGuessesCount = narrowedClues.reduce((total, clue) => total + clue.max_attempts, 0);
      const cluesGivenCount = narrowItems(game.given_clues).length;
      const completed = narrowedGuesses.some((guessBody) => guessBody.correct);
      return {
        id: game.id,
        date: game.date,
        completed,
        guessesCount: narrowedGuesses.length,
        maxGuessesCount,
        cluesGivenCount,
        maxCluesCount: narrowedClues.length,
        word: narrowedWords[0].word,
      };
    })
    .filter((game) => game.date !== currentDate || game.completed);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-4 p-4 text-white">
      {!gamesNarrowed.length && (
        <div className="w-full text-center">{`No completed or past games were found. Try out today's clue and check box again!`}</div>
      )}
      {gamesNarrowed.length && (
        <div className="w-full text-center">{`Games may take some time to progate and update on this page.`}</div>
      )}
      {gamesNarrowed.map((game, key) => (
        <div key={key} className="flex flex-col justify-between gap-2 rounded bg-slate-950 p-4 sm:flex-row">
          <div className="flex justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6">
                {game.completed ? <CheckCircleIcon className="text-green-500" /> : <MinusCircleIcon />}
              </div>
              <div className="font-bold">{game.word}</div>
            </div>
            <div className="flex gap-4 font-bold">
              <div className="text-cyan-400">
                {game.cluesGivenCount}/{game.maxCluesCount}
              </div>
              <div className="text-violet-400">
                {game.guessesCount}/{game.maxGuessesCount}
              </div>
            </div>
          </div>
          <div className="self-end font-semibold">{format(parseToDate(game.date), 'PPP')}</div>
        </div>
      ))}
    </div>
  );
}
