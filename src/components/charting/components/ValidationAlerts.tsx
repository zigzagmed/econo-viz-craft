
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertTriangle } from 'lucide-react';
import { ChartRoleRequirements, VariableRoles } from '../types/variableTypes';

interface ValidationAlertsProps {
  missingRequiredRoles: string[];
  roleRequirements: ChartRoleRequirements;
  isLineChartSameXY: boolean;
  variableRoles: VariableRoles;
  chartType: string;
}

export const ValidationAlerts: React.FC<ValidationAlertsProps> = ({
  missingRequiredRoles,
  roleRequirements,
  isLineChartSameXY,
  variableRoles,
  chartType
}) => {
  return (
    <>
      {missingRequiredRoles.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Required:</strong> Please select variables for {missingRequiredRoles.map(role => roleRequirements[role].label).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {isLineChartSameXY && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Auto-configured:</strong> Since X and Y axes are the same, the series has been automatically set to 'gdp_growth' to create a meaningful line chart showing {variableRoles.xAxis} vs gdp_growth.
          </AlertDescription>
        </Alert>
      )}

      {chartType === 'line' && variableRoles.xAxis === variableRoles.yAxis && variableRoles.xAxis && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Tip:</strong> For line charts, consider using different variables for X and Y axes to show meaningful relationships over time or categories.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
