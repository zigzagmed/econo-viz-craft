
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyChartState } from './EmptyChartState';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
  onExportChart
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {canShowChart ? chartTitle : 'Your Chart'}
          </CardTitle>
          {canShowChart && (
            <div className="flex gap-2">
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
            style={{ 
              height: '500px', 
              minHeight: '500px',
              position: 'relative'
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
