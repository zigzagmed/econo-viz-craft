import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { calculateStatistics } from '../utils/statisticalUtils';
import { generateChartConfig } from '../utils/chartUtils';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  series?: string;
}

export const useECharts = (
  selectedDataset: string,
  variableRoles: VariableRoles,
  chartType: string,
  chartConfig: any,
  getVariableData: (dataset: string, variables: string[]) => any
) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Initialize chart when container is available
  useEffect(() => {
    if (!chartRef.current) return;

    console.log('Initializing ECharts instance...');
    
    // Dispose existing instance if any
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
    }

    try {
      const chart = echarts.init(chartRef.current, null, {
        width: chartRef.current.offsetWidth || 800,
        height: 500
      });
      
      chartInstanceRef.current = chart;
      console.log('ECharts instance created successfully');

      // Handle window resize
      const handleResize = () => {
        if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
          chartInstanceRef.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error('Failed to initialize ECharts:', error);
    }
  }, [chartRef.current]);

  // Update chart when data or config changes
  useEffect(() => {
    console.log('Chart update effect triggered:', {
      hasChartInstance: !!chartInstanceRef.current,
      variableRoles,
      chartType,
      roleCount: Object.keys(variableRoles).filter(role => variableRoles[role as keyof VariableRoles]).length
    });
    
    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed()) {
      console.log('No chart instance available');
      return;
    }

    if (!chartType || !Object.keys(variableRoles).some(role => variableRoles[role as keyof VariableRoles])) {
      console.log('Missing chart type or variable roles');
      return;
    }

    updateChart();
  }, [variableRoles, chartType, chartConfig, selectedDataset]);

  const updateChart = () => {
    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed()) {
      console.log('Cannot update chart - no instance');
      return;
    }

    if (!Object.keys(variableRoles).some(role => variableRoles[role as keyof VariableRoles]) || !chartType) {
      console.log('Cannot update chart - missing requirements');
      return;
    }

    console.log('Updating chart with roles:', variableRoles);
    
    try {
      // Get all variables from roles (excluding undefined values)
      const allVariables = Object.values(variableRoles).filter(Boolean) as string[];
      
      console.log('Fetching data for variables:', allVariables);
      const data = getVariableData(selectedDataset, allVariables);
      console.log('Retrieved data sample:', data?.slice(0, 3));
      
      if (!data || data.length === 0) {
        console.log('No data available for chart');
        // Show empty chart message
        chartInstanceRef.current.setOption({
          title: {
            text: 'No data available',
            left: 'center',
            top: 'middle',
            textStyle: {
              fontSize: 16,
              color: '#999'
            }
          }
        });
        return;
      }
      
      const stats = calculateStatistics(data, allVariables);
      console.log('Calculated stats:', stats);
      
      const option = generateChartConfig(chartType, data, variableRoles, chartConfig, stats);
      console.log('Generated chart config:', option);
      
      chartInstanceRef.current.setOption(option, true);
      chartInstanceRef.current.resize();
      console.log('Chart updated successfully');
    } catch (error) {
      console.error('Error updating chart:', error);
      
      // Show error message in chart
      if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
        chartInstanceRef.current.setOption({
          title: {
            text: 'Error loading chart',
            left: 'center',
            top: 'middle',
            textStyle: {
              fontSize: 16,
              color: '#ef4444'
            }
          }
        });
      }
    }
  };

  const handleExportChart = (format: 'png' | 'svg') => {
    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed()) {
      console.log('Cannot export - no chart instance');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error exporting chart:', error);
    }
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

  return { 
    chartRef, 
    chartInstance: chartInstanceRef.current, 
    handleExportChart 
  };
};
