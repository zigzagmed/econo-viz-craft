
import { getColorPalette } from './colorUtils';
import { generateScatterConfig } from './chartGenerators/scatterGenerator';
import { generateLineConfig } from './chartGenerators/lineGenerator';
import { generateBarConfig } from './chartGenerators/barGenerator';
import { generateHistogramConfig } from './chartGenerators/histogramGenerator';
import { generatePieConfig } from './chartGenerators/pieGenerator';
import { generateBoxplotConfig } from './chartGenerators/boxplotGenerator';
import { generateCorrelationConfig } from './chartGenerators/correlationGenerator';
import { formatTooltipValue, getAxisLabelConfig, getTitleConfig } from './chartGenerators/chartConfigUtils';

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

export const generateChartConfig = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any,
  stats: any
): any => {
  console.log('Generating chart config for type:', chartType);
  console.log('Variable roles:', variableRoles);
  console.log('Chart config:', chartConfig);

  const colors = getColorPalette(chartConfig.colorScheme, chartConfig.customColors);
  const titleConfig = getTitleConfig(chartConfig.title);

  switch (chartType) {
    case 'scatter':
    case 'regression':
      return generateScatterConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors, formatTooltipValue);

    case 'line':
      return generateLineConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors, formatTooltipValue);

    case 'bar':
      return generateBarConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors, formatTooltipValue);

    case 'histogram':
      return generateHistogramConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors, formatTooltipValue);

    case 'pie':
      return generatePieConfig(data, variableRoles, chartConfig, titleConfig, colors, formatTooltipValue);

    case 'boxplot':
      return generateBoxplotConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors, formatTooltipValue);

    case 'correlation':
      return generateCorrelationConfig(data, variableRoles, chartConfig, titleConfig, formatTooltipValue);

    default:
      return {};
  }
};
