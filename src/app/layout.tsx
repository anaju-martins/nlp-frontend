import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry/ThemeRegistry';
import { Box } from '@mui/material';
import { Sidebar } from '@/components/SideBar/Sidebar';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Análise NLP',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ThemeRegistry>
          <Box sx={{ display: 'flex', height: '100vh' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3, overflowY: 'auto' }}>
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  );
}
