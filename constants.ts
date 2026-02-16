
import { ExperienceLevel } from './types';

export const PACE_MAP = {
  [ExperienceLevel.NONE]: 7.5, // 7:30 min/km
  [ExperienceLevel.WALK]: 7.0, // 7:00 min/km
  [ExperienceLevel.RUN]: 6.5,  // 6:30 min/km
};

export const CALORIE_FACTOR = 1.036;
export const KG_CALORIE_DEFICIT = 7700;

export const calculateCalories = (weight: number, distance: number): number => {
  return weight * distance * CALORIE_FACTOR;
};

export const calculateExpectedLoss = (weeklyCalories: number, weeks: number): number => {
  return (weeklyCalories * weeks) / KG_CALORIE_DEFICIT;
};

export const getPaceString = (paceDecimal: number): string => {
  const minutes = Math.floor(paceDecimal);
  const seconds = Math.round((paceDecimal - minutes) * 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
