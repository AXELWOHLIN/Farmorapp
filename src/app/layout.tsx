import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Farmors Berättelser – Berätta ditt livs historia',
  description:
    'En app där du berättar din livshistoria genom att svara på frågor. Lämna dina minnen till barn och barnbarn.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-brown font-sans">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
