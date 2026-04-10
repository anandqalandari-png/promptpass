import type { Metadata } from 'next';
import './globals.css';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PromptPass — Internship Prompts for Ambitious MSc Students',
  description:
    'Curated prompt packages for internship applicants. 12 departments, 6 prompts each. CV bullets, cover letters, cold outreach and interview prep. €2.50 per package.',
  openGraph: {
    title: 'PromptPass',
    description: 'Stop sending the same CV as everyone else.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <NavBar />
        <main className="flex-1" style={{ paddingTop: '80px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
