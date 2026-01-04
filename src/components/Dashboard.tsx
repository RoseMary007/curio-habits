import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, RefreshCw, Clock, Sparkles, MoreHorizontal } from "lucide-react";
import { categoryEmojis } from "@/data/habits";
import { toast } from "sonner";

export function Dashboard() {
  const { userName, getTodaysHabit, completeHabit, skipHabit, userHabits, getRecommendedHabits } =
    useAppStore();
  const [isSwapping, setIsSwapping] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const todaysHabit = getTodaysHabit();
  const completedToday = userHabits.filter((h) =>
    h.completedDates.includes(new Date().toISOString().split("T")[0])
  ).length;

  const handleComplete = () => {
    if (todaysHabit) {
      completeHabit(todaysHabit.id);
      setShowCelebration(true);
      toast.success("Well done! Keep that momentum going.", {
        duration: 3000,
      });
      setTimeout(() => setShowCelebration(false), 2000);
    }
  };

  const handleSkip = () => {
    if (todaysHabit) {
      skipHabit(todaysHabit.id);
      toast("No worries! We'll try a different one.", {
        duration: 2000,
      });
    }
  };

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => setIsSwapping(false), 500);
    toast("Here's a fresh habit for you!", {
      duration: 2000,
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivation = () => {
    const phrases = [
      "Small steps, big impact.",
      "Every micro-habit counts.",
      "You're building something beautiful.",
      "Progress, not perfection.",
      "One habit at a time.",
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-8 px-4">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground text-sm">{getGreeting()}</p>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {userName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {completedToday} done
              </div>
            </div>
          </div>
          <p className="text-muted-foreground italic">{getMotivation()}</p>
        </header>

        {/* Today's Habit Card */}
        {todaysHabit ? (
          <Card
            variant="glass"
            className={`mb-6 overflow-hidden transition-all duration-500 ${
              showCelebration ? "ring-2 ring-accent shadow-coral-glow" : ""
            } ${isSwapping ? "animate-scale-in" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{todaysHabit.emoji}</span>
                <span className="px-2.5 py-1 rounded-full bg-secondary text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {todaysHabit.duration} min
                </span>
              </div>

              <h2 className="text-xl font-display font-semibold mb-2">
                {todaysHabit.title}
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                {todaysHabit.description}
              </p>

              <div className="p-3 rounded-xl bg-primary-light/50 border border-primary/10 mb-6">
                <p className="text-sm text-primary">
                  <span className="font-medium">Why this works:</span>{" "}
                  {todaysHabit.benefit}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  variant="coral"
                  className="flex-1"
                  onClick={handleComplete}
                >
                  <Check className="w-5 h-5" />
                  Done
                </Button>
                <Button size="lg" variant="outline" onClick={handleSwap}>
                  <RefreshCw className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="ghost" onClick={handleSkip}>
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="gradient" className="mb-6 text-center py-12">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-display font-semibold mb-2">
              All done for today!
            </h2>
            <p className="text-muted-foreground text-sm">
              You've completed all your habits. See you tomorrow!
            </p>
          </Card>
        )}

        {/* Active Habits Overview */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Your Habits</h3>
            <span className="text-sm text-muted-foreground">
              {userHabits.length} active
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {userHabits.slice(0, 4).map((habit) => {
              const isCompletedToday = habit.completedDates.includes(
                new Date().toISOString().split("T")[0]
              );
              return (
                <Card
                  key={habit.id}
                  className={`p-4 transition-all ${
                    isCompletedToday ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xl">{habit.emoji}</span>
                    {isCompletedToday && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-medium line-clamp-1">
                    {habit.title}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    {categoryEmojis[habit.category]} {habit.category}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <Card variant="outlined" className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-display font-bold text-primary">
                {userHabits.reduce((acc, h) => acc + h.completedDates.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Done</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-accent">
                {userHabits.length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-2xl font-display font-bold text-foreground">
                {Math.round(
                  (completedToday / Math.max(userHabits.length, 1)) * 100
                )}
                %
              </div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
