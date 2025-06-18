
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Variable } from '../types/variableTypes';

interface RoleSelectorProps {
  role: string;
  requirement: {
    required: boolean;
    label: string;
    description: string;
    allowedTypes: ('continuous' | 'categorical' | 'binary')[];
  };
  selectedVariable?: string;
  filteredVariables: Variable[];
  disabled: boolean;
  onRoleChange: (role: string, variable: string | undefined) => void;
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'continuous': return 'bg-blue-100 text-blue-800';
    case 'categorical': return 'bg-green-100 text-green-800';
    case 'binary': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getRoleDescription = (role: string, allowedTypes: string[]) => {
  const baseDescriptions: Record<string, string> = {
    xAxis: 'Defines the horizontal dimension of your chart',
    yAxis: 'Defines the vertical dimension of your chart',
    color: 'Groups data points by different colors',
    size: 'Varies the size of data points based on values',
    series: 'Creates multiple data series or lines'
  };
  
  const typeList = allowedTypes.join(', ');
  return `${baseDescriptions[role] || 'Chart role'}. Accepts ${typeList} data types.`;
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  role,
  requirement,
  selectedVariable,
  filteredVariables,
  disabled,
  onRoleChange
}) => {
  return (
    <div className="space-y-2">
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
              <p className="text-sm font-medium">{getRoleDescription(role, requirement.allowedTypes)}</p>
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
        onValueChange={(value) => onRoleChange(role, value)}
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
};
