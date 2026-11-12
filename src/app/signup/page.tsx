import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="max-w-md w-full rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-gray-900">Demo access only</h1>
        <p className="mt-3 text-sm text-gray-600">
          Account registration is disabled in this demo. Sign in with the demo credentials instead.
        </p>
        <Link href="/login" className="btn-primary mt-6 inline-flex rounded-xl px-5 py-3 font-medium">
          Go to demo sign in
        </Link>
      </section>
    </main>
  );
}
