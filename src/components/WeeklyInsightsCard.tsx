import React, { useState, useMemo } from 'react';
import { AppState } from '../types';
import { generateWeeklyReport } from '../utils/weeklyInsights';
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  ShieldCheck, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Flame, 
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WeeklyInsightsCardProps {
  state: AppState;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const WeeklyInsightsCard: React.FC<WeeklyInsightsCardProps> = ({
  state,
  selectedDate,
  onSelectDate,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const report = useMemo(() => {
    return generateWeeklyReport(state, selectedDate);
  }, [state, selectedDate]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs transition-all overflow-hidden">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 shrink-0">
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
                Weekly Insights
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
                {report.formattedRange}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {/* Performance Tier Pill */}
              <span className={`inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${report.tierBadge.color}`}>
                <ShieldCheck className="w-3 h-3" />
                {report.tierBadge.title}
              </span>

              {/* Delta vs Previous Week */}
              {report.deltaPercentage !== null && report.prevWeekPercentage !== null && (
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                  report.deltaPercentage > 0
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : report.deltaPercentage < 0
                    ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800'
                }`}>
                  {report.deltaPercentage > 0 ? (
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  ) : report.deltaPercentage < 0 ? (
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Minus className="w-3 h-3 text-zinc-400" />
                  )}
                  <span>
                    {report.deltaPercentage > 0 ? `+${report.deltaPercentage}%` : `${report.deltaPercentage}%`} vs last week
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(prev => !prev)}
          className="p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors cursor-pointer shrink-0"
          title={isExpanded ? 'Collapse Weekly Insights' : 'Expand Weekly Insights'}
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="p-3.5 sm:p-5 space-y-4">
              {/* Automated Performance Narrative & Actionable Cue */}
              <div className="bg-zinc-50 dark:bg-zinc-800/40 rounded-xl p-3.5 sm:p-4 border border-zinc-200/70 dark:border-zinc-800 space-y-2.5">
                <div className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                  {report.summaryNarrative}
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-zinc-800 dark:text-zinc-200 font-semibold">Weekly Focus:</strong> {report.actionableCue}
                  </span>
                </div>
              </div>

              {/* Weekly Telemetry Core Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* 1. Overall Completion Rate */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Weekly Rate
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                      {report.completionPercentage}%
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      ({report.totalHabitsCompleted}/{report.totalHabitsPossible})
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-zinc-200/80 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        report.completionPercentage >= 78 
                          ? 'bg-emerald-500' 
                          : report.completionPercentage >= 56 
                          ? 'bg-amber-500' 
                          : 'bg-zinc-900 dark:bg-zinc-100'
                      }`}
                      style={{ width: `${report.completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* 2. Discipline Days Met */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    Discipline Days
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
                      {report.disciplineDays}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      of 7 days (≥7/9)
                    </span>
                  </div>
                  <div className="mt-1.5 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                    {report.eliteDays} elite days (≥8/9)
                  </div>
                </div>

                {/* 3. Strongest Pillar */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Top Anchor
                  </div>
                  <div className="mt-1 truncate font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    {report.strongestHabit ? report.strongestHabit.label : 'None yet'}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {report.strongestHabit 
                      ? `${report.strongestHabit.completedDays}/7 days (${report.strongestHabit.percentage}%)` 
                      : 'Log habits to benchmark'}
                  </div>
                </div>

                {/* 4. Growth Opportunity */}
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-800/80">
                  <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-500" />
                    Growth Lever
                  </div>
                  <div className="mt-1 truncate font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    {report.laggingHabit ? report.laggingHabit.label : 'All Compliant'}
                  </div>
                  <div className="mt-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                    {report.laggingHabit 
                      ? `${report.laggingHabit.completedDays}/7 days (${report.laggingHabit.percentage}%)` 
                      : 'All habits completed'}
                  </div>
                </div>
              </div>

              {/* 7-Day Mini Performance Strip */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mb-1.5 px-0.5">
                  <span className="uppercase tracking-wider">Weekly Day-by-Day Scorecard</span>
                  <span>Tap day to jump</span>
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {report.dailyScores.map((day) => {
                    const isSelected = day.date === selectedDate;
                    let dotColor = 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600';
                    if (day.score >= 8) {
                      dotColor = 'bg-emerald-500 text-white';
                    } else if (day.score >= 7) {
                      dotColor = 'bg-emerald-600 dark:bg-emerald-500 text-white';
                    } else if (day.score >= 5) {
                      dotColor = 'bg-amber-500 text-white';
                    } else if (day.score > 0) {
                      dotColor = 'bg-zinc-600 dark:bg-zinc-500 text-white';
                    }

                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => onSelectDate(day.date)}
                        className={`p-1.5 sm:p-2 rounded-xl flex flex-col items-center justify-between text-center transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 ring-2 ring-emerald-500'
                            : 'bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/50'
                        }`}
                      >
                        <span className={`text-[9px] font-mono uppercase font-semibold ${
                          isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400'
                        }`}>
                          {day.shortDay}
                        </span>
                        <span className="text-xs sm:text-sm font-mono font-bold my-0.5">
                          {day.dayNum}
                        </span>
                        <span className={`text-[9px] font-mono px-1 py-0.2 rounded-full font-bold ${
                          isSelected
                            ? 'bg-white/20 dark:bg-black/20 text-white dark:text-zinc-950'
                            : dotColor
                        }`}>
                          {day.score}/9
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
