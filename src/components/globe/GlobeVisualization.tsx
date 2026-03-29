import { useEffect, useRef, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import type { CountryYearData, LayerId } from '../../types';
import { getCountryColor, getCountryAltitude } from '../../utils/dataParser';
import { LAYER_MAP, POPULATION_PROJECTION_START } from '../../config/layers';
import { GlobeHint } from './GlobeHint';

interface Props {
  dataForYear: Map<string, CountryYearData>;
  activeLayer: LayerId;
  selectedCode: string | null;
  onCountrySelect: (code: string | null) => void;
  playing: boolean;
  year: number;
}

const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const GLOBE_MATERIAL = {
  color: '#0c2340',
  emissive: '#0a1f35',
  emissiveIntensity: 0.3,
  shininess: 25,
  opacity: 1,
  transparent: false,
};

export function GlobeVisualization({
  dataForYear, activeLayer, selectedCode, onCountrySelect, playing, year,
}: Props) {
  const globeEl = useRef<any>(null);
  const [countries, setCountries] = useState<{ features: any[] }>({ features: [] });

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then((r) => { if (!r.ok) throw new Error('GeoJSON failed'); return r.json(); })
      .then(setCountries)
      .catch((e) => console.error('GeoJSON:', e));
  }, []);

  useEffect(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = !selectedCode && !playing;
    controls.autoRotateSpeed = 0.3;
  }, [selectedCode, playing]);

  const getColor = useCallback(
    (feature: any) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      return getCountryColor(dataForYear.get(code), activeLayer, code === selectedCode);
    },
    [dataForYear, activeLayer, selectedCode]
  );

  const getAltitude = useCallback(
    (feature: any) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      return getCountryAltitude(dataForYear.get(code), activeLayer, code === selectedCode);
    },
    [dataForYear, activeLayer, selectedCode]
  );

  const getLabel = useCallback(
    (feature: any) => {
      const props = feature.properties ?? {};
      const code: string = props.ISO_A3 ?? '';
      const name: string = props.ADMIN ?? props.NAME ?? code;
      const d = dataForYear.get(code);
      const config = LAYER_MAP.get(activeLayer)!;
      const isProjected = activeLayer === 'population' && year >= POPULATION_PROJECTION_START;
      const valueStr = d ? config.formatValue(d.rawValue) : 'No data';

      return `
        <div style="background:rgba(6,12,20,0.92);border:1px solid rgba(255,255,255,0.12);
          border-radius:10px;padding:10px 14px;min-width:160px;
          backdrop-filter:blur(12px);font-family:var(--font-mono);">
          <div style="color:${config.chartColor};font-size:13px;font-weight:600;
            margin-bottom:6px;font-family:var(--font-display);">${name}</div>
          <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:3px;">
            <span style="color:rgba(226,232,240,0.55);">${config.emoji} ${config.label}</span>
            <span style="color:#e2e8f0;">${valueStr}</span>
          </div>
          ${isProjected ? '<div style="font-size:9px;color:rgba(251,191,36,0.6);">~ UN projection</div>' : ''}
        </div>
      `;
    },
    [dataForYear, activeLayer, year]
  );

  const handlePolygonClick = useCallback(
    (feature: any, _e: MouseEvent, coords: { lat: number; lng: number; altitude: number }) => {
      const code: string = feature.properties?.ISO_A3 ?? '';
      if (!code) return;
      const next = code === selectedCode ? null : code;
      onCountrySelect(next);
      if (next && globeEl.current) {
        globeEl.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 2.5 }, 1000);
      }
    },
    [selectedCode, onCountrySelect]
  );

  return (
    <div className="fixed inset-0 globe-container" style={{ background: '#000000' }}>
      <Globe
        ref={globeEl}
        backgroundColor="#000000"
        globeMaterial={GLOBE_MATERIAL}
        atmosphereColor="rgba(211, 121, 25, 0.81)"
        atmosphereAltitude={0.15}
        polygonsData={countries.features}
        polygonAltitude={getAltitude}
        polygonCapColor={getColor}
        polygonSideColor={() => 'rgba(0,0,0,0.7)'}
        polygonStrokeColor={() => 'rgba(12,12,12,0.6)'}
        polygonLabel={getLabel}
        onPolygonClick={handlePolygonClick}
        polygonsTransitionDuration={400}
        animateIn={true}
        enablePointerInteraction={true}
      />
      <GlobeHint visible={!selectedCode} />
    </div>
  );
}