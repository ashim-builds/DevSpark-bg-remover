import './globals.css';
import type { Metadata } from 'next';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'SparkCut AI by DevSpark',
  description: 'Remove backgrounds instantly with AI.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0f1115] text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
