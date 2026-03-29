import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import type { ProcessedData, LayerId, LayerData } from '../types';
import { LAYER_CONFIGS } from '../config/layers';

type RawRow = Record<string, unknown>;

function parseCSV(text: string): Promise<RawRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawRow>(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (r) => resolve(r.data),
      error: (err: Error) => reject(err),
    });
  });
}

interface LoadResult {
  id: LayerId;
  layerData: LayerData;
  nameToCode: Map<string, string>;
  codeToName: Map<string, string>;
  regions: Map<string, string>;
}

async function loadLayer(baseUrl: string, id: LayerId): Promise<LoadResult> {
  const config = LAYER_CONFIGS.find((c) => c.id === id)!;
  const res = await fetch(`${baseUrl}${config.fileName}`);
  if (!res.ok) throw new Error(`Failed to load ${config.fileName}: ${res.statusText}`);
  const text = await res.text();
  const rows = await parseCSV(text);

  const byCode = new Map<string, Map<number, number>>();
  const nameToCode = new Map<string, string>();
  const codeToName = new Map<string, string>();
  const regions = new Map<string, string>();
  const yearSet = new Set<number>();
  let globalMin = Infinity;
  let globalMax = -Infinity;

  for (const raw of rows) {
    const code = raw['Code'] as string;
    if (!code || !/^[A-Z]{3}$/.test(code)) continue;

    const entity = raw['Entity'] as string;
    const year = raw['Year'] as number;
    if (!entity || typeof year !== 'number' || !isFinite(year)) continue;

    // Year filter (e.g. poverty: skip pre-1990)
    if (config.minYearFilter != null && year < config.minYearFilter) continue;

    // Resolve value — population has two columns
    let value: number | null = null;
    if (id === 'population') {
      const actual = raw['Population, total'];
      const projected = raw['Population, medium projection (Projected)'];
      if (actual != null && actual !== '' && actual !== 0) {
        value = Number(actual);
      } else if (projected != null && projected !== '') {
        value = Number(projected);
      }
    } else {
      const v = raw[config.valueColumn];
      if (v != null && v !== '') value = Number(v);
    }

    if (value == null || !isFinite(value)) continue;

    if (!byCode.has(code)) byCode.set(code, new Map());
    byCode.get(code)!.set(year, value);
    nameToCode.set(entity, code);
    codeToName.set(code, entity);
    yearSet.add(year);

    if (value < globalMin) globalMin = value;
    if (value > globalMax) globalMax = value;

    const region = raw['World region according to OWID'] as string | undefined;
    if (region && !regions.has(code)) regions.set(code, region);
  }

  const years = Array.from(yearSet).sort((a, b) => a - b);

  return {
    id,
    layerData: { byCode, years, globalMin, globalMax },
    nameToCode,
    codeToName,
    regions,
  };
}

export function useDataLoader() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = import.meta.env.BASE_URL;
      const layerIds: LayerId[] = ['forest', 'co2', 'energy', 'hdi', 'population'];

      const results = await Promise.all(layerIds.map((id) => loadLayer(baseUrl, id)));

      const layers = new Map<LayerId, LayerData>();
      const nameToCode = new Map<string, string>();
      const codeToName = new Map<string, string>();
      const regions = new Map<string, string>();

      for (const r of results) {
        layers.set(r.id, r.layerData);
        for (const [name, code] of r.nameToCode) nameToCode.set(name, code);
        for (const [code, name] of r.codeToName) codeToName.set(code, name);
        for (const [code, region] of r.regions) regions.set(code, region);
      }

      setData({ layers, nameToCode, codeToName, regions });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, retry: load };
}