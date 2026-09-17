import React from 'react';
import { ActiveTab } from '../types';
import { CheckCircle2, Dumbbell, BarChart3, ListTodo } from 'lucide-react';
import { triggerHapticTap } from '../utils/haptics';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  completedCount: number;
  streakCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  completedCount,
  streakCount,
}) => {
  const items: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'overview',
      label: 'Habits',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badge: `${completedCount}/9`,
    },
    {
      id: 'workout',
      label: 'Training',
      icon: <Dumbbell className="w-5 h-5" />,
    },
    {
      id: 'telemetry',
      label: 'Telemetry',
      icon: <BarChart3 className="w-5 h-5" />,
      badge: streakCount > 0 ? `${streakCount}d` : undefined,
    },
    {
      id: 'missions',
      label: 'Missions',
      icon: <ListTodo className="w-5 h-5" />,
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/90 dark:border-zinc-800/90 px-2 py-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom))] shadow-lg transition-colors"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerHapticTap(8);
                onTabChange(item.id);
              }}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 relative select-none active:scale-95 ${
                isActive
                  ? 'text-zinc-950 dark:text-zinc-50 font-semibold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {/* Active Indicator bar */}
              {isActive && (
                <span className="absolute top-0.5 w-7 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all" />
              )}

              <div className="relative mt-0.5">
                {item.icon}
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 text-[9px] font-mono px-1 py-0.2 rounded-full font-bold leading-none ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <span className="text-[10px] font-medium tracking-tight mt-1">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
