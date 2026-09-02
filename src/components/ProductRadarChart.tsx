import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export interface PerformanceMetric {
  attribute: string;
  value: number; // 0 - 100
  fullMark?: number;
}

interface ProductRadarChartProps {
  metrics?: PerformanceMetric[];
  productName?: string;
}

const DEFAULT_METRICS: PerformanceMetric[] = [
  { attribute: 'Cushioning', value: 92, fullMark: 100 },
  { attribute: 'Support', value: 88, fullMark: 100 },
  { attribute: 'Lightness', value: 90, fullMark: 100 },
  { attribute: 'Traction', value: 94, fullMark: 100 },
  { attribute: 'Responsiveness', value: 95, fullMark: 100 },
  { attribute: 'Breathability', value: 86, fullMark: 100 },
];

export const PRODUCT_PERFORMANCE_DATA: Record<string, PerformanceMetric[]> = {
  'Quantum Velocity Plus': [
    { attribute: 'Cushioning', value: 96, fullMark: 100 },
    { attribute: 'Support', value: 90, fullMark: 100 },
    { attribute: 'Lightness', value: 92, fullMark: 100 },
    { attribute: 'Traction', value: 94, fullMark: 100 },
    { attribute: 'Responsiveness', value: 98, fullMark: 100 },
    { attribute: 'Breathability', value: 88, fullMark: 100 },
  ],
  'CloudStride Pink': [
    { attribute: 'Cushioning', value: 98, fullMark: 100 },
    { attribute: 'Support', value: 84, fullMark: 100 },
    { attribute: 'Lightness', value: 95, fullMark: 100 },
    { attribute: 'Traction', value: 86, fullMark: 100 },
    { attribute: 'Responsiveness', value: 90, fullMark: 100 },
    { attribute: 'Breathability', value: 94, fullMark: 100 },
  ],
  'Urban High-Top': [
    { attribute: 'Cushioning', value: 85, fullMark: 100 },
    { attribute: 'Support', value: 96, fullMark: 100 },
    { attribute: 'Lightness', value: 80, fullMark: 100 },
    { attribute: 'Traction', value: 95, fullMark: 100 },
    { attribute: 'Responsiveness', value: 88, fullMark: 100 },
    { attribute: 'Breathability', value: 82, fullMark: 100 },
  ],
  'Street Runner Max': [
    { attribute: 'Cushioning', value: 90, fullMark: 100 },
    { attribute: 'Support', value: 88, fullMark: 100 },
    { attribute: 'Lightness', value: 93, fullMark: 100 },
    { attribute: 'Traction', value: 92, fullMark: 100 },
    { attribute: 'Responsiveness', value: 92, fullMark: 100 },
    { attribute: 'Breathability', value: 90, fullMark: 100 },
  ],
  'JoshShoes Lifestyle (M)': [
    { attribute: 'Cushioning', value: 88, fullMark: 100 },
    { attribute: 'Support', value: 85, fullMark: 100 },
    { attribute: 'Lightness', value: 91, fullMark: 100 },
    { attribute: 'Traction', value: 87, fullMark: 100 },
    { attribute: 'Responsiveness', value: 86, fullMark: 100 },
    { attribute: 'Breathability', value: 92, fullMark: 100 },
  ],
  'Quantum Sprint': [
    { attribute: 'Cushioning', value: 92, fullMark: 100 },
    { attribute: 'Support', value: 94, fullMark: 100 },
    { attribute: 'Lightness', value: 96, fullMark: 100 },
    { attribute: 'Traction', value: 98, fullMark: 100 },
    { attribute: 'Responsiveness', value: 96, fullMark: 100 },
    { attribute: 'Breathability', value: 89, fullMark: 100 },
  ],
  'Graphite Chunky': [
    { attribute: 'Cushioning', value: 94, fullMark: 100 },
    { attribute: 'Support', value: 92, fullMark: 100 },
    { attribute: 'Lightness', value: 78, fullMark: 100 },
    { attribute: 'Traction', value: 88, fullMark: 100 },
    { attribute: 'Responsiveness', value: 84, fullMark: 100 },
    { attribute: 'Breathability', value: 80, fullMark: 100 },
  ],
  'Neon Court High': [
    { attribute: 'Cushioning', value: 91, fullMark: 100 },
    { attribute: 'Support', value: 98, fullMark: 100 },
    { attribute: 'Lightness', value: 82, fullMark: 100 },
    { attribute: 'Traction', value: 96, fullMark: 100 },
    { attribute: 'Responsiveness', value: 93, fullMark: 100 },
    { attribute: 'Breathability', value: 84, fullMark: 100 },
  ],
};

export default function ProductRadarChart({ metrics, productName }: ProductRadarChartProps) {
  const chartData = metrics || (productName ? PRODUCT_PERFORMANCE_DATA[productName] : null) || DEFAULT_METRICS;

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 relative flex flex-col justify-between">
      <div className="flex items-center justify-between px-1 mb-2">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
            Performance Radar Spectrum
          </h4>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Biomechanics & Traction Analysis</p>
        </div>
        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
          Lab Score
        </span>
      </div>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="68%" data={chartData}>
            <PolarGrid stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="attribute" 
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700 }}
              className="text-zinc-600 dark:text-zinc-300 uppercase tracking-wider"
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PerformanceMetric;
                  return (
                    <div className="bg-zinc-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl border border-zinc-700">
                      <p className="font-bold uppercase text-orange-400 mb-0.5">{data.attribute}</p>
                      <p className="text-sm font-black text-white">{data.value} <span className="text-[10px] text-zinc-400 font-normal">/ 100 rating</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Radar
              name={productName || "Shoe Metrics"}
              dataKey="value"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
