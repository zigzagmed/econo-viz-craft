
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
    const percentage = (count / total) * 100;
    stats[`${category} (Count)`] = { value: count };
    stats[`${category} (%)`] = { value: percentage };
  });
  
  stats['Total Records'] = { value: total };

  return stats;
};
