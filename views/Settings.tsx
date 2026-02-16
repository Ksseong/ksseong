
import React from 'react';
import { ChevronLeft, LogOut, Bell, Mic, Shield } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onReset: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onReset }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-6 bg-white flex items-center gap-4 sticky top-0 border-b border-slate-100">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">설정</h1>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">앱 설정</h2>
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-100">
                <div className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Bell size={20} className="text-blue-500" />
                        <span className="font-semibold text-gray-700">러닝 알림 설정</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
                <div className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Mic size={20} className="text-indigo-500" />
                        <span className="font-semibold text-gray-700">음성 가이드</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
                <div className="flex items-center gap-3 p-5 hover:bg-slate-50 transition-colors cursor-pointer">
                    <Shield size={20} className="text-emerald-500" />
                    <span className="font-semibold text-gray-700">개인정보 처리 방침</span>
                </div>
            </div>
        </div>

        <div className="space-y-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">데이터 관리</h2>
            <button 
                onClick={() => {
                    if (confirm('정말로 모든 데이터를 삭제하시겠습니까?')) {
                        onReset();
                    }
                }}
                className="w-full bg-white rounded-3xl p-5 border border-red-100 flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-50 transition-colors"
            >
                <LogOut size={20} />
                프로필 초기화 및 로그아웃
            </button>
        </div>
      </div>

      <div className="p-10 text-center text-gray-400 text-xs font-medium">
        RunStart v2.0.0<br/>Powered by AI Coaching Engine
      </div>
    </div>
  );
};

export default Settings;
