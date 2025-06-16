
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface DatasetSelectorProps {
  datasets: Array<{
    id: string;
    name: string;
    description: string;
    variables: number;
    observations: number;
  }>;
  selectedDataset: string;
  onDatasetChange: (dataset: string) => void;
}

export const DatasetSelector: React.FC<DatasetSelectorProps> = ({
  datasets,
  selectedDataset,
  onDatasetChange
}) => {
  const selectedDatasetInfo = datasets.find(d => d.id === selectedDataset);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Dataset Selection</Label>
      <Select value={selectedDataset} onValueChange={onDatasetChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a dataset" />
        </SelectTrigger>
        <SelectContent>
          {datasets.map((dataset) => (
            <SelectItem key={dataset.id} value={dataset.id}>
              <div className="flex flex-col">
                <span className="font-medium">{dataset.name}</span>
                <span className="text-xs text-gray-500">{dataset.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedDatasetInfo && (
        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <h4 className="font-medium text-sm">{selectedDatasetInfo.name}</h4>
          <p className="text-xs text-gray-600">{selectedDatasetInfo.description}</p>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {selectedDatasetInfo.variables} variables
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {selectedDatasetInfo.observations} obs
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};
