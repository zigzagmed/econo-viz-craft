
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, ScatterPlot } from 'lucide-react';

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
  const chartTypes = {
    basic: [
      { id: 'bar', name: 'Bar Chart', icon: BarChart, minVars: 1, maxVars: 2 },
      { id: 'line', name: 'Line Chart', icon: LineChart, minVars: 2, maxVars: 3 },
      { id: 'pie', name: 'Pie Chart', icon: PieChart, minVars: 1, maxVars: 1 },
      { id: 'scatter', name: 'Scatter Plot', icon: ScatterPlot, minVars: 2, maxVars: 2 },
    ],
    distribution: [
      { id: 'histogram', name: 'Histogram', icon: BarChart, minVars: 1, maxVars: 1 },
      { id: 'boxplot', name: 'Box Plot', icon: BarChart, minVars: 1, maxVars: 3 },
      { id: 'violin', name: 'Violin Plot', icon: BarChart, minVars: 1, maxVars: 2 },
      { id: 'density', name: 'Density Plot', icon: LineChart, minVars: 1, maxVars: 2 },
    ],
    statistical: [
      { id: 'regression', name: 'Regression Plot', icon: ScatterPlot, minVars: 2, maxVars: 2 },
      { id: 'correlation', name: 'Correlation Matrix', icon: BarChart, minVars: 2, maxVars: 10 },
      { id: 'residual', name: 'Residual Plot', icon: ScatterPlot, minVars: 2, maxVars: 2 },
      { id: 'qqplot', name: 'Q-Q Plot', icon: ScatterPlot, minVars: 1, maxVars: 1 },
    ]
  };

  const isChartAvailable = (chart: any) => {
    const varCount = selectedVariables.length;
    return varCount >= chart.minVars && varCount <= chart.maxVars;
  };

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="distribution">Distribution</TabsTrigger>
        <TabsTrigger value="statistical">Statistical</TabsTrigger>
      </TabsList>

      {Object.entries(chartTypes).map(([category, charts]) => (
        <TabsContent key={category} value={category} className="mt-4">
          <div className="grid grid-cols-2 gap-2">
            {charts.map((chart) => {
              const Icon = chart.icon;
              const available = isChartAvailable(chart);
              
              return (
                <Button
                  key={chart.id}
                  variant={selectedType === chart.id ? "default" : "outline"}
                  size="sm"
                  className="h-auto p-3 flex flex-col items-center gap-1"
                  onClick={() => onTypeChange(chart.id)}
                  disabled={!available}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{chart.name}</span>
                </Button>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
