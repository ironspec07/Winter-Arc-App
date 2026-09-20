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
  'Strength A': {
    id: 'strength-a',
    title: 'Strength A // Upper Body',
    subtitle: 'Chest, Back, Delts & Biceps',
    type: 'strength',
    exercises: [
      { name: 'Push-ups', setsReps: '3 × 8–15', target: 'Chest / Triceps / Core', cues: 'Full lock at top, slow controlled eccentric descent.' },
      { name: 'Dumbbell Rows', setsReps: '3 × 12–20 / side', target: 'Lats / Rhomboids', cues: 'Hinge at hips, pull dumbbell towards hip pocket.' },
      { name: 'Pike Push-ups', setsReps: '3 × 6–12', target: 'Anterior Deltoids / Shoulders', cues: 'Elevate hips, head tracks slightly forward of hands.' },
      { name: 'Dumbbell Reverse Fly', setsReps: '3 × 12–20', target: 'Rear Delts / Scapular Stabilizers', cues: 'Squeeze upper back at top, controlled lower.' },
      { name: 'Dumbbell Biceps Curl', setsReps: '2 × 12–20', target: 'Biceps Brachii', cues: 'Strict form, no swinging, full elbow extension.' },
      { name: 'Plank', setsReps: '3 × 30–60 sec', target: 'Transverse Abdominis / Core', cues: 'Brace core, squeeze glutes, steady breathing.' },
    ],
    focusNotes: 'Rest: 60–90 sec between sets. Prioritize strict range of motion and form over tempo.',
  },
  'Aerobic Conditioning': {
    id: 'aerobic-conditioning',
    title: 'Aerobic Conditioning // Zone 2 Foundation',
    subtitle: 'Cardiovascular Base & Aerobic Capacity',
    type: 'aerobic',
    exercises: [
      { name: 'Warm-up: March in place (60s), Arm circles (30s), Hip rotations (30s), Step-ups (2m), Easy movement (1m)', setsReps: '1 round', target: 'Full Body Dynamic Mobilization', cues: 'Smooth rhythmic motion, gradual heart rate elevation.' },
      { name: 'Step-ups', setsReps: '4 rounds × 60 sec', target: 'Aerobic Engine / Quads & Glutes', cues: 'Consistent cadence, push through full foot.' },
      { name: 'Marching High Knees', setsReps: '4 rounds × 60 sec', target: 'Cardio Endurance / Hip Flexors', cues: 'Drive knees to hip height, pump arms rhythmically.' },
      { name: 'Bodyweight Squats', setsReps: '4 rounds × 15 reps', target: 'Lower Body Endurance', cues: 'Continuous steady pace, full depth without stopping.' },
      { name: 'Low-impact Mountain Climbers', setsReps: '4 rounds × 45 sec', target: 'Aerobic Core & Conditioning', cues: 'Controlled foot taps, steady breathing cadence.' },
      { name: 'Active Recovery / Easy Walking', setsReps: '4 rounds × 60 sec', target: 'Inter-round Recovery', cues: 'Deep nasal inhalations, lower heart rate.' },
      { name: 'Cooldown: Easy Walking', setsReps: '5–10 min', target: 'Parasympathetic Transition', cues: 'Slow, relaxed breathing, gentle arm movement.' },
    ],
    focusNotes: 'Main workout: 4 rounds with 60 sec easy walking between rounds. Intensity: ~5–6/10 (Zone 2/conversational).',
  },
  'Strength B': {
    id: 'strength-b',
    title: 'Strength B // Lower Body',
    subtitle: 'Quads, Hamstrings, Glutes & Core',
    type: 'strength',
    exercises: [
      { name: 'Bodyweight Squats', setsReps: '3 × 15–25', target: 'Quadriceps / Glutes', cues: 'Hit parallel or below, drive up with authority.' },
      { name: 'Reverse Lunges', setsReps: '3 × 8–12 / leg', target: 'Quads / Glute Medius', cues: '90° knee angles, push through front mid-foot.' },
      { name: 'DB Romanian Deadlift', setsReps: '3 × 12–20', target: 'Hamstrings / Glutes / Lower Back', cues: 'Hip hinge, soft knees, deep stretch in hamstrings.' },
      { name: 'Glute Bridges', setsReps: '3 × 15–25', target: 'Glutes / Posterior Chain', cues: 'Drive through heels, squeeze glutes at lockout.' },
      { name: 'Standing Calf Raises', setsReps: '3 × 15–25', target: 'Gastrocnemius / Soleus', cues: 'Pause 1 sec at peak contraction, controlled lowering.' },
      { name: 'Bird Dog', setsReps: '3 × 8–12 / side', target: 'Core Stability / Posterior Chain', cues: 'Opposite arm and leg reach, keep spine neutral.' },
    ],
    focusNotes: 'Rest: 60–90 sec between sets. Lower body builds the athletic engine.',
  },
  'Athletic Conditioning': {
    id: 'athletic-conditioning',
    title: 'Athletic Conditioning // Explosive Power & Agility',
    subtitle: 'Dynamic Speed, Agility & Core Power',
    type: 'conditioning',
    exercises: [
      { name: 'Dynamic Warm-up (Ankles, Hips, Torso, Light Jogging)', setsReps: '5–7 min', target: 'Dynamic Preparation', cues: 'Gradual ramp up, prime joints and tendons.' },
      { name: 'Jump Rope or Line Hops', setsReps: '3–4 × 45–60 sec', target: 'Elasticity / Ankle Stiffness / Footwork', cues: 'Light and bouncy on balls of feet.' },
      { name: 'Shadow Bowling / Fielding Drills', setsReps: '3–4 rounds × 60 sec', target: 'Rotational Power & Movement Dynamics', cues: 'Crisp explosive execution, mimic match rhythm.' },
      { name: 'Lateral Shuffles / Shuttle Runs', setsReps: '4 × 20–30 sec', target: 'Deceleration & Lateral Quickness', cues: 'Low center of gravity, fast direction changes.' },
      { name: 'Explosive Bodyweight Squat Jumps', setsReps: '3 × 6–10', target: 'Lower Body Rate of Force Development', cues: 'Land softly, immediately coil for next rep.' },
      { name: 'Rotational Core Protocol (Russian Twists / Planks)', setsReps: '3 × 12–15 / side', target: 'Obliques / Anti-Rotation Strength', cues: 'Controlled torso twist, brace abs tightly.' },
    ],
    focusNotes: 'Rest: 60–90 sec between sets. Move with fast athletic intent, snappy feet, and crisp form.',
  },
  'Strength C': {
    id: 'strength-c',
    title: 'Strength C // Full Body Power & Balance',
    subtitle: 'Compound Synergy & Total Conditioning',
    type: 'strength',
    exercises: [
      { name: 'Push-ups / Diamond Push-ups', setsReps: '3 × 8–12', target: 'Upper Body Press / Triceps', cues: 'Chest to deck, crisp lockout at top.' },
      { name: 'Single-Arm DB Rows', setsReps: '3 × 10–15 / side', target: 'Lats / Mid Back', cues: 'Full stretch at bottom, elbow tucked to ribcage.' },
      { name: 'Goblet Squats / Split Squats', setsReps: '3 × 10–15', target: 'Quads / Core Stability', cues: 'Torso upright, drive knees outward over toes.' },
      { name: 'Single-Leg RDL / Hip Thrusts', setsReps: '3 × 10–12 / side', target: 'Hamstrings / Glute Hypertrophy', cues: 'Hinge smoothly, stabilize through ankle and hip.' },
      { name: 'Overhead DB Press / Pike Press', setsReps: '3 × 8–12', target: 'Deltoids / Traps', cues: 'Press overhead smoothly without hyperextending back.' },
      { name: 'Hanging Knee Raises / Dead Bug', setsReps: '3 × 10–15', target: 'Anterior Core Compression', cues: 'Prevent pelvis tilt, drive with lower abs.' },
    ],
    focusNotes: 'Rest: 60–90 sec between sets. Full-body stimulation priming athletic capability for weekend play.',
  },
  'Cricket': {
    id: 'cricket',
    title: 'Cricket // Match Day & Athletic Play',
    subtitle: 'Bowling, Batting, Fielding & Game Conditioning',
    type: 'sport',
    exercises: [
      { name: 'Match Play / Training Session', setsReps: 'Full Session', target: 'Match Play / Batting, Bowling & Fielding', cues: 'Stay loose, compete hard, communicate well on field.' },
      { name: 'Pre-Match Mobility & Dynamic Warm-up', setsReps: '10–15 min', target: 'Rotator Cuff, Hamstrings & Thoracic Spine', cues: 'Band work, arm swings, high knees, running buildup.' },
      { name: 'Post-Match Cool Down & Hamstring/Hip Stretch', setsReps: '10 min', target: 'Joint Decompression & Lactic Clearance', cues: 'Static stretches held for 30–45 sec, rehydrate.' },
    ],
    focusNotes: 'Match intensity. Hydrate with electrolytes, stay mentally sharp between overs, enjoy the game.',
  },
  'Complete Rest': {
    id: 'complete-rest',
    title: 'Sunday // Complete Rest & Mental Reset',
    subtitle: 'Zero Training · Full Physiological Restoration',
    type: 'rest',
    exercises: [],
    focusNotes: 'Complete rest day. No workout, no step requirement. Sleep well, nourish your body, hydrate, and prepare mentally for the week ahead.',
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
  
  // Weekly Training Schedule:
  // Monday: Strength A (Upper Body)
  // Tuesday: Aerobic Conditioning
  // Wednesday: Strength B (Lower Body)
  // Thursday: Athletic Conditioning
  // Friday: Strength C (Full Body)
  // Saturday: Cricket
  // Sunday: Complete Rest
  const d = parseISODate(iso);
  const dayOfWeek = d.getDay(); // 0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat
  
  switch (dayOfWeek) {
    case 1: return WORKOUT_ROUTINES['Strength A'];
    case 2: return WORKOUT_ROUTINES['Aerobic Conditioning'];
    case 3: return WORKOUT_ROUTINES['Strength B'];
    case 4: return WORKOUT_ROUTINES['Athletic Conditioning'];
    case 5: return WORKOUT_ROUTINES['Strength C'];
    case 6: return WORKOUT_ROUTINES['Cricket'];
    case 0:
    default:
      return WORKOUT_ROUTINES['Complete Rest'];
  }
}

export function getDayTargets(iso: string): Record<HabitKey, number> {
  const isHome = getPhase(iso) === 'home';
  const d = parseISODate(iso);
  const isSunday = d.getDay() === 0;

  return {
    steps: isSunday ? 0 : (isHome ? 7000 : 10000),
    reading: isHome ? 20 : 40,
    study: isHome ? 3 : 4,
    water: 3,
    sleep: 7,
    jobs: 5,
    hygiene: 1,
    discipline: 1,
    workout: isSunday ? 0 : 1,
  };
}

export function isHabitComplete(key: HabitKey, day: DayRecord | undefined, iso: string): boolean {
  if (!day) return false;
  const targets = getDayTargets(iso);
  const d = parseISODate(iso);
  const isSunday = d.getDay() === 0;

  switch (key) {
    case 'steps':
      if (isSunday) return true; // Sunday is complete rest with no step requirement
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
      if (isSunday) return true; // Sunday has no workout target
      if (getPhase(iso) === 'home') {
        const routine = getWorkoutRoutineForDate(iso);
        if (routine.type === 'recovery' || routine.type === 'rest') return true;
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
