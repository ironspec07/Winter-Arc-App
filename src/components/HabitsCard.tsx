import React, { useState, useEffect, useRef } from 'react';
import { AppState, DayRecord, HabitKey, StreakStats } from '../types';
import { StreakSummaryCard } from './StreakSummaryCard';
import { WeeklyInsightsCard } from './WeeklyInsightsCard';
import { triggerCompletionConfetti } from '../utils/confetti';
import { 
  triggerHapticCompletion, 
  triggerHapticGrandCelebration, 
  triggerHapticTap, 
  triggerHapticRevert 
} from '../utils/haptics';
import { 
  HABIT_DEFINITIONS, 
  getDayTargets, 
  isHabitComplete, 
  getCompletedHabitCount, 
  getPhase,
  getWorkoutRoutineForDate
} from '../utils/arcEngine';
import { 
  Footprints, 
  BookOpen, 
  BrainCircuit, 
  Droplet, 
  Moon, 
  Briefcase, 
  Sparkles, 
  ShieldCheck, 
  Dumbbell, 
  Check, 
  Plus, 
  Minus,
  ArrowRight,
  Flame,
  Zap,
  CheckCircle2,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HabitsCardProps {
  selectedDate: string;
  dayRecord: DayRecord;
  state: AppState;
  onUpdateDay: (updater: (prev: DayRecord) => DayRecord) => void;
  onNavigateToWorkout: () => void;
  onSelectDate: (date: string) => void;
  streakStats: StreakStats;
}

const HABIT_ICONS: Record<HabitKey, React.ReactNode> = {
  steps: <Footprints className="w-4 h-4 text-emerald-500" />,
  reading: <BookOpen className="w-4 h-4 text-sky-500" />,
  study: <BrainCircuit className="w-4 h-4 text-indigo-500" />,
  water: <Droplet className="w-4 h-4 text-cyan-500" />,
  sleep: <Moon className="w-4 h-4 text-purple-500" />,
  jobs: <Briefcase className="w-4 h-4 text-amber-500" />,
  hygiene: <Sparkles className="w-4 h-4 text-teal-500" />,
  discipline: <ShieldCheck className="w-4 h-4 text-rose-500" />,
  workout: <Dumbbell className="w-4 h-4 text-orange-500" />,
};

const QUICK_INCREMENTS: Record<HabitKey, number[]> = {
  steps: [1000, 2500],
  reading: [5, 10],
  study: [0.5, 1],
  water: [0.5, 1],
  sleep: [7, 8],
  jobs: [1, 2],
  hygiene: [],
  discipline: [],
  workout: [],
};

type FilterCategory = 'All' | 'Physical' | 'Intellectual' | 'Discipline' | 'Recovery';

export const HabitsCard: React.FC<HabitsCardProps> = ({
  selectedDate,
  dayRecord,
  state,
  onUpdateDay,
  onNavigateToWorkout,
  onSelectDate,
  streakStats,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('All');

  const phase = getPhase(selectedDate);
  const targets = getDayTargets(selectedDate);
  const completedCount = getCompletedHabitCount(dayRecord, selectedDate);
  const percentage = Math.round((completedCount / 9) * 100);
  const routine = getWorkoutRoutineForDate(selectedDate);

  // Immediate performance feedback loop status
  const getFeedbackDetails = (pct: number, count: number) => {
    if (pct === 100) {
      return {
        badge: 'Elite Execution',
        badgeColor: 'bg-emerald-500 text-white shadow-xs',
        message: 'All 9 standards achieved with full compliance. Uncompromised discipline.',
        icon: <Award className="w-3.5 h-3.5" />,
      };
    }
    if (pct >= 78) { // 7/9 habits
      return {
        badge: 'Discipline Threshold Met',
        badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800',
        message: `${9 - count} habit${9 - count === 1 ? '' : 's'} remaining to lock in an elite day.`,
        icon: <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      };
    }
    if (pct >= 56) { // 5/9 habits
      return {
        badge: 'Baseline Standard Active',
        badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800',
        message: 'Mid-tier compliance reached. Maintain momentum through the evening protocols.',
        icon: <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      };
    }
    if (count > 0) {
      return {
        badge: 'Protocol Initiated',
        badgeColor: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700',
        message: `${count} of 9 completed. Focus on clearing one objective at a time.`,
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500" />,
      };
    }
    return {
      badge: 'Uninitiated',
      badgeColor: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700',
      message: 'Start today by checking off morning hydration, reading, or your step baseline.',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />,
    };
  };

  const feedback = getFeedbackDetails(percentage, completedCount);

  // Find next pending habit
  const nextPending = HABIT_DEFINITIONS.find(def => !isHabitComplete(def.key, dayRecord, selectedDate));

  // Auto-trigger celebratory confetti and ripple when all 9 habits are completed
  const prevCountRef = useRef<number>(completedCount);
  const prevDateRef = useRef<string>(selectedDate);

  useEffect(() => {
    // If the user was viewing the current date and just completed the 9th habit
    if (prevDateRef.current === selectedDate && prevCountRef.current < 9 && completedCount === 9) {
      triggerCompletionConfetti();
      triggerHapticGrandCelebration();
    }
    prevCountRef.current = completedCount;
    prevDateRef.current = selectedDate;
  }, [completedCount, selectedDate]);

  const handleNumberChange = (key: keyof DayRecord, val: number) => {
    const clean = Math.max(0, Number(val) || 0);
    const target = targets[key as HabitKey] || 0;
    const current = Number(dayRecord[key]) || 0;
    if (current < target && clean >= target) {
      triggerHapticCompletion();
    }
    onUpdateDay(prev => ({
      ...prev,
      [key]: clean,
    }));
  };

  const handleStep = (key: keyof DayRecord, delta: number) => {
    const current = Number(dayRecord[key]) || 0;
    const target = targets[key as HabitKey] || 0;
    const next = Math.max(0, Math.round((current + delta) * 100) / 100);

    if (current < target && next >= target) {
      triggerHapticCompletion();
    } else if (current >= target && next < target) {
      triggerHapticRevert();
    } else if (delta > 0) {
      triggerHapticTap(10);
    } else {
      triggerHapticTap(8);
    }

    onUpdateDay(prev => ({
      ...prev,
      [key]: next,
    }));
  };

  const handleQuickSetOrAdd = (key: HabitKey, amount: number) => {
    if (key === 'sleep') {
      const current = Number(dayRecord.sleep) || 0;
      const target = targets.sleep || 7.5;
      if (current < target && amount >= target) {
        triggerHapticCompletion();
      } else {
        triggerHapticTap(12);
      }
      handleNumberChange(key, amount);
    } else {
      handleStep(key as keyof DayRecord, amount);
    }
  };

  const handleToggle = (key: keyof DayRecord) => {
    const isCurrentlyDone = isHabitComplete(key as HabitKey, dayRecord, selectedDate);
    if (!isCurrentlyDone) {
      triggerHapticCompletion();
    } else {
      triggerHapticRevert();
    }
    onUpdateDay(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const categories: FilterCategory[] = ['All', 'Physical', 'Intellectual', 'Discipline', 'Recovery'];

  const filteredHabits = HABIT_DEFINITIONS.filter(def => {
    if (selectedCategory === 'All') return true;
    return def.category === selectedCategory;
  });

  return (
    <motion.div 
      key={selectedDate}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-3 sm:space-y-4"
    >
      {/* Visual Habit Streak Summary with Flame & Best Streak Record */}
      <StreakSummaryCard streakStats={streakStats} />

      {/* PERFORMANCE FEEDBACK LOOP & VISUAL PROGRESS BAR CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.04, ease: 'easeOut' }}
        className={`bg-white dark:bg-zinc-900 rounded-2xl border p-3.5 sm:p-6 shadow-xs transition-all relative overflow-hidden ${
          percentage === 100
            ? 'border-emerald-400/80 dark:border-emerald-600/80 ring-1 ring-emerald-500/20'
            : 'border-zinc-200/80 dark:border-zinc-800/80'
        }`}
      >
        {percentage === 100 && (
          <div className="absolute -right-12 -bottom-12 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        )}
        {/* Metric Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                Daily Performance Loop
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {phase === 'home' ? 'Home Phase' : 'Gym Phase'}
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
                {percentage}%
              </span>
              <span className="text-xs sm:text-sm font-semibold font-mono text-zinc-600 dark:text-zinc-400">
                {completedCount} of 9 Completed
              </span>

              {/* Dynamic Status Badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${feedback.badgeColor}`}>
                {feedback.icon}
                <span>{feedback.badge}</span>
              </div>

              {streakStats.currentStreak > 0 && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/50 font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {streakStats.currentStreak}d Streak
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
              {feedback.message}
            </p>
          </div>

          {/* Quick Spotlight for Next Action */}
          {nextPending ? (
            <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-2.5 sm:p-3 border border-zinc-200/70 dark:border-zinc-700/60 sm:min-w-[220px] flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-mono tracking-wider font-semibold text-zinc-400 block">
                  Next Standard
                </span>
                <div className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 truncate mt-0.5">
                  {HABIT_ICONS[nextPending.key]}
                  <span className="truncate">{nextPending.label}</span>
                </div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                  Target: {targets[nextPending.key]} {nextPending.unit}
                </div>
              </div>

              {nextPending.key === 'workout' ? (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={onNavigateToWorkout}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Open Workout Routine"
                >
                  <span>Train</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : nextPending.type === 'check' ? (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => handleToggle(nextPending.key as keyof DayRecord)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Mark Complete"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={() => handleStep(nextPending.key as keyof DayRecord, nextPending.step)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                  title={`Add ${nextPending.step} ${nextPending.unit}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+{nextPending.step}</span>
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                triggerCompletionConfetti();
                triggerHapticGrandCelebration();
              }}
              className="bg-emerald-50/90 dark:bg-emerald-950/40 rounded-xl p-2.5 sm:p-3 border border-emerald-300 dark:border-emerald-800/90 flex items-center justify-between gap-3 shrink-0 select-none cursor-pointer group shadow-xs hover:border-emerald-400 dark:hover:border-emerald-700 transition-all"
              title="Click to celebrate again!"
            >
              <div className="flex items-center gap-3">
                {/* Concentric ripple wave circles around checkmark */}
                <div className="relative flex items-center justify-center w-8 h-8 shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.8, 2.5], opacity: [0.55, 0.2, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-500/35 dark:bg-emerald-400/30 pointer-events-none"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.45, 1.9], opacity: [0.65, 0.25, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: 0.7, ease: 'easeOut' }}
                    className="absolute inset-0 rounded-full bg-emerald-500/25 dark:bg-emerald-400/20 pointer-events-none"
                  />
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center relative z-10 shadow-xs shadow-emerald-500/40 group-hover:scale-105 transition-transform">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <span>Target Cleared</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                    All 9 standards achieved (100%)
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 shrink-0">
                🎉 Celebrate
              </span>
            </motion.div>
          )}
        </div>

        {/* VISUAL PROGRESS BAR WITH MILESTONE INDICATORS */}
        <div className="pt-3 sm:pt-4">
          <div className="relative w-full h-3 sm:h-3.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            {/* Animated Fill Bar */}
            <motion.div
              initial={false}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className={`h-full rounded-full relative ${
                percentage === 100
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                  : percentage >= 78
                  ? 'bg-emerald-600 dark:bg-emerald-500'
                  : percentage >= 56
                  ? 'bg-zinc-800 dark:bg-zinc-200'
                  : 'bg-zinc-900 dark:bg-zinc-100'
              }`}
            >
              {percentage > 10 && (
                <div className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full animate-pulse" />
              )}
            </motion.div>

            {/* Threshold Ticks */}
            <div className="absolute inset-0 pointer-events-none flex justify-between px-[1px]">
              <span className="w-0.5 h-full bg-zinc-300/40 dark:bg-zinc-700/60" style={{ left: '55.5%' }} />
              <span className="w-0.5 h-full bg-zinc-300/40 dark:bg-zinc-700/60" style={{ left: '77.7%' }} />
            </div>
          </div>

          {/* Performance Loop Legend */}
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1.5 px-0.5">
            <span>0% Start</span>
            <span className={percentage >= 56 ? 'text-zinc-700 dark:text-zinc-300 font-semibold' : ''}>
              56% Baseline (5)
            </span>
            <span className={percentage >= 78 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''}>
              78% Threshold (7)
            </span>
            <span className={percentage === 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
              100% Elite (9)
            </span>
          </div>
        </div>
      </motion.div>

      {/* Weekly Insights Automated Telemetry Summary */}
      <WeeklyInsightsCard
        state={state}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Category Filter Pills with Tap Animation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-0.5">
        {categories.map((cat) => {
          const count = cat === 'All' 
            ? HABIT_DEFINITIONS.length 
            : HABIT_DEFINITIONS.filter(d => d.category === cat).length;
          const isCatActive = selectedCategory === cat;

          return (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all select-none cursor-pointer ${
                isCatActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {cat} ({count})
            </motion.button>
          );
        })}
      </div>

      {/* HABITS LIST (WITH STAGGERED FLUID FRAMER MOTION TRANSITIONS) */}
      <div className="space-y-2.5 sm:space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-3 md:space-y-0">
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((def, idx) => {
            const isDone = isHabitComplete(def.key, dayRecord, selectedDate);
            const target = targets[def.key];
            const currentValue = Number(dayRecord[def.key as keyof DayRecord]) || 0;
            const progressPct = def.type === 'number'
              ? Math.min(100, Math.round((currentValue / target) * 100))
              : isDone ? 100 : 0;
            const quickPills = QUICK_INCREMENTS[def.key] || [];

            return (
              <motion.div
                key={def.key}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, delay: idx * 0.02, ease: 'easeOut' }}
                className={`p-3 sm:p-4 rounded-2xl border transition-colors duration-150 flex flex-col justify-between ${
                  isDone
                    ? 'bg-white dark:bg-zinc-900 border-emerald-300/90 dark:border-emerald-800/70 shadow-xs'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Item Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isDone 
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-400'
                      }`}>
                        {HABIT_ICONS[def.key]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-xs sm:text-sm font-bold truncate leading-tight text-zinc-900 dark:text-zinc-100">
                            {def.label}
                          </h3>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                            {def.category}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5">
                          <span>Target: {target} {def.unit}</span>
                          {def.type === 'number' && (
                            <>
                              <span className="text-zinc-300 dark:text-zinc-700">·</span>
                              <span className={isDone ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                                {currentValue} {def.unit}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {isDone && (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 shrink-0"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        Done
                      </motion.span>
                    )}
                  </div>

                  {/* Subtitle / Cues */}
                  <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {def.key === 'workout' && phase === 'home'
                      ? `Split: ${routine.title.split('//')[0].trim()} · ${routine.subtitle}`
                      : def.description}
                  </p>
                </div>

                {/* Controls Footer */}
                <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/70">
                  {def.type === 'number' ? (
                    <div className="space-y-2">
                      {/* Steppers + Quick Presets + Direct Input */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        {/* Plus / Minus Steppers */}
                        <div className="flex items-center gap-1">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleStep(def.key as keyof DayRecord, -def.step)}
                            className="min-w-[36px] min-h-[36px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                            title={`Subtract ${def.step}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleStep(def.key as keyof DayRecord, def.step)}
                            className="min-w-[36px] min-h-[36px] rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                            title={`Add ${def.step}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>

                        {/* 1-Tap Quick Increment Chips (Essential for mobile speed) */}
                        {quickPills.length > 0 && (
                          <div className="flex items-center gap-1">
                            {quickPills.map((amt) => (
                              <motion.button
                                key={amt}
                                whileTap={{ scale: 0.92 }}
                                type="button"
                                onClick={() => handleQuickSetOrAdd(def.key, amt)}
                                className="text-[10px] font-mono font-semibold py-1.5 px-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                              >
                                {def.key === 'sleep' ? `${amt}h` : `+${amt}`}
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* Direct Manual Entry */}
                        <div className="flex items-center gap-1 ml-auto">
                          <input
                            type="number"
                            min="0"
                            step={def.step}
                            value={currentValue === 0 ? '' : currentValue}
                            placeholder="0"
                            onChange={(e) => handleNumberChange(def.key as keyof DayRecord, parseFloat(e.target.value))}
                            className="w-16 text-right font-mono font-bold text-xs py-1 px-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                          />
                          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 w-6 truncate">
                            {def.unit.slice(0, 4)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Fill Bar */}
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={false}
                          animate={{ width: `${progressPct}%` }}
                          transition={{ duration: 0.35, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isDone ? 'bg-emerald-500' : 'bg-zinc-900 dark:bg-zinc-100'
                          }`}
                        />
                      </div>
                    </div>
                  ) : (
                    /* Boolean Checkbox Controls (Big touch target for mobile) */
                    <div className="flex items-center justify-between gap-2">
                      {def.key === 'workout' ? (
                        <>
                          <button
                            type="button"
                            onClick={onNavigateToWorkout}
                            className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-2 flex items-center gap-1 cursor-pointer"
                          >
                            <span>{routine.type === 'recovery' ? 'Recovery Guide' : 'Routine Sets'}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            type="button"
                            onClick={() => handleToggle('workout')}
                            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            <Check className={`w-4 h-4 ${isDone ? 'stroke-[3]' : ''}`} />
                            <span>{isDone ? 'Session Logged' : 'Mark Session Done'}</span>
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                            {isDone ? 'Standard Compliant' : 'Pending Verification'}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            type="button"
                            onClick={() => handleToggle(def.key as keyof DayRecord)}
                            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
                            }`}
                          >
                            <Check className={`w-4 h-4 ${isDone ? 'stroke-[3]' : ''}`} />
                            <span>{isDone ? 'Completed' : 'Check Off'}</span>
                          </motion.button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
