import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatChartTime } from '../../utils/formatters';
import { getAQICategory } from '../../utils/aqiCalculator';
import { TrendingUp } from 'lucide-react';

interface AQIChartProps {
  data: { time: string; aqi: number }[];
}

export const AQIChart: React.FC<AQIChartProps> = ({ data }) => {
  const chartData = data.map((point) => ({
    time: formatChartTime(point.time),
    aqi: point.aqi,
    category: getAQICategory(point.aqi),
  }));
  
  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="chart-title">Air Quality Forecast</h2>
          <p className="chart-subtitle">24-hour prediction • Color-coded zones</p>
        </div>
        <div className="stats-badge">
          <TrendingUp size={14} />
          <span>24H Trend</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          
          {/* AQI threshold lines */}
          <ReferenceLine y={50} stroke="#10B981" strokeDasharray="5 5" opacity={0.4} />
          <ReferenceLine y={100} stroke="#FBBF24" strokeDasharray="5 5" opacity={0.4} />
          <ReferenceLine y={150} stroke="#F97316" strokeDasharray="5 5" opacity={0.4} />
          
          <XAxis
            dataKey="time"
            stroke="#94A3B8"
            style={{ fontSize: '11px', fontWeight: 500 }}
            interval={3}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#94A3B8"
            style={{ fontSize: '11px', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            width={40}
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
            formatter={(value: number) => [value, 'AQI']}
          />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{ r: 4, fill: '#7C3AED', strokeWidth: 0 }}
            activeDot={{ r: 7, fill: '#EC4899', strokeWidth: 3, stroke: 'white' }}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Good', color: '#10B981', range: '0-50' },
          { label: 'Moderate', color: '#FBBF24', range: '51-100' },
          { label: 'Sensitive', color: '#F97316', range: '101-150' },
          { label: 'Unhealthy', color: '#EF4444', range: '151-200' },
          { label: 'Hazardous', color: '#7C3AED', range: '201+' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div>
              <div className="font-semibold text-gray-700">{item.label}</div>
              <div className="text-gray-400">{item.range}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
