
import React, { useState, useEffect, useCallback } from 'react';
import { HomeView } from './components/HomeView';
import { SessionView } from './components/SessionView';
import { SettingsView } from './components/SettingsView';
import { CompletionModal } from './components/CompletionModal';

import { useSettings } from './hooks/useSettings';
import { useSessionData } from './hooks/useSessionData';
import { useTimer } from './hooks/useTimer';
import { useSound } from './hooks/useSound';
import { useFullscreen } from './hooks/useFullscreen';
import type { Session } from './types';

type View = 'home' | 'session' | 'settings';

function App() {
  const [view, setView] = useState<View>('home');
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [completedSession, setCompletedSession] = useState<Session | null>(null);

  const { settings, updateSettings, isSettingsLoaded } = useSettings();
  const { sessions, summary, addSession, isDataLoaded } = useSessionData();
  const { playCompletionSound } = useSound(settings.soundEnabled);
  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();
  
  const handleSessionComplete = useCallback(() => {
    const session = addSession({
      scheduledMinutes: sessionMinutes,
      actualDuration: sessionMinutes * 60,
      status: 'completed',
    });
    setCompletedSession(session);
    playCompletionSound();
    if (isFullscreen) {
      exitFullscreen();
    }
  }, [addSession, sessionMinutes, playCompletionSound, isFullscreen, exitFullscreen]);

  const timer = useTimer(sessionMinutes, handleSessionComplete);

  useEffect(() => {
    if (isSettingsLoaded) {
      setSessionMinutes(settings.defaultSessionMinutes);
    }
  }, [isSettingsLoaded, settings.defaultSessionMinutes]);
  
  const startSession = (minutes: number) => {
    setSessionMinutes(minutes);
    timer.start();
    setView('session');
    enterFullscreen().catch(err => console.error('Fullscreen failed:', err));
  };
  
  const abortSession = useCallback((reason: 'user_abort' | 'tab_close') => {
    const elapsedSeconds = (sessionMinutes * 60) - timer.remainingTime;
    addSession({
      scheduledMinutes: sessionMinutes,
      actualDuration: elapsedSeconds,
      status: 'aborted',
      abortReason: reason,
    });
    timer.reset();
    setView('home');
    if (isFullscreen) {
      exitFullscreen();
    }
  }, [sessionMinutes, timer, addSession, isFullscreen, exitFullscreen]);

  const closeCompletionModal = () => {
    setCompletedSession(null);
    setView('home');
  };

  const startNextSession = () => {
    setCompletedSession(null);
    startSession(settings.defaultSessionMinutes);
  };
  
  // Handling for user navigating away or closing tab
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (timer.status === 'running' || timer.status === 'paused') {
        abortSession('tab_close');
        // Note: Custom messages are not supported by most modern browsers.
        // This is to trigger the confirmation dialog.
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [timer.status, abortSession]);


  if (!isSettingsLoaded || !isDataLoaded) {
    return <div className="w-screen h-screen bg-brand-bg flex items-center justify-center text-text-main">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-brand-bg text-text-main font-sans">
      {view === 'home' && (
        <HomeView
          settings={settings}
          summary={summary}
          sessions={sessions}
          startSession={startSession}
          showSettings={() => setView('settings')}
        />
      )}
      {view === 'session' && (
        <SessionView timer={timer} abortSession={abortSession} />
      )}
      {view === 'settings' && (
        <SettingsView
          settings={settings}
          updateSettings={updateSettings}
          onBack={() => setView('home')}
        />
      )}
      {completedSession && (
        <CompletionModal
          session={completedSession}
          onClose={closeCompletionModal}
          onStartNext={startNextSession}
        />
      )}
    </div>
  );
}

export default App;
