'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmailPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.emailVerified) {
      router.push('/home');
    }
  }, [user, router]);

  const handleResendEmail = async () => {
    if (!user) return;

    setResending(true);
    setMessage('');

    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
      setMessage(errorMessage);
    } finally {
      setResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <svg
              className="h-8 w-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We&apos;ve sent a verification email to:
          </p>
          <p className="mt-1 text-sm font-medium text-gray-900">{user.email}</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-blue-700">
                Please check your email and click the verification link to continue.
                Don&apos;t forget to check your spam folder!
              </p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`rounded-md p-4 ${message.includes('sent') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-surface hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? 'Sending...' : 'Resend verification email'}
          </button>

          <button
            onClick={async () => {
              if (!user) return;
              // Reload user to get latest emailVerified status
              await user.reload();

              if (user.emailVerified) {
                // Update Firestore with verification status
                const token = await user.getIdToken(true);
                await fetch('/api/auth/update-verification', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                router.push('/home');
              } else {
                setMessage('Email not verified yet. Please check your email and click the verification link.');
              }
            }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl text-sm font-medium btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            I&apos;ve verified my email
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-surface hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
