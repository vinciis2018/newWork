import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Site } from '../../types';

interface CreateSitePayload {
  siteName: string;
  siteLocation?: string;
  commonNames?: string[];
  siteImages?: string[];
  siteType?: string;
}

interface SitesState {
  sites: Site[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  site: Site | null;
}

const initialState: SitesState = {
  sites: [],
  status: 'idle',
  error: null,
  site: null,
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface CreateSitePayload {
  siteName: string;
  siteLocation?: string;
  commonNames?: string[];
  siteImages?: string[];
  siteType?: string;
}

export const createSite = createAsyncThunk<Site, CreateSitePayload, { rejectValue: string }>(
  'sites/createSite',
  async (siteData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Site>('http://localhost:3333/api/v1/sites/create', {
        siteName: siteData.siteName,
        siteLocation: siteData.siteLocation || '',
        commonNames: siteData.commonNames || [],
        siteImages: siteData.siteImages || [],
        siteType: siteData.siteType || 'dooh'
      });
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
        return rejectWithValue(
          axiosError.response?.data?.message || axiosError.message || 'Failed to create site'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

interface SitesResponse {
  success: boolean;
  count: number;
  pagination: Record<string, unknown>;
  sites: Site[];
}

export const getAllSites = createAsyncThunk<Site[], void, { rejectValue: string }>(
  'sites/fetchAllSites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<SitesResponse>('http://localhost:3333/api/v1/sites/all');
      return response.data.sites;
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



export const getSiteDetails = createAsyncThunk<Site, string, { rejectValue: string }>(
  'sites/getSiteDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<Site>>(`http://localhost:3333/api/v1/sites/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch campaign details: Invalid response format');
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }, message?: string };
        return rejectWithValue(
          axiosError.response?.data?.message || axiosError.message || 'Failed to fetch campaign details'
        );
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);



const sitesSlice = createSlice({
  name: 'sites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createSite.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createSite.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure campaigns is an array before pushing to it
        state.sites = Array.isArray(state.sites) ? state.sites : [];
        state.sites.push(action.payload);
        state.error = null;
      })
      .addCase(createSite.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to create site';
      })
      .addCase(getAllSites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllSites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sites = action.payload;
      })
      .addCase(getAllSites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getSiteDetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getSiteDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.site = action.payload;
        state.error = null;
      })
      .addCase(getSiteDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch campaigns';
      })
  },
});

export default sitesSlice.reducer;
