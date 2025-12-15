import React from 'react';
import type { Park } from '../../types';
import { TreePine, Sparkles, ArrowRight, Activity, Navigation, Leaf } from 'lucide-react';
import { formatDistance } from '../../utils/formatters';

interface ParkRecommendationsProps {
  parks: Park[];
  loading: boolean;
  error?: string | null;
  onExploreAll: () => void;
}

const getAQIClass = (aqi: number) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  return 'unhealthy';
};

const getRankEmoji = (rank: number) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
};

const getRankClass = (rank: number) => {
  if (rank === 1) return 'gold';
  if (rank === 2) return 'silver';
  if (rank === 3) return 'bronze';
  return '';
};

export const ParkRecommendations: React.FC<ParkRecommendationsProps> = ({ 
  parks, 
  loading, 
  error, 
  onExploreAll 
}) => {
  if (loading) {
    return (
      <div className="parks-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="section-icon" style={{ background: '#E5E7EB' }}>
              <TreePine size={24} style={{ color: '#9CA3AF' }} />
            </div>
            <div>
              <div className="section-title">Loading parks...</div>
            </div>
          </div>
        </div>
        <div className="parks-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="park-card" style={{ height: 160, background: '#F3F4F6' }} />
          ))}
        </div>
      </div>
    );
  }

  if (error && parks.length === 0) {
    return (
      <div className="parks-section" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <TreePine size={48} style={{ color: '#D1D5DB', marginBottom: 16 }} />
        <div className="section-title" style={{ marginBottom: 8 }}>Unable to Load Parks</div>
        <p style={{ color: '#6B7280', fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  if (parks.length === 0) return null;

  const topParks = parks.slice(0, 3);
  
  return (
    <div className="parks-section">
      {/* Header */}
      <div className="section-header">
        <div className="section-title-wrapper">
          <div className="section-icon">
            <TreePine size={24} />
          </div>
          <div>
            <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              Best Parks Right Now
              <Sparkles size={18} style={{ color: '#FBBF24' }} />
            </div>
            <div className="section-subtitle">Ranked by real-time air quality data</div>
          </div>
        </div>
        
        <button className="section-action" onClick={onExploreAll}>
          <span>Explore All</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      {/* Parks Grid */}
      <div className="parks-grid">
        {topParks.map((park, index) => {
          const rank = index + 1;
          const aqiClass = getAQIClass(park.aqi);
          
          return (
            <div 
              key={park.id} 
              className="park-card"
              style={{ 
                animation: `slideUp 0.4s ease forwards`,
                animationDelay: `${index * 0.1}s`,
                opacity: 0
              }}
            >
              {/* Rank Badge */}
              <div className={`park-rank ${getRankClass(rank)}`}>
                {getRankEmoji(rank)}
              </div>
              
              {/* Header */}
              <div className="park-header">
                <div className={`park-icon ${aqiClass}`}>
                  <Leaf size={20} />
                </div>
                <div className="park-name">{park.name}</div>
              </div>
              
              {/* AQI Badge */}
              <div className={`park-aqi ${aqiClass}`} style={{ marginBottom: 16 }}>
                AQI {park.aqi} • {aqiClass === 'good' ? 'Good' : aqiClass === 'moderate' ? 'Moderate' : 'Unhealthy'}
              </div>
              
              {/* Details */}
              <div className="park-details">
                <div className="park-detail">
                  <div className="park-detail-icon">
                    <Activity size={14} style={{ color: '#8B5CF6' }} />
                  </div>
                  <span>Best for: <strong>{park.bestActivity}</strong></span>
                </div>
                <div className="park-detail">
                  <div className="park-detail-icon">
                    <Navigation size={14} style={{ color: '#3B82F6' }} />
                  </div>
                  <span>Distance: <strong>{formatDistance(park.distance)}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
