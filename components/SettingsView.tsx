
import React from 'react';
import type { Settings } from '../types';
import { MIN_SESSION_MINUTES, MAX_SESSION_MINUTES } from '../constants';

interface SettingsViewProps {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-surface p-8 rounded-2xl flex flex-col gap-8">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-brand-bg transition-colors" aria-label="뒤로가기">
          <ArrowLeftIcon />
        </button>
        <h1 className="text-2xl font-bold text-text-main">설정</h1>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <label htmlFor="default-minutes" className="text-lg text-text-secondary">기본 세션 길이 (분)</label>
          <input
            id="default-minutes"
            type="number"
            value={settings.defaultSessionMinutes}
            onChange={(e) => {
                let value = parseInt(e.target.value, 10);
                if (value < MIN_SESSION_MINUTES) value = MIN_SESSION_MINUTES;
                if (value > MAX_SESSION_MINUTES) value = MAX_SESSION_MINUTES;
                updateSettings({ defaultSessionMinutes: value || MIN_SESSION_MINUTES });
            }}
            className="w-24 bg-brand-bg text-center text-xl font-bold p-2 rounded-lg border-2 border-transparent focus:border-primary focus:outline-none"
            min={MIN_SESSION_MINUTES}
            max={MAX_SESSION_MINUTES}
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="sound-enabled" className="text-lg text-text-secondary">세션 완료 알림음</label>
          <button
            id="sound-enabled"
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.soundEnabled ? 'bg-primary' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6 flex flex-col gap-4 text-text-secondary">
          <h2 className="text-xl font-bold text-text-main mb-2">정책 안내</h2>
          <p><strong>포인트 적립:</strong> 세션을 성공적으로 완료할 때마다 1분당 1포인트가 적립됩니다. (최대 180포인트/세션)</p>
          <p><strong>미완료 처리:</strong> 세션을 중간에 종료하거나 브라우저를 이탈하면 포인트가 지급되지 않습니다.</p>
          <p><strong>최소 세션 길이:</strong> 집중의 의미를 위해 최소 세션 길이는 {MIN_SESSION_MINUTES}분입니다.</p>
      </div>

    </div>
  );
};

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
)
