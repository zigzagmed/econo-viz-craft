
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VariableSelector } from './VariableSelector';
import { Database, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChartRequirements {
  min: number;
  max: number;
  description: string;
}

interface VariableSelectionCardProps {
  selectedDataset: string;
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
  getDatasetInfo: (dataset: string) => any;
  requirements?: ChartRequirements;
}

export const VariableSelectionCard: React.FC<VariableSelectionCardProps> = ({
  selectedDataset,
  selectedVariables,
  onVariablesChange,
  getDatasetInfo,
  requirements
}) => {
  const isValidSelection = requirements ? 
    selectedVariables.length >= requirements.min && selectedVariables.length <= requirements.max :
    selectedVariables.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Step 2: Select Variables
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {requirements && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Requirements:</strong> {requirements.description}
              <br />
              <span className="text-sm text-gray-600">
                Selected: {selectedVariables.length} / {requirements.min === requirements.max ? requirements.max : `${requirements.min}-${requirements.max}`}
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        <VariableSelector
          dataset={selectedDataset}
          selectedVariables={selectedVariables}
          onVariablesChange={onVariablesChange}
          getDatasetInfo={getDatasetInfo}
          maxSelection={requirements?.max}
        />
        
        {requirements && selectedVariables.length > 0 && !isValidSelection && (
          <Alert variant="destructive">
            <AlertDescription>
              {selectedVariables.length < requirements.min 
                ? `Please select at least ${requirements.min} variable${requirements.min > 1 ? 's' : ''}`
                : `Please select no more than ${requirements.max} variable${requirements.max > 1 ? 's' : ''}`
              }
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
