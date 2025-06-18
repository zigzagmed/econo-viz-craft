import * as echarts from 'echarts';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  groupBy?: string;
  bins?: string;
  variables?: string[];
}

const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

const getColorPalette = (scheme: string, customColors?: string[]): string[] => {
  switch (scheme) {
    case 'colorblind':
      return ['#377eb8', '#ff7f00', '#4daf4a', '#f781bf', '#a65628', '#984ea3', '#999999', '#e41a1c', '#dede00'];
    case 'grayscale':
      return ['#333333', '#777777', '#AAAAAA', '#DDDDDD'];
    case 'vibrant':
      return ['#FF5733', '#33FF57', '#3366FF', '#FF33CC', '#33FFFF'];
    case 'custom':
      return customColors || ['#2563eb', '#dc2626', '#16a34a'];
    default: // 'academic'
      return ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
  }
};

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

  // Common axis label configuration with custom distances
  const getAxisLabelConfig = (label: string, isVertical: boolean) => ({
    name: label,
    nameLocation: 'middle',
    nameGap: isVertical ? (chartConfig.yAxisLabelDistance || 50) : (chartConfig.xAxisLabelDistance || 30),
    nameTextStyle: {
      fontSize: 14,
      fontWeight: 'normal'
    }
  });

  switch (chartType) {
    case 'scatter':
    case 'regression':
      if (!variableRoles.xAxis || !variableRoles.yAxis) return {};
      
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

    case 'line':
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

    case 'bar':
      if (!variableRoles.xAxis) return {};
      
      const barData = data.reduce((acc, item) => {
        const key = item[variableRoles.xAxis!];
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {} as Record<string, any[]>);

      const categories = Object.keys(barData);
      const values = categories.map(cat => barData[cat].length);

      return {
        title: titleConfig,
        tooltip: { trigger: 'axis' },
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
          data: values,
          itemStyle: { color: colors[0] }
        }]
      };

    case 'histogram':
      if (!variableRoles.xAxis) return {};
      
      const values = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const binCount = chartConfig.histogramBins || 20;
      const binWidth = (max - min) / binCount;
      
      const bins = Array.from({ length: binCount }, (_, i) => ({
        start: min + i * binWidth,
        end: min + (i + 1) * binWidth,
        count: 0
      }));
      
      values.forEach(value => {
        const binIndex = Math.min(Math.floor((value - min) / binWidth), binCount - 1);
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

    case 'pie':
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

    case 'boxplot':
      if (!variableRoles.xAxis) return {};
      
      const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
      const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
      const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
      const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
      const min = boxplotValues[0];
      const max = boxplotValues[boxplotValues.length - 1];

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
          data: [[min, q1, median, q3, max]],
          itemStyle: { color: colors[0] }
        }]
      };

    case 'correlation':
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

    default:
      return {};
  }
};
