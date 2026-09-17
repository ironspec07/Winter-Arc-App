import React from 'react';
import { StreakStats } from '../types';
import { Flame, Trophy, Sparkles, TrendingUp, Calendar, Zap, ShieldCheck } from 'lucide-react';

interface StreakSummaryCardProps {
  streakStats: StreakStats;
}

export const StreakSummaryCard: React.FC<StreakSummaryCardProps> = ({ streakStats }) => {
  const {
    currentStreak,
    bestStreak,
    totalCompletedDays,
    overallConsistency,
    totalDaysInArc,
    daysElapsed,
  } = streakStats;

  const isNewRecord = currentStreak > 0 && currentStreak >= bestStreak;
  const daysToMatchRecord = Math.max(0, bestStreak - currentStreak);

  return (
    <div 
      id="habit-streak-summary-card"
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-3.5 sm:p-5 shadow-xs transition-all overflow-hidden relative"
    >
      {/* Subtle ambient gradient highlight for active streaks */}
      {currentStreak > 0 && (
        <div className="absolute -right-16 -top-16 w-36 h-36 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        {/* Left Side: Current Streak Focus with Flame Icon */}
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div 
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
              currentStreak > 0
                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 dark:from-amber-500/30 dark:to-orange-500/30 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
            }`}
          >
            <Flame 
              className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ${
                currentStreak > 0 
                  ? 'fill-amber-500 text-amber-500 scale-110 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]' 
                  : ''
              }`} 
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                Current Streak
              </span>
              {currentStreak > 0 ? (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Active Fire
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  Ready to ignite
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
                {currentStreak}
              </span>
              <span className="text-xs sm:text-sm font-bold font-mono text-zinc-600 dark:text-zinc-400">
                {currentStreak === 1 ? 'Day' : 'Days'} Unbroken
              </span>
            </div>

            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1.5 font-mono">
              <span>Day {daysElapsed} of {totalDaysInArc}</span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span>{overallConsistency}% Arc Consistency</span>
            </div>
          </div>
        </div>

        {/* Right Side: Best Streak Record & Performance Telemetry Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100 dark:border-zinc-800">
          {/* Best Streak Record Card */}
          <div 
            className={`flex-1 sm:flex-initial p-2.5 sm:p-3 rounded-xl border transition-colors min-w-[140px] sm:min-w-[170px] ${
              isNewRecord
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-300/80 dark:border-amber-800/70'
                : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200/70 dark:border-zinc-700/60'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
                Best Streak
              </span>

              {isNewRecord ? (
                <span className="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-300 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  Record High
                </span>
              ) : (
                <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
                  All-Time
                </span>
              )}
            </div>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                {bestStreak}
              </span>
              <span className="text-[11px] font-medium font-mono text-zinc-500 dark:text-zinc-400">
                {bestStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>

            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
              {isNewRecord ? (
                <span className="text-amber-700 dark:text-amber-400 font-semibold">
                  New personal benchmark!
                </span>
              ) : daysToMatchRecord > 0 ? (
                <span>{daysToMatchRecord}d to match personal best</span>
              ) : (
                <span>High discipline standard</span>
              )}
            </div>
          </div>

          {/* Total Days Cleared Metric Pill */}
          <div className="flex-1 sm:flex-initial p-2.5 sm:p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-700/60 bg-zinc-50 dark:bg-zinc-800/50 min-w-[130px] sm:min-w-[150px]">
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                Discipline Days
              </span>
            </div>

            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                {totalCompletedDays}
              </span>
              <span className="text-[11px] font-medium font-mono text-zinc-500 dark:text-zinc-400">
                Days ≥ 7/9
              </span>
            </div>

            <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 mt-0.5 truncate flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>{Math.round((totalCompletedDays / Math.max(1, daysElapsed)) * 100)}% Success Rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
