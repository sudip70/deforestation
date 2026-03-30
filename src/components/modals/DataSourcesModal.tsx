import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiExternalLink } from 'react-icons/fi';
import { useState } from 'react';
import { LAYER_CONFIGS } from '../../config/layers';
import type { LayerId } from '../../types';

interface DataSource {
  id: LayerId;
  metric: string;
  description: string;
  source: string;
  organization: string;
  coverage: string;
  unit: string;
  url: string;
  notes?: string;
}

const DATA_SOURCES: DataSource[] = [
  {
    id: 'population',
    metric: 'Total Population',
    description:
      'Total resident population of each country, combining historical census-based estimates with UN medium-variant projections for future years.',
    source: 'World Bank / UN World Population Prospects 2024',
    organization: 'United Nations Population Division & World Bank',
    coverage: '1960 – 2100',
    unit: 'Number of people',
    url: 'https://ourworldindata.org/grapher/population-with-un-projections?tab=map',
    notes: 'Values from 2024 onward are UN medium-variant projections. Historical figures are derived from national censuses and civil registration systems.',
  },
  {
    id: 'forest',
    metric: 'Share of Global Forest Area',
    description:
      'Each country\'s forested land as a percentage of total world forest area. Colors show change relative to the country\'s own 1990 baseline, making gains and losses visually comparable across nations of different sizes.',
    source: 'FAO Global Forest Resources Assessment 2020 / Our World in Data',
    organization: 'Food and Agriculture Organization of the United Nations (FAO)',
    coverage: '1990 – 2025',
    unit: '% of total world forests',
    url: 'https://ourworldindata.org/grapher/forest-area-as-share-of-land-area',
    notes: 'Forest is defined as land spanning more than 0.5 ha with trees higher than 5 m and a canopy cover of more than 10%. Assessments are conducted every five years; intervening years are interpolated.',
  },
  {
    id: 'co2',
    metric: 'CO₂ Emissions Per Capita',
    description:
      'Annual production-based carbon dioxide emissions divided by total population. Includes emissions from burning fossil fuels (coal, oil, gas) and cement production, but excludes land-use change.',
    source: 'Global Carbon Project / Our World in Data',
    organization: 'Global Carbon Project & Hannah Ritchie, Max Roser',
    coverage: '1750 – 2022',
    unit: 'Tonnes of CO₂ per person per year',
    url: 'https://ourworldindata.org/co2-emissions',
    notes: 'Production-based emissions attribute CO₂ to the country where goods are manufactured, not consumed. Consumption-based estimates (which adjust for trade) differ and are available separately from the same source.',
  },
  {
    id: 'energy',
    metric: 'Per Capita Energy Consumption',
    description:
      'Primary energy use per person, covering all energy sources including fossil fuels, nuclear, hydropower, and modern renewables. Primary energy is measured before conversion losses.',
    source: 'Energy Institute Statistical Review of World Energy / Our World in Data',
    organization: 'Energy Institute (formerly BP Statistical Review)',
    coverage: '1965 – 2023',
    unit: 'Kilowatt-hours (kWh) per person per year',
    url: 'https://ourworldindata.org/grapher/per-capita-energy-use',
    notes: 'Primary energy figures include conversion and distribution losses. A country with high electricity consumption from hydro will appear lower than one burning equivalent fossil fuels, due to how primary equivalence is calculated.',
  },
  {
    id: 'hdi',
    metric: 'Human Development Index',
    description:
      'A composite index combining three dimensions of human development: a long and healthy life (life expectancy), knowledge (education years), and a decent standard of living (GNI per capita). Ranges from 0 to 1.',
    source: 'UNDP Human Development Report / Our World in Data',
    organization: 'United Nations Development Programme (UNDP)',
    coverage: '1990 – 2022',
    unit: 'Index value (0 = lowest, 1 = highest)',
    url: 'https://ourworldindata.org/grapher/human-development-index',
    notes: 'HDI thresholds: Very High ≥ 0.800, High 0.700–0.799, Medium 0.550–0.699, Low < 0.550. Methodology has been revised multiple times; long-run comparisons should be interpreted with care.',
  },
];

interface Props {
  onClose: () => void;
}

export function DataSourcesModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<LayerId>('population');
  const source = DATA_SOURCES.find((s) => s.id === activeTab)!;
  const config = LAYER_CONFIGS.find((c) => c.id === activeTab)!;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 16 }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        className="relative z-10 w-full max-w-[560px] max-h-[82vh] flex flex-col rounded-2xl border border-white/[0.1] overflow-hidden"
        style={{
          background: 'rgba(6,12,20,0.97)',
          backdropFilter: 'blur(24px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.07] flex-shrink-0">
          <div>
            <div className="font-mono text-[9px] tracking-[3px] text-slate-100/40 uppercase mb-1">
              About the Data
            </div>
            <div className="font-display text-[17px] font-bold text-slate-100">
              Data Sources & Methodology
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-slate-100/50 hover:bg-white/[0.07] hover:text-slate-100/80 transition-colors cursor-pointer"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* Layer tabs */}
        <div className="flex gap-1 px-4 pt-3 pb-0 flex-shrink-0 overflow-x-auto">
          {DATA_SOURCES.map((ds) => {
            const cfg = LAYER_CONFIGS.find((c) => c.id === ds.id)!;
            const active = ds.id === activeTab;
            return (
              <button
                key={ds.id}
                onClick={() => setActiveTab(ds.id)}
                className={`flex items-center gap-[6px] px-3 py-[6px] rounded-t-lg cursor-pointer font-mono text-[10px] tracking-[0.5px] whitespace-nowrap transition-all duration-150 border-t border-l border-r ${
                  active
                    ? 'border-white/[0.1] bg-white/[0.06] text-slate-100'
                    : 'border-transparent bg-transparent text-slate-100/40 hover:text-slate-100/65'
                }`}
              >
                <cfg.Icon size={11} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Divider under tabs */}
        <div className="h-px bg-white/[0.07] flex-shrink-0" />

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {/* Metric title */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div
                    className="font-display text-[18px] font-bold mb-1"
                    style={{ color: config.chartColor }}
                  >
                    {source.metric}
                  </div>
                  <div className="font-mono text-[10px] tracking-[1px] text-slate-100/45">
                    {source.unit}
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-[5px] flex-shrink-0 mt-1 font-mono text-[9px] tracking-[1.5px] text-slate-100/40 hover:text-slate-100/70 transition-colors border border-white/[0.08] rounded-lg px-[10px] py-[6px] hover:bg-white/[0.05]"
                >
                  <FiExternalLink size={10} />
                  <span>SOURCE</span>
                </a>
              </div>

              {/* Description */}
              <p className="font-display text-[13px] text-slate-100/80 leading-relaxed mb-5">
                {source.description}
              </p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Organization', value: source.organization },
                  { label: 'Dataset', value: source.source },
                  { label: 'Time Coverage', value: source.coverage },
                  { label: 'Unit', value: source.unit },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3"
                  >
                    <div className="font-mono text-[8px] tracking-[2px] text-slate-100/35 uppercase mb-[5px]">
                      {label}
                    </div>
                    <div className="font-display text-[11px] font-medium text-slate-100/80 leading-snug">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {source.notes && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                  <div className="font-mono text-[8px] tracking-[2px] text-slate-100/35 uppercase mb-2">
                    Methodology Note
                  </div>
                  <p className="font-display text-[12px] text-slate-100/55 leading-relaxed">
                    {source.notes}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-3 border-t border-white/[0.07] flex items-center gap-2">
          <div
            className="w-[6px] h-[6px] rounded-full flex-shrink-0"
            style={{ background: config.chartColor, boxShadow: `0 0 6px ${config.chartColor}` }}
          />
          <span className="font-mono text-[9px] tracking-[1.5px] text-slate-100/35">
            All datasets are sourced via{' '}
            <a
              href="https://ourworldindata.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-100/55 hover:text-slate-100/80 underline underline-offset-2 transition-colors"
            >
              Our World in Data
            </a>{' '}
            under CC BY 4.0 license.
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}