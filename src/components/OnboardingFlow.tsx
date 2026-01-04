import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { goalOptions, styleDescriptions } from "@/data/habits";
import { HabitStyle } from "@/types/habit";
import { ArrowRight, ArrowLeft, Sparkles, Leaf, Palette, Zap, Brain } from "lucide-react";

const steps = [
  "welcome",
  "name",
  "goals",
  "style",
  "energy",
  "duration",
  "complete",
];

export function OnboardingFlow() {
  const {
    onboardingStep,
    onboardingData,
    setOnboardingStep,
    updateOnboardingData,
    completeOnboarding,
  } = useAppStore();

  const [localName, setLocalName] = useState(onboardingData.name || "");
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    onboardingData.goals || []
  );
  const [selectedStyle, setSelectedStyle] = useState<HabitStyle | null>(
    onboardingData.habitStyle || null
  );
  const [preferredDuration, setPreferredDuration] = useState(
    onboardingData.preferredDuration || 3
  );

  const currentStep = steps[onboardingStep];

  const nextStep = () => {
    if (currentStep === "name" && localName) {
      updateOnboardingData({ name: localName });
    }
    if (currentStep === "goals") {
      updateOnboardingData({ goals: selectedGoals });
    }
    if (currentStep === "style" && selectedStyle) {
      updateOnboardingData({ habitStyle: selectedStyle });
    }
    if (currentStep === "duration") {
      updateOnboardingData({ preferredDuration });
    }
    if (onboardingStep < steps.length - 1) {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const prevStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const styleIcons: Record<HabitStyle, React.ReactNode> = {
    calm: <Leaf className="w-6 h-6" />,
    playful: <Palette className="w-6 h-6" />,
    productive: <Zap className="w-6 h-6" />,
    reflective: <Brain className="w-6 h-6" />,
  };

  const canProceed = () => {
    switch (currentStep) {
      case "name":
        return localName.trim().length > 0;
      case "goals":
        return selectedGoals.length > 0;
      case "style":
        return selectedStyle !== null;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.slice(0, -1).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === onboardingStep
                  ? "w-8 bg-primary"
                  : i < onboardingStep
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

        {/* Welcome Step */}
        {currentStep === "welcome" && (
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-sage flex items-center justify-center shadow-glow">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-4">
              Habitual Curator
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-sm mx-auto">
              Discover tiny habits that actually stick. No pressure, just
              curiosity.
            </p>
            <Button size="xl" variant="coral" onClick={nextStep}>
              Let's Begin <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Name Step */}
        {currentStep === "name" && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-display font-semibold text-center mb-2">
              What should we call you?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              We'll use this to personalize your experience
            </p>
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              placeholder="Your name"
              className="w-full h-14 px-6 rounded-2xl bg-card border border-border text-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              autoFocus
            />
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" size="lg" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Goals Step */}
        {currentStep === "goals" && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-display font-semibold text-center mb-2">
              What matters to you?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Select all that resonate with you
            </p>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <Card
                  key={goal.id}
                  variant={selectedGoals.includes(goal.id) ? "default" : "outlined"}
                  className={`p-4 cursor-pointer hover:shadow-medium transition-all ${
                    selectedGoals.includes(goal.id)
                      ? "border-primary bg-primary-light/30"
                      : ""
                  }`}
                  onClick={() => toggleGoal(goal.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{goal.emoji}</span>
                    <span className="font-medium">{goal.label}</span>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" size="lg" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Style Step */}
        {currentStep === "style" && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-display font-semibold text-center mb-2">
              How do you like your habits?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              This helps us match your vibe
            </p>
            <div className="space-y-3">
              {(Object.keys(styleDescriptions) as HabitStyle[]).map((style) => (
                <Card
                  key={style}
                  variant={selectedStyle === style ? "default" : "outlined"}
                  className={`p-4 cursor-pointer hover:shadow-medium transition-all ${
                    selectedStyle === style
                      ? "border-primary bg-primary-light/30"
                      : ""
                  }`}
                  onClick={() => setSelectedStyle(style)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      {styleIcons[style]}
                    </div>
                    <div>
                      <div className="font-medium capitalize flex items-center gap-2">
                        {styleDescriptions[style].emoji} {style}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {styleDescriptions[style].description}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" size="lg" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                className="flex-1"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Energy Step */}
        {currentStep === "energy" && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-display font-semibold text-center mb-2">
              When do you have the most energy?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              We'll suggest habits at the right time
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { time: "Morning", emoji: "🌅", desc: "6am - 12pm" },
                { time: "Afternoon", emoji: "☀️", desc: "12pm - 6pm" },
                { time: "Evening", emoji: "🌙", desc: "6pm - 12am" },
              ].map((item) => (
                <Card
                  key={item.time}
                  className="p-4 text-center cursor-pointer hover:shadow-medium transition-all"
                >
                  <span className="text-3xl block mb-2">{item.emoji}</span>
                  <div className="font-medium">{item.time}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" size="lg" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button size="lg" className="flex-1" onClick={nextStep}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Duration Step */}
        {currentStep === "duration" && (
          <div className="animate-slide-up">
            <h2 className="text-2xl font-display font-semibold text-center mb-2">
              How long should habits take?
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Micro-habits work best when they're short
            </p>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 5].map((min) => (
                <button
                  key={min}
                  onClick={() => setPreferredDuration(min)}
                  className={`w-16 h-16 rounded-2xl font-display text-xl font-semibold transition-all ${
                    preferredDuration === min
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-card border border-border hover:border-primary/30"
                  }`}
                >
                  {min}m
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              We'll prioritize habits under {preferredDuration} minutes
            </p>
            <div className="flex gap-3 mt-8">
              <Button variant="ghost" size="lg" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button size="lg" className="flex-1" onClick={nextStep}>
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full gradient-coral flex items-center justify-center shadow-coral-glow animate-pulse-soft">
              <Sparkles className="w-12 h-12 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3">
              Perfect, {onboardingData.name}!
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
              We've curated your first micro-habits based on your preferences.
              Ready to explore?
            </p>
            <Button size="xl" variant="coral" onClick={handleComplete}>
              See My Habits <Sparkles className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
