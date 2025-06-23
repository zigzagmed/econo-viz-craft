
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTypeSelector } from './ChartTypeSelector';
import { BarChart, ChevronDown, ChevronUp, LineChart, PieChart, ScatterChart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChartTypeSelectionCardProps {
  chartType: string;
  onTypeChange: (type: string) => void;
}

export const ChartTypeSelectionCard: React.FC<ChartTypeSelectionCardProps> = ({
  chartType,
  onTypeChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse when a chart type is selected
  useEffect(() => {
    if (chartType) {
      setIsCollapsed(true);
    }
  }, [chartType]);

  const getChartTypeInfo = (type: string) => {
    const chartTypes = {
      bar: { name: 'Bar Chart', icon: BarChart, description: 'Compare categories or values' },
      line: { name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
      pie: { name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
      scatter: { name: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships between variables' },
      histogram: { name: 'Histogram', icon: BarChart, description: 'Show distribution' },
      boxplot: { name: 'Box Plot', icon: BarChart, description: 'Show quartiles and outliers' },
      correlation: { name: 'Correlation Matrix', icon: BarChart, description: 'Variable correlations' },
    };
    return chartTypes[type] || { name: type, icon: BarChart, description: '' };
  };

  const handleSelectedTypeClick = () => {
    setIsCollapsed(false);
  };

  const handleTypeChange = (type: string) => {
    onTypeChange(type);
    // Will auto-collapse due to useEffect
  };

  const selectedTypeInfo = chartType ? getChartTypeInfo(chartType) : null;
  const SelectedIcon = selectedTypeInfo?.icon || BarChart;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Step 1: Choose Chart Type
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1"
          >
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isCollapsed && chartType ? (
          // Show selected chart type as a blue clickable box
          <Button
            variant="outline"
            className="w-full h-auto p-4 flex items-center gap-3 justify-start bg-blue-50 border-blue-200 hover:bg-blue-100"
            onClick={handleSelectedTypeClick}
          >
            <SelectedIcon className="w-5 h-5 flex-shrink-0 text-blue-600" />
            <div className="flex-1 text-left">
              <div className="font-medium text-blue-900">{selectedTypeInfo?.name}</div>
              <div className="text-xs text-blue-700 mt-1">{selectedTypeInfo?.description}</div>
            </div>
          </Button>
        ) : (
          // Show all chart type options
          <ChartTypeSelector
            selectedType={chartType}
            onTypeChange={handleTypeChange}
            selectedVariables={[]}
          />
        )}
      </CardContent>
    </Card>
  );
};
