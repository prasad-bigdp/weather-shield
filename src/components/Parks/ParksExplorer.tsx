import React, { useState, useMemo } from 'react';
import { useEnvironmentStore } from '../../store/environmentStore';
import { Search, Activity, TreePine, Navigation, Star, Crown, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatDistance } from '../../utils/formatters';

export const ParksExplorer: React.FC = () => {
  const { parks, parksLoading, parksError, fetchParksData } = useEnvironmentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'aqi' | 'distance'>('aqi');
  
  const activities = useMemo(() => {
    const allActivities = parks.map(p => p.bestActivity);
    return ['All', ...Array.from(new Set(allActivities))];
  }, [parks]);

  const filteredParks = useMemo(() => {
    return parks
      .filter(park => {
        const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            park.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesActivity = selectedActivity === 'All' || park.bestActivity === selectedActivity;
        return matchesSearch && matchesActivity;
      })
      .sort((a, b) => {
        if (sortBy === 'aqi') return a.aqi - b.aqi;
        if (sortBy === 'distance') return a.distance - b.distance;
        return 0;
      });
  }, [parks, searchQuery, selectedActivity, sortBy]);

  const getAQIStyle = (aqi: number) => {
    if (aqi <= 50) return { bg: '#D1FAE5', color: '#065F46', label: 'Excellent' };
    if (aqi <= 100) return { bg: '#FEF3C7', color: '#92400E', label: 'Good' };
    if (aqi <= 150) return { bg: '#FFEDD5', color: '#9A3412', label: 'Moderate' };
    return { bg: '#FEE2E2', color: '#991B1B', label: 'Fair' };
  };

  // Loading state
  if (parksLoading && parks.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div 
          style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            borderRadius: 24,
            padding: '48px 32px',
            color: 'white'
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Explore San Jose Parks</h1>
          <p style={{ opacity: 0.9 }}>Loading park data...</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ background: '#F3F4F6', borderRadius: 16, height: 280 }} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (parksError && parks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 32px', background: 'white', borderRadius: 16 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #FEE2E2, #FECACA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <AlertTriangle size={40} style={{ color: '#EF4444' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Unable to Load Parks</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>{parksError}</p>
        <button
          onClick={fetchParksData}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none', borderRadius: 12, color: 'white',
            fontWeight: 600, fontSize: 14, cursor: 'pointer'
          }}
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
        borderRadius: 24,
        padding: '40px 32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: -50, right: -50, opacity: 0.1
        }}>
          <TreePine size={250} strokeWidth={1} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 12px', background: 'rgba(255,255,255,0.2)',
            borderRadius: 20, fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16
          }}>
            <TreePine size={14} />
            <span>Outdoor Guide</span>
          </div>
          
          <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Explore San Jose Parks
          </h1>
          <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, lineHeight: 1.5 }}>
            Find the perfect spot for your next outdoor adventure based on real-time air quality data.
          </p>
          
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 280 }}>
              <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)' }} />
              <input
                type="text"
                placeholder="Search parks, trails, or amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '14px 16px 14px 48px',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 12, fontSize: 15, color: 'white',
                  outline: 'none'
                }}
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'aqi' | 'distance')}
              style={{
                padding: '14px 20px',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 12, fontSize: 14, color: 'white',
                cursor: 'pointer', outline: 'none', fontWeight: 500
              }}
            >
              <option value="aqi" style={{ color: '#111827' }}>Sort by: Best Air Quality</option>
              <option value="distance" style={{ color: '#111827' }}>Sort by: Nearest</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Filters */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8 }}>
        {activities.map(activity => (
          <button
            key={activity}
            onClick={() => setSelectedActivity(activity)}
            style={{
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: selectedActivity === activity ? 'none' : '1px solid #E5E7EB',
              background: selectedActivity === activity ? '#111827' : 'white',
              color: selectedActivity === activity ? 'white' : '#4B5563'
            }}
          >
            {activity}
          </button>
        ))}
      </div>

      {/* Parks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20
      }}>
        {filteredParks.map((park, index) => {
          const aqiStyle = getAQIStyle(park.aqi);
          const isTopPick = index < 3 && sortBy === 'aqi';
          
          return (
            <div
              key={park.id}
              className="animate-slide-up hover-scale hover-glow"
              style={{
                background: 'white',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                border: '1px solid #F3F4F6',
                transition: 'all 0.3s',
                animationDelay: `${index * 50}ms`,
                opacity: 0
              }}
            >
              {/* Card Header */}
              <div style={{
                padding: 24,
                background: aqiStyle.bg,
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                {isTopPick && (
                  <div style={{
                    position: 'absolute', top: 12, left: 12,
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', background: 'white',
                    borderRadius: 20, fontSize: 11, fontWeight: 700,
                    color: '#F59E0B'
                  }}>
                    <Crown size={12} />
                    <span>Top Pick</span>
                  </div>
                )}
                
                <div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: '#111827' }}>{park.aqi}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AQI Index</div>
                </div>
                
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <TreePine size={28} style={{ color: aqiStyle.color }} />
                </div>
              </div>
              
              {/* Card Body */}
              <div style={{ padding: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                  {park.name}
                </h3>
                
                <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: '#EDE9FE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Activity size={16} style={{ color: '#7C3AED' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#374151' }}>{park.bestActivity}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: '#DBEAFE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Navigation size={16} style={{ color: '#2563EB' }} />
                    </div>
                    <span style={{ fontSize: 14, color: '#374151' }}>{formatDistance(park.distance)}</span>
                  </div>
                </div>
                
                {/* Amenities */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                  {park.amenities.slice(0, 3).map(amenity => (
                    <span
                      key={amenity}
                      style={{
                        padding: '6px 12px',
                        background: '#F3F4F6',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#4B5563'
                      }}
                    >
                      {amenity}
                    </span>
                  ))}
                  {park.amenities.length > 3 && (
                    <span style={{
                      padding: '6px 12px',
                      background: '#F3F4F6',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#9CA3AF'
                    }}>
                      +{park.amenities.length - 3}
                    </span>
                  )}
                </div>
                
                {/* Footer */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: 16,
                  borderTop: '1px solid #F3F4F6'
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px',
                    background: aqiStyle.bg,
                    color: aqiStyle.color,
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700
                  }}>
                    <Star size={12} />
                    {aqiStyle.label}
                  </span>
                  
                  <button style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    background: '#F3F4F6',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#9CA3AF'
                  }}>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {!parksLoading && filteredParks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          background: 'white',
          borderRadius: 16,
          border: '2px dashed #E5E7EB'
        }}>
          <TreePine size={48} style={{ color: '#D1D5DB', marginBottom: 16 }} />
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No parks found</h3>
          <p style={{ color: '#6B7280', marginBottom: 24 }}>
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedActivity('All'); }}
            style={{
              padding: '12px 24px',
              background: '#111827',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
