import React from 'react';
import { AlertDisplay } from '../components/Alerts/AlertDisplay';
import { AlertHistory } from '../components/Alerts/AlertHistory';
import { DemoControls } from '../components/Alerts/DemoControls';
import { useEnvironmentStore } from '../store/environmentStore';
import { 
  Shield, CheckCircle, AlertTriangle,
  MapPin, Clock, Wind, Activity, RefreshCw,
  ThermometerSun, Droplets, TreePine, Sun
} from 'lucide-react';
import { getAQIInfo } from '../utils/aqiCalculator';

export const Alerts: React.FC = () => {
  const { currentAlert, alertHistory, currentData, fetchData, loading, triggerDemoAlert } = useEnvironmentStore();

  const hasActiveAlert = currentAlert && currentAlert.active && currentAlert.type !== 'normal';
  const aqiInfo = currentData ? getAQIInfo(currentData.aqi) : null;

  const getStatusInfo = () => {
    if (!currentData) return { color: '#6B7280', label: 'Loading...', icon: <RefreshCw size={24} className="spin" /> };
    
    if (hasActiveAlert) {
      if (currentAlert.severity === 'danger') {
        return { color: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444, #DC2626)', label: 'Emergency Alert', icon: <AlertTriangle size={28} /> };
      }
      if (currentAlert.severity === 'warning') {
        return { color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B, #D97706)', label: 'Warning Active', icon: <AlertTriangle size={28} /> };
      }
    }
    
    return { 
      color: '#10B981', 
      gradient: 'linear-gradient(135deg, #10B981, #059669)', 
      label: 'All Clear', 
      icon: <CheckCircle size={28} /> 
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="alerts-page animate-fade-in">
      {/* Hero Status Banner */}
      <div className="alerts-hero animate-slide-up" style={{ background: statusInfo.gradient || 'linear-gradient(135deg, #10B981, #059669)' }}>
        <div className="hero-pattern animate-pulse-ring">
          <Shield size={180} strokeWidth={0.5} />
        </div>
        
        <div className="hero-content-wrapper">
          <div className="status-icon-large animate-bounce-in">
            {statusInfo.icon}
          </div>
          
          <div className="status-info">
            <span className="status-badge">{statusInfo.label}</span>
            <h1 className="status-title">
              {hasActiveAlert ? currentAlert.title : 'Weather Shield Quality Status'}
            </h1>
            <p className="status-description">
              {hasActiveAlert 
                ? currentAlert.message 
                : currentData 
                  ? `Current AQI is ${currentData.aqi} - ${aqiInfo?.description || 'Safe for outdoor activities'}`
                  : 'Loading environmental data...'}
            </p>
          </div>

          <button 
            className="refresh-button-hero hover-scale hover-glow" 
            onClick={() => fetchData()}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Updating...' : 'Refresh Data'}</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat animate-slide-up delay-100 hover-scale">
            <Wind size={18} />
            <span className="stat-value">{currentData?.aqi || '--'}</span>
            <span className="stat-label">AQI</span>
          </div>
          <div className="hero-stat animate-slide-up delay-200 hover-scale">
            <ThermometerSun size={18} />
            <span className="stat-value">{currentData && currentData.temperature !== null ? `${Math.round(currentData.temperature)}°` : '--'}</span>
            <span className="stat-label">Temp</span>
          </div>
          <div className="hero-stat animate-slide-up delay-300 hover-scale">
            <Droplets size={18} />
            <span className="stat-value">{currentData?.humidity || '--'}%</span>
            <span className="stat-label">Humidity</span>
          </div>
          <div className="hero-stat animate-slide-up delay-400 hover-scale">
            <Sun size={18} />
            <span className="stat-value">{currentData?.uvIndex?.toFixed(1) || '--'}</span>
            <span className="stat-label">UV Index</span>
          </div>
        </div>
      </div>

      {/* Demo Controls Section */}
      <DemoControls 
        onTriggerAlert={triggerDemoAlert} 
        activeType={currentAlert?.type === 'normal' || !hasActiveAlert ? 'normal' : currentAlert?.type}
      />

      {/* Real-time Metrics Cards */}
      <div className="alerts-metrics-section">
        <div className="section-header-alerts">
          <div className="section-icon-alerts">
            <Activity size={22} />
          </div>
          <div>
            <h2>Live Environmental Metrics</h2>
            <p>Real-time data from San Jose monitoring stations</p>
          </div>
          <div className="location-badge">
            <MapPin size={14} />
            <span>San Jose, CA</span>
          </div>
        </div>

        <div className="metrics-cards-grid">
          <div className="metric-card-alert animate-slide-up delay-100 hover-glow">
            <div className="metric-header">
              <div className="metric-icon-alert" style={{ background: getAQIColor(currentData?.aqi || 0) }}>
                <Wind size={24} />
              </div>
              <div className="metric-trend">
                <span className="trend-value">{currentData?.aqi || '--'}</span>
              </div>
            </div>
            <div className="metric-body">
              <h3>Air Quality Index</h3>
              <p className="metric-status" style={{ color: getAQIColor(currentData?.aqi || 0) }}>
                {aqiInfo?.label || 'Loading...'}
              </p>
            </div>
            <div className="metric-footer">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.min((currentData?.aqi || 0) / 3, 100)}%`,
                    background: getAQIColor(currentData?.aqi || 0)
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="metric-card-alert animate-slide-up delay-200 hover-glow">
            <div className="metric-header">
              <div className="metric-icon-alert gradient-purple">
                <TreePine size={24} />
              </div>
              <div className="metric-trend">
                <span className="trend-value">{currentData?.pollenLevel?.toFixed(1) || '--'}</span>
              </div>
            </div>
            <div className="metric-body">
              <h3>Pollen Level</h3>
              <p className="metric-status">
                {currentData?.pollenTypes?.join(', ') || 'Low activity'}
              </p>
            </div>
            <div className="metric-footer">
              <div className="pollen-indicators">
                {(currentData?.pollenTypes || []).map((type, i) => (
                  <span key={i} className="pollen-tag">{type}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="metric-card-alert animate-slide-up delay-300 hover-glow">
            <div className="metric-header">
              <div className="metric-icon-alert gradient-orange">
                <Sun size={24} />
              </div>
              <div className="metric-trend">
                <span className="trend-value">{currentData?.uvIndex?.toFixed(1) || '--'}</span>
              </div>
            </div>
            <div className="metric-body">
              <h3>UV Index</h3>
              <p className="metric-status">
                {getUVLevel(currentData?.uvIndex || 0)}
              </p>
            </div>
            <div className="metric-footer">
              <div className="uv-scale">
                <div className="uv-marker" style={{ left: `${Math.min((currentData?.uvIndex || 0) * 9, 100)}%` }}></div>
              </div>
            </div>
          </div>

          <div className="metric-card-alert animate-slide-up delay-400 hover-glow">
            <div className="metric-header">
              <div className="metric-icon-alert gradient-cyan">
                <Droplets size={24} />
              </div>
              <div className="metric-trend">
                <span className="trend-value">{currentData?.pm25?.toFixed(1) || '--'}</span>
              </div>
            </div>
            <div className="metric-body">
              <h3>PM2.5 Particles</h3>
              <p className="metric-status">µg/m³</p>
            </div>
            <div className="metric-footer">
              <span className="last-updated">
                <Clock size={12} />
                Updated just now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Alert Display */}
      <AlertDisplay alert={currentAlert} currentData={currentData} />

      {/* Alert History */}
      <AlertHistory alerts={alertHistory} />

      {/* Safety Tips Section */}
      <div className="safety-tips-section">
        <div className="section-header-alerts">
          <div className="section-icon-alerts gradient-teal">
            <Shield size={22} />
          </div>
          <div>
            <h2>Safety Recommendations</h2>
            <p>Based on current San Jose conditions</p>
          </div>
        </div>

        <div className="tips-grid">
          {aqiInfo?.recommendations.map((rec, i) => (
            <div key={i} className="tip-card">
              <div className="tip-number">{i + 1}</div>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#10B981';
  if (aqi <= 100) return '#F59E0B';
  if (aqi <= 150) return '#F97316';
  return '#EF4444';
}

function getUVLevel(uv: number): string {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}
