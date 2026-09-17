import React, { useState } from 'react';
import { AppState } from '../types';
import { 
  START_DATE, 
  END_DATE, 
  GYM_DATE, 
  getStreakStats, 
  getCompletedHabitCount, 
  HABIT_DEFINITIONS, 
  isHabitComplete, 
  parseISODate, 
  toISODate
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

interface TelemetrySectionProps {
  state: AppState;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const ARC_MONTHS = ['2026-09', '2026-10', '2026-11', '2026-12'];

export const TelemetrySection: React.FC<TelemetrySectionProps> = ({
  state,
  selectedDate,
  onSelectDate,
}) => {
  const todayIso = toISODate(new Date());
  const stats = getStreakStats(state, todayIso);

  const [activeMonth, setActiveMonth] = useState<string>(() => {
    return selectedDate.slice(0, 7) || '2026-09';
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
    const avgScorePct = eligibleDays > 0 ? Math.round((totalScore / (eligibleDays * 9)) * 100) : 0;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner: Winter Arc Progression Timeline */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Arc Telemetry
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                17 Sep – 31 Dec 2026
              </span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
              Day {stats.daysElapsed} of {stats.totalDaysInArc}
            </h2>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {stats.daysRemaining} days remaining in the 2026 discipline protocol.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 font-mono pt-1 sm:pt-0">
            <div className="sm:text-right">
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Campaign Completion</div>
              <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {Math.round((stats.daysElapsed / stats.totalDaysInArc) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Linear progress bar */}
        <div className="mt-4">
          <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
              style={{ width: `${Math.round((stats.daysElapsed / stats.totalDaysInArc) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1.5">
            <span>Sep 17</span>
            <span>Oct 5 (Gym)</span>
            <span>Dec 31</span>
          </div>
        </div>
      </div>

      {/* 4 Core Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
        <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Active Streak</span>
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {stats.currentStreak} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Days ≥ 7/9 habits
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Best Streak</span>
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
          </div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {stats.bestStreak} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Longest discipline run
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Elite Days</span>
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
          </div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {stats.totalCompletedDays} <span className="text-xs font-normal text-zinc-500">days</span>
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            High-compliance days
          </p>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-xs">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">Consistency</span>
            <Percent className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-500" />
          </div>
          <div className="mt-1.5 text-2xl sm:text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
            {stats.overallConsistency}%
          </div>
          <p className="mt-0.5 text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
            Overall execution rate
          </p>
        </div>
      </div>

      {/* 30-Day Habit Completion Trends Recharts Line Chart */}
      <HabitTrendChart
        state={state}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
      />

      {/* Main Grid: Interactive Calendar & Monthly Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left 2 Cols: Monthly Interactive Calendar Matrix */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-zinc-500" />
              <h3 className="text-xs sm:text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {monthLabel}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={activeMonth === ARC_MONTHS[0]}
                className="p-1 sm:p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                disabled={activeMonth === ARC_MONTHS[ARC_MONTHS.length - 1]}
                className="p-1 sm:p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
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
                if (completedHabits >= 8) {
                  statusColor = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
                } else if (completedHabits >= 5) {
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
                  className={`min-h-[46px] sm:min-h-[60px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all select-none relative active:scale-95 ${statusColor} ${
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
                    {inArc && dateIso < GYM_DATE && (
                      <span className="text-[7px] sm:text-[8px] font-mono text-zinc-400 hidden sm:inline">
                        PPL
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {inArc && state.days[dateIso] && completedHabits > 0 ? (
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold">
                        {completedHabits}/9
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
                8–9 Protocols
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-xs sm:rounded-sm bg-amber-400 dark:bg-amber-600" />
                5–7 Protocols
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-400">Tap day to inspect</span>
          </div>
        </div>

        {/* Right Col: Monthly Summaries & Habit Breakdown */}
        <div className="space-y-4 sm:space-y-6">
          {/* 4 Month Performance Cards */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              Monthly Campaign Blocks
            </h3>

            <div className="space-y-2 sm:space-y-2.5">
              {monthlySummaries.map((m) => {
                const isActive = activeMonth === m.monthStr;
                return (
                  <div
                    key={m.monthStr}
                    onClick={() => setActiveMonth(m.monthStr)}
                    className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-50 dark:bg-zinc-800/60 border-zinc-300 dark:border-zinc-700'
                        : 'border-zinc-200/70 dark:border-zinc-800/70 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                        {m.label} 2026
                      </span>
                      <span className="text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                        {m.avgScorePct}% Rate
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                      <span>{m.trackedDays} / {m.eligibleDays} days logged</span>
                      <span>{m.eligibleDays} days</span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full"
                        style={{ width: `${m.avgScorePct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit compliance list */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 mb-3">
              Protocol Compliance Rate
            </h3>

            <div className="space-y-2">
              {habitCompliance.map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs mb-0.5">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                    <span className="font-mono text-zinc-500">{item.rate}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.rate >= 80 ? 'bg-emerald-500' : item.rate >= 50 ? 'bg-zinc-700 dark:bg-zinc-300' : 'bg-zinc-400 dark:bg-zinc-600'
                      }`}
                      style={{ width: `${item.rate}%` }}
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
