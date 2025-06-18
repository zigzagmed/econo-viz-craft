import { calculateCorrelation, calculateRegression } from './statisticalUtils';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  groupBy?: string;
}

const colorSchemes = {
  academic: ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#c2410c'],
  colorblind: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
  grayscale: ['#374151', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb', '#f3f4f6'],
  vibrant: ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f97316']
};

export const generateChartConfig = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  config: any,
  stats: Record<string, any>
) => {
  // Use custom colors if available, otherwise fall back to preset schemes
  const colors = config.customColors && config.colorScheme === 'custom' 
    ? config.customColors 
    : colorSchemes[config.colorScheme as keyof typeof colorSchemes] || colorSchemes.academic;
  
  const baseOption = {
    title: {
      text: config.title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    backgroundColor: '#ffffff',
    animation: true
  };

  switch (chartType) {
    case 'bar':
      return generateBarChart(data, variableRoles, config, colors, baseOption);
    case 'line':
      return generateLineChart(data, variableRoles, config, colors, baseOption);
    case 'scatter':
    case 'regression':
      return generateScatterChart(data, variableRoles, config, colors, baseOption, chartType === 'regression');
    case 'histogram':
      return generateHistogram(data, variableRoles.xAxis!, config, colors, baseOption);
    case 'boxplot':
      return generateBoxPlot(data, variableRoles, config, colors, baseOption);
    case 'correlation':
      return generateCorrelationMatrix(data, variableRoles, config, colors, baseOption);
    case 'pie':
      return generatePieChart(data, variableRoles.xAxis!, config, colors, baseOption);
    default:
      return baseOption;
  }
};

const generateBarChart = (data: any[], variableRoles: VariableRoles, config: any, colors: string[], baseOption: any) => {
  const xVar = variableRoles.xAxis!;
  const yVar = variableRoles.yAxis || variableRoles.xAxis!;
  const colorVar = variableRoles.color;
  
  // Aggregate data for categorical x-axis
  const aggregated = data.reduce((acc, item) => {
    const key = item[xVar];
    const colorKey = colorVar ? item[colorVar] : 'default';
    
    if (!acc[key]) {
      acc[key] = {};
    }
    if (!acc[key][colorKey]) {
      acc[key][colorKey] = { count: 0, sum: 0 };
    }
    acc[key][colorKey].count += 1;
    acc[key][colorKey].sum += parseFloat(item[yVar]) || 0;
    return acc;
  }, {});

  const categories = Object.keys(aggregated);
  
  if (colorVar) {
    // Get unique color values
    const colorValues = [...new Set(data.map(item => item[colorVar]))];
    
    const series = colorValues.map((colorValue, colorIndex) => ({
      name: colorValue,
      type: 'bar',
      data: categories.map(category => {
        const categoryData = aggregated[category][colorValue];
        if (!categoryData) return 0;
        return !variableRoles.yAxis ? categoryData.count : categoryData.sum / categoryData.count;
      }),
      itemStyle: {
        color: colors[colorIndex % colors.length]
      }
    }));

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: categories,
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series,
      legend: {
        top: 30
      },
      tooltip: {
        trigger: 'axis'
      }
    };
  } else {
    // Original single-color bar chart logic
    const values = categories.map(key => {
      const categoryData = Object.values(aggregated[key] as any)[0] as any;
      return !variableRoles.yAxis ? categoryData.count : categoryData.sum / categoryData.count;
    });

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: categories,
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series: [{
        data: values,
        type: 'bar',
        itemStyle: {
          color: colors[0]
        }
      }],
      tooltip: {
        trigger: 'axis'
      }
    };
  }
};

const generateLineChart = (data: any[], variableRoles: VariableRoles, config: any, colors: string[], baseOption: any) => {
  const xVar = variableRoles.xAxis!;
  const yVar = variableRoles.yAxis!;
  const groupByVar = variableRoles.groupBy;
  const sortedData = [...data].sort((a, b) => a[xVar] - b[xVar]);
  
  const series = [];
  
  if (groupByVar) {
    // Group data by the groupBy variable and create separate lines
    const groupValues = [...new Set(data.map(item => item[groupByVar]))];
    
    groupValues.forEach((groupValue, index) => {
      const filteredData = sortedData.filter(item => item[groupByVar] === groupValue);
      series.push({
        name: `${yVar} (${groupValue})`,
        data: filteredData.map(item => [item[xVar], item[yVar]]),
        type: 'line',
        itemStyle: {
          color: colors[index % colors.length]
        }
      });
    });
  } else {
    // Single line: Y vs X
    series.push({
      name: yVar,
      data: sortedData.map(item => [item[xVar], item[yVar]]),
      type: 'line',
      itemStyle: {
        color: colors[0]
      }
    });
  }

  return {
    ...baseOption,
    xAxis: {
      type: 'value',
      name: config.xAxisLabel,
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: config.yAxisLabel,
      nameLocation: 'middle',
      nameGap: 50
    },
    series,
    legend: series.length > 1 ? { top: 30 } : undefined,
    tooltip: {
      trigger: 'axis'
    }
  };
};

const generateScatterChart = (data: any[], variableRoles: VariableRoles, config: any, colors: string[], baseOption: any, showRegression: boolean) => {
  const xVar = variableRoles.xAxis!;
  const yVar = variableRoles.yAxis!;
  const colorVar = variableRoles.color;
  const sizeVar = variableRoles.size;
  
  if (colorVar) {
    // Group data by color variable
    const colorValues = [...new Set(data.map(item => item[colorVar]))];
    
    const series = colorValues.map((colorValue, colorIndex) => {
      const filteredData = data.filter(item => item[colorVar] === colorValue);
      const scatterData = filteredData.map(item => {
        const point = [item[xVar], item[yVar]];
        if (sizeVar) {
          point.push(item[sizeVar]);
        }
        return point;
      });
      
      return {
        name: colorValue,
        data: scatterData,
        type: 'scatter',
        itemStyle: {
          color: colors[colorIndex % colors.length]
        }
      };
    });

    return {
      ...baseOption,
      xAxis: {
        type: 'value',
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series,
      legend: {
        top: 30
      },
      tooltip: {
        trigger: 'item'
      }
    };
  } else {
    // Original single-color scatter chart logic
    const scatterData = data.map(item => {
      const point = [item[xVar], item[yVar]];
      if (sizeVar) {
        point.push(item[sizeVar]);
      }
      return point;
    });
    
    const series = [{
      data: scatterData,
      type: 'scatter',
      itemStyle: {
        color: colors[0]
      }
    }];

    // Show trend line for regression charts by default, or when explicitly enabled
    if (showRegression || config.showTrendLine) {
      const xValues = data.map(item => parseFloat(item[xVar]));
      const yValues = data.map(item => parseFloat(item[yVar]));
      const regression = calculateRegression(xValues, yValues);
      
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      const lineData = [
        [minX, regression.slope * minX + regression.intercept],
        [maxX, regression.slope * maxX + regression.intercept]
      ];

      series.push({
        data: lineData,
        type: 'line',
        smooth: false,
        name: `Trend Line (R² = ${regression.r2.toFixed(3)})`,
        itemStyle: {
          color: colors[1] || colors[0]
        },
        lineStyle: {
          type: 'dashed'
        },
        symbol: 'none'
      } as any);
    }

    return {
      ...baseOption,
      xAxis: {
        type: 'value',
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series,
      legend: showRegression || config.showTrendLine ? { top: 30 } : undefined,
      tooltip: {
        trigger: 'item'
      }
    };
  }
};

const generateHistogram = (data: any[], variable: string, config: any, colors: string[], baseOption: any) => {
  const values = data.map(item => parseFloat(item[variable])).filter(val => !isNaN(val));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const bins = 20;
  const binSize = (max - min) / bins;
  
  const histogram = new Array(bins).fill(0);
  const binLabels = [];
  
  for (let i = 0; i < bins; i++) {
    const binStart = min + i * binSize;
    const binEnd = min + (i + 1) * binSize;
    binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
    
    values.forEach(value => {
      if (value >= binStart && (value < binEnd || (i === bins - 1 && value === binEnd))) {
        histogram[i]++;
      }
    });
  }

  return {
    ...baseOption,
    xAxis: {
      type: 'category',
      data: binLabels,
      name: config.xAxisLabel,
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: 'Frequency',
      nameLocation: 'middle',
      nameGap: 50
    },
    series: [{
      data: histogram,
      type: 'bar',
      itemStyle: {
        color: colors[0]
      }
    }],
    tooltip: {
      trigger: 'axis'
    }
  };
};

const generateBoxPlot = (data: any[], variableRoles: VariableRoles, config: any, colors: string[], baseOption: any) => {
  const variable = variableRoles.xAxis!;
  const colorVar = variableRoles.color;
  
  if (colorVar) {
    // Group by color variable
    const colorValues = [...new Set(data.map(item => item[colorVar]))];
    const boxData = colorValues.map(colorValue => {
      const filteredData = data.filter(item => item[colorVar] === colorValue);
      const values = filteredData.map(item => parseFloat(item[variable])).filter(val => !isNaN(val)).sort((a, b) => a - b);
      const q1 = values[Math.floor(values.length * 0.25)];
      const median = values[Math.floor(values.length * 0.5)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const min = values[0];
      const max = values[values.length - 1];
      
      return [min, q1, median, q3, max];
    });

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: colorValues,
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series: [{
        data: boxData,
        type: 'boxplot',
        itemStyle: {
          color: colors[0]
        }
      }],
      tooltip: {
        trigger: 'item'
      }
    };
  } else {
    // Single box plot
    const values = data.map(item => parseFloat(item[variable])).filter(val => !isNaN(val)).sort((a, b) => a - b);
    const q1 = values[Math.floor(values.length * 0.25)];
    const median = values[Math.floor(values.length * 0.5)];
    const q3 = values[Math.floor(values.length * 0.75)];
    const min = values[0];
    const max = values[values.length - 1];
    
    const boxData = [[min, q1, median, q3, max]];

    return {
      ...baseOption,
      xAxis: {
        type: 'category',
        data: [variable],
        name: config.xAxisLabel,
        nameLocation: 'middle',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: config.yAxisLabel,
        nameLocation: 'middle',
        nameGap: 50
      },
      series: [{
        data: boxData,
        type: 'boxplot',
        itemStyle: {
          color: colors[0]
        }
      }],
      tooltip: {
        trigger: 'item'
      }
    };
  }
};

const generateCorrelationMatrix = (data: any[], variableRoles: VariableRoles, config: any, colors: string[], baseOption: any) => {
  // For correlation, we need to get all continuous variables or use series if specified
  const variables = variableRoles.series ? [variableRoles.series] : Object.values(variableRoles).filter(Boolean) as string[];
  const correlationData = [];
  
  for (let i = 0; i < variables.length; i++) {
    for (let j = 0; j < variables.length; j++) {
      const xValues = data.map(item => parseFloat(item[variables[i]])).filter(val => !isNaN(val));
      const yValues = data.map(item => parseFloat(item[variables[j]])).filter(val => !isNaN(val));
      const correlation = i === j ? 1 : calculateCorrelation(xValues, yValues);
      
      correlationData.push([i, j, correlation]);
    }
  }

  return {
    ...baseOption,
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
      bottom: '5%',
      inRange: {
        color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
      }
    },
    series: [{
      type: 'heatmap',
      data: correlationData,
      label: {
        show: true,
        formatter: (params: any) => params.data[2].toFixed(2)
      }
    }],
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        return `${variables[params.data[0]]} vs ${variables[params.data[1]]}<br/>Correlation: ${params.data[2].toFixed(3)}`;
      }
    }
  };
};

const generatePieChart = (data: any[], variable: string, config: any, colors: string[], baseOption: any) => {
  const counts = data.reduce((acc, item) => {
    const key = item[variable];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return {
    ...baseOption,
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [{
      name: variable,
      type: 'pie',
      radius: '50%',
      data: pieData,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      itemStyle: {
        color: (params: any) => colors[params.dataIndex % colors.length]
      }
    }]
  };
};
