"use client";

import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function GetClueButton() {
  const router = useRouter();

  const handleGetClue = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <Button variant="secondary" onClick={handleGetClue}>
      Give me a clue
    </Button>
  );
}
