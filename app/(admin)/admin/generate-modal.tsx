'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import useSWRMutation from 'swr/mutation';

import { useSupabase } from '@/app/supabase-provider';
import { Button } from '@/components/button';
import { LoadingBackdrop } from '@/components/loading-backdrop';
import Modal from '@/components/modal';
import { BasicModalProps } from '@/components/modal-hooks';
import { postAddNewWord, postAddNewWordKey } from '@/lib/api/post-add-new-word';
import { GenerateWord } from '@/types/generate-word';

const getWordsFromAIKey = ['words', 'post'];

export default function GenerateModal({ isOpen, closeModal, openModal }: BasicModalProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const {
    data,
    isMutating: isGettingNewWord,
    trigger: getNewWord,
  } = useSWRMutation(getWordsFromAIKey, () => {
    return supabase.functions.invoke<GenerateWord>('get-word-from-ai');
  });

  const { isMutating: isAddingNewWord, trigger: assignWord } = useSWRMutation(postAddNewWordKey, postAddNewWord, {
    onSuccess: router.refresh,
  });

  const hasWordData = Boolean(data?.data?.word);
  const isLoading = useMemo(() => isGettingNewWord || isAddingNewWord, [isGettingNewWord, isAddingNewWord]);

  const handleReroll = useCallback(() => {
    getNewWord();
  }, [getNewWord]);

  const saveWord = useCallback(() => {
    if (data?.data) {
      assignWord(data?.data);
    }
  }, [assignWord, data]);

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} title="Generate new Words">
      <div className="relative">
        <LoadingBackdrop show={isLoading} loadingProps={{ className: 'bg-cyan-300' }} />
        <div className="my-2">
          {data?.data?.word && (
            <div className="my-2 rounded bg-slate-900 p-2 text-center text-xl font-bold text-white">
              {data.data.word}
            </div>
          )}
          <div className="flex flex-col gap-4">
            {!hasWordData && (
              <div className="font-bold text-white">{`Press 'reroll' to request a new word and clues from AI.`}</div>
            )}
            {data?.data?.clues.map((clue, idx) => (
              <div className="text-white" key={idx}>
                {clue}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button onClick={handleReroll} disabled={isLoading}>
            Reroll
          </Button>
          <Button variant="secondary" onClick={saveWord} disabled={isLoading || !data?.data?.word}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
