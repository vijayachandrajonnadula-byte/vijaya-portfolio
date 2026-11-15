// Pulse "Charts & Cards" page: shared chart palette + a theme object for recharts consumers.
// Values come from pt.uiElements.chart (axisLine, axisText) and the uiElements/chart/color/* variables in the Figma export.
import { fw } from '../../../theme/typography';
import { pt } from '../../../theme/pulseTokens';

/** uiElements/chart/color/* series colours (Brand, Blue, Green, Yellow, Orange, Red, Purple, Cyan, Teal). */
export const chartColors = {
  brand: '#1e3a6e',
  blue: '#3b82f6',
  green: '#22c55e',
  yellow: '#eab308',
  orange: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
  teal: '#14b8a6',
} as const;
export type ChartColorName = keyof typeof chartColors;

/** Default series order used by the Figma examples (Brand, Blue, Green, Yellow, then the rest). */
export const chartSeries: string[] = [
  chartColors.brand, chartColors.blue, chartColors.green, chartColors.yellow,
  chartColors.orange, chartColors.red, chartColors.purple, chartColors.cyan, chartColors.teal,
];

export const chartAxisLine = pt.uiElements.chart.color.axisLine;
export const chartAxisText = pt.uiElements.chart.color.axisText;
export const seriesColor = (i: number, explicit?: string) => explicit ?? chartSeries[i % chartSeries.length] ?? chartColors.brand;

const font = pt.typographyStyles.textS.medium;

/**
 * Styling for recharts (the Pulse app uses it): spread into the matching props, e.g.
 * `<XAxis {...pulseChartTheme.axis} />`, `<CartesianGrid {...pulseChartTheme.grid} />`, `<Bar fill={pulseChartTheme.series[0]} />`,
 * `<Tooltip {...pulseChartTheme.tooltip} />`, `<Legend {...pulseChartTheme.legend} />`.
 */
export const pulseChartTheme = {
  series: chartSeries,
  colors: chartColors,
  axis: {
    stroke: chartAxisLine,
    tickLine: { stroke: chartAxisLine },
    axisLine: { stroke: chartAxisLine },
    tick: { fill: chartAxisText, fontSize: 10, fontFamily: font.fontFamily, fontWeight: font.fontWeight },
  },
  grid: { stroke: chartAxisLine },
  legend: {
    iconType: 'circle' as const,
    iconSize: 12,
    wrapperStyle: { fontFamily: font.fontFamily, fontSize: 10, lineHeight: '18px', color: pt.formElements.content.metaDataTextColor },
  },
  tooltip: {
    contentStyle: { background: '#ffffff', border: `1px solid ${chartAxisLine}`, borderRadius: 6, fontFamily: font.fontFamily, fontSize: 10 },
    labelStyle: { color: chartAxisText, fontWeight: fw.medium },
    cursor: { fill: 'rgba(30,58,110,0.06)' },
  },
  /** Bar thickness per Figma Charts Bar size (S 8, M 12, L 16, XL 24). */
  barSize: { s: 8, m: 12, l: 16, xl: 24 },
  /** Interactive node (active dot): 8px circle with a 1px white outside stroke. */
  activeDot: { r: 4, stroke: '#ffffff', strokeWidth: 1 },
} as const;
