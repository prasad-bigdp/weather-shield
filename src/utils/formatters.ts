import { format, formatDistanceToNow } from 'date-fns';

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format temperature
 */
export function formatTemperature(temp: number, unit: 'C' | 'F' = 'F'): string {
  if (unit === 'F') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  return `${Math.round(temp)}°C`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  return format(date, 'MMM d, yyyy h:mm a');
}

/**
 * Format relative time (e.g., "2 minutes ago")
 */
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Format time for chart axis
 */
export function formatChartTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'HH:mm');
}

/**
 * Format date for chart axis
 */
export function formatChartDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'MMM d');
}

/**
 * Format distance in miles
 */
export function formatDistance(miles: number): string {
  if (miles < 0.1) return 'Less than 0.1 mi';
  if (miles < 1) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format pollen types as readable string
 */
export function formatPollenTypes(types: string[]): string {
  if (types.length === 0) return 'None detected';
  if (types.length === 1) return types[0];
  if (types.length === 2) return types.join(' and ');
  return types.slice(0, -1).join(', ') + ', and ' + types[types.length - 1];
}
