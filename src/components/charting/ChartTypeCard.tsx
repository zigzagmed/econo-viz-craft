
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SmartChartTypeSelector } from './SmartChartTypeSelector';
import { BarChart } from 'lucide-react';

interface ChartTypeCardProps {
  selectedVariables: string[];
  chartType: string;
  onTypeChange: (type: string) => void;
  getVariableType: (variable: string) => string;
}

export const ChartTypeCard: React.FC<ChartTypeCardProps> = ({
  selectedVariables,
  chartType,
  onTypeChange,
  getVariableType
}) => {
  if (selectedVariables.length === 0) {
    return null;
  }

  return (
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
          onTypeChange={onTypeChange}
          selectedVariables={selectedVariables}
          getVariableType={getVariableType}
        />
      </CardContent>
    </Card>
  );
};
