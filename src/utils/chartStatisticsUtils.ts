
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

  // Helper function to safely convert to number
  const toNumber = (value: any): number | null => {
    if (value == null || value === '' || value === undefined) return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  };

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
        const xValues = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
        const yValues = data.map(d => toNumber(d[variableRoles.yAxis!])).filter((v): v is number => v !== null);
        
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
      }
      break;

    case 'bar':
      if (variableRoles.xAxis && variableRoles.yAxis && variableRoles.statistic) {
        // Mirror the exact logic from barGenerator
        const groupedData = data.reduce((acc, item) => {
          const xValue = String(item[variableRoles.xAxis!]);
          const yValue = toNumber(item[variableRoles.yAxis!]);
          
          if (!acc[xValue]) {
            acc[xValue] = [];
          }
          if (yValue !== null) {
            acc[xValue].push(yValue);
          }
          return acc;
        }, {} as Record<string, number[]>);

        const categories = Object.keys(groupedData);
        categories.forEach(category => {
          const values = groupedData[category];
          if (values.length === 0) {
            stats[`${category}`] = { value: 0 };
            return;
          }
          
          let calculatedValue: number;
          switch (variableRoles.statistic) {
            case 'sum':
              calculatedValue = values.reduce((sum, val) => sum + val, 0);
              break;
            case 'average':
              calculatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
              break;
            case 'count':
              calculatedValue = values.length;
              break;
            case 'min':
              calculatedValue = Math.min(...values);
              break;
            case 'max':
              calculatedValue = Math.max(...values);
              break;
            default:
              calculatedValue = values.length;
          }
          
          stats[`${category}`] = { value: calculatedValue };
        });

        // Calculate total statistic - fix type safety here
        const allValues: number[] = [];
        Object.values(groupedData).forEach(valueArray => {
          allValues.push(...valueArray);
        });
        
        let totalValue: number;
        switch (variableRoles.statistic) {
          case 'sum':
            totalValue = allValues.reduce((sum, val) => sum + val, 0);
            break;
          case 'average':
            totalValue = allValues.length > 0 ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length : 0;
            break;
          case 'count':
            totalValue = allValues.length;
            break;
          case 'min':
            totalValue = allValues.length > 0 ? Math.min(...allValues) : 0;
            break;
          case 'max':
            totalValue = allValues.length > 0 ? Math.max(...allValues) : 0;
            break;
          default:
            totalValue = allValues.length;
        }

        const statLabel = variableRoles.statistic?.charAt(0).toUpperCase() + variableRoles.statistic?.slice(1);
        stats[`Total ${statLabel}`] = { value: totalValue };
      }
      break;

    case 'pie':
      if (variableRoles.xAxis) {
        // Mirror the exact logic from pieGenerator
        const pieData = data.reduce((acc, item) => {
          const key = String(item[variableRoles.xAxis!]);
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const total = Object.values(pieData).reduce((sum, count) => sum + count, 0);
        
        Object.entries(pieData).forEach(([category, count]) => {
          const percentage = (count / total) * 100;
          stats[`${category} (Count)`] = { value: count };
          stats[`${category} (%)`] = { value: percentage };
        });
        
        stats['Total Records'] = { value: total };
      }
      break;

    case 'histogram':
      if (variableRoles.xAxis) {
        // Mirror the exact logic from histogramGenerator
        const histValues = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
        const histMin = Math.min(...histValues);
        const histMax = Math.max(...histValues);
        const binCount = chartConfig.histogramBins || 10;
        const binWidth = (histMax - histMin) / binCount;
        
        const bins = Array.from({ length: binCount }, (_, i) => ({
          start: histMin + i * binWidth,
          end: histMin + (i + 1) * binWidth,
          count: 0
        }));
        
        histValues.forEach(value => {
          const binIndex = Math.min(Math.floor((value - histMin) / binWidth), binCount - 1);
          bins[binIndex].count++;
        });

        bins.forEach((bin, index) => {
          const rangeLabel = `${bin.start.toFixed(2)} - ${bin.end.toFixed(2)}`;
          stats[`Bin ${index + 1} (${rangeLabel})`] = { value: bin.count };
        });
        
        stats['Total Count'] = { value: histValues.length };
        stats['Bin Width'] = { value: binWidth };
      }
      break;

    case 'boxplot':
      if (variableRoles.xAxis) {
        if (variableRoles.groupBy) {
          // Grouped box plot statistics
          const groupedData = data.reduce((acc, item) => {
            const groupValue = String(item[variableRoles.groupBy!]);
            const dataValue = toNumber(item[variableRoles.xAxis!]);
            
            if (!acc[groupValue]) {
              acc[groupValue] = [];
            }
            if (dataValue !== null) {
              acc[groupValue].push(dataValue);
            }
            return acc;
          }, {} as Record<string, number[]>);

          Object.keys(groupedData).forEach(group => {
            const values = groupedData[group];
            if (values.length > 0) {
              const sorted = values.sort((a, b) => a - b);
              const q1 = sorted[Math.floor(sorted.length * 0.25)];
              const median = sorted[Math.floor(sorted.length * 0.5)];
              const q3 = sorted[Math.floor(sorted.length * 0.75)];
              const min = sorted[0];
              const max = sorted[sorted.length - 1];
              
              stats[`${group} - Min`] = { value: min };
              stats[`${group} - Q1`] = { value: q1 };
              stats[`${group} - Median`] = { value: median };
              stats[`${group} - Q3`] = { value: q3 };
              stats[`${group} - Max`] = { value: max };
              stats[`${group} - IQR`] = { value: q3 - q1 };
            }
          });
        } else {
          // Single box plot statistics
          const values = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
          if (values.length > 0) {
            const sorted = [...values].sort((a, b) => a - b);
            const q1Index = Math.floor(sorted.length * 0.25);
            const q3Index = Math.floor(sorted.length * 0.75);
            const medianIndex = Math.floor(sorted.length * 0.5);
            
            stats['Min'] = { value: sorted[0] };
            stats['Q1'] = { value: sorted[q1Index] };
            stats['Median'] = { value: sorted[medianIndex] };
            stats['Q3'] = { value: sorted[q3Index] };
            stats['Max'] = { value: sorted[sorted.length - 1] };
            stats['IQR'] = { value: sorted[q3Index] - sorted[q1Index] };
            stats['Sample Size (n)'] = { value: values.length };
          }
        }
      }
      break;

    case 'line':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        if (variableRoles.groupBy) {
          // Grouped line chart statistics
          const grouped = data.reduce((acc, item) => {
            const groupValue = String(item[variableRoles.groupBy!]);
            if (!acc[groupValue]) acc[groupValue] = [];
            acc[groupValue].push(item);
            return acc;
          }, {} as Record<string, any[]>);

          Object.keys(grouped).forEach(group => {
            const groupData = grouped[group];
            const yValues = groupData.map(d => toNumber(d[variableRoles.yAxis!])).filter((v): v is number => v !== null);
            
            if (yValues.length > 0) {
              const sum = yValues.reduce((acc, val) => acc + val, 0);
              const mean = sum / yValues.length;
              const min = Math.min(...yValues);
              const max = Math.max(...yValues);
              
              stats[`${group} - Data Points`] = { value: yValues.length };
              stats[`${group} - Average`] = { value: mean };
              stats[`${group} - Min`] = { value: min };
              stats[`${group} - Max`] = { value: max };
            }
          });
        } else {
          // Single line chart statistics
          const yValues = data.map(d => toNumber(d[variableRoles.yAxis!])).filter((v): v is number => v !== null);
          if (yValues.length > 0) {
            const sum = yValues.reduce((acc, val) => acc + val, 0);
            const mean = sum / yValues.length;
            const min = Math.min(...yValues);
            const max = Math.max(...yValues);
            
            stats['Data Points'] = { value: yValues.length };
            stats['Average'] = { value: mean };
            stats['Min'] = { value: min };
            stats['Max'] = { value: max };
            stats['Total'] = { value: sum };
          }
        }
      }
      break;

    case 'correlation':
      if (variableRoles.variables && variableRoles.variables.length >= 2) {
        const variables = variableRoles.variables;
        
        // Show correlation coefficients for each pair
        for (let i = 0; i < variables.length; i++) {
          for (let j = i + 1; j < variables.length; j++) {
            const var1 = variables[i];
            const var2 = variables[j];
            
            const values1 = data.map(d => toNumber(d[var1])).filter((v): v is number => v !== null);
            const values2 = data.map(d => toNumber(d[var2])).filter((v): v is number => v !== null);
            
            if (values1.length > 1 && values2.length > 1) {
              const correlation = calculateCorrelation(values1, values2);
              stats[`${var1} vs ${var2}`] = { value: correlation };
            }
          }
        }
        
        stats['Variables Count'] = { value: variables.length };
        stats['Sample Size (n)'] = { value: data.length };
      }
      break;

    default:
      // Basic statistics for unknown chart types
      if (variableRoles.xAxis) {
        const values = data.map(d => toNumber(d[variableRoles.xAxis!])).filter((v): v is number => v !== null);
        if (values.length > 0) {
          stats['Sample Size (n)'] = { value: values.length };
        }
      }
  }

  return stats;
};
