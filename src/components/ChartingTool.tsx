
import React, { useState, useEffect } from 'react';
import { ChartHeader } from './charting/ChartHeader';
import { ChartTypeSelectionCard } from './charting/ChartTypeSelectionCard';
import { RoleBasedVariableSelector } from './charting/RoleBasedVariableSelector';
import { ChartDisplay } from './charting/ChartDisplay';
import { useChartingData } from '../hooks/useChartingData';
import { useChartConfig } from '../hooks/useChartConfig';
import { useECharts } from '../hooks/useECharts';

// =============================================================================
// PYTHON BACKEND INTEGRATION GUIDE
// =============================================================================
// 
// This component is ready for Python backend integration. Key integration points:
// 
// 1. DATASET SELECTION: Currently hardcoded to 'gdp_growth'
//    - Replace with dynamic dataset selection from your Python backend
//    - Add dataset selector UI component if needed
// 
// 2. API CONFIGURATION: Add environment variables or configuration
//    - Set your Python backend base URL
//    - Configure authentication if needed
// 
// 3. ERROR HANDLING: Add proper error states for API failures
//    - Network errors, authentication errors, data validation errors
// 
// 4. LOADING STATES: Add loading indicators for async operations
//    - Dataset loading, variable info loading, chart data loading
//
// =============================================================================

interface VariableRoles {
  xAxis?: string;
  yAxis?: string;
  color?: string;
  size?: string;
  series?: string;
  histogramBins?: number;
  statistic?: string;
}

export const ChartingTool = () => {
  // TODO: MAKE DYNAMIC - Replace with dataset selection from Python backend
  // =============================================================================
  // Currently hardcoded dataset. Replace with:
  // const [selectedDataset, setSelectedDataset] = useState<string>('');
  // Then add dataset selection UI component
  // =============================================================================
  const selectedDataset = 'gdp_growth';
  
  const [chartType, setChartType] = useState<string>('');
  const [variableRoles, setVariableRoles] = useState<VariableRoles>({});

  const { getVariableData, getDatasetInfo } = useChartingData();
  const { chartConfig, setChartConfig } = useChartConfig(variableRoles, chartType);
  const { chartRef, handleExportChart } = useECharts(
    selectedDataset,
    variableRoles,
    chartType,
    chartConfig,
    getVariableData
  );

  // Reset variable roles when chart type changes
  useEffect(() => {
    if (chartType) {
      setVariableRoles({});
    }
  }, [chartType]);

  const canShowChart = chartType && Object.keys(variableRoles).some(role => 
    role !== 'histogramBins' && variableRoles[role as keyof VariableRoles]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <ChartHeader />

        {/* TODO: ADD DATASET SELECTOR when integrating with Python backend */}
        {/* Uncomment and implement when you have multiple datasets from Python backend:
        <div className="mb-6">
          <DatasetSelector
            datasets={datasets}
            selectedDataset={selectedDataset}
            onDatasetChange={setSelectedDataset}
          />
        </div>
        */}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Chart Setup */}
          <div className="col-span-4 space-y-4">
            <ChartTypeSelectionCard
              chartType={chartType}
              onTypeChange={setChartType}
            />

            {chartType && (
              <RoleBasedVariableSelector
                selectedDataset={selectedDataset}
                chartType={chartType}
                variableRoles={variableRoles}
                onRolesChange={setVariableRoles}
                getDatasetInfo={getDatasetInfo}
              />
            )}
          </div>

          {/* Right Panel - Chart */}
          <div className="col-span-8">
            <ChartDisplay
              canShowChart={canShowChart}
              chartTitle={chartConfig.title}
              chartRef={chartRef}
              selectedDataset={selectedDataset}
              variableRoles={variableRoles}
              chartType={chartType}
              chartConfig={chartConfig}
              customizationOpen={false}
              setCustomizationOpen={() => {}}
              onConfigChange={setChartConfig}
              onExportChart={handleExportChart}
              getVariableData={getVariableData}
              getDatasetInfo={getDatasetInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
