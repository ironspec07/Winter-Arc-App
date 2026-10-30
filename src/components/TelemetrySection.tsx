import React, { useState } from 'react';
import { AppState } from '../types';
import { 
  START_DATE, 
  END_DATE, 
  getStreakStats, 
  getCompletedHabitCount, 
  HABIT_DEFINITIONS, 
  isHabitComplete, 
  toISODate,
  TOTAL_HABITS,
  DISCIPLINE_THRESHOLD
} from '../utils/arcEngine';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Target, 
  Percent, 
  Calendar as CalendarIcon,
  TrendingUp
} from 'lucide-react';
import { HabitTrendChart } from './HabitTrendChart';
import { SevenDayHabitBarChart } from './SevenDayHabitBarChart';

interface TelemetrySectionProps {
  state: AppState;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const ARC_MONTHS = ['2026-11', '2026-12'];

export const TelemetrySection: React.FC<TelemetrySectionProps> = ({
  state,
  selectedDate,
  onSelectDate,
}) => {
  const todayIso = toISODate(new Date());
  const stats = getStreakStats(state, todayIso);

  const [activeMonth, setActiveMonth] = useState<string>(() => {
    const m = selectedDate.slice(0, 7);
    return ARC_MONTHS.includes(m) ? m : '2026-11';
  });

  const handlePrevMonth = () => {
    const idx = ARC_MONTHS.indexOf(activeMonth);
    if (idx > 0) setActiveMonth(ARC_MONTHS[idx - 1]);
  };

  const handleNextMonth = () => {
    const idx = ARC_MONTHS.indexOf(activeMonth);
    if (idx < ARC_MONTHS.length - 1) setActiveMonth(ARC_MONTHS[idx + 1]);
  };

  const [year, month] = activeMonth.split('-').map(Number);
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const totalDaysInMonth = new Date(year, month, 0).getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthLabel = firstDayOfMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const monthlySummaries = ARC_MONTHS.map((mStr) => {
    const [y, m] = mStr.split('-').map(Number);
    const totalDays = new Date(y, m, 0).getDate();
    const dates: string[] = [];

    for (let day = 1; day <= totalDays; day++) {
      const dStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (dStr >= START_DATE && dStr <= END_DATE) {
        dates.push(dStr);
      }
    }

    const eligibleDays = dates.length;
    const trackedDays = dates.filter(d => state.days[d] && getCompletedHabitCount(state.days[d], d) > 0).length;
    const totalScore = dates.reduce((sum, d) => sum + getCompletedHabitCount(state.days[d], d), 0);
    const avgScorePct = eligibleDays > 0 ? Math.round((totalScore / (eligibleDays * TOTAL_HABITS)) * 100) : 0;

    return {
      monthStr: mStr,
      label: new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: 'short' }),
      eligibleDays,
      trackedDays,
      avgScorePct,
    };
  });

  const allTrackedDates = Object.keys(state.days).filter(d => d >= START_DATE && d <= END_DATE);
  const habitCompliance = HABIT_DEFINITIONS.map((def) => {
    if (allTrackedDates.length === 0) return { key: def.key, label: def.label, rate: 0 };
    const successCount = allTrackedDates.filter(d => isHabitComplete(def.key, state.days[d], d)).length;
    const rate = Math.round((successCount / allTrackedDates.length) * 100);
    return {
      key: def.key,
      label: def.label,
      rate,
    };
  });

  return (
    <div className="space-y-6">
      {/* 4 Primary Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Current Streak
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.currentStreak}
            </span>
            <span className="text-xs font-mono text-zinc-500">consecutive days</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
            {stats.currentStreak > 0 ? 'Protocol maintained' : 'Threshold is ≥4/5 habits'}
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Best Streak
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Trophy className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.bestStreak}
            </span>
            <span className="text-xs font-mono text-zinc-500">record days</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
            All-time Winter Arc maximum
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Discipline Days
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Target className="w-4 h-4 text-indigo-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.totalCompletedDays}
            </span>
            <span className="text-xs font-mono text-zinc-500">of {stats.daysElapsed}</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
            {stats.daysElapsed > 0 ? Math.round((stats.totalCompletedDays / stats.daysElapsed) * 100) : 0}% campaign consistency
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Protocol Compliance
            </span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400">
              <Percent className="w-4 h-4 text-cyan-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.overallConsistency}%
            </span>
            <span className="text-xs font-mono text-zinc-500">arc volume</span>
          </div>
          <div className="mt-2 text-[11px] text-zinc-500 font-mono">
            Aggregate execution index
          </div>
        </div>
      </div>

      {/* Trailing 7-Day Completion Rate Bar Chart */}
      <SevenDayHabitBarChart state={state} selectedDate={selectedDate} />

      {/* Interactive 30-Day Completion Trend Chart */}
      <HabitTrendChart
        state={state}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Monthly Interactive Arc Matrix & Habit Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Matrix Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-zinc-500" />
              <h2 className="text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {monthLabel}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={activeMonth === ARC_MONTHS[0]}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={activeMonth === ARC_MONTHS[ARC_MONTHS.length - 1]}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Calendar Day Labels */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center mb-1 sm:mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => {
              const fullNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
              return (
                <span key={`day-${i}`} className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold py-0.5">
                  <span className="sm:hidden">{d}</span>
                  <span className="hidden sm:inline">{fullNames[i]}</span>
                </span>
              );
            })}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {Array.from({ length: startingDayOfWeek }).map((_, i) => (
              <div key={`pad-${i}`} className="min-h-[46px] sm:min-h-[60px] rounded-xl bg-zinc-50/40 dark:bg-zinc-900/30" />
            ))}

            {Array.from({ length: totalDaysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateIso = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateIso === selectedDate;
              const isToday = dateIso === todayIso;
              const inArc = dateIso >= START_DATE && dateIso <= END_DATE;
              const completedHabits = getCompletedHabitCount(state.days[dateIso], dateIso);

              let statusColor = 'border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400';
              if (inArc && state.days[dateIso]) {
                if (completedHabits >= DISCIPLINE_THRESHOLD) {
                  statusColor = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
                } else if (completedHabits >= 3) {
                  statusColor = 'border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200';
                } else if (completedHabits > 0) {
                  statusColor = 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200';
                }
              }

              return (
                <button
                  key={dateIso}
                  type="button"
                  onClick={() => onSelectDate(dateIso)}
                  className={`min-h-[46px] sm:min-h-[60px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all select-none relative active:scale-95 cursor-pointer ${statusColor} ${
                    isSelected
                      ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 shadow-sm z-10'
                      : 'hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[11px] sm:text-xs font-mono font-bold ${
                      isToday 
                        ? 'px-1 sm:px-1.5 py-0.2 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' 
                        : ''
                    }`}>
                      {dayNum}
                    </span>
                  </div>

                  <div className="text-right">
                    {inArc && state.days[dateIso] && completedHabits > 0 ? (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold">
                        {completedHabits}/{TOTAL_HABITS}
                      </span>
                    ) : inArc ? (
                      <span className="text-[9px] sm:text-[10px] font-mono text-zinc-300 dark:text-zinc-700">—</span>
                    ) : (
                      <span className="text-[8px] sm:text-[9px] font-mono text-zinc-300 dark:text-zinc-700">off</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-3 sm:mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[10px] sm:text-[11px] text-zinc-500 font-mono">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs sm:rounded-sm bg-emerald-400 dark:bg-emerald-600" />
                4–5 Protocols (Discipline Met)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs sm:rounded-sm bg-amber-400 dark:bg-amber-600" />
                3 Protocols (Baseline)
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-400">Tap day to inspect</span>
          </div>
        </div>

        {/* Right Col: Monthly Summaries & Habit Breakdown */}
        <div className="space-y-4 sm:space-y-6">
          {/* 2 Month Performance Cards */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              Monthly Campaign Blocks
            </h3>
            <div className="space-y-2.5">
              {monthlySummaries.map((m) => (
                <div
                  key={m.monthStr}
                  onClick={() => setActiveMonth(m.monthStr)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    activeMonth === m.monthStr
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80'
                      : 'border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold font-mono text-zinc-900 dark:text-zinc-100">
                      {m.label} 2026
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {m.eligibleDays} days in arc
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                      {m.avgScorePct}%
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      compliance
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habit-by-Habit Arc Volume Breakdown */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              Habit Execution Consistency
            </h3>
            <div className="space-y-3">
              {habitCompliance.map((h) => (
                <div key={h.key} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium">{h.label}</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-bold">{h.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                      style={{ width: `${h.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
