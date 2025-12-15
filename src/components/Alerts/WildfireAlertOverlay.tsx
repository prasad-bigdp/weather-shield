import type { Alert, EnvironmentalData } from '../../types';
import { AlertTriangle, Shield, Flame, Wind, X } from 'lucide-react';
import { useEnvironmentStore } from '../../store/environmentStore';

interface WildfireAlertOverlayProps {
  alert: Alert;
  currentData: EnvironmentalData | null;
}

export const WildfireAlertOverlay: React.FC<WildfireAlertOverlayProps> = ({ 
  alert, 
  currentData 
}) => {
  const { dismissAlert } = useEnvironmentStore();

  // Only show for wildfire/danger alerts
  if (alert.type !== 'wildfire' || alert.severity !== 'danger') {
    return null;
  }

  const handleDismiss = () => {
    if (alert.dismissible) {
      dismissAlert();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'auto',
      }}
      role="alertdialog"
      aria-labelledby="wildfire-title"
    >
      {/* Animated Background Effects */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          transform: 'translateX(-50%)',
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Dismiss Button (Only if dismissible) */}
      {alert.dismissible && (
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          aria-label="Dismiss alert"
        >
          <X size={24} />
        </button>
      )}

      {/* Main Content Card */}
      <div
        style={{
          position: 'relative',
          maxWidth: '560px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        {/* Fire Icon with Glow */}
        <div
          style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 60px rgba(239, 68, 68, 0.5), 0 0 120px rgba(239, 68, 68, 0.3)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        >
          <Flame size={48} color="white" />
        </div>

        {/* Emergency Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '24px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#FCA5A5',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '16px',
          }}
        >
          <AlertTriangle size={14} />
          <span>Emergency Alert</span>
        </div>

        {/* Title */}
        <h1
          id="wildfire-title"
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'white',
            margin: '0 0 12px 0',
            letterSpacing: '-0.5px',
            lineHeight: 1.2,
          }}
        >
          {alert.title}
        </h1>

        {/* Message */}
        <p
          style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.7)',
            margin: '0 0 32px 0',
            lineHeight: 1.5,
          }}
        >
          {alert.message}
        </p>

        {/* AQI Display */}
        {currentData && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              padding: '24px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Wind size={28} color="#EF4444" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#EF4444', lineHeight: 1 }}>
                  {currentData.aqi}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Current AQI
                </div>
              </div>
            </div>
            <div style={{ width: '1px', height: '48px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FCA5A5', lineHeight: 1 }}>
                {currentData.pm25?.toFixed(1)}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                PM2.5 µg/m³
              </div>
            </div>
          </div>
        )}

        {/* Safety Recommendations */}
        <div
          style={{
            textAlign: 'left',
            padding: '24px',
            borderRadius: '16px',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            <Shield size={18} />
            <span>Safety Recommendations</span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {alert.recommendations.map((rec, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 0',
                  borderBottom: index < alert.recommendations.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: '15px',
                  lineHeight: 1.5,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: '24px',
                    height: '24px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FCA5A5',
                  }}
                >
                  {index + 1}
                </span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Non-dismissible Notice */}
        {!alert.dismissible && (
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <AlertTriangle size={14} />
            <span>This alert cannot be dismissed while conditions are dangerous</span>
          </p>
        )}
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
        }
      `}</style>
    </div>
  );
};
