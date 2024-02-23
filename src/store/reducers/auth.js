import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  user_id: null,
  roles: null
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.email = action.payload.email;
      state.user_id = action.payload.user_id;
      state.roles = action.payload.roles;
    }
  }
});

export default auth.reducer;

export const { setProfile } = auth.actions;
