import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue, Query } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { mockDb } from './mock-firestore';

let initialized = false;
let useMock = false;

const ensureInitialized = () => {
  if (initialized || useMock) return;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  // If no credentials or placeholder credentials from example file, use mock
  if (!projectId || projectId === 'your-project-id' || !privateKey || privateKey.includes('YOUR_PRIVATE_KEY_HERE')) {
    useMock = true;
    console.log('Firebase credentials not configured — using MockFirestore in-memory database');
    return;
  }

  try {
    if (!getApps().length) {
      let formattedKey = privateKey;
      if (formattedKey.includes('\\n')) {
        formattedKey = formattedKey.replace(/\\n/g, '\n');
      }

      const serviceAccount = {
        projectId,
        privateKey: formattedKey,
        clientEmail,
      };

      initializeApp({
        credential: cert(serviceAccount as ServiceAccount),
        projectId,
      });

      initialized = true;
      console.log('Firebase Admin SDK initialized successfully');
    }
  } catch (err) {
    console.warn('Firebase Admin SDK init failed, falling back to mockDb:', err);
    useMock = true;
  }
};

export const initializeFirebase = () => {
  ensureInitialized();
};

export const getDb = (): Firestore => {
  ensureInitialized();
  if (useMock) {
    return mockDb as unknown as Firestore;
  }
  try {
    return getFirestore();
  } catch {
    return mockDb as unknown as Firestore;
  }
};

export const getAuthInstance = (): Auth => {
  ensureInitialized();
  return getAuth();
};

// Lazily-initialized singletons. Methods are bound to the real instance so they
// work when accessed through the proxy.
export const db = new Proxy({} as Firestore, {
  get: (_target, prop) => {
    const firestore = getDb() as unknown as Record<string | symbol, unknown>;
    const value = firestore[prop];
    return typeof value === 'function' ? value.bind(firestore) : value;
  },
});

export const auth = new Proxy({} as Auth, {
  get: (_target, prop) => {
    const authInstance = getAuthInstance() as unknown as Record<string | symbol, unknown>;
    const value = authInstance[prop];
    return typeof value === 'function' ? value.bind(authInstance) : value;
  },
});

// Re-export the modular Firestore helpers/types used across the API routes so
// call sites depend on this module rather than reaching into firebase-admin.
export { FieldValue, Query };
export type { Firestore, Auth };
