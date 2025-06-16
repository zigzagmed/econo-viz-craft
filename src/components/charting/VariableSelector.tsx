
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Variable {
  name: string;
  type: 'continuous' | 'categorical' | 'binary';
  description: string;
  missing: number;
}

interface VariableSelectorProps {
  dataset: string;
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
  getDatasetInfo: (dataset: string) => { variables: Variable[] } | null;
  maxSelection?: number;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  dataset,
  selectedVariables,
  onVariablesChange,
  getDatasetInfo,
  maxSelection
}) => {
  if (!dataset) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">Select a dataset to view variables</p>
      </div>
    );
  }

  const datasetInfo = getDatasetInfo(dataset);
  if (!datasetInfo) return null;

  const handleVariableChange = (variable: string, checked: boolean) => {
    if (checked) {
      // Check if we've reached the maximum selection limit
      if (maxSelection && selectedVariables.length >= maxSelection) {
        return; // Don't allow more selections
      }
      onVariablesChange([...selectedVariables, variable]);
    } else {
      onVariablesChange(selectedVariables.filter(v => v !== variable));
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'continuous': return 'bg-blue-100 text-blue-800';
      case 'categorical': return 'bg-green-100 text-green-800';
      case 'binary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isVariableDisabled = (variable: Variable) => {
    const isSelected = selectedVariables.includes(variable.name);
    const maxReached = maxSelection && selectedVariables.length >= maxSelection;
    return !isSelected && maxReached;
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Variable Selection</Label>
      <ScrollArea className="h-64 w-full">
        <div className="space-y-3">
          {datasetInfo.variables.map((variable) => {
            const isDisabled = isVariableDisabled(variable);
            
            return (
              <div 
                key={variable.name} 
                className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 ${
                  isDisabled ? 'opacity-50' : ''
                }`}
              >
                <Checkbox
                  id={variable.name}
                  checked={selectedVariables.includes(variable.name)}
                  onCheckedChange={(checked) => handleVariableChange(variable.name, checked as boolean)}
                  disabled={isDisabled}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Label 
                      htmlFor={variable.name} 
                      className={`text-sm font-medium cursor-pointer ${
                        isDisabled ? 'cursor-not-allowed' : ''
                      }`}
                    >
                      {variable.name}
                    </Label>
                    <Badge className={`text-xs ${getTypeColor(variable.type)}`}>
                      {variable.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{variable.description}</p>
                  {variable.missing > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {variable.missing} missing
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
