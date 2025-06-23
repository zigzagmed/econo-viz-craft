
// =============================================================================
// PYTHON BACKEND CONFIGURATION
// =============================================================================
// 
// Configure your Python backend settings here.
// This file centralizes all backend-related configuration.
//
// =============================================================================

// TODO: UPDATE THESE SETTINGS for your Python backend
export const BACKEND_CONFIG = {
  // Base URL of your Python backend (Flask/FastAPI/Django)
  BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // API endpoints (adjust paths according to your Python backend routes)
  ENDPOINTS: {
    DATASETS: '/api/datasets',
    DATASET_INFO: (id: string) => `/api/datasets/${id}/info`,
    DATASET_DATA: (id: string) => `/api/datasets/${id}/data`,
  },
  
  // Authentication settings (if your Python backend requires auth)
  AUTH: {
    // Set to true if your backend requires authentication
    REQUIRED: false,
    // Header name for auth token (e.g., 'Authorization', 'X-API-Key')
    HEADER_NAME: 'Authorization',
    // Token prefix (e.g., 'Bearer ', 'Token ')
    TOKEN_PREFIX: 'Bearer ',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // CORS settings (configure your Python backend to allow these)
  CORS: {
    ALLOWED_ORIGINS: ['http://localhost:5173', 'http://localhost:3000'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-API-Key'],
  }
};

// =============================================================================
// HELPER FUNCTIONS FOR API CALLS
// =============================================================================

// TODO: IMPLEMENT AUTHENTICATION if your Python backend requires it
export const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (BACKEND_CONFIG.AUTH.REQUIRED) {
    // Get token from localStorage, sessionStorage, or your auth system
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers[BACKEND_CONFIG.AUTH.HEADER_NAME] = 
        `${BACKEND_CONFIG.AUTH.TOKEN_PREFIX}${token}`;
    }
  }
  
  return headers;
};

// Generic API call helper with error handling
export const apiCall = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> => {
  const url = `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: getAuthHeaders(),
    ...options,
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
};

// =============================================================================
// EXAMPLE PYTHON BACKEND INTEGRATION FUNCTIONS
// =============================================================================
// 
// Uncomment and use these functions in your useChartingData hook
// to replace the dummy data with real Python backend calls
//
// =============================================================================

/*
// Fetch available datasets from Python backend
export const fetchDatasets = async () => {
  return apiCall(BACKEND_CONFIG.ENDPOINTS.DATASETS);
};

// Fetch dataset metadata (variables, types, etc.)
export const fetchDatasetInfo = async (datasetId: string) => {
  return apiCall(BACKEND_CONFIG.ENDPOINTS.DATASET_INFO(datasetId));
};

// Fetch dataset data for specific variables
export const fetchDatasetData = async (datasetId: string, variables: string[]) => {
  return apiCall(BACKEND_CONFIG.ENDPOINTS.DATASET_DATA(datasetId), {
    method: 'POST',
    body: JSON.stringify({ variables }),
  });
};
*/

// =============================================================================
// EXAMPLE PYTHON BACKEND SETUP (Flask/FastAPI)
// =============================================================================
/*

# EXAMPLE PYTHON FLASK BACKEND CODE:

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/datasets', methods=['GET'])
def get_datasets():
    return jsonify([
        {
            'id': 'my_dataset',
            'name': 'My Dataset',
            'description': 'Description of my dataset',
            'variables': 10,
            'observations': 1000
        }
    ])

@app.route('/api/datasets/<dataset_id>/info', methods=['GET'])
def get_dataset_info(dataset_id):
    # Load your dataset metadata
    df = load_dataset(dataset_id)  # Your function to load data
    
    variables = []
    for col in df.columns:
        var_type = 'continuous' if df[col].dtype in ['int64', 'float64'] else 'categorical'
        variables.append({
            'name': col,
            'type': var_type,
            'description': f'Description for {col}',
            'missing': df[col].isnull().sum()
        })
    
    return jsonify({'variables': variables})

@app.route('/api/datasets/<dataset_id>/data', methods=['POST'])
def get_dataset_data(dataset_id):
    variables = request.json.get('variables', [])
    
    # Load your dataset and filter to requested variables
    df = load_dataset(dataset_id)  # Your function to load data
    filtered_df = df[variables]
    
    return jsonify(filtered_df.to_dict('records'))

if __name__ == '__main__':
    app.run(debug=True, port=8000)

*/
