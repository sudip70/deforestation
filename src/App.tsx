import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useDataLoader } from './hooks/useDataLoader';
import { getDataForYear } from './utils/dataParser';
import { GlobeVisualization } from './components/globe/GlobeVisualization';
import { Header } from './components/Header';
import { LeftPanel } from './components/panels/LeftPanel';
import { RightPanel } from './components/panels/RightPanel';
import { Controls } from './components/controls/Controls';
import { LayerSwitcher } from './components/controls/LayerSwitcher';
import { CountryDetailPanel } from './components/panels/CountryDetailPanel';
import { DataSourcesModal } from './components/modals/DataSourcesModal';
import { AboutModal } from './components/modals/AboutModal';
import { ErrorOverlay } from './components/ErrorOverlay';
import type { SelectedCountry, LayerId } from './types';

const VIGNETTE_STYLE: React.CSSProperties = {
  background: `
    radial-gradient(ellipse 75% 75% at 50% 50%, transparent 35%, rgba(2,5,8,0.6) 100%),
    linear-gradient(to bottom, rgba(2,5,8,0.55) 0%, transparent 18%, transparent 72%, rgba(2,5,8,0.92) 100%)
  `,
};

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-[rgba(2,5,8,0.75)] backdrop-blur-sm">
      <div
        className="spin w-[38px] h-[38px] rounded-full mb-4"
        style={{ border: '2px solid rgba(34,197,94,0.2)', borderTopColor: '#22c55e' }}
      />
      <div className="text-green-500 font-mono text-[11px] tracking-[3px]">
        LOADING DATA...
      </div>
    </div>
  );
}

export default function App() {
  const { data, loading, error, retry } = useDataLoader();

  const [activeLayer, setActiveLayer] = useState<LayerId>('population');
  const [year, setYear] = useState(2025);
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [showDataSources, setShowDataSources] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeLayerData = useMemo(
    () => data?.layers.get(activeLayer),
    [data, activeLayer]
  );
  const minYear = activeLayerData?.years[0] ?? 1990;
  const maxYear = activeLayerData?.years.slice(-1)[0] ?? 2025;

  const handleLayerChange = useCallback((newLayer: LayerId) => {
    setActiveLayer(newLayer);
    if (newLayer === 'population' || newLayer === 'forest') {
      setYear(2025);
    } else {
      const ld = data?.layers.get(newLayer);
      if (ld) setYear(ld.years.slice(-1)[0]);
    }
  }, [data]);

  useEffect(() => {
    if (activeLayerData) {
      const lo = activeLayerData.years[0];
      const hi = activeLayerData.years.slice(-1)[0];
      setYear((y) => Math.max(lo, Math.min(hi, y)));
    }
  }, [activeLayerData]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setYear((y) => {
          if (y >= maxYear) { setPlaying(false); return y; }
          return y + 1;
        });
      }, Math.round(700 / playSpeed));
    } else {
      if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  }, [playing, maxYear, playSpeed]);

  useEffect(() => {
    if (year >= maxYear && playing) setPlaying(false);
  }, [year, maxYear, playing]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        togglePlay();
      }
      if (e.code === 'Escape') {
        setSelectedCode(null);
        setShowDataSources(false);
        setShowAbout(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const dataForYear = useMemo(
    () => (data ? getDataForYear(data, activeLayer, year) : new Map()),
    [data, activeLayer, year]
  );

  const selectedCountry = useMemo<SelectedCountry | null>(() => {
    if (!selectedCode || !data) return null;
    const entity = data.codeToName.get(selectedCode) ?? selectedCode;
    const region = data.regions.get(selectedCode);
    return { code: selectedCode, entity, region };
  }, [selectedCode, data]);

  function togglePlay() {
    if (!playing && year >= maxYear) setYear(minYear);
    setPlaying((p) => !p);
  }

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ height: '100dvh' }}>
      <div className="absolute inset-0 pointer-events-none z-[2]" style={VIGNETTE_STYLE} />

      <GlobeVisualization
        dataForYear={dataForYear}
        activeLayer={activeLayer}
        selectedCode={selectedCode}
        onCountrySelect={setSelectedCode}
        playing={playing}
        year={year}
      />

      <Header year={year} onInfoClick={() => setShowDataSources(true)} onAboutClick={() => setShowAbout(true)} />

      {/* Desktop: layer switcher — left center */}
      <div className="hidden md:block fixed left-6 top-1/2 -translate-y-1/2 z-20">
        <LayerSwitcher activeLayer={activeLayer} onChange={handleLayerChange} />
      </div>

      {/* Right panels — right center on desktop, top-right on mobile */}
      <div className="fixed right-3 md:right-6 top-[72px] md:top-1/2 md:-translate-y-1/2 z-20 flex flex-col items-end gap-3">
        {/* Stats panel — desktop only */}
        <div className="hidden md:block">
          <LeftPanel activeLayer={activeLayer} data={data} year={year} />
        </div>

        <AnimatePresence mode="wait">
          {selectedCountry && data ? (
            <CountryDetailPanel
              key="detail"
              selected={selectedCountry}
              data={data}
              activeLayer={activeLayer}
              year={year}
              onClose={() => setSelectedCode(null)}
            />
          ) : (
            <RightPanel key={`legend-${activeLayer}`} activeLayer={activeLayer} />
          )}
        </AnimatePresence>
      </div>

      {/* Controls (includes mobile layer switcher) */}
      <Controls
        year={year}
        minYear={minYear}
        maxYear={maxYear}
        playing={playing}
        playSpeed={playSpeed}
        onYearChange={setYear}
        onPlayToggle={togglePlay}
        onSpeedChange={setPlaySpeed}
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
      />

      {/* Data Sources Modal */}
      <AnimatePresence>
        {showDataSources && (
          <DataSourcesModal onClose={() => setShowDataSources(false)} />
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <AboutModal onClose={() => setShowAbout(false)} />
        )}
      </AnimatePresence>

      {loading && <LoadingOverlay />}
      {error && !loading && <ErrorOverlay message={error} onRetry={retry} />}
    </div>
  );
}