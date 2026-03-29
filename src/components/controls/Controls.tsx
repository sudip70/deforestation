import { PlayButton } from './PlayButton';
import { YearSlider } from './YearSlider';
import { LayerSwitcher } from './LayerSwitcher';
import type { LayerId } from '../../types';

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  playing: boolean;
  activeLayer: LayerId;
  dataNote?: string;        // e.g. "* Data available to 2023"
  isProjected?: boolean;    // for population 2024+
  onYearChange: (year: number) => void;
  onPlayToggle: () => void;
  onLayerChange: (layer: LayerId) => void;
}

export function Controls({
  year,
  minYear,
  maxYear,
  playing,
  activeLayer,
  dataNote,
  isProjected,
  onYearChange,
  onPlayToggle,
  onLayerChange,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '40px 24px 24px',
        background: 'linear-gradient(to top, rgba(2,5,8,0.95) 0%, transparent 100%)',
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto',
        }}
      >
        {/* Layer switcher */}
        <LayerSwitcher activeLayer={activeLayer} onChange={onLayerChange} />

        {/* Play + slider row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <PlayButton playing={playing} onClick={onPlayToggle} />
          <div style={{ flex: 1 }}>
            <YearSlider
              year={year}
              minYear={minYear}
              maxYear={maxYear}
              onYearChange={onYearChange}
            />
          </div>
        </div>

        {/* Data note row */}
        {(dataNote || isProjected) && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '6px',
              gap: '12px',
            }}
          >
            {dataNote && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: 'rgba(226,232,240,0.4)',
                }}
              >
                {dataNote}
              </span>
            )}
            {isProjected && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  letterSpacing: '1px',
                  color: 'rgba(251,191,36,0.7)',
                }}
              >
                ~ UN PROJECTED DATA
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}