
import { useState, useEffect } from 'react';

// Sample econometric datasets
const sampleDatasets = {
  gdp_growth: {
    id: 'gdp_growth',
    name: 'GDP Growth Analysis',
    description: 'Quarterly GDP growth data with economic indicators',
    variables: [
      { name: 'gdp_growth', type: 'continuous' as const, description: 'GDP Growth Rate (%)', missing: 0 },
      { name: 'unemployment', type: 'continuous' as const, description: 'Unemployment Rate (%)', missing: 2 },
      { name: 'inflation', type: 'continuous' as const, description: 'Inflation Rate (%)', missing: 1 },
      { name: 'interest_rate', type: 'continuous' as const, description: 'Interest Rate (%)', missing: 0 },
      { name: 'recession', type: 'binary' as const, description: 'Recession Period (0/1)', missing: 0 },
      { name: 'quarter', type: 'categorical' as const, description: 'Quarter (Q1-Q4)', missing: 0 }
    ],
    observations: 120,
    data: generateGDPData()
  },
  housing_prices: {
    id: 'housing_prices',
    name: 'Housing Market Data',
    description: 'Real estate prices with demographic factors',
    variables: [
      { name: 'price', type: 'continuous' as const, description: 'House Price ($000s)', missing: 3 },
      { name: 'bedrooms', type: 'continuous' as const, description: 'Number of Bedrooms', missing: 0 },
      { name: 'bathrooms', type: 'continuous' as const, description: 'Number of Bathrooms', missing: 1 },
      { name: 'sqft', type: 'continuous' as const, description: 'Square Footage', missing: 2 },
      { name: 'age', type: 'continuous' as const, description: 'House Age (years)', missing: 0 },
      { name: 'location', type: 'categorical' as const, description: 'Location (Urban/Suburban/Rural)', missing: 0 }
    ],
    observations: 500,
    data: generateHousingData()
  }
};

function generateGDPData() {
  const data = [];
  for (let i = 0; i < 120; i++) {
    const quarter = `Q${(i % 4) + 1}`;
    const year = 2000 + Math.floor(i / 4);
    const baseGrowth = 2 + Math.sin(i * 0.1) * 1.5 + (Math.random() - 0.5) * 2;
    const recession = Math.random() < 0.15 ? 1 : 0;
    const unemployment = 5 + (recession * 3) + (Math.random() - 0.5) * 2;
    const inflation = 2 + (Math.random() - 0.5) * 1.5;
    const interest_rate = 3 + (inflation * 0.5) + (Math.random() - 0.5) * 1;
    
    data.push({
      gdp_growth: recession ? baseGrowth - 4 : baseGrowth,
      unemployment: Math.max(0, unemployment),
      inflation: Math.max(0, inflation),
      interest_rate: Math.max(0, interest_rate),
      recession,
      quarter,
      year,
      period: `${year}-${quarter}`
    });
  }
  return data;
}

function generateHousingData() {
  const data = [];
  const locations = ['Urban', 'Suburban', 'Rural'];
  
  for (let i = 0; i < 500; i++) {
    const bedrooms = Math.floor(Math.random() * 5) + 1;
    const bathrooms = Math.floor(Math.random() * 3) + 1;
    const sqft = 800 + (bedrooms * 200) + (Math.random() * 1000);
    const age = Math.floor(Math.random() * 50);
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    let basePrice = 150;
    if (location === 'Urban') basePrice = 300;
    else if (location === 'Suburban') basePrice = 200;
    
    const price = basePrice + (bedrooms * 25) + (bathrooms * 15) + (sqft * 0.1) - (age * 2) + (Math.random() * 50);
    
    data.push({
      price: Math.max(50, price),
      bedrooms,
      bathrooms,
      sqft,
      age,
      location
    });
  }
  return data;
}

export const useChartingData = () => {
  const [datasets] = useState(() => 
    Object.values(sampleDatasets).map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      variables: d.variables.length,
      observations: d.observations
    }))
  );

  const getDatasetInfo = (datasetId: string) => {
    const dataset = sampleDatasets[datasetId as keyof typeof sampleDatasets];
    return dataset ? { variables: dataset.variables } : null;
  };

  const getVariableData = (datasetId: string, variables: string[]) => {
    const dataset = sampleDatasets[datasetId as keyof typeof sampleDatasets];
    if (!dataset) return [];

    return dataset.data.map(row => {
      const result: any = {};
      variables.forEach(variable => {
        result[variable] = row[variable as keyof typeof row];
      });
      return result;
    });
  };

  return {
    datasets,
    getDatasetInfo,
    getVariableData,
    currentData: null
  };
};
