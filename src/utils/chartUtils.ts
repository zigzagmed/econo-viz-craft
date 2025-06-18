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

export const generateChartStatistics = (
  chartType: string,
  data: any[],
  variableRoles: VariableRoles,
  chartConfig: any
): Record<string, any> => {
  const stats: Record<string, any> = {};

  switch (chartType) {
    case 'scatter':
    case 'regression':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const xValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        
        stats['Sample Size'] = { value: Math.min(xValues.length, yValues.length) };
        stats['Correlation'] = { value: calculateCorrelation(xValues, yValues) };
        
        if (chartType === 'regression') {
          const correlation = calculateCorrelation(xValues, yValues);
          stats['R-squared'] = { value: correlation * correlation };
        }
      }
      break;

    case 'histogram':
      if (variableRoles.xAxis) {
        const histValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null);
        const histMin = Math.min(...histValues);
        const histMax = Math.max(...histValues);
        const mean = histValues.reduce((sum, val) => sum + val, 0) / histValues.length;
        const variance = histValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / histValues.length;
        
        stats['Sample Size'] = { value: histValues.length };
        stats['Mean'] = { value: mean };
        stats['Std Deviation'] = { value: Math.sqrt(variance) };
        stats['Min Value'] = { value: histMin };
        stats['Max Value'] = { value: histMax };
        stats['Number of Bins'] = { value: chartConfig.histogramBins || 10 };
      }
      break;

    case 'bar':
      if (variableRoles.xAxis) {
        const categories = [...new Set(data.map(d => d[variableRoles.xAxis!]))];
        const totalCount = data.length;
        
        stats['Total Records'] = { value: totalCount };
        stats['Categories'] = { value: categories.length };
        stats['Most Frequent'] = { 
          value: categories.reduce((max, cat) => {
            const count = data.filter(d => d[variableRoles.xAxis!] === cat).length;
            return count > (data.filter(d => d[variableRoles.xAxis!] === max).length || 0) ? cat : max;
          }, categories[0])
        };
      }
      break;

    case 'pie':
      if (variableRoles.xAxis) {
        const pieData = data.reduce((acc, item) => {
          const key = item[variableRoles.xAxis!];
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const categories = Object.keys(pieData);
        const maxCategory = categories.reduce((max, cat) => 
          pieData[cat] > pieData[max] ? cat : max, categories[0]);
        
        stats['Total Records'] = { value: data.length };
        stats['Categories'] = { value: categories.length };
        stats['Largest Segment'] = { value: maxCategory };
        stats['Largest %'] = { value: (pieData[maxCategory] / data.length) * 100 };
      }
      break;

    case 'boxplot':
      if (variableRoles.xAxis) {
        const boxplotValues = data.map(d => d[variableRoles.xAxis!]).filter(v => v != null).sort((a, b) => a - b);
        const q1 = boxplotValues[Math.floor(boxplotValues.length * 0.25)];
        const median = boxplotValues[Math.floor(boxplotValues.length * 0.5)];
        const q3 = boxplotValues[Math.floor(boxplotValues.length * 0.75)];
        const iqr = q3 - q1;
        
        stats['Sample Size'] = { value: boxplotValues.length };
        stats['Median'] = { value: median };
        stats['Q1'] = { value: q1 };
        stats['Q3'] = { value: q3 };
        stats['IQR'] = { value: iqr };
        stats['Min Value'] = { value: boxplotValues[0] };
        stats['Max Value'] = { value: boxplotValues[boxplotValues.length - 1] };
      }
      break;

    case 'line':
      if (variableRoles.xAxis && variableRoles.yAxis) {
        const yValues = data.map(d => d[variableRoles.yAxis!]).filter(v => v != null);
        const trend = yValues.length > 1 ? 
          (yValues[yValues.length - 1] - yValues[0]) / (yValues.length - 1) : 0;
        
        stats['Data Points'] = { value: yValues.length };
        stats['Max Value'] = { value: Math.max(...yValues) };
        stats['Min Value'] = { value: Math.min(...yValues) };
        stats['Average Trend'] = { value: trend };
      }
      break;

    case 'correlation':
      if (variableRoles.variables && variableRoles.variables.length >= 2) {
        const variables = variableRoles.variables;
        let maxCorr = -1;
        let minCorr = 1;
        let maxPair = '';
        let minPair = '';
        
        for (let i = 0; i < variables.length; i++) {
          for (let j = i + 1; j < variables.length; j++) {
            const values1 = data.map(d => d[variables[i]]).filter(v => v != null);
            const values2 = data.map(d => d[variables[j]]).filter(v => v != null);
            const corr = calculateCorrelation(values1, values2);
            
            if (Math.abs(corr) > Math.abs(maxCorr)) {
              maxCorr = corr;
              maxPair = `${variables[i]} - ${variables[j]}`;
            }
            if (Math.abs(corr) < Math.abs(minCorr)) {
              minCorr = corr;
              minPair = `${variables[i]} - ${variables[j]}`;
            }
          }
        }
        
        stats['Variables'] = { value: variables.length };
        stats['Strongest Correlation'] = { value: maxCorr };
        stats['Strongest Pair'] = { value: maxPair };
        stats['Weakest Correlation'] = { value: minCorr };
        stats['Weakest Pair'] = { value: minPair };
      }
      break;

    default:
      stats['Total Records'] = { value: data.length };
      break;
  }

  return stats;
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
      const barValues = categories.map(cat => barData[cat].length);

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
          data: barValues,
          itemStyle: { color: colors[0] }
        }]
      };

    case 'histogram':
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
