'use client';

import { addDays, format } from 'date-fns';
import { useMemo, useState } from 'react';
import useSWR from 'swr';

import useModal from '@/components/modal-hooks';
import { getWordAssignments, getWordAssignmentsKey } from '@/lib/api/get-word-assignments';
import { DATE_FORMAT, parseToDate } from '@/lib/utils/date-format';

import AssignWordModal from './assign-word-modal';

const getDates = (startDate: Date, days: number) => {
  return Array(days)
    .fill(1)
    .map((day, idx) => addDays(startDate, idx));
};

interface CalendarProps {
  currentDate: string;
}

export const Calendar = ({ currentDate }: CalendarProps) => {
  console.log(currentDate);
  const parsedCurrentDate = useMemo(() => parseToDate(currentDate), []);
  const modalProps = useModal();
  const [startDate, setStartDate] = useState(parsedCurrentDate);
  const days = useMemo(() => getDates(startDate, 7), [startDate]);
  const before = useMemo(() => format(days[days.length - 1], DATE_FORMAT), [days]);
  const after = useMemo(() => format(days[0], DATE_FORMAT), [days]);
  const { data } = useSWR(getWordAssignmentsKey({ before, after }), getWordAssignments);

  console.log('word assignments', data);
  const [activeDate, setActiveDate] = useState<Date>();

  return (
    <>
      <AssignWordModal date={activeDate} {...modalProps} />
      <div className="flex flex-col gap-4">
        {days.map((day, idx) => {
          const words = data ? data.data.dates[format(day, DATE_FORMAT)] : undefined;
          return (
            <div
              className="p-2 bg-cyan-800 text-white font-bold rounded flex justify-between"
              onClick={() => {
                setActiveDate(day);
                modalProps.openModal();
              }}
              key={idx}
            >
              <div>{format(day, 'PPP')}</div>
              {words && <div>{words.map((word) => word)}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
};
