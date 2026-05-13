'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/publisher-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.replace('/publishers/submit');
      } else {
        setError('Incorrect password.');
        setPassword('');
      }
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#8A8880] mb-3">Slant Scanner · Publisher Portal</p>
          <h1 className="font-serif text-2xl font-semibold text-[#1A1A18]">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#4A4840] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
              className="w-full border border-[#E2E0DA] rounded bg-white px-3 py-2.5 text-sm text-[#1A1A18] focus:outline-none focus:ring-1 focus:ring-[#1B2B4B]"
            />
          </div>

          {error && <p className="text-sm text-[#B84040]">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-[#1B2B4B] text-white text-xs tracking-[0.2em] uppercase font-semibold py-3.5 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Continue'}
          </button>
        </form>
      </div>
    </main>
  );
}
