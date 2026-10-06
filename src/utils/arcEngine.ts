import { AppState, DayRecord, HabitDefinition, HabitKey, TodoItem, WorkoutRoutine } from '../types';

export const START_DATE = '2026-10-06';
export const GYM_DATE = '2026-10-06';
export const END_DATE = '2026-12-31';

export const TOTAL_HABITS = 7;
export const DISCIPLINE_THRESHOLD = 6;

export const STORAGE_KEY = 'winter_arc_workspace_v3';
const LEGACY_STORAGE_KEYS = [
  'winter_arc_workspace_v2',
  'winterArcAppV14',
  'winterArcAppV13',
  'winterArcAppV12',
  'winterArcAppV11',
  'winterArcAppV10',
  'winterArcAppV9',
  'winterArcAppV8',
  'winterArcAppV7',
];

export const HABIT_DEFINITIONS: HabitDefinition[] = [
  {
    key: 'steps',
    label: 'Daily Steps',
    category: 'Physical',
    unit: 'steps',
    step: 500,
    type: 'number',
    homeTarget: 10000,
    gymTarget: 10000,
    description: 'Baseline physical activity and daily metabolic expenditure.',
  },
  {
    key: 'study',
    label: 'Study',
    category: 'Intellectual',
    unit: 'hours',
    step: 0.5,
    type: 'number',
    homeTarget: 4,
    gymTarget: 4,
    description: 'Zero-distraction deep work, study, and technical mastery.',
  },
  {
    key: 'jobs',
    label: 'Job Applications',
    category: 'Intellectual',
    unit: 'apps',
    step: 1,
    type: 'number',
    homeTarget: 5,
    gymTarget: 5,
    description: 'Proactive career outreach, applications, or networking.',
  },
  {
    key: 'workout',
    label: 'Physical Training',
    category: 'Physical',
    unit: 'session',
    step: 1,
    type: 'check',
    homeTarget: 1,
    gymTarget: 1,
    description: 'Completed scheduled daily physical training or workout session.',
  },
  {
    key: 'discipline',
    label: 'Dopamine Discipline',
    category: 'Discipline',
    unit: 'done',
    step: 1,
    type: 'check',
    homeTarget: 1,
    gymTarget: 1,
    description: 'Strict zero adult content / abstinence, preserving neural focus.',
  },
  {
    key: 'water',
    label: 'Hydration',
    category: 'Physical',
    unit: 'Liters',
    step: 0.25,
    type: 'number',
    homeTarget: 3,
    gymTarget: 3,
    description: 'Optimal cellular hydration and sustained cognitive focus.',
  },
  {
    key: 'hygiene',
    label: 'Brush Twice (2×)',
    category: 'Discipline',
    unit: 'done',
    step: 1,
    type: 'check',
    homeTarget: 1,
    gymTarget: 1,
    description: 'Morning and night dental hygiene routines completed.',
  },
];

export const WORKOUT_ROUTINES: Record<string, WorkoutRoutine> = {
  'Gym Session': {
    id: 'gym-session',
    title: 'Physical Training // Daily Protocol',
    subtitle: 'Strength & Conditioning Protocol',
    type: 'gym',
    exercises: [
      { name: 'Primary Compound Lift', setsReps: '3–4 × 6–10 reps', target: 'Squat / Bench / Deadlift / OHP', cues: 'Log exact weight and reps. Rest 2–3 minutes.' },
      { name: 'Secondary Accessory Lift', setsReps: '3 × 8–12 reps', target: 'Target Muscle Group', cues: 'Focus on clean eccentric tempo.' },
      { name: 'Unilateral / Machine Work', setsReps: '3 × 10–15 reps', target: 'Hypertrophy / Isolation', cues: 'Maintain strict form through entire rep range.' },
      { name: 'Finisher / Core Protocol', setsReps: '2–3 sets to near failure', target: 'Metabolic Conditioning', cues: 'Leave nothing in the tank on final set.' },
    ],
    focusNotes: 'Prioritize progressive overload and strict execution.',
  },
};

// Date utilities
export function toISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function formatDisplayDate(iso: string): { weekday: string; dateFormatted: string; relative: string } {
  const target = parseISODate(iso);
  const today = toISODate(new Date());
  
  const weekday = target.toLocaleDateString(undefined, { weekday: 'long' });
  const dateFormatted = target.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  
  let relative = '';
  if (iso === today) relative = 'Today';
  else {
    const todayDate = parseISODate(today);
    const diffDays = Math.round((target.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) relative = 'Tomorrow';
    else if (diffDays === -1) relative = 'Yesterday';
    else if (diffDays > 1) relative = `+${diffDays} days ahead`;
    else relative = `${Math.abs(diffDays)} days ago`;
  }

  return { weekday, dateFormatted, relative };
}

export function getPhase(iso: string): 'home' | 'gym' {
  return iso < GYM_DATE ? 'home' : 'gym';
}

export function getWorkoutRoutineForDate(_iso: string): WorkoutRoutine {
  return WORKOUT_ROUTINES['Gym Session'];
}

export function getDayTargets(iso: string): Record<HabitKey, number> {
  const d = parseISODate(iso);
  const isSunday = d.getDay() === 0;

  return {
    steps: isSunday ? 0 : 10000,
    study: 4,
    jobs: 5,
    workout: isSunday ? 0 : 1,
    discipline: 1,
    water: 3,
    hygiene: 1,
  };
}

export function isHabitComplete(key: HabitKey, day: DayRecord | undefined, iso: string): boolean {
  if (!day) return false;
  const targets = getDayTargets(iso);
  const d = parseISODate(iso);
  const isSunday = d.getDay() === 0;

  switch (key) {
    case 'steps':
      if (isSunday) return true;
      return (day.steps || 0) >= targets.steps;
    case 'study':
      return (day.study || 0) >= targets.study;
    case 'jobs':
      return (day.jobs || 0) >= targets.jobs;
    case 'workout':
      if (isSunday) return true;
      return day.workout === true;
    case 'discipline':
      return day.discipline === true;
    case 'water':
      return (day.water || 0) >= targets.water;
    case 'hygiene':
      return day.hygiene === true;
    default:
      return false;
  }
}

export function getCompletedHabitCount(day: DayRecord | undefined, iso: string): number {
  if (!day) return 0;
  return HABIT_DEFINITIONS.filter(def => isHabitComplete(def.key, day, iso)).length;
}

export function getWeekDays(anchorIso: string): string[] {
  const anchor = parseISODate(anchorIso);
  const day = anchor.getDay(); // 0 is Sunday
  const sunday = new Date(anchor);
  sunday.setDate(anchor.getDate() - day);

  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(toISODate(d));
  }
  return week;
}

export function getStreakStats(state: AppState, todayIso: string): {
  currentStreak: number;
  bestStreak: number;
  totalCompletedDays: number;
  overallConsistency: number;
  totalDaysInArc: number;
  daysElapsed: number;
  daysRemaining: number;
} {
  const start = parseISODate(START_DATE);
  const end = parseISODate(END_DATE);
  const today = parseISODate(todayIso);

  const totalDaysInArc = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysElapsed = Math.max(1, Math.min(totalDaysInArc, Math.round((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1));
  const daysRemaining = Math.max(0, totalDaysInArc - daysElapsed);

  // Compute history up to today
  const historyDates: string[] = [];
  const curr = new Date(start);
  while (curr <= today && curr <= end) {
    historyDates.push(toISODate(curr));
    curr.setDate(curr.getDate() + 1);
  }

  let totalCompletedDays = 0;
  let totalScoreSum = 0;

  for (const d of historyDates) {
    const count = getCompletedHabitCount(state.days[d], d);
    totalScoreSum += count;
    if (count >= DISCIPLINE_THRESHOLD) { // 5 out of 6 counts as a high-discipline day
      totalCompletedDays++;
    }
  }

  // Calculate current streak backwards from today
  let currentStreak = 0;
  const scan = new Date(today);
  while (scan >= start) {
    const dStr = toISODate(scan);
    const count = getCompletedHabitCount(state.days[dStr], dStr);
    if (count >= DISCIPLINE_THRESHOLD) {
      currentStreak++;
      scan.setDate(scan.getDate() - 1);
    } else {
      // If today is still incomplete, check if yesterday was part of streak
      if (dStr === todayIso && count < DISCIPLINE_THRESHOLD) {
        scan.setDate(scan.getDate() - 1);
        continue;
      }
      break;
    }
  }

  // Calculate best streak
  let bestStreak = 0;
  let rollingStreak = 0;
  for (const d of historyDates) {
    const count = getCompletedHabitCount(state.days[d], d);
    if (count >= DISCIPLINE_THRESHOLD) {
      rollingStreak++;
      if (rollingStreak > bestStreak) bestStreak = rollingStreak;
    } else {
      rollingStreak = 0;
    }
  }

  const overallConsistency = historyDates.length > 0 
    ? Math.round((totalScoreSum / (historyDates.length * TOTAL_HABITS)) * 100) 
    : 0;

  return {
    currentStreak,
    bestStreak,
    totalCompletedDays,
    overallConsistency,
    totalDaysInArc,
    daysElapsed,
    daysRemaining,
  };
}

export function getInitialAppState(): AppState {
  return {
    version: 3,
    days: {},
    dailyTodos: {},
    monthlyObjectives: {},
    notes: {},
  };
}

export function loadStoredState(): AppState {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed && typeof parsed.days === 'object') {
        return migrateState(parsed);
      }
    }

    // Check legacy storage keys from previous version
    for (const key of LEGACY_STORAGE_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        if (parsed) {
          const migrated = migrateLegacyState(parsed);
          saveStoredState(migrated);
          return migrated;
        }
      }
    }
  } catch (err) {
    console.error('Failed to parse local storage state:', err);
  }

  return getInitialAppState();
}

export function saveStoredState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
    return false;
  }
}

function migrateState(raw: any): AppState {
  const result = getInitialAppState();
  if (raw.days && typeof raw.days === 'object') {
    for (const [date, data] of Object.entries(raw.days)) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(date) && typeof data === 'object' && data !== null) {
        result.days[date] = sanitizeDayRecord(data as any);
      }
    }
  }

  if (raw.dailyTodos && typeof raw.dailyTodos === 'object') {
    result.dailyTodos = sanitizeTodos(raw.dailyTodos);
  }

  if (raw.monthlyObjectives && typeof raw.monthlyObjectives === 'object') {
    result.monthlyObjectives = sanitizeTodos(raw.monthlyObjectives);
  } else if (raw.monthlyTodos && typeof raw.monthlyTodos === 'object') {
    result.monthlyObjectives = sanitizeTodos(raw.monthlyTodos);
  }

  if (raw.notes && typeof raw.notes === 'object') {
    for (const [date, note] of Object.entries(raw.notes)) {
      if (typeof note === 'string') {
        result.notes[date] = note.slice(0, 10000);
      }
    }
  }

  return result;
}

function migrateLegacyState(legacy: any): AppState {
  const source = legacy.data || legacy.state || legacy;
  const state = getInitialAppState();

  if (source.days && typeof source.days === 'object') {
    for (const [date, val] of Object.entries(source.days)) {
      if (typeof val === 'object' && val !== null) {
        const v = val as any;
        state.days[date] = {
          steps: Number(v.steps) || 0,
          study: Number(v.study) || 0,
          jobs: Number(v.jobs) || 0,
          workout: Boolean(v.workout),
          discipline: Boolean(v.discipline ?? v.noporn),
          water: Number(v.water) || 0,
          hygiene: Boolean(v.hygiene ?? v.brush),
          ex: typeof v.ex === 'object' && v.ex !== null ? v.ex : {},
          workoutNotes: typeof v.workoutNotes === 'string' ? v.workoutNotes : '',
        };
      }
    }
  }

  if (source.dailyTodos && typeof source.dailyTodos === 'object') {
    state.dailyTodos = sanitizeTodos(source.dailyTodos);
  }

  if (source.monthlyObjectives && typeof source.monthlyObjectives === 'object') {
    state.monthlyObjectives = sanitizeTodos(source.monthlyObjectives);
  } else if (source.monthlyTodos && typeof source.monthlyTodos === 'object') {
    state.monthlyObjectives = sanitizeTodos(source.monthlyTodos);
  }

  if (source.notes && typeof source.notes === 'object') {
    for (const [d, note] of Object.entries(source.notes)) {
      if (typeof note === 'string') {
        state.notes[d] = note.slice(0, 10000);
      }
    }
  }

  return state;
}

function sanitizeDayRecord(raw: any): DayRecord {
  const rec: DayRecord = {
    steps: Number(raw.steps) >= 0 ? Number(raw.steps) : 0,
    study: Number(raw.study) >= 0 ? Number(raw.study) : 0,
    jobs: Number(raw.jobs) >= 0 ? Number(raw.jobs) : 0,
    workout: Boolean(raw.workout),
    discipline: Boolean(raw.discipline ?? raw.noporn),
    water: Number(raw.water) >= 0 ? Number(raw.water) : 0,
    hygiene: Boolean(raw.hygiene ?? raw.brush),
    ex: typeof raw.ex === 'object' && raw.ex !== null ? raw.ex : {},
    workoutNotes: typeof raw.workoutNotes === 'string' ? raw.workoutNotes.slice(0, 1000) : '',
  };
  return rec;
}

function sanitizeTodos(raw: Record<string, any[]>): Record<string, TodoItem[]> {
  const result: Record<string, TodoItem[]> = {};
  for (const [key, list] of Object.entries(raw)) {
    if (!Array.isArray(list)) continue;
    result[key] = list
      .filter(item => item && typeof item === 'object')
      .map((item, idx) => ({
        id: item.id || `todo-${key}-${idx}-${Date.now()}`,
        text: String(item.text || '').slice(0, 300),
        done: Boolean(item.done),
        createdAt: item.createdAt || new Date().toISOString(),
        priority: item.priority || 'medium',
      }));
  }
  return result;
}
