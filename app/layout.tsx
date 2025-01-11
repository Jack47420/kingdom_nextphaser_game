import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Resource Kingdom',
  description: 'A resource management game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-white dark:bg-gray-950")}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster theme="system" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
