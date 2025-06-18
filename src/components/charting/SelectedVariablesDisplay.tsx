
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SelectedVariablesDisplayProps {
  selectedVariables: string[];
  chartType: string;
  colorVariable?: string;
}

export const SelectedVariablesDisplay: React.FC<SelectedVariablesDisplayProps> = ({
  selectedVariables,
  chartType,
  colorVariable
}) => {
  if (selectedVariables.length === 0) {
    return null;
  }

  const getVariableRole = (index: number) => {
    if (chartType === 'scatter' || chartType === 'regression') {
      return index === 0 ? 'X-axis' : 'Y-axis';
    }
    if (chartType === 'bar' || chartType === 'line') {
      return index === 0 ? 'X-axis' : index === 1 ? 'Y-axis' : 'Series';
    }
    if (chartType === 'pie' || chartType === 'histogram') {
      return 'Variable';
    }
    return index === 0 ? 'X-axis' : index === 1 ? 'Y-axis' : 'Variable';
  };

  const formatVariableName = (variable: string) => {
    return variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Selected Variables</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {selectedVariables.map((variable, index) => (
          <div key={variable} className="flex items-center justify-between">
            <span className="text-sm font-medium">{formatVariableName(variable)}</span>
            <Badge variant="secondary" className="text-xs">
              {getVariableRole(index)}
            </Badge>
          </div>
        ))}
        {colorVariable && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{formatVariableName(colorVariable)}</span>
            <Badge variant="outline" className="text-xs">
              Color
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
