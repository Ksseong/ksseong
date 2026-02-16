
import React, { useState, useEffect } from 'react';
import { AppScreen, UserProfile, Goal, WorkoutSession, WeightLog } from './types';
import Onboarding from './views/Onboarding';
import Dashboard from './views/Dashboard';
import RunningSessionView from './views/RunningSession';
import WorkoutSummary from './views/WorkoutSummary';
import HistoryList from './views/HistoryList';
import Settings from './views/Settings';
import { PACE_MAP, calculateCalories, calculateExpectedLoss } from './constants';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);

  // Load data from local storage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedGoal = localStorage.getItem('goal');
    const savedSessions = localStorage.getItem('sessions');
    const savedWeightLogs = localStorage.getItem('weightLogs');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setScreen(AppScreen.DASHBOARD);
    }
    if (savedGoal) setGoal(JSON.parse(savedGoal));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedWeightLogs) setWeightLogs(JSON.parse(savedWeightLogs));
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    
    // Auto Goal Generation Logic from PRD
    const recommendedPace = PACE_MAP[profile.experience];
    const recommendedTime = 25; // PRD: 20-30 mins
    const recommendedDistance = (recommendedTime / recommendedPace);
    
    const weeklyCals = calculateCalories(profile.weight, recommendedDistance) * profile.weeklyFrequency;
    const expectedLoss = calculateExpectedLoss(weeklyCals, 8);

    const generatedGoal: Goal = {
      recommendedPace,
      recommendedDistance,
      recommendedTime,
      weeklyPlan: ['월', '수', '금'].slice(0, profile.weeklyFrequency),
      expectedLoss8Weeks: expectedLoss
    };

    setGoal(generatedGoal);
    setWeightLogs([{ date: new Date().toISOString(), weight: profile.weight }]);
    
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('goal', JSON.stringify(generatedGoal));
    localStorage.setItem('weightLogs', JSON.stringify([{ date: new Date().toISOString(), weight: profile.weight }]));
    
    setScreen(AppScreen.DASHBOARD);
  };

  const startRun = () => setScreen(AppScreen.RUNNING);

  const finishRun = (session: WorkoutSession) => {
    const updatedSessions = [session, ...sessions];
    setSessions(updatedSessions);
    setCurrentSession(session);
    localStorage.setItem('sessions', JSON.stringify(updatedSessions));
    setScreen(AppScreen.SUMMARY);
  };

  const renderScreen = () => {
    switch (screen) {
      case AppScreen.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppScreen.DASHBOARD:
        return (
          <Dashboard 
            userProfile={userProfile!} 
            goal={goal!} 
            sessions={sessions}
            weightLogs={weightLogs}
            onStartRun={startRun}
            onNavigate={(s) => setScreen(s)}
          />
        );
      case AppScreen.RUNNING:
        return <RunningSessionView goal={goal!} userProfile={userProfile!} onFinish={finishRun} onCancel={() => setScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.SUMMARY:
        return <WorkoutSummary session={currentSession!} onGoHome={() => setScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.HISTORY:
        return <HistoryList sessions={sessions} onBack={() => setScreen(AppScreen.DASHBOARD)} />;
      case AppScreen.SETTINGS:
        return <Settings onBack={() => setScreen(AppScreen.DASHBOARD)} onReset={() => {
            localStorage.clear();
            window.location.reload();
        }} />;
      default:
        return <Dashboard userProfile={userProfile!} goal={goal!} sessions={sessions} weightLogs={weightLogs} onStartRun={startRun} onNavigate={(s) => setScreen(s)} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative shadow-xl overflow-hidden flex flex-col">
      {renderScreen()}
    </div>
  );
};

export default App;
