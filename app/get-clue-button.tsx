"use client";

import { Button } from "@/components/button";
import { GAME_COOKIE } from "@/lib/api/cookie-game";
import { postGameClue, postGameClueKey } from "@/lib/api/post-game-clue";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import useSWRMutation from "swr/mutation";

export default function GetClueButton() {
  const router = useRouter();
  const { trigger } = useSWRMutation(postGameClueKey, postGameClue, {
    onSuccess: (data) => {
      if (data.data.game_id) {
        document.cookie = `${GAME_COOKIE}=${data.data.game_id}`;
      }
      router.refresh();
    },
  });

  const handleGetClue = useCallback(() => {
    trigger();
  }, [trigger]);

  return (
    <Button variant="secondary" onClick={handleGetClue}>
      Give me a clue
    </Button>
  );
}
