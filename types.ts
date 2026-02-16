
export enum ExperienceLevel {
  NONE = '없음',
  WALK = '가끔 걷기',
  RUN = '가끔 러닝'
}

export enum Gender {
  MALE = '남성',
  FEMALE = '여성',
  OTHER = '기타'
}

export interface UserProfile {
  weight: number;
  goalWeight: number;
  height: number;
  age: number;
  gender: Gender;
  experience: ExperienceLevel;
  weeklyFrequency: number;
  dailyAvailableTime: number; // in minutes
  hasWatch: boolean;
}

export interface Goal {
  recommendedPace: number; // minutes per km
  recommendedDistance: number; // km
  recommendedTime: number; // minutes
  weeklyPlan: string[]; // ['Mon', 'Wed', 'Fri']
  expectedLoss8Weeks: number; // kg
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface WorkoutSession {
  id: string;
  date: string;
  distance: number; // km
  time: number; // seconds
  avgPace: number; // min/km
  calories: number;
  avgHeartRate: number;
  isGoalAchieved: boolean;
  weightLossContribution: number; // kg
  path: LatLng[]; // GPS 경로 데이터
}

export interface WeightLog {
  date: string;
  weight: number;
}

export interface Badge {
  id: string;
  type: 'WEEKLY_STREAK' | 'TOTAL_RUNS' | 'FIRST_5K';
  name: string;
  dateEarned: string;
}

export enum AppScreen {
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  RUNNING = 'RUNNING',
  SUMMARY = 'SUMMARY',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}
