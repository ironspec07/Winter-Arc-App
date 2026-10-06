import React, { useMemo } from 'react';
import { AppState, HabitDefinition, HabitKey } from '../types';
import {
  parseISODate,
  toISODate,
  isHabitComplete,
  getCompletedHabitCount,
  DISCIPLINE_THRESHOLD,
} from '../utils/arcEngine';
import {
  Footprints,
  BrainCircuit,
  Droplet,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  BarChart2,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';

interface PastSevenDaysSummaryCardProps {
  state: AppState;
  selectedDate: string;
  selectedHabits: HabitDefinition[];
  selectedCategory: string;
  onSelectDate: (date: string) => void;
}

const HABIT_ICONS: Record<HabitKey, React.ReactNode> = {
  steps: <Footprints className="w-3.5 h-3.5 text-emerald-500" />,
  study: <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />,
  jobs: <Briefcase className="w-3.5 h-3.5 text-amber-500" />,
  workout: <Dumbbell className="w-3.5 h-3.5 text-orange-500" />,
  discipline: <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />,
  water: <Droplet className="w-3.5 h-3.5 text-cyan-500" />,
  hygiene: <Sparkles className="w-3.5 h-3.5 text-teal-500" />,
};

export const PastSevenDaysSummaryCard: React.FC<PastSevenDaysSummaryCardProps> = ({
  state,
  selectedDate,
  selectedHabits,
  selectedCategory,
  onSelectDate,
}) => {
  const summary = useMemo(() => {
    const anchor = parseISODate(selectedDate);
    const trailingDates: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      trailingDates.push(toISODate(d));
    }

    const startDate = parseISODate(trailingDates[0]);
    const endDate = parseISODate(trailingDates[6]);
    const rangeLabel = `${startDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })} – ${endDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}`;

    const habitStats = selectedHabits.map((def) => {
      let completedDays = 0;
      let numericSum = 0;

      const dayHistory = trailingDates.map((iso) => {
        const rec = state.days[iso];
        const done = isHabitComplete(def.key, rec, iso);
        if (done) completedDays++;
        if (def.type === 'number' && rec) {
          numericSum += Number(rec[def.key as keyof typeof rec]) || 0;
        }
        return { iso, done };
      });

      const rate = Math.round((completedDays / 7) * 100);
      const avgValue =
        def.type === 'number'
          ? def.step >= 100
            ? Math.round(numericSum / 7).toLocaleString()
            : (Math.round((numericSum / 7) * 10) / 10).toString()
          : null;

      return {
        def,
        completedDays,
        rate,
        avgValue,
        dayHistory,
      };
    });

    const totalPossible = selectedHabits.length * 7;
    const totalCompleted = habitStats.reduce((sum, h) => sum + h.completedDays, 0);
    const averageCompletionRate =
      totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    const avgHabitsPerDay = (totalCompleted / 7).toFixed(1);

    // Count high-compliance days across the 7-day window
    const disciplineDaysCount = trailingDates.filter((iso) => {
      const rec = state.days[iso];
      if (selectedCategory === 'All') {
        return getCompletedHabitCount(rec, iso) >= DISCIPLINE_THRESHOLD;
      }
      const completedInCat = selectedHabits.filter((h) =>
        isHabitComplete(h.key, rec, iso)
      ).length;
      return completedInCat === selectedHabits.length && selectedHabits.length > 0;
    }).length;

    return {
      trailingDates,
      rangeLabel,
      habitStats,
      totalCompleted,
      totalPossible,
      averageCompletionRate,
      avgHabitsPerDay,
      disciplineDaysCount,
    };
  }, [state.days, selectedDate, selectedHabits, selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 sm:p-5 shadow-xs transition-all"
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
            <BarChart2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-bold font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                Summary · Past 7 Days
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/70 dark:border-zinc-700/70 font-semibold">
                {selectedCategory === 'All' ? 'All 7 Habits' : `${selectedCategory} (${selectedHabits.length})`}
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
              Trailing 7-day window ({summary.rangeLabel})
            </p>
          </div>
        </div>

        {/* Summary Aggregate Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Avg Completion
              </div>
              <div className="text-xs sm:text-sm font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                {summary.averageCompletionRate}%{' '}
                <span className="text-[10px] font-normal text-zinc-500">
                  ({summary.totalCompleted}/{summary.totalPossible})
                </span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <div>
              <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Daily Average
              </div>
              <div className="text-xs sm:text-sm font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                {summary.avgHabitsPerDay}{' '}
                <span className="text-[10px] font-normal text-zinc-500">
                  / {selectedHabits.length} habits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Habit 7-Day Completion Breakdown */}
      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {summary.habitStats.map(({ def, completedDays, rate, avgValue, dayHistory }) => (
          <div
            key={def.key}
            className="p-2.5 sm:p-3 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/40 border border-zinc-200/70 dark:border-zinc-800/80 flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 shrink-0">
                  {HABIT_ICONS[def.key]}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {def.label}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                    {avgValue !== null
                      ? `Avg: ${avgValue} ${def.unit}/d`
                      : `Target: Daily check`}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-xs font-mono font-extrabold ${
                    rate >= 80
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : rate >= 50
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {rate}%
                </span>
                <div className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                  {completedDays}/7 days
                </div>
              </div>
            </div>

            {/* Mini 7-Day Dot Matrix + Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-zinc-200/70 dark:bg-zinc-700/70 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    rate >= 80
                      ? 'bg-emerald-500'
                      : rate >= 50
                      ? 'bg-amber-500'
                      : 'bg-zinc-600 dark:bg-zinc-400'
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-1 pt-0.5">
                {dayHistory.map(({ iso, done }) => {
                  const d = parseISODate(iso);
                  const shortWeekday = d
                    .toLocaleDateString(undefined, { weekday: 'narrow' })
                    .slice(0, 1);
                  const isCurrentSelected = iso === selectedDate;

                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => onSelectDate(iso)}
                      title={`${iso}: ${done ? 'Completed' : 'Missed'}`}
                      className={`flex-1 py-0.5 rounded text-[9px] font-mono font-bold transition-all cursor-pointer ${
                        done
                          ? 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-200/50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 border border-transparent'
                      } ${
                        isCurrentSelected
                          ? 'ring-1 ring-zinc-900 dark:ring-zinc-100'
                          : ''
                      }`}
                    >
                      {shortWeekday}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
