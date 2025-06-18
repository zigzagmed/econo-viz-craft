
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
}

export const generateChartStatistics = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any
): Record<string, any> => {
  const stats: Record<string, any> = {};

  switch (chartType) {
    case 'scatter':
    case 'regression':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const xValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        
        stats['Sample Size'] = { value: Math.min(xValues.length, yValues.length) };
        stats['Correlation'] = { value: calculateCorrelation(xValues, yValues) };
        
        if (chartType === 'regression') {
          const correlation = calculateCorrelation(xValues, yValues);
          stats['R-squared'] = { value: correlation * correlation };
        }
      }
      break;

    case 'histogram':
      if (variableRoles.xAxis) {
        const histValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        const histMin = Math.min(...histValues);
        const histMax = Math.max(...histValues);
        const mean = histValues.reduce((sum, val) => sum + val, 0) / histValues.length;
        const variance = histValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / histValues.length;
        
        stats['Sample Size'] = { value: histValues.length };
        stats['Mean'] = { value: mean };
        stats['Std Deviation'] = { value: Math.sqrt(variance) };
        stats['Min Value'] = { value: histMin };
        stats['Max Value'] = { value: histMax };
        stats['Number of Bins'] = { value: chartConfig.histogramBins || 10 };
      }
      break;

    case 'bar':
      if (variableRoles.xAxis) {
        const categories = [...new Set(data.map(d => d[variableRoles.xAxis!]))];
        const totalCount = data.length;
        
        stats['Total Records'] = { value: totalCount };
        stats['Categories'] = { value: categories.length };
        stats['Most Frequent'] = { 
          value: categories.reduce((max, cat) => {
            const count = data.filter(d => d[variableRoles.xAxis!] === cat).length;
            return count > (data.filter(d => d[variableRoles.xAxis!] === max).length || 0) ? cat : max;
          }, categories[0])
        };
      }
      break;

    case 'pie':
      if (variableRoles.xAxis) {
        const pieData = data.reduce((acc, item) => {
          const key = item[variableRoles.xAxis!];
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const categories = Object.keys(pieData);
        const maxCategory = categories.reduce((max, cat) => 
          pieData[cat] > pieData[max] ? cat : max, categories[0]);
        
        stats['Total Records'] = { value: data.length };
        stats['Categories'] = { value: categories.length };
        stats['Largest Segment'] = { value: maxCategory };
        stats['Largest %'] = { value: (pieData[maxCategory] / data.length) * 100 };
      }
      break;

    case 'boxplot':
      if (variableRoles.xAxis) {
        const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
        const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
        const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
        const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
        const iqr = q3 - q1;
        
        stats['Sample Size'] = { value: boxplotValues.length };
        stats['Median'] = { value: median };
        stats['Q1'] = { value: q1 };
        stats['Q3'] = { value: q3 };
        stats['IQR'] = { value: iqr };
        stats['Min Value'] = { value: boxplotValues[0] };
        stats['Max Value'] = { value: boxplotValues[boxplotValues.length - 1] };
      }
      break;

    case 'line':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        const trend = yValues.length > 1 ? 
          (yValues[yValues.length - 1] - yValues[0]) / (yValues.length - 1) : 0;
        
        stats['Data Points'] = { value: yValues.length };
        stats['Max Value'] = { value: Math.max(...yValues) };
        stats['Min Value'] = { value: Math.min(...yValues) };
        stats['Average Trend'] = { value: trend };
      }
      break;

    case 'correlation':
      if (variableRoles.variables && variableRoles.variables.length >= 2) {
        const variables = variableRoles.variables;
        let maxCorr = -1;
        let minCorr = 1;
        let maxPair = '';
        let minPair = '';
        
        for (let i = 0; i < variables.length; i++) {
          for (let j = i + 1; j < variables.length; j++) {
            const values1 = data.map(d => d[variables[i]]).filter(v => v != null);
            const values2 = data.map(d => d[variables[j]]).filter(v => v != null);
            const corr = calculateCorrelation(values1, values2);
            
            if (Math.abs(corr) > Math.abs(maxCorr)) {
              maxCorr = corr;
              maxPair = `${variables[i]} - ${variables[j]}`;
            }
            if (Math.abs(corr) < Math.abs(minCorr)) {
              minCorr = corr;
              minPair = `${variables[i]} - ${variables[j]}`;
            }
          }
        }
        
        stats['Variables'] = { value: variables.length };
        stats['Strongest Correlation'] = { value: maxCorr };
        stats['Strongest Pair'] = { value: maxPair };
        stats['Weakest Correlation'] = { value: minCorr };
        stats['Weakest Pair'] = { value: minPair };
      }
      break;

    default:
      stats['Total Records'] = { value: data.length };
      break;
  }

  return stats;
};
