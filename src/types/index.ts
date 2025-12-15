// Environmental Data Types
export interface EnvironmentalData {
  aqi: number;
  pm25: number;
  pm10: number;
  temperature: number | null;
  feelsLike: number | null;
  humidity: number | null;
  uvIndex: number;
  pollenLevel: number;
  pollenTypes: string[];
  timestamp: Date;
  weatherAvailable: boolean;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: number | string;
  unit: string;
  category: AQICategory;
  icon: string;
  description: string;
}

export type AQICategory = 'good' | 'moderate' | 'sensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';

export interface AQIInfo {
  value: number;
  category: AQICategory;
  color: string;
  gradient: string;
  label: string;
  description: string;
  recommendations: string[];
}

// Park Types
export interface Park {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  aqi: number;
  category: AQICategory;
  bestActivity: string;
  distance: number;
  amenities: string[];
  difficulty: 'easy' | 'moderate' | 'hard';
}

// Alert Types
export type AlertType = 'normal' | 'pollen' | 'wildfire' | 'heat' | 'uv';

export interface Alert {
  id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'danger';
  title: string;
  message: string;
  recommendations: string[];
  timestamp: Date;
  active: boolean;
  dismissible: boolean;
}

// Chart Data Types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  category?: AQICategory;
}

export interface PM25TrendData {
  data: ChartDataPoint[];
  lastUpdated: Date;
}

export interface AQITrendData {
  data: ChartDataPoint[];
  lastUpdated: Date;
}

// User Preferences Types
export interface UserPreferences {
  location: {
    city: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  alerts: {
    email: boolean;
    pollen: boolean;
    wildfire: boolean;
    highAQI: boolean;
  };
  notifications: {
    morningBriefing: string; // Time in HH:mm format
    eveningUpdate: string;
  };
  activities: string[];
  sensitivity: 'normal' | 'sensitive';
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  memberSince: Date;
  preferences: UserPreferences;
}

// API Response Types
export interface OpenMeteoResponse {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    pm10: number;
    pm2_5: number;
    uv_index: number;
    us_aqi?: number;
    alder_pollen?: number;
    birch_pollen?: number;
    grass_pollen?: number;
    mugwort_pollen?: number;
    olive_pollen?: number;
    ragweed_pollen?: number;
  };
  hourly: {
    time: string[];
    pm2_5: number[];
    pm10: number[];
    uv_index: number[];
  };
  daily?: {
    uv_index_max: number[];
  };
}

export interface PollenResponse {
  daily: {
    time: string[];
    pollen_birch: number[];
    pollen_grass: number[];
    pollen_olive: number[];
  };
}
