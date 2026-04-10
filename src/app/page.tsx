'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TypewriterHero from '@/components/TypewriterHero';
import SampleModal from '@/components/SampleModal';
import library from '@/data/promptpass_library.json';
import type { Department } from '@/types';

const departments = library as Department[];

const DEPT_META: Record<string, { category: string; teaser: string }> = {
  investment_banking:       { category: 'Finance',        teaser: 'Deal hierarchies, sector depth, one-revision standard' },
  private_equity_vc:        { category: 'Finance',        teaser: 'LP mechanics, expert calls, PE vs VC vocabulary' },
  asset_management:         { category: 'Finance',        teaser: 'Accounting normalisation, end-of-internship pitch' },
  financial_markets:        { category: 'Markets',        teaser: 'Bloomberg functions, CLOs, MiCA, regulatory track' },
  strategy_consulting:      { category: 'Strategy',       teaser: 'MECE, AI/CSRD sub-tracks, hypothesis-first' },
  corporate_strategy:       { category: 'Strategy',       teaser: '4 CoS sub-types, BizDev cycle, note de synthèse' },
  marketing:                { category: 'Marketing',      teaser: 'Nielsen panel, brand P&L, e-commerce signals' },
  esg:                      { category: 'Sustainability', teaser: 'ESRS, greenwashing enforcement, Python for ESG' },
  product_management:       { category: 'Product',        teaser: 'JIRA specs, MDR/HIPAA constraints, JTBD' },
  project_management_media: { category: 'Media',          teaser: 'Rights logic, cross-functional synthesis, crises' },
  communications_pr:        { category: 'Comms',          teaser: 'French writing quality, crisis holding statements' },
  luxury_goods:             { category: 'Luxury',         teaser: 'Sell-through, PowerQuery, anomaly identification' },
};

const CATEGORIES = ['Finance', 'Markets', 'Strategy', 'Marketing', 'Sustainability', 'Product', 'Media', 'Comms', 'Luxury'];

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeCategory) return departments;
    return departments.filter((d) => DEPT_META[d.id]?.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      {modalOpen && <SampleModal onClose={() => setModalOpen(false)} />}

      {/* ── HERO ── */}
      <section style={{ backgroundColor: '#FDF0EB' }}>
        <div className="pp-wrap pp-hero-inner" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          <p className="pp-eyebrow" style={{ color: '#E8622A', fontWeight: 600, fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '24px' }}>
            Prompt Library
          </p>

          <h1 className="pp-hero-h1" style={{ fontWeight: 800, fontSize: '52px', color: '#0F0F0F', lineHeight: 1.15, maxWidth: '700px', marginBottom: '24px', letterSpacing: '-0.01em' }}>
            Still sending the same CV as everyone else?
          </h1>

          <p className="pp-hero-sub" style={{ color: '#6B6B6B', fontSize: '18px', fontWeight: 400, lineHeight: 1.7, maxWidth: '500px', marginBottom: '40px' }}>
            Not templates. Not generic advice.
            Prompts so targeted, recruiters notice.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/departments"
              style={{ backgroundColor: '#E8622A', color: '#fff', fontWeight: 600, fontSize: '15px', padding: '14px 32px', borderRadius: '6px', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
            >
              Browse Packages
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              style={{ color: '#0F0F0F', fontWeight: 600, fontSize: '15px', padding: '14px 32px', borderRadius: '6px', border: '1.5px solid #0F0F0F', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#E8622A'; e.currentTarget.style.color = '#E8622A'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#0F0F0F'; e.currentTarget.style.color = '#0F0F0F'; }}
            >
              See a sample
            </button>
          </div>

          <TypewriterHero />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEBE8', borderBottom: '1px solid #EEEBE8' }}>
        <div className="pp-wrap">
          <div className="pp-stats-bar">
            {['12 departments', '6 prompts per package', '€2.50 per package'].map((item, i, arr) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#6B6B6B' }}>{item}</span>
                {i < arr.length - 1 && (
                  <span style={{ color: '#E8622A', fontSize: '16px', fontWeight: 700, userSelect: 'none' }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPARTMENT LIST ── */}
      <section style={{ backgroundColor: '#FFFFFF' }}>
        <div className="pp-wrap pp-section-pad">
          <h2 style={{ fontWeight: 700, fontSize: '36px', color: '#0F0F0F', letterSpacing: '-0.01em', marginBottom: '60px' }}>
            Find your department.
          </h2>

          <div className="pp-sidebar-layout">
            {/* LEFT SIDEBAR */}
            <aside className="pp-sidebar">
              <p style={{ fontWeight: 600, fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
                Filter by
              </p>
              <div className="pp-sidebar-pills" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[{ label: 'All departments', value: null }, ...CATEGORIES.map(c => ({ label: c, value: c }))].map(({ label, value }) => {
                  const isActive = activeCategory === value;
                  return (
                    <button
                      key={label}
                      onClick={() => setActiveCategory(value)}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 20px', borderRadius: '6px', fontWeight: 500, fontSize: '14px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', backgroundColor: isActive ? '#E8622A' : '#FAFAF8', color: isActive ? '#FFFFFF' : '#0F0F0F' }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* DEPARTMENT LIST */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {filtered.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6B6B6B', paddingTop: '40px' }}>No departments in this category.</p>
              ) : (
                <div>
                  {filtered.map((dept, i) => {
                    const meta = DEPT_META[dept.id] ?? { category: 'General', teaser: dept.description };
                    return (
                      <DeptRow
                        key={dept.id}
                        href={`/department/${dept.id}`}
                        name={dept.department}
                        teaser={meta.teaser}
                        category={meta.category}
                        price={dept.price}
                        isFirst={i === 0}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ backgroundColor: '#FAFAF8', borderTop: '1px solid #EEEBE8' }}>
        <div className="pp-wrap pp-section-pad">
          <p style={{ fontWeight: 600, fontSize: '12px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            How it works
          </p>
          <h2 style={{ fontWeight: 700, fontSize: '36px', color: '#0F0F0F', letterSpacing: '-0.01em', marginBottom: '60px' }}>
            Three steps. No fluff.
          </h2>

          <div className="pp-three-col">
            {[
              { num: '01', title: 'Choose your department', body: 'IB, Consulting, ESG, Product, Luxury — 12 departments, each with prompts built for that specific internship context.' },
              { num: '02', title: 'Unlock your package — €2.50', body: 'One payment, permanent access. 6 prompts per package: CV bullets, CV summary, cover letter, cold outreach, interview prep, and a standout deliverable.' },
              { num: '03', title: 'Paste your CV and JD', body: 'Each prompt is a step-chain that interrogates your experience before writing anything. The output sounds like you, not a template.' },
            ].map((step, i) => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: i < 2 ? '48px' : '0', paddingLeft: i > 0 ? '48px' : '0', borderRight: i < 2 ? '1px solid #EEEBE8' : 'none' }}>
                <span style={{ fontWeight: 900, fontSize: '11px', color: '#E8622A', letterSpacing: '0.1em' }}>{step.num}</span>
                <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#0F0F0F' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: 1.8 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ backgroundColor: '#FDF0EB' }}>
        <div className="pp-wrap pp-section-pad" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '24px' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Ready to start
          </p>
          <h2 style={{ fontWeight: 700, fontSize: '36px', color: '#0F0F0F', letterSpacing: '-0.01em', maxWidth: '480px' }}>
            Sound like you actually know the job.
          </h2>
          <p style={{ fontSize: '16px', color: '#6B6B6B', fontWeight: 400, maxWidth: '280px', lineHeight: 1.7 }}>
            €2.50 per department. No subscription. No account needed.
          </p>
          <Link
            href="/departments"
            style={{ marginTop: '8px', backgroundColor: '#E8622A', color: '#fff', fontWeight: 600, fontSize: '15px', padding: '14px 32px', borderRadius: '6px', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
          >
            Browse Packages
          </Link>
        </div>
      </section>
    </>
  );
}

function DeptRow({ href, name, teaser, category, price, isFirst }: {
  href: string; name: string; teaser: string; category: string; price: number; isFirst: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 0', borderTop: isFirst ? '1px solid #EEEBE8' : 'none', borderBottom: '1px solid #EEEBE8', textDecoration: 'none', cursor: 'pointer' }}
    >
      <div style={{ flex: 1, minWidth: 0, paddingRight: '32px' }}>
        <p style={{ fontWeight: 700, fontSize: '20px', color: hovered ? '#E8622A' : '#0F0F0F', marginBottom: '8px', lineHeight: 1.2, transition: 'color 0.2s' }}>
          {name}
        </p>
        <p style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 400, lineHeight: 1.6 }}>
          {teaser}
        </p>
      </div>
      <div className="pp-dept-row-right" style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
        <p style={{ fontWeight: 500, fontSize: '11px', color: '#6B6B6B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {category}
        </p>
        <p style={{ fontWeight: 600, fontSize: '15px', color: '#E8622A' }}>
          €{price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
