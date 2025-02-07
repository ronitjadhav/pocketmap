// src/app/constants.ts (or directly in your MapFacadeService)
export interface BasemapOption {
    name: string;
    type: string;
    url: string;
  }
  
  export const BASEMAP_OPTIONS: BasemapOption[] = [
    {
      name: 'OSM Basemap',
      type: 'xyz',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
      name: 'Stadia Stamen Terrain',
      type: 'xyz',
      url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png'
    },
  ];
  
  // Use the first option as the default basemap.
  export const DEFAULT_BASEMAP = BASEMAP_OPTIONS[0];
  