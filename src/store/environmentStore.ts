import { create } from 'zustand';
import type { EnvironmentalData, Alert, Park } from '../types';
import {
  fetchEnvironmentalData,
  fetchParksAirQualityBatch,
} from '../services/openWeatherMapService';
import { SAN_JOSE_PARKS } from '../data/parks';
import { getAQICategory } from '../utils/aqiCalculator';

interface EnvironmentStore {
  // Current data
  currentData: EnvironmentalData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;

  // Trend data
  pm25Trend: { time: string; value: number }[];
  aqiTrend: { time: string; aqi: number }[];

  // Parks
  parks: Park[];
  parksLoading: boolean;
  parksError: string | null;

  // Alerts
  currentAlert: Alert | null;
  alertHistory: Alert[];

  // Actions
  fetchData: () => Promise<void>;
  fetchTrends: () => Promise<void>;
  fetchParksData: () => Promise<void>;
  setAlert: (alert: Alert | null) => void;
  triggerDemoAlert: (type: 'normal' | 'pollen' | 'wildfire') => void;
  checkAndGenerateAlerts: (data: EnvironmentalData) => void;
  dismissAlert: () => void;
}

export const useEnvironmentStore = create<EnvironmentStore>((set, get) => ({
  // Initial state
  currentData: null,
  loading: false,
  error: null,
  lastUpdated: null,
  pm25Trend: [],
  aqiTrend: [],
  parks: [],
  parksLoading: false,
  parksError: null,
  currentAlert: null,
  alertHistory: [],

  // Fetch current environmental data AND trends
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const { current, trends } = await fetchEnvironmentalData();
      
      set({
        currentData: current,
        pm25Trend: trends.pm25,
        aqiTrend: trends.aqi,
        loading: false,
        lastUpdated: new Date(),
      });

      // Auto-generate alerts based on real conditions
      get().checkAndGenerateAlerts(current);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to fetch environmental data';
      set({
        error: errorMessage,
        loading: false,
      });
      console.error('Fetch error:', error);
    }
  },

  // Deprecated: Trends are now fetched with main data
  fetchTrends: async () => {
    // No-op - trends included in fetchData
  },

  // Fetch air quality for all parks
  fetchParksData: async () => {
    set({ parksLoading: true, parksError: null });
    try {
      const parkResults = await fetchParksAirQualityBatch(SAN_JOSE_PARKS);

      const parksWithAQI = SAN_JOSE_PARKS.map((park) => {
        const result = parkResults.find((r) => r.id === park.id);
        const aqi = result ? result.aqi : 0;
        return {
          ...park,
          aqi,
          category: getAQICategory(aqi),
        };
      });

      // Sort by best air quality
      parksWithAQI.sort((a, b) => a.aqi - b.aqi);

      set({ parks: parksWithAQI, parksLoading: false, parksError: null });
    } catch (error: any) {
      const errorMessage = error.message || 'Unable to load park air quality';
      set({ parksLoading: false, parksError: errorMessage });
      console.error('Parks fetch error:', error);
    }
  },

  // Set current alert
  setAlert: (alert) => {
    set((state) => ({
      currentAlert: alert,
      alertHistory: alert
        ? [alert, ...state.alertHistory.slice(0, 9)] // Keep last 10 alerts
        : state.alertHistory,
    }));
  },

  // Dismiss current alert (only if dismissible)
  dismissAlert: () => {
    const { currentAlert } = get();
    if (currentAlert?.dismissible) {
      set({ currentAlert: null });
    }
  },

  // Trigger demo/manual alerts for testing
  triggerDemoAlert: (type) => {
    const alerts: Record<string, Alert> = {
      normal: {
        id: 'normal-' + Date.now(),
        type: 'normal',
        severity: 'info',
        title: 'All Clear',
        message: 'Air quality is excellent. Perfect for outdoor activities!',
        recommendations: [
          'Great day for jogging, cycling, or hiking',
          'No health precautions needed',
          'Enjoy the fresh air!',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: true,
      },
      pollen: {
        id: 'pollen-' + Date.now(),
        type: 'pollen',
        severity: 'warning',
        title: '⚠️ High Pollen Alert',
        message: 'Elevated pollen levels detected in your area.',
        recommendations: [
          'Take allergy medication before going outside',
          'Keep windows closed during peak hours (6-10 AM)',
          'Shower and change clothes after outdoor activities',
          'Consider wearing a mask outdoors',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: true,
      },
      wildfire: {
        id: 'wildfire-' + Date.now(),
        type: 'wildfire',
        severity: 'danger',
        title: '🔥 WILDFIRE SMOKE ALERT',
        message: 'UNHEALTHY AIR QUALITY — Stay Indoors',
        recommendations: [
          'DO NOT exercise outdoors',
          'Keep all windows and doors closed',
          'Run air purifiers on highest setting',
          'Wear N95 masks if you must go outside',
          'Check on elderly and sensitive individuals',
          'Monitor air quality frequently',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: false, // Cannot dismiss wildfire alerts
      },
    };

    get().setAlert(alerts[type]);
  },

  // Auto-check conditions and generate alerts
  checkAndGenerateAlerts: (data: EnvironmentalData) => {
    // Wildfire/Unhealthy air alert (AQI > 150)
    if (data.aqi > 150) {
      get().triggerDemoAlert('wildfire');
      return;
    }

    // Very unhealthy (AQI > 100) - still serious
    if (data.aqi > 100) {
      get().setAlert({
        id: 'unhealthy-' + Date.now(),
        type: 'wildfire',
        severity: 'warning',
        title: '⚠️ Unhealthy Air Quality',
        message: `AQI is ${data.aqi} — Limit outdoor exposure`,
        recommendations: [
          'Reduce prolonged or heavy outdoor exertion',
          'Sensitive groups should stay indoors',
          'Keep windows closed',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: true,
      });
      return;
    }

    // High pollen alert
    if (data.pollenLevel > 6) {
      get().triggerDemoAlert('pollen');
      return;
    }

    // Moderate pollen (warning)
    if (data.pollenLevel > 4) {
      get().setAlert({
        id: 'pollen-moderate-' + Date.now(),
        type: 'pollen',
        severity: 'info',
        title: 'Moderate Pollen Levels',
        message: `Pollen count: ${data.pollenLevel.toFixed(1)} — ${data.pollenTypes.join(', ') || 'Mixed'}`,
        recommendations: [
          'Allergy sufferers may want to take precautions',
          'Best times: early morning or after rain',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: true,
      });
      return;
    }

    // High UV warning
    if (data.uvIndex > 7) {
      get().setAlert({
        id: 'uv-' + Date.now(),
        type: 'uv',
        severity: 'warning',
        title: '☀️ High UV Index',
        message: `UV Index: ${data.uvIndex.toFixed(1)} — Protect your skin`,
        recommendations: [
          'Apply SPF 30+ sunscreen',
          'Wear hat and sunglasses',
          'Seek shade between 10 AM - 4 PM',
        ],
        timestamp: new Date(),
        active: true,
        dismissible: true,
      });
      return;
    }

    // All clear - good conditions
    if (data.aqi <= 50) {
      get().triggerDemoAlert('normal');
    }
  },
}));
