import React from 'react';
import type { Session } from '../types';
import { getTodayDateString, getLocalDateString } from '../utils/date';

interface TodayHistoryProps {
  sessions: Session[];
}

const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const TodayHistory: React.FC<TodayHistoryProps> = ({ sessions }) => {
  const today = getTodayDateString();
  const todaySessions = sessions
    .filter(s => getLocalDateString(new Date(s.startTime)) === today && s.status === 'completed')
    .sort((a, b) => b.startTime - a.startTime)
    .slice(0, 5); // Display up to 5 most recent sessions

  if (todaySessions.length === 0) {
    return (
      <div className="bg-surface p-6 rounded-2xl text-center flex flex-col justify-center h-full">
        <h2 className="text-lg font-bold text-text-main mb-2">오늘의 기록</h2>
        <p className="text-text-secondary">아직 완료된 세션이 없어요.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface p-6 rounded-2xl">
      <h2 className="text-lg font-bold text-text-main mb-4">오늘의 기록</h2>
      <ul className="flex flex-col gap-3 max-h-48 overflow-y-auto pr-2">
        {todaySessions.map(session => (
          <li key={session.id} className="flex justify-between items-center bg-brand-bg p-3 rounded-lg">
            <div>
              <p className="font-semibold text-text-main">{session.scheduledMinutes}분 집중</p>
              <p className="text-xs text-text-secondary">{formatTime(session.startTime)} ~ {formatTime(session.endTime)}</p>
            </div>
            <p className="font-bold text-primary text-lg">+{session.points} P</p>
          </li>
        ))}
      </ul>
    </div>
  );
};