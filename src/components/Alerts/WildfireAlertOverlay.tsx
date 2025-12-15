import React from 'react';
import type { Alert, EnvironmentalData } from '../../types';
import { AlertTriangle, Shield, Flame, X } from 'lucide-react';

interface WildfireAlertOverlayProps {
  alert: Alert;
  currentData: EnvironmentalData | null;
}

export const WildfireAlertOverlay: React.FC<WildfireAlertOverlayProps> = ({ 
  alert, 
  currentData 
}) => {
  // Only show for wildfire/danger alerts
  if (alert.type !== 'wildfire' || alert.severity !== 'danger') {
    return null;
  }

  return (
    <div className="wildfire-alert-overlay" role="alertdialog" aria-labelledby="wildfire-title">
      {/* Pulsing Fire Icon */}
      <div className="wildfire-icon">🔥</div>
      
      {/* Title */}
      <h1 id="wildfire-title" className="wildfire-title">
        {alert.title}
      </h1>
      
      {/* Message */}
      <p className="wildfire-message">
        {alert.message}
      </p>
      
      {/* Current AQI Display */}
      {currentData && (
        <>
          <div className="wildfire-aqi">{currentData.aqi}</div>
          <div className="wildfire-aqi-label">Current AQI</div>
        </>
      )}
      
      {/* Safety Recommendations */}
      <div className="wildfire-recommendations">
        <h4>
          <Shield size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Safety Recommendations
        </h4>
        <ul>
          {alert.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
      
      {/* Non-dismissible notice */}
      <p className="wildfire-dismiss-note">
        <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px' }} />
        This alert cannot be dismissed while conditions are dangerous
      </p>
    </div>
  );
};
