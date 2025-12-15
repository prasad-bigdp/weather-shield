import React from 'react';
import { RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

interface HeaderProps {
  lastUpdated: Date | null;
  onRefresh: () => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ lastUpdated, onRefresh, loading }) => {
  return (
    <header className="glass p-6 rounded-2xl mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white mb-2">San Jose Environmental Dashboard</h1>
          <p className="text-white/80 text-sm">
            Real-time air quality monitoring with smart outdoor activity recommendations
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="text-white/70 text-sm hidden sm:block">
              Updated {formatRelativeTime(lastUpdated)}
            </div>
          )}
          
          <button
            onClick={onRefresh}
            disabled={loading}
            className="btn btn-secondary flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};
