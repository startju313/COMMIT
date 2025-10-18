
import React from 'react';
import { getPastDates } from '../utils/date';

interface CommitGraphProps {
  commitData: Record<string, number>;
}

const getColorClass = (points: number | undefined): string => {
  if (!points || points === 0) return 'bg-gray-800';
  if (points < 50) return 'bg-secondary/30';
  if (points < 100) return 'bg-secondary/50';
  if (points < 150) return 'bg-secondary/80';
  return 'bg-secondary';
};

const DayCell: React.FC<{ date: string; points: number | undefined }> = ({ date, points }) => {
  return (
    <div className="group relative">
      <div className={`w-full h-full rounded-sm ${getColorClass(points)}`}></div>
      <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-brand-bg text-text-main text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        {date}: {points || 0} 포인트
      </div>
    </div>
  );
};

export const CommitGraph: React.FC<CommitGraphProps> = ({ commitData }) => {
  // Display approximately 15 weeks
  const displayDays = 7 * 15;
  const dates = getPastDates(displayDays);

  const firstDate = new Date(dates[0]);
  const dayOfWeek = firstDate.getDay(); // 0 for Sunday, 1 for Monday...
  
  const placeholders = Array.from({ length: dayOfWeek });

  return (
    <div className="bg-surface p-6 rounded-2xl flex-1">
      <h2 className="text-lg font-bold text-text-main mb-4">학습 잔디</h2>
      <div className="grid grid-rows-7 grid-flow-col gap-1 aspect-[15/7]">
        {placeholders.map((_, index) => <div key={`placeholder-${index}`} />)}
        {dates.map(date => (
          <DayCell key={date} date={date} points={commitData[date]} />
        ))}
      </div>
       <div className="flex justify-end items-center gap-2 mt-2 text-xs text-text-secondary">
        적게
        <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
        <div className="w-3 h-3 rounded-sm bg-secondary/30"></div>
        <div className="w-3 h-3 rounded-sm bg-secondary/50"></div>
        <div className="w-3 h-3 rounded-sm bg-secondary/80"></div>
        <div className="w-3 h-3 rounded-sm bg-secondary"></div>
        많게
      </div>
    </div>
  );
};
