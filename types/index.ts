import { FeatureCollection, Geometry } from 'geojson';

export enum MapType {
  COUNTRY = 'country',
  STATE = 'state',
}

export interface MapMeta {
  name: string;
  geoDataFile: string;
  mapType: MapType;
  graphObjectName: string;
}

export interface TownshipProperties {
  ST?: string;
  ST_PCODE?: string;
  DT?: string;
  DT_PCODE?: string;
  TS?: string;
  TS_PCODE?: string;
  SELF_ADMIN?: string;
  ST_RG?: string;
  TS_MMR4?: string;
  [key: string]: any;
}

// Using any here to avoid topojson type complexity
// The topojson-client library handles the actual typing
export type TopoJsonData = any;
