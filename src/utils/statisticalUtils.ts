
export const calculateStatistics = (data: any[], variables: string[]) => {
  const stats: Record<string, any> = {};

  variables.forEach(variable => {
    const values = data.map(row => row[variable]).filter(val => val !== null && val !== undefined && !isNaN(val));
    
    if (values.length === 0) {
      stats[variable] = { mean: 0, std: 0, min: 0, max: 0, missing: data.length };
      return;
    }

    const mean = values.reduce((sum, val) => sum + parseFloat(val), 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(parseFloat(val) - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    const min = Math.min(...values.map(val => parseFloat(val)));
    const max = Math.max(...values.map(val => parseFloat(val)));
    const missing = data.length - values.length;

    stats[variable] = { mean, std, min, max, missing, count: values.length };
  });

  return stats;
};

export const calculateCorrelation = (x: number[], y: number[]) => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const calculateRegression = (x: number[], y: number[]) => {
  if (x.length !== y.length || x.length === 0) return { slope: 0, intercept: 0, r2: 0 };

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  const meanY = sumY / n;
  const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  const residualSumSquares = y.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  
  const r2 = 1 - (residualSumSquares / totalSumSquares);

  return { slope, intercept, r2 };
};
