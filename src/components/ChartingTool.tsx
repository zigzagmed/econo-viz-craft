
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatasetSelector } from './charting/DatasetSelector';
import { AxisSelector } from './charting/AxisSelector';
import { SmartChartTypeSelector } from './charting/SmartChartTypeSelector';
import { ChartCustomization } from './charting/ChartCustomization';
import { StatisticalOverlay } from './charting/StatisticalOverlay';
import { useChartingData } from '../hooks/useChartingData';
import { calculateStatistics } from '../utils/statisticalUtils';
import { generateChartConfig } from '../utils/chartUtils';
import { BarChart, Settings, Download, Database } from 'lucide-react';

export const ChartingTool = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [chartType, setChartType] = useState<string>('bar');
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [chartConfig, setChartConfig] = useState({
    title: 'Data Visualization',
    xAxisLabel: '',
    yAxisLabel: '',
    colorScheme: 'academic',
    showStats: true,
    showTrendLine: false
  });

  const { datasets, getVariableData, getDatasetInfo } = useChartingData();

  // Auto-update axis labels when variables change
  useEffect(() => {
    setChartConfig(prev => ({
      ...prev,
      xAxisLabel: xAxis || 'X Axis',
      yAxisLabel: yAxis || 'Y Axis'
    }));
  }, [xAxis, yAxis]);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      setChartInstance(chart);

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
    if (chartInstance && selectedDataset && (xAxis || yAxis)) {
      updateChart();
    }
  }, [chartInstance, selectedDataset, xAxis, yAxis, chartType, chartConfig]);

  const updateChart = () => {
    if (!chartInstance || !selectedDataset) return;
    
    const variables = [xAxis, yAxis].filter(Boolean);
    if (variables.length === 0) return;

    const data = getVariableData(selectedDataset, variables);
    const stats = calculateStatistics(data, variables);
    const option = generateChartConfig(chartType, data, variables, chartConfig, stats);
    
    chartInstance.setOption(option, true);
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
    if (!selectedDataset) return 'continuous';
    const datasetInfo = getDatasetInfo(selectedDataset);
    const variable = datasetInfo?.variables.find(v => v.name === variableName);
    return variable?.type || 'continuous';
  };

  const getCurrentVariables = () => {
    if (!selectedDataset) return [];
    const datasetInfo = getDatasetInfo(selectedDataset);
    return datasetInfo?.variables || [];
  };

  const canShowChart = selectedDataset && (xAxis || yAxis);
  const selectedVariables = [xAxis, yAxis].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Visualization Tool</h1>
          <p className="text-gray-600">Create charts to explore and understand your data</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Data Setup */}
          <div className="col-span-4 space-y-4">
            {/* Step 1: Dataset */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Step 1: Choose Dataset
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DatasetSelector
                  datasets={datasets}
                  selectedDataset={selectedDataset}
                  onDatasetChange={(dataset) => {
                    setSelectedDataset(dataset);
                    setXAxis('');
                    setYAxis('');
                  }}
                />
              </CardContent>
            </Card>

            {/* Step 2: Variables */}
            {selectedDataset && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart className="w-5 h-5" />
                    Step 2: Select Variables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AxisSelector
                    variables={getCurrentVariables()}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    onXAxisChange={setXAxis}
                    onYAxisChange={setYAxis}
                    chartType={chartType}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 3: Chart Type */}
            {(xAxis || yAxis) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Step 3: Chart Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <SmartChartTypeSelector
                    selectedType={chartType}
                    onTypeChange={setChartType}
                    xAxis={xAxis}
                    yAxis={yAxis}
                    getVariableType={getVariableType}
                  />
                </CardContent>
              </Card>
            )}

            {/* Statistics */}
            {canShowChart && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Quick Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <StatisticalOverlay
                    dataset={selectedDataset}
                    variables={selectedVariables}
                    getVariableData={getVariableData}
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
                  <CardTitle className="text-lg">Your Chart</CardTitle>
                  {canShowChart && (
                    <div className="flex gap-2">
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
                      <p className="text-gray-600 mb-4">Follow the steps on the left to create your first chart</p>
                      <ol className="text-sm text-gray-500 text-left space-y-1">
                        <li>1. Choose a dataset</li>
                        <li>2. Select variables for your axes</li>
                        <li>3. Pick a chart type</li>
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
