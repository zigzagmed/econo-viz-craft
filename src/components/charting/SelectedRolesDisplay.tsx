
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
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
    series: 'Series'
  };
  return labels[role] || role;
};

const getRoleColor = (role: string) => {
  const colors: Record<string, string> = {
    xAxis: 'bg-blue-100 text-blue-800',
    yAxis: 'bg-green-100 text-green-800',
    color: 'bg-purple-100 text-purple-800',
    size: 'bg-orange-100 text-orange-800',
    series: 'bg-pink-100 text-pink-800'
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const formatVariableName = (variable: string) => {
  return variable.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
        <CardTitle className="text-sm">Selected Variables</CardTitle>
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
      </CardContent>
    </Card>
  );
};
