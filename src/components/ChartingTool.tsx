import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VariableSelector } from './charting/VariableSelector';
import { SmartChartTypeSelector } from './charting/SmartChartTypeSelector';
import { ChartCustomization } from './charting/ChartCustomization';
import { StatisticalOverlay } from './charting/StatisticalOverlay';
import { useChartingData } from '../hooks/useChartingData';
import { calculateStatistics } from '../utils/statisticalUtils';
import { generateChartConfig } from '../utils/chartUtils';
import { BarChart, Settings, Download, Database, Info } from 'lucide-react';

export const ChartingTool = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const selectedDataset = 'gdp_growth'; // Default to GDP growth dataset
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    title: '',
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: 'academic',
    showStats: true,
    showTrendLine: false
  });

  const { getVariableData, getDatasetInfo } = useChartingData();

  // Update chart config when variables change
  useEffect(() => {
    if (selectedVariables.length > 0) {
      const newConfig = generateDynamicConfig(selectedVariables, chartType);
      setChartConfig(prev => ({
        ...prev,
        ...newConfig
      }));
    }
  }, [selectedVariables, chartType]);

  const generateDynamicConfig = (variables: string[], type: string) => {
    let title = '';
    let xAxisLabel = '';
    let yAxisLabel = '';

    if (variables.length === 1) {
      const variable = variables[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      switch (type) {
        case 'histogram':
          title = `Distribution of ${variable}`;
          xAxisLabel = variable;
          yAxisLabel = 'Frequency';
          break;
        case 'boxplot':
          title = `${variable} Distribution`;
          xAxisLabel = 'Variable';
          yAxisLabel = variable;
          break;
        case 'pie':
          title = `${variable} Breakdown`;
          break;
        default:
          title = `${variable} Analysis`;
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
          title = `${var2} by ${var1}`;
          xAxisLabel = var1;
          yAxisLabel = var2;
          break;
        default:
          title = `${var1} and ${var2} Comparison`;
          xAxisLabel = var1;
          yAxisLabel = var2;
      }
    } else {
      const varNames = variables.map(v => v.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
      
      switch (type) {
        case 'correlation':
          title = `Correlation Matrix: ${varNames.join(', ')}`;
          break;
        case 'line':
          title = `Trends: ${varNames.join(', ')}`;
          xAxisLabel = varNames[0];
          yAxisLabel = 'Values';
          break;
        default:
          title = `Multi-Variable Analysis: ${varNames.join(', ')}`;
          xAxisLabel = 'Variables';
          yAxisLabel = 'Values';
      }
    }

    return { title, xAxisLabel, yAxisLabel };
  };

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);
      console.log('Chart instance initialized');

      const handleResize = () => {
        chart.resize();
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.dispose();
      };
    }
  }, []);

  // Update chart when data changes
  useEffect(() => {
    console.log('Chart update effect triggered:', {
      hasChartInstance: !!chartInstance,
      selectedVariables,
      chartType,
      variableCount: selectedVariables.length
    });
    
    if (chartInstance && selectedVariables.length > 0) {
      updateChart();
    }
  }, [chartInstance, selectedVariables, chartType, chartConfig]);

  const updateChart = () => {
    if (!chartInstance || selectedVariables.length === 0) {
      console.log('Cannot update chart:', {
        hasChartInstance: !!chartInstance,
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
    if (!chartInstance) return;

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

  const getVariableType = (variableName: string) => {
    const datasetInfo = getDatasetInfo(selectedDataset);
    const variable = datasetInfo?.variables.find(v => v.name === variableName);
    return variable?.type || 'continuous';
  };

  const getCurrentVariables = () => {
    const datasetInfo = getDatasetInfo(selectedDataset);
    return datasetInfo?.variables || [];
  };

  const canShowChart = selectedVariables.length > 0;
  console.log('Can show chart:', canShowChart, 'Variables:', selectedVariables);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GDP Growth Data Visualization</h1>
          <p className="text-gray-600">Explore quarterly GDP growth data with economic indicators</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Data Setup */}
          <div className="col-span-4 space-y-4">
            {/* Step 1: Variables */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Step 1: Select Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VariableSelector
                  dataset={selectedDataset}
                  selectedVariables={selectedVariables}
                  onVariablesChange={setSelectedVariables}
                  getDatasetInfo={getDatasetInfo}
                />
              </CardContent>
            </Card>

            {/* Step 2: Chart Type */}
            {selectedVariables.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Step 2: Choose Chart Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SmartChartTypeSelector
                    selectedType={chartType}
                    onTypeChange={setChartType}
                    selectedVariables={selectedVariables}
                    getVariableType={getVariableType}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Chart */}
          <div className="col-span-8">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {canShowChart ? chartConfig.title || 'Your Chart' : 'Your Chart'}
                  </CardTitle>
                  {canShowChart && (
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Info className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <StatisticalOverlay
                            dataset={selectedDataset}
                            variables={selectedVariables}
                            getVariableData={getVariableData}
                          />
                        </PopoverContent>
                      </Popover>

                      <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-1" />
                            Customize
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Customize Chart</DialogTitle>
                          </DialogHeader>
                          <ChartCustomization
                            config={chartConfig}
                            onConfigChange={setChartConfig}
                            chartType={chartType}
                            selectedVariables={selectedVariables}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportChart('png')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PNG
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportChart('svg')}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        SVG
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!canShowChart ? (
                  <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <BarChart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to visualize your data?</h3>
                      <p className="text-gray-600 mb-4">Select variables to create your first chart</p>
                      <ol className="text-sm text-gray-500 text-left space-y-1">
                        <li>1. Select one or more variables</li>
                        <li>2. Choose a chart type</li>
                        <li>3. Customize and export</li>
                      </ol>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={chartRef} 
                    className="w-full border border-gray-200 rounded-lg bg-white"
                    style={{ height: '500px', minHeight: '500px' }}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
