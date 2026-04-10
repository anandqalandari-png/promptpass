'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import library from '@/data/promptpass_library.json';
import type { Department } from '@/types';

const data = library as Department[];
const ibDept = data.find((d) => d.id === 'investment_banking')!;
const cvPointers = ibDept.prompts.find((p) => p.id === 'cv_pointers')!;

type Props = { onClose: () => void };

export default function SampleModal({ onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        backgroundColor: 'rgba(15,15,15,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        border: '1px solid #EEEBE8',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── HEADER ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          padding: '32px 40px 28px',
          borderBottom: '1px solid #EEEBE8',
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontWeight: 600, fontSize: '11px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Sample prompt
            </p>
            <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#0F0F0F', letterSpacing: '-0.01em', marginBottom: '6px' }}>
              Investment Banking & M&A — CV Pointers
            </h2>
            <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 400 }}>
              {cvPointers.steps.length} steps · Full prompt chain
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#6B6B6B', padding: '4px', marginTop: '2px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '4px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F0F0F')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── STEPS (scrollable) ── */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 40px' }}>
          {cvPointers.steps.map((step, i) => (
            <div
              key={step.step}
              style={{
                padding: '28px 0',
                borderBottom: i < cvPointers.steps.length - 1 ? '1px solid #EEEBE8' : 'none',
              }}
            >
              <p style={{ fontWeight: 700, fontSize: '11px', color: '#E8622A', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Step {step.step}
              </p>
              <div style={{ backgroundColor: '#FAFAF8', borderRadius: '6px', padding: '20px 24px' }}>
                <p style={{
                  fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
                  fontSize: '13px', color: '#0F0F0F', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', margin: 0,
                }}>
                  {step.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER CTA ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', flexWrap: 'wrap',
          padding: '24px 40px',
          borderTop: '1px solid #EEEBE8',
          flexShrink: 0,
          backgroundColor: '#FAFAF8',
          borderRadius: '0 0 8px 8px',
        }}>
          <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 400 }}>
            This is 1 of 6 prompts in the IB package.
          </p>
          <Link
            href="/department/investment_banking"
            onClick={onClose}
            style={{
              backgroundColor: '#E8622A', color: '#FFFFFF',
              fontWeight: 600, fontSize: '14px',
              padding: '12px 24px', borderRadius: '6px',
              textDecoration: 'none', whiteSpace: 'nowrap',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
          >
            Get the full IB package — €2.50
          </Link>
        </div>
      </div>
    </div>
  );
}
