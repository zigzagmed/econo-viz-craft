
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
  
  console.log('Correlation matrix data structure:', data[0]);
  console.log('Variables for correlation:', variables);
  
  // Create correlation matrix data
  const correlationMatrix = [];
  for (let i = 0; i < variables.length; i++) {
    for (let j = 0; j < variables.length; j++) {
      if (i === j) {
        correlationMatrix.push([j, i, 1.0]);
      } else {
        // Extract values for both variables from the data structure
        // The data comes as a flattened structure, so we need to extract individual variables
        const values1: number[] = [];
        const values2: number[] = [];
        
        // Check if data has individual variable properties or flattened structure
        data.forEach(row => {
          let val1, val2;
          
          // Try direct property access first
          if (row[variables[i]] !== undefined) {
            val1 = row[variables[i]];
          }
          
          if (row[variables[j]] !== undefined) {
            val2 = row[variables[j]];
          }
          
          // Convert to numbers and validate
          const num1 = Number(val1);
          const num2 = Number(val2);
          
          if (!isNaN(num1) && !isNaN(num2) && isFinite(num1) && isFinite(num2)) {
            values1.push(num1);
            values2.push(num2);
          }
        });
        
        console.log(`Values for ${variables[i]}:`, values1.slice(0, 5), `(${values1.length} total)`);
        console.log(`Values for ${variables[j]}:`, values2.slice(0, 5), `(${values2.length} total)`);
        
        if (values1.length < 2 || values2.length < 2) {
          console.log(`Insufficient data for ${variables[i]} vs ${variables[j]}`);
          correlationMatrix.push([j, i, 0.0]);
        } else {
          const correlation = calculateCorrelation(values1, values2);
          console.log(`Calculated correlation for ${variables[i]} vs ${variables[j]}:`, correlation);
          
          correlationMatrix.push([j, i, correlation]);
        }
      }
    }
  }

  console.log('Final correlation matrix:', correlationMatrix);

  return {
    title: titleConfig,
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const corr = params.data[2];
        const formattedCorr = (typeof corr === 'number' && isFinite(corr)) ? corr.toFixed(3) : '0.000';
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
          if (typeof corr !== 'number' || !isFinite(corr)) return '0.00';
          return corr.toFixed(2);
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
