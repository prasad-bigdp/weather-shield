import React from 'react';
import { Wind, CloudFog, Thermometer, Droplets, Sun, Flower2 } from 'lucide-react';
import type { MetricCardData } from '../../types';

interface MetricCardProps {
  data: MetricCardData;
  index?: number;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Wind,
  CloudFog,
  Thermometer,
  Droplets,
  Sun,
  Flower2,
};

const colorMap: Record<string, string> = {
  aqi: 'purple',
  pm25: 'pink',
  temperature: 'blue',
  humidity: 'green',
  uv: 'orange',
  pollen: 'teal',
};

const getBadgeClass = (category: string) => {
  if (category === 'good' || category === 'excellent') return 'good';
  if (category === 'moderate') return 'moderate';
  if (category === 'sensitive' || category === 'unhealthy' || category === 'veryUnhealthy' || category === 'hazardous') return 'unhealthy';
  return 'low';
};

export const MetricCard: React.FC<MetricCardProps> = ({ data, index = 0 }) => {
  const Icon = iconMap[data.icon] || Wind;
  const colorClass = colorMap[data.id] || 'purple';
  const badgeClass = getBadgeClass(data.category);
  
  return (
    <div 
      className="metric-card animate-slide-up hover-scale hover-glow"
      style={{ 
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="metric-card-header">
        <div className={`metric-icon-wrapper ${colorClass}`}>
          <Icon size={28} />
        </div>
        <div className="metric-content">
          <div className="metric-value">
            {typeof data.value === 'number' ? data.value.toLocaleString() : data.value}
            {data.unit && <span className="metric-unit">{data.unit}</span>}
          </div>
          <div className="metric-label">{data.label}</div>
        </div>
      </div>
      <div className={`metric-badge ${badgeClass}`}>
        {data.description}
      </div>
    </div>
  );
};
