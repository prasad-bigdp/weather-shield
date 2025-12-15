import React from 'react';
import { PM25Chart } from '../components/Charts/PM25Chart';
import { AQIChart } from '../components/Charts/AQIChart';
import { useEnvironmentStore } from '../store/environmentStore';
import { TrendingUp, BarChart2, Activity, AlertTriangle, RefreshCw, Zap, Clock } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { pm25Trend, aqiTrend, loading, error, fetchData } = useEnvironmentStore();

  // Loading state
  if (loading && pm25Trend.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'white', borderRadius: 16, padding: 24, height: 120 }} />
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: 16, padding: 32, height: 300 }} />
      </div>
    );
  }

  // Error state
  if (!loading && pm25Trend.length === 0 && error) {
    return (
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '64px 32px',
        textAlign: 'center'
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <AlertTriangle size={40} style={{ color: '#EF4444' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
          No Analytics Data
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>{error}</p>
        <button
          onClick={fetchData}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            border: 'none', borderRadius: 12,
            color: 'white', fontWeight: 600, fontSize: 14,
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  // Calculate stats
  const avgAqi = aqiTrend.length > 0
    ? Math.round(aqiTrend.reduce((a, b) => a + b.aqi, 0) / aqiTrend.length)
    : 0;

  const pm25Peak = pm25Trend.length > 0
    ? Math.max(...pm25Trend.map(d => d.value))
    : 0;

  const bestTimeIndex = aqiTrend.reduce((best, curr, i) =>
    curr.aqi < (aqiTrend[best]?.aqi ?? Infinity) ? i : best, 0);
  const bestTime = aqiTrend[bestTimeIndex]
    ? new Date(aqiTrend[bestTimeIndex].time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
    : 'N/A';

  const getAQILabel = (aqi: number) => {
    if (aqi <= 50) return { text: 'Good', color: '#10B981' };
    if (aqi <= 100) return { text: 'Moderate', color: '#F59E0B' };
    return { text: 'Unhealthy', color: '#EF4444' };
  };

  const aqiStatus = getAQILabel(avgAqi);

  const statCards = [
    {
      icon: TrendingUp,
      iconBg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      label: '24h Average AQI',
      value: avgAqi.toString(),
      footer: { text: aqiStatus.text, color: aqiStatus.color, suffix: ' air quality' }
    },
    {
      icon: Activity,
      iconBg: 'linear-gradient(135deg, #EC4899, #DB2777)',
      label: 'PM2.5 Peak',
      value: pm25Peak.toFixed(1),
      footer: { text: 'μg/m³', color: '#6B7280', suffix: ' in last 12 hours' }
    },
    {
      icon: Clock,
      iconBg: 'linear-gradient(135deg, #10B981, #059669)',
      label: 'Best Time Today',
      value: bestTime,
      footer: { text: 'Lowest AQI', color: '#10B981', suffix: ' for outdoor activities' }
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20
      }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 24,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                animation: `slideUp 0.4s ease forwards`,
                animationDelay: `${i * 0.1}s`,
                opacity: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: card.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={22} style={{ color: 'white' }} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', marginBottom: 4 }}>{card.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>{card.value}</p>
                </div>
              </div>
              <div style={{ fontSize: 14 }}>
                <span style={{ fontWeight: 600, color: card.footer.color }}>{card.footer.text}</span>
                <span style={{ color: '#9CA3AF' }}>{card.footer.suffix}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #EC4899, #DB2777)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Activity size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>PM2.5 Concentration</h3>
            <p style={{ fontSize: 13, color: '#6B7280' }}>24-hour particle levels</p>
          </div>
        </div>
        <PM25Chart data={pm25Trend} />
      </div>

      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <BarChart2 size={20} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Air Quality Forecast</h3>
            <p style={{ fontSize: 13, color: '#6B7280' }}>24-hour prediction • Color-coded zones</p>
          </div>
        </div>
        <AQIChart data={aqiTrend} />
      </div>

      {/* Insights */}
      {aqiTrend.length > 0 && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Zap size={20} style={{ color: 'white' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Key Insights</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            <div style={{
              padding: 20,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
              border: '1px solid rgba(139,92,246,0.1)'
            }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Air Quality Trend</p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                {avgAqi <= 50
                  ? 'Excellent conditions for outdoor activities all day.'
                  : avgAqi <= 100
                  ? 'Generally safe, but sensitive groups should take precautions.'
                  : 'Consider limiting outdoor exposure today.'}
              </p>
            </div>

            <div style={{
              padding: 20,
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.02))',
              border: '1px solid rgba(16,185,129,0.1)'
            }}>
              <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8 }}>Best Exercise Window</p>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.5 }}>
                {bestTime !== 'N/A'
                  ? `Air quality was best around ${bestTime}. Plan outdoor activities accordingly.`
                  : 'Not enough data to determine best time.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
