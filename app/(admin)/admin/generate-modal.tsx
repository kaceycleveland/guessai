'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation from 'swr/mutation';

import { Button } from '@/components/button';
import { LoadingBackdrop } from '@/components/loading-backdrop';
import Modal from '@/components/modal';
import { BasicModalProps } from '@/components/modal-hooks';
import { getWordsFromAI, getWordsFromAIKey } from '@/lib/api/get-words-from-ai';
import { postAddNewWord, postAddNewWordKey } from '@/lib/api/post-add-new-word';

export default function GenerateModal({ isOpen, closeModal, openModal }: BasicModalProps) {
  const router = useRouter();
  const { data, isMutating: isGettingNewWord, trigger: getNewWord } = useSWRMutation(getWordsFromAIKey, getWordsFromAI);

  const { isMutating: isAddingNewWord, trigger: assignWord } = useSWRMutation(postAddNewWordKey, postAddNewWord, {
    onSuccess: router.refresh,
  });

  const hasWordData = Boolean(data?.data.word);
  const isLoading = useMemo(() => isGettingNewWord || isAddingNewWord, [isGettingNewWord, isAddingNewWord]);

  const handleReroll = useCallback(() => {
    getNewWord();
  }, [getNewWord]);

  const saveWord = useCallback(() => {
    if (data) {
      console.log(data);
      assignWord(data.data);
    }
  }, [assignWord, data]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Generate new Words">
      <div className="relative">
        <LoadingBackdrop show={isLoading} loadingProps={{ className: 'bg-cyan-300' }} />
        <div className="my-2">
          {data?.data.word && (
            <div className="text-xl font-bold text-white p-2 rounded bg-slate-900 text-center my-2">
              {data.data.word}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {!hasWordData && (
              <div className="text-white font-bold">{`Press 'reroll' to request a new word and clues from AI.`}</div>
            )}
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
          <Button variant="secondary" onClick={saveWord} disabled={isLoading || !data?.data.word}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
