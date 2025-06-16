
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartCustomization } from './ChartCustomization';
import { StatisticalOverlay } from './StatisticalOverlay';
import { Settings, Download, Info } from 'lucide-react';

interface ChartControlsProps {
  selectedDataset: string;
  selectedVariables: string[];
  chartType: string;
  chartConfig: any;
  customizationOpen: boolean;
  setCustomizationOpen: (open: boolean) => void;
  onConfigChange: (config: any) => void;
  onExportChart: (format: 'png' | 'svg') => void;
  getVariableData: (dataset: string, variables: string[]) => any;
}

export const ChartControls: React.FC<ChartControlsProps> = ({
  selectedDataset,
  selectedVariables,
  chartType,
  chartConfig,
  customizationOpen,
  setCustomizationOpen,
  onConfigChange,
  onExportChart,
  getVariableData
}) => {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm">
            <Info className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <StatisticalOverlay
            dataset={selectedDataset}
            variables={selectedVariables}
            getVariableData={getVariableData}
          />
        </PopoverContent>
      </Popover>

      <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Customize
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Chart</DialogTitle>
          </DialogHeader>
          <ChartCustomization
            config={chartConfig}
            onConfigChange={onConfigChange}
            chartType={chartType}
            selectedVariables={selectedVariables}
          />
        </DialogContent>
      </Dialog>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExportChart('png')}
      >
        <Download className="w-4 h-4 mr-1" />
        PNG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExportChart('svg')}
      >
        <Download className="w-4 h-4 mr-1" />
        SVG
      </Button>
    </div>
  );
};
