
import React, { useState, useEffect, useRef } from 'react';
import { Goal, UserProfile, WorkoutSession, LatLng } from '../types';
import { getPaceString, calculateCalories } from '../constants';
import { Pause, Play, Square, Timer, MapPin, Activity, Watch, Heart } from 'lucide-react';

interface RunningSessionProps {
  goal: Goal;
  userProfile: UserProfile;
  onFinish: (session: WorkoutSession) => void;
  onCancel: () => void;
}

const RunningSession: React.FC<RunningSessionProps> = ({ goal, userProfile, onFinish, onCancel }) => {
  const [elapsedTime, setElapsedTime] = useState(0); 
  const [distance, setDistance] = useState(0); 
  const [pace, setPace] = useState(0); 
  const [isActive, setIsActive] = useState(true);
  const [heartRate, setHeartRate] = useState(120);
  const [feedback, setFeedback] = useState("좋은 페이스입니다 👍");
  const [path, setPath] = useState<LatLng[]>([]);
  
  const timerRef = useRef<number | null>(null);
  
  // Starting coordinate (Central Park as example)
  const lastPos = useRef<LatLng>({ lat: 37.5665, lng: 126.9780 });

  const triggerHaptic = (type: 'success' | 'warning' | 'error') => {
    if ('vibrate' in navigator) {
      if (type === 'warning') navigator.vibrate([100, 50, 100]);
      if (type === 'error') navigator.vibrate([500]);
      if (type === 'success') navigator.vibrate(50);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
        
        const randomVariation = (Math.random() - 0.5) * 0.2;
        const currentSpeedKmh = (60 / goal.recommendedPace) + randomVariation;
        const distIncrement = (currentSpeedKmh / 3600);
        
        setDistance(prev => prev + distIncrement);
        
        // Simulating coordinate movement
        const moveLat = (Math.random() - 0.45) * 0.0001;
        const moveLng = (Math.random() - 0.45) * 0.0001;
        const newPos = { lat: lastPos.current.lat + moveLat, lng: lastPos.current.lng + moveLng };
        lastPos.current = newPos;
        
        if (elapsedTime % 3 === 0) {
            setPath(prev => [...prev, newPos]);
        }

        setHeartRate(prev => {
            const drift = Math.random() > 0.5 ? 2 : -1;
            return Math.min(Math.max(prev + drift, 110), 170);
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, goal.recommendedPace, elapsedTime]);

  useEffect(() => {
    if (elapsedTime > 0 && elapsedTime % 5 === 0) {
      const currentPace = (elapsedTime / 60) / distance;
      setPace(currentPace);

      if (currentPace < goal.recommendedPace - 0.5) {
        setFeedback("페이스가 너무 빠릅니다. 조금만 천천히!");
        triggerHaptic('warning');
      } else if (currentPace > goal.recommendedPace + 0.5) {
        setFeedback("페이스가 느립니다. 조금만 속도를 높여보세요!");
        triggerHaptic('warning');
      } else {
        setFeedback("목표 페이스 유지 중입니다 👍");
      }
    }
  }, [elapsedTime, distance, goal.recommendedPace]);

  const handleFinish = () => {
    const avgPace = (elapsedTime / 60) / distance;
    const calories = calculateCalories(userProfile.weight, distance);
    const weightLossContribution = calories / 7700;

    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      distance: Number(distance.toFixed(2)),
      time: elapsedTime,
      avgPace: avgPace,
      calories: Math.round(calories),
      avgHeartRate: heartRate,
      isGoalAchieved: distance >= goal.recommendedDistance,
      weightLossContribution,
      path: path
    };
    onFinish(session);
  };

  const progress = Math.min((distance / goal.recommendedDistance) * 100, 100);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-8 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 text-blue-400">
          <Activity size={20} className="animate-pulse" />
          <span className="font-bold tracking-widest text-sm">LIVE SESSION</span>
        </div>
        {userProfile.hasWatch && (
            <div className="flex items-center gap-1.5 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                <Watch size={14} className="text-blue-400" />
                <span className="text-[10px] font-bold text-blue-400 uppercase">Watch</span>
            </div>
        )}
        <button onClick={onCancel} className="text-gray-400 hover:text-white font-medium">중단</button>
      </div>

      <div className="mb-8 flex justify-center">
        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4">
            <Heart size={24} className="text-rose-500 fill-rose-500 animate-pulse" />
            <div>
                <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Heart Rate</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black tabular-nums">{heartRate}</span>
                    <span className="text-[10px] font-bold text-gray-500">BPM</span>
                </div>
            </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-10">
        <div className="text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Current Pace</span>
            <div className="text-7xl font-black tabular-nums">{distance > 0 ? getPaceString(pace) : "--:--"}</div>
            <span className="text-sm text-blue-400 font-bold uppercase">min / km</span>
        </div>

        <div className="grid grid-cols-2 w-full gap-8">
            <div className="text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Distance</span>
                <div className="text-4xl font-bold tabular-nums">{distance.toFixed(2)} km</div>
            </div>
            <div className="text-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Time</span>
                <div className="text-4xl font-bold tabular-nums">
                    {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </div>
            </div>
        </div>
      </div>

      <div className="mb-10 bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-center">
        <p className="text-blue-200 text-sm font-medium">"{feedback}"</p>
      </div>

      <div className="flex gap-6 justify-center pb-4">
        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${isActive ? 'bg-white/10 text-white' : 'bg-blue-600 text-white'}`}
        >
          {isActive ? <Pause size={28} /> : <Play fill="white" size={28} />}
        </button>
        <button 
          onClick={handleFinish}
          className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <Square fill="white" size={24} />
        </button>
      </div>
    </div>
  );
};

export default RunningSession;
