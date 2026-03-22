"use client";

import { BarChart2, Home, Sparkles, User } from "lucide-react";
import clsx from "clsx";

const items = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "advisor", label: "AI Advisor", icon: Sparkles },
  { id: "monitor", label: "Monitor", icon: BarChart2 },
  { id: "profile", label: "Profile", icon: User },
] as const;

type BottomNavProps = {
  active?: (typeof items)[number]["id"];
};

export function BottomNav({ active = "dashboard" }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-100 bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
      aria-label="Ana navigasyon"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              type="button"
              className={clsx(
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl py-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-agropi-forest"
                  : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <span
                className={clsx(
                  "h-0.5 w-8 rounded-full",
                  isActive ? "bg-agropi-forest" : "bg-transparent"
                )}
                aria-hidden
              />
              <Icon
                className={clsx("h-6 w-6", isActive && "stroke-[2.5px]")}
                strokeWidth={isActive ? 2.5 : 1.75}
              />
              <span className="truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
