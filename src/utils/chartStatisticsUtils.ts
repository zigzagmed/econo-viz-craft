
import { generateScatterStatistics } from './chartStatistics/scatterStatistics';
import { generateBarStatistics } from './chartStatistics/barStatistics';
import { generatePieStatistics } from './chartStatistics/pieStatistics';
import { generateHistogramStatistics } from './chartStatistics/histogramStatistics';
import { generateBoxplotStatistics } from './chartStatistics/boxplotStatistics';
import { generateLineStatistics } from './chartStatistics/lineStatistics';
import { generateCorrelationStatistics } from './chartStatistics/correlationStatistics';

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

  switch (chartType) {
    case 'scatter':
    case 'regression':
      return generateScatterStatistics(data, variableRoles, chartConfig, toNumber);

    case 'bar':
      return generateBarStatistics(data, variableRoles, toNumber);

    case 'pie':
      return generatePieStatistics(data, variableRoles);

    case 'histogram':
      return generateHistogramStatistics(data, variableRoles, chartConfig, toNumber);

    case 'boxplot':
      return generateBoxplotStatistics(data, variableRoles, toNumber);

    case 'line':
      return generateLineStatistics(data, variableRoles, toNumber);

    case 'correlation':
      return generateCorrelationStatistics(data, variableRoles, toNumber);

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
