
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
  
  const calculateBoxplotStats = (values: number[]) => {
    const sorted = values.filter(v => v != null).sort((a, b) => a - b);
    if (sorted.length === 0) return null;
    
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    return [min, q1, median, q3, max];
  };

  // If groupBy variable is specified, create separate box plots for each group
  if (variableRoles.groupBy) {
    const groupedData = data.reduce((acc, item) => {
      const groupValue = item[variableRoles.groupBy!];
      const dataValue = item[variableRoles.xAxis!];
      
      if (!acc[groupValue]) {
        acc[groupValue] = [];
      }
      if (dataValue != null) {
        acc[groupValue].push(dataValue);
      }
      return acc;
    }, {} as Record<string, number[]>);

    const categories = Object.keys(groupedData);
    const boxplotData = categories.map(category => {
      const values = groupedData[category];
      return calculateBoxplotStats(values);
    }).filter(stats => stats !== null);

    return {
      title: titleConfig,
      tooltip: { 
        trigger: 'item',
        formatter: (params: any) => {
          const [min, q1Val, medianVal, q3Val, max] = params.data;
          const category = categories[params.dataIndex];
          return `${variableRoles.groupBy}: ${category}<br/>Min: ${formatTooltipValue(min)}<br/>Q1: ${formatTooltipValue(q1Val)}<br/>Median: ${formatTooltipValue(medianVal)}<br/>Q3: ${formatTooltipValue(q3Val)}<br/>Max: ${formatTooltipValue(max)}`;
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
        type: 'boxplot',
        data: boxplotData,
        itemStyle: { 
          color: colors[0],
          borderColor: colors[0]
        }
      }]
    };
  } else {
    // Single box plot for the selected variable
    const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
    const boxplotStats = calculateBoxplotStats(boxplotValues);
    
    if (!boxplotStats) return {};

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
        data: [boxplotStats],
        itemStyle: { 
          color: colors[0],
          borderColor: colors[0]
        }
      }]
    };
  }
};
