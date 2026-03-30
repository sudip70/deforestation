import { PlayButton } from './PlayButton';
import { YearSlider } from './YearSlider';
import { LayerSwitcher } from './LayerSwitcher';
import type { LayerId } from '../../types';

const SPEED_OPTIONS = [0.5, 1, 2, 4] as const;

interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  playing: boolean;
  playSpeed: number;
  onYearChange: (year: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  activeLayer: LayerId;
  onLayerChange: (layer: LayerId) => void;
}

export function Controls({
  year,
  minYear,
  maxYear,
  playing,
  playSpeed,
  onYearChange,
  onPlayToggle,
  onSpeedChange,
  activeLayer,
  onLayerChange,
}: Props) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-20 pt-8 md:pt-10 pb-5 md:pb-6 px-4 md:px-6"
      style={{ background: 'linear-gradient(to top, rgba(2,5,8,0.95) 0%, transparent 100%)' }}
    >
      <div className="max-w-[760px] mx-auto">

        {/* Mobile: horizontal layer switcher */}
        <div className="md:hidden mb-3">
          <LayerSwitcher activeLayer={activeLayer} onChange={onLayerChange} horizontal />
        </div>

        {/* Speed selector */}
        <div className="flex justify-center mb-2 md:mb-[10px]">
          <div className="flex items-center gap-[6px]">
            <span className="font-mono text-[9px] tracking-[2px] text-white/30 mr-[2px]">
              SPEED
            </span>
            {SPEED_OPTIONS.map((s) => {
              const active = playSpeed === s;
              return (
                <button
                  key={s}
                  onClick={() => onSpeedChange(s)}
                  className={`py-[3px] px-2 rounded-md cursor-pointer font-mono text-[10px] tracking-[1px] transition-all duration-150 border ${
                    active
                      ? 'bg-green-500/[0.15] border-green-500/50 text-green-500'
                      : 'bg-transparent border-white/10 text-white/35 hover:border-white/20 hover:text-white/55'
                  }`}
                >
                  {s === 0.5 ? '½×' : `${s}×`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Play + slider */}
        <div className="flex items-center gap-3 md:gap-[18px]">
          <PlayButton playing={playing} onClick={onPlayToggle} />
          <YearSlider
            year={year}
            minYear={minYear}
            maxYear={maxYear}
            onYearChange={onYearChange}
          />
        </div>

      </div>
    </div>
  );
}
