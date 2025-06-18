
import { calculateCorrelation } from './correlationUtils';
import { calculateRegression } from './statisticalUtils';

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

export const generateChartStatistics = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!data || data.length === 0) return stats;

  // Helper function to calculate R-squared
  const calculateRSquared = (xValues: number[], yValues: number[]) => {
    const { slope, intercept } = calculateRegression(xValues, yValues);
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
    
    let totalSumSquares = 0;
    let residualSumSquares = 0;
    
    for (let i = 0; i < yValues.length; i++) {
      const predicted = slope * xValues[i] + intercept;
      totalSumSquares += Math.pow(yValues[i] - yMean, 2);
      residualSumSquares += Math.pow(yValues[i] - predicted, 2);
    }
    
    return 1 - (residualSumSquares / totalSumSquares);
  };

  switch (chartType) {
    case 'scatter':
    case 'regression':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const xValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        
        if (xValues.length > 1 && yValues.length > 1) {
          const correlation = calculateCorrelation(xValues, yValues);
          stats['Correlation (r)'] = { value: correlation };
          
          // Add regression statistics for regression plots
          if (chartType === 'regression' || chartConfig.showTrendLine) {
            const { slope, intercept } = calculateRegression(xValues, yValues);
            const rSquared = calculateRSquared(xValues, yValues);
            
            // If color variable is used, calculate stats for each group
            if (variableRoles.color) {
              const groupedData = data.reduce((acc, item) => {
                const colorValue = item[variableRoles.color!];
                if (!acc[colorValue]) {
                  acc[colorValue] = { x: [], y: [] };
                }
                if (item[variableRoles.xAxis!] != null && item[variableRoles.yAxis!] != null) {
                  acc[colorValue].x.push(item[variableRoles.xAxis!]);
                  acc[colorValue].y.push(item[variableRoles.yAxis!]);
                }
                return acc;
              }, {} as Record<string, { x: number[], y: number[] }>);

              Object.keys(groupedData).forEach(group => {
                const groupXValues = groupedData[group].x;
                const groupYValues = groupedData[group].y;
                
                if (groupXValues.length > 1) {
                  const groupRegression = calculateRegression(groupXValues, groupYValues);
                  const groupRSquared = calculateRSquared(groupXValues, groupYValues);
                  
                  stats[`${group} - Slope (β)`] = { value: groupRegression.slope };
                  stats[`${group} - R²`] = { value: groupRSquared };
                  stats[`${group} - Intercept`] = { value: groupRegression.intercept };
                }
              });
            } else {
              // Single trend line statistics
              stats['Slope (β)'] = { value: slope };
              stats['R²'] = { value: rSquared };
              stats['Intercept'] = { value: intercept };
            }
          }
        }
        
        stats['Sample Size (n)'] = { value: Math.min(xValues.length, yValues.length) };
      }
      break;

    case 'histogram':
      if (variableRoles.xAxis) {
        const values = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        if (values.length > 0) {
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
          const stdDev = Math.sqrt(variance);
          
          stats['Mean'] = { value: mean };
          stats['Standard Deviation'] = { value: stdDev };
          stats['Sample Size (n)'] = { value: values.length };
          stats['Min'] = { value: Math.min(...values) };
          stats['Max'] = { value: Math.max(...values) };
        }
      }
      break;

    case 'boxplot':
      if (variableRoles.xAxis) {
        const values = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        if (values.length > 0) {
          const sorted = [...values].sort((a, b) => a - b);
          const q1Index = Math.floor(sorted.length * 0.25);
          const q3Index = Math.floor(sorted.length * 0.75);
          const medianIndex = Math.floor(sorted.length * 0.5);
          
          stats['Median'] = { value: sorted[medianIndex] };
          stats['Q1'] = { value: sorted[q1Index] };
          stats['Q3'] = { value: sorted[q3Index] };
          stats['IQR'] = { value: sorted[q3Index] - sorted[q1Index] };
          stats['Sample Size (n)'] = { value: values.length };
        }
      }
      break;

    case 'bar':
    case 'line':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        if (yValues.length > 0) {
          const sum = yValues.reduce((acc, val) => acc + val, 0);
          const mean = sum / yValues.length;
          
          stats['Total'] = { value: sum };
          stats['Mean'] = { value: mean };
          stats['Sample Size (n)'] = { value: yValues.length };
        }
      }
      break;

    default:
      // Basic statistics for other chart types
      if (variableRoles.xAxis) {
        const values = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        if (values.length > 0) {
          stats['Sample Size (n)'] = { value: values.length };
        }
      }
  }

  return stats;
};
