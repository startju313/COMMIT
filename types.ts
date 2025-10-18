
export interface Settings {
  defaultSessionMinutes: number;
  soundEnabled: boolean;
}

export type SessionStatus = 'completed' | 'aborted';

export type AbortReason = 'user_abort' | 'tab_close';

export interface Session {
  id: string;
  startTime: number;
  endTime: number;
  scheduledMinutes: number;
  actualDuration: number; // in seconds
  status: SessionStatus;
  points: number;
  abortReason?: AbortReason;
}

export interface Summary {
  todayPoints: number;
  todayCompletedCount: number;
  totalPoints: number;
  commitData: Record<string, number>; // date -> points
}
