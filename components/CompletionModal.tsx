
import React from 'react';
import type { Session } from '../types';

interface CompletionModalProps {
  session: Session;
  onClose: () => void;
  onStartNext: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ session, onClose, onStartNext }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4 animate-fade-in-up">
        <h2 className="text-2xl font-bold text-secondary">세션 완료!</h2>
        <p className="text-text-main">
          축하합니다! <span className="font-bold">{session.scheduledMinutes}분</span>의 집중 세션을 완료했습니다.
        </p>
        <div className="my-4">
          <p className="text-5xl font-black text-primary">+{session.points} P</p>
          <p className="text-text-secondary">포인트 획득</p>
        </div>
        <div className="w-full flex flex-col gap-3">
            <button
                onClick={onStartNext}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus transition-transform transform hover:scale-105"
            >
                다음 세션 시작
            </button>
            <button
                onClick={onClose}
                className="w-full bg-transparent text-text-secondary font-semibold py-3 rounded-lg hover:bg-brand-bg transition-colors"
            >
                홈으로 돌아가기
            </button>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};
