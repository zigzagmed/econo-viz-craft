
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
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Initialize chart when ref is available
  useEffect(() => {
    const initChart = () => {
      if (chartRef.current && !chartInstanceRef.current) {
        console.log('Initializing ECharts instance...');
        try {
          const chart = echarts.init(chartRef.current, null, {
            width: chartRef.current.offsetWidth,
            height: 500
          });
          chartInstanceRef.current = chart;
          console.log('ECharts instance created successfully');

          const handleResize = () => {
            if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
              chartInstanceRef.current.resize();
            }
          };

          window.addEventListener('resize', handleResize);
          
          // Cleanup function
          return () => {
            window.removeEventListener('resize', handleResize);
          };
        } catch (error) {
          console.error('Failed to initialize ECharts:', error);
        }
      }
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(initChart, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Update chart when data changes
  useEffect(() => {
    console.log('Chart update effect triggered:', {
      hasChartInstance: !!chartInstanceRef.current,
      selectedVariables,
      chartType,
      variableCount: selectedVariables.length
    });
    
    if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed() && 
        selectedVariables.length > 0 && chartType) {
      updateChart();
    }
  }, [selectedVariables, chartType, chartConfig]);

  const updateChart = () => {
    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed() || 
        selectedVariables.length === 0 || !chartType) {
      console.log('Cannot update chart - missing requirements');
      return;
    }

    console.log('Updating chart with:', { selectedVariables, chartType });
    
    try {
      const data = getVariableData(selectedDataset, selectedVariables);
      console.log('Retrieved data:', data?.slice(0, 3));
      
      if (!data || data.length === 0) {
        console.log('No data available for chart');
        return;
      }
      
      const stats = calculateStatistics(data, selectedVariables);
      console.log('Calculated stats:', stats);
      
      const option = generateChartConfig(chartType, data, selectedVariables, chartConfig, stats);
      console.log('Generated chart config:', option);
      
      chartInstanceRef.current.setOption(option, true);
      chartInstanceRef.current.resize();
      console.log('Chart updated successfully');
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  const handleExportChart = (format: 'png' | 'svg') => {
    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed()) return;

    const url = chartInstanceRef.current.getDataURL({
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        console.log('Disposing ECharts instance');
        chartInstanceRef.current.dispose();
        chartInstanceRef.current = null;
      }
    };
  }, []);

  return { chartRef, chartInstance: chartInstanceRef.current, handleExportChart };
};
