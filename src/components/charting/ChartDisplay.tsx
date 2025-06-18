import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyChartState } from './EmptyChartState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChartCustomization } from './ChartCustomization';
import { Download, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { StatisticsTable } from './StatisticsTable';
import { calculateStatistics } from '../../utils/statisticalUtils';

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
}

interface ChartDisplayProps {
  canShowChart: boolean;
  chartTitle: string;
  chartRef: React.RefObject<HTMLDivElement>;
  selectedDataset: string;
  variableRoles: VariableRoles;
  chartType: string;
  chartConfig: any;
  customizationOpen: boolean;
  setCustomizationOpen: (open: boolean) => void;
  onConfigChange: (config: any) => void;
  onExportChart: (format: 'png' | 'svg') => void;
  getVariableData: (dataset: string, variables: string[]) => any;
  getDatasetInfo?: (dataset: string) => any;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  canShowChart,
  chartTitle,
  chartRef,
  selectedDataset,
  variableRoles,
  chartType,
  chartConfig,
  onConfigChange,
  onExportChart,
  getVariableData,
  getDatasetInfo
}) => {
  const [customizationOpen, setCustomizationOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  console.log('ChartDisplay render:', { canShowChart, chartTitle });

  // Get available variables from dataset info
  const datasetInfo = getDatasetInfo ? getDatasetInfo(selectedDataset) : null;
  const availableVariables = datasetInfo?.variables?.map((v: any) => v.name) || [];
  
  // Convert variableRoles to selectedVariables array for compatibility
  const selectedVariables = Object.values(variableRoles).filter(Boolean) as string[];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl">{chartTitle}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomizationOpen(true)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Customize
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExportChart('png')}>
                Export as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExportChart('svg')}>
                Export as SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="h-[500px] p-4">
        {canShowChart ? (
          <div ref={chartRef} className="w-full h-full" />
        ) : (
          <EmptyChartState />
        )}
      </CardContent>

      {/* Statistics Table */}
      {canShowChart && chartConfig.showStats && (
        <div className="px-6 pb-6">
          <StatisticsTable 
            statistics={(() => {
              const allVariables = Object.values(variableRoles).filter(Boolean).flat() as string[];
              const data = getVariableData(selectedDataset, allVariables);
              return calculateStatistics(data || [], allVariables);
            })()}
            decimals={chartConfig.statsDecimals || 2}
          />
        </div>
      )}

      {/* Customization Dialog */}
      <Dialog open={customizationOpen} onOpenChange={setCustomizationOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customize Chart</DialogTitle>
          </DialogHeader>
          <ChartCustomization
            config={chartConfig}
            onConfigChange={onConfigChange}
            chartType={chartType}
            selectedVariables={Object.values(variableRoles).filter(Boolean) as string[]}
            availableVariables={getDatasetInfo(selectedDataset)?.variables.map(v => v.name) || []}
            onClose={() => setCustomizationOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};
