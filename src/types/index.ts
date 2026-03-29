export type LayerId = 'forest' | 'co2' | 'energy' | 'hdi' | 'population';

export interface CountryYearData {
  code: string;
  rawValue: number;   // actual data value (tonnes, %, index, etc.)
  colorValue: number; // normalized value used for coloring
}

export interface LayerData {
  byCode: Map<string, Map<number, number>>;
  years: number[];     // sorted array of years with data
  globalMin: number;
  globalMax: number;
}

export interface ProcessedData {
  layers: Map<LayerId, LayerData>;
  nameToCode: Map<string, string>;
  codeToName: Map<string, string>;
  regions: Map<string, string>; // ISO code -> OWID region name
}

export interface SelectedCountry {
  code: string;
  entity: string;
  region?: string;
}