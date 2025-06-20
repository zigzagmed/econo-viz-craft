
import { calculateCorrelation } from '../correlationUtils';
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

export const generateScatterStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis || !variableRoles.yAxis) return stats;

  const xValues = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
  const yValues = data.map(d => toNumber(d[variableRoles.yAxis!])).filter((v): v is number => v !== null);
  
  if (xValues.length > 1 && yValues.length > 1) {
    const correlation = calculateCorrelation(xValues, yValues);
    stats['Correlation (r)'] = { value: correlation };
    
    // Add regression statistics for regression plots
    if (chartConfig.showTrendLine) {
      const { slope, intercept } = calculateRegression(xValues, yValues);
      const calculateRSquared = (xVals: number[], yVals: number[]) => {
        const yMean = yVals.reduce((sum, val) => sum + val, 0) / yVals.length;
        let totalSumSquares = 0;
        let residualSumSquares = 0;
        
        for (let i = 0; i < yVals.length; i++) {
          const predicted = slope * xVals[i] + intercept;
          totalSumSquares += Math.pow(yVals[i] - yMean, 2);
          residualSumSquares += Math.pow(yVals[i] - predicted, 2);
        }
        
        return 1 - (residualSumSquares / totalSumSquares);
      };
      
      const rSquared = calculateRSquared(xValues, yValues);
      
      // If color variable is used, calculate stats for each group
      if (variableRoles.color) {
        const groupedData = data.reduce((acc, item) => {
          const colorValue = String(item[variableRoles.color!]);
          if (!acc[colorValue]) {
            acc[colorValue] = { x: [], y: [] };
          }
          const xVal = toNumber(item[variableRoles.xAxis!]);
          const yVal = toNumber(item[variableRoles.yAxis!]);
          if (xVal !== null && yVal !== null) {
            acc[colorValue].x.push(xVal);
            acc[colorValue].y.push(yVal);
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
        stats['Slope (β)'] = { value: slope };
        stats['R²'] = { value: rSquared };
        stats['Intercept'] = { value: intercept };
      }
    }
  }
  
  stats['Sample Size (n)'] = { value: Math.min(xValues.length, yValues.length) };
  
  return stats;
};
