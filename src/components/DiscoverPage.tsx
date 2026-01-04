import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { habitLibrary, categoryEmojis } from "@/data/habits";
import { HabitCategory, UserHabit } from "@/types/habit";
import { Plus, Clock, Sparkles, Shuffle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const categories: HabitCategory[] = ["mind", "body", "social", "creativity", "focus"];

interface DiscoverPageProps {
  onBack: () => void;
}

export function DiscoverPage({ onBack }: DiscoverPageProps) {
  const { userHabits, addHabit, onboardingData } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | "all">("all");
  const [showSurprise, setShowSurprise] = useState(false);

  const activeHabitIds = userHabits.map((h) => h.id);

  const filteredHabits = habitLibrary.filter((h) => {
    if (activeHabitIds.includes(h.id)) return false;
    if (selectedCategory === "all") return true;
    return h.category === selectedCategory;
  });

  const handleAddHabit = (habit: typeof habitLibrary[0]) => {
    const userHabit: UserHabit = {
      ...habit,
      isActive: true,
      completedDates: [],
      skippedCount: 0,
    };
    addHabit(userHabit);
    toast.success(`Added "${habit.title}" to your habits!`);
  };

  const handleSurprise = () => {
    const availableHabits = habitLibrary.filter(
      (h) => !activeHabitIds.includes(h.id)
    );
    if (availableHabits.length > 0) {
      const randomHabit =
        availableHabits[Math.floor(Math.random() * availableHabits.length)];
      setShowSurprise(true);
      setTimeout(() => {
        handleAddHabit(randomHabit);
        setShowSurprise(false);
      }, 1000);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-primary bg-primary-light";
      case "medium":
        return "text-accent bg-accent-light";
      case "challenging":
        return "text-foreground bg-muted";
      default:
        return "text-muted-foreground bg-muted";
    }
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
            Discover Habits
          </h1>
          <p className="text-muted-foreground text-sm">
            Find new micro-habits that match your style
          </p>
        </header>

        {/* Surprise Me Button */}
        <Button
          variant="coral"
          size="lg"
          className="w-full mb-6"
          onClick={handleSurprise}
          disabled={showSurprise}
        >
          {showSurprise ? (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              Finding something special...
            </>
          ) : (
            <>
              <Shuffle className="w-5 h-5" />
              Surprise Me
            </>
          )}
        </Button>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="whitespace-nowrap"
            >
              {categoryEmojis[cat]} {cat}
            </Button>
          ))}
        </div>

        {/* Habits Grid */}
        <div className="space-y-4">
          {filteredHabits.map((habit) => (
            <Card key={habit.id} variant="glass" className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{habit.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{habit.title}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(
                          habit.difficulty
                        )}`}
                      >
                        {habit.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {habit.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {habit.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        {categoryEmojis[habit.category]} {habit.category}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="sage"
                    size="icon-sm"
                    onClick={() => handleAddHabit(habit)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHabits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              You've added all habits in this category!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
