import React, { useState } from 'react';
import { 
  Play, CheckCircle, AlertTriangle, Flame, 
  Zap, Sparkles, Monitor
} from 'lucide-react';

interface DemoControlsProps {
  onTriggerAlert: (type: 'normal' | 'pollen' | 'wildfire') => void;
  activeType?: string;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ onTriggerAlert, activeType }) => {
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const scenarios = [
    {
      type: 'normal' as const,
      icon: <CheckCircle size={24} />,
      title: 'All Clear',
      desc: 'Safe outdoor conditions',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      bgLight: 'rgba(16, 185, 129, 0.1)',
      borderColor: '#10B981',
      textColor: '#059669',
    },
    {
      type: 'pollen' as const,
      icon: <AlertTriangle size={24} />,
      title: 'High Pollen',
      desc: 'Allergy advisory active',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      bgLight: 'rgba(245, 158, 11, 0.1)',
      borderColor: '#F59E0B',
      textColor: '#D97706',
    },
    {
      type: 'wildfire' as const,
      icon: <Flame size={24} />,
      title: 'Wildfire Emergency',
      desc: 'Hazardous air quality',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)',
      bgLight: 'rgba(239, 68, 68, 0.1)',
      borderColor: '#EF4444',
      textColor: '#DC2626',
    }
  ];

  return (
    <div className="demo-controls-container">
      <div className="demo-header">
        <div className="demo-icon">
          <Monitor size={20} />
        </div>
        <div className="demo-info">
          <h3>Alert Demo Mode</h3>
          <p>Click to simulate different environmental scenarios</p>
        </div>
        <div className="demo-badge">
          <Sparkles size={14} />
          <span>Interactive</span>
        </div>
      </div>

      <div className="demo-scenarios-grid">
        {scenarios.map((scenario) => {
          const isActive = activeType === scenario.type;
          const isHovered = hoveredType === scenario.type;
          
          return (
            <button
              key={scenario.type}
              className={`demo-scenario-card ${isActive ? 'active' : ''}`}
              onClick={() => onTriggerAlert(scenario.type)}
              onMouseEnter={() => setHoveredType(scenario.type)}
              onMouseLeave={() => setHoveredType(null)}
              style={{
                '--card-gradient': scenario.gradient,
                '--card-bg-light': scenario.bgLight,
                '--card-border': scenario.borderColor,
                '--card-text': scenario.textColor,
              } as React.CSSProperties}
            >
              {/* Animated Background */}
              <div className="card-glow-effect"></div>
              
              {/* Icon */}
              <div className="scenario-icon-wrapper">
                <div 
                  className="scenario-icon" 
                  style={{ background: isActive || isHovered ? scenario.gradient : scenario.bgLight }}
                >
                  <span style={{ color: isActive || isHovered ? 'white' : scenario.textColor }}>
                    {scenario.icon}
                  </span>
                </div>
                {isActive && (
                  <div className="active-pulse" style={{ borderColor: scenario.borderColor }}></div>
                )}
              </div>

              {/* Content */}
              <div className="scenario-content">
                <h4>{scenario.title}</h4>
                <p>{scenario.desc}</p>
              </div>

              {/* Action */}
              <div className="scenario-action">
                {isActive ? (
                  <div className="active-indicator" style={{ background: scenario.gradient }}>
                    <Zap size={14} />
                    <span>Active</span>
                  </div>
                ) : (
                  <div className="play-button">
                    <Play size={16} />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="demo-footer">
        <span className="demo-hint">
          <Zap size={12} />
          Alerts are triggered with real-time San Jose data context
        </span>
      </div>
    </div>
  );
};
