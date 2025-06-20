
import { calculateCorrelation } from '../correlationUtils';

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

export const generateCorrelationStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.variables || variableRoles.variables.length < 2) return stats;

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

  return stats;
};
