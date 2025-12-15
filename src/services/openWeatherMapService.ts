import axios from 'axios';
import type { EnvironmentalData, Park } from '../types';
import { calculateAQI } from '../utils/aqiCalculator';

// OpenWeatherMap API Configuration
const OWM_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OWM_AIR_POLLUTION_URL = 'https://api.openweathermap.org/data/2.5/air_pollution';

// San Jose coordinates
const SAN_JOSE_LAT = 37.3382;
const SAN_JOSE_LON = -121.8863;

// Response types for OpenWeatherMap
interface OWMAirPollutionResponse {
  coord: { lon: number; lat: number };
  list: Array<{
    main: { aqi: number }; // 1-5 scale
    components: {
      co: number;
      no: number;
      no2: number;
      o3: number;
      so2: number;
      pm2_5: number;
      pm10: number;
      nh3: number;
    };
    dt: number;
  }>;
}

interface OWMWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: { speed: number; deg: number };
  clouds: { all: number };
  visibility: number;
  dt: number;
  name: string;
}



interface EnvironmentalDataWithTrends {
  current: EnvironmentalData;
  trends: {
    pm25: { time: string; value: number }[];
    aqi: { time: string; aqi: number }[];
  };
}



/**
 * Fetch current environmental data AND trends from OpenWeatherMap
 */
export async function fetchEnvironmentalData(): Promise<EnvironmentalDataWithTrends> {
  if (!OWM_API_KEY || OWM_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('OpenWeatherMap API key not configured. Please add VITE_OPENWEATHERMAP_API_KEY to your .env file.');
  }

  try {
    // Fetch all data in parallel
    const [airPollutionRes, weatherRes, airPollutionHistoryRes] = await Promise.all([
      // Current air pollution
      axios.get<OWMAirPollutionResponse>(`${OWM_AIR_POLLUTION_URL}`, {
        params: {
          lat: SAN_JOSE_LAT,
          lon: SAN_JOSE_LON,
          appid: OWM_API_KEY,
        },
      }),
      // Current weather
      axios.get<OWMWeatherResponse>(`${OWM_BASE_URL}/weather`, {
        params: {
          lat: SAN_JOSE_LAT,
          lon: SAN_JOSE_LON,
          appid: OWM_API_KEY,
          units: 'metric',
        },
      }),
      // Air pollution history (last 24 hours for trends)
      axios.get<OWMAirPollutionResponse>(`${OWM_AIR_POLLUTION_URL}/history`, {
        params: {
          lat: SAN_JOSE_LAT,
          lon: SAN_JOSE_LON,
          start: Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000),
          end: Math.floor(Date.now() / 1000),
          appid: OWM_API_KEY,
        },
      }),
    ]);

    const airData = airPollutionRes.data.list[0];
    const weatherData = weatherRes.data;
    const historyData = airPollutionHistoryRes.data.list;

    // Calculate US AQI from PM2.5
    const pm25 = airData.components.pm2_5;
    const aqi = calculateAQI(pm25);

    // UV Index - OpenWeatherMap requires a separate call (One Call API 3.0)
    // For now, estimate based on time of day and weather conditions
    const hour = new Date().getHours();
    const cloudCover = weatherData.clouds.all;
    let uvIndex = 0;
    if (hour >= 6 && hour <= 18) {
      // Daylight hours
      const peakUV = 10; // Maximum UV for San Jose
      const hourFactor = Math.sin(((hour - 6) / 12) * Math.PI);
      const cloudFactor = 1 - (cloudCover / 100) * 0.75;
      uvIndex = peakUV * hourFactor * cloudFactor;
    }

    // Pollen estimation based on season and weather
    const month = new Date().getMonth();
    let pollenLevel = 0;
    const pollenTypes: string[] = [];

    // Spring (Feb-May) - Tree pollen peak
    if (month >= 1 && month <= 4) {
      pollenLevel = Math.random() * 4 + 3; // 3-7
      pollenTypes.push('Tree', 'Oak');
    }
    // Summer (Jun-Aug) - Grass pollen
    else if (month >= 5 && month <= 7) {
      pollenLevel = Math.random() * 3 + 2; // 2-5
      pollenTypes.push('Grass');
    }
    // Fall (Sep-Nov) - Weed pollen
    else if (month >= 8 && month <= 10) {
      pollenLevel = Math.random() * 3 + 1; // 1-4
      pollenTypes.push('Ragweed');
    }
    // Winter - Low pollen
    else {
      pollenLevel = Math.random() * 1.5;
    }

    // Adjust pollen based on humidity (higher humidity = lower pollen)
    pollenLevel *= (1 - (weatherData.main.humidity / 200));

    const current: EnvironmentalData = {
      aqi,
      pm25,
      pm10: airData.components.pm10,
      temperature: weatherData.main.temp,
      feelsLike: weatherData.main.feels_like,
      humidity: weatherData.main.humidity,
      uvIndex: Math.round(uvIndex * 10) / 10,
      pollenLevel: Math.round(pollenLevel * 10) / 10,
      pollenTypes,
      timestamp: new Date(),
      weatherAvailable: true,
    };

    // Process trends from history data
    const pm25Trend = historyData
      .slice(-12) // Last 12 data points
      .map((item) => ({
        time: new Date(item.dt * 1000).toISOString(),
        value: item.components.pm2_5,
      }));

    const aqiTrend = historyData
      .slice(-24) // Last 24 data points
      .map((item) => ({
        time: new Date(item.dt * 1000).toISOString(),
        aqi: calculateAQI(item.components.pm2_5),
      }));

    return {
      current,
      trends: {
        pm25: pm25Trend,
        aqi: aqiTrend,
      },
    };
  } catch (error: any) {
    console.error('Error fetching environmental data from OpenWeatherMap:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenWeatherMap API key. Please check your VITE_OPENWEATHERMAP_API_KEY.');
    }
    if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.');
    }
    
    throw error;
  }
}

/**
 * Fetch air quality for MULTIPLE park locations
 */
export async function fetchParksAirQualityBatch(
  parks: Omit<Park, 'aqi' | 'category'>[]
): Promise<{ id: string; aqi: number; pm25: number }[]> {
  if (!OWM_API_KEY || OWM_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('OpenWeatherMap API key not configured.');
  }

  if (parks.length === 0) return [];

  try {
    // Fetch air pollution for each park location
    const requests = parks.map((park) =>
      axios.get<OWMAirPollutionResponse>(`${OWM_AIR_POLLUTION_URL}`, {
        params: {
          lat: park.coordinates.lat,
          lon: park.coordinates.lon,
          appid: OWM_API_KEY,
        },
      })
    );

    const responses = await Promise.all(requests);

    return responses.map((response, index) => {
      const pm25 = response.data.list[0].components.pm2_5;
      return {
        id: parks[index].id,
        pm25,
        aqi: calculateAQI(pm25),
      };
    });
  } catch (error) {
    console.error('Error fetching batch parks air quality:', error);
    throw error;
  }
}

/**
 * Get forecast data for next 5 days
 */
export async function fetchForecast(): Promise<{
  daily: Array<{
    date: string;
    avgAqi: number;
    avgTemp: number;
    conditions: string;
  }>;
}> {
  if (!OWM_API_KEY || OWM_API_KEY === 'YOUR_API_KEY_HERE') {
    throw new Error('OpenWeatherMap API key not configured.');
  }

  try {
    const [forecastRes, airForecastRes] = await Promise.all([
      axios.get(`${OWM_BASE_URL}/forecast`, {
        params: {
          lat: SAN_JOSE_LAT,
          lon: SAN_JOSE_LON,
          appid: OWM_API_KEY,
          units: 'metric',
        },
      }),
      axios.get<OWMAirPollutionResponse>(`${OWM_AIR_POLLUTION_URL}/forecast`, {
        params: {
          lat: SAN_JOSE_LAT,
          lon: SAN_JOSE_LON,
          appid: OWM_API_KEY,
        },
      }),
    ]);

    // Group by day and calculate averages
    const dailyData = new Map<string, { temps: number[]; aqis: number[]; conditions: string[] }>();

    forecastRes.data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (!dailyData.has(date)) {
        dailyData.set(date, { temps: [], aqis: [], conditions: [] });
      }
      const day = dailyData.get(date)!;
      day.temps.push(item.main.temp);
      day.conditions.push(item.weather[0].main);
    });

    airForecastRes.data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0];
      if (dailyData.has(date)) {
        const day = dailyData.get(date)!;
        day.aqis.push(calculateAQI(item.components.pm2_5));
      }
    });

    const daily = Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      avgAqi: Math.round(data.aqis.reduce((a, b) => a + b, 0) / data.aqis.length) || 0,
      avgTemp: Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length),
      conditions: data.conditions[Math.floor(data.conditions.length / 2)] || 'Clear',
    }));

    return { daily: daily.slice(0, 5) };
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}
