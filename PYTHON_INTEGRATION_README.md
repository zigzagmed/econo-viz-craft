# Python Backend Integration Guide

This charting tool is designed to work seamlessly with Python backends (Flask, FastAPI, Django, etc.). Follow this guide to integrate it with your existing Python software.

## Quick Start

1. **Configure Backend Settings**: Update `src/config/backend.ts` with your Python backend URL and endpoints
2. **Replace Dummy Data**: Update `src/hooks/useChartingData.tsx` to use real API calls
3. **Set Up Python Backend**: Implement the required API endpoints in your Python backend

## Required Python Backend Endpoints

### 1. List Datasets
```http
GET /api/datasets
```
**Response:**
```json
[
  {
    "id": "dataset1",
    "name": "Dataset Name",
    "description": "Dataset description",
    "variables": 10,
    "observations": 1000
  }
]
```

### 2. Get Dataset Metadata
```http
GET /api/datasets/{dataset_id}/info
```
**Response:**
```json
{
  "variables": [
    {
      "name": "variable_name",
      "type": "continuous|categorical|binary",
      "description": "Variable description",
      "missing": 5
    }
  ]
}
```

### 3. Get Dataset Data
```http
POST /api/datasets/{dataset_id}/data
```
**Request Body:**
```json
{
  "variables": ["var1", "var2", "var3"]
}
```
**Response:**
```json
[
  {"var1": 1.5, "var2": "category_a", "var3": 0},
  {"var1": 2.1, "var2": "category_b", "var3": 1}
]
```

## Step-by-Step Integration

### Step 1: Update Backend Configuration

Edit `src/config/backend.ts`:
```typescript
export const BACKEND_CONFIG = {
  BASE_URL: 'http://your-python-backend:8000',
  // ... other settings
};
```

### Step 2: Replace Dummy Data Hook

In `src/hooks/useChartingData.tsx`:

1. **Remove** the `sampleDatasets` object and generator functions
2. **Replace** the hook functions with API calls:

```typescript
const getDatasetInfo = async (datasetId: string) => {
  return apiCall(BACKEND_CONFIG.ENDPOINTS.DATASET_INFO(datasetId));
};

const getVariableData = async (datasetId: string, variables: string[]) => {
  return apiCall(BACKEND_CONFIG.ENDPOINTS.DATASET_DATA(datasetId), {
    method: 'POST',
    body: JSON.stringify({ variables }),
  });
};
```

### Step 3: Add Dataset Selection (Optional)

If you have multiple datasets, uncomment the dataset selector in `src/components/ChartingTool.tsx`:

```typescript
const [selectedDataset, setSelectedDataset] = useState<string>('');
// Add DatasetSelector component
```

### Step 4: Implement Python Backend

#### Flask Example:
```python
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    # Return your available datasets
    return jsonify([
        {
            'id': 'my_data',
            'name': 'My Dataset',
            'description': 'Description',
            'variables': len(df.columns),
            'observations': len(df)
        }
    ])

@app.route('/api/datasets/<dataset_id>/info', methods=['GET'])
def get_dataset_info(dataset_id):
    df = load_your_dataset(dataset_id)
    
    variables = []
    for col in df.columns:
        variables.append({
            'name': col,
            'type': detect_variable_type(df[col]),
            'description': f'Description for {col}',
            'missing': df[col].isnull().sum()
        })
    
    return jsonify({'variables': variables})

@app.route('/api/datasets/<dataset_id>/data', methods=['POST'])
def get_dataset_data(dataset_id):
    variables = request.json.get('variables', [])
    df = load_your_dataset(dataset_id)
    
    return jsonify(df[variables].to_dict('records'))
```

#### FastAPI Example:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataRequest(BaseModel):
    variables: List[str]

@app.get("/api/datasets")
def get_datasets():
    # Return your datasets
    pass

@app.get("/api/datasets/{dataset_id}/info")
def get_dataset_info(dataset_id: str):
    # Return dataset metadata
    pass

@app.post("/api/datasets/{dataset_id}/data")
def get_dataset_data(dataset_id: str, request: DataRequest):
    # Return filtered dataset
    pass
```

## Chart Types Supported

- **Scatter plots**: Continuous vs continuous variables
- **Bar charts**: Categorical vs continuous with statistics (sum, average, count, min, max)
- **Line charts**: Time series or continuous data with optional grouping
- **Histograms**: Distribution of continuous variables
- **Box plots**: Distribution summaries with optional grouping
- **Pie charts**: Categorical variable distributions
- **Correlation matrices**: Multiple continuous variables

## Features

- **Interactive charts** with zoom, pan, and hover tooltips
- **Automatic statistics** calculation and display
- **Chart customization** (colors, titles, axes)
- **Export functionality** (PNG, SVG)
- **Responsive design** works on all screen sizes

## Data Requirements

- **Continuous variables**: Numeric data (int, float)
- **Categorical variables**: String/text categories
- **Binary variables**: 0/1 or True/False values
- **Missing data**: Handled automatically (excluded from calculations)

## CORS Configuration

Make sure your Python backend allows CORS requests from your frontend:

```python
# Flask
from flask_cors import CORS
CORS(app, origins=['http://localhost:5173'])

# FastAPI
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"])
```

## Environment Variables

Set these environment variables for production:

```bash
VITE_API_BASE_URL=https://your-production-backend.com
```

## Security Considerations

1. **Authentication**: Implement API authentication if needed
2. **Rate limiting**: Add rate limiting to your Python endpoints
3. **Data validation**: Validate dataset IDs and variable names
4. **CORS**: Configure CORS properly for production
5. **HTTPS**: Use HTTPS in production

## Troubleshooting

1. **CORS errors**: Check your Python backend CORS configuration
2. **Data format issues**: Ensure your data matches the expected JSON format
3. **Missing variables**: Check that variable names match between frontend and backend
4. **Performance**: For large datasets, consider pagination or data filtering

## Files to Modify

When integrating with your Python backend, you'll primarily modify:

1. `src/config/backend.ts` - Backend configuration
2. `src/hooks/useChartingData.tsx` - Data fetching logic
3. `src/components/ChartingTool.tsx` - Dataset selection (if needed)

The rest of the charting functionality will work automatically once the data integration is complete.
