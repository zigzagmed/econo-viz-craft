
import { getColorPalette } from '../colorUtils';
import { calculateRegression } from '../statisticalUtils';

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
  
  const showTrendLine = chartConfig.showTrendLine || false;
  
  // Helper function to generate trend line data
  const generateTrendLine = (xValues: number[], yValues: number[], color: string) => {
    const { slope, intercept } = calculateRegression(xValues, yValues);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    
    return {
      name: 'Trend Line',
      type: 'line',
      data: [
        [minX, slope * minX + intercept],
        [maxX, slope * maxX + intercept]
      ],
      itemStyle: {
        color: color
      },
      lineStyle: {
        type: 'dashed',
        width: 2
      },
      symbol: 'none',
      silent: true
    };
  };
  
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

    // Add trend lines when enabled and color grouping is used
    if (showTrendLine) {
      Object.keys(groupedData).forEach((group, index) => {
        const groupData = groupedData[group];
        const xValues = groupData.map(point => point[0]);
        const yValues = groupData.map(point => point[1]);
        
        if (xValues.length > 1) {
          const trendLine = generateTrendLine(xValues, yValues, colors[index % colors.length]);
          trendLine.name = `${group} Trend`;
          series.push(trendLine);
        }
      });
    }

    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesName.includes('Trend')) {
            return `${params.seriesName}<br/>${variableRoles.xAxis}: ${formatTooltipValue(params.data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params.data[1])}`;
          }
          return `${variableRoles.xAxis}: ${formatTooltipValue(params.data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params.data[1])}<br/>${variableRoles.color}: ${params.seriesName}`;
        }
      },
      legend: {
        data: series.map(s => s.name),
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
    const series = [{
      name: 'Data Points',
      type: 'scatter',
      data: scatterData,
      itemStyle: {
        color: colors[0]
      }
    }];

    // Add trend line when enabled
    if (showTrendLine && scatterData.length > 1) {
      const xValues = scatterData.map(point => point[0]);
      const yValues = scatterData.map(point => point[1]);
      const trendLine = generateTrendLine(xValues, yValues, colors[0]);
      series.push(trendLine);
    }
    
    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.seriesName === 'Trend Line') {
            return `Trend Line<br/>${variableRoles.xAxis}: ${formatTooltipValue(params.data[0])}<br/>${variableRoles.yAxis}: ${formatTooltipValue(params.data[1])}`;
          }
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
      series,
      legend: showTrendLine && scatterData.length > 1 ? {
        data: ['Data Points', 'Trend Line'],
        left: 'left',
        bottom: 10,
        orient: 'horizontal'
      } : undefined
    };
  }
};
