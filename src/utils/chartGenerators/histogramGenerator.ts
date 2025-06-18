
interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  groupBy?: string;
  bins?: string;
  variables?: string[];
  statistic?: string;
}

export const generateHistogramConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  getAxisLabelConfig: any, 
  colors: string[], 
  formatTooltipValue: any
) => {
  if (!variableRoles.xAxis) return {};
  
  const histValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
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

  const histogramData = bins.map(bin => [bin.start + binWidth / 2, bin.count]);

  return {
    title: titleConfig,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0];
        const rangeStart = formatTooltipValue(value.data[0] - binWidth/2);
        const rangeEnd = formatTooltipValue(value.data[0] + binWidth/2);
        return `Range: ${rangeStart} - ${rangeEnd}<br/>Count: ${value.data[1]}`;
      }
    },
    xAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'bar',
      data: histogramData,
      itemStyle: { color: colors[0] },
      barWidth: '90%'
    }]
  };
};
