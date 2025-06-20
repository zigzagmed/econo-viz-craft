
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

export const generateLineStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis || !variableRoles.yAxis) return stats;

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

  return stats;
};
