import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, AppState, DayRecord } from './types';
import { 
  loadStoredState, 
  saveStoredState, 
  toISODate, 
  getCompletedHabitCount, 
  getStreakStats,
  START_DATE
} from './utils/arcEngine';
import { Header } from './components/Header';
import { WeekRibbon } from './components/WeekRibbon';
import { MobileNav } from './components/MobileNav';
import { HabitsCard } from './components/HabitsCard';
import { WorkoutSection } from './components/WorkoutSection';
import { TelemetrySection } from './components/TelemetrySection';
import { MissionsSection } from './components/MissionsSection';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('winter_arc_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('winter_arc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('winter_arc_theme', 'light');
    }
  }, [isDark]);

  // Main state
  const [state, setState] = useState<AppState>(() => loadStoredState());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = toISODate(new Date());
    return today < START_DATE ? START_DATE : today;
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Auto-save on state mutation
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Day record updater (strictly 5 core habits)
  const handleUpdateDay = useCallback((updater: (prev: DayRecord) => DayRecord) => {
    setState(prev => {
      const currentDay: DayRecord = prev.days[selectedDate] || {
        steps: 0,
        discipline: false,
        study: 0,
        workout: false,
        jobs: 0,
        ex: {},
        workoutNotes: '',
      };

      const updated = updater(currentDay);
      return {
        ...prev,
        days: {
          ...prev.days,
          [selectedDate]: updated,
        },
      };
    });
  }, [selectedDate]);

  // JSON Export
  const handleExportBackup = useCallback(() => {
    try {
      const backupData = {
        app: 'Winter Habitat',
        schemaVersion: 4,
        startDate: START_DATE,
        exportedAt: new Date().toISOString(),
        state,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `winter-habitat-nov-backup-${toISODate(new Date())}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast('Workspace backup exported successfully');
    } catch {
      showToast('Failed to export backup data');
    }
  }, [state, showToast]);

  // JSON Import
  const handleImportBackup = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          showToast('Invalid backup file format');
          return;
        }

        const importedState: AppState = parsed.state || parsed;

        if (!importedState.days || typeof importedState.days !== 'object') {
          showToast('Invalid data structure in backup file');
          return;
        }

        setState({
          days: importedState.days || {},
          dailyTodos: importedState.dailyTodos || {},
          monthlyObjectives: importedState.monthlyObjectives || {},
          notes: importedState.notes || {},
          version: 4,
        });

        showToast('Workspace successfully restored from backup');
      } catch {
        showToast('Error reading backup file');
      }
    };
    reader.readAsText(file);
  }, [showToast]);

  // Factory Reset
  const handleConfirmReset = useCallback(() => {
    localStorage.removeItem('winter_arc_workspace_nov_v1');
    setState({
      days: {},
      dailyTodos: {},
      monthlyObjectives: {},
      notes: {},
      version: 4,
    });
    setShowResetConfirm(false);
    showToast('All tracker data has been reset');
  }, [showToast]);

  const currentDayRecord: DayRecord = state.days[selectedDate] || {
    steps: 0,
    discipline: false,
    study: 0,
    workout: false,
    jobs: 0,
    ex: {},
    workoutNotes: '',
  };

  const streakStats = getStreakStats(state, toISODate(new Date()));
  const completedCount = getCompletedHabitCount(currentDayRecord, selectedDate);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      {/* Top Application Header */}
      <Header
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        onExport={handleExportBackup}
        completedCount={completedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-7 pb-24 md:pb-10">
        {/* Quick 7-day ribbon for easy day jumping */}
        {(activeTab === 'overview' || activeTab === 'workout') && (
          <WeekRibbon
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            state={state}
          />
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <HabitsCard
                selectedDate={selectedDate}
                dayRecord={currentDayRecord}
                state={state}
                onUpdateDay={handleUpdateDay}
                onSelectDate={setSelectedDate}
                streakStats={streakStats}
                onNavigateToWorkout={() => setActiveTab('workout')}
              />
            </motion.div>
          )}

          {activeTab === 'workout' && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <WorkoutSection
                selectedDate={selectedDate}
                dayRecord={currentDayRecord}
                onUpdateDay={handleUpdateDay}
              />
            </motion.div>
          )}

          {activeTab === 'telemetry' && (
            <motion.div
              key="telemetry"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <TelemetrySection
                state={state}
                selectedDate={selectedDate}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setActiveTab('overview');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <MissionsSection
                selectedDate={selectedDate}
                state={state}
                onUpdateState={setState}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetData={() => setShowResetConfirm(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation Bar (Fixed for thumb reach) */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        completedCount={completedCount}
        streakCount={streakStats.currentStreak}
      />

      {/* Subtle Minimal Footer */}
      <footer className="border-t border-zinc-200/70 dark:border-zinc-800/70 py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>WINTER HABITAT · 2026</span>
          </div>
          <div>
            Discipline over motivation · Performance over comfort
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('workout')}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Physical Training
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('telemetry')}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('missions')}
              className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              System
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-mono font-medium shadow-lg border border-zinc-700/50 dark:border-zinc-300/50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base font-mono">Reset All Tracker Data?</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              This will erase all logged habits, daily missions, and notes from your browser's local storage. This action cannot be undone. Consider exporting a JSON backup first.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
