
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

export const generateBoxplotConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  getAxisLabelConfig: any, 
  colors: string[], 
  formatTooltipValue: any
) => {
  if (!variableRoles.xAxis) return {};
  
  const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
  const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
  const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
  const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
  const boxplotMin = boxplotValues[0];
  const boxplotMax = boxplotValues[boxplotValues.length - 1];

  return {
    title: titleConfig,
    tooltip: { 
      trigger: 'item',
      formatter: (params: any) => {
        const [min, q1Val, medianVal, q3Val, max] = params.data;
        return `Min: ${formatTooltipValue(min)}<br/>Q1: ${formatTooltipValue(q1Val)}<br/>Median: ${formatTooltipValue(medianVal)}<br/>Q3: ${formatTooltipValue(q3Val)}<br/>Max: ${formatTooltipValue(max)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: [variableRoles.xAxis],
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'boxplot',
      data: [[boxplotMin, q1, median, q3, boxplotMax]],
      itemStyle: { color: colors[0] }
    }]
  };
};
