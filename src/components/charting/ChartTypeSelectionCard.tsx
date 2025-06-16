
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTypeSelector } from './ChartTypeSelector';
import { BarChart, ChevronDown, ChevronUp } from 'lucide-react';
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Step 1: Choose Chart Type
            {chartType && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart)
              </span>
            )}
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
      {!isCollapsed && (
        <CardContent>
          <ChartTypeSelector
            selectedType={chartType}
            onTypeChange={onTypeChange}
            selectedVariables={[]}
          />
        </CardContent>
      )}
    </Card>
  );
};
