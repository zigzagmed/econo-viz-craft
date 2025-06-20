
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

export const generateBoxplotStatistics = (
  data: any[],
  variableRoles: VariableRoles,
  toNumber: (value: any) => number | null
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis) return stats;

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

  return stats;
};
