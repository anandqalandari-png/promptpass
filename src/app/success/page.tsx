'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase';

export default function SuccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Read pending_unlock from localStorage on mount
  useEffect(() => {
    const pending = localStorage.getItem('pending_unlock');
    setDepartmentId(pending);
  }, []);

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!departmentId) {
      setErrorMsg('Something went wrong. Please contact us at hello@promptpass.io');
      return;
    }

    setStatus('loading');

    // Insert into Supabase
    const { error } = await getSupabase()
      .from('unlocked_packages')
      .upsert(
        { email: email.trim().toLowerCase(), department_id: departmentId, stripe_session_id: null },
        { onConflict: 'email,department_id' }
      );

    if (error) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please contact us at hello@promptpass.io');
      return;
    }

    // Write to localStorage as backup
    try {
      const stored = localStorage.getItem('promptpass_unlocked');
      const current: string[] = stored ? JSON.parse(stored) : [];
      if (!current.includes(departmentId)) {
        localStorage.setItem('promptpass_unlocked', JSON.stringify([...current, departmentId]));
      }
      // Clear pending
      localStorage.removeItem('pending_unlock');
    } catch {
      // ignore storage errors
    }

    setStatus('done');

    // Redirect after 2 seconds
    setTimeout(() => {
      router.push(`/department/${departmentId}`);
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Checkmark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FDF0EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 14l7 7L24 7" stroke="#E8622A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {status === 'done' ? (
          /* ── Done state ── */
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontWeight: 800, fontSize: '28px', color: '#0F0F0F', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              You&apos;re in.
            </h1>
            <p style={{ fontSize: '16px', color: '#6B6B6B', lineHeight: 1.6 }}>
              Redirecting to your package…
            </p>
          </div>
        ) : (
          /* ── Email capture form ── */
          <>
            <h1 style={{ fontWeight: 800, fontSize: '32px', color: '#0F0F0F', letterSpacing: '-0.02em', marginBottom: '12px', textAlign: 'center' }}>
              Payment successful.
            </h1>
            <p style={{ fontSize: '16px', color: '#6B6B6B', lineHeight: 1.6, textAlign: 'center', marginBottom: '40px' }}>
              Enter your email to unlock your package on any device, anytime.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  fontFamily: 'inherit',
                  color: '#0F0F0F',
                  backgroundColor: '#FFFFFF',
                  border: errorMsg ? '1.5px solid #E53E3E' : '1.5px solid #EEEBE8',
                  borderRadius: '6px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '12px',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#E8622A')}
                onBlur={e => (e.currentTarget.style.borderColor = errorMsg ? '#E53E3E' : '#EEEBE8')}
              />

              {errorMsg && (
                <p style={{ fontSize: '13px', color: '#E53E3E', marginBottom: '12px', lineHeight: 1.5 }}>
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '6px',
                  backgroundColor: status === 'loading' ? '#C47040' : '#E8622A',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={e => { if (status !== 'loading') e.currentTarget.style.backgroundColor = '#D4551F'; }}
                onMouseLeave={e => { if (status !== 'loading') e.currentTarget.style.backgroundColor = '#E8622A'; }}
              >
                {status === 'loading' ? 'Saving…' : 'Unlock my package →'}
              </button>
            </form>

            <p style={{ fontSize: '12px', color: '#AAAAAA', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
              We only use your email to restore your access. No spam, ever.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
