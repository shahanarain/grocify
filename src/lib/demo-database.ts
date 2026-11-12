// Compatibility adapter for API routes while the app uses its built-in demo store.
// No Firebase project or server credentials are required in demo mode.
import { mockDb } from './mock-firestore';

export const db = mockDb as any;

export const FieldValue = {
  serverTimestamp: () => ({ methodName: 'FieldValue.serverTimestamp' }),
  increment: (operand: number) => ({ methodName: 'FieldValue.increment', operand }),
};
