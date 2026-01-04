import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { Dashboard } from "@/components/Dashboard";
import { DiscoverPage } from "@/components/DiscoverPage";
import { ActiveHabitsPage } from "@/components/ActiveHabitsPage";
import { ProfilePage } from "@/components/ProfilePage";
import { BottomNav } from "@/components/BottomNav";

type Page = "dashboard" | "discover" | "habits" | "profile";

const Index = () => {
  const { isOnboarded } = useAppStore();
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  if (!isOnboarded) {
    return <OnboardingFlow />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "discover":
        return <DiscoverPage onBack={() => setCurrentPage("dashboard")} />;
      case "habits":
        return <ActiveHabitsPage onBack={() => setCurrentPage("dashboard")} />;
      case "profile":
        return <ProfilePage onBack={() => setCurrentPage("dashboard")} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
};

export default Index;
