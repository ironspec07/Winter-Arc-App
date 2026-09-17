import React, { useState } from 'react';
import { AppState, TodoItem } from '../types';
import { formatDisplayDate, START_DATE, GYM_DATE, END_DATE } from '../utils/arcEngine';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  BookOpen, 
  ShieldAlert, 
  Sparkles, 
  Calendar,
  Layers
} from 'lucide-react';

interface MissionsSectionProps {
  selectedDate: string;
  state: AppState;
  onUpdateState: (updater: (prev: AppState) => AppState) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  onResetData: () => void;
}

export const MissionsSection: React.FC<MissionsSectionProps> = ({
  selectedDate,
  state,
  onUpdateState,
  onExportBackup,
  onImportBackup,
  onResetData,
}) => {
  const { weekday, dateFormatted } = formatDisplayDate(selectedDate);
  const activeMonthKey = selectedDate.slice(0, 7);

  const [dailyInput, setDailyInput] = useState('');
  const [monthlyInput, setMonthlyInput] = useState('');

  const dailyTodos = state.dailyTodos[selectedDate] || [];
  const monthlyTodos = state.monthlyObjectives[activeMonthKey] || [];
  const currentNote = state.notes[selectedDate] || '';

  const handleAddDaily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyInput.trim()) return;

    const newItem: TodoItem = {
      id: `daily-${Date.now()}`,
      text: dailyInput.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    onUpdateState(prev => ({
      ...prev,
      dailyTodos: {
        ...prev.dailyTodos,
        [selectedDate]: [...(prev.dailyTodos[selectedDate] || []), newItem],
      },
    }));
    setDailyInput('');
  };

  const handleToggleDaily = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      dailyTodos: {
        ...prev.dailyTodos,
        [selectedDate]: (prev.dailyTodos[selectedDate] || []).map(t =>
          t.id === id ? { ...t, done: !t.done } : t
        ),
      },
    }));
  };

  const handleDeleteDaily = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      dailyTodos: {
        ...prev.dailyTodos,
        [selectedDate]: (prev.dailyTodos[selectedDate] || []).filter(t => t.id !== id),
      },
    }));
  };

  const handleAddMonthly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyInput.trim()) return;

    const newItem: TodoItem = {
      id: `monthly-${Date.now()}`,
      text: monthlyInput.trim(),
      done: false,
      createdAt: new Date().toISOString(),
    };

    onUpdateState(prev => ({
      ...prev,
      monthlyObjectives: {
        ...prev.monthlyObjectives,
        [activeMonthKey]: [...(prev.monthlyObjectives[activeMonthKey] || []), newItem],
      },
    }));
    setMonthlyInput('');
  };

  const handleToggleMonthly = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      monthlyObjectives: {
        ...prev.monthlyObjectives,
        [activeMonthKey]: (prev.monthlyObjectives[activeMonthKey] || []).map(t =>
          t.id === id ? { ...t, done: !t.done } : t
        ),
      },
    }));
  };

  const handleDeleteMonthly = (id: string) => {
    onUpdateState(prev => ({
      ...prev,
      monthlyObjectives: {
        ...prev.monthlyObjectives,
        [activeMonthKey]: (prev.monthlyObjectives[activeMonthKey] || []).filter(t => t.id !== id),
      },
    }));
  };

  const handleNoteChange = (text: string) => {
    onUpdateState(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [selectedDate]: text,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Missions & System Command
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                {weekday}, {dateFormatted}
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
              Action Execution & Backup
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Manage non-routine tasks, strategic objectives, daily reflections, and local backup files.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Daily & Monthly Mission Boards */}
        <div className="space-y-6">
          {/* Daily Missions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  Daily Focus Missions
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {weekday}, {dateFormatted}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {dailyTodos.filter(t => t.done).length} / {dailyTodos.length} Done
              </span>
            </div>

            <form onSubmit={handleAddDaily} className="flex gap-2 mb-4">
              <input
                type="text"
                value={dailyInput}
                onChange={(e) => setDailyInput(e.target.value)}
                placeholder="Add high-priority task for today..."
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 font-sans"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {dailyTodos.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 font-mono">
                  No custom missions added for this date.
                </div>
              ) : (
                dailyTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/40 hover:border-zinc-200 dark:hover:border-zinc-700 group transition-all"
                  >
                    <div
                      onClick={() => handleToggleDaily(todo.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                    >
                      {todo.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                      )}
                      <span className={`text-xs ${
                        todo.done ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDaily(todo.id)}
                      className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-all active:scale-95"
                      title="Delete mission"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Monthly Strategic Objectives */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  Monthly Milestones & Objectives
                </h3>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Target for {activeMonthKey}
                </span>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {monthlyTodos.filter(t => t.done).length} / {monthlyTodos.length} Done
              </span>
            </div>

            <form onSubmit={handleAddMonthly} className="flex gap-2 mb-4">
              <input
                type="text"
                value={monthlyInput}
                onChange={(e) => setMonthlyInput(e.target.value)}
                placeholder="Add monthly objective (e.g. read 2 books, 100 apps)..."
                className="flex-1 text-xs py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 font-sans"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {monthlyTodos.length === 0 ? (
                <div className="py-8 text-center text-xs text-zinc-400 font-mono">
                  No monthly objectives set for this month.
                </div>
              ) : (
                monthlyTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/40 hover:border-zinc-200 dark:hover:border-zinc-700 group transition-all"
                  >
                    <div
                      onClick={() => handleToggleMonthly(todo.id)}
                      className="flex items-center gap-2.5 flex-1 cursor-pointer select-none"
                    >
                      {todo.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
                      )}
                      <span className={`text-xs ${
                        todo.done ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'
                      }`}>
                        {todo.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteMonthly(todo.id)}
                      className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-all active:scale-95"
                      title="Delete objective"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Evening Reflection Log & Backup/System Utilities */}
        <div className="space-y-6">
          {/* Daily Reflection Journal */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mb-1">
              Daily Reflection & Evening Log
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3">
              Document wins, obstacles, cognitive clarity, or mindset adjustments.
            </p>

            <textarea
              rows={6}
              value={currentNote}
              onChange={(e) => handleNoteChange(e.target.value)}
              placeholder="What went well today? Where did focus waiver? What is the main priority for tomorrow morning?"
              className="w-full text-xs font-mono p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-y"
            />
            <div className="mt-1 flex justify-between items-center text-[10px] font-mono text-zinc-400">
              <span>{currentNote.length} characters</span>
              <span>Saved locally</span>
            </div>
          </div>

          {/* Backup, Export & Storage Safety */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-zinc-500" />
              Data Portability & Local Storage
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4">
              All records exist securely in your browser storage. Download periodic JSON backups so you never lose progress.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={onExportBackup}
                className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="flex-1 py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onImportBackup(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400 font-mono">
                Storage: Local Indexed Web Storage
              </span>
              <button
                type="button"
                onClick={onResetData}
                className="text-[11px] font-mono text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
