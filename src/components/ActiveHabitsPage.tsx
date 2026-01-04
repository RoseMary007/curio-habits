import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryEmojis } from "@/data/habits";
import { ArrowLeft, Check, Pause, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface ActiveHabitsPageProps {
  onBack: () => void;
}

export function ActiveHabitsPage({ onBack }: ActiveHabitsPageProps) {
  const { userHabits, removeHabit, completeHabit } = useAppStore();

  const today = new Date().toISOString().split("T")[0];

  const handleRemove = (habitId: string, habitTitle: string) => {
    removeHabit(habitId);
    toast.success(`Removed "${habitTitle}" from your habits`);
  };

  const handleComplete = (habitId: string) => {
    completeHabit(habitId);
    toast.success("Great job!");
  };

  const getCompletionDots = (completedDates: string[]) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last7Days.map((date) => completedDates.includes(date));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-6 px-4">
        {/* Header */}
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Your Habits
          </h1>
          <p className="text-muted-foreground text-sm">
            {userHabits.length} active micro-habits
          </p>
        </header>

        {/* Habits List */}
        <div className="space-y-4">
          {userHabits.map((habit) => {
            const completedToday = habit.completedDates.includes(today);
            const dots = getCompletionDots(habit.completedDates);

            return (
              <Card
                key={habit.id}
                variant="glass"
                className={`p-4 ${completedToday ? "border-primary/30" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{habit.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{habit.title}</h3>
                      {completedToday && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Done
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {habit.description}
                    </p>

                    {/* Completion dots */}
                    <div className="flex items-center gap-1.5 mb-3">
                      {dots.map((completed, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all ${
                            completed
                              ? "bg-primary"
                              : "bg-border"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-2">
                        Last 7 days
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {habit.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        {categoryEmojis[habit.category]} {habit.category}
                      </span>
                      <span>
                        {habit.completedDates.length} completions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  {!completedToday && (
                    <Button
                      variant="sage"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleComplete(habit.id)}
                    >
                      <Check className="w-4 h-4" />
                      Complete
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(habit.id, habit.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {userHabits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No active habits yet. Start by discovering some!
            </p>
            <Button variant="coral" onClick={onBack}>
              Discover Habits
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
