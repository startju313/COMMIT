
import React from 'react';

interface ConfirmAbortModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmAbortModal: React.FC<ConfirmAbortModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center gap-4 animate-fade-in">
        <h2 className="text-2xl font-bold text-text-main">세션을 종료할까요?</h2>
        <p className="text-danger font-semibold">
          지금 종료하면 포인트가 적립되지 않습니다.
        </p>
        <div className="w-full flex gap-4 mt-4">
            <button
                onClick={onCancel}
                className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500 transition-colors"
            >
                취소
            </button>
            <button
                onClick={onConfirm}
                className="flex-1 bg-danger text-white font-bold py-3 rounded-lg hover:bg-red-500 transition-colors"
            >
                종료하기
            </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
    `}</style>
    </div>
  );
};
