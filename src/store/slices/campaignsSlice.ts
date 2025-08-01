import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Campaign } from '../../types';

interface AxiosErrorResponse {
  message?: string;
  [key: string]: unknown;
}

interface AxiosErrorWithResponse extends Error {
  response?: {
    data?: AxiosErrorResponse;
  };
}

interface CampaignsState {
  campaigns: Campaign[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  campaign: Campaign | null;
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadError: string | null;
}

const initialState: CampaignsState = {
  campaigns: [],
  status: 'idle',
  error: null,
  campaign: null,
  uploadStatus: 'idle',
  uploadError: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const createCampaign = createAsyncThunk<Campaign, Omit<Campaign, '_id' | 'createdAt' | '__v' | 'monitoring'>, { rejectValue: string }>(
  'campaigns/createCampaign',
  async (campaignData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Campaign>('http://localhost:3333/api/v1/campaigns/create', campaignData);
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
        return rejectWithValue(
          axiosError.response?.data?.message || axiosError.message || 'Failed to create campaign'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

interface CampaignsResponse {
  success: boolean;
  count: number;
  pagination: Record<string, unknown>;
  campaigns: Campaign[];
}

export const getCampaigns = createAsyncThunk<Campaign[], void, { rejectValue: string }>(
  'campaigns/fetchCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<CampaignsResponse>('http://localhost:3333/api/v1/campaigns/all');
      return response.data.campaigns;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
        return rejectWithValue(
          axiosError.response?.data?.message || axiosError.message || 'Failed to fetch campaigns'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);


export const getCampaignDetails = createAsyncThunk<Campaign, string, { rejectValue: string }>(
  'campaigns/getCampaignDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Campaign>>(`http://localhost:3333/api/v1/campaigns/${id}`);
      return response.data.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorWithResponse;
      if (axiosError?.response?.data) {
        const message = axiosError.response.data.message || 'Failed to fetch campaign details';
        return rejectWithValue(typeof message === 'string' ? message : 'Failed to fetch campaign details');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const updateCampaign = createAsyncThunk<Campaign, { id: string; data: Partial<Campaign> }, { rejectValue: string }>(
  'campaigns/updateCampaign',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Campaign>(
        `http://localhost:3333/api/v1/campaigns/update/${id}`,
        data
      );
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as AxiosErrorWithResponse;
      if (axiosError?.response?.data) {
        const message = axiosError.response.data.message || 'Failed to update campaign';
        return rejectWithValue(typeof message === 'string' ? message : 'Failed to update campaign');
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const uploadCampaignLogsExcel = createAsyncThunk<
  { success: boolean; message: string; processedFiles?: number },
  { siteId: string, campaignId: string; files: { fileName: string; url: string }[] },
  { rejectValue: string }
>(
  'campaigns/uploadExcel',
  async ({ siteId, campaignId, files }, { rejectWithValue }) => {
    try {
      console.log('Uploading files:', files);
      const response = await axios.put<ApiResponse<{ success: boolean; message: string; processedFiles?: number }>>(
        `http://localhost:3333/api/v1/campaigns/${campaignId}/${siteId}/upload-excel`,
        {
          siteId,
          campaignId,
          files
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return { 
          success: true, 
          message: (response.data.data as { message?: string })?.message || `${files.length} file(s) uploaded successfully`,
          processedFiles: files.length
        };
      }
      return rejectWithValue((response.data as { message?: string })?.message || 'Failed to upload files');
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
        return rejectWithValue(
          axiosError.response?.data?.message || axiosError.message || 'Failed to upload file'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const uploadCampaignMonitoringMedia = createAsyncThunk<
{ success: boolean; message: string; processedFiles?: number },
{ siteId: string, campaignId: string; monitoringType: string; files: { fileName: string; url: string }[] },
{ rejectValue: string }
>(
  'campaigns/uploadMonitoringMedia',
  async ({ campaignId, siteId, monitoringType, files }, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<{ success: boolean; message: string; processedFiles?: number }>>(
        `http://localhost:3333/api/v1/campaigns/${campaignId}/${siteId}/monitoring-media`,
        {
          siteId,
          campaignId,
          monitoringType,
          files
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosErrorWithResponse;
      return rejectWithValue(err.response?.data?.message || 'Failed to upload media');
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.campaigns.push(action.payload);
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to create campaign';
      })
       // get Campaigns
       .addCase(getCampaigns.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCampaigns.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.campaigns = action.payload;
      })
      .addCase(getCampaigns.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch campaigns';
      })
      
      // Upload Media
      .addCase(uploadCampaignMonitoringMedia.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadCampaignMonitoringMedia.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(uploadCampaignMonitoringMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to upload media';
      })
      .addCase(getCampaignDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCampaignDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.campaign = action.payload;
        state.error = null;
      })
      .addCase(getCampaignDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch campaigns';
      })
      .addCase(uploadCampaignLogsExcel.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(uploadCampaignLogsExcel.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(uploadCampaignLogsExcel.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to upload file';
      })
      
  },
});

export default campaignsSlice.reducer;
