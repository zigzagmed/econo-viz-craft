import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  groupBy?: string;
}

interface SelectedRolesDisplayProps {
  variableRoles: VariableRoles;
  chartType: string;
}

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    xAxis: 'X-Axis',
    yAxis: 'Y-Axis',
    color: 'Color',
    size: 'Size',
    series: 'Series',
    groupBy: 'Group By'
  };
  return labels[role] || role;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    xAxis: 'bg-blue-100 text-blue-800',
    yAxis: 'bg-green-100 text-green-800',
    color: 'bg-purple-100 text-purple-800',
    size: 'bg-orange-100 text-orange-800',
    series: 'bg-pink-100 text-pink-800',
    groupBy: 'bg-pink-100 text-pink-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const formatVariableName = (variable: string) => {
  return variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getChartTypeDescription = (chartType: string) => {
  const descriptions: Record<string, string> = {
    scatter: 'Scatter Plot - Shows relationship between two continuous variables',
    regression: 'Regression Analysis - Shows relationship with trend line',
    bar: 'Bar Chart - Compares categories',
    line: 'Line Chart - Shows trends over time or categories',
    pie: 'Pie Chart - Shows proportions of a whole',
    histogram: 'Histogram - Shows distribution of a single variable',
    boxplot: 'Box Plot - Shows distribution summary statistics'
  };
  return descriptions[chartType] || 'Chart Analysis';
};

export const SelectedRolesDisplay: React.FC<SelectedRolesDisplayProps> = ({
  variableRoles,
  chartType
}) => {
  const assignedRoles = Object.entries(variableRoles).filter(([_, variable]) => variable);

  if (assignedRoles.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm">Selected Variables</CardTitle>
          <p className="text-xs text-gray-500">{getChartTypeDescription(chartType)}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {assignedRoles.map(([role, variable]) => (
          <div key={role} className="flex items-center justify-between">
            <span className="text-sm font-medium">{formatVariableName(variable!)}</span>
            <Badge className={`text-xs ${getRoleColor(role)}`}>
              {getRoleLabel(role)}
            </Badge>
          </div>
        ))}
        
        {/* Show additional info based on chart type */}
        {chartType === 'regression' && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              ✓ Trend line and R² value will be displayed
            </p>
          </div>
        )}
        
        {chartType === 'histogram' && assignedRoles.length === 1 && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Shows frequency distribution with automatic binning
            </p>
          </div>
        )}
        
        {chartType === 'line' && variableRoles.groupBy && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Will create separate lines for each {variableRoles.groupBy} category
            </p>
          </div>
        )}
        
        {['scatter', 'bar', 'line'].includes(chartType) && assignedRoles.length >= 2 && (
          <div className="mt-3 pt-2 border-gray-100">
            <p className="text-xs text-gray-500">
              Statistical overlay available in customization
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
