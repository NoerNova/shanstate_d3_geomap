'use client';

import MapExplorer from '@/components/MapExplorer';
import { MAP_META } from '@/lib/constants';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Shan State Geo Map
          </h1>
          <p className="text-lg text-gray-600">
            Explore Shan State townships interactively with hover details and click-to-view sidebar info.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-slate-100">
          <MapExplorer mapMeta={MAP_META.Shan} />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Project maintained by{' '}
            <a
              href="https://shannews.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              SHAN (Shan Herald Agency for News)
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
