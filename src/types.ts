export type HabitKey =
  | 'steps'
  | 'study'
  | 'jobs'
  | 'workout'
  | 'discipline'
  | 'water'
  | 'hygiene';

export interface HabitDefinition {
  key: HabitKey;
  label: string;
  category: 'Physical' | 'Intellectual' | 'Discipline';
  unit: string;
  step: number;
  type: 'number' | 'check';
  homeTarget: number;
  gymTarget: number;
  description: string;
}

export interface DayRecord {
  steps: number;
  study: number;
  jobs: number;
  workout: boolean;
  discipline: boolean;
  water: number;
  hygiene: boolean;
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
  type: 'push' | 'pull' | 'legs' | 'recovery' | 'gym' | 'strength' | 'aerobic' | 'conditioning' | 'sport' | 'rest';
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

export type ActiveTab = 'overview' | 'telemetry' | 'missions' | 'settings';
