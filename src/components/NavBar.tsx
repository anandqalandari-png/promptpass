'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'Library', href: '/departments' },
  { label: 'How it works', href: '/#how-it-works' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      backgroundColor: '#FFFFFF', borderBottom: '1px solid #EEEBE8',
    }}>
      <div style={{
        width: '100%',
        paddingLeft: '40px',
        paddingRight: '40px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
      }}>

        {/* Logo */}
        <Link href="/" aria-label="PromptPass home" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: '20px', color: '#E8622A', letterSpacing: '-0.01em' }}>
            PromptPass
          </span>
        </Link>

        {/* Desktop nav — hidden on mobile via CSS class */}
        <nav className="pp-desktop-nav" style={{ alignItems: 'center', gap: '40px' }}>
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]));
            return (
              <Link
                key={href}
                href={href}
                style={{ fontWeight: 500, fontSize: '15px', color: active ? '#E8622A' : '#0F0F0F', textDecoration: 'none' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#E8622A'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = active ? '#E8622A' : '#0F0F0F'; }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA — hidden on mobile */}
        <div className="pp-desktop-nav" style={{ flexShrink: 0 }}>
          <Link
            href="/departments"
            style={{ backgroundColor: '#E8622A', color: '#FFFFFF', fontWeight: 600, fontSize: '14px', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#D4551F')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#E8622A')}
          >
            Browse Packages
          </Link>
        </div>

        {/* Mobile hamburger — hidden on desktop */}
        <button
          className="pp-mobile-nav"
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ flexDirection: 'column', gap: '5px', padding: '8px', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: '#0F0F0F', transform: menuOpen ? 'translateY(6.5px) rotate(45deg)' : 'none', transition: 'transform 0.2s', transformOrigin: 'center' }} />
          <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: '#0F0F0F', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ display: 'block', width: '20px', height: '1.5px', backgroundColor: '#0F0F0F', transform: menuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none', transition: 'transform 0.2s', transformOrigin: 'center' }} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className="pp-mobile-nav"
        style={{ overflow: 'hidden', maxHeight: menuOpen ? '256px' : '0', transition: 'max-height 0.2s', backgroundColor: '#FFFFFF', borderTop: menuOpen ? '1px solid #EEEBE8' : 'none', flexDirection: 'column' }}
        aria-hidden={!menuOpen}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', padding: '16px 40px', gap: '4px' }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href} style={{ fontSize: '15px', fontWeight: 500, padding: '12px 0', borderBottom: '1px solid #EEEBE8', color: '#0F0F0F', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
          <Link href="/departments" style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', borderRadius: '6px', backgroundColor: '#E8622A', color: '#FFFFFF', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            Browse Packages
          </Link>
        </nav>
      </div>
    </header>
  );
}
