'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';

import { Button } from '@/components/button';
import { LoadingBackdrop } from '@/components/loading-backdrop';
import Modal from '@/components/modal';
import { BasicModalProps } from '@/components/modal-hooks';
import { getWordAssignmentsKey } from '@/lib/api/get-word-assignments';
import { getWords, getWordsKey } from '@/lib/api/get-words';
import { putWordAssignment, putWordAssignmentKey } from '@/lib/api/put-word-assignment';
import { DATE_FORMAT } from '@/lib/utils/date-format';

interface AssignWordModalProps extends BasicModalProps {
  date?: Date;
}

export default function AssignWordModal({ date, isOpen, closeModal, openModal }: AssignWordModalProps) {
  const [activeWordId, setActiveWordId] = useState<number>();
  const router = useRouter();
  const { data, isValidating } = useSWR(getWordsKey, getWords);
  console.log('words data', data);

  const { isMutating, trigger: assignWordToDate } = useSWRMutation(putWordAssignmentKey, putWordAssignment, {
    onSuccess: () => {
      mutate((key?: string[]) => {
        if (key) {
          return getWordAssignmentsKey().every((val, idx) => val === key[idx]);
        }
      });
      router.refresh();
    },
  });

  const isLoading = useMemo(() => isValidating || isMutating, [isValidating, isMutating]);

  const handleAssignment = useCallback(() => {
    if (activeWordId && date)
      assignWordToDate({
        date: format(date, DATE_FORMAT),
        word_id: activeWordId,
      });
  }, [date, assignWordToDate, activeWordId]);

  if (!date) return null;

  return (
    <Modal isOpen={isOpen && Boolean(date)} closeModal={closeModal} title={`Set word for ${format(date, 'PPP')}`}>
      <div className="relative">
        <LoadingBackdrop show={isLoading} loadingProps={{ className: 'bg-cyan-300' }} />
        <div className="my-2">
          {data?.data.words.map((word, idx) => {
            return (
              <div
                key={idx}
                className={clsx('text-xl font-bold text-white p-2 rounded text-center my-2', {
                  'bg-slate-900': word.id !== activeWordId,
                  'bg-cyan-900': word.id === activeWordId,
                })}
                onClick={() => setActiveWordId(word.id)}
              >
                {word.word}
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 justify-end">
          <Button variant="secondary" onClick={handleAssignment} disabled={isLoading || !activeWordId}>
            Assign
          </Button>
        </div>
      </div>
    </Modal>
  );
}
