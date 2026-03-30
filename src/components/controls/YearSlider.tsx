interface Props {
  year: number;
  minYear: number;
  maxYear: number;
  onYearChange: (year: number) => void;
}

function computeTicks(minYear: number, maxYear: number): number[] {
  const range = maxYear - minYear;
  const interval = range <= 40 ? 5 : range <= 80 ? 10 : range <= 150 ? 25 : 50;
  const ticks: number[] = [];
  const start = Math.ceil(minYear / interval) * interval;
  if (start !== minYear) ticks.push(minYear);
  for (let y = start; y <= maxYear; y += interval) ticks.push(y);
  if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);
  return ticks;
}

export function YearSlider({ year, minYear, maxYear, onYearChange }: Props) {
  const range = maxYear - minYear;
  const progress = range > 0 ? ((year - minYear) / range) * 100 : 0;
  const ticks = computeTicks(minYear, maxYear);

  return (
    <div className="flex-1">
      <div className="relative h-[4px] mb-2">
        <div className="absolute inset-0 bg-white/[0.08] rounded-sm" />
        <div
          className="absolute left-0 top-0 bottom-0 rounded-sm pointer-events-none transition-[width] duration-150"
          style={{ width: `${progress}%`, background: 'linear-gradient(to right, #15803d, #22c55e)' }}
        />
        <input
          type="range"
          className="slider-input absolute inset-0 w-full h-[4px]"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
        />
      </div>

      <div className="flex justify-between font-mono text-[9px] tracking-[1px] text-slate-100/55">
        {ticks.map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}
