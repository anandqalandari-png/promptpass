import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #EEEBE8' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingLeft: '80px', paddingRight: '80px', paddingTop: '32px', paddingBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <Link href="/" aria-label="PromptPass home" style={{ textDecoration: 'none' }}>
          <span style={{ fontWeight: 700, fontSize: '15px', color: '#E8622A' }}>PromptPass</span>
        </Link>
        <p style={{ fontSize: '13px', color: '#6B6B6B', fontWeight: 400 }}>
          12 departments · 6 prompts each · €2.50 per package
        </p>
        <Link href="/departments" style={{ fontSize: '13px', color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>
          Browse packages
        </Link>
      </div>
    </footer>
  );
}
