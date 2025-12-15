import { useState, useEffect } from 'react';
import { Wind, CloudSun, Leaf, Droplets, ThermometerSun, ShieldCheck, Activity } from 'lucide-react';

const MESSAGES = [
  "Connecting to satellite network...",
  "Calibrating precision air sensors...",
  "Analyzing particulate matter (PM2.5)...",
  "Checking pollen distribution...",
  "Calculating real-time UV index...",
  "Optimizing weather algorithms...",
  "Syncing with local monitoring stations..."
];

const ICONS = [ShieldCheck, Wind, CloudSun, Leaf, Droplets, ThermometerSun, Activity];

export const CreativeLoader = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [iconIndex, setIconIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);

    const iconInterval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % ICONS.length);
    }, 2200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(iconInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const CurrentIcon = ICONS[iconIndex];

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f7ff 0%, #ffffff 50%, #f0f9ff 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Animated Background Orbs */}
      <div 
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '50%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite reverse',
        }}
      />

      {/* Main Content Card */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 56px',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '32px',
          boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.1), 0 4px 25px -5px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          maxWidth: '420px',
          width: '90%',
        }}
      >
        {/* Radar Scanner Animation */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          {/* Outer Pulse Ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-16px',
              borderRadius: '50%',
              border: '2px solid rgba(139, 92, 246, 0.2)',
              animation: 'pulse-ring 2s ease-out infinite',
            }}
          />
          
          {/* Spinning Scanner */}
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#8B5CF6',
              borderLeftColor: 'rgba(139, 92, 246, 0.4)',
              animation: 'spin 2s linear infinite',
            }}
          />

          {/* Core Circle */}
          <div
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f7ff 100%)',
              boxShadow: '0 10px 40px -10px rgba(139, 92, 246, 0.3), inset 0 -2px 10px rgba(139, 92, 246, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '4px solid white',
            }}
          >
            <CurrentIcon 
              size={48} 
              color="#7C3AED"
              strokeWidth={1.5}
              style={{ animation: 'bounce-gentle 2s ease-in-out infinite' }}
            />
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1f2937 0%, #4b5563 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px',
          }}
        >
          Weather Shield
        </h1>
        
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#8B5CF6',
            textTransform: 'uppercase',
            letterSpacing: '3px',
            margin: '0 0 32px 0',
          }}
        >
          Environment Monitor
        </p>

        {/* Status Message */}
        <div
          style={{
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
          }}
        >
          <p
            key={messageIndex}
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#6b7280',
              margin: 0,
              animation: 'fadeInUp 0.4s ease-out',
            }}
          >
            {MESSAGES[messageIndex]}
          </p>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '6px',
            background: '#f3f4f6',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #8B5CF6 0%, #a78bfa 50%, #7c3aed 100%)',
              borderRadius: '10px',
              transition: 'width 0.5s ease-out',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          </div>
        </div>

        {/* Connection Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '20px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
              animation: 'pulse 2s infinite',
            }}
          />
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              margin: 0,
            }}
          >
            Secure Connection
          </p>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
