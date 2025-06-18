
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { getChartRoleRequirements } from './utils/chartRoleRequirements';
import { RoleSelector } from './components/RoleSelector';
import { ValidationAlerts } from './components/ValidationAlerts';
import { RoleBasedVariableSelectorProps, VariableRoles } from './types/variableTypes';

export const RoleBasedVariableSelector: React.FC<RoleBasedVariableSelectorProps> = ({
  selectedDataset,
  chartType,
  variableRoles,
  onRolesChange,
  getDatasetInfo
}) => {
  if (!selectedDataset || !chartType) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="w-5 h-5" />
            Step 2: Select Variables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Select a chart type first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const datasetInfo = getDatasetInfo(selectedDataset);
  if (!datasetInfo) return null;

  const roleRequirements = getChartRoleRequirements(chartType);
  const roleKeys = Object.keys(roleRequirements);

  const getFilteredVariables = (allowedTypes: string[]) => {
    return datasetInfo.variables.filter(variable => 
      allowedTypes.includes(variable.type)
    );
  };

  // Check if X and Y axes are the same for line charts
  const isLineChartSameXY = chartType === 'line' && 
    variableRoles.xAxis && 
    variableRoles.yAxis && 
    variableRoles.xAxis === variableRoles.yAxis;

  const handleRoleChange = (role: string, variable: string | undefined) => {
    const newRoles = { ...variableRoles };
    if (variable === 'none') {
      delete newRoles[role as keyof VariableRoles];
    } else {
      (newRoles as any)[role] = variable;
    }

    // Auto-set series to gdp_growth when X=Y in line charts
    if (chartType === 'line' && role === 'yAxis' && variable === newRoles.xAxis) {
      newRoles.series = 'gdp_growth';
    }

    onRolesChange(newRoles);
  };

  const requiredRoles = roleKeys.filter(role => roleRequirements[role].required);
  const missingRequiredRoles = requiredRoles.filter(role => !variableRoles[role as keyof VariableRoles]);

  const isRoleDisabled = (role: string) => {
    // Disable series selection when X=Y in line charts
    return chartType === 'line' && role === 'series' && isLineChartSameXY;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Step 2: Select Variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ValidationAlerts
          missingRequiredRoles={missingRequiredRoles}
          roleRequirements={roleRequirements}
          isLineChartSameXY={isLineChartSameXY}
          variableRoles={variableRoles}
          chartType={chartType}
        />

        <div className="space-y-4">
          {roleKeys.map((role) => {
            const requirement = roleRequirements[role];
            const filteredVariables = getFilteredVariables(requirement.allowedTypes);
            const selectedVariable = variableRoles[role as keyof VariableRoles];
            const disabled = isRoleDisabled(role);

            return (
              <RoleSelector
                key={role}
                role={role}
                requirement={requirement}
                selectedVariable={selectedVariable}
                filteredVariables={filteredVariables}
                disabled={disabled}
                onRoleChange={handleRoleChange}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
