import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';
import { getFirebaseServices } from '../../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';

interface AuthModalProps {
  initialIsSignUp?: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  initialIsSignUp = false, 
  onClose,
  onSuccess
}) => {
  const firebaseServices = useMemo(() => getFirebaseServices(), []);
  
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!firebaseServices) {
      setError('Sign-in is unavailable: Firebase is not configured.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(firebaseServices.auth, email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
      } else {
        await signInWithEmailAndPassword(firebaseServices.auth, email, password);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed.';
      if (err.code === 'auth/invalid-email') msg = 'Invalid email address.';
      if (err.code === 'auth/user-disabled') msg = 'User account is disabled.';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
      if (err.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      if (err.code === 'auth/network-request-failed') msg = 'Network error. Please check your connection.';
      if (err.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 14px 14px 44px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#111827',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
    marginLeft: '2px',
  };

  const iconWrapperStyle: React.CSSProperties = {
    position: 'absolute',
    left: '14px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  };

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {/* Decorative gradient */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '8px',
            borderRadius: '50%',
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div style={{ position: 'relative', padding: '40px 32px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: '#f3e8ff',
                color: '#9333ea',
                marginBottom: '16px',
                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.2)',
              }}
            >
              {isSignUp ? <Sparkles size={28} /> : <User size={28} />}
            </div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 8px 0',
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {isSignUp ? 'Join Weather Shield for personalized insights' : 'Sign in to sync your preferences'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {isSignUp && (
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <div style={iconWrapperStyle}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={iconWrapperStyle}>
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#fef2f2',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '14px', color: '#dc2626' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(139, 92, 246, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              {loading ? (
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setIsSignUp(!isSignUp);
                }}
                style={{
                  marginLeft: '6px',
                  background: 'none',
                  border: 'none',
                  color: '#8b5cf6',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>,
    document.body
  );
};
