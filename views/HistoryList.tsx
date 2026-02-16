
import React from 'react';
import { WorkoutSession } from '../types';
import { getPaceString } from '../constants';
import { ChevronLeft, Calendar } from 'lucide-react';

interface HistoryListProps {
  sessions: WorkoutSession[];
  onBack: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ sessions, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white flex items-center gap-4 sticky top-0 border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">활동 기록</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 py-20">
            <Calendar size={64} className="mb-4 opacity-20" />
            <p className="font-medium">아직 기록된 활동이 없습니다.</p>
          </div>
        ) : (
          sessions.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-gray-400 block mb-1">
                  {new Date(s.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                </span>
                <span className="text-xl font-bold text-slate-800">{s.distance} km</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-600 block">{getPaceString(s.avgPace)} /km</span>
                <span className="text-xs font-medium text-orange-500">{s.calories} kcal</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryList;
