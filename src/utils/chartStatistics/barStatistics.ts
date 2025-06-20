
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

export const generateBarStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis || !variableRoles.yAxis || !variableRoles.statistic) return stats;

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

  // Calculate total statistic with proper type safety
  const allValues: number[] = [];
  Object.values(groupedData).forEach((valueArray: number[]) => {
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

  return stats;
};
