
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChart, ScatterChart, TrendingUp } from 'lucide-react';

interface SmartChartTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedVariables: string[];
  getVariableType: (variable: string) => string;
}

export const SmartChartTypeSelector: React.FC<SmartChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  selectedVariables,
  getVariableType
}) => {
  const getRecommendedCharts = () => {
    if (selectedVariables.length === 0) return [];

    const charts = [];
    const variableCount = selectedVariables.length;
    const variableTypes = selectedVariables.map(v => getVariableType(v));

    // Single variable charts
    if (variableCount === 1) {
      const type = variableTypes[0];
      
      if (type === 'categorical' || type === 'binary') {
        charts.push({
          id: 'pie',
          name: 'Pie Chart',
          icon: PieChart,
          description: `Show distribution of ${selectedVariables[0]}`,
          recommended: true
        });
        charts.push({
          id: 'bar',
          name: 'Bar Chart',
          icon: BarChart,
          description: `Count frequency of ${selectedVariables[0]} categories`,
          recommended: true
        });
      }
      
      if (type === 'continuous') {
        charts.push({
          id: 'histogram',
          name: 'Histogram',
          icon: BarChart,
          description: `Show distribution of ${selectedVariables[0]}`,
          recommended: true
        });
        charts.push({
          id: 'boxplot',
          name: 'Box Plot',
          icon: BarChart,
          description: `Show ${selectedVariables[0]} quartiles and outliers`,
          recommended: true
        });
      }
    }

    // Two variable charts
    if (variableCount === 2) {
      const [type1, type2] = variableTypes;
      
      if ((type1 === 'categorical' && type2 === 'continuous') || 
          (type1 === 'continuous' && type2 === 'categorical')) {
        charts.push({
          id: 'bar',
          name: 'Bar Chart',
          icon: BarChart,
          description: `Compare values across categories`,
          recommended: true
        });
        charts.push({
          id: 'boxplot',
          name: 'Box Plot',
          icon: BarChart,
          description: `Show distribution by category`,
          recommended: true
        });
      }

      if (type1 === 'continuous' && type2 === 'continuous') {
        charts.push({
          id: 'scatter',
          name: 'Scatter Plot',
          icon: ScatterChart,
          description: `See relationship between variables`,
          recommended: true
        });
        charts.push({
          id: 'regression',
          name: 'Regression Plot',
          icon: TrendingUp,
          description: `Relationship with trend line`,
          recommended: true
        });
      }
    }

    // Multiple variables
    if (variableCount >= 3) {
      const continuousCount = variableTypes.filter(t => t === 'continuous').length;
      
      if (continuousCount >= 2) {
        charts.push({
          id: 'correlation',
          name: 'Correlation Matrix',
          icon: BarChart,
          description: `Show correlations between all variables`,
          recommended: true
        });
      }
      
      charts.push({
        id: 'line',
        name: 'Multi-Line Chart',
        icon: LineChart,
        description: `Compare trends across variables`,
        recommended: continuousCount >= 2
      });
    }

    // Always available options (add non-recommended)
    const allCharts = [
      { id: 'bar', name: 'Bar Chart', icon: BarChart, description: 'Compare categories or values' },
      { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
      { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, description: 'Show relationships' },
      { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Show proportions' },
      { id: 'histogram', name: 'Histogram', icon: BarChart, description: 'Show distribution' },
      { id: 'boxplot', name: 'Box Plot', icon: BarChart, description: 'Show quartiles' },
      { id: 'regression', name: 'Regression Plot', icon: TrendingUp, description: 'Relationship with trend' },
      { id: 'correlation', name: 'Correlation Matrix', icon: BarChart, description: 'Variable correlations' }
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

  if (selectedVariables.length === 0) {
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
        <p className="text-sm text-gray-600">
          {selectedVariables.length} variable{selectedVariables.length !== 1 ? 's' : ''} selected
        </p>
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
