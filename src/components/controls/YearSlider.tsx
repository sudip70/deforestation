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
    <div style={{ flex: 1 }}>
      <div style={{ position: 'relative', height: '4px', marginBottom: '8px' }}>
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,255,255,0.08)', borderRadius: '2px',
          }}
        />
        <div
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0,
            width: `${progress}%`,
            background: 'linear-gradient(to right, #15803d, #22c55e)',
            borderRadius: '2px', pointerEvents: 'none', transition: 'width 0.15s',
          }}
        />
        <input
          type="range"
          className="slider-input"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '4px' }}
        />
      </div>

      <div
        style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: '9px',
          letterSpacing: '1px', color: 'rgba(226,232,240,0.55)',
        }}
      >
        {ticks.map((t) => <span key={t}>{t}</span>)}
      </div>
    </div>
  );
}