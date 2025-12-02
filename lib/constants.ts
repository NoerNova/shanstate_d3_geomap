import { MapMeta, MapType } from '@/types';
import type { LocaleKey } from '@/types';

export const MAP_TYPES = {
  COUNTRY: MapType.COUNTRY,
  STATE: MapType.STATE,
};

export const MAPS_DIR = '/maps';

export const MAP_META: Record<string, MapMeta> = {
  Shan: {
    name: 'Shan State Townships',
    geoDataFile: `${MAPS_DIR}/shan_state_townships.json`,
    mapType: MapType.STATE,
    graphObjectName: 'myanmar_township',
    format: 'topojson',
    description: 'Admin level 3 (township) boundaries across Shan State.',
  },
  ShanVillagePoints: {
    name: 'Village Points',
    geoDataFile: `${MAPS_DIR}/shan_state_village_points.json`,
    mapType: MapType.STATE,
    format: 'geojson',
    description: 'Village point locations across Shan State.',
  },
  ShanVillageTracts: {
    name: 'Village Tract Boundaries',
    geoDataFile: `${MAPS_DIR}/shan_state_village_tract_boundaries.json`,
    mapType: MapType.STATE,
    format: 'geojson',
    description: 'Village tract boundary polygons for Shan State.',
  },
};

export const STATE_CODES: Record<string, string> = {
  'MM-07': 'Ayeyarwady',
  'MM-02': 'Bago',
  'MM-14': 'Chin',
  'MM-11': 'Kachin',
  'MM-12': 'Kayah',
  'MM-13': 'Kayin',
  'MM-03': 'Magway',
  'MM-04': 'Mandalay',
  'MM-15': 'Mon',
  'MM-18': 'Nay Pyi Taw',
  'MM-16': 'Rakhine',
  'MM-01': 'Sagaing',
  'MM-17': 'Shan',
  'MM-05': 'Tanintharyi',
  'MM-06': 'Yangon',
};

export const LOCALES: { key: LocaleKey; label: string; hint: string }[] = [
  { key: 'en', label: 'English', hint: 'Latin script' },
  { key: 'my-MM', label: 'Burmese', hint: 'မြန်မာ' },
  { key: 'shn-MM', label: 'Shan', hint: 'တႆး' },
];
