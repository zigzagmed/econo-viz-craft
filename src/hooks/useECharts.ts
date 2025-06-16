
import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateStatistics } from '../utils/statisticalUtils';
import { generateChartConfig } from '../utils/chartUtils';

export const useECharts = (
  selectedDataset: string,
  selectedVariables: string[],
  chartType: string,
  chartConfig: any,
  getVariableData: (dataset: string, variables: string[]) => any
) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstance) {
      console.log('Initializing chart...');
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);
      console.log('Chart instance created:', chart);

      const handleResize = () => {
        if (chart && !chart.isDisposed()) {
          chart.resize();
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chart && !chart.isDisposed()) {
          chart.dispose();
        }
      };
    }
  }, [chartRef.current]);

  // Update chart when data changes
  useEffect(() => {
    console.log('Chart update effect triggered:', {
      hasChartInstance: !!chartInstance,
      selectedVariables,
      chartType,
      variableCount: selectedVariables.length
    });
    
    if (chartInstance && !chartInstance.isDisposed() && selectedVariables.length > 0) {
      updateChart();
    }
  }, [chartInstance, selectedVariables, chartType, chartConfig]);

  const updateChart = () => {
    if (!chartInstance || chartInstance.isDisposed() || selectedVariables.length === 0) {
      console.log('Cannot update chart:', {
        hasChartInstance: !!chartInstance,
        isDisposed: chartInstance?.isDisposed(),
        variableCount: selectedVariables.length
      });
      return;
    }

    console.log('Updating chart with:', { selectedVariables, chartType });
    
    try {
      const data = getVariableData(selectedDataset, selectedVariables);
      console.log('Retrieved data:', data.slice(0, 3)); // Log first 3 rows
      
      const stats = calculateStatistics(data, selectedVariables);
      console.log('Calculated stats:', stats);
      
      const option = generateChartConfig(chartType, data, selectedVariables, chartConfig, stats);
      console.log('Generated chart config:', option);
      
      chartInstance.setOption(option, true);
      console.log('Chart updated successfully');
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  const handleExportChart = (format: 'png' | 'svg') => {
    if (!chartInstance || chartInstance.isDisposed()) return;

    const url = chartInstance.getDataURL({
      type: format,
      pixelRatio: 2,
      backgroundColor: '#fff'
    });

    const link = document.createElement('a');
    link.download = `chart.${format}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { chartRef, chartInstance, handleExportChart };
};
