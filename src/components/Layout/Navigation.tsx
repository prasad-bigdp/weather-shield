import React from 'react';
import { LayoutDashboard, LineChart, AlertTriangle, User } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'charts', label: 'Charts', icon: LineChart },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'profile', label: 'Profile', icon: User },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="glass p-2 rounded-2xl">
      <div className="flex gap-2 flex-wrap justify-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`tab ${isActive ? 'active' : ''} flex items-center gap-2`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
