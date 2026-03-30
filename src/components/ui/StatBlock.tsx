interface Props {
  value: string;
  unit: string;
  label: string;
  color: string;
  barWidth?: number;
  barColor?: string;
}

export function StatBlock({ value, unit, label, color, barWidth, barColor }: Props) {
  return (
    <div>
      <div className="flex items-baseline gap-[3px] mb-[3px]">
        <div
          className="font-display text-[26px] md:text-[30px] font-bold leading-none"
          style={{ color }}
        >
          {value}
        </div>
        <div className="font-mono text-[10px] text-slate-100/55 mb-[1px]">
          {unit}
        </div>
      </div>

      <div
        className={`font-mono text-[9px] tracking-[1px] text-slate-100/55 ${barWidth !== undefined ? 'mb-[7px]' : ''}`}
      >
        {label}
      </div>

      {barWidth !== undefined && (
        <div className="h-[3px] bg-white/[0.06] rounded-sm overflow-hidden">
          <div
            className="h-full rounded-sm transition-[width] duration-[600ms] ease-in-out"
            style={{ background: barColor ?? color, width: `${barWidth}%` }}
          />
        </div>
      )}
    </div>
  );
}
