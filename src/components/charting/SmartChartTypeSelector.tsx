
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart, ScatterChart } from 'lucide-react';

interface SmartChartTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  xAxis: string;
  yAxis: string;
  getVariableType: (variable: string) => string;
}

export const SmartChartTypeSelector: React.FC<SmartChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  xAxis,
  yAxis,
  getVariableType
}) => {
  const getRecommendedCharts = () => {
    if (!xAxis) return [];

    const xType = getVariableType(xAxis);
    const yType = yAxis ? getVariableType(yAxis) : null;

    const charts = [];

    // Single variable charts
    if (!yAxis) {
      if (xType === 'categorical' || xType === 'binary') {
        charts.push({
          id: 'pie',
          name: 'Pie Chart',
          icon: PieChart,
          description: `Show distribution of ${xAxis}`,
          recommended: true
        });
      }
      return charts;
    }

    // Two variable charts
    if (xType === 'categorical' && yType === 'continuous') {
      charts.push({
        id: 'bar',
        name: 'Bar Chart',
        icon: BarChart,
        description: `Compare ${yAxis} across ${xAxis} categories`,
        recommended: true
      });
    }

    if (xType === 'continuous' && yType === 'continuous') {
      charts.push({
        id: 'scatter',
        name: 'Scatter Plot',
        icon: ScatterChart,
        description: `See relationship between ${xAxis} and ${yAxis}`,
        recommended: true
      });
      charts.push({
        id: 'regression',
        name: 'Regression Plot',
        icon: ScatterChart,
        description: `${xAxis} vs ${yAxis} with trend line`,
        recommended: true
      });
    }

    if (xType === 'continuous') {
      charts.push({
        id: 'line',
        name: 'Line Chart',
        icon: LineChart,
        description: `Show ${yAxis} trend over ${xAxis}`,
        recommended: xType === 'continuous' && yType === 'continuous'
      });
    }

    // Always available options
    const allCharts = [
      { id: 'bar', name: 'Bar Chart', icon: BarChart, description: 'Compare categories' },
      { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships' },
      { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends' },
      { id: 'regression', name: 'Regression Plot', icon: ScatterChart, description: 'Relationship with trend' }
    ];

    // Add non-recommended charts
    allCharts.forEach(chart => {
      if (!charts.find(c => c.id === chart.id)) {
        charts.push({ ...chart, recommended: false });
      }
    });

    return charts;
  };

  const charts = getRecommendedCharts();

  if (!xAxis) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ScatterChart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Select variables to see chart options</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-900 mb-1">Choose Chart Type</h3>
        <p className="text-sm text-gray-600">Recommended options for your data</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {charts.map((chart) => {
          const Icon = chart.icon;
          const isSelected = selectedType === chart.id;
          
          return (
            <Button
              key={chart.id}
              variant={isSelected ? "default" : "outline"}
              className={`h-auto p-4 flex items-center gap-3 justify-start ${
                chart.recommended ? 'border-blue-200 bg-blue-50' : ''
              }`}
              onClick={() => onTypeChange(chart.id)}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{chart.name}</span>
                  {chart.recommended && (
                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600">{chart.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
