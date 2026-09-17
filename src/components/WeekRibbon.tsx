import React from 'react';
import { AppState } from '../types';
import { 
  getWeekDays, 
  parseISODate, 
  toISODate, 
  getCompletedHabitCount, 
  START_DATE, 
  END_DATE 
} from '../utils/arcEngine';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface WeekRibbonProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  state: AppState;
}

export const WeekRibbon: React.FC<WeekRibbonProps> = ({
  selectedDate,
  onSelectDate,
  state,
}) => {
  const today = toISODate(new Date());
  const weekDays = getWeekDays(selectedDate);

  const handleStepWeek = (delta: number) => {
    const current = parseISODate(selectedDate);
    current.setDate(current.getDate() + delta * 7);
    onSelectDate(toISODate(current));
  };

  const isTodaySelected = selectedDate === today;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="bg-white dark:bg-zinc-900/90 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-2.5 sm:p-3 shadow-xs mb-3.5 sm:mb-4 transition-colors"
    >
      <div className="flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            {parseISODate(weekDays[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – {parseISODate(weekDays[6]).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {!isTodaySelected && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => onSelectDate(today)}
              className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              Today
            </motion.button>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => handleStepWeek(-1)}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Previous Week"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => handleStepWeek(1)}
            className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
            title="Next Week"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* 7 Day Buttons with Subtle Motion Feedback */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((dateIso) => {
          const d = parseISODate(dateIso);
          const isSelected = dateIso === selectedDate;
          const isCurrentDay = dateIso === today;
          const inArc = dateIso >= START_DATE && dateIso <= END_DATE;
          const completedCount = getCompletedHabitCount(state.days[dateIso], dateIso);

          const dayLetter = d.toLocaleDateString(undefined, { weekday: 'short' }); // e.g. Mon, Tue
          const dayNum = d.getDate();

          let indicatorBadge = 'bg-transparent text-zinc-400 dark:text-zinc-600';
          if (inArc && state.days[dateIso] && completedCount > 0) {
            if (completedCount >= 8) {
              indicatorBadge = 'bg-emerald-500 text-white';
            } else if (completedCount >= 5) {
              indicatorBadge = 'bg-amber-500 text-white';
            } else {
              indicatorBadge = 'bg-zinc-400 text-white dark:bg-zinc-600';
            }
          }

          return (
            <motion.button
              key={dateIso}
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => onSelectDate(dateIso)}
              className={`flex flex-col items-center justify-between py-2 px-1 rounded-xl transition-all duration-150 select-none cursor-pointer ${
                isSelected
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-sm scale-[1.02]'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isSelected ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
              }`}>
                {dayLetter}
              </span>

              <div className="my-1 text-center">
                <span className={`text-sm sm:text-base font-bold font-mono ${
                  isCurrentDay && !isSelected 
                    ? 'underline decoration-2 underline-offset-4 decoration-emerald-500' 
                    : ''
                }`}>
                  {dayNum}
                </span>
              </div>

              {/* Status pill or count */}
              <div className="h-4 flex items-center justify-center">
                {inArc && state.days[dateIso] && completedCount > 0 ? (
                  <span className={`text-[9px] font-mono px-1 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-zinc-950'
                      : indicatorBadge
                  }`}>
                    {completedCount}/9
                  </span>
                ) : (
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white/40 dark:bg-black/40' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`} />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
