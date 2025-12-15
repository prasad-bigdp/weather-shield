import React from 'react';
import type { Alert } from '../../types';
import { CheckCircle, AlertTriangle, Flame, History, Calendar } from 'lucide-react';
import { formatTimestamp } from '../../utils/formatters';

interface AlertHistoryProps {
  alerts: Alert[];
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts }) => {
  if (alerts.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: 16,
        padding: '48px 32px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: '#F3F4F6',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <History size={28} style={{ color: '#9CA3AF' }} />
        </div>
        <h4 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 8 }}>No Recent Alerts</h4>
        <p style={{ color: '#6B7280', fontSize: 14 }}>Your alert history will appear here</p>
      </div>
    );
  }

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'wildfire':
        return { icon: <Flame size={16} />, bg: '#FEE2E2', color: '#991B1B', label: 'Wildfire' };
      case 'pollen':
        return { icon: <AlertTriangle size={16} />, bg: '#FEF3C7', color: '#92400E', label: 'Pollen' };
      default:
        return { icon: <CheckCircle size={16} />, bg: '#D1FAE5', color: '#065F46', label: 'Info' };
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #6B7280, #4B5563)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <History size={22} style={{ color: 'white' }} />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>Alert History</h3>
            <p style={{ fontSize: 13, color: '#6B7280' }}>Recent environmental alerts</p>
          </div>
        </div>
        <div style={{
          padding: '6px 12px',
          background: '#F3F4F6',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          color: '#374151'
        }}>
          {alerts.length} total
        </div>
      </div>

      {/* Alert List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {alerts.slice(0, 5).map((alert, index) => {
          const style = getAlertStyle(alert.type);
          return (
            <div
              key={alert.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16,
                borderRadius: 12,
                background: '#F9FAFB',
                transition: 'background 0.2s',
                animation: `slideUp 0.4s ease forwards`,
                animationDelay: `${index * 0.05}s`,
                opacity: 0
              }}
            >
              {/* Icon */}
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: style.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: style.color
              }}>
                {style.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 10,
                    background: style.bg,
                    color: style.color,
                    fontSize: 11,
                    fontWeight: 700
                  }}>
                    {style.label}
                  </span>
                  {!alert.active && (
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 11, color: '#10B981', fontWeight: 600
                    }}>
                      <CheckCircle size={10} />
                      Resolved
                    </span>
                  )}
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                  {alert.title}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9CA3AF' }}>
                  <Calendar size={12} />
                  <span>{formatTimestamp(alert.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All */}
      {alerts.length > 5 && (
        <button style={{
          width: '100%',
          marginTop: 16,
          padding: 12,
          background: '#F3F4F6',
          border: 'none',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
          color: '#374151',
          cursor: 'pointer'
        }}>
          View All {alerts.length} Alerts
        </button>
      )}
    </div>
  );
};
