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
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Keep countdown in sync
  useEffect(() => {
    if (countdown <= 0 && isTransitioning) {
      setCountdown(timeInSeconds);
      setIsTransitioning(false);
    }
  }, [timeInSeconds, countdown, isTransitioning, setIsTransitioning]);

  useEffect(() => {
    if (countdown <= 0 && !isTransitioning) {
      setIsTransitioning(true);
      router.refresh();
    }
  }, [router, countdown, isTransitioning, setIsTransitioning]);

  useEffect(() => {
    const interval = setInterval(() => setCountdown((countdown) => countdown - 1), 1000);
    return () => clearInterval(interval);
  }, [setCountdown]);

  return <span>{formatDuration(intervalToDuration({ start: 0, end: countdown * 1000 }))}</span>;
};
