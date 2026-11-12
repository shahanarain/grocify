'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginFormData } from '@/lib/validation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemo } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.push('/home');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to log in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemo();
      router.push('/home');
    } catch {
      setError('Failed to log in as demo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Grocify
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-green-600 hover:text-green-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {(process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true') && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xs uppercase tracking-wider font-bold text-emerald-800">
              ⚡ Instant 1-Click Access
            </div>
            <p className="text-xs text-emerald-700 mt-1 mb-3">
              Explore Grocify with sample grocery data. No account setup is required:
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full btn-primary text-xs font-bold py-2.5 px-4 rounded-xl shadow transition"
            >
              {loading ? 'Logging in...' : 'Sign in as Demo User (1-Click)'}
            </button>
            <div className="text-[11px] text-gray-500 mt-2.5">
              Username: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">demo@grocify.com</code> | Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-gray-200">GrocifyDemo2026!</code>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm ${errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  }`}
                placeholder="Email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm ${errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                  }`}
                placeholder="Password"
                {...register('password')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
