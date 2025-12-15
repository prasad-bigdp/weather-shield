import React from 'react';
import type { Alert, EnvironmentalData } from '../../types';
import { Shield, Clock, MapPin, AlertTriangle, Flame } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';
import { getAQIInfo } from '../../utils/aqiCalculator';

interface AlertDisplayProps {
  alert: Alert | null;
  currentData?: EnvironmentalData | null;
  onDismiss?: () => void;
}

export const AlertDisplay: React.FC<AlertDisplayProps> = ({ alert, currentData }) => {
  // No alert or normal state
  if (!alert || alert.type === 'normal') {
    if (!currentData) {
      return (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 48,
          textAlign: 'center',
          color: '#6B7280'
        }}>
          Loading environmental data...
        </div>
      );
    }

    const aqiInfo = getAQIInfo(currentData.aqi);
    const getColor = () => {
      if (aqiInfo.category === 'good') return '#10B981';
      if (aqiInfo.category === 'moderate') return '#F59E0B';
      return '#EF4444';
    };

    return (
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 32,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: `linear-gradient(135deg, ${getColor()}20, ${getColor()}40)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={32} style={{ color: getColor() }} />
          </div>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
              {aqiInfo.label} Air Quality
            </h2>
            <p style={{ color: '#6B7280', fontSize: 15 }}>{aqiInfo.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 24
        }}>
          <div style={{
            padding: 20,
            borderRadius: 12,
            background: '#F9FAFB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>AQI</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: getColor() }}>{currentData.aqi}</div>
            <div style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 20,
              background: `${getColor()}20`,
              color: getColor(),
              fontSize: 12,
              fontWeight: 700,
              marginTop: 8
            }}>
              {aqiInfo.label}
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: '#F9FAFB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>PM2.5</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#374151' }}>{currentData.pm25.toFixed(1)}</div>
            <div style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 20,
              background: '#F3F4F6',
              color: '#6B7280',
              fontSize: 12,
              fontWeight: 600,
              marginTop: 8
            }}>
              µg/m³
            </div>
          </div>

          <div style={{
            padding: 20,
            borderRadius: 12,
            background: '#F9FAFB',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: 8 }}>Alerts</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#374151' }}>0</div>
            <div style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 20,
              background: '#D1FAE5',
              color: '#065F46',
              fontSize: 12,
              fontWeight: 600,
              marginTop: 8
            }}>
              All Clear
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: 12 }}>
            Recommendations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {aqiInfo.recommendations.map((rec, i) => (
              <div key={i} style={{
                padding: 14,
                borderRadius: 10,
                background: '#F9FAFB',
                fontSize: 14,
                color: '#374151'
              }}>
                {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF' }}>
            <Clock size={14} />
            <span>Updated {formatTimestamp(currentData.timestamp)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9CA3AF' }}>
            <MapPin size={14} />
            <span>San Jose</span>
          </div>
        </div>
      </div>
    );
  }

  // Wildfire Alert
  if (alert.type === 'wildfire') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
        borderRadius: 16,
        padding: 32,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Flame size={32} />
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 20,
              background: 'rgba(255,255,255,0.2)',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8
            }}>
              🔥 EMERGENCY ALERT
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{alert.title}</h2>
            <p style={{ opacity: 0.9 }}>{alert.message}</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.2)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={18} />
            <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: 13 }}>Take Immediate Action</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {alert.recommendations.map((rec, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < alert.recommendations.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
              }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700
                }}>
                  {i + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: 13, opacity: 0.8 }}>
          Alert issued: {formatTimestamp(alert.timestamp)}
        </div>
      </div>
    );
  }

  // Pollen Alert
  if (alert.type === 'pollen') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
        borderRadius: 16,
        padding: 32,
        border: '1px solid #FCD34D'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <AlertTriangle size={32} style={{ color: '#D97706' }} />
          </div>
          <div>
            <div style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 20,
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#92400E',
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8
            }}>
              ⚠️ Health Advisory
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#92400E', marginBottom: 4 }}>{alert.title}</h2>
            <p style={{ color: '#A16207' }}>{alert.message}</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.6)',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#92400E', marginBottom: 12 }}>Recommendations</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {alert.recommendations.map((rec, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
                color: '#78350F',
                fontSize: 14
              }}>
                <span style={{ color: '#D97706' }}>→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ fontSize: 13, color: '#92400E' }}>
          Alert issued: {formatTimestamp(alert.timestamp)}
        </div>
      </div>
    );
  }

  // Default alert
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 12 }}>{alert.title}</h2>
      <p style={{ color: '#6B7280', marginBottom: 16 }}>{alert.message}</p>
      {alert.recommendations.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {alert.recommendations.map((rec, i) => (
            <li key={i} style={{ padding: '6px 0', color: '#374151' }}>• {rec}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
