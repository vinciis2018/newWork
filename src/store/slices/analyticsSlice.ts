import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ExcelData, ExcelStats, Sheet } from '../../types';

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

interface AnalyticsResponse {
  success: boolean;
  data: { data: ExcelData, stats: ExcelStats, sheets: Sheet[] }
}

interface AnalyticsState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  analytics: AnalyticsResponse | null;
}

const initialState: AnalyticsState = {
  analytics: null,
  status: 'idle',
  error: null,
};


export const getAnalyticsFromExcel = createAsyncThunk<AnalyticsResponse, { id: string, siteId: string }, { rejectValue: string }>(
  'analytics/getAnalyticsFromExcel',
  async ({ id, siteId }, { rejectWithValue }) => {
    try {
      const response = await axios.post<AnalyticsResponse>(`http://127.0.0.1:8000/api/v1/exceldata/analyse-excel-data?id=${id}&site_id=${siteId}`);
      // The response.data will be of type SitesResponse
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        return rejectWithValue(apiError.response.data.message);
      }
      return rejectWithValue(apiError.message || 'Failed to fetch analytics data');
    }
  }
);

export const analyseMonitoringData = createAsyncThunk<AnalyticsResponse, { id: string, siteId: string }, { rejectValue: string }>(
  'analytics/analyseMonitoringData',
  async ({ id, siteId }, { rejectWithValue }) => {
    try {
      console.log(id, siteId)
      const response = await axios.get<AnalyticsResponse>(`http://127.0.0.1:8000/api/v1/metadata/analyse-monitoring-data?id=${id}&site_id=${siteId}`);
      // The response.data will be of type SitesResponse
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.response?.data?.message) {
        return rejectWithValue(apiError.response.data.message);
      }
      return rejectWithValue(apiError.message || 'Failed to fetch analytics data');
    }
  }
);



const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAnalyticsFromExcel.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAnalyticsFromExcel.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(getAnalyticsFromExcel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(analyseMonitoringData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(analyseMonitoringData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload;
      })
      .addCase(analyseMonitoringData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export default analyticsSlice.reducer;
