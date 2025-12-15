import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let provider: GoogleAuthProvider | null = null;

function hasRequiredEnv() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID &&
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
    import.meta.env.VITE_FIREBASE_APP_ID
  );
}

/**
 * Lazily initialize Firebase auth. Returns null if configuration is incomplete
 * or initialization fails, allowing the app to continue without auth.
 */
export function getFirebaseServices() {
  if (firebaseApp && firebaseAuth && provider) {
    return { auth: firebaseAuth, googleProvider: provider };
  }

  if (!hasRequiredEnv()) {
    console.warn('Firebase not configured: missing environment variables.');
    return null;
  }

  try {
    firebaseApp = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    });
    firebaseAuth = getAuth(firebaseApp);
    provider = new GoogleAuthProvider();
    return { auth: firebaseAuth, googleProvider: provider };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return null;
  }
}
