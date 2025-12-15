import React, { useState, useEffect } from 'react';
import { 
  User, MapPin, Bell, Settings, Star, Shield, 
  Smartphone, Moon, Sun, Globe, ChevronRight, Sparkles,
  Heart, Crown, Lock, Mail, X, Check, LogOut,
  Wind, TreePine, Activity, Droplets, ThermometerSun
} from 'lucide-react';
import { getFirebaseServices } from '../../config/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';
import { AuthModal } from './AuthModal';
import { useEnvironmentStore } from '../../store/environmentStore';

export const ProfileTab: React.FC = () => {
  const [theme, setTheme] = useState<'Light Mode' | 'Dark Mode'>('Light Mode');
  const [units, setUnits] = useState<'Metric' | 'Imperial'>('Metric');
  const [language, setLanguage] = useState('English (US)');
  const [activeModal, setActiveModal] = useState<'language' | 'privacy' | 'email-auth' | null>(null);
  
  // Get real data from store
  const { currentData } = useEnvironmentStore();
  
  // Firebase
  const firebaseServices = getFirebaseServices();

  // Auth State
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseServices) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseServices.auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [firebaseServices]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'Light Mode' ? 'Dark Mode' : 'Light Mode');
  };

  const toggleUnits = () => {
    setUnits(prev => prev === 'Metric' ? 'Imperial' : 'Metric');
  };

  const handleGoogleLogin = async () => {
    if (!firebaseServices) {
      setAuthError('Sign-in is unavailable: Firebase is not configured.');
      return;
    }

    try {
      setAuthError(null);
      await signInWithPopup(firebaseServices.auth, firebaseServices.googleProvider);
    } catch (error: any) {
      console.error('Google login error:', error);
      setAuthError('Failed to sign in with Google. Please check your configuration.');
    }
  };

  const handleLogout = async () => {
    if (!firebaseServices) return;
    try {
      await signOut(firebaseServices.auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'zh', name: '中文' },
    { code: 'vi', name: 'Tiếng Việt' }
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="profile-page">
      {/* Hero Section with Glassmorphism */}
      <div className="profile-hero-section">
        <div className="hero-gradient-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-glass-card">
          {/* Avatar Section */}
          <div className="profile-avatar-container">
            <div className="avatar-glow"></div>
            <div className="avatar-ring-outer">
              <div className="avatar-ring-inner">
                <div className="avatar-image">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName || 'User'} />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={36} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="avatar-status-badge">
              {user ? <Check size={14} /> : <Sparkles size={12} />}
            </div>
          </div>

          {/* User Info */}
          <div className="user-info-section">
            {authLoading ? (
              <div className="skeleton-loader"></div>
            ) : (
              <>
                <h1 className="user-name">
                  {user ? (user.displayName || user.email?.split('@')[0]) : 'Welcome, Explorer'}
                </h1>
                <p className="user-status">
                  <span className={`status-indicator ${user ? 'active' : 'guest'}`}></span>
                  {user ? 'Premium Member' : 'Guest Mode'}
                </p>
              </>
            )}
          </div>

          {/* Auth Actions */}
          {!user ? (
            <div className="auth-actions">
              <button className="auth-button google-btn" onClick={handleGoogleLogin} disabled={!firebaseServices}>
                <div className="btn-glow"></div>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
              
              <button 
                className="auth-button email-btn" 
                onClick={() => {
                  setIsSignUp(true);
                  setActiveModal('email-auth');
                }}
              >
                <Mail size={20} />
                <span>Sign up with Email</span>
              </button>
            </div>
          ) : (
            <button className="auth-button logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          )}

          {authError && (
            <div className="auth-error-message">
              <X size={14} />
              <span>{authError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Live Stats Section - Real API Data */}
      <div className="stats-section">
        <div className="section-header-modern">
          <div className="section-icon-wrapper gradient-green">
            <Activity size={20} />
          </div>
          <div>
            <h2>Live San Jose Stats</h2>
            <p>Real-time environmental data</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card glass">
            <div className="stat-icon" style={{ background: `${getAQIColor(currentData?.aqi || 0)}20`, color: getAQIColor(currentData?.aqi || 0) }}>
              <Wind size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value" style={{ color: getAQIColor(currentData?.aqi || 0) }}>
                {currentData?.aqi || '--'}
              </span>
              <span className="stat-label">Air Quality Index</span>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-icon gradient-blue">
              <ThermometerSun size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">
                {currentData && currentData.temperature !== null ? `${Math.round(currentData.temperature)}°C` : '--'}
              </span>
              <span className="stat-label">Temperature</span>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-icon gradient-cyan">
              <Droplets size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">
                {currentData?.humidity || '--'}%
              </span>
              <span className="stat-label">Humidity</span>
            </div>
          </div>

          <div className="stat-card glass">
            <div className="stat-icon gradient-orange">
              <Sun size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-value">
                {currentData?.uvIndex?.toFixed(1) || '--'}
              </span>
              <span className="stat-label">UV Index</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features */}
      <div className="premium-features-section">
        <div className="section-header-modern">
          <div className="section-icon-wrapper gradient-purple">
            <Crown size={20} />
          </div>
          <div>
            <h2>{user ? 'Your Premium Features' : 'Unlock Premium'}</h2>
            <p>{user ? 'Enjoy full access to all features' : 'Create an account to unlock these benefits'}</p>
          </div>
        </div>

        <div className="features-grid-modern">
          <div className={`feature-card-modern ${user ? 'unlocked' : 'locked'}`}>
            <div className="feature-card-glow"></div>
            <div className="feature-icon-modern gradient-coral">
              <MapPin size={24} />
            </div>
            <div className="feature-content-modern">
              <h3>Multi-Location Tracking</h3>
              <p>Monitor air quality across multiple San Jose locations</p>
            </div>
            <div className="feature-status">
              {user ? <Check size={16} className="unlocked-icon" /> : <Lock size={14} />}
            </div>
          </div>

          <div className={`feature-card-modern ${user ? 'unlocked' : 'locked'}`}>
            <div className="feature-card-glow"></div>
            <div className="feature-icon-modern gradient-purple">
              <Bell size={24} />
            </div>
            <div className="feature-content-modern">
              <h3>Smart Notifications</h3>
              <p>Get alerts for AQI changes, pollen, and wildfire warnings</p>
            </div>
            <div className="feature-status">
              {user ? <Check size={16} className="unlocked-icon" /> : <Lock size={14} />}
            </div>
          </div>

          <div className={`feature-card-modern ${user ? 'unlocked' : 'locked'}`}>
            <div className="feature-card-glow"></div>
            <div className="feature-icon-modern gradient-pink">
              <Heart size={24} />
            </div>
            <div className="feature-content-modern">
              <h3>Health Insights</h3>
              <p>Personalized recommendations based on your sensitivities</p>
            </div>
            <div className="feature-status">
              {user ? <Check size={16} className="unlocked-icon" /> : <Lock size={14} />}
            </div>
          </div>

          <div className={`feature-card-modern ${user ? 'unlocked' : 'locked'}`}>
            <div className="feature-card-glow"></div>
            <div className="feature-icon-modern gradient-teal">
              <TreePine size={24} />
            </div>
            <div className="feature-content-modern">
              <h3>Park Recommendations</h3>
              <p>Find the best parks in San Jose based on real-time air quality</p>
            </div>
            <div className="feature-status">
              {user ? <Check size={16} className="unlocked-icon" /> : <Lock size={14} />}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="settings-section-modern">
        <div className="section-header-modern">
          <div className="section-icon-wrapper gradient-gray">
            <Settings size={20} />
          </div>
          <div>
            <h2>Preferences</h2>
            <p>Customize your experience</p>
          </div>
        </div>

        <div className="settings-list-modern">
          <button className="setting-item-modern" onClick={() => setActiveModal('language')}>
            <div className="setting-left-modern">
              <div className="setting-icon-modern">
                <Globe size={20} />
              </div>
              <div className="setting-info-modern">
                <span className="setting-name-modern">Language</span>
                <span className="setting-value-modern">{language}</span>
              </div>
            </div>
            <ChevronRight size={18} className="setting-arrow" />
          </button>

          <button className="setting-item-modern" onClick={toggleTheme}>
            <div className="setting-left-modern">
              <div className={`setting-icon-modern ${theme === 'Dark Mode' ? 'dark-mode-icon' : ''}`}>
                {theme === 'Light Mode' ? <Sun size={20} /> : <Moon size={20} />}
              </div>
              <div className="setting-info-modern">
                <span className="setting-name-modern">Appearance</span>
                <span className="setting-value-modern">{theme}</span>
              </div>
            </div>
            <div className={`toggle-switch-modern ${theme === 'Dark Mode' ? 'active' : ''}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>

          <button className="setting-item-modern" onClick={toggleUnits}>
            <div className="setting-left-modern">
              <div className="setting-icon-modern">
                <Smartphone size={20} />
              </div>
              <div className="setting-info-modern">
                <span className="setting-name-modern">Units</span>
                <span className="setting-value-modern">{units === 'Metric' ? 'Celsius, km' : 'Fahrenheit, mi'}</span>
              </div>
            </div>
            <div className={`toggle-switch-modern ${units === 'Imperial' ? 'active' : ''}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>

          <button className="setting-item-modern" onClick={() => setActiveModal('privacy')}>
            <div className="setting-left-modern">
              <div className="setting-icon-modern">
                <Shield size={20} />
              </div>
              <div className="setting-info-modern">
                <span className="setting-name-modern">Privacy</span>
                <span className="setting-value-modern">Manage your data preferences</span>
              </div>
            </div>
            <ChevronRight size={18} className="setting-arrow" />
          </button>
        </div>
      </div>

      {/* Guest Mode CTA */}
      {!user && (
        <div className="guest-cta-section">
          <div className="cta-content">
            <div className="cta-icon">
              <Star size={28} />
            </div>
            <div className="cta-text">
              <h3>Unlock Your Full Experience</h3>
              <p>Sign up free to save preferences and get personalized air quality alerts for San Jose.</p>
            </div>
          </div>
          <button className="cta-button" onClick={() => {
            setIsSignUp(true);
            setActiveModal('email-auth');
          }}>
            <Sparkles size={18} />
            <span>Get Started Free</span>
          </button>
        </div>
      )}

      {/* App Info Footer */}
      <div className="app-info-footer">
        <div className="app-logo-mini">
          <Wind size={20} />
        </div>
        <p className="app-name">San Jose Environmental Dashboard</p>
        <p className="app-version">Version 1.0.0 • Real-time data for San Jose, CA</p>
      </div>

      {/* Language Modal */}
      {activeModal === 'language' && (
        <div className="modal-overlay-modern" onClick={() => setActiveModal(null)}>
          <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>Select Language</h3>
              <button className="modal-close-modern" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-modern">
              {languages.map((lang) => (
                <button 
                  key={lang.code}
                  className={`language-option-modern ${language === lang.name ? 'selected' : ''}`}
                  onClick={() => {
                    setLanguage(lang.name);
                    setActiveModal(null);
                  }}
                >
                  <span>{lang.name}</span>
                  {language === lang.name && <Check size={18} className="check-icon" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {activeModal === 'privacy' && (
        <div className="modal-overlay-modern" onClick={() => setActiveModal(null)}>
          <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>Privacy Settings</h3>
              <button className="modal-close-modern" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-modern">
              <div className="privacy-item-modern">
                <div className="privacy-info-modern">
                  <h4>Analytics</h4>
                  <p>Help us improve with anonymous usage data</p>
                </div>
                <div className="toggle-switch-modern active">
                  <div className="toggle-thumb"></div>
                </div>
              </div>
              <div className="privacy-item-modern">
                <div className="privacy-info-modern">
                  <h4>Location History</h4>
                  <p>Save locations for faster loading</p>
                </div>
                <div className="toggle-switch-modern active">
                  <div className="toggle-thumb"></div>
                </div>
              </div>
              <div className="privacy-item-modern">
                <div className="privacy-info-modern">
                  <h4>Notifications</h4>
                  <p>Receive updates about new features</p>
                </div>
                <div className="toggle-switch-modern">
                  <div className="toggle-thumb"></div>
                </div>
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="modal-save-btn" onClick={() => setActiveModal(null)}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Auth Modal */}
      {activeModal === 'email-auth' && (
        <AuthModal 
          initialIsSignUp={isSignUp}
          onClose={() => setActiveModal(null)}
          onSuccess={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
