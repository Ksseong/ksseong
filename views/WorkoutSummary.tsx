
import React, { useRef, useEffect } from 'react';
import { WorkoutSession, LatLng } from '../types';
import { getPaceString } from '../constants';
import { Trophy, Flame, ArrowRight, Download, Share2, Map as MapIcon, Calendar, Clock, Zap } from 'lucide-react';

interface WorkoutSummaryProps {
  session: WorkoutSession;
  onGoHome: () => void;
}

const WorkoutSummary: React.FC<WorkoutSummaryProps> = ({ session, onGoHome }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to calculate bounds and scaling for path
  const getPathBounds = (path: LatLng[], width: number, height: number, padding: number) => {
    if (!path || path.length < 2) return null;
    
    const lats = path.map(p => p.lat);
    const lngs = path.map(p => p.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const latDiff = maxLat - minLat || 0.0001;
    const lngDiff = maxLng - minLng || 0.0001;
    
    const xScale = (width - padding * 2) / lngDiff;
    const yScale = (height - padding * 2) / latDiff;
    const scale = Math.min(xScale, yScale);

    const offsetX = (width - lngDiff * scale) / 2;
    const offsetY = (height - latDiff * scale) / 2;

    const points = path.map(p => ({
      x: offsetX + (p.lng - minLng) * scale,
      y: height - (offsetY + (p.lat - minLat) * scale)
    }));

    return points;
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 1080;
    canvas.height = 1080;

    // 1. Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Draw Large Path in Background/Center
    const points = getPathBounds(session.path, 1080, 1080, 150);
    if (points) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)'; // Faded path for background feel
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();

        // Main highlight path
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 10;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#38bdf8';
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Start/End Points
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(points[0].x, points[0].y, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(points[points.length-1].x, points[points.length-1].y, 12, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Dark Overlay for Text Legibility (Bottom)
    const gradient = ctx.createLinearGradient(0, 600, 0, 1080);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0)');
    gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.8)');
    gradient.addColorStop(1, 'rgba(15, 23, 42, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 500, 1080, 580);

    // 4. Content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('RUNSTART', 80, 80);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 30px sans-serif';
    ctx.fillText(new Date(session.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }), 80, 130);

    // Stats Section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'black 180px sans-serif';
    ctx.fillText(session.distance.toString(), 80, 880);
    
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 50px sans-serif';
    ctx.fillText('KILOMETERS', 80, 940);

    // Small Stats
    const drawIconStat = (label: string, value: string, x: number) => {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 24px sans-serif';
        ctx.fillText(label, x, 990);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 45px sans-serif';
        ctx.fillText(value, x, 1040);
    };

    drawIconStat('TIME', `${Math.floor(session.time / 60)}:${(session.time % 60).toString().padStart(2, '0')}`, 450);
    drawIconStat('PACE', `${getPaceString(session.avgPace)}`, 680);
    drawIconStat('CAL', `${session.calories}`, 900);

    // Final Save
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `runstart_summary_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const renderLargeMap = () => {
    const points = getPathBounds(session.path, 400, 300, 40);
    if (!points) return (
        <div className="h-[300px] bg-slate-900 rounded-b-[3rem] flex items-center justify-center text-slate-500 italic">
            경로 데이터를 불러올 수 없습니다.
        </div>
    );

    const d = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');

    return (
      <div className="relative w-full h-[350px] bg-slate-950 rounded-b-[3rem] overflow-hidden shadow-2xl">
        <svg viewBox="0 0 400 300" className="w-full h-full p-4">
            <defs>
                <filter id="glow-large" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            {/* Background grid simulation */}
            <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 150 L 400 150 M 0 200 L 400 200 M 0 250 L 400 250" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            <path d="M 50 0 L 50 300 M 100 0 L 100 300 M 150 0 L 150 300 M 200 0 L 200 300 M 250 0 L 250 300 M 300 0 L 300 300 M 350 0 L 350 300" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            
            {/* The Path */}
            <path 
                d={d} 
                fill="none" 
                stroke="#38bdf8" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                filter="url(#glow-large)"
            />
            
            {/* Start/End Markers */}
            <circle cx={points[0].x} cy={points[0].y} r="6" fill="#10b981" stroke="white" strokeWidth="2" />
            <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="8" fill="#f43f5e" stroke="white" strokeWidth="2" />
        </svg>
        
        {/* Overlay Label */}
        <div className="absolute bottom-6 left-8 flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <MapIcon size={16} className="text-blue-400" />
            <span className="text-xs font-black text-white uppercase tracking-widest">Route View</span>
        </div>

        {/* Floating Stats */}
        <div className="absolute top-6 right-8 text-right">
            <span className="text-4xl font-black text-white block leading-none">{session.distance}</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter">Kilometers</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-y-auto scrollbar-hide">
      {/* 1. Large Map Header */}
      {renderLargeMap()}

      {/* 2. Main Stats Body */}
      <div className="px-8 -mt-10 relative z-10">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">GREAT RUN!</h1>
                    <p className="text-slate-400 font-medium text-sm">
                        {new Date(session.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                    </p>
                </div>
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <Trophy className="text-white" size={28} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <Clock size={18} className="text-slate-400 mx-auto mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Time</span>
                    <span className="text-lg font-black text-slate-900">{Math.floor(session.time / 60)}:{(session.time % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <Zap size={18} className="text-blue-500 mx-auto mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pace</span>
                    <span className="text-lg font-black text-slate-900">{getPaceString(session.avgPace)}</span>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-2xl">
                    <Flame size={18} className="text-orange-500 mx-auto mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cal</span>
                    <span className="text-lg font-black text-slate-900">{session.calories}</span>
                </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl text-white">
                <div className="flex items-center gap-2 mb-2">
                    <Flame size={20} className="text-orange-400" />
                    <span className="font-bold text-sm text-slate-300">Weight Loss Goal</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-orange-400">-{session.weightLossContribution.toFixed(3)}kg</span>
                    <span className="text-xs opacity-60">achieved today</span>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="px-8 py-10 space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={handleSaveImage}
                className="bg-slate-100 text-slate-900 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <Download size={20} />
                이미지 저장
            </button>
            <button 
                className="bg-slate-100 text-slate-900 p-5 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
                <Share2 size={20} />
                SNS 공유
            </button>
        </div>

        <button 
            onClick={onGoHome}
            className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 transition-transform"
        >
            홈으로 돌아가기
            <ArrowRight size={24} />
        </button>
      </div>

      {/* Hidden Canvas for generating high-res share image */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default WorkoutSummary;
