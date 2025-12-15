import { useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Bell, User, Wind, RefreshCw, TreePine, X, Menu } from 'lucide-react';
import { Dashboard } from './pages/Dashboard';
import { Analytics } from './pages/Analytics';
import { Alerts } from './pages/Alerts';
import { ParksExplorer } from './components/Parks/ParksExplorer';
import { ProfileTab } from './components/Profile/ProfileTab';
import { WildfireAlertOverlay } from './components/Alerts/WildfireAlertOverlay';
import { useEnvironmentStore } from './store/environmentStore';
import { formatRelativeTime } from './utils/formatters';
import './index.css';

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    loading,
    lastUpdated,
    fetchData,
    fetchParksData,
    error,
    currentAlert,
    currentData,
  } = useEnvironmentStore();

  // Initial data fetch
  useEffect(() => {
    fetchData();
    fetchParksData();
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      fetchParksData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleRefresh = () => {
    fetchData();
    fetchParksData();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/parks', label: 'Parks', icon: TreePine },
    { path: '/alerts', label: 'Alerts', icon: Bell },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/analytics': return 'Analytics';
      case '/parks': return 'Parks Explorer';
      case '/alerts': return 'Alerts';
      case '/profile': return 'Profile';
      default: return 'Dashboard';
    }
  };

  const getPageSubtitle = () => {
    switch (location.pathname) {
      case '/': return 'Real-time environmental monitoring for San Jose';
      case '/analytics': return 'Historical trends and forecasts';
      case '/parks': return 'Find the best parks based on air quality';
      case '/alerts': return 'Environmental alerts and warnings';
      case '/profile': return 'Manage your preferences';
      default: return '';
    }
  };

  // Check for wildfire alert - this takes over the entire screen
  const showWildfireOverlay = currentAlert?.type === 'wildfire' && 
                               currentAlert?.severity === 'danger' &&
                               !currentAlert?.dismissible;

  return (
    <>
      {/* Wildfire Alert Overlay - Takes over entire screen */}
      {showWildfireOverlay && currentAlert && (
        <WildfireAlertOverlay alert={currentAlert} currentData={currentData} />
      )}

      <div className="app-container">
        {/* Purple Gradient Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          {/* Header */}
          <div className="sidebar-header">
            <Link to="/" className="logo" onClick={() => setIsSidebarOpen(false)}>
              <div className="logo-icon">
                <img src="./logo.png" alt="logo"
                  className=' h-12 w-12 ' style={{height: '40px', width: '40px'}} />
              </div>
              <span>Weather Shield</span>
            </Link>

            {/* Close button - only visible on mobile */}
            <button 
              className="sidebar-close-btn p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden" 
              aria-label="Close navigation"
              onClick={() => setIsSidebarOpen(false)}
              style={{ color: 'white' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const hasAlert = item.path === '/alerts' && currentAlert && currentAlert.severity !== 'info';
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div className="relative">
                    <Icon size={20} />
                    {hasAlert && (
                      <span 
                        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500"
                        style={{ 
                          boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)',
                          animation: 'pulse 2s infinite'
                        }}
                      />
                    )}
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer - Last Updated */}
          <div className="sidebar-footer">
            <p className="sidebar-footer-label">Last Updated</p>
            <p className="sidebar-footer-value">
              {lastUpdated ? formatRelativeTime(lastUpdated) : 'Never'}
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Mobile Topbar - Only visible on mobile/tablet */}
          <div className="mobile-topbar">
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)' }}
              >
                <Wind size={20} color="white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-none">Weather Shield</p>
                <p className="text-xs text-purple-600 font-medium mt-0.5">Environmental Dashboard</p>
              </div>
            </div>
            <button 
              className="menu-toggle" 
              aria-label="Toggle navigation"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>

          {/* Page Header */}
          <div className="page-header">
            <div className="page-header-row">
              <div>
                <h1 className="page-title">{getPageTitle()}</h1>
                <p className="page-subtitle">{getPageSubtitle()}</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="refresh-btn"
              >
                <RefreshCw 
                  size={16} 
                  className={loading ? 'animate-spin' : ''} 
                />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="animate-fade-in">
            {/* Error State (only show if we have data already) */}
            {error && currentData && (
              <div 
                className="p-4 mb-6 rounded-2xl flex items-center gap-4"
                style={{ 
                  background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
                  border: '1px solid #FECACA'
                }}
              >
                <div 
                  className="p-2.5 rounded-xl"
                  style={{ background: '#FEE2E2' }}
                >
                  <Bell className="text-red-500" size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-red-800">Unable to update data</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
                <button 
                  onClick={handleRefresh} 
                  className="px-4 py-2 bg-white border border-red-200 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/parks" element={<ParksExplorer />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<ProfileTab />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden animate-fade-in"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}

export default App;
