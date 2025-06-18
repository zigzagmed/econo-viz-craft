
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Variable } from '../types/variableTypes';

interface MultipleVariableSelectorProps {
  role: string;
  requirement: {
    required: boolean;
    label: string;
    description: string;
    allowedTypes: string[];
  };
  selectedVariables: string[];
  filteredVariables: Variable[];
  disabled: boolean;
  onVariablesChange: (role: string, variables: string[]) => void;
}

export const MultipleVariableSelector: React.FC<MultipleVariableSelectorProps> = ({
  role,
  requirement,
  selectedVariables,
  filteredVariables,
  disabled,
  onVariablesChange
}) => {
  const handleVariableToggle = (variableName: string) => {
    const newSelection = selectedVariables.includes(variableName)
      ? selectedVariables.filter(v => v !== variableName)
      : [...selectedVariables, variableName];
    
    onVariablesChange(role, newSelection);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {requirement.label}
          {requirement.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {selectedVariables.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {selectedVariables.length} selected
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-gray-600 mb-2">{requirement.description}</p>
      
      <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
        {filteredVariables.map((variable) => (
          <div key={variable.name} className="flex items-center space-x-2">
            <Checkbox
              id={`${role}-${variable.name}`}
              checked={selectedVariables.includes(variable.name)}
              onCheckedChange={() => handleVariableToggle(variable.name)}
              disabled={disabled}
            />
            <label
              htmlFor={`${role}-${variable.name}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
            >
              {variable.name}
            </label>
            <Badge variant="outline" className="text-xs">
              {variable.type}
            </Badge>
          </div>
        ))}
      </div>
      
      {selectedVariables.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedVariables.map((variable) => (
            <Badge 
              key={variable} 
              variant="default" 
              className="text-xs cursor-pointer"
              onClick={() => handleVariableToggle(variable)}
            >
              {variable} ×
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
