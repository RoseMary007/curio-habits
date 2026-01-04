import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OnboardingData, UserHabit, HabitStyle } from "@/types/habit";
import { habitLibrary } from "@/data/habits";

interface AppState {
  // Onboarding
  isOnboarded: boolean;
  onboardingStep: number;
  onboardingData: Partial<OnboardingData>;
  
  // User data
  userName: string;
  userHabits: UserHabit[];
  
  // Actions
  setOnboardingStep: (step: number) => void;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;
  addHabit: (habit: UserHabit) => void;
  removeHabit: (habitId: string) => void;
  completeHabit: (habitId: string) => void;
  skipHabit: (habitId: string) => void;
  getRecommendedHabits: () => UserHabit[];
  getTodaysHabit: () => UserHabit | null;
  resetApp: () => void;
}

const generateInitialHabits = (data: Partial<OnboardingData>): UserHabit[] => {
  const style = data.habitStyle || "calm";
  const goals = data.goals || [];
  
  // Map goals to categories
  const goalToCategory: Record<string, string> = {
    "mental-health": "mind",
    "focus": "focus",
    "fitness": "body",
    "creativity": "creativity",
    "confidence": "social",
    "sleep": "mind",
    "relationships": "social",
  };
  
  const preferredCategories = goals.map(g => goalToCategory[g] || "mind");
  
  // Filter and score habits
  const scoredHabits = habitLibrary.map(habit => {
    let score = 0;
    if (habit.style === style) score += 3;
    if (preferredCategories.includes(habit.category)) score += 2;
    if (habit.duration <= (data.preferredDuration || 3)) score += 1;
    return { habit, score };
  });
  
  // Sort by score and take top 5
  scoredHabits.sort((a, b) => b.score - a.score);
  
  return scoredHabits.slice(0, 5).map(({ habit }) => ({
    ...habit,
    isActive: true,
    completedDates: [],
    skippedCount: 0,
  }));
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isOnboarded: false,
      onboardingStep: 0,
      onboardingData: {},
      userName: "",
      userHabits: [],
      
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      
      updateOnboardingData: (data) =>
        set((state) => ({
          onboardingData: { ...state.onboardingData, ...data },
        })),
      
      completeOnboarding: () => {
        const { onboardingData } = get();
        const initialHabits = generateInitialHabits(onboardingData);
        set({
          isOnboarded: true,
          userName: onboardingData.name || "Friend",
          userHabits: initialHabits,
        });
      },
      
      addHabit: (habit) =>
        set((state) => ({
          userHabits: [...state.userHabits, habit],
        })),
      
      removeHabit: (habitId) =>
        set((state) => ({
          userHabits: state.userHabits.filter((h) => h.id !== habitId),
        })),
      
      completeHabit: (habitId) => {
        const today = new Date().toISOString().split("T")[0];
        set((state) => ({
          userHabits: state.userHabits.map((h) =>
            h.id === habitId
              ? {
                  ...h,
                  completedDates: [...h.completedDates, today],
                  lastCompleted: today,
                }
              : h
          ),
        }));
      },
      
      skipHabit: (habitId) =>
        set((state) => ({
          userHabits: state.userHabits.map((h) =>
            h.id === habitId
              ? { ...h, skippedCount: h.skippedCount + 1 }
              : h
          ),
        })),
      
      getRecommendedHabits: () => {
        const { userHabits, onboardingData } = get();
        const activeHabitIds = userHabits.map((h) => h.id);
        const style = onboardingData.habitStyle || "calm";
        
        return habitLibrary
          .filter((h) => !activeHabitIds.includes(h.id))
          .filter((h) => h.style === style || Math.random() > 0.5)
          .slice(0, 6)
          .map((h) => ({
            ...h,
            isActive: false,
            completedDates: [],
            skippedCount: 0,
          }));
      },
      
      getTodaysHabit: () => {
        const { userHabits } = get();
        const today = new Date().toISOString().split("T")[0];
        const activeHabits = userHabits.filter((h) => h.isActive);
        
        // Find a habit not completed today
        const uncompletedToday = activeHabits.filter(
          (h) => !h.completedDates.includes(today)
        );
        
        if (uncompletedToday.length === 0) return activeHabits[0] || null;
        
        // Prioritize less skipped habits
        uncompletedToday.sort((a, b) => a.skippedCount - b.skippedCount);
        return uncompletedToday[0];
      },
      
      resetApp: () =>
        set({
          isOnboarded: false,
          onboardingStep: 0,
          onboardingData: {},
          userName: "",
          userHabits: [],
        }),
    }),
    {
      name: "habitual-curator-storage",
    }
  )
);
