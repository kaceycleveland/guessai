'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
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
  isGameFinished?: boolean;
  word?: string;
}

const guessRequirements = {
  maxLength: { value: 12, message: 'Your guess must be less than or equal to 13 characters.' },
  minLength: { value: 2, message: 'Your guess must be more than or equal to 3 characters.' },
  required: { value: true, message: 'Enter in a guess!' },
  pattern: { value: /^\S+$/, message: 'Words do not contain whitespace.' },
};
export default function GuessBox({ isClueBlocked, isGuessBlocked, isGameFinished, word }: GuessBoxProps) {
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
  const { register, formState, handleSubmit, reset } = useForm<GuessWord>({ mode: 'all' });
  const errors = useMemo(() => formState.errors, [formState]);

  console.log('errors', errors);
  const handleGuess = useCallback(
    handleSubmit(async (guessBody) => {
      const body = await postGuess(guessBody);
      if (body?.data.game_id) {
        console.log('SETTING COOKIE to', body.data.game_id);
        document.cookie = `${GAME_COOKIE}=${body.data.game_id}`;
      }
      const correct = body?.data.correct;

      if (correct !== undefined) {
        const word = body?.data.word;
        correct
          ? toast(`'${word}' was correct!`, { type: 'success' })
          : toast(`'${word}' was incorrect.`, { type: 'info', autoClose: 1500 });
      }

      reset(guessBody);

      startTransition(() => {
        router.refresh();
      });
    }),
    [handleSubmit, postGuess]
  );

  const isDone = isClueBlocked && isGuessBlocked;
  const isLoading = isPending || isLoadingGuess || isLoadingClue;

  console.log('isGameFinished', isGameFinished, word);

  let bodyContent = (
    <>
      <Button variant="secondary" onClick={handleGetClue} disabled={isLoading || isClueBlocked}>
        Give me a clue
      </Button>
      <form className="flex gap-4" onSubmit={handleGuess}>
        <Input
          id="word"
          type="text"
          placeholder="Guess a word"
          error={errors['word']?.message}
          endContent={errors['word']?.message}
          {...register('word', guessRequirements)}
        />
        <Button
          type="submit"
          className="p-2 basis-1/4"
          disabled={isLoading || isGuessBlocked || !formState.isValid || !formState.isDirty}
        >
          Guess
        </Button>
      </form>
    </>
  );

  if (isDone) {
    bodyContent = (
      <div className="text-white flex items-center font-bold text-center w-full">
        {`You are out of guesses and clues! Check in tomorrow to try again and
    see what today's word was.`}
      </div>
    );
  }

  if (isGameFinished) {
    bodyContent = (
      <div className="text-white font-bold text-center w-full">
        <div>
          <span>You guessed it! The word was </span>
          <span className="text-cyan-500">{word}</span>.
        </div>
        <div>Check back tomorrow for a new word!</div>
      </div>
    );
  }

  return (
    <div className="sticky bottom-4 p-4 bg-slate-950 rounded bg-opacity-90 shadow-lg flex flex-col gap-4">
      {bodyContent}
    </div>
  );
}
