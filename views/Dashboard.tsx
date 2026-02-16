
import React, { useEffect, useState } from 'react';
import { UserProfile, Goal, WorkoutSession, WeightLog, AppScreen } from '../types';
import { Play, History, Settings as SettingsIcon, Target, TrendingDown, Flame, Watch } from 'lucide-react';
import { getPaceString } from '../constants';
import { getAiCoachAdvice } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  userProfile: UserProfile;
  goal: Goal;
  sessions: WorkoutSession[];
  weightLogs: WeightLog[];
  onStartRun: () => void;
  onNavigate: (screen: AppScreen) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, goal, sessions, weightLogs, onStartRun, onNavigate }) => {
  const [advice, setAdvice] = useState("생각하지 말고 뛰어볼까요?");
  
  useEffect(() => {
    const fetchAdvice = async () => {
      const lastSession = sessions.length > 0 ? sessions[0] : undefined;
      const res = await getAiCoachAdvice(userProfile, lastSession);
      setAdvice(res);
    };
    fetchAdvice();
  }, [userProfile, sessions]);

  const weeklyRuns = sessions.filter(s => {
    const runDate = new Date(s.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - runDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 scrollbar-hide">
      {/* Header */}
      <div className="p-6 bg-white flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">RunStart</h1>
            {userProfile.hasWatch && (
                <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Watch size={14} className="text-blue-600" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Synced</span>
                </div>
            )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onNavigate(AppScreen.HISTORY)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <History size={24} />
          </button>
          <button onClick={() => onNavigate(AppScreen.SETTINGS)} className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <SettingsIcon size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Coaching Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl shadow-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-bold">AI</span>
            </div>
            <span className="text-sm font-semibold opacity-90">러닝 코치 어드바이스</span>
          </div>
          <p className="text-lg font-medium leading-snug">"{advice}"</p>
        </div>

        {/* Today's Goal */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Target size={20} className="text-blue-600" />
              오늘의 목표
            </h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">추천</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl">
              <span className="text-xs text-gray-500 font-semibold block mb-1">권장 거리</span>
              <span className="text-2xl font-bold text-gray-900">{goal.recommendedDistance.toFixed(1)}km</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl">
              <span className="text-xs text-gray-500 font-semibold block mb-1">권장 페이스</span>
              <span className="text-2xl font-bold text-gray-900">{getPaceString(goal.recommendedPace)}</span>
            </div>
          </div>
        </div>

        {/* Progress & Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Flame size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">주간 진행률</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{weeklyRuns} / {userProfile.weeklyFrequency}</div>
            <div className="w-full h-2 bg-gray-100 rounded-full">
              <div 
                className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((weeklyRuns / userProfile.weeklyFrequency) * 100, 100)}%` }} 
              />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-indigo-500 mb-2">
              <TrendingDown size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">예상 감량</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">-{goal.expectedLoss8Weeks.toFixed(1)}kg</div>
            <p className="text-[10px] text-gray-400 mt-1 font-medium">8주 지속 시 시뮬레이션</p>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-64">
           <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">체중 변화 추이</h3>
           <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLogs}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={() => '체중'}
                />
                <Line type="monotone" dataKey="weight" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6 }} />
              </LineChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <button 
          onClick={onStartRun}
          className="w-full bg-blue-600 text-white p-5 rounded-3xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-400 active:scale-95 transition-transform"
        >
          <Play fill="white" size={24} />
          러닝 시작하기
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
