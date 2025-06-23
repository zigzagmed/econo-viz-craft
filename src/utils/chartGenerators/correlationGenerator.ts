
import { calculateCorrelation } from '../correlationUtils';

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

export const generateCorrelationConfig = (
  data: any[], 
  variableRoles: VariableRoles, 
  chartConfig: any, 
  titleConfig: any, 
  formatTooltipValue: any
) => {
  if (!variableRoles.variables || variableRoles.variables.length < 2) return {};
  
  const variables = variableRoles.variables;
  const correlationMatrix = variables.map((var1, i) => 
    variables.map((var2, j) => {
      if (i === j) return [j, i, 1];
      const values1 = data.map(d => d[var1]).filter(v => v != null && !isNaN(v));
      const values2 = data.map(d => d[var2]).filter(v => v != null && !isNaN(v));
      
      const correlation = calculateCorrelation(values1, values2);
      return [j, i, correlation];
    })
  ).flat();

  return {
    title: titleConfig,
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${variables[params.data[0]]} vs ${variables[params.data[1]]}<br/>Correlation: ${formatTooltipValue(params.data[2])}`;
      }
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: variables,
      splitArea: { 
        show: true,
        areaStyle: {
          color: ['#f5f5f5', '#fff']
        }
      },
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'category',
      data: variables,
      splitArea: { 
        show: true,
        areaStyle: {
          color: ['#f5f5f5', '#fff']
        }
      }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      text: ['High', 'Low'],
      dimension: 2,
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    series: [{
      type: 'heatmap',
      data: correlationMatrix,
      label: {
        show: true,
        fontSize: 12,
        formatter: (params: any) => formatTooltipValue(params.data[2])
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: '#fff'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
};
