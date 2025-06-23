
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart, LineChart, PieChart, ScatterChart } from 'lucide-react';

interface ChartTypeProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  selectedVariables: string[];
}

export const ChartTypeSelector: React.FC<ChartTypeProps> = ({
  selectedType,
  onTypeChange,
  selectedVariables
}) => {
  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart, minVars: 1, maxVars: 2, description: 'Compare categories or values' },
    { id: 'line', name: 'Line Chart', icon: LineChart, minVars: 2, maxVars: 3, description: 'Show trends over time' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, minVars: 1, maxVars: 1, description: 'Show proportions' },
    { id: 'scatter', name: 'Scatter Plot', icon: ScatterChart, minVars: 2, maxVars: 2, description: 'Show relationships between variables' },
    { id: 'histogram', name: 'Histogram', icon: BarChart, minVars: 1, maxVars: 1, description: 'Show distribution' },
    { id: 'boxplot', name: 'Box Plot', icon: BarChart, minVars: 1, maxVars: 3, description: 'Show quartiles and outliers' },
    { id: 'correlation', name: 'Correlation Matrix', icon: BarChart, minVars: 2, maxVars: 10, description: 'Variable correlations' },
  ];

  return (
    <div className="space-y-2">
      {chartTypes.map((chart) => {
        const Icon = chart.icon;
        const isSelected = selectedType === chart.id;
        
        return (
          <Button
            key={chart.id}
            variant={isSelected ? "default" : "outline"}
            className="w-full h-auto p-4 flex items-center gap-3 justify-start"
            onClick={() => onTypeChange(chart.id)}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1 text-left">
              <div className="font-medium">{chart.name}</div>
              <div className="text-xs text-gray-600 mt-1">{chart.description}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
