import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { categoryEmojis, styleDescriptions } from "@/data/habits";
import { ArrowLeft, RotateCcw, User, Bell, Sliders, Shield } from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { userName, userHabits, onboardingData, resetApp } = useAppStore();

  const handleReset = () => {
    if (window.confirm("This will reset all your data and start fresh. Continue?")) {
      resetApp();
      toast.success("App reset successfully!");
    }
  };

  // Calculate insights
  const categoryStats = userHabits.reduce((acc, habit) => {
    acc[habit.category] = (acc[habit.category] || 0) + habit.completedDates.length;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categoryStats).sort((a, b) => b[1] - a[1])[0];

  const totalCompletions = userHabits.reduce(
    (acc, h) => acc + h.completedDates.length,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-lg py-6 px-4">
        {/* Header */}
        <header className="mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-sage flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {userName}
              </h1>
              <p className="text-muted-foreground text-sm">
                {onboardingData.habitStyle && styleDescriptions[onboardingData.habitStyle]?.description}
              </p>
            </div>
          </div>
        </header>

        {/* Stats */}
        <Card className="p-4 mb-6">
          <h3 className="font-display font-semibold mb-4">Your Journey</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-display font-bold text-primary">
                {totalCompletions}
              </div>
              <div className="text-xs text-muted-foreground">Total Done</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-accent">
                {userHabits.length}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div>
              <div className="text-3xl font-display font-bold text-foreground">
                {Math.round(totalCompletions / Math.max(userHabits.length, 1))}
              </div>
              <div className="text-xs text-muted-foreground">Avg/Habit</div>
            </div>
          </div>
        </Card>

        {/* Insights */}
        {topCategory && (
          <Card variant="gradient" className="p-4 mb-6">
            <h3 className="font-display font-semibold mb-3">💡 Insights</h3>
            <p className="text-sm text-muted-foreground">
              You're excelling at{" "}
              <span className="font-medium text-foreground">
                {categoryEmojis[topCategory[0]]} {topCategory[0]}
              </span>{" "}
              habits with {topCategory[1]} completions. Keep it up!
            </p>
          </Card>
        )}

        {/* Preferences */}
        <Card className="p-4 mb-6">
          <h3 className="font-display font-semibold mb-4">Your Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Style</span>
              <span className="text-sm font-medium capitalize flex items-center gap-2">
                {onboardingData.habitStyle && styleDescriptions[onboardingData.habitStyle]?.emoji}
                {onboardingData.habitStyle}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Max Duration</span>
              <span className="text-sm font-medium">
                {onboardingData.preferredDuration || 3} minutes
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Goals</span>
              <span className="text-sm font-medium">
                {onboardingData.goals?.length || 0} selected
              </span>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <Bell className="w-4 h-4 mr-3" />
            Notifications
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Sliders className="w-4 h-4 mr-3" />
            Habit Intensity
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Shield className="w-4 h-4 mr-3" />
            Privacy
            <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>
          </Button>
        </div>

        {/* Reset */}
        <div className="mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset All Data
          </Button>
        </div>
      </div>
    </div>
  );
}
