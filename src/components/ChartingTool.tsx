
import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DatasetSelector } from './charting/DatasetSelector';
import { VariableSelector } from './charting/VariableSelector';
import { ChartTypeSelector } from './charting/ChartTypeSelector';
import { ChartCustomization } from './charting/ChartCustomization';
import { StatisticalOverlay } from './charting/StatisticalOverlay';
import { useChartingData } from '../hooks/useChartingData';
import { calculateStatistics } from '../utils/statisticalUtils';
import { generateChartConfig } from '../utils/chartUtils';
import { BarChart, LineChart, PieChart, Download } from 'lucide-react';

export const ChartingTool = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const [chartConfig, setChartConfig] = useState({
    title: 'Economic Data Visualization',
    xAxisLabel: 'X Axis',
    yAxisLabel: 'Y Axis',
    colorScheme: 'academic',
    showStats: true,
    showTrendLine: false
  });

  const { datasets, currentData, getVariableData, getDatasetInfo } = useChartingData();

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

  useEffect(() => {
    if (chartInstance && selectedDataset && selectedVariables.length > 0) {
      updateChart();
    }
  }, [chartInstance, selectedDataset, selectedVariables, chartType, chartConfig]);

  const updateChart = () => {
    if (!chartInstance || !selectedDataset || selectedVariables.length === 0) return;

    const data = getVariableData(selectedDataset, selectedVariables);
    const stats = calculateStatistics(data, selectedVariables);
    const option = generateChartConfig(chartType, data, selectedVariables, chartConfig, stats);
    
    chartInstance.setOption(option, true);
  };

  const handleExportChart = (format: 'png' | 'pdf' | 'svg') => {
    if (!chartInstance) return;

    const url = chartInstance.getDataURL({
      type: format === 'pdf' ? 'png' : format,
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Econometrics Charting Tool</h1>
          <p className="text-gray-600">Create publication-ready statistical visualizations with interactive data analysis</p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Data Selection */}
          <div className="col-span-3 space-y-4">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Data Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatasetSelector
                  datasets={datasets}
                  selectedDataset={selectedDataset}
                  onDatasetChange={setSelectedDataset}
                />
                
                <Separator />
                
                <VariableSelector
                  dataset={selectedDataset}
                  selectedVariables={selectedVariables}
                  onVariablesChange={setSelectedVariables}
                  getDatasetInfo={getDatasetInfo}
                />

                {selectedDataset && selectedVariables.length > 0 && (
                  <>
                    <Separator />
                    <StatisticalOverlay
                      dataset={selectedDataset}
                      variables={selectedVariables}
                      getVariableData={getVariableData}
                    />
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Chart Display */}
          <div className="col-span-6">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Chart Visualization
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportChart('png')}
                      disabled={!chartInstance || selectedVariables.length === 0}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportChart('svg')}
                      disabled={!chartInstance || selectedVariables.length === 0}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      SVG
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartTypeSelector
                  selectedType={chartType}
                  onTypeChange={setChartType}
                  selectedVariables={selectedVariables}
                />
                
                <div 
                  ref={chartRef} 
                  className="w-full h-96 mt-4 border border-gray-200 rounded-lg bg-white"
                  style={{ height: 'calc(100% - 100px)' }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Customization */}
          <div className="col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Customization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartCustomization
                  config={chartConfig}
                  onConfigChange={setChartConfig}
                  chartType={chartType}
                  selectedVariables={selectedVariables}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
