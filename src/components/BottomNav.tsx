import { Home, Compass, List, User } from "lucide-react";
import { Button } from "@/components/ui/button";

type Page = "dashboard" | "discover" | "habits" | "profile";

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: "dashboard" as Page, icon: Home, label: "Home" },
    { id: "discover" as Page, icon: Compass, label: "Discover" },
    { id: "habits" as Page, icon: List, label: "Habits" },
    { id: "profile" as Page, icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border z-50">
      <div className="container max-w-lg">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-all ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                <span className="text-xs font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
