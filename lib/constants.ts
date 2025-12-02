import { MapMeta, MapType } from '@/types';

export const MAP_TYPES = {
  COUNTRY: MapType.COUNTRY,
  STATE: MapType.STATE,
};

export const MAPS_DIR = '/maps';

export const MAP_META: Record<string, MapMeta> = {
  Shan: {
    name: 'Shan',
    geoDataFile: `${MAPS_DIR}/shan_state_townships.json`,
    mapType: MapType.STATE,
    graphObjectName: 'myanmar_township',
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
