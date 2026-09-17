export type HabitKey =
  | 'steps'
  | 'reading'
  | 'study'
  | 'water'
  | 'sleep'
  | 'jobs'
  | 'hygiene'
  | 'discipline'
  | 'workout';

export interface HabitDefinition {
  key: HabitKey;
  label: string;
  category: 'Physical' | 'Intellectual' | 'Discipline' | 'Recovery';
  unit: string;
  step: number;
  type: 'number' | 'check';
  homeTarget: number;
  gymTarget: number;
  description: string;
}

export interface DayRecord {
  steps: number;
  reading: number;
  study: number;
  water: number;
  sleep: number;
  jobs: number;
  hygiene: boolean;
  discipline: boolean;
  workout: boolean;
  ex?: Record<number, boolean>;
  workoutNotes?: string;
  updatedAt?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface AppState {
  version: number;
  days: Record<string, DayRecord>;
  dailyTodos: Record<string, TodoItem[]>;
  monthlyObjectives: Record<string, TodoItem[]>;
  notes: Record<string, string>;
}

export interface Exercise {
  name: string;
  setsReps: string;
  target: string;
  cues: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  type: 'push' | 'pull' | 'legs' | 'recovery' | 'gym';
  exercises: Exercise[];
  focusNotes: string;
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletedDays: number;
  overallConsistency: number;
  totalDaysInArc: number;
  daysElapsed: number;
  daysRemaining: number;
}

export type ActiveTab = 'overview' | 'workout' | 'telemetry' | 'missions' | 'settings';
