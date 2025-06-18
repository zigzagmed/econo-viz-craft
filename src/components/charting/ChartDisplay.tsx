
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyChartState } from './EmptyChartState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChartCustomization } from './ChartCustomization';
import { Download, Settings } from 'lucide-react';

interface ChartDisplayProps {
  canShowChart: boolean;
  chartTitle: string;
  chartRef: React.RefObject<HTMLDivElement>;
  selectedDataset: string;
  selectedVariables: string[];
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
  selectedVariables,
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {canShowChart ? chartTitle : 'Your Chart'}
          </CardTitle>
          {canShowChart && (
            <div className="flex gap-2">
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
                    availableVariables={availableVariables}
                  />
                </DialogContent>
              </Dialog>

              <Dialog open={exportOpen} onOpenChange={setExportOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Export Chart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Choose the format to export your chart:
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          onExportChart('png');
                          setExportOpen(false);
                        }}
                        className="flex-1"
                      >
                        Export as PNG
                      </Button>
                      <Button
                        onClick={() => {
                          onExportChart('svg');
                          setExportOpen(false);
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Export as SVG
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!canShowChart ? (
          <EmptyChartState />
        ) : (
          <div className="w-full">
            <div 
              ref={chartRef} 
              className="w-full border border-gray-200 rounded-lg bg-white"
              style={{ 
                height: '500px', 
                minHeight: '500px'
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
