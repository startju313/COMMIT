import React from 'react';
import type { Summary } from '../types';
import { DAILY_GOAL_POINTS } from '../constants';

interface SessionSummaryProps {
  summary: Summary;
}

export const SessionSummary: React.FC<SessionSummaryProps> = ({ summary }) => {
  const goalAchieved = summary.todayPoints >= DAILY_GOAL_POINTS;

  return (
    <div className="bg-surface p-6 rounded-2xl">
      <h2 className="text-lg font-bold text-text-main mb-4">오늘의 성과</h2>
      {goalAchieved && (
        <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg text-center">
          <p className="font-bold text-secondary animate-pulse">🎉 오늘의 목표 달성! 🎉</p>
          <p className="text-sm text-text-secondary mt-1">정말 대단해요! 꾸준함이 성장의 비결입니다.</p>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-3xl font-black text-secondary">{summary.todayPoints}</p>
          <p className="text-sm text-text-secondary">오늘의 포인트</p>
        </div>
        <div>
          <p className="text-3xl font-black text-secondary">{summary.todayCompletedCount}</p>
          <p className="text-sm text-text-secondary">완료 세션</p>
        </div>
        <div>
          <p className="text-3xl font-black text-secondary">{summary.totalPoints}</p>
          <p className="text-sm text-text-secondary">누적 포인트</p>
        </div>
      </div>
    </div>
  );
};