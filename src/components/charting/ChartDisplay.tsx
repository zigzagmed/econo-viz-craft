
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyChartState } from './EmptyChartState';
import { ChartControls } from './ChartControls';

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
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  canShowChart,
  chartTitle,
  chartRef,
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {canShowChart ? chartTitle : 'Your Chart'}
          </CardTitle>
          {canShowChart && (
            <ChartControls
              selectedDataset={selectedDataset}
              selectedVariables={selectedVariables}
              chartType={chartType}
              chartConfig={chartConfig}
              customizationOpen={customizationOpen}
              setCustomizationOpen={setCustomizationOpen}
              onConfigChange={onConfigChange}
              onExportChart={onExportChart}
              getVariableData={getVariableData}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!canShowChart ? (
          <EmptyChartState />
        ) : (
          <div 
            ref={chartRef} 
            className="w-full border border-gray-200 rounded-lg bg-white"
            style={{ height: '500px', minHeight: '500px' }}
          />
        )}
      </CardContent>
    </Card>
  );
};
