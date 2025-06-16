
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTypeSelector } from './ChartTypeSelector';
import { BarChart } from 'lucide-react';

interface ChartTypeSelectionCardProps {
  chartType: string;
  onTypeChange: (type: string) => void;
}

export const ChartTypeSelectionCard: React.FC<ChartTypeSelectionCardProps> = ({
  chartType,
  onTypeChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Step 1: Choose Chart Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartTypeSelector
          selectedType={chartType}
          onTypeChange={onTypeChange}
          selectedVariables={[]} // Not needed for this step
        />
      </CardContent>
    </Card>
  );
};
