
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

export const generateLineConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  getAxisLabelConfig: any, 
  colors: string[], 
  formatTooltipValue: any
) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis) return {};
  
  if (variableRoles.groupBy) {
    // Group data by the groupBy variable
    const grouped = data.reduce((acc, item) => {
      const groupValue = item[variableRoles.groupBy!];
      if (!acc[groupValue]) acc[groupValue] = [];
      acc[groupValue].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    const series = Object.keys(grouped).map((group, index) => ({
      name: group,
      type: 'line',
      data: grouped[group].map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]),
      itemStyle: { color: colors[index % colors.length] },
      lineStyle: { color: colors[index % colors.length] }
    }));

    return {
      title: titleConfig,
      tooltip: { 
        trigger: 'axis',
        formatter: (params: any) => {
          let result = `${variableRoles.xAxis}: ${formatTooltipValue(params[0].data[0])}<br/>`;
          params.forEach((param: any) => {
            result += `${param.seriesName} (${variableRoles.yAxis}): ${formatTooltipValue(param.data[1])}<br/>`;
          });
          return result;
        }
      },
      legend: { 
        data: Object.keys(grouped),
        left: 'left',
        bottom: 10,
        orient: 'horizontal'
      },
      xAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
      },
      yAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
      },
      series
    };
  } else {
    const lineData = data.map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]);
    
    return {
      title: titleConfig,
      tooltip: { 
        trigger: 'axis',
        formatter: (params: any) => {
          return `${variableRoles.xAxis}: ${formatTooltipValue(params[0].data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params[0].data[1])}`;
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
        type: 'line',
        data: lineData,
        itemStyle: { color: colors[0] },
        lineStyle: { color: colors[0] }
      }]
    };
  }
};
