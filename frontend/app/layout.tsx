import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';

export const metadata: Metadata = {
  title: 'Job Radar Terminal - <> Realtime Developer Job Market Analytics Dashboard </>',
  description: 'Realtime Developer Job Market Analytics Dashboard',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-terminal-bg text-terminal-text h-dvh min-h-screen flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 h-dvh min-h-0 flex flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
