
import React, { useState } from 'react';
import { UserProfile, ExperienceLevel, Gender } from '../types';
import { ChevronRight, ChevronLeft, Watch } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.OTHER,
    experience: ExperienceLevel.NONE,
    weeklyFrequency: 3,
    dailyAvailableTime: 30,
    hasWatch: false,
  });

  const updateForm = (updates: Partial<UserProfile>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const steps = [
    {
      title: "환영합니다!",
      subtitle: "당신만을 위한 맞춤형 러닝 플랜을 위해 몇 가지 정보를 알려주세요.",
      content: (
        <div className="space-y-6">
          <img src="https://picsum.photos/seed/run/600/400" className="rounded-2xl shadow-lg w-full h-48 object-cover" alt="Welcome" />
          <p className="text-gray-600 leading-relaxed text-center">
            RunStart는 러닝 초보자가 다이어트에 성공할 수 있도록 과학적인 페이스를 제안합니다.
          </p>
        </div>
      )
    },
    {
        title: "스마트 기기 연동",
        subtitle: "애플워치를 사용 중이신가요?",
        content: (
          <div className="space-y-4">
            <button
              onClick={() => updateForm({ hasWatch: true })}
              className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${formData.hasWatch ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
            >
              <div className={`p-3 rounded-xl ${formData.hasWatch ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Watch size={32} />
              </div>
              <div className="text-left">
                <span className="font-bold text-lg block text-gray-900">네, 사용 중입니다</span>
                <span className="text-sm text-gray-500">심박수와 활동량이 실시간 연동됩니다.</span>
              </div>
            </button>
            <button
              onClick={() => updateForm({ hasWatch: false })}
              className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all ${!formData.hasWatch ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
            >
              <div className={`p-3 rounded-xl ${!formData.hasWatch ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                <Watch size={32} />
              </div>
              <div className="text-left">
                <span className="font-bold text-lg block text-gray-900">아니요, 없습니다</span>
                <span className="text-sm text-gray-500">휴대폰 센서만으로 러닝을 측정합니다.</span>
              </div>
            </button>
          </div>
        )
    },
    {
      title: "기본 신체 정보",
      subtitle: "정확한 칼로리 계산을 위해 필요합니다.",
      content: (
        <div className="space-y-4">
          <div className="flex gap-2">
            {[Gender.MALE, Gender.FEMALE].map(g => (
              <button
                key={g}
                onClick={() => updateForm({ gender: g })}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${formData.gender === g ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 text-gray-600'}`}
              >
                {g}
              </button>
            ))}
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-1 block">현재 체중 (kg)</label>
            <input 
              type="number" 
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none"
              placeholder="00 kg"
              onChange={e => updateForm({ weight: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-1 block">목표 체중 (kg)</label>
            <input 
              type="number" 
              className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none"
              placeholder="00 kg"
              onChange={e => updateForm({ goalWeight: Number(e.target.value) })}
            />
          </div>
        </div>
      )
    },
    {
      title: "러닝 경험",
      subtitle: "가장 적절한 페이스를 추천해 드립니다.",
      content: (
        <div className="space-y-3">
          {Object.values(ExperienceLevel).map(level => (
            <button
              key={level}
              onClick={() => updateForm({ experience: level })}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${formData.experience === level ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-100 text-gray-700 bg-white'}`}
            >
              <span className="font-bold block">{level}</span>
              <span className="text-sm opacity-80">
                {level === ExperienceLevel.NONE ? "러닝 경험이 거의 없어요" : level === ExperienceLevel.WALK ? "산책이나 가벼운 걷기를 즐겨요" : "주 1-2회 정도 러닝을 했었어요"}
              </span>
            </button>
          ))}
        </div>
      )
    },
    {
      title: "운동 계획",
      subtitle: "지속 가능한 일정을 설정해 보세요.",
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-gray-500 mb-2 block">주간 운동 횟수 (회)</label>
            <div className="flex justify-between gap-2">
              {[2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => updateForm({ weeklyFrequency: n })}
                  className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-bold ${formData.weeklyFrequency === n ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-100 bg-white text-gray-600'}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-800 text-sm font-medium">💡 팁: 초보자에게는 주 3회가 가장 좋습니다.</p>
          </div>
        </div>
      )
    }
  ];

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData as UserProfile);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStepData = steps[step];

  return (
    <div className="flex flex-col h-full p-8 pt-12 animate-in slide-in-from-right duration-300">
      <div className="mb-8">
        <div className="flex gap-1 mb-6">
          {steps.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h1>
        <p className="text-gray-500 font-medium">{currentStepData.subtitle}</p>
      </div>

      <div className="flex-1">
        {currentStepData.content}
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={back} className="p-4 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center">
            <ChevronLeft size={24} />
          </button>
        )}
        <button 
          onClick={next} 
          className="flex-1 p-4 rounded-2xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:scale-95 transition-transform"
        >
          {step === steps.length - 1 ? "시작하기" : "다음"}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
