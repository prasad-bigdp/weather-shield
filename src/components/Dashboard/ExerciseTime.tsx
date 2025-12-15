import React from 'react';
import { Sun, Sunrise, Sunset, CheckCircle, AlertTriangle, XCircle, Heart, Sparkles } from 'lucide-react';
import { getBestExerciseTime } from '../../utils/aqiCalculator';

interface ExerciseTimeProps {
  aqiTrend: { time: string; aqi: number }[];
  currentAQI: number;
}

const getQualityConfig = (aqi: number) => {
  if (aqi <= 50) return { 
    quality: 'excellent',
    label: 'Excellent',
    color: '#10B981',
    recommendation: 'Perfect conditions for outdoor activities',
    activities: ['Jogging', 'Cycling', 'HIIT', 'Team Sports']
  };
  if (aqi <= 100) return { 
    quality: 'good',
    label: 'Good',
    color: '#22C55E',
    recommendation: 'Great for most outdoor exercises',
    activities: ['Jogging', 'Walking', 'Yoga', 'Light Sports']
  };
  if (aqi <= 150) return { 
    quality: 'moderate',
    label: 'Moderate',
    color: '#F59E0B',
    recommendation: 'Consider reducing prolonged outdoor exertion',
    activities: ['Walking', 'Light Stretching', 'Short Sessions']
  };
  return { 
    quality: 'poor',
    label: 'Unhealthy',
    color: '#EF4444',
    recommendation: 'Limit outdoor activities, exercise indoors',
    activities: ['Indoor Gym', 'Home Workout', 'Rest']
  };
};

export const ExerciseTime: React.FC<ExerciseTimeProps> = ({ aqiTrend, currentAQI }) => {
  const config = getQualityConfig(currentAQI);
  
  const recommendation = aqiTrend.length > 0
    ? getBestExerciseTime(aqiTrend)
    : config.recommendation;
  
  const StatusIcon = config.quality === 'excellent' || config.quality === 'good' 
    ? CheckCircle 
    : config.quality === 'moderate' 
    ? AlertTriangle 
    : XCircle;
  
  const circumference = 2 * Math.PI * 50;
  const progress = Math.max(0, Math.min(100, 100 - (currentAQI / 200) * 100));
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  const timeSlots = [
    { time: '6:00 AM', label: 'Morning', icon: <Sunrise size={18} />, active: false },
    { time: '12:00 PM', label: 'Midday', icon: <Sun size={18} />, active: true },
    { time: '6:00 PM', label: 'Evening', icon: <Sunset size={18} />, active: false },
  ];
  
  return (
    <div 
      className="exercise-section"
      style={{ animation: 'slideUp 0.4s ease forwards', animationDelay: '0.4s', opacity: 0 }}
    >
      {/* Header */}
      <div className="exercise-header">
        <div className="section-title-wrapper">
          <div className="section-icon" style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)` }}>
            <Heart size={24} color="white" />
          </div>
          <div>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {config.quality === 'excellent' || config.quality === 'good' 
                ? 'Great Time to Exercise!' 
                : config.quality === 'moderate'
                ? 'Exercise with Caution'
                : 'Consider Indoor Activities'}
            </div>
            <div className="section-subtitle">Best time for outdoor exercise</div>
          </div>
        </div>
        
        <div className={`exercise-status ${config.quality}`}>
          <StatusIcon size={14} />
          <span>{config.label}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="exercise-content">
        {/* AQI Ring */}
        <div className="aqi-ring-container">
          <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="12"
            />
            <circle
              cx="70"
              cy="70"
              r="50"
              fill="none"
              stroke={config.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="aqi-ring-value">
            <div className="aqi-ring-number">{currentAQI}</div>
            <div className="aqi-ring-label">AQI</div>
          </div>
        </div>
        
        {/* Info */}
        <div className="exercise-info">
          <p className="exercise-recommendation">{recommendation}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sparkles size={16} style={{ color: config.color }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Recommended Activities</span>
          </div>
          <div className="activities-list">
            {config.activities.map((activity, i) => (
              <span key={i} className={`activity-tag ${i < 2 ? 'recommended' : ''}`}>
                {activity}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Time Slots */}
      <div className="time-slots">
        {timeSlots.map((slot, index) => (
          <div key={index} className={`time-slot ${slot.active ? 'active' : ''}`}>
            <div className="time-slot-icon">
              {slot.icon}
            </div>
            <div className="time-slot-time">{slot.time}</div>
            <div className="time-slot-label">{slot.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
