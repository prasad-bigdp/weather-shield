import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricsGrid } from '../components/Dashboard/MetricsGrid';
import { ParkRecommendations } from '../components/Dashboard/ParkRecommendations';
import { ExerciseTime } from '../components/Dashboard/ExerciseTime';
import { useEnvironmentStore } from '../store/environmentStore';
import { TrendingUp, MapPin, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    currentData, 
    parks, 
    parksLoading, 
    parksError, 
    aqiTrend, 
    loading, 
    error,
    fetchData,
    fetchParksData 
  } = useEnvironmentStore();
  const navigate = useNavigate();


  // Error State - No Data Available
  if (!loading && !currentData && error) {
    return (
      <div className="animate-fade-in">
        <div 
          className="parks-section" 
          style={{ textAlign: 'center', padding: '64px 32px' }}
        >
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}
          >
            <AlertTriangle size={40} style={{ color: '#EF4444' }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            Unable to Load Data
          </h2>
          <p style={{ color: '#6B7280', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
            {error}
          </p>
          
          <button
            onClick={() => { fetchData(); fetchParksData(); }}
            className="section-action"
            style={{ margin: '0 auto' }}
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
          
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 24 }}>
            Make sure your OpenWeatherMap API key is configured
          </p>
        </div>
      </div>
    );
  }

  if (!currentData) return null;

  return (
    <div className="animate-fade-in">
      {/* Error Banner */}
      {error && currentData && (
        <div 
          style={{
            padding: '16px 20px',
            borderRadius: 16,
            background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
            border: '1px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24
          }}
          className="animate-slide-up"
        >
          <AlertTriangle size={20} style={{ color: '#D97706' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, color: '#92400E', marginBottom: 2 }}>Refresh Failed</p>
            <p style={{ fontSize: 14, color: '#A16207' }}>{error}</p>
          </div>
          <button 
            onClick={fetchData}
            style={{
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #FCD34D',
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              color: '#92400E',
              cursor: 'pointer'
            }}
            className="hover-scale"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <MetricsGrid data={currentData} />
      
      {/* Park Recommendations */}
      <ParkRecommendations 
        parks={parks} 
        loading={parksLoading}
        error={parksError}
        onExploreAll={() => navigate('/parks')} 
      />
      
      {/* Exercise Time */}
      <ExerciseTime 
        aqiTrend={aqiTrend} 
        currentAQI={currentData.aqi} 
      />

      {/* Quick Navigation */}
      <div className="quick-nav-grid">
        <div 
          className="quick-nav-card animate-slide-up delay-100 hover-scale hover-glow"
          onClick={() => navigate('/analytics')}
        >
          <div className="quick-nav-header">
            <div className="quick-nav-icon purple">
              <TrendingUp size={24} />
            </div>
            <div>
              <div className="quick-nav-title">View Analytics</div>
              <div className="quick-nav-subtitle">Historical trends & forecasts</div>
            </div>
          </div>
          <div className="quick-nav-action">
            <div style={{ display: 'flex', gap: 4 }}>
              {['#8B5CF6', '#EC4899', '#10B981', '#F59E0B'].map((color, i) => (
                <div 
                  key={i}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: color,
                    border: '2px solid white',
                    marginLeft: i > 0 ? -8 : 0
                  }}
                />
              ))}
            </div>
            <div className="quick-nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Explore <ArrowRight size={14} />
            </div>
          </div>
        </div>

        <div 
          className="quick-nav-card animate-slide-up delay-200 hover-scale hover-glow"
          onClick={() => navigate('/parks')}
        >
          <div className="quick-nav-header">
            <div className="quick-nav-icon green">
              <MapPin size={24} />
            </div>
            <div>
              <div className="quick-nav-title">Explore Parks</div>
              <div className="quick-nav-subtitle">Find parks with best air quality</div>
            </div>
          </div>
          <div className="quick-nav-action">
            <div className="quick-nav-value">
              {parks.length}
              <span>parks tracked</span>
            </div>
            <div className="quick-nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#10B981' }}>
              Discover <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
