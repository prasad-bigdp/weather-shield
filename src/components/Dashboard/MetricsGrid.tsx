import React from 'react';
import { MetricCard } from './MetricCard';
import type { MetricCardData, EnvironmentalData, AQICategory } from '../../types';
import { getAQIInfo } from '../../utils/aqiCalculator';

interface MetricsGridProps {
  data: EnvironmentalData;
}

const getPollenCategory = (level: number): AQICategory => {
  if (level <= 2.4) return 'good';
  if (level <= 4.8) return 'moderate';
  if (level <= 7.2) return 'sensitive';
  return 'unhealthy';
};

const getPollenLabel = (level: number): string => {
  if (level <= 2.4) return 'Low';
  if (level <= 4.8) return 'Moderate';
  if (level <= 7.2) return 'High';
  return 'Very High';
};

const getUVCategory = (index: number): AQICategory => {
  if (index <= 2) return 'good';
  if (index <= 5) return 'moderate';
  if (index <= 7) return 'sensitive';
  return 'unhealthy';
};

const getUVLabel = (index: number): string => {
  if (index <= 2) return 'Low';
  if (index <= 5) return 'Moderate';
  if (index <= 7) return 'High';
  return 'Very High';
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  const aqiInfo = getAQIInfo(data.aqi);
  const pollenCategory = getPollenCategory(data.pollenLevel);
  const pollenLabel = getPollenLabel(data.pollenLevel);
  const uvCategory = getUVCategory(data.uvIndex);
  const uvLabel = getUVLabel(data.uvIndex);

  const metrics: MetricCardData[] = [
    {
      id: 'aqi',
      label: 'Air Quality Index',
      value: data.aqi,
      unit: '',
      category: aqiInfo.category,
      icon: 'Wind',
      description: aqiInfo.label,
    },
    {
      id: 'pm25',
      label: 'PM2.5 Particles',
      value: data.pm25.toFixed(1),
      unit: 'μg/m³',
      category: aqiInfo.category,
      icon: 'CloudFog',
      description: 'Fine particles',
    },
    {
      id: 'temperature',
      label: 'Temperature',
      value: data.temperature !== null ? Math.round(data.temperature) : '--',
      unit: '°C',
      category: 'good' as AQICategory,
      icon: 'Thermometer',
      description: data.feelsLike ? `Feels like ${Math.round(data.feelsLike)}°` : 'Current reading',
    },
    {
      id: 'humidity',
      label: 'Humidity',
      value: data.humidity !== null ? data.humidity : '--',
      unit: '%',
      category: 'good' as AQICategory,
      icon: 'Droplets',
      description: 'Moisture level',
    },
    {
      id: 'uv',
      label: 'UV Index',
      value: data.uvIndex.toFixed(1),
      unit: '',
      category: uvCategory,
      icon: 'Sun',
      description: uvLabel,
    },
    {
      id: 'pollen',
      label: 'Pollen Level',
      value: data.pollenLevel.toFixed(1),
      unit: '',
      category: pollenCategory,
      icon: 'Flower2',
      description: pollenLabel,
    },
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.id} data={metric} index={index} />
      ))}
    </div>
  );
};
