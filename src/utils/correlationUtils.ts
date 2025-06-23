
export const calculateCorrelation = (x: number[], y: number[]): number => {
  console.log('calculateCorrelation called with:', { xLength: x.length, yLength: y.length });
  
  if (x.length !== y.length || x.length === 0) {
    console.log('Invalid input - length mismatch or empty arrays');
    return 0;
  }

  const n = x.length;
  
  // Filter out null/undefined values and ensure both arrays have same valid indices
  const validIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (x[i] != null && y[i] != null && !isNaN(x[i]) && !isNaN(y[i]) && isFinite(x[i]) && isFinite(y[i])) {
      validIndices.push(i);
    }
  }
  
  console.log('Valid indices count:', validIndices.length);
  
  if (validIndices.length < 2) {
    console.log('Not enough valid data points');
    return 0;
  }
  
  const validX = validIndices.map(i => x[i]);
  const validY = validIndices.map(i => y[i]);
  const validN = validX.length;
  
  console.log('Valid X sample:', validX.slice(0, 5));
  console.log('Valid Y sample:', validY.slice(0, 5));
  
  const meanX = validX.reduce((a, b) => a + b, 0) / validN;
  const meanY = validY.reduce((a, b) => a + b, 0) / validN;
  
  console.log('Means:', { meanX, meanY });
  
  let numerator = 0;
  let sumX2 = 0;
  let sumY2 = 0;
  
  for (let i = 0; i < validN; i++) {
    const deltaX = validX[i] - meanX;
    const deltaY = validY[i] - meanY;
    
    numerator += deltaX * deltaY;
    sumX2 += deltaX * deltaX;
    sumY2 += deltaY * deltaY;
  }
  
  const denominator = Math.sqrt(sumX2 * sumY2);
  
  console.log('Calculation components:', { numerator, sumX2, sumY2, denominator });
  
  if (denominator === 0) {
    console.log('Zero denominator - returning 0');
    return 0;
  }
  
  const correlation = numerator / denominator;
  console.log('Final correlation:', correlation);
  
  return correlation;
};
