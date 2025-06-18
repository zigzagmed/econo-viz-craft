
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

export const generateBarConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  getAxisLabelConfig: any, 
  colors: string[], 
  formatTooltipValue: any
) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis || !variableRoles.statistic) return {};
  
  // Group data by X variable and calculate the selected statistic for Y
  const groupedData = data.reduce((acc, item) => {
    const xValue = item[variableRoles.xAxis!];
    const yValue = item[variableRoles.yAxis!];
    
    if (!acc[xValue]) {
      acc[xValue] = [];
    }
    if (yValue !== null && yValue !== undefined) {
      acc[xValue].push(yValue);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const categories = Object.keys(groupedData);
  const barValues = categories.map(category => {
    const values = groupedData[category];
    if (values.length === 0) return 0;
    
    switch (variableRoles.statistic) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'average':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'count':
        return values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return values.length; // Default to count
    }
  });

  return {
    title: titleConfig,
    tooltip: { 
      trigger: 'axis',
      formatter: (params: any) => {
        const category = params[0].name;
        const value = params[0].value;
        const statLabel = variableRoles.statistic?.charAt(0).toUpperCase() + variableRoles.statistic?.slice(1);
        return `${category}<br/>${statLabel} of ${variableRoles.yAxis}: ${formatTooltipValue(value)}`;
      }
    },
    xAxis: {
      type: 'category',
      data: categories,
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'bar',
      data: barValues,
      itemStyle: { color: colors[0] }
    }]
  };
};
