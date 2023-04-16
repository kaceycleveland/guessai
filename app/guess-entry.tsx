"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { postGameGuess, postGameGuessKey } from "@/lib/api/post-guess";
import { GuessWord } from "@/types/guess-word";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

export default function GuessEntry() {
  const router = useRouter();
  const { trigger } = useSWRMutation(postGameGuessKey, postGameGuess);
  const { register, handleSubmit } = useForm<GuessWord>();

  const handleGuess = useCallback(
    handleSubmit((guessBody) => {
      trigger(guessBody).then((body) => {
        if (body?.data.game_id) {
          console.log("SETTING COOKIE to", body.data.game_id);
          document.cookie = `${GAME_COOKIE}=${body.data.game_id}`;
        }
        router.refresh();
      });
    }),
    [handleSubmit]
  );

  return (
    <form className="flex gap-4" onSubmit={handleGuess}>
      <Input
        id="word"
        type="text"
        placeholder="Guess a word"
        {...register("word")}
      />
      <Button type="submit" className="p-2 basis-1/4">
        Guess
      </Button>
    </form>
  );
}
