/**
 * Charts.jsx
 * Recharts wrappers used on the Analytics page.
 * Each chart is a self-contained component that accepts a `data` prop.
 */
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid, Legend,
} from 'recharts';
import { PIE_COLORS } from '../utils/formatters.js';

const CHART_DEFAULTS = {
  tooltip: { contentStyle: { borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--t1)' } },
};

/** Donut chart for categorical distributions */
export function DonutChart({ data, dataKey = 'value', nameKey = 'name', height = 220 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius="45%" outerRadius="75%"
          paddingAngle={3} dataKey={dataKey} nameKey={nameKey}>
          {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
        </Pie>
        <Tooltip {...CHART_DEFAULTS.tooltip} formatter={v => [v.toLocaleString(), '']} />
        <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

/** Horizontal bar chart */
export function HBarChart({ data, xKey, yKey, height = 220, colorFn }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 70, right: 20, top: 4, bottom: 4 }}>
        <XAxis type="number" tick={{ fontSize: 10 }}
          tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
        <YAxis type="category" dataKey={yKey} tick={{ fontSize: 10 }} width={70} />
        <Tooltip {...CHART_DEFAULTS.tooltip} />
        <Bar dataKey={xKey} radius={[0,4,4,0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colorFn ? colorFn(_, i) : PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Vertical bar chart */
export function VBarChart({ data, xKey, yKey, height = 220, colorByIndex = true }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip {...CHART_DEFAULTS.tooltip} />
        <Bar dataKey={yKey} radius={[4,4,0,0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colorByIndex ? PIE_COLORS[i % PIE_COLORS.length] : '#3B82F6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
