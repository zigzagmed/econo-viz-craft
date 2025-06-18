
import { ChartRoleRequirements } from '../types/variableTypes';

export const getChartRoleRequirements = (chartType: string): ChartRoleRequirements => {
  const requirements: Record<string, ChartRoleRequirements> = {
    bar: {
      xAxis: { required: true, label: 'X-Axis', description: 'Categories to compare', allowedTypes: ['categorical', 'binary'] },
      yAxis: { required: false, label: 'Y-Axis', description: 'Values to measure', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    line: {
      xAxis: { required: true, label: 'X-Axis', description: 'Time or sequence variable', allowedTypes: ['continuous', 'categorical'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Values to plot', allowedTypes: ['continuous'] },
      groupBy: { required: false, label: 'Group By', description: 'Split data into multiple lines by category', allowedTypes: ['categorical', 'binary'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    scatter: {
      xAxis: { required: true, label: 'X-Axis', description: 'Horizontal values', allowedTypes: ['continuous'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Vertical values', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] },
      size: { required: false, label: 'Size', description: 'Point size', allowedTypes: ['continuous'] }
    },
    regression: {
      xAxis: { required: true, label: 'X-Axis', description: 'Independent variable', allowedTypes: ['continuous'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Dependent variable', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    pie: {
      xAxis: { required: true, label: 'Category', description: 'Categories for pie slices', allowedTypes: ['categorical', 'binary'] }
    },
    histogram: {
      xAxis: { required: true, label: 'Variable', description: 'Variable to show distribution', allowedTypes: ['continuous'] }
    },
    boxplot: {
      xAxis: { required: true, label: 'Variable', description: 'Variable for box plot', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Group By', description: 'Group boxes by category', allowedTypes: ['categorical', 'binary'] }
    },
    correlation: {
      series: { required: true, label: 'Variables', description: 'Variables for correlation matrix', allowedTypes: ['continuous'] }
    }
  };

  return requirements[chartType] || {};
};
