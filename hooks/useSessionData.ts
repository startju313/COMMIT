
import { useState, useEffect, useCallback } from 'react';
import type { Session, Summary } from '../types';
import { getTodayDateString, getLocalDateString } from '../utils/date';
import { POINTS_PER_MINUTE } from '../constants';

const SESSIONS_KEY = 'commit-app-sessions';

export const useSessionData = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [summary, setSummary] = useState<Summary>({
    todayPoints: 0,
    todayCompletedCount: 0,
    totalPoints: 0,
    commitData: {},
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem(SESSIONS_KEY);
      const parsedSessions: Session[] = storedSessions ? JSON.parse(storedSessions) : [];
      setSessions(parsedSessions);
    } catch (error) {
      console.error('Failed to load sessions from localStorage:', error);
      setSessions([]);
    } finally {
      setIsDataLoaded(true);
    }
  }, []);

  const calculateSummary = useCallback((allSessions: Session[]): Summary => {
    const today = getTodayDateString();
    let todayPoints = 0;
    let todayCompletedCount = 0;
    let totalPoints = 0;
    const commitData: Record<string, number> = {};

    allSessions.forEach(session => {
      const sessionDate = getLocalDateString(new Date(session.startTime));
      
      if (session.status === 'completed') {
        totalPoints += session.points;
        
        if (!commitData[sessionDate]) {
          commitData[sessionDate] = 0;
        }
        commitData[sessionDate] += session.points;

        if (sessionDate === today) {
          todayPoints += session.points;
          todayCompletedCount++;
        }
      }
    });

    return { todayPoints, todayCompletedCount, totalPoints, commitData };
  }, []);


  useEffect(() => {
    if (isDataLoaded) {
      const newSummary = calculateSummary(sessions);
      setSummary(newSummary);
      try {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Failed to save sessions to localStorage:', error);
      }
    }
  }, [sessions, isDataLoaded, calculateSummary]);

  const addSession = useCallback((sessionData: {
    scheduledMinutes: number;
    actualDuration: number;
    status: Session['status'];
    abortReason?: Session['abortReason'];
  }) => {
    const now = Date.now();
    const points = sessionData.status === 'completed' 
      ? Math.floor(sessionData.actualDuration / 60) * POINTS_PER_MINUTE 
      : 0;
    
    const newSession: Session = {
      ...sessionData,
      id: `sess_${now}`,
      startTime: now - sessionData.actualDuration * 1000,
      endTime: now,
      points,
    };

    setSessions(prevSessions => [...prevSessions, newSession]);
    return newSession;
  }, []);

  return { sessions, summary, addSession, isDataLoaded };
};
