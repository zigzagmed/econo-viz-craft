import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Info, AlertTriangle } from 'lucide-react';
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

        <div className="space-y-4">
          {roleKeys.map((role) => {
            const requirement = roleRequirements[role];
            const filteredVariables = getFilteredVariables(requirement.allowedTypes);
            const selectedVariable = variableRoles[role as keyof VariableRoles];
            const disabled = isRoleDisabled(role);

            return (
              <div key={role} className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">{requirement.label}</label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="relative cursor-help">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        {requirement.required && (
                          <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 min-w-0">
                            !
                          </Badge>
                        )}
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{requirement.description}</p>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600">Accepted data types:</p>
                          <div className="flex gap-1">
                            {requirement.allowedTypes.map(type => (
                              <Badge key={type} className={`text-xs ${getTypeColor(type)}`}>
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {requirement.required && (
                          <div className="pt-2 border-t">
                            <Badge variant="destructive" className="text-xs">Required Field</Badge>
                          </div>
                        )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </div>
                
                <Select
                  value={disabled ? 'gdp_growth' : (selectedVariable || 'none')}
                  onValueChange={(value) => handleRoleChange(role, value)}
                  disabled={disabled}
                >
                  <SelectTrigger className={`w-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder={`Select ${requirement.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {!disabled && <SelectItem value="none">None</SelectItem>}
                    {(disabled ? [{ name: 'gdp_growth', type: 'continuous' }] : filteredVariables).map((variable) => (
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
