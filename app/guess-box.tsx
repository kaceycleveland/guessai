"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { postGameGuess, postGameGuessKey } from "@/lib/api/post-guess";
import { GuessWord } from "@/types/guess-word";
import { useForm } from "react-hook-form";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { postGameClue, postGameClueKey } from "@/lib/api/post-game-clue";

export default function GuessBox() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const { trigger: getClue, isMutating: isLoadingClue } = useSWRMutation(
    postGameClueKey,
    postGameClue,
    {
      onSuccess: (data) => {
        if (data.data.game_id) {
          document.cookie = `${GAME_COOKIE}=${data.data.game_id}`;
        }
        startTransition(() => {
          router.refresh();
        });
      },
    }
  );

  const handleGetClue = useCallback(() => {
    getClue();
  }, [getClue]);

  const { trigger: postGuess, isMutating: isLoadingGuess } = useSWRMutation(
    postGameGuessKey,
    postGameGuess
  );
  const { register, handleSubmit } = useForm<GuessWord>();

  const handleGuess = useCallback(
    handleSubmit(async (guessBody) => {
      const body = await postGuess(guessBody);
      if (body?.data.game_id) {
        console.log("SETTING COOKIE to", body.data.game_id);
        document.cookie = `${GAME_COOKIE}=${body.data.game_id}`;
      }
      startTransition(() => {
        router.refresh();
      });
    }),
    [handleSubmit, postGuess]
  );

  const isLoading = isPending || isLoadingGuess || isLoadingClue;

  return (
    <div className="sticky bottom-4 p-4 bg-slate-950 rounded bg-opacity-90 shadow-lg flex flex-col gap-4">
      <Button variant="secondary" onClick={handleGetClue} disabled={isLoading}>
        Give me a clue
      </Button>
      <form className="flex gap-4" onSubmit={handleGuess}>
        <Input
          id="word"
          type="text"
          placeholder="Guess a word"
          {...register("word")}
        />
        <Button type="submit" className="p-2 basis-1/4" disabled={isLoading}>
          Guess
        </Button>
      </form>
    </div>
  );
}
