'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useUnlocked } from '@/hooks/useUnlocked';
import { stripeLink } from '@/data/stripe_links';
import library from '@/data/promptpass_library.json';
import type { Department, Prompt } from '@/types';

const departments = library as Department[];

const DEPT_META: Record<string, { category: string; description: string }> = {
  investment_banking:       { category: 'Finance',        description: 'CV bullets, cover letters, deal memos and cold outreach written for Investment Banking & M&A internships. Six prompts, step-chained.' },
  private_equity_vc:        { category: 'Finance',        description: 'LP mechanics, expert calls, PE vs VC vocabulary. Prompts for sourcing, due diligence and deal communication.' },
  asset_management:         { category: 'Finance',        description: 'Bloomberg, portfolio attribution and end-of-internship presentation prompts for Asset Management roles.' },
  financial_markets:        { category: 'Markets',        description: 'Bloomberg functions, CLOs, MiCA and regulatory track prompts for Trading and Markets internships.' },
  strategy_consulting:      { category: 'Strategy',       description: 'MECE frameworks, AI/CSRD sub-tracks, hypothesis-first prompts for Strategy Consulting internships. Six prompts, step-chained.' },
  corporate_strategy:       { category: 'Strategy',       description: '4 CoS sub-types, BizDev cycle and note de synthèse prompts for Corporate Strategy internships.' },
  marketing:                { category: 'Marketing',      description: 'Nielsen panel, brand P&L and e-commerce signals. Prompts for Marketing and Brand Management internships.' },
  esg:                      { category: 'Sustainability', description: 'ESRS, greenwashing enforcement and Python for ESG. Prompts built for ESG and Sustainability roles.' },
  product_management:       { category: 'Product',        description: 'JIRA specs, MDR/HIPAA constraints and JTBD prompts for Product Management internships.' },
  project_management_media: { category: 'Media',          description: 'Rights logic, cross-functional synthesis and crisis management prompts for Media, Sports and Events roles.' },
  communications_pr:        { category: 'Comms',          description: 'French writing quality, crisis holding statements and register-switching prompts for Communications & PR internships.' },
  luxury_goods:             { category: 'Luxury',         description: 'Sell-through, PowerQuery and anomaly identification prompts for Luxury Goods and Retail internships.' },
};

// Number of free preview prompts before the unlock wall
const FREE_PROMPTS = 1;

export default function DepartmentDetailPage() {
  const params = useParams<{ id: string }>();
  const { isUnlocked, hydrated } = useUnlocked();

  const dept = departments.find((d) => d.id === params.id);
  const meta = dept ? (DEPT_META[dept.id] ?? { category: 'General', description: dept.description }) : null;
  const unlocked = hydrated && dept ? isUnlocked(dept.id) : false;

  const handleUnlock = (departmentId: string) => {
    localStorage.setItem('pending_unlock', departmentId);
    window.location.href = stripeLink;
  };

  if (!dept || !meta) {
    return (
      <div className="pp-wrap" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <p style={{ fontSize: '16px', color: '#6B6B6B', marginBottom: '16px' }}>Department not found.</p>
        <Link href="/departments" style={{ color: '#E8622A', fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>
          ← Back to all departments
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEBE8' }}>
        <div className="pp-wrap" style={{ paddingTop: '72px', paddingBottom: '64px' }}>
          <Link
            href="/departments"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 500, color: '#6B6B6B', textDecoration: 'none', marginBottom: '32px' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8622A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6B6B6B')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M11 6H1M5 2L1 6l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All departments
          </Link>

          <div className="pp-detail-header">
            <div>
              <p style={{ fontWeight: 600, fontSize: '12px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
                {meta.category}
              </p>
              <h1 className="pp-page-h1" style={{ fontWeight: 800, fontSize: '48px', color: '#0F0F0F', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '20px' }}>
                {dept.department}
              </h1>
              <p style={{ fontSize: '16px', color: '#6B6B6B', fontWeight: 400, lineHeight: 1.7, maxWidth: '560px' }}>
                {meta.description}
              </p>
            </div>

            {/* Unlock card */}
            {hydrated && (
              <div className="pp-unlock-card" style={{ flexShrink: 0, minWidth: '240px', maxWidth: '300px' }}>
                {unlocked ? (
                  <div style={{ padding: '28px', border: '1px solid #EEEBE8', borderRadius: '8px', backgroundColor: '#FAFAF8' }}>
                    <p style={{ fontWeight: 700, fontSize: '11px', color: '#E8622A', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Unlocked
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6 }}>
                      Full access to all {dept.prompts.length} prompts in this package.
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: '28px', border: '1.5px solid #E8622A', borderRadius: '8px', backgroundColor: '#FFFFFF' }}>
                    <p style={{ fontWeight: 800, fontSize: '32px', color: '#0F0F0F', letterSpacing: '-0.02em', marginBottom: '6px' }}>
                      €{dept.price.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: 1.6, marginBottom: '24px' }}>
                      One-time. Permanent access to all {dept.prompts.length} prompts.
                    </p>
                    <button
                      onClick={() => handleUnlock(dept.id)}
                      style={{ width: '100%', padding: '14px 20px', borderRadius: '6px', backgroundColor: '#E8622A', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
                    >
                      Unlock for €2.50 →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── PROMPT LIST ── */}
      <section style={{ backgroundColor: '#FFFFFF' }}>
        <div className="pp-wrap" style={{ paddingTop: '64px', paddingBottom: '100px' }}>

          <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 400, marginBottom: '40px' }}>
            {dept.prompts.length} prompts · {unlocked ? 'Full access' : `Preview: ${FREE_PROMPTS} of ${dept.prompts.length} visible`}
          </p>

          <div>
            {dept.prompts.map((prompt, i) => {
              const isLocked = !unlocked && i >= FREE_PROMPTS;
              return (
                <PromptRow
                  key={prompt.id}
                  prompt={prompt}
                  index={i}
                  isLocked={isLocked}
                  isFirst={i === 0}
                  deptId={dept.id}
                />
              );
            })}
          </div>

          {/* Unlock CTA strip — shown only when locked */}
          {hydrated && !unlocked && (
            <div style={{ marginTop: '48px', padding: '40px', backgroundColor: '#FDF0EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '20px', color: '#0F0F0F', marginBottom: '8px' }}>
                  {dept.prompts.length - FREE_PROMPTS} more prompts in this package
                </p>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.6 }}>
                  CV summary, cover letter, cold outreach, interview prep and a stand-out deliverable.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <p style={{ fontWeight: 700, fontSize: '24px', color: '#0F0F0F' }}>
                  €{dept.price.toFixed(2)}
                </p>
                <button
                  onClick={() => handleUnlock(dept.id)}
                  style={{ padding: '14px 32px', borderRadius: '6px', backgroundColor: '#E8622A', color: '#FFFFFF', fontWeight: 600, fontSize: '15px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
                >
                  Unlock for €2.50 →
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ── Individual prompt row with expand/collapse ─────────────────────────────
function PromptRow({ prompt, index, isLocked, isFirst, deptId }: {
  prompt: Prompt; index: number; isLocked: boolean; isFirst: boolean; deptId: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleCopy = (text: string, stepNum: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(stepNum);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  return (
    <div style={{ borderTop: isFirst ? '1px solid #EEEBE8' : 'none', borderBottom: '1px solid #EEEBE8' }}>
      {/* Row header — always clickable if unlocked */}
      <button
        onClick={() => !isLocked && setOpen((v) => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0', background: 'none', border: 'none', cursor: isLocked ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
        disabled={isLocked}
        aria-expanded={open}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
          {/* Number */}
          <span style={{ fontWeight: 700, fontSize: '12px', color: isLocked ? '#BBBBBB' : '#E8622A', letterSpacing: '0.08em', flexShrink: 0, width: '24px' }}>
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Title */}
          <p style={{ fontWeight: 600, fontSize: '17px', color: isLocked ? '#BBBBBB' : '#0F0F0F', lineHeight: 1.3 }}>
            {isLocked ? '••••••••••••••••••••' : prompt.title}
          </p>

          {/* Step count */}
          {!isLocked && (
            <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 400, flexShrink: 0, marginLeft: '8px' }}>
              {prompt.steps.length} {prompt.steps.length === 1 ? 'step' : 'steps'}
            </span>
          )}

          {isLocked && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#BBBBBB', letterSpacing: '0.1em', textTransform: 'uppercase', marginLeft: '4px' }}>
              Locked
            </span>
          )}
        </div>

        {/* Right actions */}
        {!isLocked && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, marginLeft: '16px' }}>
            <Link
              href={`/runner/${deptId}/${prompt.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontSize: '12px', fontWeight: 600, color: '#E8622A', textDecoration: 'none', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
            >
              Run →
            </Link>
            <svg
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#6B6B6B' }}
              width="16" height="16" viewBox="0 0 16 16" fill="none"
            >
              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </button>

      {/* Expanded steps */}
      {open && !isLocked && (
        <div style={{ paddingBottom: '32px' }}>
          {prompt.steps.map((step) => (
            <div key={step.step} style={{ marginBottom: '20px', paddingLeft: '40px' }}>
              {/* Step header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontWeight: 700, fontSize: '11px', color: '#E8622A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Step {step.step}
                </span>
                <button
                  onClick={() => handleCopy(step.prompt, step.step)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: copied === step.step ? '#E8622A' : '#6B6B6B', fontFamily: 'inherit', fontWeight: 500, padding: '4px 8px', borderRadius: '4px', transition: 'color 0.15s' }}
                >
                  {copied === step.step ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M1 6l3.5 3.5L11 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                        <path d="M1 8V1h7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* Step content */}
              <div style={{ backgroundColor: '#FAFAF8', borderRadius: '6px', padding: '20px 24px' }}>
                <p style={{ fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace', fontSize: '13px', color: '#0F0F0F', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>
                  {step.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
