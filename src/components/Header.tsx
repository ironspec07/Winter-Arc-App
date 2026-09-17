import React from 'react';
import { ActiveTab } from '../types';
import { ChevronLeft, ChevronRight, Calendar, Sun, Moon, Download, Dumbbell, CheckCircle2, BarChart3, ListTodo } from 'lucide-react';
import { formatDisplayDate, getPhase } from '../utils/arcEngine';
import { HabitatLogo } from './HabitatLogo';

interface HeaderProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onExport: () => void;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedDate,
  onSelectDate,
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
  onExport,
  completedCount,
}) => {
  const phase = getPhase(selectedDate);
  const { weekday, dateFormatted, relative } = formatDisplayDate(selectedDate);

  const handleStepDay = (delta: number) => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + delta, 12, 0, 0);
    const nextY = date.getFullYear();
    const nextM = String(date.getMonth() + 1).padStart(2, '0');
    const nextD = String(date.getDate()).padStart(2, '0');
    const iso = `${nextY}-${nextM}-${nextD}`;
    onSelectDate(iso);
  };

  const isToday = relative === 'Today';

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Daily Habits', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'workout', label: 'Training / PPL', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'telemetry', label: 'Telemetry & Arc', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'missions', label: 'Missions & System', icon: <ListTodo className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header Bar: compact single-row on mobile, spacious on desktop */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Logo & workspace title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <HabitatLogo size={24} className="w-8 h-8 sm:w-9 sm:h-9" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono uppercase truncate">
                  Hibern8
                </h1>
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  2026
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="truncate">
                  {phase === 'home' ? 'Phase 1: Foundation (Home PPL)' : 'Phase 2: Expansion (Gym)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Toolbar: Compact date controls & quick action icons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Compact date selector */}
            <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-lg p-0.5 border border-zinc-200/80 dark:border-zinc-800/80">
              <button
                type="button"
                onClick={() => handleStepDay(-1)}
                className="p-1 sm:p-1.5 rounded-md hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <div className="px-1.5 sm:px-2.5 py-0.5 text-center">
                <span className="text-[11px] sm:text-xs font-semibold text-zinc-900 dark:text-zinc-100 font-mono whitespace-nowrap">
                  {relative || weekday.slice(0, 3)}, {dateFormatted.split(',')[0]}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStepDay(1)}
                className="p-1 sm:p-1.5 rounded-md hover:bg-white dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {!isToday && (
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const y = now.getFullYear();
                  const m = String(now.getMonth() + 1).padStart(2, '0');
                  const d = String(now.getDate()).padStart(2, '0');
                  onSelectDate(`${y}-${m}-${d}`);
                }}
                className="hidden sm:flex text-xs font-medium px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors items-center gap-1"
                title="Jump to Today"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Today</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onExport}
              className="p-1.5 sm:p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Export JSON Backup"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Tab Navigation (Hidden on mobile; mobile uses fixed bottom MobileNav) */}
        <div className="hidden md:flex items-center space-x-1 overflow-x-auto py-1.5 border-t border-zinc-100 dark:border-zinc-900 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100/70 dark:hover:bg-zinc-800/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
