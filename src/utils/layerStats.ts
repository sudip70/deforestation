import type { ProcessedData, LayerId, LayerData } from '../types';
import { LAYER_MAP } from '../config/layers';

export interface StatInfo {
  value: string;
  unit: string;
  label: string;
  color: string;
  barWidth?: number;
  barColor?: string;
}

export interface LayerStats {
  primary: StatInfo;
  secondary: StatInfo;
  tertiary: StatInfo;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function avgForYear(byCode: LayerData['byCode'], year: number) {
  let sum = 0, n = 0;
  for (const ym of byCode.values()) {
    const v = ym.get(year);
    if (v != null) { sum += v; n++; }
  }
  return n > 0 ? { avg: sum / n, n } : null;
}

function totalForYear(byCode: LayerData['byCode'], year: number) {
  let sum = 0, n = 0;
  for (const ym of byCode.values()) {
    const v = ym.get(year);
    if (v != null) { sum += v; n++; }
  }
  return n > 0 ? sum : null;
}

function extremeForYear(
  byCode: LayerData['byCode'],
  year: number,
  codeToName: Map<string, string>,
  mode: 'max' | 'min'
): { name: string; value: number } | null {
  let extremeVal = mode === 'max' ? -Infinity : Infinity;
  let extremeCode = '';
  for (const [code, ym] of byCode) {
    const v = ym.get(year);
    if (v == null) continue;
    if (mode === 'max' ? v > extremeVal : v < extremeVal) {
      extremeVal = v; extremeCode = code;
    }
  }
  if (!extremeCode) return null;
  const name = codeToName.get(extremeCode) ?? extremeCode;
  return { name: name.length > 14 ? name.slice(0, 13) + '…' : name, value: extremeVal };
}

function countAbove(byCode: LayerData['byCode'], year: number, threshold: number) {
  let n = 0;
  for (const ym of byCode.values()) {
    const v = ym.get(year);
    if (v != null && v > threshold) n++;
  }
  return n;
}

function countBelow(byCode: LayerData['byCode'], year: number, threshold: number) {
  let n = 0;
  for (const ym of byCode.values()) {
    const v = ym.get(year);
    if (v != null && v < threshold) n++;
  }
  return n;
}

function pctChange(
  byCode: LayerData['byCode'],
  year: number,
  baseYear: number
): number | null {
  const cur = avgForYear(byCode, year);
  const base = avgForYear(byCode, baseYear);
  if (!cur || !base || base.avg === 0) return null;
  return ((cur.avg - base.avg) / Math.abs(base.avg)) * 100;
}

// ─── per-layer stats ─────────────────────────────────────────────────────────

function forestStats(year: number): LayerStats {
  const yp = year - 2000;
  const coverageNum = Math.max(0, 31.6 - yp * 0.04);
  const lostNum = Math.max(0, yp * 0.2);
  return {
    primary: {
      value: coverageNum.toFixed(1), unit: '%', label: 'Global Forest Coverage',
      color: '#4ade80',
      barWidth: coverageNum,
      barColor: 'linear-gradient(to right, #15803d, #4ade80)',
    },
    secondary: {
      value: lostNum.toFixed(1), unit: 'M km²', label: 'Lost Since 2000',
      color: '#f87171',
      barWidth: Math.min((lostNum / 5) * 100, 100),
      barColor: 'linear-gradient(to right, #dc2626, #f87171)',
    },
    tertiary: {
      value: '~200K', unit: 'km²', label: 'Avg Annual Loss',
      color: '#fb923c',
    },
  };
}

function co2Stats(ld: LayerData, year: number, codeToName: Map<string, string>): LayerStats {
  const config = LAYER_MAP.get('co2')!;
  const res = avgForYear(ld.byCode, year);
  const avg = res?.avg ?? 0;
  const top = extremeForYear(ld.byCode, year, codeToName, 'max');
  const change = pctChange(ld.byCode, year, 1990);

  return {
    primary: {
      value: avg.toFixed(1), unit: 'tonnes', label: 'Global Avg Per Capita',
      color: avg < 5 ? '#4ade80' : avg < 10 ? '#f59e0b' : '#f87171',
      barWidth: Math.min((avg / 20) * 100, 100),
      barColor: 'linear-gradient(to right, #16a34a, #f97316, #dc2626)',
    },
    secondary: {
      value: top ? config.formatValue(top.value) : '—', unit: '',
      label: `Top: ${top?.name ?? '—'}`,
      color: '#f87171',
    },
    tertiary: {
      value: change != null ? (change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`) : '—',
      unit: '', label: 'Avg Change Since 1990',
      color: change != null && change <= 0 ? '#4ade80' : '#f87171',
    },
  };
}

function energyStats(ld: LayerData, year: number, codeToName: Map<string, string>): LayerStats {
  const config = LAYER_MAP.get('energy')!;
  const res = avgForYear(ld.byCode, year);
  const avg = res?.avg ?? 0;
  const top = extremeForYear(ld.byCode, year, codeToName, 'max');
  const change = pctChange(ld.byCode, year, 1990);

  return {
    primary: {
      value: config.formatValue(avg), unit: '', label: 'Global Avg Per Capita',
      color: '#38bdf8',
      barWidth: Math.min((avg / 20000) * 100, 100),
      barColor: 'linear-gradient(to right, #0ea5e9, #4f46e5)',
    },
    secondary: {
      value: top ? config.formatValue(top.value) : '—', unit: '',
      label: `Top: ${top?.name ?? '—'}`,
      color: '#a5b4fc',
    },
    tertiary: {
      value: change != null ? (change >= 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`) : '—',
      unit: '', label: 'Avg Change Since 1990',
      color: '#94a3b8',
    },
  };
}

function hdiStats(ld: LayerData, year: number, codeToName: Map<string, string>): LayerStats {
  const config = LAYER_MAP.get('hdi')!;
  const res = avgForYear(ld.byCode, year);
  const avg = res?.avg ?? 0;
  const veryHigh = countAbove(ld.byCode, year, 0.8);
  const low = countBelow(ld.byCode, year, 0.55);

  // suppress unused warning
  void codeToName;

  return {
    primary: {
      value: config.formatValue(avg), unit: '', label: 'Global Average HDI',
      color: avg >= 0.75 ? '#4ade80' : avg >= 0.6 ? '#f59e0b' : '#f87171',
      barWidth: avg * 100,
      barColor: 'linear-gradient(to right, #dc2626, #eab308, #16a34a)',
    },
    secondary: {
      value: String(veryHigh), unit: 'countries', label: 'Very High HDI (>0.8)',
      color: '#4ade80',
    },
    tertiary: {
      value: String(low), unit: 'countries', label: 'Low HDI (<0.55)',
      color: '#f87171',
    },
  };
}

function populationStats(ld: LayerData, year: number, codeToName: Map<string, string>): LayerStats {
  const config = LAYER_MAP.get('population')!;
  const total = totalForYear(ld.byCode, year) ?? 0;
  const top = extremeForYear(ld.byCode, year, codeToName, 'max');
  const isProjected = year >= 2024;

  return {
    primary: {
      value: config.formatValue(total), unit: '', label: `World Population${isProjected ? ' *' : ''}`,
      color: '#2d9d8f',
      barWidth: Math.min((total / 1e10) * 100, 100),
      barColor: 'linear-gradient(to right, #d5f1e4, #3eabad, #1e7ba1, #0a336b)',
    },
    secondary: {
      value: top ? config.formatValue(top.value) : '—', unit: '',
      label: `Largest: ${top?.name ?? '—'}`,
      color: '#3eabad',
    },
    tertiary: {
      value: isProjected ? '~ UN Projected' : 'Observed Data',
      unit: '', label: 'Data Type',
      color: isProjected ? '#fbbf24' : '#4ade80',
    },
  };
}

// ─── public entry point ───────────────────────────────────────────────────────

export function getLayerStats(
  layerId: LayerId,
  data: ProcessedData,
  year: number
): LayerStats {
  if (layerId === 'forest') return forestStats(year);

  const ld = data.layers.get(layerId);
  if (!ld) return forestStats(year); // fallback

  switch (layerId) {
    case 'co2':        return co2Stats(ld, year, data.codeToName);
    case 'energy':     return energyStats(ld, year, data.codeToName);
    case 'hdi':        return hdiStats(ld, year, data.codeToName);
    case 'population': return populationStats(ld, year, data.codeToName);
    default:           return forestStats(year);
  }
}