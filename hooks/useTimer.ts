import { useState, useEffect, useRef, useCallback } from 'react';

type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export const useTimer = (durationMinutes: number, onComplete: () => void) => {
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [remainingTime, setRemainingTime] = useState(durationMinutes * 60);

  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setRemainingTime(durationMinutes * 60);
  }, [durationMinutes]);
  
  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (status !== 'running' || !endTimeRef.current) {
      return;
    }
    
    const now = Date.now();
    const remaining = Math.round((endTimeRef.current - now) / 1000);
    
    if (remaining <= 0) {
      setRemainingTime(0);
      setStatus('completed');
      stopTimer();
      onCompleteRef.current();
    } else {
      setRemainingTime(remaining);
    }
  }, [status, stopTimer]);
  
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(tick, 1000);
    }
    return stopTimer;
  }, [status, tick, stopTimer]);

  const start = useCallback(() => {
    setRemainingTime(durationMinutes * 60);
    endTimeRef.current = Date.now() + durationMinutes * 60 * 1000;
    setStatus('running');
  }, [durationMinutes]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    stopTimer();
    pausedTimeRef.current = Date.now();
    setStatus('paused');
  }, [status, stopTimer]);

  const resume = useCallback(() => {
    if (status !== 'paused' || !pausedTimeRef.current || !endTimeRef.current) return;
    const pauseDuration = Date.now() - pausedTimeRef.current;
    endTimeRef.current += pauseDuration;
    pausedTimeRef.current = null;
    setStatus('running');
  }, [status]);
  
  const reset = useCallback(() => {
    stopTimer();
    setStatus('idle');
    setRemainingTime(durationMinutes * 60);
    endTimeRef.current = null;
    pausedTimeRef.current = null;
  }, [stopTimer, durationMinutes]);

  return {
    remainingTime,
    status,
    start,
    pause,
    resume,
    reset,
    // FIX: Expose durationMinutes to be used in the SessionView component for progress calculation.
    durationMinutes,
  };
};
