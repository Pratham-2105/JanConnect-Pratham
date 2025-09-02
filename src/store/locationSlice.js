// store/locationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLocationDetails = createAsyncThunk(
  "location/fetchDetails",
  async ({ latitude, longitude }, thunkAPI) => {
    const GEO_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY
    const resp = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${GEO_API_KEY}&language=en`
    );
    if (!resp.data.results.length) throw new Error("No results from geocoding");
    const components = resp.data.results[0].components || {};
    return {
      latitude,
      longitude,
      district:
        components.state_district ||
        components.county ||
        components.district ||
        "",
      state: components.state || "",
    };
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    latitude: null,
    longitude: null,
    district: "",
    state: "",
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationDetails.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchLocationDetails.fulfilled, (state, action) => {
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.district = action.payload.district;
        state.state = action.payload.state;
        state.loading = false;
        state.error = "";
      })
      .addCase(fetchLocationDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Could not fetch location details";
      });
  },
});

export default locationSlice.reducer;
