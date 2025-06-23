
import { useState, useEffect } from 'react';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  series?: string;
  groupBy?: string;
  variables?: string[];
  histogramBins?: number;
}

export const useChartConfig = (variableRoles: VariableRoles, chartType: string) => {
  const [chartConfig, setChartConfig] = useState({
    title: '',
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: 'academic',
    customColors: undefined as string[] | undefined,
    showStats: true,
    showTrendLine: false,
    colorVariable: undefined as string | undefined,
    histogramBins: 10,
    titlePosition: 'top' as 'top' | 'center',
    xAxisLabelDistance: 30,
    yAxisLabelDistance: 50,
    statsDecimals: 2
  });

  const generateDynamicConfig = (roles: VariableRoles, type: string) => {
    let title = '';
    let xAxisLabel = '';
    let yAxisLabel = '';
    let showTrendLine = false;
    let histogramBins = roles.histogramBins || 10;

    const formatVariableName = (variable: string) => 
      variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (roles.xAxis && roles.yAxis) {
      const xVar = formatVariableName(roles.xAxis);
      const yVar = formatVariableName(roles.yAxis);
      
      switch (type) {
        case 'scatter':
          title = `${xVar} vs ${yVar}`;
          xAxisLabel = xVar;
          yAxisLabel = yVar;
          break;
        case 'bar':
        case 'line':
          title = roles.groupBy ? `${yVar} by ${xVar} (grouped by ${formatVariableName(roles.groupBy)})` : `${yVar} by ${xVar}`;
          xAxisLabel = xVar;
          yAxisLabel = yVar;
          break;
        default:
          title = `${xVar} and ${yVar}`;
          xAxisLabel = xVar;
          yAxisLabel = yVar;
      }
    } else if (roles.xAxis) {
      const xVar = formatVariableName(roles.xAxis);
      
      switch (type) {
        case 'histogram':
          title = `${xVar} Distribution`;
          xAxisLabel = xVar;
          yAxisLabel = 'Frequency';
          break;
        case 'boxplot':
          title = `${xVar} Box Plot`;
          xAxisLabel = 'Variable';
          yAxisLabel = xVar;
          break;
        case 'pie':
          title = `${xVar} Breakdown`;
          break;
        default:
          title = `${xVar} Chart`;
          xAxisLabel = 'Categories';
          yAxisLabel = xVar;
      }
    } else {
      switch (type) {
        case 'correlation':
          title = `Correlation Matrix`;
          break;
        default:
          title = `Chart Analysis`;
          xAxisLabel = 'Variables';
          yAxisLabel = 'Values';
      }
    }

    return { 
      title, 
      xAxisLabel, 
      yAxisLabel,
      showTrendLine,
      colorVariable: roles.color,
      histogramBins
    };
  };

  useEffect(() => {
    if (Object.keys(variableRoles).some(role => 
      role !== 'histogramBins' && variableRoles[role as keyof VariableRoles]
    )) {
      const newConfig = generateDynamicConfig(variableRoles, chartType);
      setChartConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    }
  }, [variableRoles, chartType]);

  return { chartConfig, setChartConfig };
};
