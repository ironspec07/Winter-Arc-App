import React, { useState, useEffect } from 'react';
import { DayRecord, WorkoutRoutine } from '../types';
import { 
  WORKOUT_ROUTINES, 
  getWorkoutRoutineForDate, 
  getPhase, 
  formatDisplayDate 
} from '../utils/arcEngine';
import { triggerHapticCompletion, triggerHapticRevert } from '../utils/haptics';
import { 
  Dumbbell, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  FileText, 
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';

interface WorkoutSectionProps {
  selectedDate: string;
  dayRecord: DayRecord;
  onUpdateDay: (updater: (prev: DayRecord) => DayRecord) => void;
}

export const WorkoutSection: React.FC<WorkoutSectionProps> = ({
  selectedDate,
  dayRecord,
  onUpdateDay,
}) => {
  const phase = getPhase(selectedDate);
  const scheduledRoutine = getWorkoutRoutineForDate(selectedDate);
  const { weekday, dateFormatted } = formatDisplayDate(selectedDate);

  const [activeRoutineKey, setActiveRoutineKey] = useState<string>(() => {
    const match = Object.entries(WORKOUT_ROUTINES).find(([_, r]) => r.id === scheduledRoutine.id);
    return match ? match[0] : (phase === 'home' ? 'Push A' : 'Gym Session');
  });

  useEffect(() => {
    const match = Object.entries(WORKOUT_ROUTINES).find(([_, r]) => r.id === scheduledRoutine.id);
    if (match) {
      setActiveRoutineKey(match[0]);
    }
  }, [selectedDate, scheduledRoutine.id]);

  const currentRoutine: WorkoutRoutine = WORKOUT_ROUTINES[activeRoutineKey] || scheduledRoutine;

  // Track expanded cues per exercise index
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Rest timer state
  const [timerDuration, setTimerDuration] = useState<number>(90);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        if ('vibrate' in navigator) navigator.vibrate([120, 60, 120]);
      } catch (_) {}
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleStartTimer = (seconds: number) => {
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const handleToggleExercise = (index: number) => {
    const isNowDone = !dayRecord.ex?.[index];
    if (isNowDone) {
      triggerHapticCompletion();
    } else {
      triggerHapticRevert();
    }
    onUpdateDay(prev => {
      const currentEx = prev.ex || {};
      const updated = {
        ...currentEx,
        [index]: !currentEx[index],
      };

      const total = currentRoutine.exercises.length;
      const allDone = total > 0 && currentRoutine.exercises.every((_, i) => updated[i] === true);

      return {
        ...prev,
        ex: updated,
        workout: allDone || prev.workout,
      };
    });
  };

  const handleNotesChange = (notes: string) => {
    onUpdateDay(prev => ({
      ...prev,
      workoutNotes: notes,
    }));
  };

  const exercises = currentRoutine.exercises;
  const completedExercises = exercises.filter((_, i) => dayRecord.ex?.[i] === true).length;
  const routineProgressPct = exercises.length > 0 
    ? Math.round((completedExercises / exercises.length) * 100) 
    : 100;

  const routineKeys = Object.keys(WORKOUT_ROUTINES);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner with Routine Pill Selector */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                Training Protocol
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {weekday}, {dateFormatted}
              </span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
              {currentRoutine.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {currentRoutine.subtitle} · {phase === 'home' ? 'Foundation Phase' : 'Expansion Phase'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (!dayRecord.workout) {
                triggerHapticCompletion();
              } else {
                triggerHapticRevert();
              }
              onUpdateDay(prev => ({
                ...prev,
                workout: !prev.workout,
              }));
            }}
            className={`min-h-[42px] px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 ${
              dayRecord.workout
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{dayRecord.workout ? 'Training Logged' : 'Mark Session Done'}</span>
          </button>
        </div>

        {/* Horizontal Routine Switcher (1-tap on mobile) */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            Switch Split Protocol:
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {routineKeys.map((key) => {
              const isActive = activeRoutineKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveRoutineKey(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all select-none ${
                    isActive
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </div>

        {/* Routine Progress line */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3 text-xs font-mono">
          <span className="text-zinc-600 dark:text-zinc-400 font-medium">
            Progress: {completedExercises} / {exercises.length} sets completed
          </span>
          <div className="w-32 sm:w-48 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-900 dark:bg-zinc-100 rounded-full transition-all duration-300"
              style={{ width: `${routineProgressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Exercises & Floating Rest Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Exercises Checklist */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400">
              Prescribed Movements
            </h3>
            <span className="text-[11px] font-mono text-zinc-400">
              Tap card to complete
            </span>
          </div>

          <div className="space-y-2.5">
            {exercises.map((ex, idx) => {
              const isChecked = dayRecord.ex?.[idx] === true;
              const isExpanded = expandedIndex === idx;

              return (
                <div
                  key={ex.name}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 ${
                    isChecked
                      ? 'bg-white dark:bg-zinc-900 border-emerald-300/80 dark:border-emerald-800/60 shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      onClick={() => handleToggleExercise(idx)}
                      className="flex items-start gap-3 flex-1 cursor-pointer select-none"
                    >
                      <div className={`mt-0.5 min-w-[24px] min-h-[24px] rounded-lg border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-transparent'
                      }`}>
                        <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs sm:text-sm font-bold ${
                            isChecked
                              ? 'line-through text-zinc-400 dark:text-zinc-500'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}>
                            {ex.name}
                          </h4>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                            {ex.setsReps}
                          </span>
                        </div>

                        <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Focus:</span> {ex.target}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
                      title="Toggle Form Cues"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expandable Form Cues */}
                  {isExpanded && (
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-200">Execution Standards:</span> {ex.cues}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">Coach Guidance:</span> {currentRoutine.focusNotes}
          </div>
        </div>

        {/* Right Column: Mobile-friendly Rest Timer & Overload Notes */}
        <div className="space-y-4 sm:space-y-6">
          {/* Rest Timer */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" />
                Inter-Set Rest Timer
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                isRunning 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 animate-pulse' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
              }`}>
                {isRunning ? 'RUNNING' : 'STOPPED'}
              </span>
            </div>

            <div className="py-2 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
              <div className="text-[10px] font-mono text-zinc-400 mt-1">
                Target Rest Period
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 my-3">
              {[60, 90, 120, 180].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleStartTimer(sec)}
                  className={`text-xs py-2 font-mono font-semibold rounded-xl border transition-all active:scale-95 ${
                    timerDuration === sec && !isRunning
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                      : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors active:scale-95"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause Timer' : 'Start Timer'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setTimeLeft(timerDuration);
                }}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progressive Overload & Weight Logger */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Progressive Overload Log
            </span>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
              Track weights, reps achieved, backpack load, or exercise substitutions.
            </p>

            <textarea
              rows={4}
              value={dayRecord.workoutNotes || ''}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="e.g. Backpack with 10kg books for rows. Push-ups: 15, 14, 13 reps. Core plank held 50s."
              className="mt-3 w-full text-xs font-mono p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
