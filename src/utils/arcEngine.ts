import { AppState, DayRecord, HabitDefinition, HabitKey, TodoItem, WorkoutRoutine } from '../types';

export const START_DATE = '2026-09-17';
export const GYM_DATE = '2026-10-05';
export const END_DATE = '2026-12-31';

export const STORAGE_KEY = 'winter_arc_workspace_v2';
const LEGACY_STORAGE_KEYS = [
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
    homeTarget: 7000,
    gymTarget: 10000,
    description: 'Baseline physical activity and metabolic expenditure.',
  },
  {
    key: 'reading',
    label: 'Book Reading',
    category: 'Intellectual',
    unit: 'pages',
    step: 5,
    type: 'number',
    homeTarget: 20,
    gymTarget: 40,
    description: 'Focused non-fiction, philosophy, or domain literature.',
  },
  {
    key: 'study',
    label: 'Deep Work & Study',
    category: 'Intellectual',
    unit: 'hours',
    step: 0.5,
    type: 'number',
    homeTarget: 3,
    gymTarget: 4,
    description: 'Zero-distraction skill development or technical mastery.',
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
    description: 'Optimal cellular hydration and cognitive focus.',
  },
  {
    key: 'sleep',
    label: 'Restorative Sleep',
    category: 'Recovery',
    unit: 'hours',
    step: 0.5,
    type: 'number',
    homeTarget: 7,
    gymTarget: 7,
    description: 'Consistent sleep window aiming for 7–9 hours recovery.',
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
  {
    key: 'hygiene',
    label: 'Oral Hygiene (2×)',
    category: 'Discipline',
    unit: 'done',
    step: 1,
    type: 'check',
    homeTarget: 1,
    gymTarget: 1,
    description: 'Morning and night dental hygiene routines completed.',
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
    description: 'Strict zero adult content / porn abstinence, preserving neural focus.',
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
    description: 'Completed scheduled Home PPL session or gym workout.',
  },
];

export const WORKOUT_ROUTINES: Record<string, WorkoutRoutine> = {
  'Push A': {
    id: 'push-a',
    title: 'Push A // Chest, Shoulders, Triceps',
    subtitle: 'Foundation Home Hypertrophy',
    type: 'push',
    exercises: [
      { name: 'Standard Push-ups', setsReps: '3 × 8–15 reps', target: 'Chest / Triceps', cues: 'Full lock at top, slow 2-sec eccentric.' },
      { name: 'Pike Push-ups', setsReps: '3 × 6–12 reps', target: 'Anterior Deltoids / Upper Chest', cues: 'Elevate hips, head moves forward of hands.' },
      { name: 'Diamond Push-ups', setsReps: '2 × 6–12 reps', target: 'Triceps Lateral Head', cues: 'Hands under sternum, elbows tucked at 45°.' },
      { name: 'Chair Dips', setsReps: '2 × 8–15 reps', target: 'Triceps / Lower Chest', cues: 'Keep torso upright, 90° elbow bend.' },
    ],
    focusNotes: 'Leave 1–2 reps in reserve on early sets. Focus on chest tension and full range of motion.',
  },
  'Pull A': {
    id: 'pull-a',
    title: 'Pull A // Back, Rear Delts, Biceps',
    subtitle: 'Foundation Home Pulling Strength',
    type: 'pull',
    exercises: [
      { name: 'Weighted Backpack Rows', setsReps: '3 × 10–15 reps', target: 'Lats / Mid Traps', cues: 'Hinge at 45°, drive elbows back towards hips.' },
      { name: 'Backpack Bicep Curls', setsReps: '3 × 10–15 reps', target: 'Biceps Brachii', cues: 'Supinate at top, strict posture without swing.' },
      { name: 'Reverse Snow Angels', setsReps: '3 × 10–15 reps', target: 'Rear Delts / Scapular Stabilizers', cues: 'Prone on floor, hover arms throughout.' },
      { name: 'Bent-over Rear Delt Fly', setsReps: '2 × 12–15 reps', target: 'Posterior Deltoids', cues: 'Light weight or books, squeeze upper back.' },
    ],
    focusNotes: 'Prioritize scapular retraction before elbow pull. Maintain neutral spine during hinges.',
  },
  'Legs A': {
    id: 'legs-a',
    title: 'Legs A // Quads, Hamstrings, Core',
    subtitle: 'Lower Body Strength & Density',
    type: 'legs',
    exercises: [
      { name: 'Tempo Bodyweight Squats', setsReps: '3 × 12–20 reps', target: 'Quadriceps / Glutes', cues: '3-second descent, drive knees over toes.' },
      { name: 'Alternating Reverse Lunges', setsReps: '3 × 8–12 / leg', target: 'Quads / Glute Medius', cues: '90° angles at bottom, drive through front heel.' },
      { name: 'Backpack Romanian Deadlift', setsReps: '3 × 10–15 reps', target: 'Hamstrings / Erector Spinae', cues: 'Push hips backward until deep hamstring stretch.' },
      { name: 'Single-Leg Calf Raises', setsReps: '3 × 15–25 reps', target: 'Gastrocnemius / Soleus', cues: 'Full stretch on stair ledge, 1s peak hold.' },
      { name: 'Standard Core Plank', setsReps: '3 × 30–60 sec', target: 'Transverse Abdominis', cues: 'Squeeze glutes, push floor away through forearms.' },
    ],
    focusNotes: 'Control the descent on every single rep. Legs respond exceptionally well to high tension.',
  },
  'Push B': {
    id: 'push-b',
    title: 'Push B // Upper Chest & Shoulders',
    subtitle: 'Overhead & Incline Focus',
    type: 'push',
    exercises: [
      { name: 'Decline Push-ups (Feet on Bed/Chair)', setsReps: '3 × 6–12 reps', target: 'Clavicular Upper Chest', cues: 'Core braced tight, descend controlled.' },
      { name: 'Pike Push-ups', setsReps: '3 × 6–12 reps', target: 'Shoulders / Overhead', cues: 'Keep eyes on toes, push straight back.' },
      { name: 'Wide-Stance Push-ups', setsReps: '2 × 10–15 reps', target: 'Sternal Pectorals', cues: 'Wider than shoulders, flare elbows slightly.' },
      { name: 'Chair Dips', setsReps: '2 × 8–15 reps', target: 'Triceps', cues: 'Controlled descent, explode upward.' },
    ],
    focusNotes: 'Higher angle for push-ups activates clavicular fibers. Keep scapula moving naturally.',
  },
  'Pull B': {
    id: 'pull-b',
    title: 'Pull B // Unilateral Lats & Upper Back',
    subtitle: 'Balanced Upper Body Symmetry',
    type: 'pull',
    exercises: [
      { name: 'Two-Arm Backpack Rows', setsReps: '3 × 10–15 reps', target: 'Rhomboids / Lats', cues: 'Pause 1 second at peak contraction.' },
      { name: 'One-Arm Supported Backpack Row', setsReps: '3 × 8–12 / side', target: 'Isolated Latissimus Dorsi', cues: 'One hand on desk, pull dumbbell/pack to pocket.' },
      { name: 'Backpack Hammer Curls', setsReps: '3 × 10–15 reps', target: 'Brachialis / Forearms', cues: 'Neutral grip with backpack straps, steady control.' },
      { name: 'Prone Y-T-W Raises', setsReps: '2 × 10–15 reps', target: 'Lower Traps / Rear Delts', cues: 'Thumbs pointing to ceiling, slow pulses.' },
    ],
    focusNotes: 'Unilateral movements fix side imbalances. Focus intensely on muscle contraction.',
  },
  'Legs B': {
    id: 'legs-b',
    title: 'Legs B // Posterior Chain & Glutes',
    subtitle: 'Hip Dominance & Core Stability',
    type: 'legs',
    exercises: [
      { name: 'Bulgarian Split Squats (Foot Elevated)', setsReps: '3 × 8–12 / leg', target: 'Quads / Glutes', cues: 'Slight forward lean, drop back knee down.' },
      { name: 'Elevated Glute Bridges', setsReps: '3 × 12–20 reps', target: 'Glutes / Hamstrings', cues: 'Drive heels into floor or sofa, lock out hips.' },
      { name: 'Backpack Good Mornings', setsReps: '3 × 10–15 reps', target: 'Hamstrings / Lower Back', cues: 'Pack hugged to chest, hip hinge with soft knees.' },
      { name: 'Double-Leg Calf Raises', setsReps: '3 × 20–25 reps', target: 'Calves', cues: 'Explosive up, 3-second descent.' },
      { name: 'Dead Bug Holds / Reps', setsReps: '3 × 8–12 / side', target: 'Anterior Core / Pelvic Stability', cues: 'Lower back pinned firmly to the floor throughout.' },
    ],
    focusNotes: 'Split squats are brutally effective; breathe rhythmically and embrace the burn.',
  },
  'Active Recovery': {
    id: 'recovery',
    title: 'Active Recovery // Mobility & Reset',
    subtitle: 'Restoration & Parasympathetic Recovery',
    type: 'recovery',
    exercises: [
      { name: 'Brisk Outdoor Walk', setsReps: '30–45 mins', target: 'Aerobic Base / Zone 1', cues: 'Nasal breathing, natural arm swing, sunlight exposure.' },
      { name: 'Hip Flexor & Hamstring Stretch', setsReps: '2 × 60 sec / side', target: 'Hip Mobility', cues: 'Deep calm diaphragmatic breathing, no bouncing.' },
      { name: 'Thoracic Extension & Cat-Cow', setsReps: '2 × 15 reps', target: 'Spine Decompression', cues: 'Synchronize movement with full exhalations.' },
      { name: 'Shoulder Dislocates / Broomstick', setsReps: '2 × 12 reps', target: 'Scapulohumeral Rhythm', cues: 'Gentle arc overhead, open chest.' },
    ],
    focusNotes: 'Recovery is an active discipline. Hydrate, stretch, and let nervous system rebuild.',
  },
  'Gym Session': {
    id: 'gym-session',
    title: 'Gym Session // Free Weight & Machine Protocol',
    subtitle: 'Expansion Phase Progressive Overload',
    type: 'gym',
    exercises: [
      { name: 'Primary Compound Lift', setsReps: '3–4 × 6–10 reps', target: 'Squat / Bench / Deadlift / OHP', cues: 'Log exact weight and reps. Rest 2–3 minutes.' },
      { name: 'Secondary Accessory Lift', setsReps: '3 × 8–12 reps', target: 'Target Muscle Group', cues: 'Focus on clean eccentric tempo.' },
      { name: 'Unilateral / Machine Work', setsReps: '3 × 10–15 reps', target: 'Hypertrophy / Isolation', cues: 'Maintain strict form through entire rep range.' },
      { name: 'Finisher / Core Protocol', setsReps: '2–3 sets to near failure', target: 'Metabolic Conditioning', cues: 'Leave nothing in the tank on final set.' },
    ],
    focusNotes: 'Expansion phase target: 4 high-quality gym sessions per week. Prioritize progressive overload.',
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

export function getWorkoutRoutineForDate(iso: string): WorkoutRoutine {
  const phase = getPhase(iso);
  if (phase === 'gym') {
    return WORKOUT_ROUTINES['Gym Session'];
  }
  
  // Home PPL Day of Week mapping
  const d = parseISODate(iso);
  const dayOfWeek = d.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  
  switch (dayOfWeek) {
    case 1: return WORKOUT_ROUTINES['Push A'];
    case 2: return WORKOUT_ROUTINES['Pull A'];
    case 3: return WORKOUT_ROUTINES['Legs A'];
    case 4: return WORKOUT_ROUTINES['Push B'];
    case 5: return WORKOUT_ROUTINES['Pull B'];
    case 6: return WORKOUT_ROUTINES['Legs B'];
    case 0:
    default:
      return WORKOUT_ROUTINES['Active Recovery'];
  }
}

export function getDayTargets(iso: string): Record<HabitKey, number> {
  const isHome = getPhase(iso) === 'home';
  return {
    steps: isHome ? 7000 : 10000,
    reading: isHome ? 20 : 40,
    study: isHome ? 3 : 4,
    water: 3,
    sleep: 7,
    jobs: 5,
    hygiene: 1,
    discipline: 1,
    workout: 1,
  };
}

export function isHabitComplete(key: HabitKey, day: DayRecord | undefined, iso: string): boolean {
  if (!day) return false;
  const targets = getDayTargets(iso);

  switch (key) {
    case 'steps':
      return (day.steps || 0) >= targets.steps;
    case 'reading':
      return (day.reading || 0) >= targets.reading;
    case 'study':
      return (day.study || 0) >= targets.study;
    case 'water':
      return (day.water || 0) >= targets.water;
    case 'sleep':
      // Healthy sleep threshold: 6.5 - 9.5 hours
      return (day.sleep || 0) >= 6.5;
    case 'jobs':
      return (day.jobs || 0) >= targets.jobs;
    case 'hygiene':
      return day.hygiene === true;
    case 'discipline':
      return day.discipline === true;
    case 'workout':
      if (getPhase(iso) === 'home') {
        const routine = getWorkoutRoutineForDate(iso);
        if (routine.type === 'recovery') return true; // recovery day is automatically completed
        const ex = day.ex || {};
        return routine.exercises.length > 0 && routine.exercises.every((_, i) => ex[i] === true);
      }
      return day.workout === true;
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
    if (count >= 7) { // 7 out of 9 counts as a high-discipline day
      totalCompletedDays++;
    }
  }

  // Calculate current streak backwards from today
  let currentStreak = 0;
  const scan = new Date(today);
  while (scan >= start) {
    const dStr = toISODate(scan);
    const count = getCompletedHabitCount(state.days[dStr], dStr);
    if (count >= 7) {
      currentStreak++;
      scan.setDate(scan.getDate() - 1);
    } else {
      // If today is still incomplete, check if yesterday was part of streak
      if (dStr === todayIso && count < 7) {
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
    if (count >= 7) {
      rollingStreak++;
      if (rollingStreak > bestStreak) bestStreak = rollingStreak;
    } else {
      rollingStreak = 0;
    }
  }

  const overallConsistency = historyDates.length > 0 
    ? Math.round((totalScoreSum / (historyDates.length * 9)) * 100) 
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
    version: 2,
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
  const source = legacy.data || legacy;
  const state = getInitialAppState();

  if (source.days && typeof source.days === 'object') {
    for (const [date, val] of Object.entries(source.days)) {
      if (typeof val === 'object' && val !== null) {
        const v = val as any;
        state.days[date] = {
          steps: Number(v.steps) || 0,
          reading: Number(v.pages) || 0,
          study: Number(v.study) || 0,
          water: Number(v.water) || 0,
          sleep: Number(v.sleep) || 0,
          jobs: Number(v.jobs) || 0,
          hygiene: Boolean(v.brush),
          discipline: Boolean(v.noporn),
          workout: Boolean(v.workout),
          ex: typeof v.ex === 'object' && v.ex !== null ? v.ex : {},
          workoutNotes: typeof v.workoutNotes === 'string' ? v.workoutNotes : '',
        };
      }
    }
  }

  if (source.dailyTodos && typeof source.dailyTodos === 'object') {
    state.dailyTodos = sanitizeTodos(source.dailyTodos);
  }

  if (source.monthlyTodos && typeof source.monthlyTodos === 'object') {
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
    reading: Number(raw.reading ?? raw.pages) >= 0 ? Number(raw.reading ?? raw.pages) : 0,
    study: Number(raw.study) >= 0 ? Number(raw.study) : 0,
    water: Number(raw.water) >= 0 ? Number(raw.water) : 0,
    sleep: Number(raw.sleep) >= 0 ? Number(raw.sleep) : 0,
    jobs: Number(raw.jobs) >= 0 ? Number(raw.jobs) : 0,
    hygiene: Boolean(raw.hygiene ?? raw.brush),
    discipline: Boolean(raw.discipline ?? raw.noporn),
    workout: Boolean(raw.workout),
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
