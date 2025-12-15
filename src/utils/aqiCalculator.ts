import type { AQICategory, AQIInfo } from '../types';

/**
 * Calculate AQI from PM2.5 concentration using EPA formula
 * @param pm25 PM2.5 concentration in μg/m³
 * @returns AQI value (0-500+)
 */
export function calculateAQI(pm25: number): number {
  // EPA AQI breakpoints for PM2.5
  const breakpoints = [
    { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, iLow: 301, iHigh: 500 },
  ];

  // Find the appropriate breakpoint
  const bp = breakpoints.find(
    (b) => pm25 >= b.cLow && pm25 <= b.cHigh
  ) || breakpoints[breakpoints.length - 1];

  // Calculate AQI using EPA formula
  const aqi = Math.round(
    ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow
  );

  return Math.max(0, aqi);
}

/**
 * Get AQI category from AQI value
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'veryUnhealthy';
  return 'hazardous';
}

/**
 * Get comprehensive AQI information
 */
export function getAQIInfo(aqi: number): AQIInfo {
  const category = getAQICategory(aqi);
  
  const info: Record<AQICategory, Omit<AQIInfo, 'value' | 'category'>> = {
    good: {
      color: '#00E400',
      gradient: 'linear-gradient(135deg, #00E400 0%, #00A300 100%)',
      label: 'Good',
      description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
      recommendations: [
        'Perfect day for outdoor activities',
        'Enjoy your time outside',
        'No precautions needed',
      ],
    },
    moderate: {
      color: '#FFFF00',
      gradient: 'linear-gradient(135deg, #FFFF00 0%, #FFD700 100%)',
      label: 'Moderate',
      description: 'Air quality is acceptable. However, there may be a risk for some people.',
      recommendations: [
        'Unusually sensitive people should consider limiting prolonged outdoor exertion',
        'Generally safe for outdoor activities',
      ],
    },
    sensitive: {
      color: '#FF7E00',
      gradient: 'linear-gradient(135deg, #FF7E00 0%, #FF5500 100%)',
      label: 'Unhealthy for Sensitive Groups',
      description: 'Members of sensitive groups may experience health effects.',
      recommendations: [
        'People with respiratory or heart conditions should limit outdoor exertion',
        'Children and older adults should reduce prolonged outdoor activities',
        'General public is less likely to be affected',
      ],
    },
    unhealthy: {
      color: '#FF0000',
      gradient: 'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)',
      label: 'Unhealthy',
      description: 'Everyone may begin to experience health effects.',
      recommendations: [
        'Avoid prolonged outdoor exertion',
        'Sensitive groups should avoid all outdoor activities',
        'Keep windows and doors closed',
        'Run air purifiers if available',
      ],
    },
    veryUnhealthy: {
      color: '#8F3F97',
      gradient: 'linear-gradient(135deg, #8F3F97 0%, #6B2F77 100%)',
      label: 'Very Unhealthy',
      description: 'Health alert: everyone may experience more serious health effects.',
      recommendations: [
        'Everyone should avoid all outdoor exertion',
        'Stay indoors with windows closed',
        'Run air purifiers on high',
        'Wear N95 masks if you must go outside',
      ],
    },
    hazardous: {
      color: '#7E0023',
      gradient: 'linear-gradient(135deg, #7E0023 0%, #5E0019 100%)',
      label: 'Hazardous',
      description: 'Health warning of emergency conditions. The entire population is likely to be affected.',
      recommendations: [
        'DO NOT GO OUTSIDE',
        'Remain indoors with all windows and doors closed',
        'Run air purifiers continuously',
        'Seek medical attention if experiencing symptoms',
        'Evacuate if advised by authorities',
      ],
    },
  };

  return {
    value: aqi,
    category,
    ...info[category],
  };
}

/**
 * Get pollen level category
 */
export function getPollenCategory(pollenIndex: number): string {
  if (pollenIndex <= 2.4) return 'Low';
  if (pollenIndex <= 4.8) return 'Moderate';
  if (pollenIndex <= 7.2) return 'High';
  return 'Very High';
}

/**
 * Get UV index category
 */
export function getUVCategory(uvIndex: number): string {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

/**
 * Determine best time for outdoor exercise based on AQI trend
 */
export function getBestExerciseTime(hourlyAQI: { time: string; aqi: number }[]): string {
  
  // Find the best window (lowest AQI) in the next 12 hours
  const futureData = hourlyAQI.slice(0, 12);
  const bestWindow = futureData.reduce((best, current) => 
    current.aqi < best.aqi ? current : best
  );
  
  if (bestWindow.aqi > 150) {
    return 'Avoid outdoor exercise today - Air quality unhealthy';
  }
  
  if (bestWindow.aqi <= 50) {
    return 'Good conditions all day - Safe for outdoor activities';
  }
  
  const bestHour = new Date(bestWindow.time).getHours();
  const endHour = Math.min(bestHour + 4, 20); // Max until 8 PM
  
  return `Best time for outdoor exercise: ${formatHour(bestHour)} - ${formatHour(endHour)} (AQI: ${bestWindow.aqi})`;
}

function formatHour(hour: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour} ${period}`;
}
