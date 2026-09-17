import React, { useState, useMemo } from 'react';
import { AppState } from '../types';
import { 
  START_DATE, 
  END_DATE, 
  getCompletedHabitCount, 
  parseISODate, 
  toISODate 
} from '../utils/arcEngine';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { TrendingUp, Activity, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HabitTrendChartProps {
  state: AppState;
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

interface TrendPoint {
  date: string;
  displayDate: string;
  shortLabel: string;
  completed: number;
  percentage: number;
  inArc: boolean;
  isSelected: boolean;
  isToday: boolean;
}

export const HabitTrendChart: React.FC<HabitTrendChartProps> = ({
  state,
  selectedDate,
  onSelectDate,
}) => {
  const [metricMode, setMetricMode] = useState<'count' | 'percent'>('count');
  const todayIso = toISODate(new Date());

  // Generate trailing 30-day window ending at selectedDate or today (whichever is later in the arc)
  const chartData = useMemo<TrendPoint[]>(() => {
    // Anchor point: latest of selectedDate and todayIso
    const anchorDateIso = selectedDate > todayIso ? selectedDate : todayIso;
    const anchor = parseISODate(anchorDateIso);

    const points: TrendPoint[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(anchor);
      d.setDate(d.getDate() - i);
      const iso = toISODate(d);
      const inArc = iso >= START_DATE && iso <= END_DATE;
      const dayRec = state.days[iso];
      const completed = inArc && dayRec ? getCompletedHabitCount(dayRec, iso) : 0;
      const percentage = Math.round((completed / 9) * 100);

      points.push({
        date: iso,
        displayDate: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        shortLabel: `${d.getMonth() + 1}/${d.getDate()}`,
        completed,
        percentage,
        inArc,
        isSelected: iso === selectedDate,
        isToday: iso === todayIso,
      });
    }

    return points;
  }, [state.days, selectedDate, todayIso]);

  // Compute 30-day aggregates
  const stats = useMemo(() => {
    const trackedPoints = chartData.filter(p => p.inArc);
    const count = trackedPoints.length || 1;
    const totalHabits = trackedPoints.reduce((acc, p) => acc + p.completed, 0);
    const avgCompleted = (totalHabits / count).toFixed(1);
    const avgPercentage = Math.round((totalHabits / (count * 9)) * 100);
    const thresholdDays = trackedPoints.filter(p => p.completed >= 7).length;
    const eliteDays = trackedPoints.filter(p => p.completed >= 8).length;

    return {
      avgCompleted,
      avgPercentage,
      thresholdDays,
      eliteDays,
      totalTracked: trackedPoints.length,
    };
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 shadow-xs transition-all">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Habit Completion Trends
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-[10px] sm:text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              Trailing 30 Days
            </span>
          </div>

          <h3 className="mt-1 text-base sm:text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>30-Day Momentum Curve</span>
            <span className="text-xs font-normal text-zinc-500 font-sans">
              ({chartData[0]?.displayDate} – {chartData[chartData.length - 1]?.displayDate})
            </span>
          </h3>
        </div>

        {/* Metric Mode Toggle */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80">
          <button
            type="button"
            onClick={() => setMetricMode('count')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              metricMode === 'count'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Habits (0–9)
          </button>
          <button
            type="button"
            onClick={() => setMetricMode('percent')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
              metricMode === 'percent'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Percentage (%)
          </button>
        </div>
      </div>

      {/* 30-Day Telemetry Key Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 my-3 sm:my-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            30-Day Average
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.avgCompleted}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              habits/day ({stats.avgPercentage}%)
            </span>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" />
            Discipline Days
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.thresholdDays}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              of {stats.totalTracked} (≥ 7/9)
            </span>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Elite Sessions
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100">
              {stats.eliteDays}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
              days (≥ 8/9)
            </span>
          </div>
        </div>

        <div className="p-2.5 sm:p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/70 dark:border-zinc-700/60">
          <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Selected Day
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
              {selectedDate}
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Line Chart Container */}
      <div className="w-full h-64 sm:h-72 min-w-0 pt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
            onClick={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                const dateClicked = e.activePayload[0].payload?.date;
                if (dateClicked) {
                  onSelectDate(dateClicked);
                }
              }
            }}
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
              axisLine={{ stroke: 'currentColor', className: 'text-zinc-300 dark:text-zinc-700' }}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-500 font-mono"
              interval={window.innerWidth < 640 ? 4 : 2}
            />

            <YAxis
              domain={metricMode === 'count' ? [0, 9] : [0, 100]}
              ticks={metricMode === 'count' ? [0, 3, 5, 7, 9] : [0, 25, 50, 75, 100]}
              tickLine={false}
              axisLine={{ stroke: 'currentColor', className: 'text-zinc-300 dark:text-zinc-700' }}
              tick={{ fontSize: 10, fill: 'currentColor' }}
              className="text-zinc-400 dark:text-zinc-500 font-mono"
              unit={metricMode === 'percent' ? '%' : ''}
            />

            {/* Threshold Reference Line */}
            <ReferenceLine
              y={metricMode === 'count' ? 7 : 78}
              stroke="#10b981"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: metricMode === 'count' ? 'Threshold (7)' : 'Threshold (78%)',
                position: 'insideTopRight',
                fill: '#10b981',
                fontSize: 10,
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            />

            {/* Baseline Reference Line */}
            <ReferenceLine
              y={metricMode === 'count' ? 5 : 56}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              strokeWidth={1}
              label={{
                value: metricMode === 'count' ? 'Baseline (5)' : 'Baseline (56%)',
                position: 'insideBottomRight',
                fill: '#f59e0b',
                fontSize: 9,
                fontFamily: 'monospace',
              }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload as TrendPoint;
                const count = data.completed;
                const pct = data.percentage;

                let statusText = 'Pending Protocols';
                let statusColor = 'text-zinc-500';
                if (count >= 8) {
                  statusText = 'Elite Execution';
                  statusColor = 'text-emerald-500 font-bold';
                } else if (count >= 7) {
                  statusText = 'Discipline Threshold Met';
                  statusColor = 'text-emerald-500';
                } else if (count >= 5) {
                  statusText = 'Baseline Standard Active';
                  statusColor = 'text-amber-500';
                }

                return (
                  <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg text-xs font-mono z-50">
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-1.5 mb-1.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {data.displayDate}
                      </span>
                      {data.isToday && (
                        <span className="px-1.5 py-0.2 rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 text-[9px]">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">Completed:</span>
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {count} of 9 ({pct}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-zinc-500">Status:</span>
                        <span className={statusColor}>{statusText}</span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[9px] text-zinc-400 text-center">
                      Click point to view day log
                    </div>
                  </div>
                );
              }}
            />

            {/* Main Trend Line */}
            <Line
              type="monotone"
              dataKey={metricMode === 'count' ? 'completed' : 'percentage'}
              stroke="#10b981"
              strokeWidth={2.5}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isSelected = payload.date === selectedDate;
                const isCompliant = payload.completed >= 7;

                return (
                  <circle
                    key={`dot-${payload.date}`}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 5.5 : isCompliant ? 3.5 : 2.5}
                    fill={isSelected ? '#ffffff' : isCompliant ? '#10b981' : '#71717a'}
                    stroke={isSelected ? '#10b981' : 'none'}
                    strokeWidth={isSelected ? 2.5 : 0}
                    className="transition-all cursor-pointer hover:scale-150"
                  />
                );
              }}
              activeDot={{
                r: 6,
                fill: '#10b981',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Guide */}
      <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full" />
            <span className="text-zinc-600 dark:text-zinc-400">Discipline Threshold (≥ 7 habits / 78%)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-500 rounded-full" />
            <span className="text-zinc-600 dark:text-zinc-400">Baseline (5 habits / 56%)</span>
          </span>
        </div>
        <span className="text-zinc-500 dark:text-zinc-400">
          Tip: Tap any node on the line to switch the workspace to that date
        </span>
      </div>
    </div>
  );
};
