
import { getColorPalette } from '../colorUtils';

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

export const generateScatterConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  getAxisLabelConfig: any, 
  colors: string[], 
  formatTooltipValue: any
) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis) return {};
  
  // If color variable is specified, group data by color variable
  if (variableRoles.color) {
    const groupedData = data.reduce((acc, item) => {
      const colorValue = item[variableRoles.color!];
      if (!acc[colorValue]) {
        acc[colorValue] = [];
      }
      acc[colorValue].push([item[variableRoles.xAxis!], item[variableRoles.yAxis!]]);
      return acc;
    }, {} as Record<string, any[]>);

    const series = Object.keys(groupedData).map((group, index) => ({
      name: group,
      type: 'scatter',
      data: groupedData[group],
      itemStyle: {
        color: colors[index % colors.length]
      }
    }));

    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${variableRoles.xAxis}: ${formatTooltipValue(params.data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params.data[1])}<br/>${variableRoles.color}: ${params.seriesName}`;
        }
      },
      legend: {
        data: Object.keys(groupedData),
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
    // No color variable, use single series
    const scatterData = data.map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]);
    
    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${variableRoles.xAxis}: ${formatTooltipValue(params.data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params.data[1])}`;
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
        type: 'scatter',
        data: scatterData,
        itemStyle: {
          color: colors[0]
        }
      }]
    };
  }
};
