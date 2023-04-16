'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';

import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { GAME_COOKIE } from '@/lib/api/cookie-game';
import { postGameClue, postGameClueKey } from '@/lib/api/post-game-clue';
import { postGameGuess, postGameGuessKey } from '@/lib/api/post-guess';
import { GuessWord } from '@/types/guess-word';

interface GuessBoxProps {
  isClueBlocked?: boolean;
  isGuessBlocked?: boolean;
}

export default function GuessBox({ isClueBlocked, isGuessBlocked }: GuessBoxProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { trigger: getClue, isMutating: isLoadingClue } = useSWRMutation(postGameClueKey, postGameClue, {
    onSuccess: (data) => {
      if (data.data.game_id) {
        document.cookie = `${GAME_COOKIE}=${data.data.game_id}`;
      }
      startTransition(() => {
        router.refresh();
      });
    },
  });

  const handleGetClue = useCallback(() => {
    getClue();
  }, [getClue]);

  const { trigger: postGuess, isMutating: isLoadingGuess } = useSWRMutation(postGameGuessKey, postGameGuess);
  const { register, handleSubmit } = useForm<GuessWord>();

  const handleGuess = useCallback(
    handleSubmit(async (guessBody) => {
      const body = await postGuess(guessBody);
      if (body?.data.game_id) {
        console.log('SETTING COOKIE to', body.data.game_id);
        document.cookie = `${GAME_COOKIE}=${body.data.game_id}`;
      }
      startTransition(() => {
        router.refresh();
      });
    }),
    [handleSubmit, postGuess]
  );

  const isDone = isClueBlocked && isGuessBlocked;
  const isLoading = isPending || isLoadingGuess || isLoadingClue;

  return (
    <div className="sticky bottom-4 p-4 bg-slate-950 rounded bg-opacity-90 shadow-lg flex flex-col gap-4">
      {!isDone ? (
        <>
          <Button variant="secondary" onClick={handleGetClue} disabled={isLoading || isClueBlocked}>
            Give me a clue
          </Button>
          <form className="flex gap-4" onSubmit={handleGuess}>
            <Input id="word" type="text" placeholder="Guess a word" {...register('word')} />
            <Button type="submit" className="p-2 basis-1/4" disabled={isLoading || isGuessBlocked}>
              Guess
            </Button>
          </form>
        </>
      ) : (
        <div className="text-white flex items-center font-bold text-center w-full">
          {`You are out of guesses and clues! Check in tomorrow to try again and
          see what today's answer was.`}
        </div>
      )}
    </div>
  );
}
