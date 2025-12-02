"use client";

import React, { useMemo, useState } from "react";
import ChoroplethMap from "./ChoroplethMap";
import { LocaleKey, MapMeta, TownshipProperties } from "@/types";
import { LOCALES, MAP_META } from "@/lib/constants";
import "@/lib/i18n";
import { useTranslation } from "react-i18next";

interface MapExplorerProps {
  mapMetas?: MapMeta[];
}

const MapExplorer: React.FC<MapExplorerProps> = ({ mapMetas }) => {
  const availableMaps = useMemo(
    () => mapMetas || Object.values(MAP_META),
    [mapMetas],
  );
  const [currentMap, setCurrentMap] = useState<MapMeta | null>(
    availableMaps[0] || null,
  );
  const [selectedTownship, setSelectedTownship] =
    useState<TownshipProperties | null>(null);
  const [selectedLocale, setSelectedLocale] = useState<LocaleKey>("en");
  const { t, i18n } = useTranslation();

  const formatLabel = (label?: string | null) =>
    label && label.trim().length > 0 ? label : "Not available";

  const translateTownshipOrDistrict = (value?: string | null) => {
    if (!value) return value;
    return t(`townships.${value}`, { defaultValue: value });
  };

  const getLocalizedName = (props: TownshipProperties | null | undefined) => {
    if (!props) return null;
    const key = props.TS || props.DT || null;
    if (!key) return null;
    return translateTownshipOrDistrict(key);
  };

  const primaryLabel = getLocalizedName(selectedTownship);
  const secondaryLabel =
    selectedTownship?.VT ||
    (selectedTownship?.TS ? translateTownshipOrDistrict(selectedTownship.TS) : null);

  if (!currentMap) {
    return (
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <p className="text-slate-600">No map data configured.</p>
      </div>
    );
  }

  return (
    <div className="fadeInUp" style={{ animationDelay: "1.2s" }}>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] items-start min-h-[70vh]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {availableMaps.map((map) => (
              <button
                key={map.geoDataFile}
                onClick={() => {
                  setCurrentMap(map);
                  setSelectedTownship(null);
                }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  currentMap.geoDataFile === map.geoDataFile
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {map.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {LOCALES.map((locale) => (
              <button
                key={locale.key}
                onClick={() => {
                  setSelectedLocale(locale.key);
                  i18n.changeLanguage(locale.key);
                }}
                className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-all ${
                  selectedLocale === locale.key
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
                title={locale.hint}
              >
                {locale.label}
              </button>
            ))}
          </div>
          <ChoroplethMap
            mapMeta={currentMap}
            onSelectTownship={setSelectedTownship}
          />
        </div>

        <aside className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">
            Location info
          </h2>
          {currentMap.description && (
            <p className="text-sm text-slate-600 mb-3">
              {currentMap.description}
            </p>
          )}
          {selectedTownship ? (
            <dl className="space-y-2 text-slate-700">
              <div>
                <dt className="text-sm text-slate-500">Location</dt>
                <dd className="text-lg font-semibold flex items-start gap-2 flex-wrap">
                  <span>{formatLabel(primaryLabel)}</span>
                  {selectedTownship.TS ? (
                    <span className="text-sm text-slate-500">
                      ({selectedTownship.TS})
                    </span>
                  ) : null}
                </dd>
              </div>
              {secondaryLabel && (
                <div>
                  <dt className="text-sm text-slate-500">Area</dt>
                  <dd>{formatLabel(secondaryLabel)}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-slate-500">District</dt>
                <dd>{formatLabel(translateTownshipOrDistrict(selectedTownship.DT))}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">State/Region</dt>
                <dd>
                  {formatLabel(selectedTownship.ST)}{" "}
                  {selectedTownship.ST_RG ? (
                    <span className="text-sm text-slate-500">
                      ({selectedTownship.ST_RG})
                    </span>
                  ) : null}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-sm text-slate-500">Township PCode</dt>
                  <dd className="font-mono text-sm">
                    {formatLabel(selectedTownship.TS_PCODE)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">District PCode</dt>
                  <dd className="font-mono text-sm">
                    {formatLabel(selectedTownship.DT_PCODE)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-slate-500">State PCode</dt>
                  <dd className="font-mono text-sm">
                    {formatLabel(selectedTownship.ST_PCODE)}
                  </dd>
                </div>
                {selectedTownship.VT && (
                  <div>
                    <dt className="text-sm text-slate-500">Village Tract</dt>
                    <dd>{formatLabel(selectedTownship.VT)}</dd>
                  </div>
                )}
                {selectedTownship.VT_PCODE && (
                  <div>
                    <dt className="text-sm text-slate-500">
                      Village Tract PCode
                    </dt>
                    <dd className="font-mono text-sm">
                      {formatLabel(String(selectedTownship.VT_PCODE))}
                    </dd>
                  </div>
                )}
                {selectedTownship.VILLAGE && (
                  <div>
                    <dt className="text-sm text-slate-500">Village</dt>
                    <dd>{formatLabel(selectedTownship.VILLAGE)}</dd>
                  </div>
                )}
                {selectedTownship.VLG_PCODE && (
                  <div>
                    <dt className="text-sm text-slate-500">Village PCode</dt>
                    <dd className="font-mono text-sm">
                      {formatLabel(String(selectedTownship.VLG_PCODE))}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-slate-500">Self-admin</dt>
                  <dd>
                    {selectedTownship.SELF_ADMIN
                      ? selectedTownship.SELF_ADMIN
                      : "—"}
                  </dd>
                </div>
              </div>
            </dl>
          ) : (
            <p className="text-slate-600">
              Click a location on the map to see its codes, names, and hierarchy
              details.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default React.memo(MapExplorer);
