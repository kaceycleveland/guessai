'use client';

import clsx from 'clsx';
import { addDays, format, subDays } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';

import { Button } from '@/components/button';
import { Loading } from '@/components/loading';
import useModal from '@/components/modal-hooks';
import { getWordAssignments, getWordAssignmentsKey } from '@/lib/client-api/get-word-assignments';
import { DATE_FORMAT, parseToDate } from '@/lib/utils/date-format';

import AssignWordModal from './assign-word-modal';

const getDates = (startDate: Date, days: number) => {
  return Array(days)
    .fill(1)
    .map((_, idx) => addDays(startDate, idx));
};

interface CalendarProps {
  currentDate: string;
}

export const Calendar = ({ currentDate }: CalendarProps) => {
  const parsedCurrentDate = useMemo(() => parseToDate(currentDate), [currentDate]);
  const modalProps = useModal();
  const [startDate, setStartDate] = useState(parsedCurrentDate);
  const days = useMemo(() => getDates(startDate, 7), [startDate]);
  const after = useMemo(() => format(days[0], DATE_FORMAT), [days]);
  const before = useMemo(() => format(days[days.length - 1], DATE_FORMAT), [days]);
  const prevPage = useCallback(() => setStartDate(subDays(days[0], 7)), [days]);
  const nextPage = useCallback(() => setStartDate(addDays(days[days.length - 1], 1)), [days]);
  const { data, isValidating } = useSWR(getWordAssignmentsKey({ before, after }), getWordAssignments);

  const [activeDate, setActiveDate] = useState<Date>();
  const activeDateWord = useMemo(() => {
    if (activeDate) {
      const words = data ? data.data.dates[format(activeDate, DATE_FORMAT)] : undefined;
      const foundWord = words ? words[0] : undefined;
      return foundWord;
    }
  }, [activeDate, data]);

  return (
    <>
      <AssignWordModal date={activeDate} wordId={activeDateWord?.id} {...modalProps} />
      <div className="relative flex w-full flex-col gap-4">
        <div
          className={clsx('absolute inset-0 flex items-center justify-center backdrop-blur-sm transition-opacity', {
            'opacity-0 pointer-events-none': !isValidating,
            'opacity-100 pointer-events-auto': isValidating,
          })}
        >
          <Loading className="bg-cyan-500" />
        </div>
        {days.map((day, idx) => {
          const words = data ? data.data.dates[format(day, DATE_FORMAT)] : undefined;
          const foundWord = words ? words[0] : undefined;
          return (
            <div
              className="flex h-14 cursor-pointer items-center justify-between rounded bg-cyan-800 p-2 font-bold text-white transition-colors hover:bg-cyan-600"
              onClick={() => {
                setActiveDate(day);
                modalProps.openModal();
              }}
              key={idx}
            >
              <div className="ml-2">{format(day, 'PPP')}</div>
              {foundWord && <div className="rounded bg-slate-800 p-2">{foundWord.word}</div>}
            </div>
          );
        })}
        <div className="flex w-full gap-4">
          <Button onClick={prevPage}>Previous</Button>
          <Button onClick={nextPage}>Next</Button>
        </div>
      </div>
    </>
  );
};
