'use client';

import { formatDuration, intervalToDuration } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface CountdownProps {
  timeInSeconds: number;
}

export const Countdown = ({ timeInSeconds }: CountdownProps) => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(timeInSeconds);

  useEffect(() => {
    if (countdown <= 0) {
      router.refresh();
    }
  }, [router, countdown]);

  useEffect(() => {
    const interval = setInterval(() => setCountdown((countdown) => countdown - 1), 1000);
    return () => clearInterval(interval);
  }, [setCountdown]);

  return <span>{formatDuration(intervalToDuration({ start: 0, end: countdown * 1000 }))}</span>;
};
