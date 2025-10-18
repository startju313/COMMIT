
import React, { useState, useEffect } from 'react';
import type { Settings, Summary, Session } from '../types';
import { SESSION_PRESETS, MIN_SESSION_MINUTES, MAX_SESSION_MINUTES } from '../constants';

import { SessionSummary } from './SessionSummary';
import { CommitGraph } from './CommitGraph';
import { LevelIndicator } from './LevelIndicator';
import { TodayHistory } from './TodayHistory';

interface HomeViewProps {
  settings: Settings;
  summary: Summary;
  sessions: Session[];
  startSession: (minutes: number) => void;
  showSettings: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ settings, summary, sessions, startSession, showSettings }) => {
  const [sessionMinutes, setSessionMinutes] = useState(settings.defaultSessionMinutes);

  useEffect(() => {
    setSessionMinutes(settings.defaultSessionMinutes);
  }, [settings.defaultSessionMinutes]);

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
        value = MIN_SESSION_MINUTES;
    }
    setSessionMinutes(value);
  };

  const validateAndStart = () => {
    let value = sessionMinutes;
    if (value < MIN_SESSION_MINUTES) value = MIN_SESSION_MINUTES;
    if (value > MAX_SESSION_MINUTES) value = MAX_SESSION_MINUTES;
    setSessionMinutes(value);
    startSession(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col gap-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-text-main tracking-tight">Commit</h1>
        <button onClick={showSettings} className="p-2 rounded-full hover:bg-surface transition-colors" aria-label="설정">
          <SettingsIcon />
        </button>
      </header>

      <main className="flex flex-col gap-6">
        <div className="bg-surface p-6 rounded-2xl flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-text-main">얼마나 집중할까요?</h2>
          <div className="flex items-center gap-3">
            {SESSION_PRESETS.map(preset => (
              <button
                key={preset}
                onClick={() => setSessionMinutes(preset)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  sessionMinutes === preset ? 'bg-primary text-white' : 'bg-brand-bg text-text-secondary hover:bg-gray-700'
                }`}
              >
                {preset}분
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={sessionMinutes}
              onChange={handleMinutesChange}
              className="w-24 bg-brand-bg text-center text-2xl font-bold p-2 rounded-lg border-2 border-transparent focus:border-primary focus:outline-none"
              min={MIN_SESSION_MINUTES}
              max={MAX_SESSION_MINUTES}
            />
            <span className="text-xl text-text-secondary">분</span>
          </div>
          <button
            onClick={validateAndStart}
            className="w-full max-w-xs bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-focus transition-transform transform hover:scale-105"
          >
            집중 시작하기
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <SessionSummary summary={summary} />
            <LevelIndicator totalPoints={summary.totalPoints} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <CommitGraph commitData={summary.commitData} />
            <TodayHistory sessions={sessions} />
        </div>
      </main>
    </div>
  );
};

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)
