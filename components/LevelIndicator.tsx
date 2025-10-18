
import React from 'react';

interface LevelIndicatorProps {
  totalPoints: number;
}

const getLevel = (points: number) => {
  // Simple logarithmic scaling for level
  if (points < 100) return 1;
  return Math.floor(Math.log2(points / 50)) + 1;
};

const getPointsForLevel = (level: number) => {
    if (level <= 1) return 100;
    return Math.pow(2, level - 1) * 50;
};

export const LevelIndicator: React.FC<LevelIndicatorProps> = ({ totalPoints }) => {
  const level = getLevel(totalPoints);
  const pointsForCurrentLevelStart = getPointsForLevel(level-1);
  const pointsForNextLevel = getPointsForLevel(level);

  const pointsInCurrentLevel = totalPoints - (level > 1 ? pointsForCurrentLevelStart : 0);
  const pointsNeededForLevel = pointsForNextLevel - (level > 1 ? pointsForCurrentLevelStart : 0);
  
  const progress = pointsInCurrentLevel / pointsNeededForLevel;
  
  return (
    <div className="bg-surface p-6 rounded-2xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-text-main">레벨 {level}</h2>
        <p className="text-sm text-text-secondary">{totalPoints.toLocaleString()} / {pointsForNextLevel.toLocaleString()} P</p>
      </div>
      <div className="w-full bg-brand-bg rounded-full h-2.5">
        <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progress * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-text-secondary mt-2 text-right">다음 레벨까지 {(pointsForNextLevel - totalPoints).toLocaleString()} 포인트</p>
    </div>
  );
};
