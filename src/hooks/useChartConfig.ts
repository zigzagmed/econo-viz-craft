
import { useState, useEffect } from 'react';

export const useChartConfig = (selectedVariables: string[], chartType: string) => {
  const [chartConfig, setChartConfig] = useState({
    title: '',
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: 'academic',
    showStats: true,
    showTrendLine: false
  });

  const generateDynamicConfig = (variables: string[], type: string) => {
    let title = '';
    let xAxisLabel = '';
    let yAxisLabel = '';

    if (variables.length === 1) {
      const variable = variables[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      switch (type) {
        case 'histogram':
          title = `${variable} Distribution`;
          xAxisLabel = variable;
          yAxisLabel = 'Frequency';
          break;
        case 'boxplot':
          title = `${variable} Box Plot`;
          xAxisLabel = 'Variable';
          yAxisLabel = variable;
          break;
        case 'pie':
          title = `${variable} Breakdown`;
          break;
        default:
          title = `${variable} Chart`;
          xAxisLabel = 'Categories';
          yAxisLabel = variable;
      }
    } else if (variables.length === 2) {
      const var1 = variables[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const var2 = variables[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      switch (type) {
        case 'scatter':
        case 'regression':
          title = `${var1} vs ${var2}`;
          xAxisLabel = var1;
          yAxisLabel = var2;
          break;
        case 'bar':
          title = `${var1} and ${var2}`;
          xAxisLabel = var1;
          yAxisLabel = var2;
          break;
        default:
          title = `${var1} and ${var2}`;
          xAxisLabel = var1;
          yAxisLabel = var2;
      }
    } else {
      switch (type) {
        case 'correlation':
          title = `Correlation Matrix`;
          break;
        case 'line':
          title = `Multi-Variable Trends`;
          xAxisLabel = selectedVariables[0]?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || '';
          yAxisLabel = 'Values';
          break;
        default:
          title = `Multi-Variable Analysis`;
          xAxisLabel = 'Variables';
          yAxisLabel = 'Values';
      }
    }

    return { title, xAxisLabel, yAxisLabel };
  };

  useEffect(() => {
    if (selectedVariables.length > 0) {
      const newConfig = generateDynamicConfig(selectedVariables, chartType);
      setChartConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    }
  }, [selectedVariables, chartType]);

  return { chartConfig, setChartConfig };
};
