'use client';

import React, { useState } from 'react';
import ChoroplethMap from './ChoroplethMap';
import { MapMeta, TownshipProperties } from '@/types';

interface MapExplorerProps {
  mapMeta: MapMeta;
}

const MapExplorer: React.FC<MapExplorerProps> = ({ mapMeta }) => {
  const [selectedTownship, setSelectedTownship] = useState<TownshipProperties | null>(null);

  const formatLabel = (label?: string) => (label && label.trim().length > 0 ? label : 'Not available');

  return (
    <div className="fadeInUp" style={{ animationDelay: '1.2s' }}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start min-h-[70vh]">
        <ChoroplethMap mapMeta={mapMeta} onSelectTownship={setSelectedTownship} />

        <aside className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">Township info</h2>
          {selectedTownship ? (
            <dl className="space-y-2 text-slate-700">
              <div>
                <dt className="text-sm text-slate-500">Township</dt>
                <dd className="text-lg font-semibold">
                  {formatLabel(selectedTownship.TS)}{' '}
                  {selectedTownship.TS_MMR4 ? (
                    <span className="text-sm text-slate-500">({selectedTownship.TS_MMR4})</span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">District</dt>
                <dd>{formatLabel(selectedTownship.DT)}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">State/Region</dt>
                <dd>
                  {formatLabel(selectedTownship.ST)}{' '}
                  {selectedTownship.ST_RG ? (
                    <span className="text-sm text-slate-500">({selectedTownship.ST_RG})</span>
                  ) : null}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-sm text-slate-500">Township PCode</dt>
                  <dd className="font-mono text-sm">{formatLabel(selectedTownship.TS_PCODE)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">District PCode</dt>
                  <dd className="font-mono text-sm">{formatLabel(selectedTownship.DT_PCODE)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">State PCode</dt>
                  <dd className="font-mono text-sm">{formatLabel(selectedTownship.ST_PCODE)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">Self-admin</dt>
                  <dd>{selectedTownship.SELF_ADMIN ? selectedTownship.SELF_ADMIN : '—'}</dd>
                </div>
              </div>
            </dl>
          ) : (
            <p className="text-slate-600">
              Click a township on the map to see its district, state, P-codes, and local name.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default React.memo(MapExplorer);
