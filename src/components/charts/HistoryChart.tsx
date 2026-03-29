import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ReferenceLine, ResponsiveContainer, ReferenceArea,
} from 'recharts';

interface Props {
  data: { year: number; value: number }[];
  currentYear: number;
  height?: number;
  lineColor?: string;
  formatValue?: (v: number) => string;
  projectionStartYear?: number;
}

export function HistoryChart({
  data,
  currentYear,
  height = 150,
  lineColor = '#22c55e',
  formatValue = (v) => v.toFixed(4),
  projectionStartYear,
}: Props) {
  if (data.length < 2) return null;

  const maxYear = data[data.length - 1].year;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
        <XAxis
          dataKey="year"
          tick={{ fill: 'rgba(226,232,240,0.55)', fontSize: 8, fontFamily: 'var(--font-mono)' }}
          tickLine={false} axisLine={false} interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: 'rgba(226,232,240,0.55)', fontSize: 8, fontFamily: 'var(--font-mono)' }}
          tickLine={false} axisLine={false} tickFormatter={formatValue}
        />
        {projectionStartYear && projectionStartYear <= maxYear && (
          <ReferenceArea
            x1={projectionStartYear} x2={maxYear}
            fill="rgba(251,191,36,0.05)"
            stroke="rgba(251,191,36,0.15)" strokeWidth={1}
          />
        )}
        <ReferenceLine x={currentYear} stroke="rgba(34,197,94,0.35)" strokeDasharray="3 3" />
        {projectionStartYear && (
          <ReferenceLine x={projectionStartYear} stroke="rgba(251,191,36,0.4)" strokeDasharray="2 2" />
        )}
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(6,12,20,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#e2e8f0',
          }}
          itemStyle={{ color: lineColor }}
          labelStyle={{ color: 'rgba(226,232,240,0.55)' }}
          formatter={(v: number) => [formatValue(v), 'Value']}
        />
        <Line
          type="monotone" dataKey="value" stroke={lineColor}
          strokeWidth={1.5} dot={false} activeDot={{ r: 3, fill: lineColor }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}