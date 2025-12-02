import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shan State Geo Map',
  description: 'A geo, topology map for Shan state region using D3.js',
  authors: [{ name: 'SHAN', url: 'https://shannews.org' }],
  keywords: ['shan state', 'myanmar', 'd3', 'map', 'choropleth', 'topojson'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
