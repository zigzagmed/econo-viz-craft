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

  const handleRoleChange = (role: string, variable: string | undefined) => {
    const newRoles = { ...variableRoles };
    if (variable === 'none') {
      delete newRoles[role as keyof VariableRoles];
    } else {
      (newRoles as any)[role] = variable;
    }

    onRolesChange(newRoles);
  };

  const requiredRoles = roleKeys.filter(role => roleRequirements[role].required);
  const missingRequiredRoles = requiredRoles.filter(role => !variableRoles[role as keyof VariableRoles]);

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
          isLineChartSameXY={false}
          variableRoles={variableRoles}
          chartType={chartType}
        />

        <div className="space-y-4">
          {roleKeys.map((role) => {
            const requirement = roleRequirements[role];
            const filteredVariables = getFilteredVariables(requirement.allowedTypes);
            const selectedVariable = variableRoles[role as keyof VariableRoles];

            return (
              <RoleSelector
                key={role}
                role={role}
                requirement={requirement}
                selectedVariable={selectedVariable}
                filteredVariables={filteredVariables}
                disabled={false}
                onRoleChange={handleRoleChange}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
