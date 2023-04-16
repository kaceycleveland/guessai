"use client";

import { Button } from "@/components/button";
import { useCallback, useMemo } from "react";
import Modal from "@/components/modal";
import useSWR, { SWRConfiguration } from "swr";
import useSWRMutation from "swr/mutation";
import { BasicModalProps } from "@/components/modal-hooks";
import { LoadingBackdrop } from "@/components/loading-backdrop";
import { useRouter } from "next/navigation";
import { getWordsFromAI, getWordsFromAIKey } from "@/lib/api/get-words-from-ai";
import { postAddNewWord, postAddNewWordKey } from "@/lib/api/post-add-new-word";

const wordsSWRConfig: SWRConfiguration = {
  revalidateIfStale: false,
  shouldRetryOnError: false,
  revalidateOnReconnect: false,
  revalidateOnFocus: false,
};

const assignmentSWRConfig: SWRConfiguration = {
  ...wordsSWRConfig,
  revalidateOnMount: false,
};

export default function GenerateModal({
  isOpen,
  closeModal,
  openModal,
}: BasicModalProps) {
  const router = useRouter();
  const { data, isValidating, mutate } = useSWR(
    getWordsFromAIKey,
    getWordsFromAI,
    wordsSWRConfig
  );

  console.log("words data", data);

  const { isMutating, trigger: assignWord } = useSWRMutation(
    postAddNewWordKey,
    postAddNewWord,
    { onSuccess: router.refresh }
  );

  const isLoading = useMemo(
    () => isValidating || isMutating,
    [isValidating, isMutating]
  );

  const handleReroll = useCallback(() => {
    mutate();
  }, [mutate]);

  const saveWord = useCallback(() => {
    if (data) {
      console.log(data);
      assignWord(data.data);
    }
  }, [assignWord, data]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Generate new Words">
      <div className="relative">
        <LoadingBackdrop
          show={isLoading}
          loadingProps={{ className: "bg-cyan-300" }}
        />

        <LoadingBackdrop className="bg-cyan-300" />
        <div className="my-2">
          <div className="text-xl font-bold text-white p-2 rounded bg-slate-900 text-center my-2">
            {data?.data.word}
          </div>
          <div className="flex flex-col gap-4">
            {data?.data.clues.map((clue, idx) => (
              <div className="text-white" key={idx}>
                {clue}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <Button onClick={handleReroll} disabled={isLoading}>
            Reroll
          </Button>
          <Button
            variant="secondary"
            onClick={saveWord}
            disabled={isLoading || !data?.data.word}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
