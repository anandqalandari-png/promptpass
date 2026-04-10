'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUnlocked } from '@/hooks/useUnlocked';
import library from '@/data/promptpass_library.json';
import type { Department } from '@/types';

const departments = library as Department[];

export default function RunnerPage() {
  const params = useParams<{ departmentId: string; promptId: string }>();
  const router = useRouter();
  const { isUnlocked, hydrated } = useUnlocked();

  const dept = departments.find((d) => d.id === params.departmentId);
  const prompt = dept?.prompts.find((p) => p.id === params.promptId);

  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState<number | null>(null);

  // Redirect if locked (after hydration)
  useEffect(() => {
    if (!hydrated) return;
    if (!dept || !prompt) { router.replace('/departments'); return; }
    // First prompt is always free; others require unlock
    const promptIndex = dept.prompts.findIndex((p) => p.id === params.promptId);
    if (promptIndex > 0 && !isUnlocked(dept.id)) {
      router.replace(`/department/${dept.id}`);
    }
  }, [hydrated, dept, prompt, params.promptId, isUnlocked, router]);

  if (!dept || !prompt) return null;

  const steps = prompt.steps;
  const allDone = done.size === steps.length;

  const handleCopy = (stepIndex: number) => {
    navigator.clipboard.writeText(steps[stepIndex].prompt).then(() => {
      setCopied(stepIndex);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const handleCopyAndAdvance = (stepIndex: number) => {
    handleCopy(stepIndex);
    setDone((prev) => new Set(prev).add(stepIndex));
    if (stepIndex < steps.length - 1) {
      setTimeout(() => setActiveStep(stepIndex + 1), 300);
    }
  };

  return (
    <>
      {/* ── HEADER ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEBE8' }}>
        <div className="pp-wrap" style={{ paddingTop: '48px', paddingBottom: '40px' }}>

          {/* Breadcrumb */}
          <Link
            href={`/department/${dept.id}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', marginBottom: '24px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8622A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M11 6H1M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {dept.department}
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '12px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Prompt runner
              </p>
              <h1 style={{ fontWeight: 800, fontSize: '36px', color: '#0F0F0F', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {prompt.title}
              </h1>
            </div>

            {/* Step progress */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '4px' }}>
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  style={{
                    width: done.has(i) ? '28px' : activeStep === i ? '28px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: done.has(i) ? '#E8622A' : activeStep === i ? '#0F0F0F' : '#EEEBE8',
                    padding: 0,
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
              <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 500, marginLeft: '4px' }}>
                {done.size}/{steps.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RUNNER BODY ── */}
      <section style={{ backgroundColor: '#FFFFFF' }}>
        <div className="pp-wrap" style={{ paddingTop: '0', paddingBottom: '100px' }}>
          <div className="pp-runner-layout">

            {/* ── LEFT: Step nav ── */}
            <aside className="pp-runner-sidebar">
              <p style={{ fontWeight: 600, fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Steps
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {steps.map((step, i) => {
                  const isDone = done.has(i);
                  const isActive = activeStep === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        width: '100%', background: 'none', border: 'none',
                        cursor: 'pointer', padding: '10px 0',
                        borderBottom: i < steps.length - 1 ? '1px solid #EEEBE8' : 'none',
                        fontFamily: 'inherit',
                      }}
                    >
                      {/* Status dot */}
                      <span style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: isDone ? '#E8622A' : isActive ? '#0F0F0F' : '#FAFAF8',
                        border: isDone ? 'none' : isActive ? 'none' : '1px solid #EEEBE8',
                        transition: 'all 0.15s',
                      }}>
                        {isDone ? (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M1.5 5l2.5 2.5L8.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <span style={{ fontSize: '10px', fontWeight: 700, color: isActive ? '#FFFFFF' : '#6B6B6B' }}>
                            {i + 1}
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: isActive ? 600 : 400, color: isActive ? '#0F0F0F' : isDone ? '#E8622A' : '#6B6B6B', textAlign: 'left', lineHeight: 1.3 }}>
                        Step {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {allDone && (
                <Link
                  href={`/department/${dept.id}`}
                  style={{ display: 'block', marginTop: '24px', padding: '10px 16px', borderRadius: '6px', backgroundColor: '#E8622A', color: '#FFFFFF', fontSize: '12px', fontWeight: 600, textDecoration: 'none', textAlign: 'center', transition: 'background-color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
                >
                  Done — back to package
                </Link>
              )}
            </aside>

            {/* ── RIGHT: Active step content ── */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: '48px' }}>
              {steps.map((step, i) => {
                const isActive = activeStep === i;
                const isDone = done.has(i);
                if (!isActive) return null;

                return (
                  <div key={step.step}>
                    {/* Step label */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <p style={{ fontWeight: 700, fontSize: '11px', color: '#E8622A', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        Step {step.step} of {steps.length}
                      </p>
                      {isDone && (
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8622A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M1 6l3.5 3.5L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Done
                        </span>
                      )}
                    </div>

                    {/* Prompt content */}
                    <div style={{ backgroundColor: '#FAFAF8', borderRadius: '8px', padding: '28px 32px', marginBottom: '32px', position: 'relative' }}>
                      <p style={{
                        fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
                        fontSize: '13px', color: '#0F0F0F', lineHeight: 1.9,
                        whiteSpace: 'pre-wrap', margin: 0,
                      }}>
                        {step.prompt}
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {/* Copy only */}
                      <button
                        onClick={() => handleCopy(i)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '7px',
                          padding: '12px 20px', borderRadius: '6px',
                          border: '1.5px solid #EEEBE8', background: '#FFFFFF',
                          fontSize: '14px', fontWeight: 500, color: copied === i ? '#E8622A' : '#0F0F0F',
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'border-color 0.15s, color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8622A'; e.currentTarget.style.color = '#E8622A'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#EEEBE8'; e.currentTarget.style.color = copied === i ? '#E8622A' : '#0F0F0F'; }}
                      >
                        {copied === i ? (
                          <>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <path d="M1 6.5l4 4L12 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Copied
                          </>
                        ) : (
                          <>
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                              <rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                              <path d="M1 8.5V1h7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Copy prompt
                          </>
                        )}
                      </button>

                      {/* Copy & advance / Copy & finish */}
                      {i < steps.length - 1 ? (
                        <button
                          onClick={() => handleCopyAndAdvance(i)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '12px 24px', borderRadius: '6px',
                            border: 'none', backgroundColor: '#0F0F0F',
                            fontSize: '14px', fontWeight: 600, color: '#FFFFFF',
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#333333')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#0F0F0F')}
                        >
                          Copy & continue
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M1 6.5h11M7.5 2l4.5 4.5L7.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleCopy(i);
                            setDone((prev) => new Set(prev).add(i));
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '12px 24px', borderRadius: '6px',
                            border: 'none', backgroundColor: '#E8622A',
                            fontSize: '14px', fontWeight: 600, color: '#FFFFFF',
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
                          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
                        >
                          Copy & finish
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M1 6.5l4 4L12 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* How to use hint */}
                    <p style={{ marginTop: '20px', fontSize: '12px', color: '#6B6B6B', lineHeight: 1.6 }}>
                      Paste this into Claude, ChatGPT, or any LLM.
                      {i === 0 && ' It will ask follow-up questions before the next step.'}
                    </p>
                  </div>
                );
              })}

              {/* All done state */}
              {allDone && (
                <div style={{ marginTop: '48px', padding: '40px', backgroundColor: '#FDF0EB', borderRadius: '8px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '20px', color: '#0F0F0F', marginBottom: '8px' }}>
                    All steps complete.
                  </p>
                  <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6, marginBottom: '24px' }}>
                    You've run the full prompt chain for <strong>{prompt.title}</strong>.
                  </p>
                  <Link
                    href={`/department/${dept.id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 32px', borderRadius: '6px', backgroundColor: '#E8622A', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', textDecoration: 'none', transition: 'background-color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
                  >
                    Back to {dept.department}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
