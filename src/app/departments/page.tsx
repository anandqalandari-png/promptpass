'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUnlocked } from '@/hooks/useUnlocked';
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

export default function DepartmentsPage() {
  const { isUnlocked, hydrated } = useUnlocked();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return departments.filter((dept) => {
      const meta = DEPT_META[dept.id];
      const matchesSearch = query.trim() === '' ||
        dept.department.toLowerCase().includes(query.toLowerCase()) ||
        meta?.category.toLowerCase().includes(query.toLowerCase()) ||
        meta?.teaser.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || meta?.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, activeCategory]);

  const unlockedCount = hydrated ? departments.filter((d) => isUnlocked(d.id)).length : 0;

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEBE8' }}>
        <div className="pp-wrap" style={{ paddingTop: '72px', paddingBottom: '64px' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', color: '#E8622A', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Prompt Library
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <h1 className="pp-page-h1" style={{ fontWeight: 800, fontSize: '48px', color: '#0F0F0F', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              All departments.
            </h1>
            {hydrated && unlockedCount > 0 && (
              <p style={{ fontSize: '14px', color: '#6B6B6B', fontWeight: 400, paddingBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#E8622A' }}>{unlockedCount}</span> of 12 unlocked
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTER + LIST ── */}
      <section style={{ backgroundColor: '#FFFFFF' }}>
        <div className="pp-wrap" style={{ paddingTop: '64px', paddingBottom: '100px' }}>
          <div className="pp-sidebar-layout">

            {/* ── LEFT SIDEBAR ── */}
            <aside className="pp-sidebar">

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: '40px' }}>
                <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6B6B6B', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  style={{ width: '100%', paddingLeft: '36px', paddingRight: query ? '32px' : '12px', paddingTop: '10px', paddingBottom: '10px', fontSize: '14px', fontWeight: 400, border: '1px solid #EEEBE8', borderRadius: '6px', backgroundColor: '#FAFAF8', color: '#0F0F0F', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B6B6B', padding: '2px', display: 'flex' }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>

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

            {/* ── LIST ── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 400, marginBottom: '32px' }}>
                {filtered.length === departments.length ? `${departments.length} departments` : `${filtered.length} of ${departments.length} departments`}
              </p>

              {filtered.length === 0 ? (
                <div style={{ paddingTop: '48px' }}>
                  <p style={{ fontSize: '16px', color: '#0F0F0F', fontWeight: 600, marginBottom: '8px' }}>No results</p>
                  <p style={{ fontSize: '14px', color: '#6B6B6B', marginBottom: '20px' }}>Try a different search or clear the filter.</p>
                  <button onClick={() => { setQuery(''); setActiveCategory(null); }} style={{ background: 'none', border: '1px solid #EEEBE8', borderRadius: '6px', padding: '10px 20px', fontSize: '13px', color: '#6B6B6B', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div>
                  {filtered.map((dept, i) => {
                    const meta = DEPT_META[dept.id] ?? { category: 'General', teaser: dept.description };
                    const unlocked = hydrated && isUnlocked(dept.id);
                    return (
                      <DeptRow
                        key={dept.id}
                        href={`/department/${dept.id}`}
                        name={dept.department}
                        teaser={meta.teaser}
                        category={meta.category}
                        price={dept.price}
                        promptCount={dept.prompts.length}
                        isFirst={i === 0}
                        isUnlocked={unlocked}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function DeptRow({ href, name, teaser, category, price, promptCount, isFirst, isUnlocked }: {
  href: string; name: string; teaser: string; category: string; price: number;
  promptCount: number; isFirst: boolean; isUnlocked: boolean;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <p style={{ fontWeight: 700, fontSize: '20px', color: hovered ? '#E8622A' : '#0F0F0F', lineHeight: 1.2, transition: 'color 0.2s' }}>
            {name}
          </p>
          {isUnlocked && (
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#E8622A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Unlocked
            </span>
          )}
        </div>
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
        <p style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 400 }}>
          {promptCount} prompts
        </p>
      </div>
    </Link>
  );
}
