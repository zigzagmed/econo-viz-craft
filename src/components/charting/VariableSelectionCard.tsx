
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VariableSelector } from './VariableSelector';
import { Database } from 'lucide-react';

interface VariableSelectionCardProps {
  selectedDataset: string;
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
  getDatasetInfo: (dataset: string) => any;
}

export const VariableSelectionCard: React.FC<VariableSelectionCardProps> = ({
  selectedDataset,
  selectedVariables,
  onVariablesChange,
  getDatasetInfo
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Database className="w-5 h-5" />
          Step 1: Select Variables
        </CardTitle>
      </CardHeader>
      <CardContent>
        <VariableSelector
          dataset={selectedDataset}
          selectedVariables={selectedVariables}
          onVariablesChange={onVariablesChange}
          getDatasetInfo={getDatasetInfo}
        />
      </CardContent>
    </Card>
  );
};
