
import React, { useState } from 'react';
import { ChartHeader } from './charting/ChartHeader';
import { VariableSelectionCard } from './charting/VariableSelectionCard';
import { ChartTypeCard } from './charting/ChartTypeCard';
import { ChartDisplay } from './charting/ChartDisplay';
import { useChartingData } from '../hooks/useChartingData';
import { useChartConfig } from '../hooks/useChartConfig';
import { useECharts } from '../hooks/useECharts';

export const ChartingTool = () => {
  const selectedDataset = 'gdp_growth'; // Default to GDP growth dataset
  const [selectedVariables, setSelectedVariables] = useState<string[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const [customizationOpen, setCustomizationOpen] = useState(false);

  const { getVariableData, getDatasetInfo } = useChartingData();
  const { chartConfig, setChartConfig } = useChartConfig(selectedVariables, chartType);
  const { chartRef, handleExportChart } = useECharts(
    selectedDataset,
    selectedVariables,
    chartType,
    chartConfig,
    getVariableData
  );

  const getVariableType = (variableName: string) => {
    const datasetInfo = getDatasetInfo(selectedDataset);
    const variable = datasetInfo?.variables.find(v => v.name === variableName);
    return variable?.type || 'continuous';
  };

  const canShowChart = selectedVariables.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ChartHeader />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Data Setup */}
          <div className="col-span-4 space-y-4">
            <VariableSelectionCard
              selectedDataset={selectedDataset}
              selectedVariables={selectedVariables}
              onVariablesChange={setSelectedVariables}
              getDatasetInfo={getDatasetInfo}
            />

            <ChartTypeCard
              selectedVariables={selectedVariables}
              chartType={chartType}
              onTypeChange={setChartType}
              getVariableType={getVariableType}
            />
          </div>

          {/* Right Panel - Chart */}
          <div className="col-span-8">
            <ChartDisplay
              canShowChart={canShowChart}
              chartTitle={chartConfig.title}
              chartRef={chartRef}
              selectedDataset={selectedDataset}
              selectedVariables={selectedVariables}
              chartType={chartType}
              chartConfig={chartConfig}
              customizationOpen={customizationOpen}
              setCustomizationOpen={setCustomizationOpen}
              onConfigChange={setChartConfig}
              onExportChart={handleExportChart}
              getVariableData={getVariableData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
