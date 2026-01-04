export type HabitCategory = "mind" | "body" | "social" | "creativity" | "focus";

export type HabitStyle = "calm" | "playful" | "productive" | "reflective";

export type TimeOfDay = "morning" | "afternoon" | "evening";

export type Difficulty = "easy" | "medium" | "challenging";

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  duration: number; // in minutes
  difficulty: Difficulty;
  benefit: string;
  emoji: string;
  style: HabitStyle;
}

export interface UserHabit extends Habit {
  isActive: boolean;
  completedDates: string[];
  skippedCount: number;
  lastCompleted?: string;
}

export interface UserPreferences {
  goals: string[];
  habitStyle: HabitStyle;
  energyLevels: {
    morning: "low" | "medium" | "high";
    afternoon: "low" | "medium" | "high";
    evening: "low" | "medium" | "high";
  };
  preferredDuration: number; // 1-5 minutes
  frequency: "daily" | "weekly" | "flexible";
  dislikes: string[];
}

export interface OnboardingData {
  name: string;
  goals: string[];
  habitStyle: HabitStyle;
  energyLevels: {
    morning: "low" | "medium" | "high";
    afternoon: "low" | "medium" | "high";
    evening: "low" | "medium" | "high";
  };
  preferredDuration: number;
  frequency: "daily" | "weekly" | "flexible";
  dislikes: string[];
}
