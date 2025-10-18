import React, { useState, useEffect } from 'react';
import type { useTimer } from '../hooks/useTimer';
import { ConfirmAbortModal } from './ConfirmAbortModal';

interface SessionViewProps {
  timer: ReturnType<typeof useTimer>;
  abortSession: (reason: 'user_abort' | 'tab_close') => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const CircleProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const radius = 140;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="-rotate-90">
      <circle
        stroke="#333"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="url(#gradient)"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, strokeLinecap: 'round' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
       <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#50E3C2" />
          <stop offset="100%" stopColor="#4A90E2" />
        </linearGradient>
      </defs>
    </svg>
  );
};


export const SessionView: React.FC<SessionViewProps> = ({ timer, abortSession }) => {
  const [showAbortModal, setShowAbortModal] = useState(false);
  // FIX: Removed unused variables `totalDuration` and `progress` which were causing errors
  // because they were trying to access properties not exposed by the `useTimer` hook.
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (timer.status === 'running') timer.pause();
        else if (timer.status === 'paused') timer.resume();
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        setShowAbortModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timer]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 bg-brand-bg">
        <div className="relative flex items-center justify-center">
            {/* FIX: The timer object now correctly includes `durationMinutes`. */}
            <CircleProgressBar progress={timer.remainingTime / (timer.durationMinutes * 60)} />
            <div className="absolute flex flex-col items-center">
                 <h1 className="text-8xl md:text-9xl font-black tabular-nums tracking-tighter text-text-main">
                    {formatTime(timer.remainingTime)}
                </h1>
                <p className="text-text-secondary text-lg">{timer.status === 'paused' ? '일시정지됨' : '집중하는 중...'}</p>
            </div>
        </div>

      <div className="mt-12 flex items-center gap-6">
        {timer.status === 'running' && (
          <button onClick={timer.pause} className="px-8 py-3 bg-surface text-text-main rounded-lg font-semibold hover:bg-gray-700 transition">일시정지 (Space)</button>
        )}
        {timer.status === 'paused' && (
          <button onClick={timer.resume} className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-focus transition">계속하기 (Space)</button>
        )}
        <button onClick={() => setShowAbortModal(true)} className="px-8 py-3 bg-transparent text-danger rounded-lg font-semibold hover:bg-danger/10 transition">세션 종료 (Esc)</button>
      </div>

      {showAbortModal && (
        <ConfirmAbortModal
          onConfirm={() => {
            abortSession('user_abort');
            setShowAbortModal(false);
          }}
          onCancel={() => setShowAbortModal(false)}
        />
      )}
    </div>
  );
};
