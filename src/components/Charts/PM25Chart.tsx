import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatChartTime } from '../../utils/formatters';
import { Activity } from 'lucide-react';

interface PM25ChartProps {
  data: { time: string; value: number }[];
}

export const PM25Chart: React.FC<PM25ChartProps> = ({ data }) => {
  const chartData = data.map((point) => ({
    time: formatChartTime(point.time),
    value: Math.round(point.value * 10) / 10,
  }));
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">PM2.5 Concentration</h2>
          <p className="chart-subtitle">Last 12 hours • Live updates</p>
        </div>
        <div className="live-badge">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          <span>LIVE</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="#94A3B8"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
              padding: '12px 16px',
            }}
            labelStyle={{ fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}
            formatter={(value: number) => [`${value} μg/m³`, 'PM2.5']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#7C3AED"
            strokeWidth={3}
            fill="url(#colorPM25)"
            animationDuration={1200}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-5 p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0.02) 100%)' }}>
        <div className="flex items-center gap-3 text-sm">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}>
            <Activity size={16} className="text-white" />
          </div>
          <span className="font-medium text-gray-600">
            Hover over the chart to see exact values at specific times
          </span>
        </div>
      </div>
    </div>
  );
};
