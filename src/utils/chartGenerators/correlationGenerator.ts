
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
  
  // Create correlation matrix data
  const correlationMatrix = [];
  for (let i = 0; i < variables.length; i++) {
    for (let j = 0; j < variables.length; j++) {
      if (i === j) {
        correlationMatrix.push([j, i, 1]);
      } else {
        // Get values for both variables, ensuring we have the same data points
        const pairedData = data
          .map(d => ({ x: d[variables[i]], y: d[variables[j]] }))
          .filter(pair => 
            pair.x != null && 
            pair.y != null && 
            !isNaN(Number(pair.x)) && 
            !isNaN(Number(pair.y))
          );
        
        if (pairedData.length < 2) {
          correlationMatrix.push([j, i, 0]);
        } else {
          const values1 = pairedData.map(pair => Number(pair.x));
          const values2 = pairedData.map(pair => Number(pair.y));
          
          const correlation = calculateCorrelation(values1, values2);
          correlationMatrix.push([j, i, correlation]);
        }
      }
    }
  }

  return {
    title: titleConfig,
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const corr = params.data[2];
        const formattedCorr = isNaN(corr) ? '0.00' : corr.toFixed(3);
        return `${variables[params.data[0]]} vs ${variables[params.data[1]]}<br/>Correlation: ${formattedCorr}`;
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
        formatter: (params: any) => {
          const corr = params.data[2];
          return isNaN(corr) ? '0.00' : corr.toFixed(2);
        }
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
