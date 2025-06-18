import { getColorPalette } from './colorUtils';
import { calculateCorrelation } from './correlationUtils';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
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
  
  // Common title configuration with positioning
  const titleConfig = {
    text: chartConfig.title || 'Chart',
    left: 'center',
    top: chartConfig.titlePosition === 'center' ? 'middle' : 20,
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    }
  };

  // Common axis label configuration with custom distances (reduced Y-axis distance)
  const getAxisLabelConfig = (label: string, isVertical: boolean) => ({
    name: label,
    nameLocation: 'middle',
    nameGap: isVertical ? (chartConfig.yAxisLabelDistance || 35) : (chartConfig.xAxisLabelDistance || 30),
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'normal'
    }
  });

  switch (chartType) {
    case 'scatter':
    case 'regression':
      return generateScatterConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors);

    case 'line':
      return generateLineConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors);

    case 'bar':
      return generateBarConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors);

    case 'histogram':
      return generateHistogramConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors);

    case 'pie':
      return generatePieConfig(data, variableRoles, chartConfig, titleConfig, colors);

    case 'boxplot':
      return generateBoxplotConfig(data, variableRoles, chartConfig, titleConfig, getAxisLabelConfig, colors);

    case 'correlation':
      return generateCorrelationConfig(data, variableRoles, chartConfig, titleConfig);

    default:
      return {};
  }
};

const generateScatterConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, getAxisLabelConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis) return {};
  
  // If color variable is specified, group data by color variable
  if (variableRoles.color) {
    const groupedData = data.reduce((acc, item) => {
      const colorValue = item[variableRoles.color!];
      if (!acc[colorValue]) {
        acc[colorValue] = [];
      }
      acc[colorValue].push([item[variableRoles.xAxis!], item[variableRoles.yAxis!]]);
      return acc;
    }, {} as Record<string, any[]>);

    const series = Object.keys(groupedData).map((group, index) => ({
      name: group,
      type: 'scatter',
      data: groupedData[group],
      itemStyle: {
        color: colors[index % colors.length]
      }
    }));

    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${variableRoles.xAxis}: ${params.data[0]}<br/>${variableRoles.yAxis}: ${params.data[1]}<br/>${variableRoles.color}: ${params.seriesName}`;
        }
      },
      legend: {
        data: Object.keys(groupedData),
        top: 40
      },
      xAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
      },
      yAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
      },
      series
    };
  } else {
    // No color variable, use single series
    const scatterData = data.map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]);
    
    return {
      title: titleConfig,
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${variableRoles.xAxis}: ${params.data[0]}<br/>${variableRoles.yAxis}: ${params.data[1]}`;
        }
      },
      xAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
      },
      yAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
      },
      series: [{
        type: 'scatter',
        data: scatterData,
        itemStyle: {
          color: colors[0]
        }
      }]
    };
  }
};

const generateLineConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, getAxisLabelConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis) return {};
  
  if (variableRoles.groupBy) {
    // Group data by the groupBy variable
    const grouped = data.reduce((acc, item) => {
      const groupValue = item[variableRoles.groupBy!];
      if (!acc[groupValue]) acc[groupValue] = [];
      acc[groupValue].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    const series = Object.keys(grouped).map((group, index) => ({
      name: group,
      type: 'line',
      data: grouped[group].map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]),
      itemStyle: { color: colors[index % colors.length] },
      lineStyle: { color: colors[index % colors.length] }
    }));

    return {
      title: titleConfig,
      tooltip: { trigger: 'axis' },
      legend: { data: Object.keys(grouped) },
      xAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
      },
      yAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
      },
      series
    };
  } else {
    const lineData = data.map(d => [d[variableRoles.xAxis!], d[variableRoles.yAxis!]]);
    
    return {
      title: titleConfig,
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
      },
      yAxis: {
        type: 'value',
        ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
      },
      series: [{
        type: 'line',
        data: lineData,
        itemStyle: { color: colors[0] },
        lineStyle: { color: colors[0] }
      }]
    };
  }
};

const generateBarConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, getAxisLabelConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis || !variableRoles.yAxis || !variableRoles.statistic) return {};
  
  // Group data by X variable and calculate the selected statistic for Y
  const groupedData = data.reduce((acc, item) => {
    const xValue = item[variableRoles.xAxis!];
    const yValue = item[variableRoles.yAxis!];
    
    if (!acc[xValue]) {
      acc[xValue] = [];
    }
    if (yValue !== null && yValue !== undefined) {
      acc[xValue].push(yValue);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const categories = Object.keys(groupedData);
  const barValues = categories.map(category => {
    const values = groupedData[category];
    if (values.length === 0) return 0;
    
    switch (variableRoles.statistic) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0);
      case 'average':
        return values.reduce((sum, val) => sum + val, 0) / values.length;
      case 'count':
        return values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      default:
        return values.length; // Default to count
    }
  });

  return {
    title: titleConfig,
    tooltip: { 
      trigger: 'axis',
      formatter: (params: any) => {
        const category = params[0].name;
        const value = params[0].value;
        const statLabel = variableRoles.statistic?.charAt(0).toUpperCase() + variableRoles.statistic?.slice(1);
        return `${category}<br/>${statLabel} of ${variableRoles.yAxis}: ${value}`;
      }
    },
    xAxis: {
      type: 'category',
      data: categories,
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'bar',
      data: barValues,
      itemStyle: { color: colors[0] }
    }]
  };
};

const generateHistogramConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, getAxisLabelConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis) return {};
  
  const histValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
  const histMin = Math.min(...histValues);
  const histMax = Math.max(...histValues);
  const binCount = chartConfig.histogramBins || 10;
  const binWidth = (histMax - histMin) / binCount;
  
  const bins = Array.from({ length: binCount }, (_, i) => ({
    start: histMin + i * binWidth,
    end: histMin + (i + 1) * binWidth,
    count: 0
  }));
  
  histValues.forEach(value => {
    const binIndex = Math.min(Math.floor((value - histMin) / binWidth), binCount - 1);
    bins[binIndex].count++;
  });

  const histogramData = bins.map(bin => [bin.start + binWidth / 2, bin.count]);

  return {
    title: titleConfig,
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const value = params[0];
        return `Range: ${(value.data[0] - binWidth/2).toFixed(2)} - ${(value.data[0] + binWidth/2).toFixed(2)}<br/>Count: ${value.data[1]}`;
      }
    },
    xAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'bar',
      data: histogramData,
      itemStyle: { color: colors[0] },
      barWidth: '90%'
    }]
  };
};

const generatePieConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis) return {};
  
  const pieData = data.reduce((acc, item) => {
    const key = item[variableRoles.xAxis!];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieSeriesData = Object.entries(pieData).map(([name, value], index) => ({
    name,
    value,
    itemStyle: { color: colors[index % colors.length] }
  }));

  return {
    title: titleConfig,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: chartConfig.title || 'Distribution',
      type: 'pie',
      radius: '50%',
      data: pieSeriesData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
};

const generateBoxplotConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any, getAxisLabelConfig: any, colors: string[]) => {
  if (!variableRoles.xAxis) return {};
  
  const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
  const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
  const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
  const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
  const boxplotMin = boxplotValues[0];
  const boxplotMax = boxplotValues[boxplotValues.length - 1];

  return {
    title: titleConfig,
    tooltip: { trigger: 'item' },
    xAxis: {
      type: 'category',
      data: [variableRoles.xAxis],
      ...getAxisLabelConfig(chartConfig.xAxisLabel, false)
    },
    yAxis: {
      type: 'value',
      ...getAxisLabelConfig(chartConfig.yAxisLabel, true)
    },
    series: [{
      type: 'boxplot',
      data: [[boxplotMin, q1, median, q3, boxplotMax]],
      itemStyle: { color: colors[0] }
    }]
  };
};

const generateCorrelationConfig = (data: any[], variableRoles: VariableRoles, chartConfig: any, titleConfig: any) => {
  if (!variableRoles.variables || variableRoles.variables.length < 2) return {};
  
  const variables = variableRoles.variables;
  const correlationMatrix = variables.map((var1, i) => 
    variables.map((var2, j) => {
      if (i === j) return 1;
      const values1 = data.map(d => d[var1]).filter(v => v != null);
      const values2 = data.map(d => d[var2]).filter(v => v != null);
      
      const correlation = calculateCorrelation(values1, values2);
      return [j, i, correlation];
    })
  ).flat();

  return {
    title: titleConfig,
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${variables[params.data[0]]} vs ${variables[params.data[1]]}<br/>Correlation: ${params.data[2].toFixed(3)}`;
      }
    },
    grid: {
      height: '50%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: variables,
      splitArea: { show: true }
    },
    yAxis: {
      type: 'category',
      data: variables,
      splitArea: { show: true }
    },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    series: [{
      type: 'heatmap',
      data: correlationMatrix,
      label: {
        show: true,
        formatter: (params: any) => params.data[2].toFixed(2)
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };
};
