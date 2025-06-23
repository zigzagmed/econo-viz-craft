
export const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  
  // Filter out null/undefined values and ensure both arrays have same valid indices
  const validIndices: number[] = [];
  for (let i = 0; i < n; i++) {
    if (x[i] != null && y[i] != null && !isNaN(x[i]) && !isNaN(y[i])) {
      validIndices.push(i);
    }
  }
  
  if (validIndices.length < 2) return 0;
  
  const validX = validIndices.map(i => x[i]);
  const validY = validIndices.map(i => y[i]);
  const validN = validX.length;
  
  const meanX = validX.reduce((a, b) => a + b, 0) / validN;
  const meanY = validY.reduce((a, b) => a + b, 0) / validN;
  
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
  
  return denominator === 0 ? 0 : numerator / denominator;
};
