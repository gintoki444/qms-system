import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  station_id: 1,
  station_count: 0,
  station_num: 1
};

const station1 = createSlice({
  name: 'station1',
  initialState,
  reducers: {
    setStation(state, action) {
      state.station_count = action.payload.station_count;
    }
  }
});

export default station1.reducer;

export const { setStation } = station1.actions;
