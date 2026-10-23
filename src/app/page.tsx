'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [userIdInput, setUserIdInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanInput = userIdInput.trim();
    const cleanPassword = password.trim();

    let targetEmail = '';
    const upperId = cleanInput.toUpperCase();
    const lowerId = cleanInput.toLowerCase();

    if (cleanInput.includes('@')) {
      targetEmail = lowerId;
    } else if (upperId === 'SUPERADMIN') {
      targetEmail = 'superadmin@maiyajashoda.org';
    } else {
      targetEmail = `${lowerId}@maiyajashoda.org`;
    }

    // 1. Supabase Auth Login
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: cleanPassword
    });

    if (signInError || !authData.user) {
      setErrorMsg('Invalid User ID ya Password. Kripya check karein.');
      setLoading(false);
      return;
    }

    const userEmail = authData.user.email?.toLowerCase() || '';

    // 2. Direct Redirection based on Admin Emails
    if (
      userEmail === 'superadmin@maiyajashoda.org' ||
      userEmail === 'sushanto@maiyajashoda.org' ||
      userEmail === 'balvirgiri@maiyajashoda.org'
    ) {
      window.location.href = '/admin/dashboard';
    } else {
      window.location.href = '/trustee/dashboard';
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f4', padding: '1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '3rem' }}>🐄</span>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1c1917', margin: '0.5rem 0 0.2rem' }}>
            Maiya Jashoda Gauv Seva Trust
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#78716c', margin: 0 }}>Trustee ERP Login Portal</p>
        </div>

        {errorMsg && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#44403c', marginBottom: '0.3rem' }}>
              User ID / Email *
            </label>
            <input
              required
              value={userIdInput}
              onChange={e => setUserIdInput(e.target.value)}
              placeholder="e.g. SUPERADMIN, test2"
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#44403c', marginBottom: '0.3rem' }}>
              Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '8px', border: '1px solid #d6d3d1', fontSize: '0.9rem' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.75rem', backgroundColor: '#b45309', color: '#ffffff', fontWeight: 700, fontSize: '0.95rem', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}