'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(user ? '/home' : '/login');
  }, [user, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <p className="text-sm text-gray-600">
        Demo accounts are already verified. <Link className="text-green-700 underline" href={user ? '/home' : '/login'}>Continue</Link>
      </p>
    </main>
  );
}
