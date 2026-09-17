import { AppState, HabitKey } from '../types';
import { 
  getWeekDays, 
  parseISODate, 
  toISODate, 
  getCompletedHabitCount, 
  isHabitComplete, 
  HABIT_DEFINITIONS,
  START_DATE,
  END_DATE 
} from './arcEngine';

export interface WeeklyReport {
  weekDays: string[];
  startDateIso: string;
  endDateIso: string;
  formattedRange: string;
  totalHabitsCompleted: number;
  totalHabitsPossible: number;
  completionPercentage: number;
  disciplineDays: number; // days >= 7/9
  eliteDays: number; // days >= 8/9
  daysWithActivity: number;
  prevWeekPercentage: number | null;
  deltaPercentage: number | null;
  strongestHabit: {
    key: HabitKey;
    label: string;
    completedDays: number;
    percentage: number;
  } | null;
  laggingHabit: {
    key: HabitKey;
    label: string;
    completedDays: number;
    percentage: number;
  } | null;
  workoutDaysCompleted: number;
  workoutDaysTotal: number;
  summaryNarrative: string;
  actionableCue: string;
  tierBadge: {
    title: string;
    color: string;
  };
  dailyScores: {
    date: string;
    shortDay: string;
    dayNum: number;
    score: number;
    percentage: number;
    inArc: boolean;
    isThresholdMet: boolean;
    isElite: boolean;
  }[];
}

export function generateWeeklyReport(state: AppState, anchorDateIso: string): WeeklyReport {
  const weekDays = getWeekDays(anchorDateIso);
  const startDate = parseISODate(weekDays[0]);
  const endDate = parseISODate(weekDays[6]);

  const formattedRange = `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const daysInArc = weekDays.filter(d => d >= START_DATE && d <= END_DATE);
  const totalHabitsPossible = (daysInArc.length > 0 ? daysInArc.length : 7) * 9;

  let totalHabitsCompleted = 0;
  let disciplineDays = 0;
  let eliteDays = 0;
  let daysWithActivity = 0;
  let workoutDaysCompleted = 0;

  // Track habit frequencies
  const habitCompletionCounts: Record<HabitKey, number> = {
    steps: 0,
    reading: 0,
    study: 0,
    water: 0,
    sleep: 0,
    jobs: 0,
    hygiene: 0,
    discipline: 0,
    workout: 0,
  };

  const dailyScores = weekDays.map((iso) => {
    const d = parseISODate(iso);
    const dayRec = state.days[iso];
    const inArc = iso >= START_DATE && iso <= END_DATE;
    const score = inArc && dayRec ? getCompletedHabitCount(dayRec, iso) : 0;
    const percentage = Math.round((score / 9) * 100);
    const isThresholdMet = score >= 7;
    const isElite = score >= 8;

    if (inArc && score > 0) {
      daysWithActivity++;
      totalHabitsCompleted += score;
      if (isThresholdMet) disciplineDays++;
      if (isElite) eliteDays++;
    }

    if (inArc && dayRec) {
      HABIT_DEFINITIONS.forEach(def => {
        if (isHabitComplete(def.key, dayRec, iso)) {
          habitCompletionCounts[def.key]++;
          if (def.key === 'workout') {
            workoutDaysCompleted++;
          }
        }
      });
    }

    return {
      date: iso,
      shortDay: d.toLocaleDateString(undefined, { weekday: 'short' }),
      dayNum: d.getDate(),
      score,
      percentage,
      inArc,
      isThresholdMet,
      isElite,
    };
  });

  const completionPercentage = totalHabitsPossible > 0
    ? Math.round((totalHabitsCompleted / totalHabitsPossible) * 100)
    : 0;

  // Compute Previous Week Comparison
  const prevWeekAnchor = new Date(startDate);
  prevWeekAnchor.setDate(prevWeekAnchor.getDate() - 7);
  const prevWeekDays = getWeekDays(toISODate(prevWeekAnchor));
  const prevDaysInArc = prevWeekDays.filter(d => d >= START_DATE && d <= END_DATE);

  let prevWeekPercentage: number | null = null;
  let deltaPercentage: number | null = null;

  if (prevDaysInArc.length > 0) {
    let prevTotalCompleted = 0;
    prevDaysInArc.forEach(d => {
      const rec = state.days[d];
      if (rec) {
        prevTotalCompleted += getCompletedHabitCount(rec, d);
      }
    });
    const prevPossible = prevDaysInArc.length * 9;
    prevWeekPercentage = Math.round((prevTotalCompleted / prevPossible) * 100);
    deltaPercentage = completionPercentage - prevWeekPercentage;
  }

  // Find Strongest & Lagging Habits
  const activeDaysCount = daysInArc.length || 7;
  const habitRankings = HABIT_DEFINITIONS.map(def => ({
    key: def.key,
    label: def.label,
    completedDays: habitCompletionCounts[def.key],
    percentage: Math.round((habitCompletionCounts[def.key] / activeDaysCount) * 100),
  })).sort((a, b) => b.completedDays - a.completedDays);

  let strongestHabit: WeeklyReport['strongestHabit'] = null;
  let laggingHabit: WeeklyReport['laggingHabit'] = null;

  if (totalHabitsCompleted > 0) {
    if (habitRankings[0].completedDays > 0) {
      strongestHabit = habitRankings[0];
    }
    const lowest = [...habitRankings].reverse().find(h => h.completedDays < activeDaysCount);
    if (lowest) {
      laggingHabit = lowest;
    }
  }

  // Determine Performance Tier & Automated Summary Narrative
  let tierBadge = {
    title: 'Uninitiated',
    color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
  };
  let summaryNarrative = '';
  let actionableCue = '';

  if (totalHabitsCompleted === 0) {
    summaryNarrative = 'No protocol activity logged for this week window. Select any day in the ribbon to check off morning hydration, reading, or baseline steps.';
    actionableCue = 'Clear your hydration and step targets before noon to seed daily momentum.';
  } else if (completionPercentage >= 85) {
    tierBadge = {
      title: 'Elite Execution',
      color: 'bg-emerald-500 text-white shadow-xs',
    };
    summaryNarrative = `Uncompromising week with ${disciplineDays} of ${activeDaysCount} days hitting the discipline threshold (≥7/9 habits). ${
      strongestHabit ? `Your ${strongestHabit.label.toLowerCase()} was rock solid at ${strongestHabit.completedDays}/${activeDaysCount} days.` : ''
    } Overall volume is operating at championship caliber.`;
    actionableCue = 'Sustain your sleep and active recovery protocols to prevent accumulated fatigue.';
  } else if (completionPercentage >= 65) {
    tierBadge = {
      title: 'Strong Momentum',
      color: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800',
    };
    summaryNarrative = `Consistent execution this week with ${disciplineDays} threshold days logged. ${
      strongestHabit ? `${strongestHabit.label} anchored your protocol with ${strongestHabit.percentage}% compliance.` : ''
    } ${
      laggingHabit && laggingHabit.completedDays < activeDaysCount - 1
        ? `${laggingHabit.label} is your prime lever for improvement (${laggingHabit.completedDays}/${activeDaysCount} days).`
        : ''
    }`;
    actionableCue = laggingHabit
      ? `Schedule a dedicated recurring block for ${laggingHabit.label.toLowerCase()} early in your routine.`
      : 'Maintain steady pacing through the weekend to protect your streak.';
  } else if (completionPercentage >= 45) {
    tierBadge = {
      title: 'Baseline Standard Active',
      color: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300/80 dark:border-amber-800',
    };
    summaryNarrative = `Moderate protocol compliance this week with ${totalHabitsCompleted} total standards completed. You achieved the discipline threshold on ${disciplineDays} day${disciplineDays === 1 ? '' : 's'}.`;
    actionableCue = 'Target closing at least 7 standards today to raise your weekly consistency average above 65%.';
  } else {
    tierBadge = {
      title: 'Building Velocity',
      color: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700',
    };
    summaryNarrative = `Early week traction with ${totalHabitsCompleted} completed habits. Discipline compounds exponentially when consecutive days are chained together.`;
    actionableCue = 'Focus on the non-negotiables: 3L water, 7,000 steps, and 2× oral hygiene.';
  }

  return {
    weekDays,
    startDateIso: weekDays[0],
    endDateIso: weekDays[6],
    formattedRange,
    totalHabitsCompleted,
    totalHabitsPossible,
    completionPercentage,
    disciplineDays,
    eliteDays,
    daysWithActivity,
    prevWeekPercentage,
    deltaPercentage,
    strongestHabit,
    laggingHabit,
    workoutDaysCompleted,
    workoutDaysTotal: activeDaysCount,
    summaryNarrative,
    actionableCue,
    tierBadge,
    dailyScores,
  };
}
