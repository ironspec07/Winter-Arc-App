import { AppState, DayRecord, HabitDefinition, HabitKey, TodoItem, WorkoutRoutine } from '../types';

export const START_DATE = '2026-11-01';
export const GYM_DATE = '2026-11-01';
export const END_DATE = '2026-12-31';

export const TOTAL_HABITS = 5;
export const DISCIPLINE_THRESHOLD = 4;

export const STORAGE_KEY = 'winter_arc_workspace_nov_v1';
const LEGACY_STORAGE_KEYS = [
  'winter_arc_workspace_v3',
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
    description: 'Baseline physical activity and metabolic expenditure.',
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
    key: 'study',
    label: 'Study',
    category: 'Intellectual',
    unit: 'hours',
    step: 0.5,
    type: 'number',
    homeTarget: 4,
    gymTarget: 4,
    description: 'Zero-distraction deep work, skill development, or technical mastery.',
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
    description: 'Complete scheduled daily lifting or conditioning routine (Sunday rest).',
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
    description: 'Proactive career outreach, submissions, or networking.',
  },
];

export const WORKOUT_ROUTINES: Record<string, WorkoutRoutine> = {
  'Monday: Chest + Triceps + Core (A)': {
    id: 'mon-chest-triceps-core',
    title: 'Monday // Chest + Triceps + Core (A)',
    subtitle: 'Mid/Lower Chest, Upper Chest & Tricep Hypertrophy',
    type: 'strength',
    exercises: [
      { name: 'Flat Barbell Bench Press', setsReps: '3 sets × 6–8 reps', target: 'Mid/Lower Chest', cues: 'Retract scapulae, drive feet into the floor, bar touches lower chest with power.' },
      { name: 'Incline Dumbbell Press', setsReps: '3 sets × 8–10 reps', target: 'Upper Chest', cues: '30° incline bench, slight elbow tuck, deep stretch at bottom.' },
      { name: 'Cable Crossovers / Pec Fly', setsReps: '3 sets × 10–12 reps', target: 'Chest Stretch & Inner Line', cues: 'Slight bend in elbows, full stretch on negative, squeeze pecs hard at midline.' },
      { name: 'Overhead Dumbbell Extension', setsReps: '3 sets × 10–12 reps', target: 'Tricep Long Head', cues: 'Keep elbows tucked near ears, controlled full stretch behind neck.' },
      { name: 'Tricep Rope Pushdowns', setsReps: '3 sets × 12–15 reps', target: 'Tricep Lateral & Medial Heads', cues: 'Flay rope apart at bottom lockout, eliminate torso swinging.' },
      { name: 'Hanging Leg Raises', setsReps: '3 sets × 12–15 reps', target: 'Lower Abs', cues: 'Eliminate momentum, curl pelvis up toward ribcage, control descent.' },
      { name: 'Crunches', setsReps: '3 sets × 15 reps', target: 'Upper Abs', cues: 'Exhale fully at top, pause and squeeze upper abdominals.' },
    ],
    focusNotes: 'Chest & triceps power session. Rest 90–120s between compound presses, 60–75s on isolation.',
  },
  'Tuesday: Back + Biceps + Forearms (A)': {
    id: 'tue-back-biceps-forearms',
    title: 'Tuesday // Back + Biceps + Forearms (A)',
    subtitle: 'Lat Width, Mid-Back Thickness & Arm Density',
    type: 'strength',
    exercises: [
      { name: 'Lat Pulldown (Wide Grip)', setsReps: '3 sets × 8–10 reps', target: 'Lat Width', cues: 'Drive elbows down and back to hips, slight chest lean back, squeeze lats.' },
      { name: 'Bent-Over Barbell Row', setsReps: '3 sets × 8–10 reps', target: 'Mid-Back Thickness', cues: 'Hinged at 45°, pull bar toward belly button, squeeze rhomboids.' },
      { name: 'Seated Cable Row (Close Grip)', setsReps: '3 sets × 10–12 reps', target: 'Lower Lat Sweep', cues: 'Chest high, pull handles to lower abdomen, deep stretch forward.' },
      { name: 'Incline Dumbbell Curls', setsReps: '3 sets × 10–12 reps', target: 'Bicep Long Head / Outer Peak', cues: 'Incline bench, keep arms back for deep bicep stretch, supinate at top.' },
      { name: 'EZ-Bar Preacher Curls', setsReps: '3 sets × 10–12 reps', target: 'Bicep Short Head / Inner Thickness', cues: 'Armpits flush on pad, strict isolation with no rocking.' },
      { name: 'Dumbbell Hammer Curls', setsReps: '3 sets × 12–15 reps', target: 'Brachialis & Forearms', cues: 'Neutral palms, controlled tempo up and down, build arm thickness.' },
      { name: 'Wrist Curls', setsReps: '3 sets × 15 reps', target: 'Forearms', cues: 'Forearms rested on bench/knees, full flexion and extension at wrist.' },
    ],
    focusNotes: 'Back pulling strength. Focus on elbow drive rather than hand pulling to maximize back activation.',
  },
  'Wednesday: Shoulders + Core (B)': {
    id: 'wed-shoulders-core',
    title: 'Wednesday // Shoulders + Core (B)',
    subtitle: '3D Delts, Lateral Width & Core Stability',
    type: 'strength',
    exercises: [
      { name: 'Seated Overhead Dumbbell Press', setsReps: '3 sets × 8–10 reps', target: 'Front Delts', cues: 'Press overhead smoothly, palms facing slightly inward, brace core.' },
      { name: 'Dumbbell Lateral Raises', setsReps: '4 sets × 12–15 reps', target: 'Side Delts / Width', cues: 'Lead with elbows, slight forward torso tilt, control the eccentric descent.' },
      { name: 'Face Pulls', setsReps: '3 sets × 12–15 reps', target: 'Rear Delts & Rotator Cuff', cues: 'Rope to eye level, pull apart and rotate hands outward to external rotation.' },
      { name: 'Dumbbell Shrugs', setsReps: '3 sets × 12–15 reps', target: 'Upper Traps', cues: 'Straight vertical shrug toward ears, pause 1s at top, avoid rolling shoulders.' },
      { name: 'Reverse Flyes (Dumbbell or Machine)', setsReps: '3 sets × 12–15 reps', target: 'Rear Delts', cues: 'Arms wide, squeeze rear delts, keep traps relaxed.' },
      { name: 'Plank Hold', setsReps: '3 sets × 45–60 sec', target: 'Deep Core / Transverse Abdominis', cues: 'Brace abs, squeeze glutes, keep spine completely neutral.' },
      { name: 'Cable Crunches', setsReps: '3 sets × 12–15 reps', target: 'Upper Abs', cues: 'Kneel down, curl ribcage toward hips using abs, avoid sitting back on heels.' },
    ],
    focusNotes: 'Deltoid hypertrophy day. Strict form with controlled tempo produces boulder shoulders.',
  },
  'Thursday: Chest + Triceps (B)': {
    id: 'thu-chest-triceps',
    title: 'Thursday // Chest + Triceps (B)',
    subtitle: 'Upper Clavicular Head & Tricep Medial Focus',
    type: 'strength',
    exercises: [
      { name: 'Incline Barbell Bench Press', setsReps: '3 sets × 6–8 reps', target: 'Upper Chest Focus', cues: 'Bar touches upper collarbone line, drive straight upward with explosive power.' },
      { name: 'Flat Dumbbell Press', setsReps: '3 sets × 8–10 reps', target: 'Mid-Chest Hypertrophy', cues: 'Full deep stretch at bottom, press and converge dumbbell heads at top.' },
      { name: 'Low-to-High Cable Flyes', setsReps: '3 sets × 10–12 reps', target: 'Upper Chest Adduction', cues: 'Pulleys set low, scoop upward to sternum height and squeeze upper chest.' },
      { name: 'Cable High Pulley Overhead Extension', setsReps: '3 sets × 8–10 reps', target: 'Tricep Long Head Stretch & Mass', cues: 'High pulley facing away, extend elbows fully forward, deep overhead stretch.' },
      { name: 'Single-Arm Reverse Grip Cable Pushdown', setsReps: '3 sets × 12–15 reps', target: 'Tricep Medial Head Focus', cues: 'Underhand palm-up grip, lock elbow in place, squeeze lockout.' },
    ],
    focusNotes: 'Upper chest volume. Emphasize full contraction on all cable movements.',
  },
  'Friday: Back + Biceps + Forearms (B)': {
    id: 'fri-back-biceps-forearms',
    title: 'Friday // Back + Biceps + Forearms (B)',
    subtitle: 'Rhomboid Power, Bicep Mass & Grip Strength',
    type: 'strength',
    exercises: [
      { name: 'Chest-Supported Row (or T-Bar Row)', setsReps: '3 sets × 8–10 reps', target: 'Unilateral Back Power / Zero Lower Back Fatigue', cues: 'Chest anchored to pad, pull hard with lats and rhomboids, squeeze mid-back.' },
      { name: 'Neutral-Grip Lat Pulldown', setsReps: '3 sets × 10–12 reps', target: 'Lats & Rhomboids', cues: 'Parallel handles, drive elbows downward, full lat contraction.' },
      { name: 'Romanian Deadlifts (RDLs) or Good Mornings', setsReps: '3 sets × 10–12 reps', target: 'Posterior Chain / Lower Back Erectors & Glutes', cues: 'Hinge back at hips, slight knee bend, flat neutral spine, feel deep hamstring and glute stretch.' },
      { name: 'Standing Barbell Bicep Curls', setsReps: '3 sets × 8–10 reps', target: 'Overall Bicep Mass', cues: 'Shoulders back, no hip swinging, curl with strict bicep tension.' },
      { name: 'Concentration Curls', setsReps: '3 sets × 12–15 reps', target: 'Peak Contraction', cues: 'Elbow pinned against inner thigh, isolate bicep peak contraction.' },
      { name: 'Reverse Barbell Curls', setsReps: '3 sets × 12–15 reps', target: 'Forearms & Brachioradialis', cues: 'Overhand grip, builds upper forearm and wrist stability.' },
    ],
    focusNotes: 'Upper body pulling synergy. Lock in your grip and control every negative.',
  },
  'Saturday: Legs + Core (C)': {
    id: 'sat-legs-core',
    title: 'Saturday // Legs + Core (C)',
    subtitle: 'Quad Dominance, Posterior Chain & Spine Protection',
    type: 'strength',
    exercises: [
      { name: 'Hack Squat', setsReps: '3 sets × 8–10 reps', target: 'Quads & Glutes', cues: 'Feet shoulder-width, hit parallel depth, drive through mid-foot.' },
      { name: 'Leg Press', setsReps: '3 sets × 10–12 reps', target: 'Quad Volume', cues: 'Lower until 90° knee angle, push through full foot, do not hyperextend knees.' },
      { name: 'Seated or Lying Leg Curls', setsReps: '3 sets × 10–12 reps', target: 'Hamstrings', cues: 'Smooth rhythmic pull, hold 1s at full flexion.' },
      { name: 'Leg Extensions', setsReps: '3 sets × 10–12 reps', target: 'Quad Isolation', cues: 'Pause at top extension, slow 2-second negative descent.' },
      { name: 'Standing Calf Raises', setsReps: '4 sets × 15 reps', target: 'Calves', cues: 'Full ankle stretch at bottom, explosive rise on big toe, hold 1s at top.' },
      { name: 'Standing High-To-Low Cable Crunches', setsReps: '3 sets × 12–15 reps', target: 'Upper & Middle Abs Core Flexion', cues: 'High cable rope attachment, brace hips, curl ribcage downward toward pelvis with intense core contraction.' },
      { name: 'Light Cable Woodchoppers', setsReps: '2 sets × 12 reps / side', target: 'Waist-Safe Rotational Oblique Control', cues: 'Rotate from torso and hips smoothly, avoid excessive lumbar twist.' },
    ],
    focusNotes: 'Leg day foundation. Build explosive wheels and maintain unbreakable core bracing.',
  },
  'Sunday: Complete Rest': {
    id: 'sun-complete-rest',
    title: 'Sunday // Complete Rest & Physiological Reset',
    subtitle: 'Zero Training · Full Nervous System & Muscle Restoration',
    type: 'rest',
    exercises: [],
    focusNotes: 'Sunday is OFF. No workout required. Sleep deeply, nourish your body, and prepare mentally to crush Monday chest & triceps.',
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

export function getPhase(_iso: string): 'home' | 'gym' {
  return 'gym';
}

export function getWorkoutRoutineForDate(iso: string): WorkoutRoutine {
  const d = parseISODate(iso);
  const dayOfWeek = d.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  
  switch (dayOfWeek) {
    case 1: return WORKOUT_ROUTINES['Monday: Chest + Triceps + Core (A)'];
    case 2: return WORKOUT_ROUTINES['Tuesday: Back + Biceps + Forearms (A)'];
    case 3: return WORKOUT_ROUTINES['Wednesday: Shoulders + Core (B)'];
    case 4: return WORKOUT_ROUTINES['Thursday: Chest + Triceps (B)'];
    case 5: return WORKOUT_ROUTINES['Friday: Back + Biceps + Forearms (B)'];
    case 6: return WORKOUT_ROUTINES['Saturday: Legs + Core (C)'];
    case 0:
    default:
      return WORKOUT_ROUTINES['Sunday: Complete Rest'];
  }
}

export function getDayTargets(iso: string): Record<HabitKey, number> {
  const d = parseISODate(iso);
  const isSunday = d.getDay() === 0;

  return {
    steps: isSunday ? 0 : 10000,
    discipline: 1,
    study: 4,
    workout: isSunday ? 0 : 1,
    jobs: 5,
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
    case 'discipline':
      return day.discipline === true;
    case 'study':
      return (day.study || 0) >= targets.study;
    case 'workout':
      if (isSunday) return true; // Sunday is off
      if (day.workout === true) return true;
      // Also automatically satisfied if all exercises for today's routine are checked
      const routine = getWorkoutRoutineForDate(iso);
      if (routine.exercises.length > 0 && day.ex) {
        return routine.exercises.every((_, i) => day.ex?.[i] === true);
      }
      return false;
    case 'jobs':
      return (day.jobs || 0) >= targets.jobs;
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
    if (count >= DISCIPLINE_THRESHOLD) {
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
    version: 4,
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
          discipline: Boolean(v.discipline ?? v.noporn),
          study: Number(v.study) || 0,
          workout: Boolean(v.workout),
          jobs: Number(v.jobs) || 0,
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
    discipline: Boolean(raw.discipline ?? raw.noporn),
    study: Number(raw.study) >= 0 ? Number(raw.study) : 0,
    workout: Boolean(raw.workout),
    jobs: Number(raw.jobs) >= 0 ? Number(raw.jobs) : 0,
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
