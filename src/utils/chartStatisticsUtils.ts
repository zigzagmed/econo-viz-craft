
import { calculateCorrelation } from './correlationUtils';

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

// Type guard to check if value is a number
const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

// Type guard to check if value is an array
const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const generateChartStatistics = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any
): Record<string, any> => {
  const stats: Record<string, any> = {};

  // Helper function to format variable names
  const formatVariableName = (variable: string) => 
    variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  switch (chartType) {
    case 'bar':
      if (variableRoles.xAxis && variableRoles.yAxis && variableRoles.statistic) {
        // Group data by X-axis categories and calculate the selected statistic
        const grouped = data.reduce((acc, item) => {
          const key = item[variableRoles.xAxis!];
          if (!acc[key]) acc[key] = [];
          const yValue = item[variableRoles.yAxis!];
          if (yValue != null && isNumber(yValue)) {
            acc[key].push(yValue);
          }
          return acc;
        }, {} as Record<string, number[]>);

        const statisticLabel = variableRoles.statistic.charAt(0).toUpperCase() + variableRoles.statistic.slice(1);
        const yAxisLabel = formatVariableName(variableRoles.yAxis);
        const xAxisLabel = formatVariableName(variableRoles.xAxis);

        // Calculate statistic for each category and format descriptively
        Object.entries(grouped).forEach(([category, values]) => {
          if (isArray(values) && values.length > 0 && values.every(isNumber)) {
            const numericValues = values as number[];
            let result: number;
            switch (variableRoles.statistic) {
              case 'sum':
                result = numericValues.reduce((sum: number, val: number) => sum + val, 0);
                break;
              case 'average':
                result = numericValues.reduce((sum: number, val: number) => sum + val, 0) / numericValues.length;
                break;
              case 'count':
                result = numericValues.length;
                break;
              case 'min':
                result = Math.min(...numericValues);
                break;
              case 'max':
                result = Math.max(...numericValues);
                break;
              default:
                result = numericValues.length;
            }
            
            // Create descriptive label
            const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(2);
            stats[`${statisticLabel} ${yAxisLabel} for ${category}`] = { value: formattedResult };
          }
        });
      }
      break;

    case 'scatter':
    case 'regression':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const xValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null && isNumber(v)) as number[];
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null && isNumber(v)) as number[];
        
        const xAxisLabel = formatVariableName(variableRoles.xAxis);
        const yAxisLabel = formatVariableName(variableRoles.yAxis);
        
        stats[`Sample Size (${xAxisLabel} vs ${yAxisLabel})`] = { value: Math.min(xValues.length, yValues.length) };
        stats[`Correlation (${xAxisLabel} & ${yAxisLabel})`] = { value: calculateCorrelation(xValues, yValues) };
        
        if (chartType === 'regression') {
          const correlation = calculateCorrelation(xValues, yValues);
          stats[`R-squared (${xAxisLabel} & ${yAxisLabel})`] = { value: correlation * correlation };
        }
      }
      break;

    case 'histogram':
      if (variableRoles.xAxis) {
        const histValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null && isNumber(v)) as number[];
        if (histValues.length > 0) {
          const histMin = Math.min(...histValues);
          const histMax = Math.max(...histValues);
          const binCount = chartConfig.histogramBins || 10;
          const binWidth = (histMax - histMin) / binCount;
          
          const variableLabel = formatVariableName(variableRoles.xAxis);
          
          // Create bins and count frequencies
          const bins: Record<string, number> = {};
          for (let i = 0; i < binCount; i++) {
            const binStart = histMin + i * binWidth;
            const binEnd = binStart + binWidth;
            const binLabel = `${variableLabel} ${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
            bins[binLabel] = 0;
          }
          
          // Count values in each bin
          histValues.forEach(value => {
            const binIndex = Math.min(Math.floor((value - histMin) / binWidth), binCount - 1);
            const binStart = histMin + binIndex * binWidth;
            const binEnd = binStart + binWidth;
            const binLabel = `${variableLabel} ${binStart.toFixed(1)}-${binEnd.toFixed(1)}`;
            bins[binLabel]++;
          });
          
          Object.entries(bins).forEach(([binLabel, count]) => {
            stats[`${binLabel} frequency`] = { value: count };
          });
        }
      }
      break;

    case 'pie':
      if (variableRoles.xAxis) {
        const pieData = data.reduce((acc, item) => {
          const key = item[variableRoles.xAxis!];
          if (key != null) {
            acc[key] = (acc[key] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);
        
        const total = Object.values(pieData).reduce((sum: number, count: unknown) => {
          return sum + (count as number);
        }, 0);
        
        const variableLabel = formatVariableName(variableRoles.xAxis);
        
        Object.entries(pieData).forEach(([category, count]) => {
          const numericCount = count as number;
          const numericTotal = total as number;
          const percentage = (numericCount / numericTotal) * 100;
          stats[`${variableLabel} ${category} count`] = { value: `${numericCount} (${percentage.toFixed(1)}%)` };
        });
      }
      break;

    case 'boxplot':
      if (variableRoles.xAxis) {
        const boxplotValues = data.map(d => d[variableRoles.xAxis!])
          .filter(v => v != null && isNumber(v)) as number[];
        
        if (boxplotValues.length > 0) {
          boxplotValues.sort((a, b) => a - b);
          const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
          const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
          const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
          const iqr = q3 - q1;
          
          const variableLabel = formatVariableName(variableRoles.xAxis);
          
          stats[`${variableLabel} Q1`] = { value: q1 };
          stats[`${variableLabel} Median`] = { value: median };
          stats[`${variableLabel} Q3`] = { value: q3 };
          stats[`${variableLabel} IQR`] = { value: iqr };
          stats[`${variableLabel} Min`] = { value: boxplotValues[0] };
          stats[`${variableLabel} Max`] = { value: boxplotValues[boxplotValues.length - 1] };
        }
      }
      break;

    case 'line':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        // Show data points or key statistics
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null && isNumber(v)) as number[];
        const xValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null && isNumber(v)) as number[];
        
        const xAxisLabel = formatVariableName(variableRoles.xAxis);
        const yAxisLabel = formatVariableName(variableRoles.yAxis);
        
        // Show first few and last few data points
        const sortedData = data
          .filter(d => d[variableRoles.xAxis!] != null && d[variableRoles.yAxis!] != null && 
                      isNumber(d[variableRoles.xAxis!]) && isNumber(d[variableRoles.yAxis!]))
          .sort((a, b) => (a[variableRoles.xAxis!] as number) - (b[variableRoles.xAxis!] as number));
        
        if (sortedData.length > 0 && yValues.length > 0) {
          stats[`${yAxisLabel} start value`] = { value: sortedData[0][variableRoles.yAxis!] };
          stats[`${yAxisLabel} end value`] = { value: sortedData[sortedData.length - 1][variableRoles.yAxis!] };
          stats[`${yAxisLabel} maximum`] = { value: Math.max(...yValues) };
          stats[`${yAxisLabel} minimum`] = { value: Math.min(...yValues) };
        }
      }
      break;

    case 'correlation':
      if (variableRoles.variables && variableRoles.variables.length >= 2) {
        const variables = variableRoles.variables;
        
        // Show correlation coefficients between all pairs
        for (let i = 0; i < variables.length; i++) {
          for (let j = i + 1; j < variables.length; j++) {
            const values1 = data.map(d => d[variables[i]]).filter(v => v != null && isNumber(v)) as number[];
            const values2 = data.map(d => d[variables[j]]).filter(v => v != null && isNumber(v)) as number[];
            const corr = calculateCorrelation(values1, values2);
            
            const var1Label = formatVariableName(variables[i]);
            const var2Label = formatVariableName(variables[j]);
            
            stats[`${var1Label} & ${var2Label} correlation`] = { value: corr };
          }
        }
      }
      break;

    default:
      stats['Total records in dataset'] = { value: data.length };
      break;
  }

  return stats;
};
