
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface Variable {
  name: string;
  type: 'continuous' | 'categorical' | 'binary';
  description: string;
  missing: number;
}

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
}

interface ChartRoleRequirements {
  [key: string]: {
    required: boolean;
    label: string;
    description: string;
    allowedTypes: ('continuous' | 'categorical' | 'binary')[];
  };
}

interface RoleBasedVariableSelectorProps {
  selectedDataset: string;
  chartType: string;
  variableRoles: VariableRoles;
  onRolesChange: (roles: VariableRoles) => void;
  getDatasetInfo: (dataset: string) => { variables: Variable[] } | null;
}

const getChartRoleRequirements = (chartType: string): ChartRoleRequirements => {
  const requirements: Record<string, ChartRoleRequirements> = {
    bar: {
      xAxis: { required: true, label: 'X-Axis', description: 'Categories to compare', allowedTypes: ['categorical', 'binary'] },
      yAxis: { required: false, label: 'Y-Axis', description: 'Values to measure', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    line: {
      xAxis: { required: true, label: 'X-Axis', description: 'Time or sequence variable', allowedTypes: ['continuous', 'categorical'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Values to plot', allowedTypes: ['continuous'] },
      series: { required: false, label: 'Series', description: 'Multiple lines', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    scatter: {
      xAxis: { required: true, label: 'X-Axis', description: 'Horizontal values', allowedTypes: ['continuous'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Vertical values', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] },
      size: { required: false, label: 'Size', description: 'Point size', allowedTypes: ['continuous'] }
    },
    regression: {
      xAxis: { required: true, label: 'X-Axis', description: 'Independent variable', allowedTypes: ['continuous'] },
      yAxis: { required: true, label: 'Y-Axis', description: 'Dependent variable', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Color', description: 'Group by color', allowedTypes: ['categorical', 'binary'] }
    },
    pie: {
      xAxis: { required: true, label: 'Category', description: 'Categories for pie slices', allowedTypes: ['categorical', 'binary'] }
    },
    histogram: {
      xAxis: { required: true, label: 'Variable', description: 'Variable to show distribution', allowedTypes: ['continuous'] }
    },
    boxplot: {
      xAxis: { required: true, label: 'Variable', description: 'Variable for box plot', allowedTypes: ['continuous'] },
      color: { required: false, label: 'Group By', description: 'Group boxes by category', allowedTypes: ['categorical', 'binary'] }
    },
    correlation: {
      series: { required: true, label: 'Variables', description: 'Variables for correlation matrix', allowedTypes: ['continuous'] }
    }
  };

  return requirements[chartType] || {};
};

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'continuous': return 'bg-blue-100 text-blue-800';
      case 'categorical': return 'bg-green-100 text-green-800';
      case 'binary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        {missingRequiredRoles.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Required:</strong> Please select variables for {missingRequiredRoles.map(role => roleRequirements[role].label).join(', ')}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {roleKeys.map((role) => {
            const requirement = roleRequirements[role];
            const filteredVariables = getFilteredVariables(requirement.allowedTypes);
            const selectedVariable = variableRoles[role as keyof VariableRoles];

            return (
              <div key={role} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">{requirement.label}</label>
                  {requirement.required && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{requirement.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Accepted variable types:</p>
                          <div className="flex gap-1">
                            {requirement.allowedTypes.map(type => (
                              <Badge key={type} className={`text-xs ${getTypeColor(type)}`}>
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <Select
                  value={selectedVariable || 'none'}
                  onValueChange={(value) => handleRoleChange(role, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${requirement.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {filteredVariables.map((variable) => (
                      <SelectItem key={variable.name} value={variable.name}>
                        <div className="flex items-center gap-2">
                          <span>{variable.name}</span>
                          <Badge className={`text-xs ${getTypeColor(variable.type)}`}>
                            {variable.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
