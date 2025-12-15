import type { Park } from '../types';

/**
 * San Jose Parks Database
 * Coordinates are real locations in San Jose, CA
 */
export const SAN_JOSE_PARKS: Omit<Park, 'aqi' | 'category'>[] = [
  {
    id: 'guadalupe-river-trail',
    name: 'Guadalupe River Trail',
    coordinates: { lat: 37.3352, lon: -121.8811 },
    bestActivity: 'Jogging',
    distance: 2.1,
    amenities: ['Paved trail', 'Bike path', 'River views', 'Dog-friendly'],
    difficulty: 'easy',
  },
  {
    id: 'almaden-quicksilver',
    name: 'Almaden Quicksilver Park',
    coordinates: { lat: 37.1677, lon: -121.8233 },
    bestActivity: 'Hiking',
    distance: 8.5,
    amenities: ['Trails', 'Historic sites', 'Scenic views', 'Picnic areas'],
    difficulty: 'moderate',
  },
  {
    id: 'kelley-park',
    name: 'Kelley Park',
    coordinates: { lat: 37.3235, lon: -121.8622 },
    bestActivity: 'Walking',
    distance: 3.2,
    amenities: ['Japanese Garden', 'Zoo', 'Playgrounds', 'BBQ areas'],
    difficulty: 'easy',
  },
  {
    id: 'communications-hill',
    name: 'Communications Hill Park',
    coordinates: { lat: 37.2726, lon: -121.8295 },
    bestActivity: 'Hiking',
    distance: 5.7,
    amenities: ['Hilltop views', 'Trails', 'Fitness stations'],
    difficulty: 'moderate',
  },
  {
    id: 'los-gatos-creek-trail',
    name: 'Los Gatos Creek Trail',
    coordinates: { lat: 37.2488, lon: -121.9313 },
    bestActivity: 'Biking',
    distance: 6.3,
    amenities: ['Paved trail', 'Creek views', 'Shaded areas', 'Wildlife'],
    difficulty: 'easy',
  },
  {
    id: 'alum-rock-park',
    name: 'Alum Rock Park',
    coordinates: { lat: 37.3877, lon: -121.7974 },
    bestActivity: 'Hiking',
    distance: 7.8,
    amenities: ['Mountain trails', 'Creek', 'Mineral springs', 'Visitor center'],
    difficulty: 'hard',
  },
  {
    id: 'hellyer-county-park',
    name: 'Hellyer County Park',
    coordinates: { lat: 37.2847, lon: -121.8133 },
    bestActivity: 'Biking',
    distance: 4.9,
    amenities: ['Velodrome', 'Bike trails', 'Lake', 'Picnic areas'],
    difficulty: 'easy',
  },
  {
    id: 'coyote-creek-trail',
    name: 'Coyote Creek Trail',
    coordinates: { lat: 37.2585, lon: -121.8180 },
    bestActivity: 'Walking',
    distance: 5.1,
    amenities: ['Paved trail', 'Creek views', 'Bird watching', 'Dog-friendly'],
    difficulty: 'easy',
  },
  {
    id: 'overfelt-gardens',
    name: 'Overfelt Gardens',
    coordinates: { lat: 37.3709, lon: -121.8436 },
    bestActivity: 'Walking',
    distance: 3.8,
    amenities: ['Chinese garden', 'Lake', 'Wildlife sanctuary', 'Trails'],
    difficulty: 'easy',
  },
  {
    id: 'penitencia-creek-park',
    name: 'Penitencia Creek Park',
    coordinates: { lat: 37.3948, lon: -121.8258 },
    bestActivity: 'Hiking',
    distance: 6.2,
    amenities: ['Creek trails', 'Picnic areas', 'Playgrounds', 'Sports fields'],
    difficulty: 'moderate',
  },
  {
    id: 'martial-cottle-park',
    name: 'Martial Cottle Park',
    coordinates: { lat: 37.2676, lon: -121.8394 },
    bestActivity: 'Walking',
    distance: 4.5,
    amenities: ['Agricultural park', 'Farm animals', 'Trails', 'Orchards'],
    difficulty: 'easy',
  },
  {
    id: 'lake-cunningham-park',
    name: 'Lake Cunningham Park',
    coordinates: { lat: 37.3259, lon: -121.7962 },
    bestActivity: 'Biking',
    distance: 5.4,
    amenities: ['Lake', 'Skate park', 'Bike park', 'Fishing'],
    difficulty: 'easy',
  },
];

/**
 * San Jose downtown coordinates (reference point)
 */
export const SAN_JOSE_CENTER = {
  lat: 37.3382,
  lon: -121.8863,
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
