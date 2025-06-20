
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

export const generatePieStatistics = (
  data: any[],
  variableRoles: VariableRoles
): Record<string, { value: number | string }> => {
  const stats: Record<string, { value: number | string }> = {};

  if (!variableRoles.xAxis) return stats;

  const pieData = data.reduce((acc, item) => {
    const key = String(item[variableRoles.xAxis!]);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(pieData).reduce((sum: number, count: number) => sum + count, 0);
  
  Object.entries(pieData).forEach(([category, count]) => {
    const numericCount = Number(count);
    const numericTotal = Number(total);
    const percentage = numericTotal > 0 ? (numericCount / numericTotal) * 100 : 0;
    stats[`${category} (Count)`] = { value: numericCount };
    stats[`${category} (%)`] = { value: Number(percentage.toFixed(2)) };
  });
  
  stats['Total Records'] = { value: Number(total) };

  return stats;
};
