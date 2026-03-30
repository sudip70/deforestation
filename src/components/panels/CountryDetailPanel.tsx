import { useMemo } from 'react';
import { FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { PanelShell } from '../ui/PanelShell';
import { PanelLabel } from '../ui/PanelLabel';
import { SectionDivider } from '../ui/SectionDivider';
import { HistoryChart } from '../charts/HistoryChart';
import { LAYER_MAP, POPULATION_PROJECTION_START } from '../../config/layers';
import type { ProcessedData, SelectedCountry, LayerId } from '../../types';

interface Props {
  selected: SelectedCountry;
  data: ProcessedData;
  activeLayer: LayerId;
  year: number;
  onClose: () => void;
}

export function CountryDetailPanel({ selected, data, activeLayer, year, onClose }: Props) {
  const config = LAYER_MAP.get(activeLayer)!;

  const { currentValue, baselineYear, baselineValue, chartData } = useMemo(() => {
    const layerData = data.layers.get(activeLayer);
    const yearMap = layerData?.byCode.get(selected.code);

    if (!yearMap) return { currentValue: null, baselineYear: null, baselineValue: null, chartData: [] };

    const cv = yearMap.get(year) ?? null;

    const sortedYears = Array.from(yearMap.keys()).sort((a, b) => a - b);
    const by = sortedYears[0] ?? null;
    const bv = by != null ? (yearMap.get(by) ?? null) : null;

    const cd = sortedYears.map((y) => ({ year: y, value: yearMap.get(y)! }));

    return { currentValue: cv, baselineYear: by, baselineValue: bv, chartData: cd };
  }, [data, activeLayer, selected.code, year]);

  const changePct = useMemo(() => {
    if (currentValue == null || baselineValue == null || baselineValue === 0) return null;
    return ((currentValue - baselineValue) / Math.abs(baselineValue)) * 100;
  }, [currentValue, baselineValue]);

  const isProjected = activeLayer === 'population' && year >= POPULATION_PROJECTION_START;

  const changeColor =
    changePct == null ? 'rgba(226,232,240,0.55)'
    : activeLayer === 'forest' || activeLayer === 'hdi'
      ? changePct >= 0 ? '#4ade80' : '#f87171'
      : changePct <= 0 ? '#4ade80' : '#f87171';

  const changeStr =
    changePct == null ? '—'
    : changePct >= 0 ? `+${changePct.toFixed(1)}%`
    : `${changePct.toFixed(1)}%`;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 280 }}
    >
      <PanelShell
        className="w-[min(180px,calc(100vw-24px))] md:w-[220px] max-h-[calc(100vh-220px)] md:max-h-[calc(100vh-160px)] overflow-y-auto relative"
        style={{ background: 'rgba(6,12,20,0.92)' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-white/[0.05] border border-white/10 rounded-md text-slate-100/55 cursor-pointer transition-colors hover:bg-white/[0.1]"
        >
          <FiX size={12} />
        </button>

        {/* Country name */}
        <div
          className="font-display text-[15px] md:text-[17px] font-bold leading-tight mb-[2px] pr-7"
          style={{ color: config.chartColor }}
        >
          {selected.entity}
        </div>

        {/* Code + region */}
        <div className="font-mono text-[9px] tracking-[2px] text-slate-100/40 mb-1">
          {selected.code}
          {selected.region && (
            <span className="ml-[6px] tracking-[1px]">· {selected.region}</span>
          )}
        </div>

        {/* Layer badge */}
        <div className="inline-flex items-center gap-1 mb-3 md:mb-[14px] bg-white/[0.05] border border-white/[0.08] rounded-[10px] px-2 py-[2px]">
          <config.Icon size={10} />
          <span className="font-mono text-[8px] tracking-[1px] text-slate-100/55">
            {config.label.toUpperCase()}
          </span>
        </div>

        <div className="mb-3 md:mb-[14px]">
          <SectionDivider />
        </div>

        {/* Current value */}
        <div className="mb-[10px]">
          <div className="mb-1">
            <PanelLabel>
              {config.label} {year}{isProjected ? ' *' : ''}
            </PanelLabel>
          </div>
          <div className="font-display text-[20px] md:text-[22px] font-bold text-slate-100 leading-none">
            {currentValue != null ? config.formatValue(currentValue) : '—'}
          </div>
          <div className="font-mono text-[9px] text-slate-100/40 mt-[3px]">
            {isProjected ? '* UN projection' : config.unit}
          </div>
        </div>

        {/* Change */}
        <div className="mb-4">
          <div className="mb-1">
            <PanelLabel>Change Since {baselineYear ?? '—'}</PanelLabel>
          </div>
          <div
            className="font-display text-[20px] md:text-[22px] font-bold leading-none"
            style={{ color: changeColor }}
          >
            {changeStr}
          </div>
        </div>

        <div className="mb-3">
          <SectionDivider />
        </div>

        {/* Chart */}
        {chartData.length > 1 && (
          <>
            <div className="mb-2">
              <PanelLabel>Historical Trend</PanelLabel>
            </div>
            <HistoryChart
              data={chartData}
              currentYear={year}
              lineColor={config.chartColor}
              formatValue={config.formatValue}
              projectionStartYear={config.projectionStartYear}
            />
          </>
        )}
      </PanelShell>
    </motion.div>
  );
}
