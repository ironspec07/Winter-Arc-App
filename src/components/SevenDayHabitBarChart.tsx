import React, { useState, useMemo } from 'react';
import { AppState, HabitKey } from '../types';
import {
  HABIT_DEFINITIONS,
  isHabitComplete,
  parseISODate,
  toISODate,
} from '../utils/arcEngine';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { BarChart3, CheckCircle2, Flame } from 'lucide-react';

interface SevenDayHabitBarChartProps {
  state: AppState;
  selectedDate: string;
}

const SIX_CORE_HABIT_KEYS: HabitKey[] = [
  'steps',
  'study',
  'jobs',
  'workout',
  'discipline',
  'water',
];

const SHORT_HABIT_NAMES: Record<HabitKey, string> = {
  steps: 'Steps',
  study: 'Study',
  jobs: 'Jobs',
  workout: 'Training',
  discipline: 'Discipline',
  water: 'Hydration',
  hygiene: 'Brush 2×',
};

interface HabitBarPoint {
  key: HabitKey;
  label: string;
  shortLabel: string;
  category: string;
  completedDays: number;
  rate: number;
}

export const SevenDayHabitBarChart: React.FC<SevenDayHabitBarChartProps> = ({
  state,
  selectedDate,
}) => {
  const [scope, setScope] = useState<'core6' | 'all7'>('core6');

  const { chartData, rangeLabel, overallRate, totalDone, totalPossible } = useMemo(() => {
    const anchor = parseISODate(selectedDate);
    const trailingDates: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() - i);
      trailingDates.push(toISODate(d));
    }

    const startDate = parseISODate(trailingDates[0]);
    const endDate = parseISODate(trailingDates[6]);
    const rangeLabel = `${startDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })} – ${endDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    })}`;

    const activeDefs =
      scope === 'core6'
        ? HABIT_DEFINITIONS.filter((d) => SIX_CORE_HABIT_KEYS.includes(d.key))
        : HABIT_DEFINITIONS;

    const data: HabitBarPoint[] = activeDefs.map((def) => {
      const completedDays = trailingDates.filter((iso) =>
        isHabitComplete(def.key, state.days[iso], iso)
      ).length;
      const rate = Math.round((completedDays / 7) * 100);

      return {
        key: def.key,
        label: def.label,
        shortLabel: SHORT_HABIT_NAMES[def.key] || def.label,
        category: def.category,
        completedDays,
        rate,
      };
    });

    const totalDone = data.reduce((acc, item) => acc + item.completedDays, 0);
    const totalPossible = data.length * 7;
    const overallRate =
      totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;

    return {
      chartData: data,
      rangeLabel,
      overallRate,
      totalDone,
      totalPossible,
    };
  }, [state.days, selectedDate, scope]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 shadow-xs transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              7-Day Habit Completion Rate
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              {rangeLabel}
            </span>
          </div>

          <h3 className="mt-1 text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-2 flex-wrap">
            <span>
              {scope === 'core6' ? '6 Core Habits' : 'All 7 Habits'} (Last 7 Days)
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              {overallRate}% Avg ({totalDone}/{totalPossible})
            </span>
          </h3>
        </div>

        {/* Scope Toggle */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
          <button
            type="button"
            onClick={() => setScope('core6')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              scope === 'core6'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            6 Core Habits
          </button>
          <button
            type="button"
            onClick={() => setScope('all7')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              scope === 'all7'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            All 7 (+Brush)
          </button>
        </div>
      </div>

      {/* Recharts BarChart Container */}
      <div className="w-full h-64 sm:h-72 min-w-0 pt-4 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -18, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-zinc-200 dark:text-zinc-800"
            />

            <XAxis
              dataKey="shortLabel"
              tickLine={false}
              axisLine={{
                stroke: 'currentColor',
                className: 'text-zinc-300 dark:text-zinc-700',
              }}
              tick={{ fontSize: 11, fill: 'currentColor' }}
              className="text-zinc-600 dark:text-zinc-400 font-mono font-semibold"
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={{
                stroke: 'currentColor',
                className: 'text-zinc-300 dark:text-zinc-700',
              }}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-500 font-mono"
              unit="%"
            />

            <ReferenceLine
              y={80}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: 'Target (80%)',
                position: 'insideTopRight',
                fill: '#10b981',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            />

            <Tooltip
              cursor={{ fill: 'rgba(161, 161, 170, 0.1)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0].payload as HabitBarPoint;

                return (
                  <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-xs font-mono z-50">
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-1.5 mb-1.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {item.label}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[9px]">
                        {item.category}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">7-Day Rate:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {item.rate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">Days Cleared:</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {item.completedDays} / 7 days
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Bar dataKey="rate" radius={[8, 8, 0, 0]} maxBarSize={48}>
              {chartData.map((entry) => {
                let fillColor = '#71717a'; // zinc-500
                if (entry.rate >= 80) {
                  fillColor = '#10b981'; // emerald-500
                } else if (entry.rate >= 50) {
                  fillColor = '#f59e0b'; // amber-500
                }
                return <Cell key={`cell-${entry.key}`} fill={fillColor} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend */}
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Strong Compliance (≥ 80%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Moderate (50–79%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-zinc-500" />
            <span className="text-zinc-600 dark:text-zinc-400">Needs Focus (&lt; 50%)</span>
          </span>
        </div>
        <span>Trailing 7 days ending on {selectedDate}</span>
      </div>
    </div>
  );
};
