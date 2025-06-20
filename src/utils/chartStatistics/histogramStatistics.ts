
interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  series?: string;
  groupBy?: string;
  bins?: string;
  variables?: string[];
  statistic?: string;
}

export const generateHistogramStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis) return stats;

  const histValues = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
  const histMin = Math.min(...histValues);
  const histMax = Math.max(...histValues);
  const binCount = chartConfig.histogramBins || 10;
  const binWidth = (histMax - histMin) / binCount;
  
  const bins = Array.from({ length: binCount }, (_, i) => ({
    start: histMin + i * binWidth,
    end: histMin + (i + 1) * binWidth,
    count: 0
  }));
  
  histValues.forEach(value => {
    const binIndex = Math.min(Math.floor((value - histMin) / binWidth), binCount - 1);
    bins[binIndex].count++;
  });

  bins.forEach((bin, index) => {
    const rangeLabel = `${bin.start.toFixed(2)} - ${bin.end.toFixed(2)}`;
    stats[`Bin ${index + 1} (${rangeLabel})`] = { value: bin.count };
  });
  
  stats['Total Count'] = { value: histValues.length };
  stats['Bin Width'] = { value: binWidth };

  return stats;
};
